import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const hex = /^#[0-9a-f]{3,4}(?:[0-9a-f]{3,4})?$/i

test('all three Noemi variants provide app, syntax and terminal colors', async () => {
  const manifest = await json('./orca-plugin.json')
  assert.equal(manifest.execution, 'data')
  assert.equal('pluginApi' in manifest, false, 'data-only plugins must omit pluginApi')
  assert.deepEqual(manifest.capabilities, [])
  assert.deepEqual(manifest.contributes.themes.map((theme) => theme.id).sort(), ['noemi-dark', 'noemi-light', 'noemi-oled'])
  assert.deepEqual(manifest.contributes.terminalThemes.map((theme) => theme.id).sort(), ['noemi-dark-terminal', 'noemi-light-terminal', 'noemi-oled-terminal'])
  for (const variant of ['dark', 'light', 'oled']) {
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


test('OLED uses true black and readable orange and text', async () => {
  const app = await json('./themes/oled-app.json')
  const terminal = await json('./themes/oled-terminal.json')
  const luminance = (hex) => {
    const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    return rgb.reduce((sum, value, i) => sum + [0.2126, 0.7152, 0.0722][i] * (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4), 0)
  }
  const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
  assert.equal(app.tokens['--background'], '#000000')
  assert.equal(app.tokens['--editor-surface'], '#000000')
  assert.equal(terminal.terminal.background, '#000000')
  assert.ok(contrast(app.tokens['--foreground'], app.tokens['--background']) >= 7)
  assert.ok(contrast(app.tokens['--primary-foreground'], app.tokens['--primary']) >= 4.5)
  for (const rule of app.tokenColors) if (rule.settings.foreground) assert.ok(contrast(rule.settings.foreground, '#000000') >= 4.5, rule.name)
})
