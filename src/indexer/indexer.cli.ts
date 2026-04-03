/**
 * Script standalone para indexar la documentación de Spartan UI.
 * Uso: pnpm run index
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'node:fs';
import path from 'node:path';

const SPARTAN_URL = 'https://spartan.ng';
const SITEMAP_URL = `${SPARTAN_URL}/sitemap.xml`;
const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'spartan-docs.json');
const RATE_LIMIT_MS = 200;

interface DocEntry {
  id: string;
  url: string;
  title: string;
  content: string;
  category: string;
  codeExamples: string[];
}

async function fetchDocUrls(): Promise<string[]> {
  console.log('Fetching sitemap...');
  const { data } = await axios.get<string>(SITEMAP_URL, { responseType: 'text' });
  const $ = cheerio.load(data, { xmlMode: true });

  const urls: string[] = [];
  $('url loc').each((_, el) => {
    const url = $(el).text();
    if (url.includes('/documentation/') || url.includes('/components')) {
      urls.push(url);
    }
  });
  return urls;
}

function extractCodeExamples($: ReturnType<typeof cheerio.load>): string[] {
  const examples: string[] = [];
  $('pre code, code-block, hlm-code-block').each((_, el) => {
    const code = $(el).text().trim();
    if (code.length > 10) examples.push(code);
  });
  return examples;
}

async function crawlPage(url: string): Promise<DocEntry | null> {
  try {
    const { data } = await axios.get<string>(url, { responseType: 'text' });
    const $ = cheerio.load(data);

    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = $('main').text().replaceAll(/\s+/g, ' ').trim();
    const category = url.includes('/components') ? 'component' : 'guide';
    const id = url.replaceAll(`${SPARTAN_URL}/`, '').replaceAll('/', '-');
    const codeExamples = extractCodeExamples($);

    return { id, url, title, content, category, codeExamples };
  } catch {
    console.error(`  ✗ Error indexing ${url}`);
    return null;
  }
}

async function main() {
  const urls = await fetchDocUrls();
  console.log(`Found ${urls.length} URLs to index.\n`);

  const docs: DocEntry[] = [];

  for (const [i, url] of urls.entries()) {
    process.stdout.write(`[${i + 1}/${urls.length}] ${url} ... `);
    const doc = await crawlPage(url);
    if (doc) {
      docs.push(doc);
      console.log('✓');
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(docs, null, 2));
  console.log(`\nDone! Indexed ${docs.length} documents → ${DATA_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
