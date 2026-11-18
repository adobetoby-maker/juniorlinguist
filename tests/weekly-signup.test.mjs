import test from 'node:test'
import assert from 'node:assert/strict'
import {weeklyAvailability,weeklyRequest,weeklyRequestAccepted,WEEKLY_TRACKS,WEEKLY_PRIVACY,WEEKLY_POLICY,PARENT_POLICY,PARENT_COPY,PARENT_TRACKS} from '../src/lib/weekly-signup.ts'
const available=()=>({enabled:true,available:true,policyVersion:WEEKLY_POLICY,pacing:'one_lesson_email_per_week_total',privacyUrl:WEEKLY_PRIVACY,antiAbuse:{provider:'turnstile',siteKey:'public-test-sitekey',action:'weekly_signup',cdataRequired:true},tracks:WEEKLY_TRACKS.map(t=>({id:t.id,totalWeeks:t.weeks,available:true}))})
const request=()=>({email:'Parent@Example.com',trackId:WEEKLY_TRACKS[0].id,adult:true,consent:true,token:'synthetic-token',requestId:'12345678-1234-4123-8123-123456789abc',website:''})
test('availability requires the deployed consent, pacing, privacy and bot-check contract',()=>{
 assert.deepEqual(weeklyAvailability(available()).tracks,WEEKLY_TRACKS.map(t=>t.id))
 for(const delta of [{enabled:false},{available:false},{policyVersion:'older'},{pacing:'all_tracks_daily'},{privacyUrl:'https://evil.example'},{tracks:[]}])assert.equal(weeklyAvailability({...available(),...delta}),null)
 for(const delta of [{provider:'none'},{siteKey:''},{action:'download'},{cdataRequired:false}]){
  const value=available();Object.assign(value.antiAbuse,delta);assert.equal(weeklyAvailability(value),null)
 }
})
test('a browser cannot select unavailable or unknown tracks',()=>{
 const value=available();value.tracks[1].available=false
 const ready=weeklyAvailability(value)
 assert.equal(ready.tracks.length,2)
 assert.throws(()=>weeklyRequest({...request(),trackId:WEEKLY_TRACKS[1].id},ready))
 assert.throws(()=>weeklyRequest({...request(),trackId:'invented-track'},ready))
 value.tracks.push(value.tracks[0]);assert.equal(weeklyAvailability(value),null)
})
test('request contains one adult email, one track, permission and bound request ID only',()=>{
 const body=weeklyRequest(request(),weeklyAvailability(available()))
 assert.equal(body.email,'parent@example.com')
 assert.deepEqual(Object.keys(body).sort(),['action','adult','email','policyVersion','requestId','trackId','turnstileToken','website','weeklyConsent'].sort())
 assert.equal(body.requestId,request().requestId)
 for(const delta of [{adult:false},{consent:false},{token:''},{email:'bad email'},{requestId:'not-a-uuid'}])assert.throws(()=>weeklyRequest({...request(),...delta},weeklyAvailability(available())))
})
test('only the exact202receipt represents a request, never active enrollment',()=>{
 assert.equal(weeklyRequestAccepted(202,{status:'request_received'}),true)
 for(const [code,value]of [[200,{status:'request_received'}],[202,{status:'active'}],[503,{status:'request_received'}],[202,{}]])assert.equal(weeklyRequestAccepted(code,value),false)
})

test('parent download is unavailable until its exact scoped permission is approved', () => {
 const value=available()
 assert.equal(weeklyAvailability(value,true),null)
 value.parentDownload={enabled:true,policyVersion:PARENT_POLICY,copy:PARENT_COPY,tracks:[...PARENT_TRACKS]}
 assert.deepEqual(weeklyAvailability(value,true).tracks,[...PARENT_TRACKS])
 for(const delta of [{enabled:false},{copy:'Send anything'},{policyVersion:'weekly-practice-v1'},{tracks:[...PARENT_TRACKS,WEEKLY_TRACKS[2].id]},{tracks:[PARENT_TRACKS[0],PARENT_TRACKS[0]]}]){
  assert.equal(weeklyAvailability({...value,parentDownload:{...value.parentDownload,...delta}},true),null)
 }
 value.tracks[1].available=false
 assert.equal(weeklyAvailability(value,true),null)
 // The legacy separate-invitation form remains available and retains its policy.
 assert.equal(weeklyRequest(request(),weeklyAvailability(value)).policyVersion,WEEKLY_POLICY)
})
test('direct family download cannot subscribe an adult work module or omit permission', () => {
 const value=available();value.parentDownload={enabled:true,policyVersion:PARENT_POLICY,copy:PARENT_COPY,tracks:[...PARENT_TRACKS]}
 const ready=weeklyAvailability(value,true)
 for(const trackId of PARENT_TRACKS){
  const body=weeklyRequest({...request(),trackId},ready,true)
  assert.equal(body.policyVersion,PARENT_POLICY)
  assert.equal(body.weeklyConsent,true)
  assert.equal(body.adult,true)
  assert.equal(body.trackId,trackId)
  assert.equal(body.requestId,request().requestId)
 }
 assert.throws(()=>weeklyRequest({...request(),trackId:WEEKLY_TRACKS[2].id},weeklyAvailability(value),true))
 for(const delta of [{consent:false},{adult:false},{token:''},{requestId:'unbound'}])assert.throws(()=>weeklyRequest({...request(),...delta},ready,true))
})
