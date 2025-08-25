# AlignAIR Architecture Overview

## Introduction

The AlignAIR application has been redesigned with a modern, scalable architecture that provides:

- **Centralized State Management** via React Context and custom hooks
- **Separation of Concerns** with specialized components and hooks
- **Type Safety** throughout the application
- **Comprehensive Error Handling** and logging
- **Performance Monitoring** and optimization
- **Consistent Patterns** across all components

## Architecture Components

### 1. State Management (`contexts/AlignmentContext.tsx`)

The core state management system using React Context and useReducer:

```typescript
// State structure
interface AppState {
  form: FormState;           // Form inputs and validation
  processing: ProcessingState; // Processing status and progress
  models: ModelStatus;        // Model loading status
  results: AlignmentResult[]; // Processing results
  ui: UIState;               // UI state (theme, modals, etc.)
}
```

**Key Features:**
- Single source of truth for all application state
- Immutable state updates via reducer pattern
- Type-safe actions and state
- Optimized selectors for performance

**Usage:**
```typescript
import { useAlignment, useAlignmentSelectors } from '@/contexts/AlignmentContext';

// Access state and actions
const { state, actions } = useAlignment();

// Use optimized selectors
const { input, selectedChain, isProcessing } = useAlignmentSelectors();
```

### 2. Specialized Hooks

#### `useFormState()` - Form Management
Provides consistent form handling across the application:

```typescript
const {
  input,
  selectedChain,
  params,
  isValid,
  errors,
  setInput,
  setChain,
  setParams,
  clearForm,
  resetForm
} = useFormState();
```

#### `useProcessingState()` - Processing Management
Handles the alignment processing pipeline:

```typescript
const {
  isProcessing,
  currentStep,
  progress,
  canStartProcessing,
  startProcessing,
  updateStep,
  completeProcessing,
  errorProcessing
} = useProcessingState();
```

#### `useModelPreloader()` - Model Management
Manages model preloading and caching:

```typescript
const {
  modelStatus,
  isAnyModelLoading,
  getLoadingProgress,
  preloadModelById,
  reloadModel
} = useModelPreloader();
```

#### `useUIState()` - UI Management
Handles UI state like theme and modals:

```typescript
const {
  theme,
  isDarkMode,
  sidebarOpen,
  modalOpen,
  setTheme,
  toggleTheme,
  toggleSidebar,
  setModal
} = useUIState();
```

#### `useResultsState()` - Results Management
Manages processing results:

```typescript
const {
  results,
  latestResult,
  hasResults,
  clearResults,
  getResultById,
  getResultsByChain
} = useResultsState();
```

### 3. Component Architecture

#### Main Application (`components/alignair/AlignAIRApp.tsx`)
The root component that orchestrates all functionality:

```typescript
export default function AlignAIRApp() {
  return (
    <ErrorBoundary>
      <AlignmentProvider>
        <div className="alignair-app">
          <ModelPreloader />
          <ProcessingOrchestrator />
          <TourGuide />
          <AlignmentForm />
          <ResultsDisplay />
        </div>
      </AlignmentProvider>
    </ErrorBoundary>
  );
}
```

#### Form Component (`components/alignair/AlignmentForm.tsx`)
Handles the main form interface using the new hooks:

```typescript
export function AlignmentForm() {
  const { selectedChain, isValid, hasInput } = useFormState();
  const { canStartProcessing } = useProcessingState();
  const { processAlignment } = useProcessingOrchestrator();
  
  // Clean, focused component logic
}
```

#### Input Adapter (`components/alignair/InputAdapter.tsx`)
Bridges old input components with new state management:

```typescript
export function InputAdapter({ selectedChain, selectedModelId }) {
  const { setInput, setChain, setParams } = useFormState();
  
  // Adapts old component interface to new state management
}
```

### 4. Error Handling (`utils/errorHandler.ts`)

Comprehensive error handling system with:

- **Error Types**: Categorized error codes for different scenarios
- **Severity Levels**: Critical, High, Medium, Low
- **Recovery Suggestions**: User-friendly recovery options
- **Analytics Integration**: Error tracking for monitoring

