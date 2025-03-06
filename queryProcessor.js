const embeddingService = require('./embeddingService');
const vectorDbService = require('./vectorDbService');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

class QueryProcessor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.geminiModel = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash" // Use Gemini Pro for best quality responses
    });
  }
  
  // Process a user query and return an answer
  async processQuery(query) {
    try {
      // Generate embedding for the query
      const queryEmbedding = await embeddingService.generateEmbedding(query);
      
      // Search for relevant chunks in the vector database
      const matches = await vectorDbService.queryVectors(queryEmbedding);
      
      if (matches.length === 0) {
        return {
          answer: "I'm sorry, I couldn't find any relevant information for your question in my nutrition textbooks.",
          sources: []
        };
      }
      
      // Extract texts and sources from matches
      const relevantTexts = matches.map(match => match.metadata.text);
      const sources = matches.map(match => ({
        source: match.metadata.source,
        chunkIndex: match.metadata.chunkIndex,
        score: match.score
      }));
      
      // Generate a comprehensive answer using the relevant texts
      const answer = await this.generateAnswer(query, relevantTexts);
      
      return {
        answer,
        sources
      };
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }
  
  // Generate an answer based on the query and relevant texts
  async generateAnswer(query, relevantTexts) {
    try {
      const combinedText = relevantTexts.join("\n\n");
      
      const systemPrompt = "You are a nutrition expert assistant. Use only the information provided in the context to answer the question. If the answer cannot be found in the context, say 'I don't have enough information in my textbooks to answer this question accurately.' Be concise and accurate.";
      
      const userPrompt = `Context information from nutrition textbooks:\n\n${combinedText}\n\nQuestion: ${query}\n\nAnswer:`;
      
      const result = await this.geminiModel.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        }
      });
      
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating answer:', error);
      throw error;
    }
  }
}

module.exports = new QueryProcessor();