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

Releases use Semantic Release and Conventional Commits on `main`:

| Commit | Release |
| --- | --- |
| `fix: ...` | Patch |
| `feat: ...` | Minor |
| `feat!: ...` or a `BREAKING CHANGE:` footer | Major |
| `docs: ...`, `chore: ...`, `test: ...` | No release by default |

Use a Conventional Commit title when squash-merging a pull request. Semantic
Release computes the version from commits since the previous release, updates
the staged package metadata, publishes to `registry.npmjs.org`, and creates a
`v` tag and GitHub Release with generated notes. Without a previous release tag,
the first qualifying release starts at 1.0.0. Do not bump versions manually;
`package.json` in Git remains a development placeholder. Version changes are
applied only to the staged package; no generated version commit is pushed.

The workflow tests, builds and packs an allowlisted source package with read-only
permissions. The separate release job verifies the SHA-256 of that artifact,
unpacks it, and installs only dedicated, lockfile-pinned release tooling with
lifecycle scripts disabled. It never installs application dependencies or runs
application scripts. Semantic Release needs `contents: write` for tags/releases
and `id-token: write` for npm Trusted Publishing. The GitHub token is exposed
only to the release step; npm authentication uses short-lived OIDC credentials.
No npm token or GitHub Packages write permission is required. PR runs cannot
publish. npm automatically adds provenance for Trusted Publishing releases.

### One-time npm setup

The npm account must own the `morl99` scope. The initial npm package must exist
before its Trusted Publisher can be configured. You can bootstrap entirely from
GitHub Actions:

1. Create a short-lived npm granular access token with publish permission for
   the `@morl99` scope and Bypass 2FA enabled. New packages must be allowed by the
   token's scope permissions. Use the shortest available expiration.
2. Store it as the repository Actions secret `NPM_BOOTSTRAP_TOKEN`. Never paste
   tokens into issues, workflow inputs, logs or commits.
3. Merge this workflow, then open Actions → Bootstrap npm package → Run workflow.
   Select `main` and enter the existing GitHub release version without `v`.
4. The workflow tests/builds current main, validates that the matching release tag
   is an ancestor, and packs its source with that version. It does not create or
   change Git tags or GitHub Releases. Only publication metadata is changed.
5. After successful publication, immediately revoke the npm token and delete the
   GitHub secret. The bootstrap job refuses to run once the npm package exists.

PRs validate packaging but cannot publish. The isolated bootstrap publish job has
no checkout, dependency installation or GitHub write permission; only the final
publish step receives the npm token. It verifies the artifact checksum and
requires an explicit npm registry HTTP 404 before attempting first publication.

The regular Semantic Release workflow may fail on the initial merge because
npm trust is not configured yet. That is expected: after bootstrapping and
configuring trust below, re-run the regular workflow on `main` to publish the
next version. No npm token is used in the regular workflow.

In the npm package's Settings → Trusted Publisher, choose GitHub Actions:

| Field | Value |
| --- | --- |
| Organization or user | `Morl99` |
| Repository | `slidev-addon-sync` |
| Workflow filename | `publish.yml` |
| Environment | Leave empty (workflow does not use an environment) |

Use GitHub-hosted runners. Complete the first automated publish within npm's
Trusted Publisher activation window. The next qualifying commit on `main`
continues versioning from the existing Git release tag. For manual retries,
run `publish.yml` on `main`; already-released commits do not create a new version.
See [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) for setup.

### Dependency automation

Dependabot checks application and release-tool npm dependencies and Actions
weekly. Application dependency updates use `fix` commit titles to trigger a
Patch release after merging. Patch/Minor updates may auto-merge; Major and unknown classifications
remain manual. Repository auto-merge is enabled, but protect `main` with the
required `test` CI check before using the auto-merge workflow. It fails closed
without that check. The privileged metadata workflow never checks out PR code.
Restrict `v*` tags to trusted maintainers and allow the release automation to
create tags. Avoid manually moving or deleting release tags.
