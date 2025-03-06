# NutriQuery: Textbook-Based Nutrition Intelligence

## Vision

NutriQuery aims to democratize access to high-quality nutrition knowledge by creating the "brain of a nutrition coach" that's accessible to everyone. By leveraging the power of vector embeddings and generative AI, we've built a system that:

- Provides accurate, textbook-based nutrition answers without requiring users to read entire books
- Makes expert nutrition information accessible to anyone with internet access
- Eliminates misinformation by relying solely on verified academic sources
- Offers personalized nutrition guidance based on established science, not trends or anecdotes

Our ultimate goal is to help people make informed decisions about their nutrition by providing them with accessible, accurate information derived from trusted academic sources.

## About The Project

NutriQuery is a proof-of-concept system that allows users to ask natural language questions about nutrition and receive answers based on information extracted from nutrition textbooks. The system uses vector embeddings to store and retrieve relevant information from textbooks, and leverages generative AI to provide coherent, accurate responses.

### Key Features

- **Natural Language Interface**: Ask questions in plain English
- **Textbook-Based Knowledge**: Answers pulled from authoritative nutrition textbooks
- **Semantic Search**: Vector embeddings ensure relevance over keyword matching
- **Source Attribution**: See which textbooks and sections information comes from
- **Fast Response Time**: Vector database enables quick retrieval

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API key
- Pinecone account and API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/nutriquery.git
   cd nutriquery
   ```

2. Install NPM packages
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=nutrition-knowledge
   PORT=3000
   ```

4. Add your nutrition textbooks (PDF or TXT format) to the `textbooks` directory

### Usage

1. Process the textbooks and create vector embeddings:
   ```
   node index.js
   ```

2. Start the server:
   ```
   node server.js
   ```

3. Open your browser and go to `http://localhost:3000`

4. Start asking nutrition questions!

## System Architecture

NutriQuery consists of the following components:

1. **Text Processor**: Extracts and chunks text from textbooks
2. **Embedding Service**: Converts text chunks into vector embeddings
3. **Vector Database**: Stores and retrieves vectors efficiently using Pinecone
4. **Query Processor**: Matches user queries to relevant textbook content
5. **Response Generator**: Creates coherent answers from retrieved information
6. **Web Interface**: Simple UI for asking questions and viewing answers

## Future Roadmap

- **Multilingual Support**: Expand beyond English to serve global users
- **Image Recognition**: Allow users to take photos of food for nutritional analysis
- **Personalization**: Adapt responses based on user dietary preferences and restrictions
- **Voice Interface**: Add speech recognition and text-to-speech for accessibility
- **Mobile App**: Create native mobile experience for on-the-go nutrition advice
- **Expanded Knowledge Base**: Integrate more textbooks and academic papers
- **Interactive Meal Planning**: Provide nutrition-optimized meal suggestions

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [Google Gemini API](https://ai.google.dev/)
- [Pinecone Vector Database](https://www.pinecone.io/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
