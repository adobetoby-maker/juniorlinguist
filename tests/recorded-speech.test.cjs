const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function load(){
 const manifest={entries:{'está aquí':{female:'es-next-0123456789abcdefabcd-female'},'x':{female:'../../bad'}}};const audios=[];
 class Audio{constructor(path){this.path=path;audios.push(this)}play(){return Promise.resolve()}pause(){this.paused=true}removeAttribute(){}load(){}}
 let source=fs.readFileSync('src/lib/recordedSpeech.ts','utf8').replace(/^import manifest .*$/m,'const manifest = '+JSON.stringify(manifest));source=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const context={exports:{},Audio,Promise};vm.runInNewContext(source,context);return{...context.exports,audios};
}
test('exact Spanish recording match preserves accents and rejects other languages and unsafe paths',()=>{const p=load();assert.ok(p.recordingPath('  ESTÁ   AQUÍ.','es-CR'));assert.equal(p.recordingPath('esta aqui','es-US'),null);assert.equal(p.recordingPath('está aquí','fr'),null);assert.equal(p.recordingPath('está aquí','es-ES'),null);assert.equal(p.recordingPath('está aquí','es-US','male'),null);assert.equal(p.recordingPath('x','es-US'),null)});
test('recorded playback completes and honors the selected speed',async()=>{const p=load();const result=p.playRecordedSpeech('está aquí','es-US',.8);assert.equal(p.audios[0].playbackRate,.8);p.audios[0].onended();assert.equal(await result,true)});
test('stop settles the pending recording without requesting fallback',async()=>{const p=load();const result=p.playRecordedSpeech('está aquí','es-US',1);p.stopRecordedSpeech();assert.equal(p.audios[0].paused,true);assert.equal(await result,null)});
test('a failed or unmatched recording allows the existing speech path',async()=>{const p=load();assert.equal(await p.playRecordedSpeech('unrecorded','es-US',1),false);const result=p.playRecordedSpeech('está aquí','es-US',1);p.audios[0].onerror();assert.equal(await result,false)});
