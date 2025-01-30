import { loadReferenceData } from '@components/reference/utilities';

describe('loadReferenceData', () => {
  test('should load reference data correctly for heavy and light chains', async () => {
    const data = await loadReferenceData();

    // Validate heavy chain
    expect(data.heavy).toBeDefined();
    expect(data.heavy.V).toBeInstanceOf(Array);
    expect(data.heavy.D).toBeInstanceOf(Array);
    expect(data.heavy.J).toBeInstanceOf(Array);

    // Check heavy chain V segment
    expect(data.heavy.V[0]).toHaveProperty('sequence');
    expect(data.heavy.V[0]).toHaveProperty('iuisName');

    // Check heavy chain J segment
    expect(data.heavy.J[0]).toHaveProperty('sequence');
    expect(data.heavy.J[0]).toHaveProperty('anchor');

    // Validate light chain
    expect(data.light).toBeDefined();
    expect(data.light.V).toBeInstanceOf(Array);
    expect(data.light.J).toBeInstanceOf(Array);

    // Check light chain V segment
    expect(data.light.V[0]).toHaveProperty('sequence');
    expect(data.light.V[0]).toHaveProperty('iuisName');

    // Check light chain J segment
    expect(data.light.J[0]).toHaveProperty('sequence');
    expect(data.light.J[0]).toHaveProperty('anchor');
  });
});
