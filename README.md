# Orca plugins

Independent plugins for [Orca](https://github.com/stablyai/orca), one per folder under `plugins/`.

| Plugin | Description | Minimum Orca |
| --- | --- | --- |
| [Codex Notes](plugins/codex-notes/README.md) | Browse and edit the notes shared with Codex Notes for VS Code. | 1.4.246 |

Clone this repository and install the desired plugin's folder in **Settings → Plugins**. Select the folder containing its `orca-plugin.json`, not the repository root. See each plugin's README for requirements and instructions.

Run the current test suite from the repository root with `node --test plugins/*/*.test.mjs` (Node.js 20+).
