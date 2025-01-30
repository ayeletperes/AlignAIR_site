/**
 * Inverts the referenceAlleles.V dictionary by making iuis_name the key
 * and including the original key as asc_name.
 * 
 * @param referenceAlleles - The original referenceAlleles object
 */
export const invertReferenceAlleles = (referenceAlleles: any) => {
    const invertedV: any = {};
  
    Object.entries(referenceAlleles.V).forEach(([originalKey, value]: [string, any]) => {
        const iuisName = value.iuisName;
        if (iuisName) {
            invertedV[iuisName] = {
            ...value,
            asc_name: originalKey, // Preserve the original key as asc_name
            };
        }
    });
  
    // Replace the original referenceAlleles.V with the inverted version
    referenceAlleles.V = invertedV;
    return referenceAlleles;
  };
  