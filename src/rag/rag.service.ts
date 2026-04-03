import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import FlexSearch from 'flexsearch';
import { DocEntry } from '../common/interfaces';
import { SPARTAN_DOCS_PATH } from '../common/constants/paths.constant';
import { fileExists, readJson } from '../common/helpers/file.helper';

@Injectable()
export class RagService implements OnModuleInit {
  private readonly logger = new Logger(RagService.name);
  private index!: ReturnType<typeof this.createIndex>;
  private docs: DocEntry[] = [];

  async onModuleInit(): Promise<void> {
    await this.loadIndex();
  }

  async loadIndex(): Promise<void> {
    if (!fileExists(SPARTAN_DOCS_PATH)) {
      this.logger.warn('No documentation index found. Run reindex-spartan-docs first.');
      return;
    }

    this.docs = readJson<DocEntry[]>(SPARTAN_DOCS_PATH);
    this.index = this.createIndex();
    for (const doc of this.docs) {
      this.index.add(doc);
    }
    this.logger.log(`Loaded ${this.docs.length} docs into index.`);
  }

  search(query: string, limit = 5): DocEntry[] {
    const results = this.index.search(query, { enrich: true, suggest: true, limit });
    const merged = new Map<string, DocEntry>();
    (results as any[]).forEach((res: any) => {
      res.result.forEach((item: any) => merged.set(item.id, item.doc));
    });
    return Array.from(merged.values()).slice(0, limit);
  }

  private createIndex() {
    return new (FlexSearch as any).Document({
      document: { id: 'id', index: ['title', 'content'], store: true },
      tokenize: 'forward',
      context: true,
    });
  }
}
