# Codex Notes for Orca

An Orca sidebar plugin for browsing and editing notes shared with Codex Notes for VS Code. `orca-plugin.json` declares the trusted Node worker (`main.mjs`) and sandboxed HTML panel (`panel.html`).

- Preserve compatibility with `~/.codex-notes/notes.json` and its `filePath` entries. Do not rewrite the metadata index without addressing concurrent changes by the VS Code extension.
- Notes belong to the user. Never run tests against their real notes; use temporary directories.
- Preserve conflict detection and warn about its non-atomic check. Never silently overwrite a file changed since it was opened.
- The worker has full filesystem access. Validate requests and only open paths present in the current index; keep user content out of HTML interpolation.
- Run `node --test`. Also validate and exercise the plugin in a compatible Orca installation when available. Update README when behavior or installation changes.
