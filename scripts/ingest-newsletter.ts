import { getOpenRouterClient, chat, MODELS, embed } from '../packages/ai/src/index.js';
import { scrapeUrl, cleanText } from '../packages/utils/src/index.js';
import { CLASSIFIER_PROMPT } from '../packages/prompts/src/classifier.js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Please provide a newsletter URL: npm run ingest -- <url>');
    process.exit(1);
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY is not set in .env');
    process.exit(1);
  }

  console.log(`[1/4] Scraping newsletter from: ${url}...`);
  const rawContent = await scrapeUrl(url);
  console.log(`Raw content length: ${rawContent.length}`);
  
  const cleanedContent = cleanText(rawContent);

  console.log(`[2/4] Classifying style snippets using openrouter/free...`);
  const client = getOpenRouterClient(apiKey);
  const prompt = CLASSIFIER_PROMPT.replace('{{content}}', cleanedContent);

  let response = await chat(client, [
    { role: 'system', content: 'You are a helpful assistant that outputs only valid JSON.' },
    { role: 'user', content: prompt }
  ], 'openrouter/free', false);

  try {
    // Robust JSON extraction
    const jsonMatch = response?.match(/\{[\s\S]*\}/); // Match the outer object
    let jsonStr = jsonMatch ? jsonMatch[0] : response || '{}';
    
    // Clean common model errors
    jsonStr = jsonStr
      .replace(/\\\|/g, '|')
      .replace(/<br>/g, ' ');

    const data = JSON.parse(jsonStr);
    const snippets = data.snippets || [];
    
    console.log(`[3/4] Successfully extracted ${snippets.length} style snippets.`);

    console.log(`[4/4] Generating embeddings using ${MODELS.EMBEDDING}...`);
    
    let dimension = 0;
    for (const snippet of snippets) {
      console.log(`Embedding ${snippet.type}: ${snippet.content.substring(0, 30)}...`);
      const embeddingData = await embed(client, snippet.content, MODELS.EMBEDDING);
      if (embeddingData && embeddingData[0]) {
        console.log(`Embedding received. Length: ${embeddingData[0].embedding?.length}`);
        snippet.embedding = embeddingData[0].embedding;
        dimension = snippet.embedding?.length || 0;
      } else {
        console.log('No embedding data received.');
      }
    }

    console.log(`\nDetected Embedding Dimension: ${dimension}`);
    console.log(`Please ensure your Pinecone index 'flowpatch' is set to ${dimension} dimensions.`);

    console.log('\n✅ Ingestion Complete!');
    console.log(`Total Snippets: ${snippets.length}`);
    
    // TODO: In Phase 2, we will call saveToDb(snippets) here
  } catch (e) {
    console.error('Failed to parse model response as JSON or generate embeddings.');
    console.log('Raw response:', response);
    console.error(e);
  }
}

main().catch(console.error);
