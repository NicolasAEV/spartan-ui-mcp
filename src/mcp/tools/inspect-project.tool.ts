import { Injectable } from '@nestjs/common';
import { CliService } from '../../cli/cli.service';

@Injectable()
export class InspectProjectTool {
  constructor(private readonly cliService: CliService) {}

  execute() {
    const initialized = this.cliService.isSpartanInitialized();
    const config = this.cliService.getSpartanConfig();
    const tailwind = this.cliService.checkTailwindConfig();

    const lines: string[] = [
      `**Spartan UI Initialized**: ${initialized ? 'Yes ✓' : 'No ✗'}`,
      `**Tailwind Config**: ${tailwind ?? 'Not found'}`,
    ];

    if (config) {
      lines.push(`\n**components.json**:\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``);
    }

    return { content: [{ type: 'text' as const, text: lines.join('\n') }] };
  }
}
