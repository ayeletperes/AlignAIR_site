/**
 * Returns the URL for a given relative path in the public directory.
 * 
 * @param {string} relativePath - The relative path to the file.
 * @returns {string} The URL of the file in the public directory.
 */
export const getFilePath = (relativePath: string): string => {
    return `/${relativePath}`;
  };
  