import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DocEntry } from '../common/interfaces';
import { SPARTAN_DOCS_PATH, SPARTAN_URL, SITEMAP_URL } from '../common/constants/paths.constant';
import { writeJson } from '../common/helpers/file.helper';

const RATE_LIMIT_MS = 200;

@Injectable()
export class IndexerService {
  private readonly logger = new Logger(IndexerService.name);

  async indexDocs(): Promise<DocEntry[]> {
    const urls = await this.fetchDocUrls();
    this.logger.log(`Found ${urls.length} URLs to index.`);

    const docs = await this.crawlUrls(urls);

    writeJson(SPARTAN_DOCS_PATH, docs);
    this.logger.log(`Successfully indexed ${docs.length} documents.`);
    return docs;
  }

  private async fetchDocUrls(): Promise<string[]> {
    this.logger.log('Fetching sitemap...');
    const { data } = await axios.get<string>(SITEMAP_URL, { responseType: 'text' });
    const $ = cheerio.load(data, { xmlMode: true });

    const urls: string[] = [];
    $('url loc').each((_, el) => {
      const url = $(el).text();
      if (this.isDocUrl(url)) {
        urls.push(url);
      }
    });
    return urls;
  }

  private isDocUrl(url: string): boolean {
    return url.includes('/documentation/') || url.includes('/components');
  }

  private async crawlUrls(urls: string[]): Promise<DocEntry[]> {
    const docs: DocEntry[] = [];
    for (const url of urls) {
      const doc = await this.crawlPage(url);
      if (doc) docs.push(doc);
      await this.rateLimit();
    }
    return docs;
  }

  private async crawlPage(url: string): Promise<DocEntry | null> {
    this.logger.log(`Indexing ${url}...`);
    try {
      const { data } = await axios.get<string>(url, { responseType: 'text' });
      return this.parsePage(url, data);
    } catch (err) {
      this.logger.error(`Error indexing ${url}`, err);
      return null;
    }
  }

  private parsePage(url: string, html: string): DocEntry {
    const $ = cheerio.load(html);
    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = $('main').text().replaceAll(/\s+/g, ' ').trim();
    const category = url.includes('/components') ? 'component' : 'guide';
    const id = url.replaceAll(`${SPARTAN_URL}/`, '').replaceAll('/', '-');
    const codeExamples = this.extractCodeExamples($);

    return { id, url, title, content, category, codeExamples };
  }

  private extractCodeExamples($: ReturnType<typeof cheerio.load>): string[] {
    const examples: string[] = [];
    $('pre code, code-block, hlm-code-block').each((_, el) => {
      const code = $(el).text().trim();
      if (code.length > 10) examples.push(code);
    });
    return examples;
  }

  private rateLimit(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
  }
}
