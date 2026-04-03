import { Injectable } from '@nestjs/common';
import { IndexerService } from '../../indexer/indexer.service';
import { RagService } from '../../rag/rag.service';

@Injectable()
export class ReindexDocsTool {
  constructor(
    private readonly indexerService: IndexerService,
    private readonly ragService: RagService,
  ) {}

  async execute() {
    await this.indexerService.indexDocs();
    await this.ragService.loadIndex();
    return {
      content: [{ type: 'text' as const, text: 'Documentation successfully re-indexed and loaded.' }],
    };
  }
}
