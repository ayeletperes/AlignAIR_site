/**
 * Main AlignAIR Application Component
 * Orchestrates the alignment process with improved modularity
 */

'use client';

import React, { useEffect, useState } from 'react';
import { AlignmentProvider } from '@/contexts/AlignmentContext';
import { ModelPreloader } from './ModelPreloader';
import { ProcessingOrchestrator } from './ProcessingOrchestrator';
// TourGuide removed - was unused
import { AlignmentForm } from './AlignmentForm';
import { ResultsDisplay } from './ResultsDisplay';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { MemoryMonitor } from '@/components/ui/MemoryMonitor';
import { metadata } from '../../app/(default)/alignair/metadata';
import { env } from '@/config/env';
import { AppConfig } from '@/config/app.config';
import { MemoryOptimizer } from '@/utils/memoryOptimizer';

export default function AlignAIRApp() {
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders client-side features after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track page view for analytics
  useEffect(() => {
    if (isClient && env.services.googleAnalytics.enabled && typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', env.services.googleAnalytics.id, {
        'page_title': metadata.title,
        'page_path': window.location.pathname,
      });
    }
  }, [isClient]);

  // Initialize memory optimizer
  useEffect(() => {
    if (isClient && AppConfig.features.memoryMonitoring) {
      MemoryOptimizer.initialize();
    }
  }, [isClient]);

  return (
    <ErrorBoundary>
      <AlignmentProvider>
        <div className="alignair-app">
          {/* Performance monitoring (development only) */}
          {isClient && AppConfig.features.memoryMonitoring && <MemoryMonitor />}
          
          {/* Model preloading management */}
          {isClient && <ModelPreloader />}
          
          {/* Processing orchestration */}
          <ProcessingOrchestrator />
          
          {/* Interactive tour */}
          {/* <TourGuide /> */}
          
          {/* Main form interface */}
          <AlignmentForm />
          
          {/* Results display */}
          <ResultsDisplay />
        </div>
      </AlignmentProvider>
    </ErrorBoundary>
  );
}