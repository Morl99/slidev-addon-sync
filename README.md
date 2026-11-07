# slidev-addon-sync

Synchronize [Slidev](https://sli.dev/) presentations across browsers using Server-Sent Events (SSE) or WebSocket connections.

This is an updated fork of [Smile-SA/slidev-addon-sync](https://github.com/Smile-SA/slidev-addon-sync). Many thanks to Tony Cabaye and the upstream contributors for creating the original project.

Use it with [Morl99/slidev-sync-server](https://github.com/Morl99/slidev-sync-server). The presenter and viewers connect to the same server and group ID to share navigation and other configured state.

## Installation

Install the public package from [npm](https://www.npmjs.com/package/@morl99/slidev-addon-sync):

```bash
pnpm add @morl99/slidev-addon-sync
```

No login or custom registry configuration is required. Check the supported
Node.js and Slidev versions in [package.json](package.json) and commit your
lockfile for reproducible installations.

The unscoped [`slidev-addon-sync` package on npm](https://www.npmjs.com/package/slidev-addon-sync) belongs to the original project and does not install this fork.

### Install from source

To try the current source instead of a published release:

```bash
pnpm add github:Morl99/slidev-addon-sync
```

For a reproducible source dependency, append `#<commit-sha>` to the GitHub reference.

## Releases

Published versions and generated change notes are listed in [GitHub Releases](https://github.com/Morl99/slidev-addon-sync/releases). Semantic Release determines versions from Conventional Commits after successful checks on `main` and publishes the public npm package, Git tag and GitHub Release automatically. Changes that do not require a release leave the published version unchanged.

For development and release conventions, see [CONTRIBUTING.md](CONTRIBUTING.md#dependencies-and-releases).

## Slidev Configuration

Register the addon in your presentation.

In your slides metadata (using Front Matter):

```yaml
---
addons:
  - "@morl99/slidev-addon-sync"
---
```

Or in your `package.json`:

```json
{
  "slidev": {
    "addons": ["@morl99/slidev-addon-sync"]
  }
}
```

## Server configuration

### Define the Websocket or SSE server

You can use a Server Sent Events server or a WebSocket server to allow communication with multiple clients.

You can use [slidev-sync-server](https://github.com/Morl99/slidev-sync-server) or create your own implementation.

Set `syncSettings.server` in the same front matter as `addons`. Use a server address reachable from every viewer’s browser. The URL selects the transport: `http(s)://` for SSE, `ws(s)://` for WebSocket. Configure the server for the matching mode; see its [README](https://github.com/Morl99/slidev-sync-server#quick-start).

For HTTP Server Sent Events server:

```yaml
---
syncSettings:
  server: http://localhost:8080
---
```

Or for WebSocket server:

```yaml
---
syncSettings:
  server: ws://localhost:8080
---
```

Then, in the presentation, click on the connect icon.

![Connect control icon](./assets/control-icon.png)

Enter a shared group ID and press Enter. Use the same ID on the presenter and viewer devices. The suggested ID is derived from the presentation content; you can replace it to create a separate group.

![Connect control hash](./assets/control-hash.png)

You are connected!

![Connected](./assets/connected.png)

### Auto-connect

You can also use the `autoConnect` settings to automatically connect to the server:

```yaml
---
syncSettings:
  autoConnect: true
---
```

Or provide a number of seconds. In that case you will need to connect the first time, and then if you refresh the page it will automatically reconnect you if the number of seconds since the last connection has not been elapsed:

```yaml
---
syncSettings:
  autoConnect: 86400 # one day
---
```

### Enabling

By default this addon will only be visible and enabled in your static build.

Slidev already handles synchronization through its development server. To test this addon locally, explicitly enable it in development mode.

If you still need to activate this addon in dev mode you can use:

```yaml
---
syncSettings:
  enabled: true # It will be enabled for both dev and build modes
---
```

You can also pass `"dev"` to only enable it in dev mode or `false` to disable it entirely.

## State configuration

### State channels

By default this addon will synchronize all channels.

Channels are internal slidev states created with `createSyncState` and by default there are two channels:

* `shared`: state for navigation (pages and clicks) and cursor
* `drawings`: drawing state

To configure channel defaults explicitly, use:

```yaml
---
syncStates:
  - drawings
# Or alternatively:
syncStates: ["drawings"]
---
```

### State keys

In addition to selecting state channels you can also filter the keys of that channel to synchronize.

By default this addon will filter on the following keys:

* `shared`:
  * `"page"`: the current navigation page
  * `"clicks"`: the current navigation click
  * `"cursor"`: the cursor position
  * `"lastUpdate"`: used internally to synchronize page, clicks or cursor if the update comes from the presenter view
* `drawings`: no filter

For example if you don't want to synchronize the cursor you can set:

```yaml
---
syncStates:
  shared: ["page", "clicks", "lastUpdate"]
  drawings: true # true means "no filter"
---
```

**Note:** this configures matching channels; it is not an allowlist. Channels not listed still use the default behavior (all keys, presenter-only updates and initial state).

You can also use the alternative object syntax:

```yaml
---
syncStates:
  shared:
    keys: ["page", "clicks", "lastUpdate"]
  drawings:
    keys: true
---
```

### Presenter

By default this addon will only send state updates to the server if you are in presenter view.

This is probably want you want if you only want to synchronize slidev states.

But other addons like [`slidev-component-poll`](https://github.com/Smile-SA/slidev-component-poll) also rely on `createSyncState` to synchronize states, but in this example you want everybody to be able to use the poll, so in other words, to send state updates.

In that case you case the `presenter` settings to specify the channels for which you want everyone to be able to send updates:

```yaml
---
syncStates:
  poll:
    presenter: false
---
```

### State initialization

When you connect, this addon will, by default send the current state to the server.

This is probably what you want when your are presenting to other peoples, it will in that case send the drawings you have already made the current navigation...etc.

If you don't want this behavior, you can use the `init` settings:

```yaml
---
syncStates:
  poll:
    init: false
---
```

## Connection tips

- By default, connect from a built presentation. For local testing, set `syncSettings.enabled: true` or `"dev"`.
- `localhost` points to each viewer’s own device. Use a shared hostname when connecting from different devices.
- For presentations served over HTTPS, use an HTTPS (SSE) or WSS (WebSocket) server URL.
- Use the same server URL and group ID on every device, and send navigation updates from the presenter view.
- A group ID identifies a synchronization session. Provide access control through your server deployment when needed.

## Help and contributions

Questions, bug reports and suggestions are welcome in [Issues](https://github.com/Morl99/slidev-addon-sync/issues).
Want to contribute or run the example from source? See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENCE). Original authorship and license notices are retained.

