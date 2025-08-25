import React, { useState, useEffect, useMemo } from 'react';
import { ReferenceLoader, type SegmentKey } from '@/lib/data/ReferenceLoader';
import { logger } from '@/utils/logger';
import { AVAILABLE_MODELS } from '@/lib/model/modelMetadataLoader';

type SearchKind = 'iuis' | 'iglabel' | 'asc' | 'sequence';

interface AlleleLite {
  name: string;
  sequence: string;
  iuis?: string;
  iglabel?: string;
  asc?: string;
  anchor?: number;
}

interface AlleleResult {
  id: string;                       // allele name
  segment: SegmentKey;              // 'V' | 'D' | 'J'
  chainType: string;
  modelId: string;
  allele: AlleleLite;
}

const SEGMENTS: SegmentKey[] = ['V', 'D', 'J'];

function normalizeSeq(s = ''): string {
  return s.toUpperCase().replace(/[\s\-.]/g, '');
}

export default function AlleleQueryPage() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const [selectedModelId, setSelectedModelId] = useState<string>(
    AVAILABLE_MODELS[0]?.id || 'igh-v1.0'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchKind>('iuis');
  const [results, setResults] = useState<AlleleResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refLoader, setRefLoader] = useState<ReferenceLoader | null>(null);

  // Load reference data when the model changes
  useEffect(() => {
    const loadReferenceData = async () => {
      const model = AVAILABLE_MODELS.find(m => m.id === selectedModelId);
      
      if (!model) return;

      setIsLoading(true);
      try {
        const toPaths = (rp: unknown): string[] => {
          if (Array.isArray(rp)) return rp as string[];
          if (typeof rp === 'string') {
            return rp.split(',').map(s => s.trim()).filter(Boolean);
          }
          throw new Error('referencePath must be a string or string[]');
        };

        const paths = toPaths(model.referencePath);
        const payloads: any[] = [];
        for (const path of paths) {
          const res = await fetch(path);
          if (!res?.ok) throw new Error(`Failed to fetch reference: ${path}`);
          payloads.push(await res.json());
        }

        const loader = new ReferenceLoader(payloads);
        await loader.load();
        setRefLoader(loader);
        logger.info(`Loaded reference data for model: ${selectedModelId}`);
      } catch (error) {
        logger.error(`Failed to load reference data for model ${selectedModelId}:`, error);
        setRefLoader(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadReferenceData();
  }, [selectedModelId, AVAILABLE_MODELS]);

  // Flatten all alleles once per loader change for faster searches
  const allAlleles = useMemo<AlleleResult[]>(() => {
    if (!refLoader) return [];
    const modelMeta = AVAILABLE_MODELS.find(m => m.id === selectedModelId);
    const chainType = modelMeta?.chainType || 'heavy';

    const out: AlleleResult[] = [];
    for (const seg of SEGMENTS) {
      const seqs = refLoader.getSeqs(seg) || {};
      const labels = refLoader.getLabels(seg) || {};
      for (const name of Object.keys(seqs)) {
        const p = labels[name] || {};
        out.push({
          id: name,
          segment: seg,
          chainType,
          modelId: selectedModelId,
          allele: {
            name,
            sequence: seqs[name],
            iuis: p.iuis,
            iglabel: p.iglabel,
            asc: p.asc,
            anchor: p.anchor,
          },
        });
      }
    }
    return out;
  }, [refLoader, AVAILABLE_MODELS, selectedModelId]);

  // Search
  useEffect(() => {
    if (!refLoader) {
      setResults([]);
      return;
    }
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      return;
    }

    const queryLower = q.toLowerCase();

    // Sequence search: substring on normalized sequence
    if (searchType === 'sequence') {
      const normQ = normalizeSeq(q);
      const seen = new Set<string>();
      const finalRes: AlleleResult[] = [];
      for (const r of allAlleles) {
        const s = normalizeSeq(r.allele.sequence);
        if (s.includes(normQ) && !seen.has(r.id)) {
          finalRes.push(r);
          seen.add(r.id);
        }
      }
      setResults(finalRes);
      return;
    }

    // Label search: find initial matches by substring on the chosen label
    const initial: AlleleResult[] = [];
    for (const r of allAlleles) {
      const val =
        searchType === 'iuis' ? (r.allele.iuis || '') :
        searchType === 'iglabel' ? (r.allele.iglabel || '') :
        (r.allele.asc || '');
      if (val && val.toLowerCase().includes(queryLower)) {
        initial.push(r);
      }
    }

    if (initial.length === 0) {
      setResults([]);
      return;
    }

    // Collect all exact label values from the initial set
    const iuisSet = new Set<string>();
    const iglabelSet = new Set<string>();
    const ascSet = new Set<string>();
    for (const r of initial) {
      if (r.allele.iuis) iuisSet.add(r.allele.iuis);
      if (r.allele.iglabel) iglabelSet.add(r.allele.iglabel);
      if (r.allele.asc) ascSet.add(r.allele.asc);
    }

    // Final set: any allele sharing any of those exact values
    const seen = new Set<string>();
    const finalRes: AlleleResult[] = [];
    for (const r of allAlleles) {
      const { iuis, iglabel, asc } = r.allele;
      const linked =
        (iuis && iuisSet.has(iuis)) ||
        (iglabel && iglabelSet.has(iglabel)) ||
        (asc && ascSet.has(asc));
      if (linked && !seen.has(r.id)) {
        finalRes.push(r);
        seen.add(r.id);
      }
    }

    setResults(finalRes);
  }, [searchQuery, searchType, refLoader, allAlleles]);

  const getChainDisplayName = (chainType: string) => {
    switch (chainType) {
      case 'heavy': return 'Heavy Chain';
      case 'light': return 'Light Chain';
      case 'trb': return 'TCR Beta';
      default: return chainType;
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'V': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'D': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'J': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Hero */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to gray-300 bg-clip-text text-transparent">
              Allele Query Tool
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Search and explore allele information across different naming conventions and reference sets.
            </p>
          </div>
        </div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search Alleles</h2>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reference Set
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.referenceSet})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search By
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'iuis', label: 'IUIS Name', description: 'International Union of Immunological Societies' },
                  { value: 'iglabel', label: 'IG Label', description: 'Immunoglobulin label' },
                  { value: 'asc', label: 'ASC', description: 'Alternative sequence classification' },
                  { value: 'sequence', label: 'Sequence', description: 'Nucleotide sequence' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSearchType(type.value as SearchKind)}
                    className={`p-4 rounded-lg border transition-all ${
                      searchType === type.value
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs opacity-75">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Query
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Enter ${searchType.toUpperCase()} to search...`}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-400">Loading reference data...</span>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {results.length === 0 && searchQuery.trim() && !isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No results found</div>
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  Try adjusting your search query or reference set.
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={`${result.id}-${index}`} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSegmentColor(result.segment)}`}>
                          {result.segment}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {getChainDisplayName(result.chainType)}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Names</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-gray-500">IUIS:</span>
                            <div className="text-sm text-gray-900 dark:text-white font-mono">
                              {result.allele.iuis || <span className="text-gray-400 italic">N/A</span>}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">IG Label:</span>
                            <div className="text-sm text-gray-900 dark:text-white font-mono">
                              {result.allele.iglabel || <span className="text-gray-400 italic">N/A</span>}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">ASC:</span>
                            <div className="text-sm text-gray-900 dark:text-white font-mono">
                              {result.allele.asc || <span className="text-gray-400 italic">N/A</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sequence</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                          <div className="text-xs text-gray-500 mb-1">
                            Length: {result.allele.sequence?.length || 0} bp
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400 font-mono break-all">
                            {result.allele.sequence || 'No sequence available'}
                          </div>
                        </div>
                        {result.allele.anchor !== undefined && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Anchor:</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-1">
                              {result.allele.anchor}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">Ready to search</div>
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  Enter a search query above to find alleles.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
