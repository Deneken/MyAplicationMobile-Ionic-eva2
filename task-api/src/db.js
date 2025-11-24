import { JSONFile } from 'lowdb/node'
import { Low } from 'lowdb'
const adapter = new JSONFile('db.json')
const db = new Low(adapter, { tasks: [] })
await db.read()
if (!db.data) {
  db.data = { tasks: [] }
  await db.write()
}

export default db