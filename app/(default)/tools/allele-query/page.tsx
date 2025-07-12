'use client';

import React, { useState, useEffect } from 'react';
import { useModelMetadata } from '@/hooks/useModelMetadata';
import { loadReferenceDataForModel } from '@components/reference/utilities';
import { Allele, Segment } from '@components/reference/utilities';
import { logger } from '@components/utils/logger';

interface AlleleResult {
  id: string;
  segment: 'V' | 'D' | 'J';
  chainType: string;
  modelId: string;
  allele: Allele;
}

export default function AlleleQueryPage() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const [selectedModelId, setSelectedModelId] = useState<string>('igh-v1.0');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'iuis' | 'iglabel' | 'asc' | 'sequence'>('iuis');
  const [results, setResults] = useState<AlleleResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [referenceData, setReferenceData] = useState<any>(null);

  const { allModels: availableModels, loading: modelsLoading } = useModelMetadata();

  // Load reference data when model changes
  useEffect(() => {
    const loadReferenceData = async () => {
      if (!selectedModelId) return;
      
      setIsLoading(true);
      try {
        const data = await loadReferenceDataForModel(selectedModelId);
        setReferenceData(data);
        logger.log(`Loaded reference data for model: ${selectedModelId}`);
      } catch (error) {
        logger.error(`Failed to load reference data for model ${selectedModelId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReferenceData();
  }, [selectedModelId]);

  // Search function
  const performSearch = () => {
    if (!searchQuery.trim() || !referenceData) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const modelMetadata = availableModels.find(m => m.id === selectedModelId);
    const chainType = modelMetadata?.chainType || 'heavy';
    
    const segments = referenceData.reference;
    if (!segments) return;
    // Build a flat list of all alleles with their info
    const allAlleles: AlleleResult[] = [];
    const segmentTypes: ('V' | 'D' | 'J')[] = ['V', 'D', 'J'];
    segmentTypes.forEach(segmentType => {
      const segment = segments[segmentType] as Segment;
      if (!segment) return;
      Object.entries(segment).forEach(([alleleId, allele]) => {
        if (!allele) return;
        allAlleles.push({
          id: alleleId,
          segment: segmentType,
          chainType,
          modelId: selectedModelId,
          allele
        });
      });
    });

    // For sequence search, just match by sequence
    if (searchType === 'sequence') {
      const finalResults: AlleleResult[] = [];
      const seen = new Set<string>();
      allAlleles.forEach(result => {
        const value = result.allele.sequence?.toLowerCase() || '';
        if (value.includes(query) && !seen.has(result.id)) {
          finalResults.push(result);
          seen.add(result.id);
        }
      });
      setResults(finalResults);
      return;
    }

    // 1. Find all alleles matching the query in the selected field
    const initialMatches: AlleleResult[] = [];
    allAlleles.forEach(result => {
      let value = '';
      switch (searchType) {
        case 'iuis': value = result.allele.iuis?.toLowerCase() || ''; break;
        case 'iglabel': value = result.allele.iglabel?.toLowerCase() || ''; break;
        case 'asc': value = result.allele.asc?.toLowerCase() || ''; break;
      }
      if (value && value.includes(query)) {
        initialMatches.push(result);
      }
    });

    // 2. Collect all IUIS, IG Label, and ASC values from those matches
    const iuisSet = new Set<string>();
    const iglabelSet = new Set<string>();
    const ascSet = new Set<string>();
    initialMatches.forEach(result => {
      if (result.allele.iuis) iuisSet.add(result.allele.iuis);
      if (result.allele.iglabel) iglabelSet.add(result.allele.iglabel);
      if (result.allele.asc) ascSet.add(result.allele.asc);
    });

    // 3. Find all alleles that have any of those values in any of the three fields
    const finalResults: AlleleResult[] = [];
    const seen = new Set<string>();
    allAlleles.forEach(result => {
      const iuis = result.allele.iuis || '';
      const iglabel = result.allele.iglabel || '';
      const asc = result.allele.asc || '';
      if (
        (iuis && iuisSet.has(iuis)) ||
        (iglabel && iglabelSet.has(iglabel)) ||
        (asc && ascSet.has(asc))
      ) {
        if (!seen.has(result.id)) {
          finalResults.push(result);
          seen.add(result.id);
        }
      }
    });

    setResults(finalResults);
  };

  // Perform search when query or search type changes
  useEffect(() => {
    performSearch();
  }, [searchQuery, searchType, referenceData]);

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

  if (isDevelopment) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" data-aos="fade-up">
              Allele Query Tool
            </h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
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
                disabled={modelsLoading}
              >
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.referenceSet})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Type Selection */}
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
                    onClick={() => setSearchType(type.value as any)}
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

            {/* Loading State */}
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
                  Try adjusting your search query or reference set
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
                      {/* Only show the internal ID if it is not the same as ASC or IG label */}
                      {/* {result.id && result.id !== result.allele.asc && result.id !== result.allele.iglabel && (
                        <div className="text-sm text-gray-500 font-mono">
                          {result.id}
                        </div>
                      )} */}
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
                          <div className="text-xs text-gray-500 mb-1">Length: {result.allele.sequence?.length || 0} bp</div>
                          <div className="text-sm text-green-600 dark:text-green-400 font-mono break-all">
                            {result.allele.sequence || 'No sequence available'}
                          </div>
                        </div>
                        {result.allele.anchor && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Anchor:</span>
                            <span className="text-sm text-gray-900 dark:text-white ml-1">{result.allele.anchor}</span>
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
                  Enter a search query above to find alleles
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
} 