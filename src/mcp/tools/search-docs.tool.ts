import { Injectable } from '@nestjs/common';
import { RagService } from '../../rag/rag.service';

export interface SearchDocsInput {
  query: string;
  limit?: number;
}

@Injectable()
export class SearchDocsTool {
  constructor(private readonly ragService: RagService) {}

  execute(args: SearchDocsInput) {
    const { query, limit = 3 } = args;
    const docs = this.ragService.search(query, limit);

    if (docs.length === 0) {
      return {
        content: [{ type: 'text' as const, text: 'No results found. Try re-indexing with `reindex-spartan-docs`.' }],
      };
    }

    const text = docs.map((d) => this.formatDoc(d)).join('\n\n---\n\n');
    return { content: [{ type: 'text' as const, text }] };
  }

  private formatDoc(d: ReturnType<RagService['search']>[number]): string {
    const sections: string[] = [
      `## ${d.title}`,
      `**URL**: ${d.url}`,
      `**Category**: ${d.category}`,
    ];

    if (d.codeExamples?.length > 0) {
      sections.push(...this.formatCodeExamples(d.codeExamples));
    } else {
      sections.push(`\n${d.content.slice(0, 300)}...`);
    }

    return sections.join('\n');
  }

  private formatCodeExamples(examples: string[]): string[] {
    return [
      '\n### Code Examples',
      ...examples.slice(0, 3).map((code) => `\`\`\`\n${code}\n\`\`\``),
    ];
  }
}
