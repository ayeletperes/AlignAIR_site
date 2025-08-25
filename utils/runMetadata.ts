/**
 * Run Metadata Generator
 * Creates downloadable metadata files for completed alignment runs
 */

import { AlignmentResult, ProcessingParams } from '@/types/alignment';
import { getModelById } from '@/lib/model/modelConfig';

export interface RunMetadata {
  run: {
    id: string;
    timestamp: string;
    processingTime: number;
    status: 'completed' | 'failed';
  };
  model: {
    id: string;
    name: string;
    version: string;
    chainType: string;
    species: string;
    referenceSet: string;
    lastUpdated: string;
  };
  input: {
    type: 'file' | 'sequence';
    name?: string;
    sequenceLength?: number;
    fileSize?: number;
  };
  parameters: {
    vCap: number;
    dCap: number;
    jCap: number;
    vThresh: number;
    dThresh: number;
    jThresh: number;
  };
  system: {
    userAgent: string;
    timestamp: string;
    version: string;
  };
}

/**
 * Generate run metadata from alignment result
 */
export function generateRunMetadata(
  result: AlignmentResult,
  params: ProcessingParams,
  inputType: 'file' | 'sequence',
  inputName?: string,
  inputSize?: number
): RunMetadata {
  const model = getModelById(result.modelId);
  
  return {
    run: {
      id: result.id,
      timestamp: new Date(result.timestamp).toISOString(),
      processingTime: result.processingTime || 0,
      status: 'completed'
    },
    model: {
      id: result.modelId,
      name: model?.name || 'Unknown Model',
      version: model?.version || 'Unknown',
      chainType: result.chainType,
      species: model?.species || 'Unknown',
      referenceSet: model?.referenceSet || 'Unknown',
      lastUpdated: model?.lastUpdated || 'Unknown'
    },
    input: {
      type: inputType,
      name: inputName,
      sequenceLength: result.sequence?.length,
      fileSize: inputSize
    },
    parameters: {
      vCap: params.vCap,
      dCap: params.dCap,
      jCap: params.jCap,
      vThresh: params.vThresh,
      dThresh: params.dThresh,
      jThresh: params.jThresh
    },
    system: {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

/**
 * Convert metadata to YAML format
 */
export function metadataToYAML(metadata: RunMetadata): string {
  const yamlLines: string[] = [];
  
  // Helper function to add YAML key-value pairs
  const addYaml = (obj: any, indent: number = 0) => {
    const spaces = '  '.repeat(indent);
    
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        yamlLines.push(`${spaces}${key}:`);
        addYaml(value, indent + 1);
      } else if (Array.isArray(value)) {
        yamlLines.push(`${spaces}${key}:`);
        value.forEach(item => {
          yamlLines.push(`${spaces}  - ${item}`);
        });
      } else {
        const formattedValue = typeof value === 'string' ? `"${value}"` : value;
        yamlLines.push(`${spaces}${key}: ${formattedValue}`);
      }
    }
  };
  
  addYaml(metadata);
  return yamlLines.join('\n');
}

/**
 * Convert metadata to JSON format
 */
export function metadataToJSON(metadata: RunMetadata): string {
  return JSON.stringify(metadata, null, 2);
}

/**
 * Download metadata file
 */
export function downloadMetadata(
  metadata: RunMetadata,
  format: 'yaml' | 'json' = 'yaml'
): void {
  const content = format === 'yaml' ? metadataToYAML(metadata) : metadataToJSON(metadata);
  const mimeType = format === 'yaml' ? 'text/yaml' : 'application/json';
  const extension = format === 'yaml' ? 'yml' : 'json';
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `alignair-run-${metadata.run.id}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Get metadata download options
 */
export function getMetadataDownloadOptions(metadata: RunMetadata) {
  return [
    {
      label: 'Download YAML',
      format: 'yaml' as const,
      description: 'YAML format - human readable',
      onClick: () => downloadMetadata(metadata, 'yaml')
    },
    {
      label: 'Download JSON',
      format: 'json' as const,
      description: 'JSON format - machine readable',
      onClick: () => downloadMetadata(metadata, 'json')
    }
  ];
} 