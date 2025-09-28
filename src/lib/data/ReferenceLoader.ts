// ReferenceLoader.ts

/** Segments we support at runtime */
export type SegmentKey = "V" | "D" | "J";

/** Legacy per-allele entry */
export type AlleleEntry = {
  sequence: string;
  sequence_gapped: string;
  asc?: string;
  iuis?: string;
  iglabel?: string;
  anchor?: number;
};

/** Legacy input shape per segment */
export type SegmentMap   = Record<string, AlleleEntry>;
export type ReferenceJson = Partial<Record<SegmentKey, SegmentMap>>;

/** Derived maps */
export type SequencesMap = Record<string, string>;
export type SequencesGappedMap = Record<string, string>;
export type LabelProps   = Record<string, { asc?: string; iuis?: string; iglabel?: string; anchor?: number }>;

export type ReferenceBundle = {
  names:  Record<SegmentKey, string[]>;
  seqs:   Partial<Record<SegmentKey, SequencesMap>>;
  seqs_gapped: Partial<Record<SegmentKey, SequencesGappedMap>>;
  labels: Partial<Record<SegmentKey, LabelProps>>;
};

/** Internal, ordered block representation for one chain */
type OrderedSegment = { names: string[]; seqs: SequencesMap; seqs_gapped: SequencesGappedMap; labels: LabelProps };
type ChainBlock = Partial<Record<SegmentKey, OrderedSegment>>;

const SEGMENTS: SegmentKey[] = ["V", "D", "J"];

/** Sort within a single chain block only. */
const sortAlleleNames = (keys: string[]): string[] =>
  keys.sort((a, b) => a.localeCompare(b, "en", { numeric: false }));

/** Detect if payload is legacy shape that contains { reference: {...} } */
function asLegacyRef(payload: any): ReferenceJson | null {
  if (payload && typeof payload === "object" && payload.reference && typeof payload.reference === "object") {
    return payload.reference as ReferenceJson;
  }
  if (payload && (payload.V || payload.D || payload.J)) {
    // already the inner legacy object
    return payload as ReferenceJson;
  }
  return null;
}

/** Detect if payload looks like new DataConfig JSON with segments */
function asDataConfig(payload: any): any | null {
  if (payload && typeof payload === "object" && payload.segments && typeof payload.segments === "object") {
    return payload;
  }
  return null;
}

/** Build one ordered segment from legacy map. Sort only inside this block. */
function buildOrderedFromLegacy(seg?: SegmentMap): OrderedSegment {
  const names = seg ? sortAlleleNames(Object.keys(seg)) : [];
  const seqs: SequencesMap = {};
  const seqs_gapped: SequencesGappedMap = {};
  const labels: LabelProps = {};
  for (const k of names) {
    const v = seg![k];
    seqs[k]   = v.sequence;
    seqs_gapped[k] = v.sequence_gapped;
    labels[k] = { asc: v.asc, iuis: v.iuis, iglabel: v.iglabel, anchor: v.anchor };
  }
  return { names, seqs, seqs_gapped, labels };
}

/** Build one ordered segment from DataConfig JSON. Respect the provided index order. No sorting. */
function buildOrderedFromDataConfig(segJson: any): OrderedSegment {
  // segJson like: { index: string[], alleles?: { name: { sequence, asc, ... } } }
  const index: string[] = Array.isArray(segJson?.index) ? segJson.index.slice() : [];
  const alleles = segJson?.alleles || {};
  const seqs: SequencesMap = {};
  const seqs_gapped: SequencesGappedMap = {};
  const labels: LabelProps = {};
  for (const name of index) {
    const d = alleles[name] || {};
    seqs[name] = d.sequence ?? "";
    seqs_gapped[name] = d.sequence_gapped ?? "";
    labels[name] = { asc: d.asc, iuis: d.iuis, iglabel: d.iglabel, anchor: d.anchor };
  }
  return { names: index, seqs, seqs_gapped, labels };
}

/** Normalize any payload (legacy or dataconfig) to a chain block with ordered segments. */
function normalizeToChainBlock(payload: any): ChainBlock {
  const legacy = asLegacyRef(payload);
  if (legacy) {
    const V = buildOrderedFromLegacy(legacy.V);
    const D = buildOrderedFromLegacy(legacy.D);
    const J = buildOrderedFromLegacy(legacy.J);
    return {
      ...(V.names.length ? { V } : {}),
      ...(D.names.length ? { D } : {}),
      ...(J.names.length ? { J } : {}),
    };
  }
  const dc = asDataConfig(payload);
  if (dc) {
    const segs = dc.segments || {};
    const V = segs.V ? buildOrderedFromDataConfig(segs.V) : undefined;
    const D = segs.D ? buildOrderedFromDataConfig(segs.D) : undefined;
    const J = segs.J ? buildOrderedFromDataConfig(segs.J) : undefined;
    const out: ChainBlock = {};
    if (V && V.names.length) out.V = V;
    if (D && D.names.length) out.D = D;
    if (J && J.names.length) out.J = J;
    return out;
  }
  // Unknown payload. Return empty.
  return {};
}

