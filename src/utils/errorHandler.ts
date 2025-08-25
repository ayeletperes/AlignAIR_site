/**
 * Comprehensive Error Handling System
 * Provides consistent error handling across the application
 */

import { AppConfig } from '@/config/app.config';
import { logger } from '@/utils/logger';

// Error types
export enum ErrorCodes {
  // Input errors
  INVALID_INPUT = 'INVALID_INPUT',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  INVALID_SEQUENCE = 'INVALID_SEQUENCE',
  TOO_MANY_SEQUENCES = 'TOO_MANY_SEQUENCES',
  
  // Model errors
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  MODEL_INFERENCE_FAILED = 'MODEL_INFERENCE_FAILED',
  
  // Processing errors
  PROCESSING_TIMEOUT = 'PROCESSING_TIMEOUT',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  
  // System errors
  MEMORY_ERROR = 'MEMORY_ERROR',
  BROWSER_ERROR = 'BROWSER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Base error class
export class AlignmentError extends Error {
  public code: ErrorCodes;
  public severity: ErrorSeverity;
  public recoverable: boolean;
  public userMessage: string;
  public technicalDetails?: string;
  public context?: string;
  public timestamp: number;

  constructor(
    code: ErrorCodes,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    recoverable: boolean = true,
    userMessage?: string,
    technicalDetails?: string,
    context?: string
  ) {
    super(message);
    this.name = 'AlignmentError';
    this.code = code;
    this.severity = severity;
    this.recoverable = recoverable;
    this.userMessage = userMessage || message;
    this.technicalDetails = technicalDetails;
    this.context = context;
    this.timestamp = Date.now();
  }

  // Convert to alignment error format for context
  toAlignmentError() {
    return {
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      severity: this.severity,
      recoverable: this.recoverable,
      technicalDetails: this.technicalDetails,
      context: this.context,
      timestamp: this.timestamp
    };
  }

  // Get recovery suggestions
  getRecoverySuggestions(): string[] {
    const suggestions: Partial<Record<ErrorCodes, string[]>> = {
      [ErrorCodes.INVALID_INPUT]: [
        'Please check your input format',
        'Ensure sequences contain only valid characters (A, C, G, T, N)',
        'Try uploading a different file or entering a different sequence'
      ],
      [ErrorCodes.INVALID_FILE_TYPE]: [
        'Please use a supported file format (FASTA, .fa, .txt)',
        'Check that your file is not corrupted',
        'Try converting your file to FASTA format'
      ],
      [ErrorCodes.INVALID_SEQUENCE]: [
        'Ensure sequences contain only valid characters (A, C, G, T, N)',
        'Check for special characters or formatting issues',
        'Try cleaning your sequence data'
      ],
      [ErrorCodes.FILE_TOO_LARGE]: [
        'Try using a smaller file',
        'Use the CLI tool for larger files',
        'Split your file into smaller chunks'
      ],
      [ErrorCodes.TOO_MANY_SEQUENCES]: [
        'Use the CLI tool for files with more than 1000 sequences',
        'Split your file into smaller chunks',
        'Process sequences in batches'
      ],
      [ErrorCodes.MODEL_NOT_FOUND]: [
        'Try refreshing the page',
        'Check your internet connection',
        'Try a different model'
      ],
      [ErrorCodes.MODEL_LOAD_FAILED]: [
        'Try refreshing the page',
        'Check your internet connection',
        'Try again in a few minutes'
      ],
      [ErrorCodes.MODEL_INFERENCE_FAILED]: [
        'Try with a different input',
        'Check your internet connection',
        'Try again in a few minutes'
      ],
      [ErrorCodes.PROCESSING_FAILED]: [
        'Try with a smaller input',
        'Check your internet connection',
        'Try again later'
      ],
      [ErrorCodes.VALIDATION_FAILED]: [
        'Please check your input parameters',
        'Ensure all required fields are completed',
        'Try with different settings'
      ],
      [ErrorCodes.PROCESSING_TIMEOUT]: [
        'Try with a smaller input',
        'Check your internet connection',
        'Try again later'
      ],
      [ErrorCodes.API_ERROR]: [
        'Try refreshing the page',
        'Check your internet connection',
        'Try again in a few minutes'
      ],
      [ErrorCodes.BROWSER_ERROR]: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Try a different browser'
      ],
      [ErrorCodes.NETWORK_ERROR]: [
        'Check your internet connection',
        'Try refreshing the page',
        'Try again in a few minutes'
      ],
      [ErrorCodes.MEMORY_ERROR]: [
        'Close other browser tabs',
        'Try with a smaller input',
        'Use the CLI tool for large files'
      ],
      [ErrorCodes.UNKNOWN_ERROR]: [
        'Try refreshing the page',
        'Check your internet connection',
        'Contact support if the problem persists'
      ]
    };

