import React, { useState, useEffect } from 'react';
import { getModelById, ModelMetadata } from '@/lib/model/modelMetadataLoader';
import {
  Species,
  DEFAULT_SPECIES,
  SPECIES_INFO,
  getSpeciesModelMetadata,
  getSpeciesChainTypes,
  getAvailableSpecies
} from '@/config/species/config';
import { SPECIES_PROMPTS, formatSpeciesSelectionPrompt } from '@/config/species/prompts';

interface ModelSelectorProps {
  selectedSpecies?: Species;
  setSelectedSpecies?: (species: Species) => void;
  selectedChain: string;
  setSelectedChain: (chain: string) => void;
  selectedModelId?: string;
  setSelectedModelId?: (modelId: string) => void;
  onModelChange?: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedSpecies = DEFAULT_SPECIES,
  setSelectedSpecies,
  selectedChain,
  setSelectedChain,
  selectedModelId,
  setSelectedModelId,
  onModelChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelMetadata | null>(null);
  const [showSpeciesInfo, setShowSpeciesInfo] = useState(false);

  // Get available models for the selected species and filter by chain type
  const allSpeciesModels = getSpeciesModelMetadata(selectedSpecies);
  const availableModels = allSpeciesModels.filter((model: ModelMetadata) => model.chainType === selectedChain);
  // Get available chain types for the selected species
  const availableChains = getSpeciesChainTypes(selectedSpecies);
  const allAvailableSpecies = getAvailableSpecies();

  // Load the selected model data
  useEffect(() => {
    const loadSelectedModel = async () => {
      if (selectedModelId) {
        const model = await getModelById(selectedModelId);
        setSelectedModel(model);
      } else if (availableModels.length > 0) {
        setSelectedModel(availableModels[0]);
      }
    };
    
    loadSelectedModel();
  }, [selectedModelId, availableModels]);

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

  const handleSpeciesSelect = (newSpecies: Species) => {
    if (setSelectedSpecies) {
      setSelectedSpecies(newSpecies);
    }

    // Reset chain and model selection when species changes
    const newAvailableChains = getSpeciesChainTypes(newSpecies);
    if (newAvailableChains.length > 0 && !newAvailableChains.includes(selectedChain)) {
      setSelectedChain(newAvailableChains[0]);
    }

    if (onModelChange) {
      onModelChange();
    }
  };

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
        Species, Chain Type & Model Selection
      </div>

      {/* Species Info Banner */}
      {showSpeciesInfo && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Species Selection Guide
            </h4>
            <button
              onClick={() => setShowSpeciesInfo(false)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">
            {formatSpeciesSelectionPrompt()}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 md:gap-4">
        {/* Species Selection */}
        <div className="relative z-0 w-full mb-5 group">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Species
            </span>
            <button
              onClick={() => setShowSpeciesInfo(!showSpeciesInfo)}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Species selection guide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <select
            id="species-select"
            value={selectedSpecies}
            onChange={(e) => handleSpeciesSelect(e.target.value as Species)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
          >
            {allAvailableSpecies.map((species) => (
              <option key={species} value={species}>
                {SPECIES_INFO[species].icon} {SPECIES_INFO[species].name}
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {SPECIES_INFO[selectedSpecies].description}
          </div>
        </div>

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
            {availableChains.map((chainType) => (
              <option key={chainType} value={chainType}>
                {getChainDisplayName(chainType)}
              </option>
            ))}
          </select>
          {availableChains.length === 0 && (
            <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
              No chain types available for {SPECIES_INFO[selectedSpecies].name}
            </div>
          )}
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
                {availableModels.map((model: ModelMetadata) => (
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
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{SPECIES_INFO[selectedSpecies].icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedModel.name} - {SPECIES_INFO[selectedSpecies].name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                {SPECIES_INFO[selectedSpecies].scientificName}
              </div>
            </div>
          </div>
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
            {selectedModel.features.map((feature: string, index: number) => (
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