import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const snapshot = JSON.parse(
  await readFile(new URL('../src/data/generated/hello-little-one.booklet.json', import.meta.url)),
)
const { generatedFrom, booklet } = snapshot

assert.equal(generatedFrom.repository, 'adobetoby-maker/language-threshold-readers')
assert.match(generatedFrom.commit, /^[a-f0-9]{40}$/)
assert.match(generatedFrom.fixtureSha256, /^[a-f0-9]{64}$/)
assert.equal(booklet.consumer, 'junior-linguist')
assert.equal(booklet.bookId, 'book_hello_little_one')
assert.equal(booklet.editionId, 'edition_hello_little_one_en_es_v1')
assert.equal(booklet.sourceLanguage, 'en')
assert.equal(booklet.targetLanguage, 'es')
assert.equal(booklet.contentStatus, 'needs-native-review')
assert.equal(booklet.pages.length, 13)
assert.deepEqual(
  booklet.pages.map((page) => page.sourceLabel),
  ['cover', ...Array.from({ length: 12 }, (_, index) => `p${String(index + 1).padStart(2, '0')}`)],
)
assert.equal(new Set(booklet.pages.map((page) => page.pageId)).size, 13)
assert.equal(new Set(booklet.pages.map((page) => page.image.assetId)).size, 13)
assert.equal(new Set(booklet.pages.map((page) => page.image.sha256)).size, 13)
for (const [index, page] of booklet.pages.entries()) {
  assert.equal(page.order, index)
  assert.match(page.image.sha256, /^[a-f0-9]{64}$/)
  assert.match(page.image.url, /^https:\/\//)
  assert.ok(page.image.altText.source.trim())
  assert.ok(page.image.altText.target.trim())
  assert.ok(page.sentences.length > 0)
  for (const sentence of page.sentences) {
    assert.ok(sentence.sentenceId)
    assert.ok(sentence.en.trim())
    assert.ok(sentence.es.trim())
  }
}

console.log('Junior Linguist booklet snapshot is valid: 13 pages, 15 paired sentences.')
