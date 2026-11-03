# Codex Notes for Orca

Browse, search, and edit the same Markdown notes used by [Codex Notes for VS Code](https://github.com/stanleygomes/codex-notes), in an Orca sidebar panel.

## Requirements

- Orca 1.4.246 or newer with support for trusted workers and panel-to-worker requests.
- Codex Notes for VS Code, with its notes index at `~/.codex-notes/notes.json` on the machine running the plugin.

## Install

Clone this repository, then in Orca open **Settings → Plugins** and install from the local `plugins/codex-notes` folder (the folder containing `orca-plugin.json`). The repository root is not itself a plugin. Review and approve the trusted-worker prompt: the worker needs filesystem access to read the index and edit the note files. Open the **Codex Notes** panel from the sidebar. Plugin installation screens and supported versions can vary between Orca releases.

## Use

Search notes by title, select a note, edit its Markdown, and click **Save**. Favorites from the VS Code index appear first with a star. Click **Refresh** after adding, renaming, deleting, or changing favorites in VS Code. Save or discard changes before opening another note.

The plugin edits the same file recorded in `notes.json`; it does not create notes or modify the index. Create, rename, delete, and favorite notes in VS Code. Both applications must see the same files at the paths recorded in the index: local and remote machines do not automatically share notes.

Before saving, the plugin checks whether the file changed since it was opened. If it did, copy your edits, reopen the note, and reconcile them. This check is not an atomic lock: avoid simultaneous saves in both editors. Unsaved edits are kept only in the panel and can be lost when it closes. VS Code may require a reload if its editor already has unsaved changes.

## Development

No build or dependencies are required. Run `node --test plugins/codex-notes/main.test.mjs` from the repository root (Node.js 20+). Install the clone as a local development plugin in Orca to test the actual panel and worker. The plugin has full local user filesystem access; only install code you trust.
