(function(root){
'use strict';
// Only this identifier changes in an explicitly approved release snapshot.
// Never infer an environment from a URL, backup contents or query parameter.
const id='test';
const keys=Object.freeze({
 development:'nemuri-selection-notebook-development-v1',
 test:'nemuri-selection-notebook-test-v1',
 production:'nemuri-selection-notebook-production-v1'
});
if(!Object.hasOwn(keys,id))throw new Error('保存先の環境設定が不正です');
root.SleepEnvironment=Object.freeze({id,storageKey:keys[id],qaStorageKey:keys[id]+'-qa'});
})(globalThis);
