import { Module } from '@nestjs/common';
import { RagModule } from '../rag/rag.module';
import { IndexerModule } from '../indexer/indexer.module';
import { CliModule } from '../cli/cli.module';
import { McpService } from './mcp.service';
import { SearchDocsTool } from './tools/search-docs.tool';
import { InspectProjectTool } from './tools/inspect-project.tool';
import { GenerateComponentTool } from './tools/generate-component.tool';
import { ReindexDocsTool } from './tools/reindex-docs.tool';
import { SpartanHelpTool } from './tools/spartan-help.tool';

@Module({
  imports: [RagModule, IndexerModule, CliModule],
  providers: [McpService, SearchDocsTool, InspectProjectTool, GenerateComponentTool, ReindexDocsTool, SpartanHelpTool],
  exports: [McpService],
})
export class McpModule {}
