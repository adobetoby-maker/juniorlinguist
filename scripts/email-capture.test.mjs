import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
const source = readFileSync(new URL('../api/email-capture.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 } }).outputText
function setup({ key = 'synthetic', result = { data: { id: 'accepted' }, error: null }, failure, marketingStatus = async () => ({ ready: false }) } = {}) {
  const exports = {}, sends = [], logs = []
  vm.runInNewContext(compiled, { exports, process: { env: { RESEND_API_KEY: key } }, console: { error: (...args) => logs.push(args) }, require: name => {
    if (name === '../server/parent-marketing.js') return { parentMarketingStatus: marketingStatus }
    assert.equal(name, 'resend')
    return { Resend: class { emails = { send: async payload => { sends.push(payload); if (failure) throw failure; return result } } } }
  } })
  return { sends, logs, async request(body = { email: 'operator@example.test' }, method = 'POST', query = {}) {
    const response = { code: 200, body: null, headers: {}, setHeader(name,value) { this.headers[name] = value; return this }, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } }
    await exports.default({ method, body, query }, response)
    return response
  } }
}
test('rejects unsupported requests without sending', async () => {
  const app = setup(); assert.equal((await app.request({}, 'GET')).code, 405); assert.equal((await app.request({ email: 'invalid' })).code, 400); assert.equal(app.sends.length, 0)
})
test('missing credentials return a useful unavailable response', async () => {
  const app = setup({ key: '' }); assert.equal((await app.request()).code, 503); assert.equal(app.sends.length, 0)
})
test('provider rejection and missing receipt cannot report success', async () => {
  for (const result of [{ data: null, error: { message: 'private-provider-detail' } }, { data: null, error: null }]) {
    const app = setup({ result }); const res = await app.request(); assert.equal(res.code, 502); assert.equal(res.body.ok, false); assert.equal(JSON.stringify([res.body, app.logs]).includes('private-provider-detail'), false)
  }
})
test('transport failures hide provider details', async () => {
  const app = setup({ failure: new Error('private-transport-detail') }); const res = await app.request(); assert.equal(res.code, 500); assert.equal(JSON.stringify([res.body, app.logs]).includes('private-transport-detail'), false)
})
test('accepted mail escapes the recipient name and includes nine starter phrases', async () => {
  const app = setup(); const res = await app.request({ email: 'operator@example.test', name: '<img src=x>&"\'' }); assert.equal(res.code, 200); assert.equal(res.body.ok, true)
  const html = app.sends[0].html; assert.ok(html.includes('&lt;img src=x&gt;&amp;&quot;&#39;')); assert.equal(html.includes('<img src=x>'), false); assert.equal((html.match(/<tr>/g) || []).length, 9)
})

test('marketing readiness is read-only and failure responses hide upstream details', async () => {
 let reads=0
 const app=setup({marketingStatus:async()=>{reads++;return {ready:true,enabled:false,policyVersion:'weekly-parent-download-v2'}}})
 const res=await app.request({},'GET',{status:'marketing'})
 assert.equal(reads,1);assert.equal(res.code,200);assert.equal(res.body.ready,true)
 assert.equal(res.headers['Cache-Control'],'no-store');assert.equal(app.sends.length,0)
 const failing=setup({marketingStatus:async()=>{throw Error('private secret')}})
 const unavailable=await failing.request({},'GET',{status:'marketing'})
 assert.equal(unavailable.code,503);assert.equal(JSON.stringify([unavailable.body,failing.logs]).includes('private secret'),false)
 assert.equal(failing.sends.length,0)
})
