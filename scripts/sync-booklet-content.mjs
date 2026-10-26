import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [sourceRoot, sourceCommit] = process.argv.slice(2)
if (!sourceRoot || !/^[a-f0-9]{40}$/.test(sourceCommit ?? '')) {
  throw new Error('Usage: node scripts/sync-booklet-content.mjs <source-root> <40-char-source-commit>')
}
const actualCommit = execFileSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim()
const sourceChanges = execFileSync('git', ['-C', sourceRoot, 'status', '--porcelain=v1'], {
  encoding: 'utf8',
}).trim()
if (actualCommit !== sourceCommit || sourceChanges) {
  throw new Error('Source root must be clean and checked out at the exact recorded commit')
}

const fixturePath = resolve(sourceRoot, 'content/booklets/hello-little-one.en-es.v1.json')
const modulePath = resolve(sourceRoot, 'src/index.mjs')
const fixtureBytes = await readFile(fixturePath)
const booklet = JSON.parse(fixtureBytes.toString('utf8'))
const { adaptForJuniorLinguist } = await import(pathToFileURL(modulePath).href)
const projection = adaptForJuniorLinguist(booklet)
const snapshot = {
  generatedFrom: {
    repository: 'adobetoby-maker/language-threshold-readers',
    commit: sourceCommit,
    fixture: 'content/booklets/hello-little-one.en-es.v1.json',
    fixtureSha256: createHash('sha256').update(fixtureBytes).digest('hex'),
  },
  booklet: projection,
}

const outputPath = resolve('src/data/generated/hello-little-one.booklet.json')
await mkdir(resolve('src/data/generated'), { recursive: true })
await writeFile(
  outputPath,
  `${JSON.stringify(snapshot, null, 2)}\n`,
)
console.log(`Synced ${projection.pages.length} booklet pages from ${sourceCommit}.`)