/** Concatenate chain blocks in the provided order. Never global-sort. */
function mergeBlocks(blocks: ChainBlock[]): ReferenceBundle {
  const names: Record<SegmentKey, string[]> = { V: [], D: [], J: [] };
  const seqs:  Partial<Record<SegmentKey, SequencesMap>> = { V: {}, D: {}, J: {} };
  const seqs_gapped: Partial<Record<SegmentKey, SequencesGappedMap>> = { V: {}, D: {}, J: {} };
  const labels: Partial<Record<SegmentKey, LabelProps>>   = { V: {}, D: {}, J: {} };

  for (const seg of SEGMENTS) {
    const allNames: string[] = [];
    const segSeqs: SequencesMap = {};
    const segSeqs_gapped: SequencesGappedMap = {};
    const segLabels: LabelProps = {};

    for (const block of blocks) {
      const s = block[seg];
      if (!s) continue;
      // Append this chain's ordered names as a block
      for (const name of s.names) {
        allNames.push(name);
        segSeqs[name] = s.seqs[name];
        segSeqs_gapped[name] = s.seqs_gapped[name];
        segLabels[name] = s.labels[name];
      }
    }

    names[seg] = allNames;
    if (allNames.length) {
      seqs[seg] = segSeqs;
      seqs_gapped[seg] = segSeqs_gapped;
      labels[seg] = segLabels;
    }
  }

  return { names, seqs, seqs_gapped, labels };
}

export function buildReferenceBundle(ref: ReferenceJson): ReferenceBundle {
  // Kept for backward compatibility with single-chain inputs.
  const V = buildOrderedFromLegacy(ref.V);
  const D = buildOrderedFromLegacy(ref.D);
  const J = buildOrderedFromLegacy(ref.J);
  return {
    names:  { V: V.names, D: D.names, J: J.names },
    seqs:   { V: V.seqs,  D: D.seqs,  J: J.seqs  },
    seqs_gapped: { V: V.seqs_gapped, D: D.seqs_gapped, J: J.seqs_gapped },
    labels: { V: V.labels, D: D.labels, J: J.labels },
  };
}

/** New: multi-input bundle builder that preserves chain groupings. */
export function buildReferenceBundleMulti(payloads: any[]): ReferenceBundle {
  const blocks = payloads.map(normalizeToChainBlock);
  return mergeBlocks(blocks);
}

export class ReferenceLoader {
  private bundle?: ReferenceBundle;

  constructor(private readonly data: any | any[]) {}

  /** Build once from the provided data. Accepts one or many payloads. */
  public async load(): Promise<void> {
    if (this.bundle) return;

    if (Array.isArray(this.data)) {
      // Multi-chain path. Keep input order as chain order.
      this.bundle = buildReferenceBundleMulti(this.data);
    } else {
      // Single payload. Try to normalize and still go through the same code path.
      const block = normalizeToChainBlock(this.data);
      this.bundle = mergeBlocks([block]);
    }
  }

  private ensure(): ReferenceBundle {
    if (!this.bundle) throw new Error("ReferenceLoader not loaded. Call load() first.");
    return this.bundle;
  }

  public getBundle(): ReferenceBundle { return this.ensure(); }
  public addShortD = (seg?: Record<string, string>): Record<string, string> | undefined => seg ? { ...seg, 'Short-D': '' } : seg;
  public getNames(seg: SegmentKey): string[] { return this.ensure().names[seg] || []; }
  public getSeqs(seg: SegmentKey): SequencesMap | undefined { return this.ensure().seqs[seg]; }
  public getSeqsGapped(seg: SegmentKey): SequencesGappedMap | undefined { return this.ensure().seqs_gapped[seg]; }
  public getLabels(seg: SegmentKey): LabelProps | undefined { return this.ensure().labels[seg]; }

  /** Sequence by allele NAME key */
  public getAllele(seg: SegmentKey, name: string): string | undefined { return this.getSeqs(seg)?.[name]; }
  public getAlleleGapped(seg: SegmentKey, name: string): string | undefined { return this.getSeqsGapped(seg)?.[name]; }   
  /** Anchor by allele NAME key */
  public getAlleleAnchor(seg: SegmentKey, name: string): number | undefined { return this.getLabels(seg)?.[name]?.anchor; }

