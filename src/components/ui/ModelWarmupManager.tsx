import React, { useState, useCallback } from 'react';
import { ChainConfig, ModelWarmupOptions, ModelLoader } from '@/lib/model/utilities';
import { logger } from '@/utils/logger';

interface ModelWarmupManagerProps {
  chainConfigs: ChainConfig[];
  onWarmupComplete?: (results: WarmupResult[]) => void;
  autoStart?: boolean;
}

interface WarmupResult {
  chainName: string;
  success: boolean;
  warmupTime?: number;
  error?: string;
}

export const ModelWarmupManager: React.FC<ModelWarmupManagerProps> = ({
  chainConfigs,
  onWarmupComplete,
  autoStart = false
}) => {
  const [warmupStatus, setWarmupStatus] = useState<'idle' | 'warming' | 'complete' | 'error'>('idle');
  const [warmupResults, setWarmupResults] = useState<WarmupResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startWarmup = useCallback(async (customOptions?: ModelWarmupOptions) => {
    setWarmupStatus('warming');
    setProgress(0);
    setWarmupResults([]);
    setIsLoading(true);
    setError(null);

    const results: WarmupResult[] = [];
    const totalModels = chainConfigs.length;

    try {
      logger.info(`Starting warmup for ${totalModels} models...`);

      for (let i = 0; i < chainConfigs.length; i++) {
        const config = chainConfigs[i];
        
        try {
          const startTime = performance.now();
          
          // Create and initialize model loader directly
          const modelLoader = new ModelLoader(config);
          await modelLoader.initialize(customOptions);
          
          // Use optimal warmup options if none provided
          const warmupOptions = customOptions || modelLoader.getOptimalWarmupOptions();
          await modelLoader.warmUpModel(warmupOptions);
          
          const endTime = performance.now();
          const warmupTime = endTime - startTime;
          
          results.push({
            chainName: config.name,
            success: true,
            warmupTime
          });
          
          logger.info(`${config.name} model warmed up in ${warmupTime.toFixed(2)}ms`);
          
          // Dispose the model to free memory (we're just warming up)
          modelLoader.dispose();
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.push({
            chainName: config.name,
            success: false,
            error: errorMessage
          });
          logger.error(`Failed to warm up ${config.name} model:`, errorMessage);
        }

        setProgress(((i + 1) / totalModels) * 100);
        setWarmupResults([...results]);
      }

      setWarmupStatus('complete');
      onWarmupComplete?.(results);
      
      const successful = results.filter(r => r.success).length;
      logger.info(`Warmup complete: ${successful}/${totalModels} models warmed up successfully`);
      
    } catch (error) {
      setWarmupStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      logger.error('Warmup process failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [chainConfigs, onWarmupComplete]);

  // Auto-start warmup if requested
  React.useEffect(() => {
    if (autoStart && warmupStatus === 'idle' && chainConfigs.length > 0) {
      startWarmup();
    }
  }, [autoStart, chainConfigs, startWarmup, warmupStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warming': return 'text-blue-600';
      case 'complete': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getResultIcon = (result: WarmupResult) => {
    if (result.success) {
      return <span className="text-green-500">✓</span>;
    } else {
      return <span className="text-red-500">✗</span>;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Model Warmup Manager</h3>
        <div className={`text-sm ${getStatusColor(warmupStatus)}`}>
          Status: {warmupStatus.charAt(0).toUpperCase() + warmupStatus.slice(1)}
        </div>
      </div>

      {warmupStatus === 'warming' && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {progress.toFixed(0)}% complete
          </div>
        </div>
      )}

      {warmupResults.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Warmup Results:</h4>
          <div className="space-y-1">
            {warmupResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {getResultIcon(result)}
                  <span>{result.chainName}</span>
                </div>
                <div className="text-gray-600">
                  {result.success && result.warmupTime 
                    ? `${result.warmupTime.toFixed(0)}ms`
                    : result.error || 'Failed'
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {warmupStatus !== 'warming' && (
        <div className="flex space-x-2">
          <button
            onClick={() => startWarmup()}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {warmupStatus === 'complete' ? 'Re-warm Models' : 'Start Warmup'}
          </button>
          
          <button
            onClick={() => startWarmup({ warmupRuns: 1, logWarmupTimes: false })}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Quick Warmup
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}; 