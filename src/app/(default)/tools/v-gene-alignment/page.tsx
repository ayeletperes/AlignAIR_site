// app/tools/v-gene-alignment/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AVAILABLE_MODELS } from '@/lib/model/modelMetadataLoader';
import { ReferenceLoader } from '@/lib/data/ReferenceLoader';
import { logger } from '@/utils/logger';
import { VGenePairAligned } from '@/components/results/alignment/VGeneAlignment';

function alleleToGene(name: string): string {
  const i = name.indexOf('*');
  return i >= 0 ? name.slice(0, i) : name;
}

export default function VGeneAlignmentPage() {
  const [modelId, setModelId] = useState<string>(AVAILABLE_MODELS[0]?.id ?? '');
  const [refLoader, setRefLoader] = useState<ReferenceLoader | null>(null);
  const [selectedGene, setSelectedGene] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // load references for selected model
  useEffect(() => {
    const load = async () => {
      const model = AVAILABLE_MODELS.find(m => m.id === modelId);
      if (!model) return;
      setLoading(true);
      try {
        const paths = Array.isArray(model.referencePath)
          ? model.referencePath
          : String(model.referencePath).split(',').map(s => s.trim()).filter(Boolean);

        const payloads: any[] = [];
        for (const p of paths) {
          const res = await fetch(p);
          if (!res.ok) throw new Error(`Failed to fetch ${p}`);
          payloads.push(await res.json());
        }
        const loader = new ReferenceLoader(payloads);
        await loader.load();
        setRefLoader(loader);
      } catch (e) {
        logger.error(e);
        setRefLoader(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [modelId]);

  // derive available V genes from loader
  const vGenes = useMemo<string[]>(() => {
    if (!refLoader) return [];
    const names = refLoader.getNames('V') || [];
    const set = new Set<string>();
    for (const n of names) set.add(alleleToGene(n));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  }, [refLoader]);

  // default selection
  useEffect(() => {
    if (!selectedGene && vGenes.length > 0) {
      setSelectedGene(vGenes[0]);
    }
  }, [vGenes, selectedGene]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <div className="pt-24 pb-8">
        <h1 className="text-3xl font-bold">V-gene Allele Alignment</h1>
        <p className="text-gray-500">Pick a model and a V gene to view all its alleles aligned in gapped space.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Reference set</label>
            <select
              value={modelId}
              onChange={(e) => { setModelId(e.target.value); setSelectedGene(null); }}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.referenceSet})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">V gene</label>
            <select
              value={selectedGene ?? ''}
              onChange={(e) => setSelectedGene(e.target.value || null)}
              disabled={!refLoader || loading}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              {vGenes.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        {!refLoader && !loading && <div className="text-sm text-gray-500">Select a reference set to begin.</div>}
        {loading && <div className="text-sm text-gray-500">Loading references…</div>}
        {refLoader && selectedGene && (
            <VGenePairAligned refLoader={refLoader} gene={selectedGene} wrap={60} />

        )}
      </div>
    </section>
  );
}