  public findAlleleNameByLabel(
    seg: SegmentKey,
    value: string,
    kind: "name" | "asc" | "iuis" | "iglabel" = "name"
  ): string | undefined {
    const seqs = this.getSeqs(seg) || {};
    const props = this.getLabels(seg) || {};
    if (kind === "name") return value in seqs ? value : undefined;
    for (const [alleleName, p] of Object.entries(props)) {
      if ((p as any)[kind] === value) return alleleName;
    }
    return undefined;
  }

  public findAlleleNamesByLabelAll(
    seg: SegmentKey,
    value: string,
    kind: "name" | "asc" | "iuis" | "iglabel" = "name"
  ): string[] {
    const seqs = this.getSeqs(seg) || {};
    const props = this.getLabels(seg) || {};
    if (kind === "name") return value in seqs ? [value] : [];
    const out: string[] = [];
    for (const [alleleName, p] of Object.entries(props)) {
      if ((p as any)[kind] === value) out.push(alleleName);
    }
    return out;
  }

  public getSequenceByLabel(
    seg: SegmentKey,
    value: string,
    kind: "name" | "asc" | "iuis" | "iglabel" = "iuis"
  ): string | undefined {
    const alleleName = this.findAlleleNameByLabel(seg, value, kind);
    return alleleName ? this.getSeqs(seg)?.[alleleName] : undefined;
  }

  public getSequencesByLabelAll(
    seg: SegmentKey,
    value: string,
    kind: "name" | "asc" | "iuis" | "iglabel" = "iuis"
  ): Array<{ name: string; sequence: string }> {
    const names = this.findAlleleNamesByLabelAll(seg, value, kind);
    const seqs = this.getSeqs(seg) || {};
    return names
      .map(n => ({ name: n, sequence: seqs[n] }))
      .filter(x => !!x.sequence);
  }

  public getAnchorByLabel(
    seg: SegmentKey,
    value: string,
    kind: "name" | "asc" | "iuis" | "iglabel" = "iuis"
  ): number | undefined {
    const name = this.findAlleleNameByLabel(seg, value, kind);
    return name ? this.getLabels(seg)?.[name]?.anchor : undefined;
  }

  public getAnchorsByLabelAll(
    seg: SegmentKey,
    value: string,
    kind: "name" | "asc" | "iuis" | "iglabel" = "iuis"
  ): Array<{ name: string; anchor: number }> {
    const names = this.findAlleleNamesByLabelAll(seg, value, kind);
    const props = this.getLabels(seg) || {};
    const out: Array<{ name: string; anchor: number }> = [];
    for (const n of names) {
      const a = props[n]?.anchor;
      if (typeof a === "number") out.push({ name: n, anchor: a });
    }
    return out;
  }

  public getMatcherMap(seg: SegmentKey): Record<string, { name: string; sequence: string }> {
    const seqs = this.getSeqs(seg) || {};
    const out: Record<string, { name: string; sequence: string }> = {};
    for (const [name, sequence] of Object.entries(seqs)) out[name] = { name, sequence };
    return out;
  }

  public translateCalls(
    calls: string[][] | null,
    seg: SegmentKey,
    to: "iuis" | "iglabel" | "asc" | "name" = "iuis",
    from: "name" | "asc" = "name"
  ): string[][] | null {
    if (!calls) return null;
    const props = this.getLabels(seg) || {};
    const seqs  = this.getSeqs(seg) || {};

    const ascOf = (name: string) => props[name]?.asc;
    const labelOf = (name: string) =>
      to === "name" ? name :
      to === "asc"  ? (ascOf(name) ?? name) :
      to === "iuis" ? (props[name]?.iuis ?? name) :
                      (props[name]?.iglabel ?? name);

    const nameFromToken = (token: string): string | undefined => {
      if (from === "name") return token in seqs ? token : undefined;
      for (const [n, p] of Object.entries(props)) {
        if (p.asc === token) return n;
      }
      return undefined;
    };

    return calls.map(group =>
      group.map(token => {
        const asName = nameFromToken(token);
        return asName ? labelOf(asName) : token;
      })
    );
  }

  public getLegacyReferenceMap(): Partial<Record<SegmentKey, Record<string, { name: string; sequence: string; asc?: string; iuis?: string; iglabel?: string; anchor?: number }>>> {
    const b = this.ensure();
    const mk = (seg: SegmentKey) => {
      const names = b.names[seg] || [];
      const seqs  = b.seqs[seg]  || {};
      const props = b.labels[seg] || {};
      const out: Record<string, { name: string; sequence: string; asc?: string; iuis?: string; iglabel?: string; anchor?: number }> = {};
      for (const k of names) out[k] = { name: k, sequence: seqs[k], ...props[k] };
      return out;
    };
    return {
      V: b.names.V.length ? mk("V") : undefined,
      D: b.names.D.length ? mk("D") : undefined,
      J: b.names.J.length ? mk("J") : undefined
    };
  }
}