    return suggestions[this.code] || suggestions[ErrorCodes.UNKNOWN_ERROR] || [];
  }
}

// Error factory functions
export class ErrorHandler {
  // Create input validation errors
  static createInputError(code: ErrorCodes, message: string, context?: string): AlignmentError {
    return new AlignmentError(
      code,
      message,
      ErrorSeverity.MEDIUM,
      true,
      'Please check your input and try again.',
      message,
      context
    );
  }

  // Create model-related errors
  static createModelError(code: ErrorCodes, message: string, modelId?: string): AlignmentError {
    const context = modelId ? `Model: ${modelId}` : undefined;
    return new AlignmentError(
      code,
      message,
      ErrorSeverity.HIGH,
      true,
      'There was a problem loading the model. Please try again.',
      message,
      context
    );
  }

  // Create processing errors
  static createProcessingError(step: string, message: string, details?: any): AlignmentError {
    return new AlignmentError(
      ErrorCodes.PROCESSING_FAILED,
      message,
      ErrorSeverity.HIGH,
      true,
      'Processing failed. Please try again.',
      `Step: ${step}, Details: ${JSON.stringify(details)}`,
      step
    );
  }

  // Create timeout errors
  static createTimeoutError(step: string, timeout: number): AlignmentError {
    return new AlignmentError(
      ErrorCodes.PROCESSING_TIMEOUT,
      `Processing timed out after ${timeout}ms`,
      ErrorSeverity.MEDIUM,
      true,
      'Processing took too long. Please try with a smaller input.',
      `Step: ${step}, Timeout: ${timeout}ms`,
      step
    );
  }

  // Create network errors
  static createNetworkError(message: string, url?: string): AlignmentError {
    return new AlignmentError(
      ErrorCodes.NETWORK_ERROR,
      message,
      ErrorSeverity.MEDIUM,
      true,
      'Network error. Please check your connection and try again.',
      url ? `URL: ${url}, Error: ${message}` : message,
      'network'
    );
  }

  // Create memory errors
  static createMemoryError(message: string): AlignmentError {
    return new AlignmentError(
      ErrorCodes.MEMORY_ERROR,
      message,
      ErrorSeverity.HIGH,
      true,
      'Not enough memory. Please try with a smaller input or use the CLI tool.',
      message,
      'memory'
    );
  }

  // Handle any error and convert to AlignmentError
  static handle(error: Error | string | unknown, context?: string): AlignmentError {
    if (error instanceof AlignmentError) {
      return error;
    }

    const message = error instanceof Error ? error.message : String(error);
    
    // Try to categorize the error
    if (message.includes('network') || message.includes('fetch')) {
      return this.createNetworkError(message, context);
    }
    
    if (message.includes('memory') || message.includes('out of memory')) {
      return this.createMemoryError(message);
    }
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return this.createTimeoutError(context || 'unknown', 60000);
    }
    
    if (message.includes('model') || message.includes('load')) {
      return this.createModelError(ErrorCodes.MODEL_LOAD_FAILED, message);
    }

    // Default to unknown error
    return new AlignmentError(
      ErrorCodes.UNKNOWN_ERROR,
      message,
      ErrorSeverity.MEDIUM,
      true,
      'An unexpected error occurred. Please try again.',
      message,
      context
    );
  }

  // Log error with appropriate level
  static logError(error: AlignmentError): void {
    const logLevel = error.severity === ErrorSeverity.CRITICAL ? 'error' : 'warn';
    logger[logLevel](`[${error.context || 'ErrorHandler'}] ${error.code}: ${error.message}`, {
      code: error.code,
      severity: error.severity,
      recoverable: error.recoverable,
      technicalDetails: error.technicalDetails,
      timestamp: error.timestamp
    });

    // Track error in analytics if enabled
    if (AppConfig.features.analytics && window.gtag) {
      window.gtag('event', 'error', {
        event_category: 'error',
        event_label: error.code,
        value: error.severity === ErrorSeverity.CRITICAL ? 4 : 
               error.severity === ErrorSeverity.HIGH ? 3 :
               error.severity === ErrorSeverity.MEDIUM ? 2 : 1
      });
    }
  }

  // Check if error is recoverable
  static isRecoverable(error: AlignmentError): boolean {
    return error.recoverable;
  }

  // Get user-friendly error message
  static getUserMessage(error: AlignmentError): string {
    return error.userMessage;
  }

  // Get technical details for debugging
  static getTechnicalDetails(error: AlignmentError): string | undefined {
    return error.technicalDetails;
  }
}

/**
 * Error boundary helpers
 */
export const handleErrorBoundary = (error: Error, errorInfo: any) => {
  logger.error('[ErrorBoundary]', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack
  });

  // Report to external service in production
  if (process.env.NODE_ENV === 'production') {
    // Add external error reporting here
  }
};