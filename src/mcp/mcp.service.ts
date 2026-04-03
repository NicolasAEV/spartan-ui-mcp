import { Injectable, Logger } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SearchDocsTool } from './tools/search-docs.tool';
import { InspectProjectTool } from './tools/inspect-project.tool';
import { GenerateComponentTool } from './tools/generate-component.tool';
import { ReindexDocsTool } from './tools/reindex-docs.tool';
import { SpartanHelpTool } from './tools/spartan-help.tool';

@Injectable()
export class McpService {
  private readonly logger = new Logger(McpService.name);
  private readonly server: McpServer;

  constructor(
    private readonly searchDocsTool: SearchDocsTool,
    private readonly inspectProjectTool: InspectProjectTool,
    private readonly generateComponentTool: GenerateComponentTool,
    private readonly reindexDocsTool: ReindexDocsTool,
    private readonly spartanHelpTool: SpartanHelpTool,
  ) {
    this.server = new McpServer({ name: 'spartan-mcp-advanced', version: '1.0.0' });
    this.registerTools();
  }

  private registerTools(): void {
    this.registerSearchDocs();
    this.registerInspectProject();
    this.registerGenerateComponent();
    this.registerReindexDocs();
    this.registerSpartanHelp();
  }

  private registerSearchDocs(): void {
    this.server.registerTool(
      'search-spartan-docs',
      {
        description:
          'Search Spartan UI documentation (RAG-powered). Use for components, setup guides, and usage examples.',
        inputSchema: {
          query: z.string().describe("The search query (e.g., 'how to install accordion', 'button examples')"),
          limit: z.number().optional().describe('Number of results to return (default: 3)'),
        },
      },
      (args) => this.searchDocsTool.execute(args),
    );
  }

  private registerInspectProject(): void {
    this.server.registerTool(
      'inspect-spartan-project',
      {
        description:
          'Checks if Spartan UI is initialized in the current project and returns configuration details.',
      },
      () => this.inspectProjectTool.execute(),
    );
  }

  private registerGenerateComponent(): void {
    this.server.registerTool(
      'generate-spartan-component',
      {
        description: 'Generates the CLI command to add a specific Spartan UI component.',
        inputSchema: {
          name: z.string().describe("Name of the component (e.g., 'button', 'accordion')"),
        },
      },
      (args) => this.generateComponentTool.execute(args),
    );
  }

  private registerReindexDocs(): void {
    this.server.registerTool(
      'reindex-spartan-docs',
      { description: 'Force re-indexing of Spartan UI documentation from spartan.ng.' },
      () => this.reindexDocsTool.execute(),
    );
  }

  private registerSpartanHelp(): void {
    this.server.registerTool(
      'spartan-help',
      { description: 'Lists all available MCP tools with their parameters and usage examples.' },
      () => this.spartanHelpTool.execute(),
    );
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.log('Spartan MCP server running on stdio');
  }
}
