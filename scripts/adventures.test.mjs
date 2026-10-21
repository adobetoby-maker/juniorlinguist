import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { test } from 'node:test'
import ts from 'typescript'
const cache = new Map()
function load(name) {
  if (cache.has(name)) return cache.get(name)
  const exports = {}; cache.set(name, exports)
  const code = ts.transpileModule(fs.readFileSync(new URL(`../src/features/adventures/${name}.ts`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  vm.runInNewContext(code, { exports, require: dep => { assert.equal(dep, './content'); return load('content') } })
  return exports
}
const { ADVENTURES } = load('content')
const { completeAdventureLesson: complete, readAdventureProgress: read, progressKey } = load('progress')
const storage = () => { const data = new Map(); return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) } }

test('three coherent eight-lesson series introduce then revisit language', () => {
  assert.equal(ADVENTURES.length, 3)
  const ids = new Set()
  for (const series of ADVENTURES) {
    assert.equal(series.lessons.length, 8)
    const seen = new Set()
    for (const [index, lesson] of series.lessons.entries()) {
      assert.equal(lesson.number, index + 1); assert.equal(ids.has(lesson.id), false); ids.add(lesson.id)
      for (const word of lesson.reviewWords) assert.ok(seen.has(word.es), `Review must come from earlier lessons: ${lesson.id}/${word.es}`)
      if (index > 0) assert.ok(lesson.reviewWords.length >= 2)
      for (const word of lesson.newWords) { assert.ok(word.es && word.en); assert.equal(seen.has(word.es), false); seen.add(word.es) }
      assert.ok(lesson.goal.startsWith('I can')); assert.ok(lesson.story.length >= 4)
      assert.ok(lesson.story.every(line => line.es.trim() && line.en.trim()))
      assert.equal(new Set(lesson.options).size, lesson.options.length)
      assert.ok(lesson.answer >= 0 && lesson.answer < lesson.options.length)
      assert.equal(new Set([lesson.story[0].en, lesson.story[1].en, lesson.story[2].en]).size, 3)
      assert.ok(lesson.practice && lesson.stretch)
    }
    assert.equal(series.lessons[7].newWords.length, 0)
    assert.ok(series.lessons[7].goal.includes('I can'))
  }
  assert.equal(ids.size, 24)
})
test('repeating a lesson does not duplicate completion or affect old stars and XP', () => {
  const store = storage(); store.setItem('jl_progress_v1', 'legacy-game-progress'); store.setItem('jl_app_v1', 'legacy-xp')
  assert.equal(complete(store, 'account:A', 'animals-1').saved, true)
  assert.equal(complete(store, 'account:A', 'animals-1').progress.completed.length, 1)
  assert.equal(store.data.get('jl_progress_v1'), 'legacy-game-progress'); assert.equal(store.data.get('jl_app_v1'), 'legacy-xp')
})
test('account A, guest, and account B have independent progress and A can resume', () => {
  const store = storage(); complete(store, 'account:A', 'animals-1'); complete(store, 'account:B', 'space-1')
  assert.equal(read(store, 'guest').progress.completed.length, 0)
  assert.equal(read(store, 'account:B').progress.completed.includes('animals-1'), false)
  assert.equal(read(store, 'account:A').progress.completed.join(), 'animals-1')
})
test('completion merges current same-account progress rather than a stale view', () => {
  const store = storage(); read(store, 'account:A'); complete(store, 'account:A', 'animals-1'); complete(store, 'account:A', 'space-1')
  assert.equal(read(store, 'account:A').progress.completed.length, 2)
})
test('malformed, mismatched-owner and unknown-lesson records are not overwritten', () => {
  for (const raw of ['broken JSON', JSON.stringify({ version: 1, actor: 'account:B', completed: [] }), JSON.stringify({ version: 1, actor: 'account:A', completed: ['invented-lesson'] })]) {
    const store = storage(); store.setItem(progressKey('account:A'), raw)
    assert.equal(complete(store, 'account:A', 'animals-1').saved, false)
    assert.equal(store.getItem(progressKey('account:A')), raw)
  }
})
test('quota and unavailable storage failures remain retryable', () => {
  const store = storage(); const blocked = { getItem: store.getItem, setItem: () => { throw new Error('quota') } }
  assert.equal(complete(blocked, 'account:A', 'food-1').saved, false)
  assert.equal(read(store, 'account:A').progress.completed.length, 0)
  assert.equal(complete(store, 'account:A', 'food-1').saved, true)
  assert.ok(read(undefined, 'account:A').error)
})
test('unknown completion IDs cannot create new progress entries', () => {
  const store = storage(); assert.equal(complete(store, 'account:A', 'not-a-lesson').saved, false); assert.equal(store.data.size, 0)
})
