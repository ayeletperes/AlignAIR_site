
export type ParsedRecord = { id: string; sequence: string };

export type ParseReport = {
  records: ParsedRecord[];
  errors: string[];
  warnings: string[];
};

export const ALLOWED = /^[ACGTN]+$/i;

export function normalizeSeqLine(s: string): string {
  // Remove whitespace only. Preserve letters for strict validation.
  return s.replace(/\s+/g, "");
}

export function isFastaText(lines: string[]): boolean {
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    return line.startsWith(">");
  }
  return false;
}

export function toFasta(records: string[]): string {
  return records.map((s, i) => `>Seq_${i + 1}\n${s}`).join("\n");
}

/** Parse plain DNA, FASTA, or multi-FASTA. Validates A, C, G, T, N. */
export function parseInput(text: string): ParseReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const records: ParsedRecord[] = [];

  const raw = (text || "").replace(/\r/g, "");
  const lines = raw.split("\n");

  if (isFastaText(lines)) {
    let currentId: string | null = null;
    let currentSeqParts: string[] = [];
    const seen = new Set<string>();
    let autoIdx = 1;

    const push = () => {
      if (currentId === null) return;
      const seq = normalizeSeqLine(currentSeqParts.join(""));
      if (!seq) {
        errors.push(`Record "${currentId}" has no sequence lines.`);
      } else if (!ALLOWED.test(seq)) {
        const bad = seq.toUpperCase().replace(/[ACGTN]/g, "");
        const sample = [...new Set(bad.split(""))].slice(0, 10).join(", ");
        errors.push(`Record "${currentId}" contains invalid characters: ${sample}. Only A, C, G, T, or N are allowed.`);
      } else {
        records.push({ id: currentId, sequence: seq.toUpperCase() });
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith(">")) {
        if (currentId !== null) push();
        let id = line.slice(1).trim();
        if (!id) {
          id = `Seq_${autoIdx++}`;
          warnings.push(`Found a header with no name. Assigned "${id}".`);
        }
        if (seen.has(id)) {
          const base = id;
          let k = 2;
          while (seen.has(`${base}_${k}`)) k++;
          id = `${base}_${k}`;
          warnings.push(`Duplicate header "${base}" found. Renamed to "${id}".`);
        }
        seen.add(id);
        currentId = id;
        currentSeqParts = [];
      } else {
        currentSeqParts.push(line);
      }
    }
    if (currentId !== null) push();

    if (records.length === 0 && errors.length === 0) {
      errors.push("No valid FASTA records were found.");
    }
  } else {
    const seq = normalizeSeqLine(raw);
    if (!seq) {
      errors.push("Sequence is empty.");
    } else if (!ALLOWED.test(seq)) {
      const bad = seq.toUpperCase().replace(/[ACGTN]/g, "");
      const sample = [...new Set(bad.split(""))].slice(0, 10).join(", ");
      errors.push(`Sequence contains invalid characters: ${sample}. Only A, C, G, T, or N are allowed.`);
    } else {
      records.push({ id: "Seq_1", sequence: seq.toUpperCase() });
    }
  }

  return { records, errors, warnings };
}