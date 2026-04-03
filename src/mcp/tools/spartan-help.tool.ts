import { Injectable } from '@nestjs/common';

const HELP_TEXT = `
# Spartan UI MCP — Available Tools

---

## search-spartan-docs
Search the Spartan UI documentation (RAG-powered).
Returns the URL and code examples for the matching pages.

**Parameters:**
- \`query\` (string, required) — What to search for.
- \`limit\` (number, optional) — Number of results. Default: 3.

**Examples:**
- "How do I install the accordion component?"
- "Show me button examples"
- "How to use the table component"

---

## inspect-spartan-project
Checks if Spartan UI is initialized in the current Angular project.
Detects \`components.json\` and Tailwind configuration files.

**Parameters:** none

**Examples:**
- "Is Spartan UI configured in this project?"
- "Check the Spartan setup of this workspace"

---

## generate-spartan-component
Generates the CLI command to add a Spartan UI component to your project.

**Parameters:**
- \`name\` (string, required) — Component name (e.g. "button", "dialog", "table").

**Examples:**
- "Give me the command to add the dialog component"
- "How do I add the datepicker?"

---

## reindex-spartan-docs
Re-crawls spartan.ng and reloads the documentation index in memory.
Use this when the documentation has been updated.

**Parameters:** none

**Examples:**
- "Refresh the Spartan documentation index"
- "Update the docs"

---

## spartan-help
Shows this help message with all available tools and their usage.

**Parameters:** none
`.trim();

@Injectable()
export class SpartanHelpTool {
  execute() {
    return {
      content: [{ type: 'text' as const, text: HELP_TEXT }],
    };
  }
}
