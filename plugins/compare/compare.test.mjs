import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const html = await readFile(new URL('./panel.html', import.meta.url), 'utf8')
const script = html.split('// BEGIN DIFF')[1].split('// END DIFF')[0]
const diff = runInNewContext(`${script}; diffLines`)

test('aligns unchanged lines and identifies insertions and removals', () => {
  const rows = diff('first\nold\nlast', 'first\nnew\nextra\nlast')
  assert.deepEqual(Array.from(rows, (r) => [r.left?.text ?? null, r.right?.text ?? null, r.changed]), [
    ['first', 'first', false], ['old', 'new', true], [null, 'extra', true], ['last', 'last', false]
  ])
  assert.ok(diff('same', 'same').every((row) => !row.changed))
})

test('rejects comparisons exceeding the line limit', () => {
  assert.throws(() => diff('a\n'.repeat(1000), 'b\n'.repeat(1000)), /grande demais/)
})
