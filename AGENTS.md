# Orca plugins

This repository contains independent Orca plugins, one per folder under `plugins/`. Each plugin has its own `orca-plugin.json` and README. Keep plugin code and tests inside its folder; update the root README's plugin table when adding, removing, or renaming a plugin.

Run `node --test plugins/*/*.test.mjs` from the root. Also validate and exercise changed plugins in a compatible Orca installation when available. Document version requirements and installation changes.

## Codex Notes

`plugins/codex-notes` is an Orca sidebar plugin for browsing and editing notes shared with Codex Notes for VS Code. It declares a trusted Node worker and sandboxed HTML panel.

- Preserve compatibility with `~/.codex-notes/notes.json` and its `filePath` entries. Do not rewrite the metadata index without addressing concurrent changes by the VS Code extension.
- Notes belong to the user. Never run tests against real notes; use temporary directories.
- Preserve conflict detection and warn about its non-atomic check. Never silently overwrite a file changed since it was opened.
- The worker has full filesystem access. Validate requests and only open paths present in the current index; keep user content out of HTML interpolation.

## Noemi Theme

`plugins/noemi` is a data-only adaptation of Noemi for VS Code. Keep its four app themes, TextMate rules, and terminal palettes aligned with the source palette. Preserve the upstream MIT license and document any Orca-specific approximations.

## Jacob & Esau

`plugins/jacob-esau` compares user-provided text in a sandboxed panel. Keep contents local, render them as text, and preserve the comparison size limit.
