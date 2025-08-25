# ErrorHandler

The `ErrorHandler` utility provides centralized error management and consistent error handling across the AlignAIR application.

## Overview

The ErrorHandler system includes:
- **AlignAIRError class**: Custom error type with user-friendly messages
- **ErrorHandler utility**: Static methods for error processing
- **Error codes**: Predefined error types and messages
- **Recovery suggestions**: Actionable guidance for users

## Usage

### Basic Error Handling

```tsx
import { ErrorHandler, AlignAIRError } from '@/utils/errorHandler';

try {
  await someOperation();
} catch (error) {
  const alignmentError = ErrorHandler.handle(error, 'ComponentName');
  console.log(alignmentError.userMessage); // User-friendly message
}
```

### Creating Custom Errors

```tsx
import { AlignAIRError, ErrorCodes } from '@/utils/errorHandler';

// Create validation error
const validationError = new AlignAIRError(
  ErrorCodes.INVALID_SEQUENCE,
  'Sequence contains invalid characters',
  {
    recoverable: true,
    step: 'validating',
    details: { invalidChars: ['1', '2', '3'] }
  }
);

throw validationError;
```

### Using Error Factory Methods

```tsx
import { ErrorHandler } from '@/utils/errorHandler';

// Validation error
const error = ErrorHandler.createValidationError(
  'Invalid sequence format',
  { sequence: 'INVALID123' }
);

// Model error
const modelError = ErrorHandler.createModelError(
  ErrorCodes.MODEL_LOAD_FAILED,
  'Failed to load IGH model',
  'igh-v1.0'
);

// Processing error
const processingError = ErrorHandler.createProcessingError(
  'preprocessing',
  'Failed to tokenize sequence',
  { sequenceLength: 150 }
);
```

## Error Codes

### Input Validation Errors
- `INVALID_SEQUENCE`: Invalid sequence format or characters
- `FILE_TOO_LARGE`: File exceeds maximum size limit
- `UNSUPPORTED_FORMAT`: File format not supported
- `EMPTY_INPUT`: No input provided

### Model Errors
- `MODEL_LOAD_FAILED`: Model failed to load
- `MODEL_NOT_FOUND`: Requested model not available
- `INFERENCE_FAILED`: Model inference failed
- `MODEL_TIMEOUT`: Model loading timed out

### Processing Errors
- `PREPROCESSING_FAILED`: Input preprocessing failed
- `POSTPROCESSING_FAILED`: Result postprocessing failed
- `VALIDATION_FAILED`: Input validation failed
- `TIMEOUT_ERROR`: Operation timed out

### System Errors
- `MEMORY_ERROR`: Insufficient memory
- `NETWORK_ERROR`: Network connection issues
- `UNKNOWN_ERROR`: Unhandled error type

## AlignAIRError Class

### Properties

```typescript
class AlignAIRError extends Error {
  code: ErrorCode;           // Error code constant
  userMessage: string;       // User-friendly message
  recoverable: boolean;      // Can user recover from this?
  timestamp: number;         // When error occurred
  step?: ProcessingStep;     // Which step failed
  details: Record<string, any>; // Additional error details
}
```

### Methods

#### `getRecoverySuggestions(): string[]`
Returns actionable recovery suggestions for the user.

```tsx
const error = new AlignAIRError(ErrorCodes.INVALID_SEQUENCE);
const suggestions = error.getRecoverySuggestions();
// ['Check that your sequence contains only valid nucleotides (A, T, G, C)', ...]
```

#### `toAlignmentError(): AlignmentError`
Converts to the application's error interface.

```tsx
const alignmentError = error.toAlignmentError();
// Use in context actions
actions.errorProcessing(alignmentError);
```

## ErrorHandler Utility Methods

### `handle(error: Error | AlignAIRError, context?: string): AlignmentError`
Main error handling method that normalizes errors.

```tsx
try {
  await riskyOperation();
} catch (error) {
  const normalized = ErrorHandler.handle(error, 'MyComponent');
  
  // Log structured error data
  console.log({
    code: normalized.code,
    message: normalized.message,
    userMessage: normalized.userMessage,
    recoverable: normalized.recoverable
  });
}
```

### `createValidationError(message: string, details?: object): AlignAIRError`
Creates a validation error with context.

```tsx
const error = ErrorHandler.createValidationError(
  'Sequence must be at least 10 characters',
  { actualLength: 5, minLength: 10 }
);
```

### `createModelError(code: ErrorCode, message?: string, modelId?: string): AlignAIRError`
Creates a model-related error.

```tsx
const error = ErrorHandler.createModelError(
  ErrorCodes.MODEL_LOAD_FAILED,
  'Network timeout during model download',
  'igh-v1.0'
);
```

