/**
 * Creates a new referenceAlleles object with the V dictionary inverted by making iuis_name the key
 * and including the original key as asc_name.
 * 
 * @param referenceAlleles - The original referenceAlleles object
 * @returns A new referenceAlleles object with inverted V dictionary
 */
export const invertReferenceAlleles = (referenceAlleles: any) => {
    const invertedV: any = {};
  
    Object.entries(referenceAlleles.V).forEach(([originalKey, value]: [string, any]) => {
        const iuisName = value.iuis;
        if (iuisName) {
            invertedV[iuisName] = {
                ...value
            };
        }
    });
  
    // Return a new object instead of mutating the original
    return {
        ...referenceAlleles,
        invertedV: invertedV
    };
};
  