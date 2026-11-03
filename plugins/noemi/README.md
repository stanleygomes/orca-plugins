# Noemi Theme for Orca

The four [Noemi for VS Code](https://github.com/stanleygomes/noemi) palettes, adapted for Orca: **Dark**, **Light**, **Red**, and **Blue**. Each includes an app theme with syntax colors and a separate terminal palette. Orca and VS Code expose different UI elements, so the interface mapping is an approximation; syntax and terminal colors come from Noemi's original theme files.

## Install and select

Requires Orca **1.4.245 or newer**. Clone this repository and install `plugins/noemi` as a local plugin via **Settings → Plugins**. Select a Noemi app theme in Orca's appearance settings and its matching terminal theme in **Settings → Terminal**. Theme-only plugins contain no executable code.

## Development

The JSON files in `themes/` adapt Noemi's version 1.7.0 theme files. Run `node --test plugins/noemi/*.test.mjs` from the repository root. Validate and preview the themes in a compatible Orca version when available. Noemi is MIT-licensed; its copyright notice is included in [LICENSE](LICENSE).
