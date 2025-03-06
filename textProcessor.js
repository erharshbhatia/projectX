const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const pdfjsLib = require('pdfjs-dist');
const { PDFDocument } = require('pdf-lib');
const Tesseract = require('tesseract.js');
const config = require('./config');

// Function to extract text from a PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    if (data.text.trim()) return data.text;
  } catch (error) {
    console.warn("pdf-parse failed, falling back to pdfjs-dist.", error);
  }

  // Try using pdfjs-dist for better parsing
  return extractTextWithPdfJs(filePath);
}

// Extract text using pdfjs-dist (handles complex PDFs better)
async function extractTextWithPdfJs(filePath) {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    
    let extractedText = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    console.log(extractedText);
    
    if (extractedText.trim()) return extractedText;
  } catch (error) {
    console.warn("pdfjs-dist failed, falling back to OCR.", error);
  }

  // Last resort: OCR for scanned PDFs
  return extractTextWithOCR(filePath);
}

// Extract text using OCR (for scanned PDFs)
async function extractTextWithOCR(pdfPath) {
  console.log("Using OCR for PDF:", pdfPath);
  return new Promise((resolve, reject) => {
    Tesseract.recognize(pdfPath, 'eng')
      .then(({ data: { text } }) => resolve(text))
      .catch(reject);
  });
}

// Function to read a text file
function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to clean text
function cleanText(text) {
  return text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
}

// Function to split text into chunks
function splitTextIntoChunks(text, size = config.chunkSize, overlap = config.chunkOverlap) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    let chunk = text.slice(i, i + size);
    chunks.push(chunk);
    i += size - overlap;
  }
  return chunks;
}

// Function to process a directory of textbooks
async function processTextbooks(directoryPath) {
  const textbooks = [];
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const extension = path.extname(file).toLowerCase();
    
    let text;
    if (extension === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (extension === '.txt') {
      text = readTextFile(filePath);
    } else {
      console.log(`Skipping unsupported file: ${file}`);
      continue;
    }
    
    const cleanedText = cleanText(text);
    const chunks = splitTextIntoChunks(cleanedText);
    
    textbooks.push({
      title: path.basename(file, extension),
      chunks: chunks.map((chunk, index) => ({
        id: `${path.basename(file, extension)}-chunk-${index}`,
        text: chunk,
        metadata: {
          source: path.basename(file),
          chunkIndex: index
        }
      }))
    });
    
    console.log(`Processed ${file}: ${chunks.length} chunks created`);
  }
  return textbooks;
}

// Main function to run the text processing
async function main() {
  const textbooksDir = path.join(__dirname, 'textbooks');
  if (!fs.existsSync(textbooksDir)) {
    fs.mkdirSync(textbooksDir);
    console.log('Please add your textbook files to the "textbooks" directory and run this script again.');
    return;
  }
  
  const textbooks = await processTextbooks(textbooksDir);
  fs.writeFileSync(
    path.join(__dirname, 'processed_textbooks.json'),
    JSON.stringify(textbooks, null, 2)
  );
  
  console.log(`Processing complete. Total textbooks: ${textbooks.length}`);
  console.log(`Total chunks: ${textbooks.reduce((acc, book) => acc + book.chunks.length, 0)}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  processTextbooks,
  splitTextIntoChunks,
  cleanText
};