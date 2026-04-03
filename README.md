# Spartan UI MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for [Spartan UI](https://spartan.ng) built with **NestJS**. Provides AI agents with deep knowledge of Spartan UI components, installation guides, and project configuration.

## Features

- **RAG-Powered Search**: 130+ pages of official documentation indexed with `FlexSearch` — local search without external APIs, includes code examples.
- **CLI Integration**: Generates `ng g @spartan-ng/cli:ui` commands for any component.
- **Project Inspection**: Analyzes your Angular project detecting `components.json` and Tailwind config.
- **NestJS Architecture**: Modules, services and dependency injection — scalable and testable structure.
- **Performance**: Pre-loaded in-memory index for instant responses.

## Tools

| Tool | Description |
| :--- | :--- |
| `search-spartan-docs` | Search Spartan UI docs. Returns URL + code examples. |
| `inspect-spartan-project` | Checks if Spartan UI is initialized and returns project config. |
| `generate-spartan-component` | Generates the CLI command to add a specific component. |
| `reindex-spartan-docs` | Re-crawls spartan.ng and reloads the in-memory index. |

## Installation

```bash
pnpm install
pnpm run index   # index the docs (only needed once, or to refresh)
pnpm run build
```

## Usage

### VS Code Copilot (recommended)

Create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "spartan-ui": {
      "type": "stdio",
      "command": "node",
      "args": ["/YOUR-PATH/spartan-ui-mcp/dist/main.js"] mode in Copilot Chat — the tools will be available automatically.

### Claude Desktop

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "spartan-ui": {
      "command": "node",
      "args": ["/YOUR-PATH/spartan-ui-mcp/dist/main.js"] (testing)

```bash
npx @modelcontextprotocol/inspector node dist/main.js
```

Opens `http://localhost:5173` to test tools interactively.

## Scripts

| Script | Description |
| :--- | :--- |
| `pnpm run build` | Compile TypeScript to `dist/` |
| `pnpm run watch` | Compile in watch mode |
| `pnpm run index` | Crawl spartan.ng and generate `src/data/spartan-docs.json` |
| `pnpm start` | Start the MCP server on stdio |

## Project Structure

```
src/
├── main.ts                        # Entry point (NestFactory)
├── app.module.ts                  # Root module
├── common/
│   ├── interfaces/                # DocEntry, SpartanConfig
│   ├── constants/                 # URLs, paths
│   └── helpers/                   # fileExists, readJson, writeJson
├── rag/
│   ├── rag.module.ts
│   └── rag.service.ts             # FlexSearch index (OnModuleInit)
├── indexer/
│   ├── indexer.module.ts
│   ├── indexer.service.ts         # Crawler (NestJS injectable)
│   └── indexer.cli.ts             # Standalone script (pnpm run index)
├── cli/
│   ├── cli.module.ts
│   └── cli.service.ts             # Local project inspection
├── mcp/
│   ├── mcp.module.ts
│   ├── mcp.service.ts             # McpServer + registerTool()
│   └── tools/
│       ├── search-docs.tool.ts
│       ├── inspect-project.tool.ts
│       ├── generate-component.tool.ts
│       └── reindex-docs.tool.ts
└── data/
    └── spartan-docs.json          # Indexed knowledge base
```

## Tech Stack

- **Runtime**: Node.js + TypeScript 6
- **Framework**: NestJS 11
- **MCP SDK**: `@modelcontextprotocol/sdk` (McpServer)
- **Search**: FlexSearch 0.8
- **Crawler**: Axios + Cheerio
- **Validation**: Zod 4

## License

MIT
