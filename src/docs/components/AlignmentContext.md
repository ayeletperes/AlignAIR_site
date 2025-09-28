# AlignmentContext

The `AlignmentContext` provides centralized state management for the entire AlignAIR application using React Context and useReducer.

## Overview

This context manages all application state including form data, processing status, model preloading, results, and UI state. It provides a single source of truth for the application's state and exposes actions to modify that state.

## Usage

### Basic Setup

```tsx
import { AlignmentProvider, useAlignment } from '@/contexts/AlignmentContext';

function App() {
  return (
    <AlignmentProvider>
      <YourComponents />
    </AlignmentProvider>
  );
}
```

### Using the Hook

```tsx
import { useAlignment } from '@/contexts/AlignmentContext';

function MyComponent() {
  const { state, actions } = useAlignment();
  
  // Access state
  const { isProcessing } = state.processing;
  const { selectedChain } = state.form;
  
  // Use actions
  const handleChainChange = (chain) => {
    actions.setChain(chain);
  };
}
```

### Using Selectors

```tsx
import { useAlignmentSelectors } from '@/contexts/AlignmentContext';

function MyComponent() {
  const {
    input,
    selectedChain,
    isProcessing,
    results,
    theme
  } = useAlignmentSelectors();
  
  // State is pre-selected and optimized
}
```

## State Structure

```typescript
interface AppState {
  form: {
    selectedChain: ChainType;
    selectedModelId: string;
    input: AlignmentInput | null;
    params: ProcessingParams;
    isValid: boolean;
    validationErrors: string[];
  };
  processing: {
    isProcessing: boolean;
    currentStep: ProcessingStep;
    progress: ProcessingProgress[];
    error: AlignmentError | null;
    startTime?: number;
    endTime?: number;
  };
  models: {
    heavy: ModelStatus;
    light: ModelStatus;
    trb: ModelStatus;
  };
  results: AlignmentResult[];
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    modalOpen: boolean;
  };
}
```

## Actions

### Form Actions

#### `setInput(input: AlignmentInput | null)`
Sets the sequence input (text or file).

```tsx
// Text input
actions.setInput({
  type: 'sequence',
  content: 'ATCGATCG',
  name: 'My Sequence'
});

// File input
actions.setInput({
  type: 'file',
  file: selectedFile,
  content: 'parsed content'
});
```

#### `setChain(chain: ChainType)`
Sets the selected chain type.

```tsx
actions.setChain('heavy'); // 'heavy' | 'light' | 'trb'
```

#### `setModel(modelId: string)`
Sets the selected model ID.

```tsx
actions.setModel('igh-v1.0');
```

#### `setParams(params: ProcessingParams)`
Updates processing parameters.

```tsx
actions.setParams({
  vCap: 3,
  dCap: 3,
  jCap: 3,
  vThresh: 0.75,
  dThresh: 0.3,
  jThresh: 0.8
});
```

### Processing Actions

#### `startProcessing(step?: string)`
Initiates the processing pipeline.

```tsx
actions.startProcessing('Starting alignment analysis...');
```

#### `updateProcessing(update: Partial<ProcessingState>)`
Updates the processing state.

```tsx
actions.updateProcessing({
  currentStep: 'inference',
  progress: [{
    step: 'inference',
    progress: 50,
    message: 'Running model inference...',
    timestamp: Date.now()
  }]
});
```

#### `completeProcessing(result: AlignmentResult)`
Marks processing as complete with results.

```tsx
actions.completeProcessing(alignmentResult);
```

#### `errorProcessing(error: AlignmentError)`
Handles processing errors.

```tsx
actions.errorProcessing(alignmentError);
```

#### `resetProcessing()`
Resets the processing state to idle.

```tsx
actions.resetProcessing();
```

### Model Actions

#### `updateModelStatus(chain: ChainType, status: ModelStatus)`
Updates model loading status.

```tsx
actions.updateModelStatus('heavy', 'loading');
actions.updateModelStatus('heavy', 'ready');
actions.updateModelStatus('heavy', 'error');
```

### Results Actions

#### `clearResults()`
Clears all stored results.

```tsx
actions.clearResults();
```

### UI Actions

#### `setTheme(theme: 'light' | 'dark')`
Changes the application theme.

```tsx
actions.setTheme('dark');
```

#### `toggleSidebar()`
Toggles the sidebar open/closed state.

```tsx
actions.toggleSidebar();
```

#### `setModal(open: boolean)`
Controls modal visibility.

```tsx
actions.setModal(true);  // Open modal
actions.setModal(false); // Close modal
```

## Validation

The context automatically validates form state and updates `isValid` and `validationErrors`:

```tsx
const { isFormValid, validationErrors } = useAlignmentSelectors();

if (!isFormValid) {
  console.log('Validation errors:', validationErrors);
}
```

### Validation Rules

- Input is required (sequence text or file)
- Sequence cannot be empty if text input is selected
- File is required if file input is selected
- Model selection is required

## Selectors

The `useAlignmentSelectors` hook provides optimized access to commonly used state:

```tsx
const selectors = useAlignmentSelectors();

// Form selectors
selectors.input
selectors.selectedChain
selectors.selectedModelId
selectors.params
selectors.isFormValid
selectors.validationErrors

// Processing selectors
selectors.isProcessing
selectors.currentStep
selectors.processingProgress
selectors.processingError
selectors.processingTime

// Model selectors
selectors.modelStatus
selectors.currentModelStatus

// Results selectors
selectors.results
selectors.latestResult

// UI selectors
selectors.theme
selectors.sidebarOpen
selectors.modalOpen
```

## Persistence

The context automatically persists certain state to localStorage:

- **Theme**: Persisted across sessions
- **Tour completion**: Prevents showing tour to returning users

## Error Handling

All errors are normalized to the `AlignmentError` interface:

```typescript
interface AlignmentError {
  code: string;
  message: string;
  userMessage: string;
  recoverable: boolean;
  timestamp: number;
  step?: ProcessingStep;
  details?: Record<string, any>;
}
```

## Performance Considerations

- State updates are optimized with proper action types
- Selectors prevent unnecessary re-renders
- Form validation is memoized
- Large state objects use shallow equality checks

## Testing

The context can be tested using the provided test utilities:

```tsx
import { render } from '@/tests/setup/test-utils';
import { useAlignment } from '@/contexts/AlignmentContext';

function TestComponent() {
  const { state, actions } = useAlignment();
  return <div>{state.form.selectedChain}</div>;
}

test('should provide alignment context', () => {
  render(<TestComponent />);
  expect(screen.getByText('heavy')).toBeInTheDocument();
});
```

## TypeScript Integration

Full TypeScript support with strict typing:

```tsx
// Type-safe action usage
actions.setChain('heavy'); // ✅ Valid
actions.setChain('invalid'); // ❌ TypeScript error

// Type-safe state access
const chain: ChainType = state.form.selectedChain; // ✅ Typed
```

## Best Practices

1. **Use selectors** for component state access to prevent unnecessary re-renders
2. **Group related actions** in custom hooks for complex operations
3. **Handle errors** properly using the error processing actions
4. **Validate state** before performing actions that depend on form validity
5. **Use TypeScript** for compile-time safety and better developer experience