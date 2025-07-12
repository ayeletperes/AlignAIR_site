/**
 * Model Development Guide
 * 
 * This guide explains how to add new models to the AlignAIR framework.
 * Follow these steps carefully to ensure proper integration.
 */

export interface ModelDevelopmentSteps {
  step: number;
  title: string;
  description: string;
  files: string[];
  codeExamples?: string[];
  notes?: string[];
}

export const MODEL_DEVELOPMENT_GUIDE: ModelDevelopmentSteps[] = [
  {
    step: 1,
    title: "Prepare Model Files",
    description: "Ensure your model files are ready and properly formatted",
    files: [
      "public/models/alignment/[model_name]/model.json",
      "public/models/alignment/[model_name]/metadata.json",
      "public/models/orientation/[chain_type]chain_ornt_pipeline.onnx"
    ],
    notes: [
      "Model files should be placed in the public/models directory",
      "Follow the existing naming convention: alignair_[chain_type]",
      "Ensure metadata.json contains proper output node mappings",
      "Orientation model should be named consistently with chain type"
    ]
  },
  {
    step: 2,
    title: "Update Model Configuration",
    description: "Add the new model to the AVAILABLE_MODELS array",
    files: [
      "components/model/modelConfig.ts"
    ],
    codeExamples: [
      `{
  id: 'new-model-v1.0',
  name: 'New Model Name',
  version: 'v1.0',
  chainType: 'heavy', // or 'light', 'trb'
  species: 'Human',
  referenceSet: 'Reference Database Version',
  lastUpdated: 'Month Year',
  description: 'Brief description of the model and its capabilities',
  modelPath: '/models/alignment/alignair_newmodel/model.json',
  modelMetadataPath: '/models/alignment/alignair_newmodel/metadata.json',
  orientationModelPath: '/models/orientation/newmodelchain_ornt_pipeline.onnx',
  features: ['V/D/J segmentation', 'Allele calling', 'Mutation prediction'],
  documentationUrl: '/docs/models/new-model',
  isActive: true
}`
    ],
    notes: [
      "Use a unique ID following the pattern: [model-name]-[version]",
      "Set isActive to false during development/testing",
      "Ensure all paths match your actual file structure",
      "Add appropriate features list based on model capabilities"
    ]
  },
  {
    step: 3,
    title: "Update Chain Configuration",
    description: "Add the new chain type to the ChainConfig interface and related utilities",
    files: [
      "components/model/utilities.tsx",
      "components/preprocessing/steps/config.tsx"
    ],
    codeExamples: [
      `// In utilities.tsx - Update ChainConfig interface
export interface ChainConfig {
  name: 'heavy' | 'light' | 'trb' | 'newchain'; // Add new chain type
  // ... rest of interface
}`,
      `// In config.tsx - Update DEFAULT_CHAIN_CONFIG
export const DEFAULT_CHAIN_CONFIG = {
  // ... existing config
  modelPath: (chain: string) => {
    switch (chain) {
      case 'newchain':
        return '/models/alignment/alignair_newchain/model.json';
      // ... existing cases
    }
  },
  // Update other path functions similarly
};`
    ],
    notes: [
      "Add the new chain type to all relevant type definitions",
      "Update path generation functions to handle the new chain",
      "Ensure consistency with existing naming patterns"
    ]
  },
  {
    step: 4,
    title: "Update Preprocessing Logic",
    description: "Modify preprocessing steps to handle the new chain type",
    files: [
      "components/preprocessing/steps/cleanAndArrange.tsx",
      "components/preprocessing/steps/modelLoader.tsx"
    ],
    codeExamples: [
      `// In cleanAndArrange.tsx - Add new chain handling
if (chain === 'newchain') {
  // Add specific logic for new chain type
  // Handle V/D/J extraction, type determination, etc.
} else if (chain === 'light') {
  // ... existing light chain logic
}`
    ],
    notes: [
      "Determine if the new chain type needs V/D/J or just V/J segments",
      "Update type determination logic if needed",
      "Ensure proper tensor handling for the new chain"
    ]
  },
  {
    step: 5,
    title: "Update Model Loading",
    description: "Ensure the model loader can handle the new chain type",
    files: [
      "components/model/modelManager.tsx",
      "components/submission/alignmentSubmission.tsx"
    ],
    codeExamples: [
      `// In alignmentSubmission.tsx - Update getOrLoadModel
export const getOrLoadModel = async (params: ModelLoadingParams) => {
  const { chain } = params;
  
  // Add any chain-specific loading logic
  if (chain === 'newchain') {
    // Special handling if needed
  }
  
  return loadModel(params);
};`
    ],
    notes: [
      "Test model loading with the new chain type",
      "Ensure proper error handling for the new chain",
      "Verify memory management and cleanup"
    ]
  },
  {
    step: 6,
    title: "Update UI Components",
    description: "Add the new chain type to UI components and validation",
    files: [
      "components/inputs/ModelSelector.tsx",
      "components/inputs/paramInput.tsx"
    ],
    codeExamples: [
      `// In ModelSelector.tsx - Add new chain display
const getChainDisplayName = (chainType: string) => {
  switch (chainType) {
    case 'newchain': return 'New Chain Type';
    // ... existing cases
  }
};

const getChainIcon = (chainType: string) => {
  switch (chainType) {
    case 'newchain': return '🟡'; // Choose appropriate icon
    // ... existing cases
  }
};`
    ],
    notes: [
      "Add appropriate display name and icon for the new chain",
      "Update any chain-specific UI logic (e.g., D segment handling)",
      "Test the UI with the new chain type"
    ]
  },
  {
    step: 7,
    title: "Update Results Processing",
    description: "Ensure results components can handle the new chain type",
    files: [
      "components/results/Results.tsx",
      "components/results/TabSetResults.tsx",
      "components/results/alignment/utils/customSelect.tsx"
    ],
    codeExamples: [
      `// In Results.tsx - Add chain-specific result handling
const processResults = (results: any, chain: string) => {
  switch (chain) {
    case 'newchain':
      // Add specific result processing for new chain
      break;
    // ... existing cases
  }
};`
    ],
    notes: [
      "Test result display with the new chain type",
      "Ensure proper allele selection and visualization",
      "Verify download functionality works correctly"
    ]
  },
  {
    step: 8,
    title: "Update Documentation",
    description: "Add documentation for the new model",
    files: [
      "app/(default)/models/page.tsx",
      "DEV_README.md",
      "components/dev/ComponentDocs.tsx"
    ],
    codeExamples: [
      `// In models/page.tsx - Add new model to models array
const models = [
  // ... existing models
  {
    id: 'newmodel',
    name: 'New Model Name',
    checkpoint: '/app/pretrained_models/NEW_MODEL_PATH',
    chainType: 'newchain',
    species: 'Human',
    referenceSet: 'Reference Database',
    lastUpdated: 'Month Year',
    description: 'Model description',
    features: ['Feature 1', 'Feature 2'],
    gradient: 'from-yellow-500 to-orange-500',
    iconColor: 'bg-yellow-600'
  }
];`
    ],
    notes: [
      "Add the model to the models page for user reference",
      "Update development documentation",
      "Include usage examples and limitations"
    ]
  },
  {
    step: 9,
    title: "Testing and Validation",
    description: "Comprehensive testing of the new model integration",
    files: [
      "Test files and validation scripts"
    ],
    notes: [
      "Test model loading and inference",
      "Validate results accuracy and format",
      "Test UI interactions and error handling",
      "Verify performance and memory usage",
      "Test with various input sequences",
      "Validate download and export functionality"
    ]
  },
  {
    step: 10,
    title: "Deployment Preparation",
    description: "Final steps before deploying the new model",
    files: [
      "package.json",
      "next.config.js",
      "Deployment scripts"
    ],
    notes: [
      "Ensure all model files are included in deployment",
      "Update any build scripts if needed",
      "Test in staging environment",
      "Prepare rollback plan",
      "Update monitoring and logging",
      "Set isActive to true when ready for production"
    ]
  }
];

