const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const ctx={};vm.createContext(ctx);for(const f of ['data.js','core.js','board.js','berries.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),ctx);
const C=ctx.SleepCore,D=ctx.SleepData,B=ctx.BoardView;
const chansey={id:'sample',species:'CHANSEY',customName:'',nickname:'sample',level:60,slots:['Egg','Potato','Honey'],nature:'BASHFUL',subskills:['INGREDIENT_FINDER_S','HELPING_SPEED_M','INGREDIENT_FINDER_M','HELPING_BONUS','INVENTORY_L'],ribbon:0,carry:null,mainSkillLevel:null,memo:''};
const near=(a,b)=>assert(Math.abs(a-b)<1e-9);
for(const stage of [0,1,2,3,4])for(const camp of [false,true])for(const mode of ['current','70']){
 const p={...chansey,ribbon:stage},before=JSON.stringify(p),options={camp,evolution:'auto'};
 for(const target of p.slots){const current=C.calc(p,mode,100,{camp,evolution:'current'}),final=C.calc(p,mode,100,{camp,evolution:'final'}),auto=C.calc(p,mode,100,options,target);assert(auto.ok);near(auto.counts[target],Math.max(current.counts[target],final.counts[target]));assert.equal(auto.calculationSpecies,current.counts[target]>=final.counts[target]?'CHANSEY':'BLISSEY');assert(B.identity(p,{...options,mode},'ingredient',auto).includes(C.species(auto.calculationSpecies).name));}
 assert.equal(JSON.stringify(p),before);
}
assert.equal(C.calc(chansey,'current',100,{evolution:'auto'},'Egg').calculationSpecies,'BLISSEY');
assert.equal(C.calc({...chansey,ribbon:4},'current',100,{evolution:'auto'},'Egg').calculationSpecies,'CHANSEY');
// Independent original ribbon arithmetic: data extraction must not change existing results.
for(const id of ['CHARMANDER','CHARMELEON','CHARIZARD'])for(const stage of [0,1,2,3,4]){const n=C.species(id).remainingEvolutions;let old=1;if(stage>=2)old-=n===2?.11:n===1?.05:0;if(stage>=4)old-=n===2?.14:n===1?.07:0;near(D.ribbons[stage].frequencyByRemainingEvolutions[n],old);}
const state=C.emptyState();state.pokemon=[{...chansey,ribbon:4}];state.evolution='auto';let ranked=C.autoAssign(state);for(const target of chansey.slots){assert.equal(ranked.assignments[target].pokemonId,'sample');const r=C.calc(ranked.pokemon[0],ranked.mode,ranked.energy,ranked,target);near(C.compare(ranked,{ingredients:[{id:target,amount:1}]} )[0].quantity,r.counts[target]);}
assert.deepEqual(JSON.parse(JSON.stringify(C.validateState(JSON.parse(JSON.stringify(ranked))))),JSON.parse(JSON.stringify(ranked)));
const missing={...chansey,ribbon:null};assert.equal(C.calc(missing,'current',100,{evolution:'auto'},'Egg').ok,false);assert.equal(C.calc(chansey,'80',100,{evolution:'auto'},'Egg').ok,false);
const berry={...chansey,id:'berry',species:'ONIX',slots:['Tomato','Sausage','Potato'],subskills:['BERRY_FINDING_S','HELPING_SPEED_M','HELPING_SPEED_S','HELPING_BONUS','INVENTORY_L'],ribbon:4};
for(const b of D.berries){const a=C.calcBerry(berry,'60',100,{evolution:'auto'},b.id),rows=['current','final'].map(evolution=>C.calcBerry(berry,'60',100,{evolution},b.id)).filter(r=>r.ok);assert.equal(a.ok,rows.length>0);if(a.ok)near(a.berryEnergy,Math.max(...rows.map(r=>r.berryEnergy)));}
ranked=C.autoAssign({...state,pokemon:[berry]});for(const [id,a] of Object.entries(ranked.berryAssignments)){const r=C.calcBerry(berry,ranked.mode,ranked.energy,ranked,id);assert(r.ok);const standard=ctx.BerryView.render(ranked,{items:[C.berry(id)]}),map=ctx.BerryView.render(ranked,{items:[C.berry(id)]});assert.equal(standard,map);assert(standard.includes(C.species(r.calculationSpecies).name));}
for(const map of D.maps){assert.equal(map.dynamic,map.berries.length===0);for(const id of map.berries)assert(C.berry(id));if(!map.dynamic)assert.equal(map.berries.length,3);}
assert.equal(ctx.BerryView.render(C.emptyState(),{items:D.maps.find(m=>m.id==='cyan').berries.map(C.berry)}).match(/<article/g).length,3);
const branch={...berry,species:'EEVEE'};assert.equal(C.calcBerry(branch,'60',100,{evolution:'auto'}).ok,false);
console.log('PASS auto form comparison by target, ribbon reversal, all stages/camp/levels, ranking/cooking/maps/display consistency, missing data/branches, immutable records and backup compatibility');

// Independent Chansey/Blissey 2000-hour trace: source base stats and ribbon
// coefficient must reach the final interval, counts and berry energy.
const ribbonChansey={...chansey,ribbon:4};
for(const [evolution,id,frequency,rate,ribbon,baseInterval] of [['current','CHANSEY',3300,.236,.88,2202],['final','BLISSEY',3100,.238,1,2351]]){
 const sp=C.species(id),r=C.calc(ribbonChansey,'60',100,{evolution},'Egg'),b=C.calcBerry(ribbonChansey,'60',100,{evolution});
 assert.equal(sp.frequency,frequency);near(sp.ingredientRate,rate);near(D.ribbons[4].frequencyByRemainingEvolutions[sp.remainingEvolutions],ribbon);
 assert.equal(r.baseInterval,baseInterval);near(r.interval,baseInterval*.45);near(r.helps,86400/(baseInterval*.45));near(r.rate,rate*1.54);
 near(r.counts.Egg,r.helps*r.rate*2/3);near(b.berryEnergy,r.helps*(1-r.rate)*C.berryPower(b.berryId,60));
}
for(const stage of [0,4]){const p={...chansey,ribbon:stage},rows=['current','final'].map(evolution=>C.calcBerry(p,'60',100,{evolution})),best=C.calcBerry(p,'60',100,{evolution:'auto'});near(best.berryEnergy,Math.max(...rows.map(r=>r.berryEnergy)));assert.equal(best.calculationSpecies,stage===4?'CHANSEY':'BLISSEY');}
const originalRecord=JSON.stringify(ribbonChansey);const chosen=C.calc(ribbonChansey,'60',100,{evolution:'auto'},'Egg');
assert(B.render({state:C.autoAssign({...state,pokemon:[ribbonChansey]}),list:D.ingredients,items:[C.ingredient('Egg')]}).includes('ラッキー'));
assert.equal(JSON.stringify(ribbonChansey),originalRecord);assert(chosen.counts.Egg>21&&chosen.counts.Egg<22);
console.log('PASS independent 2000-hour Chansey/Blissey performance trace, both metrics, shared card/ranking result and immutable record');

// An independent ribbon override is equivalent to the same registered stage,
// without writing it back to the individual or changing either evolution model.
for(const stage of [0,1,2,3,4])for(const camp of [false,true])for(const evolution of ['current','final','auto']){
 const p={...chansey,ribbon:0},snapshot=JSON.stringify(p),opts={camp,evolution,ribbonOverride:stage};
 for(const target of p.slots){const expected=C.calc({...p,ribbon:stage},'60',100,{camp,evolution},target),actual=C.calc(p,'60',100,opts,target);assert.equal(JSON.stringify(actual),JSON.stringify(expected));}
 assert.equal(JSON.stringify(C.calcBerry(p,'60',100,opts)),JSON.stringify(C.calcBerry({...p,ribbon:stage},'60',100,{camp,evolution})));
 assert.equal(JSON.stringify(p),snapshot);
}
const overrideChansey={...chansey,ribbon:0};
assert.equal(C.calc(overrideChansey,'60',100,{evolution:'auto',ribbonOverride:4},'Egg').calculationSpecies,'CHANSEY');
assert.equal(C.calc(overrideChansey,'60',100,{evolution:'auto',ribbonOverride:0},'Egg').calculationSpecies,'BLISSEY');
for(const value of [undefined,null])assert.equal(JSON.stringify(C.calc(chansey,'60',100,{evolution:'auto',ribbonOverride:value},'Egg')),JSON.stringify(C.calc(chansey,'60',100,{evolution:'auto'},'Egg')));
assert.equal(C.calc(overrideChansey,'60',100,{ribbonOverride:5}).ok,false);
let collectionState=C.emptyState();const fast={...chansey,id:'faster',ribbon:4},slow={...chansey,id:'slower',nature:'ADAMANT',ribbon:0},unknown={...chansey,id:'unknown',nature:''};collectionState={...collectionState,mode:'60',evolution:'auto',ribbonOverride:4,pokemon:[slow,fast,unknown]};
const saved=JSON.stringify(collectionState),rows=C.collectionCandidates('Egg',collectionState),valid=rows.filter(x=>x.r.ok);assert.equal(rows.length,3);assert(!rows[rows.length-1].r.ok);for(let i=1;i<valid.length;i++)assert(valid[i-1].r.counts.Egg>=valid[i].r.counts.Egg);for(const row of valid)assert.equal(JSON.stringify(row.r),JSON.stringify(C.assignmentResult('ingredient',row.p,'Egg',collectionState)));assert.equal(JSON.stringify(collectionState),saved);
console.log('PASS independent ribbon/current-final-auto equivalence, Chansey reversal, legacy defaults, immutable individuals, complete read-only candidate list and precise order');

// Requested Lv60 AAA A/B/C/D matrix: fixed numeric results independent of trace rendering.
const aaa={...chansey,slots:['Egg','Egg','Egg'],ribbon:0};
const chanseyIntervals=[2503,2503,2377,2377,2202],chanseyCounts=[130.1007750699161,130.1007750699161,136.9971560790913,136.9971560790913,147.88475930971848];
const savedAAA=JSON.stringify(aaa);
for(const stage of [0,1,2,3,4]){
 const a=C.calc(aaa,'60',100,{evolution:'current',ribbonOverride:stage},'Egg');
 const b=C.calc(aaa,'60',100,{evolution:'final',ribbonOverride:stage},'Egg');
 const direct=C.calc({...aaa,species:'BLISSEY'},'60',100,{evolution:'current',ribbonOverride:stage},'Egg');
 assert.equal(a.baseInterval,chanseyIntervals[stage]);near(a.counts.Egg,chanseyCounts[stage]);
 assert.equal(b.baseInterval,2351);near(b.counts.Egg,139.68605699702255);near(direct.counts.Egg,b.counts.Egg);
 assert.equal(a.helpTrace.remainingEvolutions,1);assert.equal(b.helpTrace.remainingEvolutions,0);
 assert.equal(a.helpTrace.ribbonStage,stage);assert.equal(b.helpTrace.ribbonStage,stage);
 assert.equal(b.helpTrace.ribbonFactor,1);near(a.helpTrace.ribbonFactor,[1,1,.95,.95,.88][stage]);
 for(const r of [a,b]){
  near(r.interval,r.baseInterval*.45);near(r.counts.Egg,r.helps*r.rate*14/3);
  const text=B.productionTrace(r);assert(text.includes(C.species(r.calculationSpecies).name));assert(text.includes('最終間隔'));assert(text.includes('リボン'));
 }
 const ranked=C.autoAssign({...C.emptyState(),mode:'60',ribbonOverride:stage,pokemon:[aaa,{...aaa,id:'blissey',species:'BLISSEY'}]});
 assert.equal(ranked.assignments.Egg.pokemonId,stage===4?aaa.id:'blissey');
 const card=B.render({state:ranked,items:[C.ingredient('Egg')]});
 assert(card.includes(stage===4?'ラッキー':'ハピナス'));assert(card.includes(B.ingredientCountText(stage===4?a.counts.Egg:b.counts.Egg)));
}
assert.equal(JSON.stringify(aaa),savedAAA);
// No Chansey-specific rule: all supported forms use the selected form's remaining evolutions.
for(const sp of D.pokemon.filter(sp=>!sp.calculationUnsupported))for(const stage of [0,1,2,3,4])for(const camp of [false,true]){
 const p={...aaa,species:sp.id,slots:sp.slots.map(row=>row[0].id)},snapshot=JSON.stringify(p);
 const r=C.calc(p,'60',100,{evolution:'current',ribbonOverride:stage,camp});assert(r.ok,sp.id);
 near(r.helpTrace.ribbonFactor,stage<2?1:sp.remainingEvolutions===0?1:stage<4?(sp.remainingEvolutions===1?.95:.89):(sp.remainingEvolutions===1?.88:.75));
 near(r.helpTrace.campFactor,camp?1.2:1);assert.equal(JSON.stringify(p),snapshot);
}
console.log('PASS Lv60 AAA four-way numeric matrix, every ribbon stage/current-final, direct Blissey, automatic owner/card equality and all supported species/camp conditions');
