/**
 * Testing utilities and setup helpers
 * Provides common test setup and helper functions
 */

import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlignmentProvider } from '@/contexts/AlignmentContext';
import { AppConfig } from '@/config/app.config';
import { AlignmentResult, ProcessingParams } from '@/types/alignment';

// Mock implementations for common external dependencies
export const mockTensorFlowModel = {
  predict: jest.fn().mockResolvedValue([[0.1, 0.8, 0.1]]),
  dispose: jest.fn(),
};

export const mockModelLoader = {
  loadModel: jest.fn().mockResolvedValue(mockTensorFlowModel),
  warmupModel: jest.fn().mockResolvedValue(undefined),
};

export const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

// Test wrapper component
interface TestWrapperProps {
  children: React.ReactNode;
  initialState?: Partial<any>;
}

export function TestWrapper({ children, initialState }: TestWrapperProps) {
  return (
    <AlignmentProvider>
      {children}
    </AlignmentProvider>
  );
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<any>;
}

export function customRender(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const { initialState, ...renderOptions } = options || {};
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper initialState={initialState}>{children}</TestWrapper>
  );

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
}

// Factory functions for test data
export const createMockAlignmentResult = (overrides?: Partial<AlignmentResult>): AlignmentResult => ({
  id: `test_result_${Date.now()}`,
  sequence: 'ATCGATCGATCGATCGATCGATCG',
  chainType: 'heavy',
  modelId: 'igh-v1.0',
  timestamp: Date.now(),
  processingTime: 1500,
  confidence: 0.95,
  productivity: 'productive',
  vSegment: {
    segment: 'IGHV1-69*01',
    likelihood: 0.95,
    startPos: 0,
    endPos: 100,
    allele: 'IGHV1-69*01'
  },
  dSegment: {
    segment: 'IGHD3-22*01',
    likelihood: 0.88,
    startPos: 101,
    endPos: 120,
    allele: 'IGHD3-22*01'
  },
  jSegment: {
    segment: 'IGHJ4*02',
    likelihood: 0.92,
    startPos: 121,
    endPos: 150,
    allele: 'IGHJ4*02'
  },
  mutations: [
    {
      position: 25,
      original: 'A',
      mutated: 'G',
      type: 'silent'
    },
    {
      position: 47,
      original: 'C',
      mutated: 'T',
      type: 'missense'
    }
  ],
  ...overrides
});

export const createMockProcessingParams = (overrides?: Partial<ProcessingParams>): ProcessingParams => ({
  ...AppConfig.processing.defaultParams,
  ...overrides
});

// Test file helpers
export function createMockFile(content: string, filename: string, type: string = 'text/plain'): File {
  return new File([content], filename, { type });
}

export function createMockFastaFile(sequences: Array<{ name: string; sequence: string }>, filename: string = 'test.fasta'): File {
  const content = sequences
    .map(({ name, sequence }) => `>${name}\n${sequence}`)
    .join('\n');
  return createMockFile(content, filename, 'text/plain');
}

// Mock sequence data
export const MOCK_SEQUENCES = {
  heavy: {
    valid: 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGGCTTGGTCCAGCCTGGGGGGTCCCTGAGACTCTCCTGTGCAGCCTCTGGATTCACCTTCAGTAGCTATGCCATGAGCTGGGTCCGCCAGGCTCCAGGGAAGGGGCTGGAGTGGGTGGCAACTATAAACAAATGTAAAGGTCGATTCACAATCTCCAGAGACAATTCCAAGAACACGCTGTATCTGCAAATGAACAGCCTGAGAACTGAGGACACGGCTGTGTATTACTGTGCGAG',
    short: 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGG',
    invalid: 'INVALID123SEQUENCE!@#',
    withAmbiguous: 'CAGGTGCAGCTGGTGGAGTCTNGGGGAGGCTTGGTCCAGCCTGGGGGGTSSCCTGAGACTCTCCTGTGCAGCCTCTGGATTCACCTTC'
  },
  light: {
    valid: 'GACATCCAGATGACCCAGTCTCCATCCTCCCTGTCTGCATCTGTAGGAGACAGAGTCACCATCACTTGCCGGGCAAGTCAGAGCATTAGCAGTTATTTAAATTGGTATCAGCAGAAACCAGGGAAAGCCCCTAAGCTCCTGATCTATGCTGCATCCAGTTTGCAAAGTGGGGTCCCATCAAGGTTCAGTGGCAGTGGATCTGGGACAGATTTCACTCTCACCATCAGCAGTCTGCAACCTGAAGATTTTGCAACTTACTACTGTCAACAGAGTTACAGTACCCCT',
    short: 'GACATCCAGATGACCCAGTCTCCATCCTC',
    kappa: 'GATATTGTGATGACTCAGAGTCCAGGCAGGCTGGCTGTGTCTCCAGGGGAAAGAGCCACCCTCTCCTGCAGGGCCAGTGAGAATGTCGGCACTTATTTAAGTGGTTGGTATCAGAAAAACCAGGGCAGCCTCCCAAGCTCCTGATCTACAAGGCGTCTAACTTGGAAGGTGGGGTCCCTGAGAGGTTCAGCGGCAGTGGATCTGGGACAGAGTTCACCCTCACAATCAGCAGCCTGAAGGCTGAGGATGAGGCAATTTATTACTGTCA'
  },
  trb: {
    valid: 'GATACGAGTTCACCCTCAAGAACCCCGATCCCTTTCCTCTGCCTTCTCTCTCCAACTTTGTCTCTGCTCTGCTCTCCAATTCCACTCCCTCATCAATTCATCTGTCACATGGTCAACTGGCAGAACATCCTGACTCAAAACAATCGTTCGGAGGAGGCAGGAGGAGGGGAAAAGTAGCACAAAACCCAACAACTGTGGACATAACAGAATACGGAACCCCTTTTACACTGGGCCCCCCAAGAGGGTTTACCGCATGTGTTTCAAAGATTGAGCATAAAGGGCCAGGAAAGTGTGGCTCAACAACATCCTGACTCAAAACAAT',
    short: 'GATACGAGTTCACCCTCAAGAACCCCGAT'
  }
};

