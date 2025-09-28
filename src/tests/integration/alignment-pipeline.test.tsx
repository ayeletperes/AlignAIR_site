/**
 * Integration tests for the alignment pipeline
 * Tests the complete flow from input to results
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlignmentProvider } from '@/contexts/AlignmentContext';
import AlignAIRApp from '@/components/alignair/AlignAIRApp';
import { AppConfig } from '@/config/app.config';

// Mock external dependencies
jest.mock('@/components/submission/alignmentSubmission', () => ({
  getOrLoadModelById: jest.fn().mockResolvedValue({
    loader: mockLoader,
    modelOutputNodes: { output: 0 }
  }),
  submitAlignment: jest.fn().mockResolvedValue({
    id: 'test_result_1',
    sequence: 'ATCGATCGATCG',
    chainType: 'heavy',
    modelId: 'igh-v1.0',
    timestamp: Date.now(),
    processingTime: 1000,
    confidence: 0.95,
    productivity: 'productive'
  })
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

const mockLoader = {
  predict: jest.fn().mockResolvedValue([
    [0.1, 0.8, 0.1], // Mock predictions
  ])
};

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AlignmentProvider>
      {children}
    </AlignmentProvider>
  );
}

describe('Alignment Pipeline Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset any localStorage
    localStorage.clear();
  });

  describe('Complete Alignment Flow', () => {
    test('should complete full alignment process with sequence input', async () => {
      const user = userEvent.setup();
      
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Step 1: Input sequence
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'ATCGATCGATCGATCGATCGATCG');

      // Step 2: Select chain type
      const chainSelector = screen.getByRole('combobox', { name: /chain type/i });
      await user.selectOptions(chainSelector, 'heavy');

      // Step 3: Verify form is valid
      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      expect(submitButton).toBeEnabled();

      // Step 4: Submit form
      await user.click(submitButton);

      // Step 5: Verify processing starts
      await waitFor(() => {
        expect(screen.getByText(/processing/i)).toBeInTheDocument();
      });

      // Step 6: Wait for results
      await waitFor(
        () => {
          expect(screen.getByText(/results/i)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // Step 7: Verify results are displayed
      expect(screen.getByText(/heavy chain analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/productive/i)).toBeInTheDocument();
    });

    test('should handle file upload workflow', async () => {
      const user = userEvent.setup();
      
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Create a mock FASTA file
      const fastaContent = '>sequence1\nATCGATCGATCGATCGATCGATCG\n>sequence2\nGCTAGCTAGCTAGCTAGCTA';
      const file = new File([fastaContent], 'test.fasta', { type: 'text/plain' });

      // Upload file
      const fileInput = screen.getByLabelText(/upload file/i);
      await user.upload(fileInput, file);

      // Verify file is loaded
      await waitFor(() => {
        expect(screen.getByText(/test\.fasta/i)).toBeInTheDocument();
      });

      // Select model and submit
      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      await user.click(submitButton);

      // Verify processing
      await waitFor(() => {
        expect(screen.getByText(/processing/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle model loading errors gracefully', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      getOrLoadModelById.mockRejectedValueOnce(new Error('Model load failed'));

      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Input sequence and submit
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'ATCGATCGATCG');

      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to load.*model/i)).toBeInTheDocument();
      });
    });

    test('should validate sequence input', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      expect(submitButton).toBeDisabled();

      // Input invalid sequence
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'INVALID123SEQUENCE');

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid.*sequence/i)).toBeInTheDocument();
      });
    });
  });

  describe('Parameter Configuration', () => {
    test('should allow parameter customization', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Open advanced parameters
      const advancedToggle = screen.getByText(/advanced parameters/i);
      await user.click(advancedToggle);

      // Modify V threshold
      const vThresholdInput = screen.getByLabelText(/v threshold/i);
      await user.clear(vThresholdInput);
      await user.type(vThresholdInput, '0.8');

      // Verify parameter is updated
      expect(vThresholdInput).toHaveValue(0.8);
    });
  });

  describe('Results Display', () => {
    test('should display results with proper formatting', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Complete alignment flow
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'ATCGATCGATCG');

      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      await user.click(submitButton);

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument();
      });

      // Check for specific result elements
      expect(screen.getByText(/confidence.*95%/i)).toBeInTheDocument();
      expect(screen.getByText(/processing time.*1000ms/i)).toBeInTheDocument();
    });

    test('should allow result download', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Complete alignment and get results
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'ATCGATCGATCG');

      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument();
      });

      // Find download button
      const downloadButton = screen.getByRole('button', { name: /download/i });
      expect(downloadButton).toBeInTheDocument();
      expect(downloadButton).toBeEnabled();
    });
  });

  describe('Performance', () => {
    test('should complete processing within timeout', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      const startTime = Date.now();

      // Complete alignment flow
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'ATCGATCGATCG');

      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      await user.click(submitButton);

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument();
      });

      const processingTime = Date.now() - startTime;
      
      // Should complete within reasonable time (5 seconds for test)
      expect(processingTime).toBeLessThan(5000);
    });

    test('should handle timeout gracefully', async () => {
      // Mock slow processing
      const { submitAlignment } = require('@/components/submission/alignmentSubmission');
      submitAlignment.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, AppConfig.processing.timeouts.inference + 1000))
      );

      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Start processing
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'ATCGATCGATCG');

      const submitButton = screen.getByRole('button', { name: /analyze sequence/i });
      await user.click(submitButton);

      // Should show timeout error
      await waitFor(
        () => {
          expect(screen.getByText(/timeout/i)).toBeInTheDocument();
        },
        { timeout: AppConfig.processing.timeouts.inference + 2000 }
      );
    });
  });
});