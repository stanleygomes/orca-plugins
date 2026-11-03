# Jacob & Esau for Orca

Compare two pieces of text or JSON side by side, without a Git repository or project files.

## Install

Requires Orca 1.4.245 or later. Clone this repository and install the local `plugins/jacob-esau` folder through **Settings → Plugins**. Open the **Jacob & Esau** sidebar panel.

## Use

Paste text into both fields or select local text files, then choose **Comparar texto**. For JSON, **Comparar JSON formatado** parses and indents both documents before comparing their lines; it preserves object key order, so reordered keys still appear as differences. Invalid JSON is reported without changing your input. File selection accepts files up to 1 MB; comparisons are limited to one million line-pairs.

The comparison runs in the panel on your computer. The plugin has no worker or network capability and does not write files. Pasted text remains in the panel only until it is closed.

## Development

Run `node --test plugins/jacob-esau/*.test.mjs` from the repository root. Exercise the file chooser and panel in a compatible Orca installation when available.
