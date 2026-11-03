import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const hex = /^#[0-9a-f]{3,4}(?:[0-9a-f]{3,4})?$/i

test('all four Noemi variants provide app, syntax and terminal colors', async () => {
  const manifest = await json('./orca-plugin.json')
  assert.equal(manifest.execution, 'data')
  assert.deepEqual(manifest.capabilities, [])
  for (const variant of ['dark', 'light', 'red', 'blue']) {
    const appEntry = manifest.contributes.themes.find((item) => item.id === `noemi-${variant}`)
    const termEntry = manifest.contributes.terminalThemes.find((item) => item.id === `noemi-${variant}-terminal`)
    assert.ok(appEntry && termEntry)
    const app = await json(`./${appEntry.path}`)
    const term = await json(`./${termEntry.path}`)
    assert.equal(app.base, variant === 'light' ? 'light' : 'dark')
    assert.equal(term.mode, app.base)
    assert.ok(app.tokenColors.length > 0)
    for (const color of Object.values(app.tokens)) assert.match(color, hex)
    for (const rule of app.tokenColors) {
      assert.ok(rule.scope && rule.settings)
      if (rule.settings.foreground) assert.match(rule.settings.foreground, hex)
      assert.deepEqual(Object.keys(rule.settings).filter((key) => !['foreground', 'fontStyle'].includes(key)), [])
    }
    for (const key of ['background', 'foreground', 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']) assert.match(term.terminal[key], hex)
  }
})
