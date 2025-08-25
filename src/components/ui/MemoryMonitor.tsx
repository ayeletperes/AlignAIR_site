import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { MemoryOptimizer } from '@/utils/memoryOptimizer';

interface MemoryMonitorProps {
  showDetailed?: boolean;
  className?: string;
}

interface MemoryStats {
  totalTensorFlowMemory: { numTensors: number; numBytes: number };
  backend: string;
}

/**
 * Component to display memory usage and loaded model information
 */
export const MemoryMonitor: React.FC<MemoryMonitorProps> = ({ 
  showDetailed = false, 
  className = '' 
}) => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);

  useEffect(() => {
    const updateStats = () => {
      const tfMemory = tf.memory();
      setMemoryStats({
        totalTensorFlowMemory: tfMemory,
        backend: tf.getBackend()
      });
    };

    // Update immediately
    updateStats();

    // Update every 5 seconds
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  if (!memoryStats) {
    return (
      <div className={`p-2 bg-gray-100 rounded ${className}`}>
        <span className="text-sm text-gray-600">Memory monitor not available</span>
      </div>
    );
  }

  const memoryMB = memoryStats.totalTensorFlowMemory.numBytes / (1024 * 1024);
  const isHighMemory = memoryMB > 500; // Warning if over 500MB

  return (
    <div className={`p-3 bg-white border rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Memory Usage</h3>
        <div className={`text-xs px-2 py-1 rounded ${
          isHighMemory ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {formatBytes(memoryStats.totalTensorFlowMemory.numBytes)}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tensors:</span>
          <span className="font-medium">{memoryStats.totalTensorFlowMemory.numTensors}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Backend:</span>
          <span className="font-medium uppercase text-xs px-1 py-0.5 bg-blue-100 text-blue-800 rounded">
            {memoryStats.backend}
          </span>
        </div>

        {/* Warning for high memory usage */}
        {isHighMemory && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="flex items-center justify-between">
              <span className="text-yellow-800">⚠️ High memory usage detected</span>
              <button
                onClick={() => MemoryOptimizer.performCleanup()}
                className="text-xs px-2 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded transition-colors"
              >
                Cleanup
              </button>
            </div>
            <div className="mt-1 text-xs text-yellow-700">
              {MemoryOptimizer.getRecommendations().map((rec, index) => (
                <div key={index}>• {rec}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Compact version for status bars
 */
export const CompactMemoryMonitor: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);

  useEffect(() => {
    const updateStats = () => {
      const tfMemory = tf.memory();
      setMemoryStats({
        totalTensorFlowMemory: tfMemory,
        backend: tf.getBackend()
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!memoryStats) return null;

  const memoryMB = memoryStats.totalTensorFlowMemory.numBytes / (1024 * 1024);
  const isHighMemory = memoryMB > 500;

  return (
    <div className={`flex items-center space-x-2 text-xs ${className}`}>
      <span className="text-gray-600">Memory:</span>
      <span className={`font-medium ${isHighMemory ? 'text-yellow-600' : 'text-gray-900'}`}>
        {memoryMB.toFixed(0)}MB
      </span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-600">Tensors:</span>
      <span className="font-medium">{memoryStats.totalTensorFlowMemory.numTensors}</span>
      <span className={`text-xs px-1 py-0.5 rounded uppercase ${
        memoryStats.backend === 'webgl' ? 'bg-green-100 text-green-700' :
        memoryStats.backend === 'wasm' ? 'bg-blue-100 text-blue-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {memoryStats.backend}
      </span>
    </div>
  );
}; 