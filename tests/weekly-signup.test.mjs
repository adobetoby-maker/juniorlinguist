import test from 'node:test'
import assert from 'node:assert/strict'
import {weeklyAvailability,weeklyRequest,weeklyRequestAccepted,WEEKLY_TRACKS,WEEKLY_PRIVACY,WEEKLY_POLICY} from '../src/lib/weekly-signup.ts'
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
