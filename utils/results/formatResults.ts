// components/results/utils/formatResults.ts

/**
 * Formats likelihood values for consistent display.
 * @param value - The likelihood value to format.
 * @returns A string representation of the likelihood, formatted to 3 decimal places or scientific notation if very small.
 */
export const formatLikelihood = (value: number): string => {
  if (value < 0.001) {
    return value.toExponential(2); // Use scientific notation for small values
  }
  return value.toFixed(3); // Format to 3 decimal places
};

/**
* Formats an array of likelihoods into a comma-separated string.
* @param values - An array of likelihood values.
* @returns A formatted string representation of the likelihood array.
*/
export const formatLikelihoodArray = (values: number[] | string): string => {
  
  if (typeof values === 'string') {
      // If the input is a string, split and parse it into an array of numbers
      values = values.split(',').map((v) => parseFloat(v));
  }
  
  return (values as number[]).map(formatLikelihood).join(', ');
};
