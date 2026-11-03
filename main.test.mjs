import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createNotes } from './main.mjs'

test('reads the Codex Notes index and saves shared Markdown while detecting external changes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'codex-notes-orca-'))
  try {
    const path = join(dir, 'hello.md')
    await writeFile(path, 'original')
    const metadata = { notes: [{ id: '1', title: 'Hello', filePath: path, isFavorite: true, color: 'red' }] }
    await writeFile(join(dir, 'notes.json'), JSON.stringify(metadata))
    const notes = createNotes(dir)
    assert.equal((await notes.list())[0].favorite, true)
    const opened = await notes.open({ path })
    await notes.save({ path, content: 'edited in Orca', revision: opened.revision })
    assert.equal(await readFile(path, 'utf8'), 'edited in Orca')
    await assert.rejects(notes.save({ path, content: 'stale', revision: opened.revision }), /changed on disk/)
    assert.deepEqual(JSON.parse(await readFile(join(dir, 'notes.json'), 'utf8')), metadata)
    await assert.rejects(notes.open({ path: join(dir, 'other.md') }), /no longer/)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('missing index is empty and invalid index reports an error', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'codex-notes-orca-'))
  try {
    const notes = createNotes(dir)
    assert.deepEqual(await notes.list(), [])
    await writeFile(join(dir, 'notes.json'), '{')
    await assert.rejects(notes.list(), /Could not read notes.json/)
  } finally { await rm(dir, { recursive: true, force: true }) }
})
