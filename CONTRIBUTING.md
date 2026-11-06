# Contributing

Thanks for your interest in improving slidev-addon-sync! Issues, ideas,
documentation fixes and pull requests (merge requests) are all welcome.
Small contributions are just as appreciated as larger ones.

This repository is an updated fork of
[Smile-SA/slidev-addon-sync](https://github.com/Smile-SA/slidev-addon-sync).
Please respect the original authorship and retain the existing license notices.

## Reporting issues and suggesting changes

Check [existing issues](https://github.com/Morl99/slidev-addon-sync/issues)
before opening a new one. For a bug report, please include:

- What you expected and what happened.
- Reproduction steps or a small example presentation.
- Your Node.js, Slidev and addon versions, browser, and whether you use SSE or WebSocket.
- Whether the issue occurs in development or a built presentation, your relevant
  configuration and browser/server logs.

Please remove credentials, private presentation content and other sensitive
information from examples and logs. For a larger change, opening an issue first
can help agree on the approach.

## Local setup

Use Node.js 24 (also recorded in `.node-version`) and the pnpm version specified
by `packageManager` in `package.json`. With Corepack available, enable its shims:

```bash
corepack enable
git clone https://github.com/Morl99/slidev-addon-sync.git
cd slidev-addon-sync
pnpm install --frozen-lockfile
```

If you plan to submit a pull request without write access, fork the repository
first and clone your own fork.

## Developing and running

```bash
pnpm dev
```

This opens the example presentation with Slidev. The addon defaults to built
presentations only. To exercise synchronization during development, add
`enabled: true` under `syncSettings` in `example.md` and run a compatible
[slidev-sync-server](https://github.com/Morl99/slidev-sync-server).
The example uses SSE at `http://localhost:8080`; use `ws://localhost:8080`
with a server running in WebSocket mode to test that transport.

Open a presenter view and a viewer view and connect both to the same group ID.
Navigate in the presenter and check that the viewer follows. Test both transports
when changing connection behavior. See the [README](README.md) for configuration.

The main source locations are:

| Path | Purpose |
| --- | --- |
| `components/` | Connection controls |
| `custom-nav-controls.vue` | Navigation integration and enablement |
| `services/` | Shared state, synchronization and SSE/WebSocket transports |
| `types/` | Types and Slidev configuration extensions |
| `example.md` | Example presentation |
| `tests/` | Vitest tests |

## Tests and build

Before submitting a code change, run:

```bash
pnpm test
pnpm build
```

`pnpm test` runs Vitest tests for server URL normalization and presentation group
IDs. These tests do not exercise a live sync server. `pnpm build` builds the
example presentation into `dist/`, checking the addon’s integration with Slidev.
To serve that output locally, run `pnpm preview`.

Keep tests focused on observable behavior and add coverage when fixing bugs or
changing functionality. Documentation-only changes do not need new tests.

## Submitting a pull request

Create a branch, keep the change focused and explain the problem it solves.
Include reproduction steps or test results when relevant, and update the docs
when behavior changes.

The CI workflow runs on pull requests, pushes to `main` and manual dispatches.
It uses Node.js 24, installs with `pnpm i --frozen-lockfile`, runs the tests and
builds the example. The `test` job should pass before merging. Actions are pinned
to commit SHAs and the workflow uses read-only repository permissions.

## Dependencies and releases

When changing dependencies, update and commit both `package.json` and
`pnpm-lock.yaml`. Use the pnpm version pinned in `packageManager`; the README and
this guide refer to that field so the version is maintained in one place.

The `release:patch`, `release:minor` and `release:major` scripts generate a
changelog, commit it, bump the package version and push commits and tags to
`origin`. They are maintainer operations and do not publish a package to npm.
There is currently no automated package publication workflow in this repository.
