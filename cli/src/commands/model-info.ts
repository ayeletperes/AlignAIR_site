import { AVAILABLE_MODELS } from '@/config/model/config';

interface ModelInfoOptions {
  modelId: string;
  json?: boolean;
}

export async function modelInfo(opts: ModelInfoOptions): Promise<void> {
  const model = AVAILABLE_MODELS.find((m) => m.id === opts.modelId);
  if (!model) {
    console.error(`error: no model with id "${opts.modelId}"`);
    console.error('       run `alignair list-models` to see available IDs');
    process.exit(2);
  }

  if (opts.json) {
    process.stdout.write(JSON.stringify(model, null, 2) + '\n');
    return;
  }

  const lines = [
    `${model.name} ${model.version}  (id: ${model.id})`,
    '',
    `  Chain type:    ${model.chainType}`,
    `  Species:       ${model.species}`,
    `  Reference set: ${model.referenceSet}`,
    `  Has D segment: ${model.hasD ? 'yes' : 'no'}`,
    `  Multi-chain:   ${model.multiChain ? 'yes' : 'no'}`,
    `  Last updated:  ${model.lastUpdated}`,
    '',
    `  Description:`,
    `    ${model.description}`,
    '',
    `  Features:`,
    ...model.features.map((f) => `    - ${f}`),
    '',
    `  Artifacts:`,
    `    model.json:        ${model.modelPath}`,
    `    orientation onnx:  ${model.orientationModelPath}`,
    `    reference data:    ${Array.isArray(model.referencePath) ? model.referencePath.join(', ') : model.referencePath}`,
  ];
  console.log(lines.join('\n'));
}
