export const readMetadata = async (filePath: string): Promise<any> => {
    try {
      // Fetch the file from the public directory
      const response = await fetch(filePath);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
  
      // Parse the JSON content
      const jsonData = await response.json();
      
      return jsonData;
    } catch (error) {
      console.error("Error reading metadata:", error);
      return null;
    }
  };