### `createProcessingError(step: ProcessingStep, message: string, details?: object): AlignAIRError`
Creates a processing pipeline error.

```tsx
const error = ErrorHandler.createProcessingError(
  'inference',
  'Model prediction failed',
  { inputShape: [1, 150], expectedShape: [1, 100] }
);
```

## Error Recovery

### Recovery Suggestions

Each error code has associated recovery suggestions:

```typescript
const RECOVERY_SUGGESTIONS: Record<ErrorCode, string[]> = {
  [ErrorCodes.INVALID_SEQUENCE]: [
    'Check that your sequence contains only valid nucleotides (A, T, G, C)',
    'Ensure the sequence is in the correct format',
    'Try using a different input method'
  ],
  [ErrorCodes.FILE_TOO_LARGE]: [
    'Split your file into smaller chunks',
    'Remove unnecessary sequences',
    'Use the text input instead for smaller sequences'
  ],
  // ... more suggestions
};
```

### Usage in Components

```tsx
function ErrorDisplay({ error }: { error: AlignmentError }) {
  if (!error) return null;

  const suggestions = error.getRecoverySuggestions?.() || [];

  return (
    <div className="error-container">
      <h3>Error: {error.userMessage}</h3>
      
      {error.recoverable && suggestions.length > 0 && (
        <div>
          <h4>Try these solutions:</h4>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      {!error.recoverable && (
        <p>Please refresh the page and try again.</p>
      )}
    </div>
  );
}
```

## Integration with React Components

### Error Boundaries

```tsx
import { handleErrorBoundary } from '@/utils/errorHandler';

class MyErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleErrorBoundary(error, errorInfo);
  }
  
  // ... render method
}
```

### Context Integration

```tsx
import { useAlignment } from '@/contexts/AlignmentContext';
import { ErrorHandler } from '@/utils/errorHandler';

function MyComponent() {
  const { actions } = useAlignment();
  
  const handleOperation = async () => {
    try {
      await someAsyncOperation();
    } catch (error) {
      const alignmentError = ErrorHandler.handle(error, 'MyComponent');
      actions.errorProcessing(alignmentError);
    }
  };
}
```

## Logging Integration

Errors are automatically logged with structured data:

```tsx
// Development logging
if (process.env.NODE_ENV === 'development') {
  logger.error('[ErrorHandler]', {
    code: alignmentError.code,
    message: alignmentError.message,
    step: alignmentError.step,
    details: alignmentError.details,
    stack: error.stack
  });
}

// Production reporting
if (process.env.NODE_ENV === 'production') {
  // Send to external error reporting service
  reportError(alignmentError);
}
```

## Testing

### Testing Error Creation

```tsx
import { AlignAIRError, ErrorCodes } from '@/utils/errorHandler';

describe('AlignAIRError', () => {
  test('should create error with correct properties', () => {
    const error = new AlignAIRError(
      ErrorCodes.INVALID_SEQUENCE,
      'Test message',
      { details: { test: true } }
    );

    expect(error.code).toBe(ErrorCodes.INVALID_SEQUENCE);
    expect(error.userMessage).toBe('Invalid sequence format. Please check your input.');
    expect(error.recoverable).toBe(true);
    expect(error.details).toEqual({ test: true });
  });
});
```

### Testing Error Handling

```tsx
import { ErrorHandler } from '@/utils/errorHandler';

describe('ErrorHandler', () => {
  test('should handle generic errors', () => {
    const genericError = new Error('Generic error message');
    const handled = ErrorHandler.handle(genericError, 'TestComponent');

    expect(handled.code).toBe('UNKNOWN_ERROR');
    expect(handled.userMessage).toContain('unexpected error');
  });

  test('should preserve AlignAIRError properties', () => {
    const alignAIRError = new AlignAIRError(ErrorCodes.MODEL_LOAD_FAILED);
    const handled = ErrorHandler.handle(alignAIRError, 'TestComponent');

    expect(handled.code).toBe(ErrorCodes.MODEL_LOAD_FAILED);
  });
});
```

## Best Practices

1. **Use specific error codes** instead of generic errors when possible
2. **Provide context** in error messages and details
3. **Make errors recoverable** when users can take corrective action
4. **Include recovery suggestions** for user-facing errors
5. **Log errors appropriately** for debugging and monitoring
6. **Test error scenarios** to ensure proper handling
7. **Use TypeScript** for compile-time error code validation

## TypeScript Integration

Full TypeScript support with strict typing:

```tsx
// Type-safe error codes
const error = new AlignAIRError(ErrorCodes.INVALID_SEQUENCE); // ✅ Valid
const badError = new AlignAIRError('INVALID_CODE'); // ❌ TypeScript error

// Type-safe error handling
const handled: AlignmentError = ErrorHandler.handle(error, 'Component');
```