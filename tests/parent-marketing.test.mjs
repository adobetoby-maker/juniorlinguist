import test from 'node:test'
import assert from 'node:assert/strict'
import { PARENT_POLICY, PARENT_COPY, PARENT_TRACKS, parentReadiness, parentMarketingStatus } from '../server/parent-marketing.js'
const availability = () => ({enabled:true,available:true,policyVersion:'weekly-practice-v1',pacing:'one_lesson_email_per_week_total',privacyUrl:'https://languagethreshold.com/privacy',parentDownload:{enabled:false,policyVersion:PARENT_POLICY,copy:PARENT_COPY,tracks:[...PARENT_TRACKS]},antiAbuse:{provider:'turnstile',siteKey:'synthetic-public-key',action:'weekly_signup',cdataRequired:true},tracks:PARENT_TRACKS.map((id,i)=>({id,totalWeeks:i?50:10,publishedLessons:i?50:10,available:true}))})
const policy = () => ({site:'juniorlinguist.com',enabled:false,policyVersion:PARENT_POLICY,copy:PARENT_COPY})
function fetchFixture(a=availability(), p=policy()) {
 const calls=[]
 return {calls,fetcher:async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify(url.includes('/api/weekly-subscriptions')?a:p))}}
}
test('source can prove its readiness before parent signup is activated',async()=>{
 const mock=fetchFixture(),s=await parentMarketingStatus('dpl_TestSource123',mock.fetcher)
 assert.equal(s.ready,true);assert.equal(s.enabled,false);assert.equal(s.supportsDirectMarketing,true)
 assert.equal(s.policyVersion,PARENT_POLICY);assert.equal(s.copy,PARENT_COPY);assert.equal(s.sourceDeployment,'dpl_TestSource123')
 assert.equal(mock.calls.length,2)
 for(const c of mock.calls){assert.ok(c.url.startsWith('https://myaimarketing.worker-bee.app/api/'));assert.equal(c.options.redirect,'error');assert.equal(c.options.cache,'no-store')}
})
test('both parent series need full published assets and bot protection',()=>{
 assert.equal(parentReadiness(availability()),true)
 for(const delta of [{enabled:false},{available:false},{policyVersion:'other'},{pacing:'every_day'},{parentDownload:null},{tracks:[]},{privacyUrl:'https://example.com'}])assert.equal(parentReadiness({...availability(),...delta}),false)
 for(const delta of [{siteKey:''},{action:'login'},{cdataRequired:false}]){
  const a=availability();Object.assign(a.antiAbuse,delta);assert.equal(parentReadiness(a),false)
 }
 for(const delta of [{publishedLessons:49},{available:false},{totalWeeks:51}]){
  const a=availability();Object.assign(a.tracks[1],delta);assert.equal(parentReadiness(a),false)
 }
 const duplicate=availability();duplicate.tracks.push(duplicate.tracks[0]);assert.equal(parentReadiness(duplicate),false)
})
test('activation requires the exact source, policy copy and deployment identity',async()=>{
 for(const delta of [{site:'evil.example'},{policyVersion:'invented'},{copy:'Marketing anything'},{enabled:'yes'}]){
  const mock=fetchFixture(availability(),{...policy(),...delta});await assert.rejects(parentMarketingStatus('dpl_TestSource123',mock.fetcher))
 }
 for(const d of [undefined,'','not-a-deployment'])await assert.rejects(parentMarketingStatus(d,fetchFixture().fetcher))
 const a=availability(),p=policy();a.parentDownload.enabled=true;p.enabled=true
 assert.equal((await parentMarketingStatus('dpl_TestSource123',fetchFixture(a,p).fetcher)).enabled,true)
})
test('upstream errors, oversized and malformed responses fail closed',async()=>{
 for(const fetcher of [async()=>new Response('unavailable',{status:503}),async()=>new Response('x'.repeat(8193)),async()=>new Response('{bad'),async()=>{throw Error('network')}])await assert.rejects(parentMarketingStatus('dpl_TestSource123',fetcher))
})
