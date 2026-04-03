#!/usr/bin/env node
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { McpService } from './mcp/mcp.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  const mcpService = app.get(McpService);
  await mcpService.start();
}

bootstrap().catch((error) => {
  console.error('Fatal server error:', error);
  process.exit(1);
});