export const MODEL_DEVELOPMENT_CHECKLIST = [
  "✅ Model files are properly formatted and placed in correct directories",
  "✅ Model configuration added to modelConfig.ts",
  "✅ Chain type added to all relevant interfaces and types",
  "✅ Preprocessing logic updated for new chain type",
  "✅ Model loading and management updated",
  "✅ UI components support new chain type",
  "✅ Results processing handles new chain type",
  "✅ Documentation updated",
  "✅ Comprehensive testing completed",
  "✅ Performance and memory usage validated",
  "✅ Error handling tested",
  "✅ Deployment preparation completed"
];

export const COMMON_PITFALLS = [
  {
    issue: "Inconsistent naming conventions",
    solution: "Follow existing patterns: alignair_[chaintype], [chaintype]chain_ornt_pipeline.onnx"
  },
  {
    issue: "Missing chain type in type definitions",
    solution: "Update all interfaces and type guards to include the new chain type"
  },
  {
    issue: "Incorrect model path configuration",
    solution: "Double-check all path configurations in modelConfig.ts and config.tsx"
  },
  {
    issue: "UI not updated for new chain type",
    solution: "Ensure all UI components handle the new chain type, especially D segment logic"
  },
  {
    issue: "Results processing errors",
    solution: "Test with sample data and verify tensor shapes and output formats"
  },
  {
    issue: "Memory leaks from model loading",
    solution: "Ensure proper cleanup in modelManager and test memory usage"
  }
]; 