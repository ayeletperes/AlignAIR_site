'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useModelMetadata } from '@/hooks/useModelMetadata';
import { ModelMetadata } from '@components/model/modelMetadataLoader';
import { logger } from '@components/utils/logger';

interface ModelSelectorProps {
  selectedChain: string;
  setSelectedChain: (chain: string) => void;
  selectedModelId?: string;
  setSelectedModelId?: (modelId: string) => void;
  onModelChange?: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedChain, 
  setSelectedChain, 
  selectedModelId,
  setSelectedModelId,
  onModelChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load all models
  const { allModels: availableModels, loading, error } = useModelMetadata();
  
  // Find the selected model
  const selectedModel = selectedModelId 
    ? availableModels.find(m => m.id === selectedModelId) 
    : availableModels.find(m => m.chainType === selectedChain) || availableModels[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (model: ModelMetadata) => {
    setSelectedChain(model.chainType);
    if (setSelectedModelId) {
      setSelectedModelId(model.id);
    }
    setIsOpen(false);
    logger.log(`Selected model: ${model.name} (${model.id})`);
    
    // Reset results when model changes
    if (onModelChange) {
      onModelChange();
    }
  };

  const getChainDisplayName = (chainType: string) => {
    switch (chainType) {
      case 'heavy': return 'Heavy Chain';
      case 'light': return 'Light Chain';
      case 'trb': return 'TCR Beta';
      default: return chainType;
    }
  };

  const getChainIcon = (chainType: string) => {
    switch (chainType) {
      case 'heavy': return '🔵';
      case 'light': return '🟢';
      case 'trb': return '🟣';
      default: return '⚪';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-base font-medium text-gray-900 dark:text-white">
            Select Model
          </label>
        </div>
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-base font-medium text-gray-900 dark:text-white">
            Select Model
          </label>
        </div>
        <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Error loading models: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-base font-medium text-gray-900 dark:text-white">
          Select Model
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onMouseEnter={() => setShowTooltip('info')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          {selectedModel?.documentationUrl && (
            <a
              href={selectedModel.documentationUrl}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="View model documentation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip === 'info' && (
        <div className="absolute z-50 bg-gray-900 text-white text-sm rounded-lg p-3 max-w-sm shadow-lg">
          <div className="space-y-2">
            <p><strong>Model Selection:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Choose the appropriate model for your sequence type</li>
              <li>Each model is optimized for specific chain types</li>
              <li>Hover over models for detailed information</li>
              <li>Click the documentation link for more details</li>
            </ul>
          </div>
        </div>
      )}

      {/* Model Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getChainIcon(selectedChain)}</span>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {selectedModel?.name || getChainDisplayName(selectedChain)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedModel?.version || 'Default'} • {selectedModel?.species || 'Human'}
              </div>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {/* Chain Type Groups */}
            {['heavy', 'light', 'trb'].map((chainType) => {
              const modelsForChain = availableModels.filter(m => m.chainType === chainType);
              if (modelsForChain.length === 0) return null;

              return (
                <div key={chainType} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getChainIcon(chainType)}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getChainDisplayName(chainType)}
                      </span>
                    </div>
                  </div>
                  
                  {modelsForChain.map((model) => (
                    <div
                      key={model.id}
                      className="relative"
                      onMouseEnter={() => setShowTooltip(model.id)}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <button
                        type="button"
                        onClick={() => handleModelSelect(model)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedModel?.id === model.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {model.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {model.version} • {model.species} • {model.referenceSet}
                            </div>
                          </div>
                          {selectedModel?.id === model.id && (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>

                      {/* Model Details Tooltip */}
                      {showTooltip === model.id && (
                        <div className="absolute left-full ml-2 top-0 z-50 bg-gray-900 text-white text-sm rounded-lg p-4 max-w-xs shadow-lg">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-blue-300">{model.name}</h4>
                              <p className="text-gray-300 text-xs">{model.description}</p>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Chain Type:</span>
                                <span className="text-white">{model.chainType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Species:</span>
                                <span className="text-white">{model.species}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Reference:</span>
                                <span className="text-white">{model.referenceSet}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Updated:</span>
                                <span className="text-white">{model.lastUpdated}</span>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-blue-300 mb-1">Features:</h5>
                              <ul className="text-xs text-gray-300 space-y-1">
                                {model.features.map((feature, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="text-green-400 mr-2">•</span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {model.documentationUrl && (
                              <a
                                href={model.documentationUrl}
                                className="inline-flex items-center text-blue-400 hover:text-blue-300 text-xs"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Documentation
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSelector; 