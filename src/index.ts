import { getBooleanInput, getInput, info, setFailed } from '@actions/core';
import { annotate } from './annotate.ts';
import { checkLuaLanguageServer } from './check.ts';
import { installLuaLanguageServer } from './install.ts';

export async function run(): Promise<void> {
    const version = getInput('version');
    const token = getInput('token', { required: true });
    const check = getInput('check', { required: true });
    const checklevel = getInput('checklevel', { required: true });
    const configpath = getInput('configpath');
    const failOnWarnings = getBooleanInput('fail_on_warnings', {
        required: true,
    });

    info('Installing Lua Language Server...');
    await installLuaLanguageServer({ version, token });

    info('Checking with Lua Language Server...');
    const logpath = await checkLuaLanguageServer({
        check,
        checklevel,
        configpath,
    });

    info('Checking results...');
    const results = await annotate({ logpath });
    const message = `Finished with ${results.warnings} warning(s) and ${results.errors} error(s).`;

    if (results.errors > 0 || (failOnWarnings && results.warnings > 0)) {
        setFailed(message);
        return;
    }

    info(message);
}

if (require.main === module) {
    // oxlint-disable-next-line promise/catch-or-return promise/prefer-await-to-then
    run().catch((error: unknown) => {
        setFailed(error instanceof Error ? error : String(error));
    });
}
