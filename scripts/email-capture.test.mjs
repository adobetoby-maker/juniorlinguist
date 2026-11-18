import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
const source = readFileSync(new URL('../api/email-capture.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 } }).outputText
function setup({ marketingStatus = async () => ({ ready: false, enabled: false }) } = {}) {
  const exports = {}, imports = [], environmentReads = [], requests = [], logs = []
  vm.runInNewContext(compiled, {
    exports,
    fetch: () => { throw new Error('This route must not call a provider') },
    process: { env: new Proxy({}, { get(_target, key) {
      environmentReads.push(key)
      assert.equal(key, 'VERCEL_DEPLOYMENT_ID', 'No mail credential may be read')
      return 'dpl_SyntheticSource123'
    } }) },
    console: { error: (...args) => logs.push(args) },
    require: name => {
      imports.push(name)
      assert.equal(name, '../server/parent-marketing.js', 'The retired route cannot load an email sender')
      return { parentMarketingStatus: async deployment => { requests.push(deployment); return marketingStatus(deployment) } }
    },
  })
  return { imports, environmentReads, requests, logs, async request(body = { email: 'operator@example.test' }, method = 'POST', query = {}) {
    const response = { code: 200, body: null, headers: {}, setHeader(name,value) { this.headers[name] = value; return this }, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } }
    await exports.default({ method, body, query }, response)
    return response
  } }
}
test('every legacy POST is retired regardless of address, body or purported permission', async () => {
  const app=setup()
  for(const body of [undefined,null,{}, {email:'invalid'},{email:'operator@example.test',name:'Parent'},{email:'arbitrary@example.test',policyVersion:'weekly-parent-download-v2',adult:true,weeklyConsent:true}]){
    const res=await app.request(body)
    assert.equal(res.code,410);assert.equal(res.body.ok,false);assert.match(res.body.error,/Refresh Junior Linguist/)
    assert.equal(res.headers['Cache-Control'],'no-store')
  }
  assert.equal(app.requests.length,0);assert.equal(app.environmentReads.length,0)
})
test('retired submission cannot use the status query to reach the former email sender', async () => {
  const app=setup({marketingStatus:async()=>{throw Error('Must not run')}})
  const res=await app.request({email:'arbitrary@example.test'},'POST',{status:'marketing'})
  assert.equal(res.code,410);assert.equal(app.requests.length,0);assert.equal(app.environmentReads.length,0)
  assert.deepEqual(app.imports,['../server/parent-marketing.js'])
})
test('unsupported methods are rejected without reading status or credentials', async () => {
  const app=setup()
  for(const method of ['PUT','PATCH','DELETE','OPTIONS','HEAD']){
    const res=await app.request({},method,{status:'marketing'})
    assert.equal(res.code,405);assert.equal(res.headers.Allow,'GET')
  }
  assert.equal(app.requests.length,0);assert.equal(app.environmentReads.length,0)
})
test('only the exact GET status query exposes read-only readiness', async () => {
  const app=setup()
  for(const query of [{},{status:'other'},{status:['marketing','marketing']}])assert.equal((await app.request({},'GET',query)).code,405)
  assert.equal(app.requests.length,0);assert.equal(app.environmentReads.length,0)
})
test('GET readiness reports prepared but inactive status without sending an email', async () => {
  const app=setup({marketingStatus:async()=>({ready:true,enabled:false,policyVersion:'weekly-parent-download-v2'})})
  const res=await app.request({},'GET',{status:'marketing'})
  assert.equal(res.code,200);assert.equal(res.body.ready,true);assert.equal(res.body.enabled,false)
  assert.equal(res.headers['Cache-Control'],'no-store');assert.equal(res.headers['X-Robots-Tag'],'noindex')
  assert.deepEqual(app.requests,['dpl_SyntheticSource123']);assert.deepEqual(app.environmentReads,['VERCEL_DEPLOYMENT_ID'])
})
test('unready GET status cannot fall back to a mail credential or resource send', async () => {
  const app=setup()
  const res=await app.request({},'GET',{status:'marketing'})
  assert.equal(res.code,200);assert.equal(res.body.ready,false);assert.equal(res.body.enabled,false)
  assert.deepEqual(app.imports,['../server/parent-marketing.js']);assert.deepEqual(app.environmentReads,['VERCEL_DEPLOYMENT_ID'])
})
test('readiness failures hide upstream details and retain no-store behavior', async () => {
  const app=setup({marketingStatus:async()=>{throw Error('private upstream secret')}})
  const res=await app.request({},'GET',{status:'marketing'})
  assert.equal(res.code,503);assert.equal(res.headers['Cache-Control'],'no-store')
  assert.equal(JSON.stringify([res.body,app.logs]).includes('private upstream secret'),false)
  assert.equal(app.requests.length,1);assert.deepEqual(app.environmentReads,['VERCEL_DEPLOYMENT_ID'])
})
