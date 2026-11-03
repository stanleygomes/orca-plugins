import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import { join } from 'node:path'

const directory = join(homedir(), '.codex-notes')
const digest = (content) => createHash('sha256').update(content).digest('hex')

export function createNotes(dir = directory) {
  async function list() {
    let metadata
    try {
      metadata = JSON.parse(await readFile(join(dir, 'notes.json'), 'utf8'))
    } catch (error) {
      if (error.code === 'ENOENT') return []
      throw new Error('Could not read notes.json: ' + error.message)
    }
    if (!Array.isArray(metadata.notes)) throw new Error('Invalid notes.json: notes must be an array.')
    return metadata.notes.filter((note) => typeof note.filePath === 'string' && typeof note.title === 'string')
      .map((note) => ({ id: note.id, title: note.title, path: note.filePath, favorite: !!note.isFavorite, color: note.color }))
      .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.title.localeCompare(b.title))
  }

  async function find(path) {
    if (typeof path !== 'string') throw new Error('Invalid note path.')
    const note = (await list()).find((item) => item.path === path)
    if (!note) throw new Error('Note is no longer in notes.json. Refresh the list.')
    return note
  }

  async function open({ path }) {
    const note = await find(path)
    const content = await readFile(note.path, 'utf8')
    return { note, content, revision: digest(content) }
  }

  async function save({ path, content, revision }) {
    if (typeof content !== 'string' || typeof revision !== 'string') throw new Error('Invalid save request.')
    const note = await find(path)
    const current = await readFile(note.path, 'utf8')
    if (digest(current) !== revision) throw new Error('This note changed on disk. Copy your edits, then reload the note before saving.')
    await writeFile(note.path, content, 'utf8')
    return { revision: digest(content) }
  }

  return { list, open, save }
}

export default function activate(orca) {
  const notes = createNotes()
  orca.panels.handle('notes.list', () => notes.list())
  orca.panels.handle('notes.open', (input) => notes.open(input))
  orca.panels.handle('notes.save', (input) => notes.save(input))
}
