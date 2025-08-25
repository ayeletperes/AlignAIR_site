'use client';

import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import { componentDocs, getComponentsByCategory, getComplexityStats, getStatusStats } from '@/components/dev/ComponentDocs';
import { MODEL_DEVELOPMENT_GUIDE, MODEL_DEVELOPMENT_CHECKLIST, COMMON_PITFALLS } from '@/components/dev/ModelDevelopmentGuide';

// Only render in development mode
const DevDocs = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const complexityStats = getComplexityStats();
  const statusStats = getStatusStats();

  const sections = [
    {
      id: 'overview',
      title: 'Project Overview',
      icon: '🏗️',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Architecture</h3>
            <div className="bg-gray-800 rounded-lg p-4 text-sm">
              <p className="mb-2"><strong>Framework:</strong> Next.js 14 with App Router</p>
              <p className="mb-2"><strong>Styling:</strong> Tailwind CSS with custom components</p>
              <p className="mb-2"><strong>State Management:</strong> React hooks with custom state management</p>
              <p className="mb-2"><strong>ML Integration:</strong> TensorFlow.js with ONNX Runtime</p>
              <p className="mb-2"><strong>License:</strong> GNU General Public License v3.0</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Real-time sequence alignment with multiple model support</li>
              <li>Interactive visualization of alignment results</li>
              <li>Multi-chain type support (Heavy, Light, TCR Beta)</li>
              <li>Advanced preprocessing and postprocessing pipelines</li>
              <li>Responsive design with dark/light theme support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Frontend</h4>
                <ul className="space-y-1">
                  <li>• Next.js 14 (App Router)</li>
                  <li>• React 18</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">ML & Processing</h4>
                <ul className="space-y-1">
                  <li>• TensorFlow.js</li>
                  <li>• ONNX Runtime</li>
                  <li>• Custom preprocessing</li>
                  <li>• Real-time inference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'components',
      title: 'Component Library',
      icon: '🧩',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Components Overview</h3>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-600 rounded bg-gray-800 text-white text-sm"
            >
              <option value="all">All Categories</option>
              <option value="ui">UI Components</option>
              <option value="form">Form Components</option>
              <option value="results">Results Components</option>
              <option value="utils">Utility Components</option>
              <option value="layout">Layout Components</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentDocs
              .filter(comp => selectedCategory === 'all' || comp.category === selectedCategory)
              .map((component) => (
                <div key={component.name} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{component.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      component.status === 'stable' ? 'bg-green-600' :
                      component.status === 'beta' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                      {component.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{component.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Complexity: {component.complexity}</span>
                    <span>Category: {component.category}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Complexity Distribution</h4>
              <div className="space-y-2">
                {Object.entries(complexityStats).map(([complexity, count]) => (
                  <div key={complexity} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 capitalize">{complexity}</span>
                    <span className="text-sm text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Status Distribution</h4>
              <div className="space-y-2">
                {Object.entries(statusStats).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 capitalize">{status}</span>
                    <span className="text-sm text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'model-development',
      title: 'Model Development',
      icon: '🤖',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Adding New Models</h3>
            <p className="text-blue-200 text-sm">
              This guide provides step-by-step instructions for adding new models to the AlignAIR framework.
              Follow these steps carefully to ensure proper integration.
            </p>
          </div>

          <div className="space-y-4">
            {MODEL_DEVELOPMENT_GUIDE.map((step) => (
              <div key={step.step} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-2">{step.title}</h4>
                    <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Files to Update:</h5>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {step.files.map((file, index) => (
                          <li key={index} className="font-mono bg-gray-900 px-2 py-1 rounded">
                            {file}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {step.codeExamples && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-400 mb-2">Code Examples:</h5>
                        {step.codeExamples.map((example, index) => (
                          <pre key={index} className="text-xs bg-gray-900 p-3 rounded overflow-x-auto text-green-400">
                            {example}
                          </pre>
                        ))}
                      </div>
                    )}

                    {step.notes && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-2">Notes:</h5>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {step.notes.map((note, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Development Checklist</h4>
              <div className="space-y-2">
                {MODEL_DEVELOPMENT_CHECKLIST.map((item, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">{item.split(' ')[0]}</span>
                    <span className="text-gray-300">{item.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Common Pitfalls</h4>
              <div className="space-y-3">
                {COMMON_PITFALLS.map((pitfall, index) => (
                  <div key={index} className="border-l-2 border-red-500 pl-3">
                    <h5 className="text-sm font-medium text-red-400 mb-1">{pitfall.issue}</h5>
                    <p className="text-xs text-gray-400">{pitfall.solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: '⚡',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Optimization Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">React Optimizations</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• React.memo for component memoization</li>
                  <li>• useCallback for function memoization</li>
                  <li>• useMemo for expensive calculations</li>
                  <li>• Proper dependency arrays</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Model Loading</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Lazy loading of models</li>
                  <li>• Model warmup for faster inference</li>
                  <li>• Memory management and cleanup</li>
                  <li>• Background preloading</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Monitoring</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-3">
                Use the logger utility for performance monitoring:
              </p>
              <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto text-green-400">
{`import { logger } from '@/utils/logger';

// Performance logging
logger.info('Model loading started');
logger.warn('Memory usage high');
logger.error('Model inference failed');`}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'testing',
      title: 'Testing',
      icon: '🧪',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Testing Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Component Testing</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Unit tests for utility functions</li>
                  <li>• Integration tests for components</li>
                  <li>• E2E tests for user workflows</li>
                  <li>• Model inference testing</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Performance Testing</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Memory usage monitoring</li>
                  <li>• Model loading times</li>
                  <li>• UI responsiveness</li>
                  <li>• Large dataset handling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: '🚀',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Build Process</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <pre className="text-sm text-green-400">
{`# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Environment Variables</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <ul className="text-sm text-gray-300 space-y-1">
                <li><code className="bg-gray-900 px-1 rounded">NODE_ENV</code> - Environment mode</li>
                <li><code className="bg-gray-900 px-1 rounded">NEXT_PUBLIC_GA_ID</code> - Google Analytics ID</li>
                <li><code className="bg-gray-900 px-1 rounded">NEXT_PUBLIC_API_URL</code> - API endpoint</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Common Issues</h3>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Model Loading Failures</h4>
                <p className="text-sm text-gray-300 mb-2">Check model file paths and metadata format</p>
                <pre className="text-xs bg-gray-900 p-2 rounded text-red-400">
{`// Verify model paths in modelConfig.ts
modelPath: '/models/alignment/heavy/igh-v1.0/model.json'`}
                </pre>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Memory Issues</h4>
                <p className="text-sm text-gray-300 mb-2">Ensure proper model cleanup</p>
                <pre className="text-xs bg-gray-900 p-2 rounded text-red-400">
{`// Dispose models when done
modelManager.disposeModel(chainConfig);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AlignAIR Development Documentation</h1>
          <p className="text-gray-400">Internal documentation for developers - only visible in development mode</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {sections.find(s => s.id === activeSection)?.content}
        </div>
      </div>
    </div>
  );
};

export default DevDocs; 