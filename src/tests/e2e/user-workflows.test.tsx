/**
 * End-to-end tests for complete user workflows
 * Tests real user scenarios and user experience flows
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlignmentProvider } from '@/contexts/AlignmentContext';
import AlignAIRApp from '@/components/alignair/AlignAIRApp';

// Mock external services and heavy components
jest.mock('@/components/submission/alignmentSubmission');
jest.mock('@/components/results/alignment/AlignmentBrowserHeavy', () => 
  function MockAlignmentBrowser() {
    return <div data-testid="alignment-browser">Mock Alignment Browser</div>;
  }
);

// Test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <AlignmentProvider>{children}</AlignmentProvider>;
}

// Helper function to create test files
function createTestFile(content: string, filename: string, type: string = 'text/plain') {
  return new File([content], filename, { type });
}

describe('End-to-End User Workflows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('New User Onboarding', () => {
    test('first-time user should see guided tour', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Should show tour automatically for new users
      await waitFor(() => {
        expect(screen.getByText(/welcome to alignair/i)).toBeInTheDocument();
      });

      // User can navigate through tour
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should show next step
      expect(screen.getByText(/choose how you want to input/i)).toBeInTheDocument();

      // User can complete tour
      const finishButton = screen.getByRole('button', { name: /finish/i });
      await user.click(finishButton);

      // Tour should be marked as completed
      expect(localStorage.getItem('alignair_tour_completed')).toBe('true');
    });

    test('returning user should not see tour automatically', async () => {
      // Mark tour as completed
      localStorage.setItem('alignair_tour_completed', 'true');
      
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Should not show tour
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait longer than tour delay
      expect(screen.queryByText(/welcome to alignair/i)).not.toBeInTheDocument();
    });
  });

  describe('Heavy Chain Analysis Workflow', () => {
    test('complete heavy chain sequence analysis', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Skip tour if it appears
      if (screen.queryByText(/skip tour/i)) {
        await user.click(screen.getByText(/skip tour/i));
      }

      // Step 1: Input heavy chain sequence
      const heavyChainSequence = 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGGCTTGGTCCAGCCTGGGGGGTCCCTGAGACTCTCCTGTGCAGCCTCTGGATTCACCTTCAGTAGCTATGCCATGAGCTGGGTCCGCCAGGCTCCAGGGAAGGGGCTGGAGTGGG';
      
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.clear(sequenceInput);
      await user.type(sequenceInput, heavyChainSequence);

      // Step 2: Select heavy chain
      const chainSelector = screen.getByDisplayValue(/heavy/i) || screen.getByRole('combobox');
      if (chainSelector.tagName === 'SELECT') {
        await user.selectOptions(chainSelector, 'heavy');
      }

      // Step 3: Keep default parameters (advanced settings collapsed)
      expect(screen.queryByText(/v threshold/i)).not.toBeInTheDocument();

      // Step 4: Submit for analysis
      const analyzeButton = screen.getByRole('button', { name: /analyze sequence/i });
      expect(analyzeButton).toBeEnabled();
      await user.click(analyzeButton);

      // Step 5: Watch processing progress
      await waitFor(() => {
        expect(screen.getByText(/processing/i)).toBeInTheDocument();
      });

      // Should show processing steps
      expect(screen.getByText(/validating/i)).toBeInTheDocument();

      // Step 6: Wait for results
      await waitFor(
        () => {
          expect(screen.getByText(/results/i)).toBeInTheDocument();
        },
        { timeout: 10000 }
      );

      // Step 7: Verify results display
      expect(screen.getByText(/heavy chain analysis/i)).toBeInTheDocument();
      expect(screen.getByTestId('alignment-browser')).toBeInTheDocument();

      // Step 8: Download results
      const downloadButton = screen.getByRole('button', { name: /download/i });
      expect(downloadButton).toBeEnabled();
    });
  });

  describe('Light Chain Analysis Workflow', () => {
    test('complete light chain file upload analysis', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Skip tour
      if (screen.queryByText(/skip tour/i)) {
        await user.click(screen.getByText(/skip tour/i));
      }

      // Step 1: Switch to file upload
      const fileTabButton = screen.getByText(/upload file/i) || screen.getByRole('tab', { name: /file/i });
      await user.click(fileTabButton);

      // Step 2: Upload FASTA file
      const fastaContent = `>LightChain1
GACATCCAGATGACCCAGTCTCCATCCTCCCTGTCTGCATCTGTAGGAGACAGAGTCACCATCACTTGCCGGGCAAGTCAGAGCATTAGCAGTTATTTAAATT
>LightChain2
GATATTGTGATGACTCAGAGTCCAGGCAGGCTGGCTGTGTCTCCAGGGGAAAGAGCCACCCTCTCCTGCAGGGCCAGTGAGAATGTCGGCACTTATTTAAGT`;

      const file = createTestFile(fastaContent, 'light_chains.fasta');
      const fileInput = screen.getByLabelText(/choose file/i) || screen.getByRole('button', { name: /browse/i });
      
      await user.upload(fileInput, file);

      // Step 3: Verify file loaded
      await waitFor(() => {
        expect(screen.getByText(/light_chains\.fasta/i)).toBeInTheDocument();
      });

      // Step 4: Select light chain type
      const chainSelector = screen.getByDisplayValue(/heavy/i) || screen.getByRole('combobox');
      await user.selectOptions(chainSelector, 'light');

      // Step 5: Analyze
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await user.click(analyzeButton);

      // Step 6: Verify multi-sequence processing
      await waitFor(() => {
        expect(screen.getByText(/processing.*sequences/i)).toBeInTheDocument();
      });

      // Step 7: Check results for multiple sequences
      await waitFor(
        () => {
          expect(screen.getByText(/2.*sequences.*processed/i)).toBeInTheDocument();
        },
        { timeout: 15000 }
      );
    });
  });

  describe('Parameter Customization Workflow', () => {
    test('advanced user customizes analysis parameters', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Skip tour
      if (screen.queryByText(/skip tour/i)) {
        await user.click(screen.getByText(/skip tour/i));
      }

      // Step 1: Input sequence
      const sequence = 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGG';
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, sequence);

      // Step 2: Expand advanced parameters
      const advancedToggle = screen.getByText(/advanced/i) || screen.getByText(/parameters/i);
      await user.click(advancedToggle);

      // Step 3: Modify thresholds
      const vThresholdInput = screen.getByLabelText(/v.*threshold/i);
      await user.clear(vThresholdInput);
      await user.type(vThresholdInput, '0.85');

      const jThresholdInput = screen.getByLabelText(/j.*threshold/i);
      await user.clear(jThresholdInput);
      await user.type(jThresholdInput, '0.75');

      // Step 4: Modify caps
      const vCapInput = screen.getByLabelText(/v.*cap/i);
      await user.clear(vCapInput);
      await user.type(vCapInput, '5');

      // Step 5: Verify parameters are applied
      expect(vThresholdInput).toHaveValue(0.85);
      expect(jThresholdInput).toHaveValue(0.75);
      expect(vCapInput).toHaveValue(5);

      // Step 6: Analyze with custom parameters
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await user.click(analyzeButton);

      // Verify custom parameters are used in processing
      await waitFor(() => {
        expect(screen.getByText(/processing.*custom.*parameters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery Workflows', () => {
    test('user recovers from invalid sequence error', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Step 1: Input invalid sequence
      const invalidSequence = 'INVALID123SEQUENCE!@#';
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, invalidSequence);

      // Step 2: Try to analyze
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await user.click(analyzeButton);

      // Step 3: See validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid.*sequence/i)).toBeInTheDocument();
      });

      // Step 4: Fix the sequence
      await user.clear(sequenceInput);
      await user.type(sequenceInput, 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGG');

      // Step 5: Retry analysis
      await user.click(analyzeButton);

      // Step 6: Verify successful processing
      await waitFor(() => {
        expect(screen.getByText(/processing/i)).toBeInTheDocument();
      });
    });

    test('user recovers from file upload error', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Step 1: Try to upload invalid file
      const invalidFile = createTestFile('not a fasta file', 'test.txt');
      const fileInput = screen.getByLabelText(/choose file/i);
      await user.upload(fileInput, invalidFile);

      // Step 2: See format error
      await waitFor(() => {
        expect(screen.getByText(/invalid.*format/i)).toBeInTheDocument();
      });

      // Step 3: Upload valid FASTA file
      const validFasta = createTestFile('>seq1\nATCGATCG\n>seq2\nGCTAGCTA', 'valid.fasta');
      await user.upload(fileInput, validFasta);

      // Step 4: Verify successful upload
      await waitFor(() => {
        expect(screen.getByText(/valid\.fasta/i)).toBeInTheDocument();
      });
    });
  });

  describe('Results Exploration Workflow', () => {
    test('user explores detailed results and downloads data', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Complete an analysis first (mock quick success)
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGG');
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument();
      });

      // Step 1: Explore alignment view
      const alignmentTab = screen.getByText(/alignment/i);
      await user.click(alignmentTab);
      expect(screen.getByTestId('alignment-browser')).toBeInTheDocument();

      // Step 2: View detailed results table
      const tableTab = screen.getByText(/table/i) || screen.getByText(/detailed/i);
      await user.click(tableTab);
      expect(screen.getByRole('table')).toBeInTheDocument();

      // Step 3: Download results in different formats
      const downloadDropdown = screen.getByRole('button', { name: /download/i });
      await user.click(downloadDropdown);

      // Should see format options
      expect(screen.getByText(/json/i)).toBeInTheDocument();
      expect(screen.getByText(/csv/i)).toBeInTheDocument();
      expect(screen.getByText(/fasta/i)).toBeInTheDocument();

      // Download CSV
      await user.click(screen.getByText(/csv/i));
      // Verify download initiated (would check for blob creation in real test)
    });
  });

  describe('Session Persistence Workflow', () => {
    test('user session state persists across page refreshes', async () => {
      const user = userEvent.setup();
      
      // Initial session
      const { rerender } = render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Set up some state
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      await user.type(sequenceInput, 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGG');

      // Change theme
      const themeToggle = screen.getByLabelText(/toggle theme/i) || screen.getByRole('button', { name: /theme/i });
      await user.click(themeToggle);

      // Verify theme changed
      expect(document.documentElement.classList.contains('dark')).toBeTruthy();

      // Simulate page refresh
      rerender(<AlignAIRApp />);

      // Theme should persist
      expect(document.documentElement.classList.contains('dark')).toBeTruthy();
    });
  });

  describe('Accessibility Workflows', () => {
    test('keyboard-only user can complete analysis', async () => {
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Navigate using keyboard only
      const sequenceInput = screen.getByPlaceholderText(/enter.*sequence/i);
      sequenceInput.focus();

      // Type sequence
      fireEvent.change(sequenceInput, {
        target: { value: 'CAGGTGCAGCTGGTGGAGTCTGGGGGAGG' }
      });

      // Tab to analyze button
      fireEvent.keyDown(sequenceInput, { key: 'Tab' });
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      expect(analyzeButton).toHaveFocus();

      // Press Enter to submit
      fireEvent.keyDown(analyzeButton, { key: 'Enter' });

      // Verify analysis starts
      await waitFor(() => {
        expect(screen.getByText(/processing/i)).toBeInTheDocument();
      });
    });

    test('screen reader user gets proper announcements', async () => {
      const user = userEvent.setup();
      render(<AlignAIRApp />, { wrapper: TestWrapper });

      // Check for proper ARIA labels
      const sequenceInput = screen.getByLabelText(/sequence input/i);
      expect(sequenceInput).toHaveAttribute('aria-describedby');

      const analyzeButton = screen.getByRole('button', { name: /analyze sequence/i });
      expect(analyzeButton).toHaveAttribute('aria-disabled');

      // Type sequence
      await user.type(sequenceInput, 'ATCG');

      // Button should become enabled with proper ARIA state
      expect(analyzeButton).not.toHaveAttribute('aria-disabled', 'true');
    });
  });
});