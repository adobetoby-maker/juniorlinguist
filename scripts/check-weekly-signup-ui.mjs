// Local-only behavioral/UI verification. Every remote request is intercepted;
// synthetic emails never reach a server and no confirmation message is sent.
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {pathToFileURL} from 'node:url'
import {createServer} from 'vite'
const modulePath=process.env.PLAYWRIGHT_MODULE
if(!modulePath)throw new Error('Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs')
const {chromium}=await import(pathToFileURL(modulePath).href)
process.env.VITE_SUPABASE_URL='https://fixture.supabase.co'
process.env.VITE_SUPABASE_PUBLISHABLE_KEY='fixture-publishable-key'
const endpoint='https://myaimarketing.worker-bee.app/api/weekly-subscriptions'
const server=await createServer({server:{host:'127.0.0.1',port:0,strictPort:false},envDir:false})
await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})})
const ids=['junior-parent-orientation','homeschool-spanish','language-threshold-module-lessons']
const parentCopy='Send my free family study guide and the weekly Language Threshold lesson series I select. I am an adult using my own email. I can change preferences or unsubscribe at any time.'
const ready=()=>({parentDownload:{enabled:true,policyVersion:'weekly-parent-download-v2',copy:parentCopy,tracks:ids.slice(0,2)},enabled:true,available:true,policyVersion:'weekly-practice-v1',pacing:'one_lesson_email_per_week_total',privacyUrl:'https://languagethreshold.com/privacy',antiAbuse:{provider:'turnstile',siteKey:'public-test-sitekey',action:'weekly_signup',cdataRequired:true},tracks:ids.map((id,i)=>({id,totalWeeks:i===0?10:50,publishedLessons:i===0?10:50,available:true}))})
const report={localOnly:true,noRealEmailOrProviderTraffic:true,cases:[],errors:[],externalRequestsBlocked:[]}
await mkdir('tests/reports/weekly-screenshots',{recursive:true})
async function scenario({name,path='/free-downloads',width=1440,availability=ready(),responses=[202]}){
 const posts=[];let index=0
 const context=await browser.newContext({viewport:{width,height:1100}})
 await context.addInitScript(()=>{
  window.__weeklyProof={renders:[],resets:0,removed:0,options:null,tokenN:0}
  const widgets=new Map()
  window.turnstile={
   render(element,options){const id='mock-'+widgets.size;widgets.set(id,options);window.__weeklyProof.options=options;window.__weeklyProof.renders.push({action:options.action,cData:options.cData});element.textContent='LOCAL VERIFICATION FIXTURE';setTimeout(()=>options.callback('synthetic-token-'+(++window.__weeklyProof.tokenN)),0);return id},
   reset(id){window.__weeklyProof.resets++;const options=widgets.get(id);if(options)setTimeout(()=>options.callback('synthetic-token-'+(++window.__weeklyProof.tokenN)),0)},
   remove(id){window.__weeklyProof.removed++;widgets.delete(id)},
  }
 })
 await context.route('**/*',async route=>{
  const req=route.request(),url=req.url()
  if(url.startsWith(origin)||url.startsWith('data:'))return route.continue()
  if(url===endpoint+'?availability=1')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(availability)})
  if(url===endpoint&&req.method()==='POST'){
   posts.push(JSON.parse(req.postData()));const code=responses[Math.min(index++,responses.length-1)]
   if(code==='network')return route.abort('connectionfailed')
   await new Promise(resolve=>setTimeout(resolve,60))
   return route.fulfill({status:code,contentType:'application/json',body:JSON.stringify(code===202?{status:'request_received'}:code===200?{status:'active'}:{error:'unavailable'})})
  }
  report.externalRequestsBlocked.push(url);return route.abort()
 })
 const page=await context.newPage();page.on('pageerror',error=>report.errors.push(error.message))
 await page.goto(origin+path);await page.locator('.weekly-signup').waitFor()
 await page.waitForFunction(()=>!document.body.textContent.includes('Checking weekly lesson availability'))
 return {page,posts,context,name,width}
}
async function complete(page,track=0){
 await page.getByLabel('Your adult email',{exact:true}).fill('adult@example.invalid')
 await page.locator('.weekly-track input').nth(track).check()
 await page.getByRole('checkbox',{name:'I am an adult parent, educator, or learner.'}).check()
 await page.getByRole('checkbox',{name:parentCopy}).check()
 await assert.doesNotReject(()=>page.getByRole('button',{name:'Send my guide and weekly lessons'}).waitFor())
 await page.waitForFunction(()=>!document.querySelector('.weekly-submit').disabled)
}
async function finish(s,details={}){
 assert.equal(await s.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 report.cases.push({name:s.name,width:s.width,posts:s.posts.length,noHorizontalOverflow:true,...details})
 await s.context.close()
}
try{
 for(const path of ['/','/free-downloads']){
  const s=await scenario({name:'unavailable-'+path,path,availability:{...ready(),enabled:false,available:false}})
  assert.equal(await s.page.locator('.weekly-signup form').count(),0);assert.equal(s.posts.length,0)
  await s.page.getByRole('heading',{name:'Weekly lessons are not available right now.'}).first().waitFor()
  await finish(s,{publicSignupHidden:true})
 }
 {
  const value=ready();value.antiAbuse.siteKey=''
  const s=await scenario({name:'missing-guard',availability:value});assert.equal(await s.page.locator('.weekly-signup form').count(),0);await finish(s,{publicSignupHidden:true})
 }
 for(const width of [1440,1024,768,390]){
  const s=await scenario({name:'ready-layout',width});const p=s.page
  assert.equal(await p.locator('.weekly-checkbox input:checked').count(),0)
  assert.equal(await p.locator('.weekly-track input:checked').count(),0)
  assert.equal(await p.locator('input[name="name"],input[name="childName"]').count(),0)
  assert.equal(await p.getByRole('link',{name:'Privacy policy',exact:true}).getAttribute('href'),'https://languagethreshold.com/privacy')
  assert.equal(await p.locator('.weekly-submit').isDisabled(),true)
  await p.locator('.weekly-signup').screenshot({path:`tests/reports/weekly-screenshots/ready-${width}.png`,animations:'disabled',style:'nav{visibility:hidden}'})
  await finish(s,{uncheckedAdultAndConsent:true,oneTrackRequired:true})
 }
 for(let track=0;track<2;track++){
  const s=await scenario({name:'request-track-'+ids[track]});await complete(s.page,track)
  await s.page.locator('.weekly-signup form').evaluate(form=>{form.requestSubmit();form.requestSubmit()})
  await s.page.getByRole('heading',{name:'Your lesson request is in.',exact:true}).waitFor()
  assert.equal(s.posts.length,1);assert.equal(s.posts[0].trackId,ids[track])
  assert.deepEqual(Object.keys(s.posts[0]).sort(),['action','adult','email','policyVersion','requestId','trackId','turnstileToken','website','weeklyConsent'].sort())
  const proof=await s.page.evaluate(()=>window.__weeklyProof)
  assert.equal(proof.renders.at(-1).action,'weekly_signup');assert.equal(proof.renders.at(-1).cData,s.posts[0].requestId)
  assert.match(await s.page.locator('.weekly-received').innerText(),/selected series is queued/);assert.equal(s.posts[0].policyVersion,'weekly-parent-download-v2')
  await finish(s,{singleSubmissionDespiteDoubleSubmit:true,explicitParentPermission:true})
 }
 {
  const s=await scenario({name:'network-retry',responses:['network',202]});await complete(s.page)
  await s.page.locator('.weekly-submit').click();await s.page.getByRole('alert').waitFor()
  await s.page.waitForFunction(()=>!document.querySelector('.weekly-submit').disabled)
  await s.page.locator('.weekly-submit').click();await s.page.getByRole('heading',{name:'Your lesson request is in.',exact:true}).waitFor()
  assert.equal(s.posts.length,2);assert.equal(s.posts[0].requestId,s.posts[1].requestId);assert.notEqual(s.posts[0].turnstileToken,s.posts[1].turnstileToken)
  await finish(s,{sameRequestIdFreshToken:true})
 }
 {
  const s=await scenario({name:'edited-request',responses:['network',202]});await complete(s.page)
  await s.page.locator('.weekly-submit').click();await s.page.getByRole('alert').waitFor()
  await s.page.getByLabel('Your adult email',{exact:true}).fill('another-adult@example.invalid')
  await s.page.waitForFunction(()=>!document.querySelector('.weekly-submit').disabled)
  await s.page.locator('.weekly-submit').click();await s.page.getByRole('heading',{name:'Your lesson request is in.',exact:true}).waitFor()
  assert.notEqual(s.posts[0].requestId,s.posts[1].requestId)
  await finish(s,{newRequestIdAfterEmailChanged:true})
 }
 for(const status of [200,403,429,503]){
  const s=await scenario({name:'reject-'+status,responses:[status]});await complete(s.page)
  await s.page.locator('.weekly-submit').click();await s.page.getByRole('alert').waitFor()
  assert.equal(await s.page.getByRole('heading',{name:'Your lesson request is in.',exact:true}).count(),0)
  await finish(s,{noFalseReceipt:true})
 }
 {
  const value=ready();value.tracks[1].available=false
  const s=await scenario({name:'track-not-ready',availability:value});assert.equal(await s.page.locator('.weekly-signup form').count(),0);await finish(s,{incompleteParentSeriesHidden:true})
 }
 {
  const s=await scenario({name:'legacy-optional-invitation',path:'/'})
  const old=s.page.locator('#weekly-lessons')
  await old.getByLabel('Your adult email',{exact:true}).fill('adult@example.invalid')
  await old.locator('.weekly-track input').nth(2).check()
  await old.getByRole('checkbox',{name:'I am an adult parent, educator, or learner.'}).check()
  await old.getByRole('checkbox',{name:/I want one weekly lesson email/}).check()
  await old.getByRole('button',{name:'Request the weekly invitation'}).click()
  await old.getByRole('heading',{name:'Request received.',exact:true}).waitFor()
  assert.equal(s.posts.length,1);assert.equal(s.posts[0].policyVersion,'weekly-practice-v1')
  assert.match(await old.locator('.weekly-received').innerText(),/only after you confirm/)
  await finish(s,{legacyInvitationPromisePreserved:true})
 }
 assert.deepEqual(report.errors,[]);report.passed=true
}finally{
 await browser.close();await server.close();await writeFile('tests/reports/weekly-signup-ui.json',JSON.stringify(report,null,2)+'\n')
}
console.log(JSON.stringify({passed:report.passed,cases:report.cases.length,report:'tests/reports/weekly-signup-ui.json'}))
