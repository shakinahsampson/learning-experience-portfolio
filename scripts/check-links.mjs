// QA: verifies every downloads/ file referenced in src/ exists in public/ and is present in dist/.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const refs = new Set()
for (const f of walk('src')) {
  for (const m of readFileSync(f, 'utf8').matchAll(/downloads\/[\w.-]+/g)) refs.add(m[0])
}
let bad = 0
for (const r of refs) {
  for (const base of ['public', 'dist']) {
    if (existsSync(base) && !existsSync(join(base, r))) { console.error(`MISSING ${base}/${r}`); bad++ }
  }
}
console.log(`${refs.size} download references checked`)
process.exit(bad ? 1 : 0)
