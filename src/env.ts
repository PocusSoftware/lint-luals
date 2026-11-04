import { env } from 'node:process';

export function runnerTemp(): string {
    return requireEnvVar('RUNNER_TEMP');
}

export function githubWorkspace(): string {
    return requireEnvVar('GITHUB_WORKSPACE');
}

function requireEnvVar(name: string): string {
    const { [name]: value } = env;

    if (value === undefined) {
        throw new Error(`No defined value for environment variable "${name}".`);
    }

    return value;
}
