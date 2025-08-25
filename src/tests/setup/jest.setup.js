require('@testing-library/jest-dom');

// Provide minimal performance.memory for tests that read it
if (typeof global.performance === 'undefined') {
  global.performance = {};
}
if (!global.performance.memory) {
  Object.defineProperty(global.performance, 'memory', {
    value: { usedJSHeapSize: 50 * 1024 * 1024, totalJSHeapSize: 100 * 1024 * 1024 },
    writable: true,
  });
}

// Mock ONNX Runtime to avoid WASM/dynamic import in Node test env
const makeOnnxMock = () => {
  const session = {
    run: jest.fn(async (_feeds, outputs) => {
      // Support both label and output_label
      if (outputs && outputs.includes && outputs.includes('label')) {
        return { label: { data: ['Normal'] } };
      }
      if (outputs && outputs.includes && outputs.includes('output_label')) {
        return { output_label: { data: ['Normal'] } };
      }
      return {};
    }),
    inputNames: ['string_input'],
    outputNames: ['label'],
  };
  return {
    InferenceSession: { create: jest.fn(async () => session) },
    Tensor: function Tensor(_type, data, dims) { this.data = data; this.dims = dims; },
    env: { wasm: {} },
  };
};

jest.mock('onnxruntime-web', () => makeOnnxMock());
jest.mock('onnxruntime-web/wasm', () => makeOnnxMock());

// Mock logger to avoid console noise and shape issues
jest.mock('@/utils/logger', () => {
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
  return { logger };
});

// Mock TensorFlow.js to avoid network fetch of models in tests
jest.mock('@tensorflow/tfjs', () => {
  const mockTensor = {
    dispose: jest.fn(),
    data: jest.fn(async () => []),
  };
  return {
    loadGraphModel: jest.fn(async () => ({
      predict: jest.fn(() => mockTensor),
      dispose: jest.fn(),
      inputs: [],
      outputs: [],
      getWeights: jest.fn(() => []),
    })),
    memory: jest.fn(() => ({ numTensors: 0, numBytes: 0 })),
    getBackend: jest.fn(() => 'cpu'),
    scalar: jest.fn(() => mockTensor),
    add: jest.fn(() => mockTensor),
    nextFrame: jest.fn(async () => {}),
    randomUniform: jest.fn(() => mockTensor),
  };
});

// Provide a minimal fetch mock if code under test calls fetch directly
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}), arrayBuffer: async () => new ArrayBuffer(0) }));
}
