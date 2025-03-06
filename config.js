// config.js
require('dotenv').config();

module.exports = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    indexName: process.env.PINECONE_INDEX_NAME
  },
  chunkSize: 1000, // Number of characters per chunk
  chunkOverlap: 200, // Overlap between chunks to maintain context
  port: process.env.PORT || 3000
};