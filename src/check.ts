import { join } from 'node:path';
import { exec } from '@actions/exec';
import { runnerTemp } from './env.ts';

const BIN = 'lua-language-server';
const CHECK_FORMAT = 'json';

export interface CheckLuaLanguageServerOptions {
    check: string;
    checklevel: string;
    configpath: string;
}

export async function checkLuaLanguageServer({
    check,
    checklevel,
    configpath,
}: CheckLuaLanguageServerOptions): Promise<string> {
    const logpath = join(runnerTemp(), 'luals-log');

    const args = [
        '--check',
        check,
        '--checklevel',
        checklevel,
        '--logpath',
        logpath,
        '--check_format',
        CHECK_FORMAT,
    ];

    if (configpath.length > 0) {
        args.push('--configpath', configpath);
    }

    await exec(BIN, args, { ignoreReturnCode: true });

    return logpath;
}
