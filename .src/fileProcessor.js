const countSequencesInBatch = (batchContent) => {
    // Split the batch content by '>' to separate individual sequences
    const sequences = batchContent.split('>').filter(Boolean); // Filter out empty strings
  
    // Count the number of sequences in this batch
    return sequences.length;
  };
  
  // Async function to count total sequences in a FASTA file
  export const countTotalSequences = async (file, batchSize = 100) => {
    let totalSequences = 0;
    let buffer = '';
  
    const readChunk = async (start, end) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file.slice(start, end));
      });
    };
  
    const fileSize = file.size;
    let start = 0;
    let end = Math.min(batchSize, fileSize);
  
    while (start < fileSize) {
      const chunk = await readChunk(start, end);
      buffer += chunk;
  
      while (buffer.includes('>')) {
        const fastaStartIndex = buffer.indexOf('>');
        const batchContent = buffer.slice(0, fastaStartIndex); // Extract the batch content up to the next '>'
        buffer = buffer.slice(fastaStartIndex + 1); // Skip the '>'
        totalSequences += countSequencesInBatch(batchContent);
      }
  
      start = end;
      end = Math.min(start + batchSize, fileSize);
    }
  
    // Handle remaining content in buffer after reading all chunks
    totalSequences += countSequencesInBatch(buffer);
  
    return totalSequences; // Return the total sequence count
  };