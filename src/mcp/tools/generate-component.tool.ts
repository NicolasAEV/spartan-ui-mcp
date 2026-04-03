import { Injectable } from '@nestjs/common';
import { CliService } from '../../cli/cli.service';

export interface GenerateComponentInput {
  name: string;
}

@Injectable()
export class GenerateComponentTool {
  constructor(private readonly cliService: CliService) {}

  execute(args: GenerateComponentInput) {
    const command = this.cliService.generateComponentCommand(args.name);
    return {
      content: [
        {
          type: 'text' as const,
          text: `To add the **${args.name}** component, run:\n\n\`\`\`bash\n${command}\n\`\`\``,
        },
      ],
    };
  }
}
