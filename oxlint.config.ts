import { oxlintCommonConfig } from '@d4isdavid/config/oxlint/common';
import { oxlintNodeConfig } from '@d4isdavid/config/oxlint/node';
import { oxlintTypescriptConfig } from '@d4isdavid/config/oxlint/typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [oxlintCommonConfig, oxlintTypescriptConfig, oxlintNodeConfig],
    env: { builtin: true, node: true },
    options: {
        denyWarnings: true,
        reportUnusedDisableDirectives: 'warn',
        typeAware: true,
        typeCheck: true,
    },
    rules: { 'unicorn/prefer-module': 'off' },
});
