#!/usr/bin/env tsx

import { rm } from 'node:fs/promises';
import { build } from 'esbuild';

async function run(): Promise<void> {
    await rm('./dist', { recursive: true, force: true });
    await build({
        entryPoints: ['./src/index.ts'],
        outdir: './dist',
        bundle: true,
        format: 'cjs',
        target: 'node24',
        platform: 'node',
    });
}

// oxlint-disable-next-line typescript/no-floating-promises
run();
