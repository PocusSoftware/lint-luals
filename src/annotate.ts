import { readFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { relative } from 'node:path/posix';
import { fileURLToPath } from 'node:url';
import { error, notice, warning } from '@actions/core';
import { githubWorkspace } from './env.ts';

const CHECK_JSON = 'check.json';
const SEVERITY_ERROR = 1;
const SEVERITY_WARNING = 2;

const severities: Record<number, typeof error | typeof warning> = {
    [SEVERITY_ERROR]: error,
    [SEVERITY_WARNING]: warning,
};

interface RangePart {
    character: number;
    line: number;
}

interface Diagnostic {
    code: string;
    message: string;
    range: { start: RangePart; end: RangePart };
    severity: number;
    source: string;
}

export interface AnnotateOptions {
    logpath: string;
}

export interface AnnotateResults {
    errors: number;
    warnings: number;
}

export async function annotate({
    logpath,
}: AnnotateOptions): Promise<AnnotateResults> {
    const contents = await readFile(join(logpath, CHECK_JSON), {
        encoding: 'utf8',
    });

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const report = JSON.parse(contents) as Record<string, Diagnostic[]>;
    const workspace = githubWorkspace();
    const results: AnnotateResults = { errors: 0, warnings: 0 };

    for (const [uri, diagnostics] of Object.entries(report)) {
        const file = relative(workspace, fileURLToPath(uri));
        if (file.startsWith('..') || isAbsolute(file)) {
            continue;
        }

        for (const {
            severity,
            message,
            code,
            range: { start, end },
            source,
        } of diagnostics) {
            switch (severity) {
                case SEVERITY_ERROR: {
                    results.errors++;
                    break;
                }
                case SEVERITY_WARNING: {
                    results.warnings++;
                    break;
                }
                default: {
                    break;
                }
            }

            const log = severities[severity] ?? notice;

            log(message, {
                title: `${source}(${code})`,
                file,
                startLine: start.line + 1,
                startColumn: start.character + 1,
                endLine: end.line + 1,
                endColumn: end.character + 1,
            });
        }
    }

    return results;
}
