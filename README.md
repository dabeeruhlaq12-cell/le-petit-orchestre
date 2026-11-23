# Le Petit Orchestre

A cheerful, orderly pastel theme for the Claude desktop and mobile apps.

- **Light:** blush-pink page, cream ticket-paper cards, deep-chocolate text, powder-blue accent, mustard and mint highlights.
- **Dark:** the same bandstand after sunset: chocolate surfaces, cream text.
- **Backdrop:** a perfectly symmetrical scene: a scalloped striped awning across the top, and neat rows of little music notes (mustard, powder blue, mint) bobbing in time like a marching band. Every 30 seconds one note hops out of line and back. Notes sit at ~55% strength under thin, lightly frosted cream panels, with a soft veil down the reading column, and everything stops (still symmetrical) under reduced motion.

The backdrop uses SVG and CSS. The plugin registers it through JavaScript and TypeScript hooks. Terminal and editor sessions draw no theme.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install le-petit-orchestre --marketplace dabeeruhlaq12-cell/le-petit-orchestre
```

Answer `y` to add the marketplace, then press Enter to pick the user scope.

From a shell:

```bash
claude plugin install le-petit-orchestre --marketplace dabeeruhlaq12-cell/le-petit-orchestre
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `dabeeruhlaq12-cell/le-petit-orchestre`, then **Add plugin**.

The theme draws in the desktop and mobile apps; terminal sessions keep their own look.

## Inspect the implementation

- `.claude-plugin/` contains the plugin and marketplace manifests.
- `hooks/register.tsx` registers the host theme and backdrop hooks.
- `hooks/scene.ts` builds the animated SVG and includes a reduced-motion rule.
- `hooks/make-colors.js` is the generated palette helper. Its header records the generator fingerprints.

From the repository root, run these checks with Node.js 24 or newer. The module check imports the palette helper and builds the SVG without starting Claude.

```sh
node --check hooks/make-colors.js
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { makeColors } from './hooks/make-colors.js';
import { SCENE } from './hooks/scene.ts';

assert.equal(typeof makeColors, 'function');
assert.match(SCENE, /^<svg\b/);
assert.match(SCENE, /prefers-reduced-motion/);
JS
```

Checking the hooks and rendered theme end to end requires a Claude host that supports the theme runtime. For the one-command installation inside a Claude Code session, use v2.1.275 or newer. [Claude Code plugin installation docs](https://code.claude.com/docs/en/discover-plugins).

## License

MIT. See [LICENSE](LICENSE). Made by Dabeer Ul Haq with Claude Code; commits written by the AI are attributed to it in the history.
