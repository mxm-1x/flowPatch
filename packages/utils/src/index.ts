import axios from 'axios';
import * as cheerio from 'cheerio';
import FirecrawlApp from '@mendable/firecrawl-js';

export async function scrapeUrl(url: string): Promise<string> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (apiKey) {
    const app = new FirecrawlApp({ apiKey });
    const scrapeResponse = await app.scrapeUrl(url, {
      formats: ['markdown'],
    });

    if (!scrapeResponse.success) {
      throw new Error(`Firecrawl failed: ${scrapeResponse.error}`);
    }

    return scrapeResponse.markdown || '';
  }

  // Fallback to axios if no API key is provided
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  const $ = cheerio.load(data);
  $('script, style').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

export function cleanText(text: string): string {
  return text.trim().replace(/\n+/g, '\n');
}
