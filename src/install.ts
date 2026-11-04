import { join } from 'node:path';
import { addPath, platform } from '@actions/core';
import { getOctokit } from '@actions/github';
import {
    cacheDir,
    downloadTool,
    extractTar,
    extractZip,
    find,
} from '@actions/tool-cache';

const TOOL_NAME = 'lua-language-server';
const REPOSITORY = { owner: 'LuaLS', repo: 'lua-language-server' };

const assetMatch = `-${platform.platform}-${platform.arch}.${platform.isWindows ? 'zip' : 'tar.gz'}`;

export interface InstallLuaLanguageServerOptions {
    version: string;
    token: string;
}

export async function installLuaLanguageServer({
    version,
    token,
}: InstallLuaLanguageServerOptions): Promise<void> {
    if (version.length > 0) {
        const cached = find(TOOL_NAME, version);
        if (cached.length > 0) {
            addBinPath(cached);
            return;
        }
    }

    const octokit = getOctokit(token);

    const {
        data: { tag_name: tag, assets },
    } =
        version.length === 0
            ? await octokit.rest.repos.getLatestRelease(REPOSITORY)
            : await octokit.rest.repos.getReleaseByTag({
                  ...REPOSITORY,
                  tag: version,
              });

    const cached = find(TOOL_NAME, tag);
    if (cached.length > 0) {
        addBinPath(cached);
        return;
    }

    const matches = assets.filter((asset) => asset.name.endsWith(assetMatch));
    const [match, ...rest] = matches;

    if (match === undefined || rest.length > 0) {
        throw new Error(
            `Expected 1 asset matching "${assetMatch}", found ${matches.length}. Available: ${rest.map((a) => `"${a.name}"`).join(', ')}`,
        );
    }

    const archive = await downloadTool(match.url, undefined, `token ${token}`, {
        accept: 'application/octet-stream',
    });

    const extracted = platform.isWindows
        ? await extractZip(archive)
        : await extractTar(archive);

    const newCached = await cacheDir(extracted, TOOL_NAME, tag);
    addBinPath(newCached);
}

function addBinPath(base: string): void {
    addPath(join(base, 'bin'));
}
