'use client';

import React, { useState, useEffect } from 'react';
import { AVAILABLE_MODELS, getModelById } from '@/lib/model/modelConfig';

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

  // Filter models based on selected chain type
  const availableModels = AVAILABLE_MODELS.filter(model => model.chainType === selectedChain);
  
  // Find the selected model
  const selectedModel = selectedModelId 
    ? getModelById(selectedModelId) 
    : availableModels[0];

  // Auto-select the first available model when chain changes
  useEffect(() => {
    if (availableModels.length > 0) {
      const firstModel = availableModels[0];
      // Only update if the current selectedModelId doesn't match the chain or if no model is selected
      if (!selectedModelId || (selectedModel && selectedModel.chainType !== selectedChain)) {
        if (setSelectedModelId) {
          setSelectedModelId(firstModel.id);
        }
        if (onModelChange) {
          onModelChange();
        }
      }
    }
  }, [selectedChain, availableModels, selectedModelId, selectedModel, setSelectedModelId, onModelChange]);

  const handleChainSelect = (newChain: string) => {
    setSelectedChain(newChain);
    setIsOpen(false);
  };

  const handleModelSelect = (modelId: string) => {
    if (setSelectedModelId) {
      setSelectedModelId(modelId);
    }
    setIsOpen(false);
    
    // Reset results when model changes
    if (onModelChange) {
      onModelChange();
    }
  };

  const getChainDisplayName = (chainType: string) => {
    switch (chainType) {
      case 'heavy': return 'Heavy Chain';
      case 'light': return 'Light Chain';
      case 'trb': return 'T-Cell Receptor Beta';
      default: return chainType;
    }
  };

  return (
    <div className="mb-6">
      <div className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
        Chain Type & Model Selection
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        {/* Chain Type Selection */}
        <div className="relative z-0 w-full mb-5 group">
          <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Chain Type
          </span>
          <select
            id="chain-select"
            value={selectedChain}
            onChange={(e) => handleChainSelect(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
          >
            <option value="heavy">Heavy Chain</option>
            <option value="light">Light Chain</option>
            <option value="trb">T-Cell Receptor Beta</option>
          </select>
        </div>

        {/* Model Selection */}
        <div className="relative z-0 w-full mb-5 group">
          <span id="model-label" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Model
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-labelledby="model-label"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 text-left flex justify-between items-center"
            >
              <span>{selectedModel?.name || 'Select a model'}</span>
              <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && availableModels.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleModelSelect(model.id)}
                    className={`w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
                      selectedModelId === model.id ? 'bg-purple-100 dark:bg-purple-900' : ''
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getChainDisplayName(model.chainType)} • {model.version}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Show message if no models available for selected chain */}
            {isOpen && availableModels.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No models available for {getChainDisplayName(selectedChain)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Model Info */}
      {selectedModel && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
              {selectedModel.description}
            </p>
            <div className="flex items-center space-x-2 ml-4">
              <a
                href={`/docs/models/${selectedModel.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Model Documentation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
              <a
                href={`/docs/models/${selectedModel.id}/paper`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Research Paper"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedModel.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded dark:bg-purple-900 dark:text-purple-200"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;