```typescript
// Create specific error types
const error = ErrorHandler.createInputError(
  ErrorCodes.INVALID_SEQUENCE,
  'Sequence contains invalid characters',
  'sequence-validation'
);

// Handle any error
const alignmentError = ErrorHandler.handle(originalError, 'ProcessingOrchestrator');
```

### 5. Performance Monitoring (`utils/performance.ts`)

Comprehensive performance tracking:

```typescript
// Monitor performance
performanceMonitor.startMonitoring();

// Track custom metrics
performanceMonitor.trackProcessingTime('model_load', 1500);

// Get performance recommendations
const recommendations = PerformanceUtils.getRecommendations();
```

## Configuration (`config/app.config.ts`)

Centralized configuration for all application settings:

```typescript
export const AppConfig = {
  models: {
    defaultWarmupRuns: 2,
    preloadPriority: { high: [], medium: [], low: [] }
  },
  ui: {
    defaultChain: 'heavy',
    theme: { defaultTheme: 'dark' }
  },
  processing: {
    defaultParams: { vCap: 3, dCap: 3, jCap: 3 },
    timeouts: { inference: 60000 }
  },
  features: {
    modelWarmup: true,
    analytics: true,
    memoryMonitoring: true
  }
};
```

## Migration Guide

### From Old Architecture to New

1. **Replace useState with hooks:**
   ```typescript
   // Old
   const [input, setInput] = useState(null);
   const [isProcessing, setIsProcessing] = useState(false);
   
   // New
   const { input, setInput, isProcessing } = useFormState();
   ```

2. **Use specialized hooks for specific concerns:**
   ```typescript
   // Form handling
   const { isValid, errors, setInput } = useFormState();
   
   // Processing
   const { startProcessing, updateStep } = useProcessingState();
   
   // UI
   const { theme, toggleTheme } = useUIState();
   ```

3. **Use error handling consistently:**
   ```typescript
   try {
     await processAlignment();
   } catch (error) {
     const alignmentError = ErrorHandler.handle(error, 'MyComponent');
     // Error is automatically logged and categorized
   }
   ```

4. **Use performance monitoring:**
   ```typescript
   const result = PerformanceUtils.measureTime(() => {
     return expensiveOperation();
   }, 'expensive_operation');
   ```

## Best Practices

### 1. Component Structure
```typescript
export function MyComponent() {
  // 1. Use specialized hooks
  const { state, handlers } = useSpecializedHook();
  
  // 2. Keep components focused
  const handleAction = useCallback(() => {
    // Single responsibility
  }, [dependencies]);
  
  // 3. Use error boundaries
  return (
    <ErrorBoundary>
      <ComponentContent />
    </ErrorBoundary>
  );
}
```

### 2. State Management
- Use selectors for performance optimization
- Keep state updates atomic
- Use action creators for complex state changes

### 3. Error Handling
- Always wrap async operations in try-catch
- Use ErrorHandler.handle() for consistent error processing
- Provide user-friendly error messages

### 4. Performance
- Use PerformanceUtils for timing measurements
- Monitor memory usage in development
- Implement lazy loading for heavy components

### 5. Type Safety
- Define interfaces for all data structures
- Use TypeScript strictly
- Avoid `any` types

## Testing

The new architecture supports comprehensive testing:

```typescript
// Test hooks
import { renderHook } from '@testing-library/react';
import { useFormState } from '@/hooks/useFormState';

test('useFormState should handle input changes', () => {
  const { result } = renderHook(() => useFormState());
  
  act(() => {
    result.current.setInput({ type: 'sequence', content: 'ATCG' });
  });
  
  expect(result.current.input).toEqual({ type: 'sequence', content: 'ATCG' });
});
```

## Benefits

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Modular architecture supports growth
3. **Performance**: Optimized state management and rendering
4. **Developer Experience**: Type safety and consistent patterns
5. **Error Handling**: Comprehensive error management
6. **Monitoring**: Built-in performance and error tracking

## Future Enhancements

- **Caching Layer**: Redis-like caching for results
- **Offline Support**: Service worker integration
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: User behavior tracking
- **A/B Testing**: Feature flag system

This architecture provides a solid foundation for the AlignAIR application's continued development and growth. 