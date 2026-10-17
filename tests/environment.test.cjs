const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const source=read('environment.js');
const context={};vm.createContext(context);vm.runInContext(source,context);
const actual=context.SleepEnvironment;
assert(['development','test'].includes(actual.id));
const keys=[];
for(const id of ['development','test','production']){
 const c={};vm.createContext(c);vm.runInContext(source.replace(/const id='[^']+';/,`const id='${id}';`),c);
 const env=c.SleepEnvironment;
 assert(Object.isFrozen(env));assert.equal(env.id,id);
 assert.equal(env.storageKey,`nemuri-selection-notebook-${id}-v1`);
 assert.equal(env.qaStorageKey,env.storageKey+'-qa');keys.push(env.storageKey,env.qaStorageKey);
}
assert.equal(new Set(keys).size,6);
for(const legacy of ['sleep-ingredient-journal-1','sleep-ingredient-journal-v1-test'])assert(!keys.includes(legacy));
assert.throws(()=>vm.runInNewContext(source.replace(/const id='[^']+';/,"const id='invalid';")));
const app=read('app.js'),html=read('index.html'),workflow=read('.github/workflows/pages.yml');
assert(app.includes('KEY=TEST?SleepEnvironment.qaStorageKey:SleepEnvironment.storageKey'));
assert(!app.includes('sleep-ingredient-journal-1'));assert(!app.includes('sleep-ingredient-journal-v1-test'));
assert(html.indexOf('src="environment.js')<html.indexOf('src="app.js'));
assert(app.includes('environment:SleepEnvironment.id'));assert(app.includes('現在のデータを置き換え'));
assert(workflow.includes('node tests/environment.test.cjs'));
if(actual.id==='development'){
 assert(!workflow.includes('actions/deploy-pages'));assert(!workflow.includes('pages: write'));
 assert(workflow.includes("github.repository == 'mokuhibi/nemuri-selection-notebook-dev'"));
}else{
 assert(workflow.includes('workflow_dispatch:'));assert(workflow.includes('approved_commit:'));
 assert(!/^  (push|pull_request|schedule):/m.test(workflow));
 assert(workflow.includes('test "$APPROVED_COMMIT" = "$GITHUB_SHA"'));
 assert(workflow.includes("github.repository == 'mokuhibi/nemuri-selection-notebook-test'"));
}
require('../data.js');require('../core.js');require('../backup.js');
const state=SleepCore.emptyState();
const bundle={...state,exportMeta:{environment:'production'},futureSettings:{empty:'',unknown:null,ordered:['A','B']}};
const decoded=SleepBackup.decode(SleepBackup.encode(bundle));
assert.deepEqual(JSON.parse(JSON.stringify(decoded)),bundle);
assert.deepEqual(SleepCore.validateState(decoded),state);
assert.equal(context.SleepEnvironment.storageKey,actual.storageKey,'backup metadata cannot switch environment');
assert.deepEqual(SleepCore.validateState(SleepBackup.decode(JSON.stringify(bundle))),state);
console.log('PASS development/test/production+QA keys, no legacy key access, CSV/JSON compatibility, future CSV fields, immutable environment, and explicit deployment gates');
