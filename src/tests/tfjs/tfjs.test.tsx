import * as tf from '@tensorflow/tfjs';

describe('TensorFlow.js GPU Availability', () => {
  beforeAll(async () => {
    // Set the backend to WebGL if available
    const availableBackends = tf.engine().registry;
    if (availableBackends['webgl']) {
      await tf.setBackend('webgl');
    } else {
      await tf.setBackend('cpu'); // Fallback to CPU if WebGL is unavailable
    }
    await tf.ready(); // Ensure TensorFlow.js is fully initialized
  });

  test('checks if WebGL backend and float32 rendering are supported', async () => {
    const backend = tf.getBackend();
    console.log(`Current backend: ${backend}`);

    if (backend === 'webgl') {
      const isFloat32Supported = tf.env().getBool('WEBGL_RENDER_FLOAT32_CAPABLE');
      expect(isFloat32Supported).toBe(true); // Expect GPU support
    } else {
      console.warn('GPU (WebGL backend) is not available.');
      expect(backend).toBe('cpu'); // CPU fallback
    }
  });

  test('checks current backend in TensorFlow.js', () => {
    const backend = tf.getBackend();
    console.log(`Current backend: ${backend}`);
    expect(['webgl', 'cpu', 'tensorflow']).toContain(backend); // Backend must be valid
  });
});
