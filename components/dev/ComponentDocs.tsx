/**
 * Component Documentation Generator
 * This file contains metadata about all components for auto-generating documentation
 */

export interface ComponentDoc {
  name: string;
  path: string;
  description: string;
  props?: PropDoc[];
  dependencies?: string[];
  category: 'ui' | 'form' | 'results' | 'utils' | 'layout';
  complexity: 'simple' | 'medium' | 'complex';
  status: 'stable' | 'beta' | 'deprecated';
}

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export const componentDocs: ComponentDoc[] = [
  // UI Components
  {
    name: 'Header',
    path: 'components/ui/header.tsx',
    description: 'Main navigation header with logo, navigation links, and theme toggle',
    category: 'ui',
    complexity: 'medium',
    status: 'stable',
    dependencies: ['ThemeToggle', 'MobileMenu', 'NextUI Dropdown'],
    props: [
      {
        name: 'None',
        type: 'N/A',
        required: false,
        description: 'No props - uses context for theme'
      }
    ]
  },
  {
    name: 'ThemeToggle',
    path: 'components/ui/theme-toggle.tsx',
    description: 'Button to toggle between dark and light themes',
    category: 'ui',
    complexity: 'simple',
    status: 'stable',
    dependencies: ['theme-provider'],
    props: [
      {
        name: 'None',
        type: 'N/A',
        required: false,
        description: 'No props - uses theme context'
      }
    ]
  },
  {
    name: 'LoadingSpinner',
    path: 'components/ui/LoadingSpinner.tsx',
    description: 'Reusable loading spinner component with customizable size and text',
    category: 'ui',
    complexity: 'simple',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: '"sm" | "md" | "lg"',
        required: false,
        defaultValue: '"md"',
        description: 'Size of the spinner'
      },
      {
        name: 'text',
        type: 'string',
        required: false,
        description: 'Text to display below spinner'
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
      }
    ]
  },
  {
    name: 'ErrorBoundary',
    path: 'components/ui/ErrorBoundary.tsx',
    description: 'React error boundary component to catch and display errors gracefully',
    category: 'ui',
    complexity: 'medium',
    status: 'stable',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Child components to wrap'
      },
      {
        name: 'fallback',
        type: 'ReactNode',
        required: false,
        description: 'Custom fallback UI'
      },
      {
        name: 'onError',
        type: '(error: Error, errorInfo: ErrorInfo) => void',
        required: false,
        description: 'Error handler callback'
      }
    ]
  },

  // Form Components
  {
    name: 'AlignmentForm',
    path: 'components/alignair/AlignmentForm.tsx',
    description: 'Main form component for sequence input and parameter configuration',
    category: 'form',
    complexity: 'complex',
    status: 'stable',
    dependencies: ['FileUpload', 'SequenceInput', 'ParameterControls'],
    props: [
      {
        name: 'setFile',
        type: 'Dispatch<SetStateAction<File | null>>',
        required: true,
        description: 'Function to set uploaded file'
      },
      {
        name: 'file',
        type: 'File | null',
        required: true,
        description: 'Current uploaded file'
      },
      {
        name: 'setSequence',
        type: 'Dispatch<SetStateAction<string>>',
        required: true,
        description: 'Function to set sequence text'
      },
      {
        name: 'sequence',
        type: 'string',
        required: true,
        description: 'Current sequence text'
      },
      {
        name: 'setSelectedChain',
        type: 'Dispatch<SetStateAction<string>>',
        required: true,
        description: 'Function to set selected chain type'
      },
      {
        name: 'selectedChain',
        type: 'string',
        required: true,
        description: 'Current selected chain type'
      },
      {
        name: 'params',
        type: 'Params',
        required: true,
        description: 'Model parameters object'
      },
      {
        name: 'setParams',
        type: 'Dispatch<SetStateAction<Params>>',
        required: true,
        description: 'Function to update parameters'
      },
      {
        name: 'setResults',
        type: '(results: any) => void',
        required: true,
        description: 'Function to set results'
      }
    ]
  },

  // Results Components
  {
    name: 'Results',
    path: 'components/results/Results.tsx',
    description: 'Main results container with loading states and error handling',
    category: 'results',
    complexity: 'medium',
    status: 'stable',
    dependencies: ['TabSetResults', 'DownloadResultsTable', 'LoadingSpinner'],
    props: [
      {
        name: 'results',
        type: 'any',
        required: true,
        description: 'Alignment results data'
      },
      {
        name: 'selectedChain',
        type: 'string',
        required: true,
        description: 'Selected chain type'
      },
      {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Loading state'
      }
    ]
  },
  {
    name: 'TabSetResults',
    path: 'components/results/TabSetResults.tsx',
    description: 'Tabbed interface for displaying different result views',
    category: 'results',
    complexity: 'complex',
    status: 'stable',
    dependencies: ['AlignmentBrowser', 'DownloadResultsTable'],
    props: [
      {
        name: 'results',
        type: 'any',
        required: true,
        description: 'Parsed results data'
      },
      {
        name: 'referenceAlleles',
        type: 'any',
        required: true,
        description: 'Reference allele data'
      },
      {
        name: 'chain',
        type: 'string',
        required: true,
        description: 'Chain type'
      }
    ]
  },
  {
    name: 'AlignmentBrowser',
    path: 'components/results/alignment/AlignmentBrowser.tsx',
    description: 'Interactive alignment visualization component',
    category: 'results',
    complexity: 'complex',
    status: 'stable',
    dependencies: ['SelectWidgetVertical2', 'AlignedBlock'],
    props: [
      {
        name: 'results',
        type: 'any',
        required: true,
        description: 'Alignment results'
      },
      {
        name: 'reference',
        type: 'any',
        required: true,
        description: 'Reference data'
      },
      {
        name: 'chain',
        type: 'string',
        required: true,
        description: 'Chain type'
      }
    ]
  },

  // Utility Components
  {
    name: 'Logger',
    path: 'components/utils/logger.ts',
    description: 'Development-only logging utility with environment-based output',
    category: 'utils',
    complexity: 'simple',
    status: 'stable',
    dependencies: [],
    props: [
      {
        name: 'None',
        type: 'N/A',
        required: false,
        description: 'Static utility - no props'
      }
    ]
  },
  {
    name: 'ModelLoader',
    path: 'components/submission/alignmentSubmission.ts',
    description: 'TensorFlow.js model loading and caching utility',
    category: 'utils',
    complexity: 'complex',
    status: 'stable',
    dependencies: ['@tensorflow/tfjs'],
    props: [
      {
        name: 'chain',
        type: '"heavy" | "light" | "trb"',
        required: true,
        description: 'Chain type to load model for'
      },
      {
        name: 'warmupOptions',
        type: 'WarmupOptions',
        required: false,
        description: 'Model warmup configuration'
      }
    ]
  },

  // Layout Components
  {
    name: 'ClientLayout',
    path: 'components/layouts/ClientLayout.tsx',
    description: 'Client-side layout wrapper with theme provider and conditional navigation',
    category: 'layout',
    complexity: 'medium',
    status: 'stable',
    dependencies: ['Header', 'ThemeProvider', 'DevNav'],
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Child components to render'
      }
    ]
  },
  {
    name: 'DevNav',
    path: 'components/ui/DevNav.tsx',
    description: 'Development-only navigation banner with link to dev docs',
    category: 'layout',
    complexity: 'simple',
    status: 'stable',
    dependencies: [],
    props: [
      {
        name: 'None',
        type: 'N/A',
        required: false,
        description: 'No props - development only'
      }
    ]
  }
];

export const getComponentsByCategory = (category: string) => {
  return componentDocs.filter(comp => comp.category === category);
};

export const getComponentByName = (name: string) => {
  return componentDocs.find(comp => comp.name === name);
};

export const getComplexityStats = () => {
  const stats = {
    simple: 0,
    medium: 0,
    complex: 0
  };
  
  componentDocs.forEach(comp => {
    stats[comp.complexity]++;
  });
  
  return stats;
};

export const getStatusStats = () => {
  const stats = {
    stable: 0,
    beta: 0,
    deprecated: 0
  };
  
  componentDocs.forEach(comp => {
    stats[comp.status]++;
  });
  
  return stats;
}; 