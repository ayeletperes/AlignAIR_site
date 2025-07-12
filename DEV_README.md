# AlignAIR Development Documentation

This document provides an overview of the internal development documentation system for the AlignAIR project.

## 🚀 Quick Start

### Accessing Dev Docs
- **Development Mode**: Visit `/dev-docs` in your browser
- **Production Mode**: Dev docs are automatically hidden
- **Navigation**: Look for the yellow "Development Mode" banner at the top of the page

### Development Banner
During development, you'll see a yellow banner at the top of every page with:
- 🔧 Development Mode indicator
- Link to Dev Docs
- Clear indication that it's development-only

## 📚 Documentation Sections

### 1. Project Overview
- **Architecture**: Framework, styling, state management, ML integration
- **Key Features**: Real-time alignment, visualization, multi-chain support
- **Technology Stack**: Next.js 14, Tailwind CSS, TensorFlow.js, ONNX Runtime
- **License**: GNU General Public License v3.0

### 2. Component Structure
- **Component Statistics**: Total count, complexity distribution, status breakdown
- **Interactive Component Browser**: Filter by category, view props, dependencies
- **Component Categories**:
  - **UI**: Header, ThemeToggle, LoadingSpinner, ErrorBoundary
  - **Form**: AlignmentForm, FileUpload, SequenceInput, ParameterControls
  - **Results**: Results, TabSetResults, AlignmentBrowser, DownloadResultsTable
  - **Utils**: Logger, ModelLoader, SequenceProcessor, AlignmentUtils
  - **Layout**: ClientLayout, DevNav

### 3. State Management
- **Global State**: Theme context management
- **Local State Patterns**: Form state, results state, loading states
- **State Flow**: How data flows through the application

### 4. ML Integration
- **Model Loading**: Dynamic model loading by chain type
- **Processing Pipeline**: Input validation → Preprocessing → Inference → Postprocessing
- **Performance**: Caching, batching, memory management

### 5. Performance Optimizations
- **React Optimizations**: Memoization, lazy loading, code splitting
- **ML Optimizations**: Model caching, batch processing, WASM backend
- **Memory Management**: Tensor cleanup, event listener management

### 6. Debugging Guide
- **Common Issues**: Model loading failures, memory leaks, performance issues
- **Development Tools**: React DevTools, TensorFlow.js Inspector, Network monitoring
- **Error Handling**: Error boundaries, logging, graceful degradation

### 7. Testing Strategy
- **Test Types**: Unit tests, integration tests, E2E tests
- **Testing Tools**: Jest, React Testing Library, MSW, Playwright
- **ML Testing**: TensorFlow.js model validation

## 🛠️ Development Tools

### Logger Utility
```typescript
import { logger } from '@components/utils/logger';

// Development-only logging
logger.log('Debug info');
logger.warn('Warning message');
logger.error('Error details');
```

### Component Documentation
The component documentation is auto-generated from metadata in `components/dev/ComponentDocs.tsx`. To add a new component:

1. Add component metadata to the `componentDocs` array
2. Include props, dependencies, complexity, and status
3. The dev docs will automatically update

### Error Boundaries
All pages are wrapped with error boundaries that:
- Catch JavaScript errors
- Display user-friendly error messages
- Show detailed error info in development
- Provide reload functionality

## 🔧 Development Workflow

### 1. Component Development
1. Create component in appropriate directory
2. Add metadata to `ComponentDocs.tsx`
3. Test component functionality
4. Update documentation if needed

### 2. State Management
1. Use React hooks for local state
2. Use Context for global state (theme)
3. Follow established patterns for form and results state
4. Implement proper loading and error states

### 3. ML Integration
1. Use `getOrLoadModel()` for model loading
2. Implement proper error handling
3. Clean up tensors after use
4. Monitor memory usage

### 4. Performance
1. Use React.memo for expensive components
2. Implement lazy loading for heavy components
3. Optimize re-renders with proper dependencies
4. Monitor bundle size and loading times

## 🐛 Debugging Tips

### Common Issues

#### Model Loading Failures
```bash
# Check browser console for TensorFlow.js errors
# Verify model files are accessible
# Check CORS settings
# Ensure WASM backend is available
```

#### Memory Leaks
```bash
# Monitor memory usage in DevTools
# Dispose tensors after use
# Clear model cache if needed
# Check for event listener leaks
```

#### Performance Issues
```bash
# Use React DevTools Profiler
# Identify unnecessary re-renders
# Check component memoization
# Monitor bundle size
```

### Development Tools
- **React DevTools**: Component inspection and profiling
- **TensorFlow.js Inspector**: Model and tensor debugging
- **Network Tab**: Monitor model loading and API calls
- **Console Logging**: Custom logger with development-only output
- **Error Boundaries**: Catch and display errors gracefully

## 📝 Adding Documentation

### Component Documentation
To document a new component, add to `components/dev/ComponentDocs.tsx`:

```typescript
{
  name: 'ComponentName',
  path: 'components/path/to/component.tsx',
  description: 'Brief description of the component',
  category: 'ui' | 'form' | 'results' | 'utils' | 'layout',
  complexity: 'simple' | 'medium' | 'complex',
  status: 'stable' | 'beta' | 'deprecated',
  props: [
    {
      name: 'propName',
      type: 'string',
      required: true,
      description: 'Prop description'
    }
  ],
  dependencies: ['dependency1', 'dependency2']
}
```

### Section Documentation
To add a new section to the dev docs, update `app/(default)/dev-docs/page.tsx`:

```typescript
{
  id: 'new-section',
  title: 'New Section',
  icon: '🔧',
  content: (
    <div className="space-y-6">
      {/* Your content here */}
    </div>
  )
}
```

## 🚀 Production Deployment

The development documentation system is automatically hidden in production:

- Dev docs page returns `null` when `NODE_ENV === 'production'`
- Development banner is hidden in production
- No development-specific code is included in production builds

## 📋 Checklist for New Features

When adding new features, ensure you:

- [ ] Add component documentation to `ComponentDocs.tsx`
- [ ] Update relevant sections in dev docs
- [ ] Add proper error handling
- [ ] Implement loading states
- [ ] Test in development mode
- [ ] Verify production build excludes dev features
- [ ] Update this README if needed

## 🤝 Contributing

When contributing to the development documentation:

1. Keep documentation up-to-date with code changes
2. Use clear, concise language
3. Include code examples where helpful
4. Test documentation accuracy
5. Follow the established structure and style

## 📞 Support

For questions about the development documentation:

1. Check the dev docs at `/dev-docs`
2. Review this README
3. Check component documentation in `ComponentDocs.tsx`
4. Look at existing examples in the codebase

---

**Note**: This documentation is only available in development mode and will not appear in production builds. 