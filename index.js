// index.js
const fs = require('fs');
const path = require('path');
const textProcessor = require('./textProcessor');
const embeddingService = require('./embeddingService');
const vectorDbService = require('./vectorDbService');

// Main function to process textbooks and create vector database
async function processTextbooksAndCreateVectors() {
  try {
    // Process textbooks
    console.log('Starting to process textbooks...');
    const textbooksDir = path.join(__dirname, 'textbooks');
    const textbooks = await textProcessor.processTextbooks(textbooksDir);
    
    // Initialize Pinecone index
    console.log('Initializing Pinecone index...');
    await vectorDbService.initializeIndex();
    
    // Generate embeddings for all chunks
    console.log('Generating embeddings for chunks...');
    const allChunks = textbooks.flatMap(book => book.chunks);
    const chunkTexts = allChunks.map(chunk => chunk.text);
    
    const embeddings = await embeddingService.generateBatchEmbeddings(chunkTexts);
    
    // Prepare vectors for Pinecone
    console.log('Preparing vectors for upload...');
    const vectors = allChunks.map((chunk, i) => ({
      id: chunk.id,
      values: embeddings[i],
      metadata: {
        text: chunk.text,
        source: chunk.metadata.source,
        chunkIndex: chunk.metadata.chunkIndex
      }
    }));
    
    // Upload vectors to Pinecone
    console.log('Uploading vectors to Pinecone...');
    await vectorDbService.uploadVectors(vectors);
    
    console.log('Vector database setup complete!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  processTextbooksAndCreateVectors().catch(console.error);
}

module.exports = {
  processTextbooksAndCreateVectors
};