// Mock processing responses
export const MOCK_PROCESSING_RESPONSES = {
  success: {
    heavy: createMockAlignmentResult({
      chainType: 'heavy',
      vSegment: {
        segment: 'IGHV3-23*01',
        likelihood: 0.96,
        startPos: 0,
        endPos: 100,
        allele: 'IGHV3-23*01'
      }
    }),
    light: createMockAlignmentResult({
      chainType: 'light',
      vSegment: {
        segment: 'IGKV1-39*01',
        likelihood: 0.91,
        startPos: 0,
        endPos: 95,
        allele: 'IGKV1-39*01'
      }
    }),
    trb: createMockAlignmentResult({
      chainType: 'trb',
      vSegment: {
        segment: 'TRBV19*01',
        likelihood: 0.88,
        startPos: 0,
        endPos: 98,
        allele: 'TRBV19*01'
      }
    })
  },
  error: {
    modelLoadFailed: new Error('Failed to load model'),
    invalidSequence: new Error('Invalid sequence format'),
    networkError: new Error('Network connection failed'),
    timeout: new Error('Processing timeout')
  }
};

// Test assertion helpers
export function expectElementToHaveLoadingState(element: HTMLElement) {
  expect(element).toHaveAttribute('aria-busy', 'true');
  expect(element).toHaveClass('animate-pulse');
}

export function expectElementToHaveErrorState(element: HTMLElement) {
  expect(element).toHaveAttribute('aria-invalid', 'true');
  expect(element).toHaveClass('border-red-500');
}

export function expectElementToHaveSuccessState(element: HTMLElement) {
  expect(element).not.toHaveAttribute('aria-invalid');
  expect(element).toHaveClass('border-green-500');
}

// Performance testing helpers
export class PerformanceTestHelper {
  private startTime: number = 0;
  private endTime: number = 0;

  start() {
    this.startTime = performance.now();
  }

  stop() {
    this.endTime = performance.now();
  }

  getDuration() {
    return this.endTime - this.startTime;
  }

  expectDurationLessThan(maxMs: number) {
    expect(this.getDuration()).toBeLessThan(maxMs);
  }
}

// Memory testing helpers
export class MemoryTestHelper {
  private initialMemory: number = 0;

  constructor() {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      this.initialMemory = (performance as any).memory.usedJSHeapSize;
    }
  }

  getCurrentMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  getMemoryIncrease(): number {
    return this.getCurrentMemoryUsage() - this.initialMemory;
  }

  expectMemoryIncreaseToBeBelow(maxBytes: number) {
    const increase = this.getMemoryIncrease();
    expect(increase).toBeLessThan(maxBytes);
  }
}

// Accessibility testing helpers
export function expectElementToBeAccessible(element: HTMLElement) {
  // Basic accessibility checks
  if (element.tagName === 'BUTTON') {
    expect(element).toHaveAttribute('type');
    expect(element).not.toHaveAttribute('aria-disabled', 'true');
  }
  
  if (element.tagName === 'INPUT') {
    expect(element).toHaveAttribute('aria-label');
  }
  
  // Should have proper focus management
  if (element.matches(':focus')) {
    expect(element).toBeVisible();
  }
}

// Animation testing helpers
export function waitForAnimationToComplete(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      element.removeEventListener('transitionend', handleAnimationEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
    element.addEventListener('transitionend', handleAnimationEnd);
    
    // Fallback timeout
    setTimeout(resolve, 1000);
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };