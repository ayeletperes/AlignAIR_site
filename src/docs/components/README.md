# Component Documentation

This directory contains comprehensive documentation for all components in the AlignAIR application.

## Architecture Overview

AlignAIR follows a modular component architecture with clear separation of concerns:

- **Contexts**: Centralized state management using React Context
- **Hooks**: Reusable logic for common operations
- **Components**: UI components organized by feature
- **Utils**: Shared utilities and helpers

## Component Categories

### Core Components
- [`AlignAIRApp`](./AlignAIRApp.md) - Main application orchestrator
- [`AlignmentForm`](./AlignmentForm.md) - Primary input interface
- [`ResultsDisplay`](./ResultsDisplay.md) - Results visualization
- [`ProcessingOrchestrator`](./ProcessingOrchestrator.md) - Processing pipeline management

### State Management
- [`AlignmentContext`](./AlignmentContext.md) - Global application state
- [`useModelPreloader`](./useModelPreloader.md) - Model loading management
- [`useProcessingState`](./useProcessingState.md) - Processing state management

### UI Components
- [`ModelPreloader`](./ModelPreloader.md) - Model status display
- [`TourGuide`](./TourGuide.md) - Interactive user guidance
- [`LazyComponentLoader`](./LazyComponentLoader.md) - Performance optimization

### Optimization
- [`PerformanceMonitor`](./PerformanceMonitor.md) - Performance tracking
- [`MemoryMonitor`](./MemoryMonitor.md) - Memory usage monitoring
- [`ErrorHandler`](./ErrorHandler.md) - Centralized error management

## Usage Patterns

### Basic Component Usage
```tsx
import { AlignmentProvider } from '@/contexts/AlignmentContext';
import AlignAIRApp from '@/components/alignair/AlignAIRApp';

function App() {
  return (
    <AlignmentProvider>
      <AlignAIRApp />
    </AlignmentProvider>
  );
}
```

### Custom Hook Usage
```tsx
import { useAlignment } from '@/contexts/AlignmentContext';
import { useProcessingState } from '@/hooks/useProcessingState';

function MyComponent() {
  const { state, actions } = useAlignment();
  const { startProcessing, isProcessing } = useProcessingState();
  
  // Component logic here
}
```

### Error Handling
```tsx
import { ErrorHandler, AlignAIRError } from '@/utils/errorHandler';

try {
  // Some operation
} catch (error) {
  const alignmentError = ErrorHandler.handle(error, 'ComponentName');
  // Handle the normalized error
}
```

## Best Practices

1. **Type Safety**: All components use TypeScript with strict typing
2. **Error Boundaries**: Wrap components in error boundaries for graceful failure
3. **Performance**: Use lazy loading for heavy components
4. **Accessibility**: Follow WCAG guidelines with proper ARIA attributes
5. **Testing**: Comprehensive test coverage for all components

## Development Guidelines

- Follow the established component patterns
- Use the provided hooks for state management
- Implement proper error handling
- Add comprehensive tests for new components
- Document component props and usage

## Quick Reference

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `AlignAIRApp` | Main app | None |
| `AlignmentForm` | User input | `onSubmit`, `isProcessing` |
| `ResultsDisplay` | Show results | `results`, `isLoading` |
| `ModelPreloader` | Model status | `autoPreload` |
| `TourGuide` | User guidance | `autoStart` |

For detailed documentation on each component, see the individual markdown files in this directory.