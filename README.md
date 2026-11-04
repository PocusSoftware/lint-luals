# lint-luals

GitHub action to [check] Lua code with [Lua Language Server].

## Usage

```yml
- uses: PocusSoftware/lint-luals@v1
  with:
    # The LuaLS release tag to install (e.g. 3.19.1).
    # Default: '' (latest release)
    version: ''

    # The personal access token (PAT) to use for downloading LuaLS.
    # Default: ${{ github.token }}
    token: ''

    # The workspace directory to check.
    # See: https://luals.github.io/wiki/usage/#check
    # Default: '.'
    check: ''

    # The minimum diagnostic level to report.
    # Can be Error, Warning, Information, or Hint.
    # See: https://luals.github.io/wiki/usage/#checklevel
    # Default: Warning
    checklevel: ''

    # Path to a configuration file to load, relative to the check path.
    # By default, LuaLS loads the local `.luarc.json` file.
    # See: https://luals.github.io/wiki/usage/#configpath
    # Default: ''
    configpath: ''

    # Whether to fail the action given a warning diagnosis.
    # Default: false
    fail_on_warnings: ''
```

[check]: https://luals.github.io/wiki/usage/#check
[lua language server]: https://luals.github.io/
