import { Injectable } from '@nestjs/common';
import path from 'node:path';
import { SpartanConfig } from '../common/interfaces';
import { fileExists, readJson } from '../common/helpers/file.helper';

@Injectable()
export class CliService {
  private readonly tailwindConfigs = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.mjs',
  ];

  getSpartanConfig(): SpartanConfig | null {
    const configPath = path.join(process.cwd(), 'components.json');
    return fileExists(configPath) ? readJson<SpartanConfig>(configPath) : null;
  }

  isSpartanInitialized(): boolean {
    return fileExists(path.join(process.cwd(), 'components.json'));
  }

  generateComponentCommand(name: string): string {
    return `ng g @spartan-ng/cli:ui ${name}`;
  }

  checkTailwindConfig(): string | null {
    for (const config of this.tailwindConfigs) {
      if (fileExists(path.join(process.cwd(), config))) {
        return config;
      }
    }
    return null;
  }
}
