import { Module } from '@nestjs/common';
import { RagModule } from './rag/rag.module';
import { IndexerModule } from './indexer/indexer.module';
import { CliModule } from './cli/cli.module';
import { McpModule } from './mcp/mcp.module';

@Module({
  imports: [RagModule, IndexerModule, CliModule, McpModule],
})
export class AppModule {}
