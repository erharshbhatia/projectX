const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

class EmbeddingService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.embeddingModel = this.genAI.getGenerativeModel({
      model: "embedding-001"
    });
  }
  
  // Generate embeddings for a single text
  async generateEmbedding(text) {
    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
  
  // Generate embeddings for multiple texts in batches
  async generateBatchEmbeddings(texts, batchSize = 20) {
    const batches = [];
    for (let i = 0; i < texts.length; i += batchSize) {
      batches.push(texts.slice(i, i + batchSize));
    }
    
    const embeddings = [];
    let processedCount = 0;
    
    for (const batch of batches) {
      try {
        // Process each text in the batch individually
        // Gemini doesn't support batch embedding in the same way as OpenAI
        const batchPromises = batch.map(text => this.embeddingModel.embedContent(text));
        const batchResults = await Promise.all(batchPromises);
        
        const batchEmbeddings = batchResults.map(result => result.embedding.values);
        embeddings.push(...batchEmbeddings);
        
        processedCount += batch.length;
        console.log(`Processed ${processedCount}/${texts.length} embeddings`);
        
        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error generating batch embeddings:', error);
        throw error;
      }
    }
    
    return embeddings;
  }
}

module.exports = new EmbeddingService();