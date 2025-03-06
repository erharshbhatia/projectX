// vectorDbService.js
const { Pinecone } = require('@pinecone-database/pinecone');
const config = require('./config');

class VectorDbService {
  constructor() {
    this.pinecone = new Pinecone({
      apiKey: config.pinecone.apiKey

    });
    this.index = this.pinecone.index(config.pinecone.indexName);
  }
  
  async initializeIndex() {
    try {
      // Check if the index exists
      const indexList = await this.pinecone.listIndexes();
      console.log('Index List:', indexList);
      console.log('Type of indexList:', typeof indexList);
      console.log('Is indexList an array?', Array.isArray(indexList));
  
      // If indexList is not an array, log its keys/properties
      if (indexList && typeof indexList === 'object' && !Array.isArray(indexList)) {
        console.log('Keys in indexList:', Object.keys(indexList));
      }
  
      // Handle the response based on its structure
      if (indexList && indexList.indexes && Array.isArray(indexList.indexes)) {
        // Extract the array of indexes from the response
        const indexNames = indexList.indexes.map(index => index.name);
  
        // Check if the desired index exists
        if (!indexNames.includes(config.pinecone.indexName)) {
          console.log(`Creating index: ${config.pinecone.indexName}`);
          await this.pinecone.createIndex({
            name: config.pinecone.indexName,
            dimension: 768, // Dimension for Gemini embeddings (change from 1536) = Dimension of text-embedding-3-small
            metric: 'cosine',
            spec: { serverless: { cloud: 'aws', region: 'us-east-1' }}
          });
  
          // Wait for the index to be ready
          console.log('Waiting for index to be ready...');
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
      } else {
        throw new Error('Unexpected response structure from Pinecone.');
      }
  
      console.log('Index is ready');
    } catch (error) {
      console.error('Error initializing Pinecone index:', error);
      throw error;
    }
  }
  
  // Upload vectors to Pinecone
  async uploadVectors(vectors) {
    try {
      // Upload in batches of 100
      const batchSize = 100;
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await this.index.upsert(batch);
        console.log(`Uploaded vectors ${i + 1} to ${Math.min(i + batchSize, vectors.length)}`);
      }
      
      console.log('All vectors uploaded successfully');
    } catch (error) {
      console.error('Error uploading vectors to Pinecone:', error);
      throw error;
    }
  }
  
  // Query the vector database
  async queryVectors(queryEmbedding, topK = 5) {
    try {
      const queryResult = await this.index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true
      });
      
      return queryResult.matches;
    } catch (error) {
      console.error('Error querying Pinecone:', error);
      throw error;
    }
  }
}

module.exports = new VectorDbService();