const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
require('../data.js');require('../core.js');require('../board.js');require('../berries.js');
const pngs=dir=>fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.png'));
assert.equal(pngs('assets/pokemon').length,0);
assert.equal(pngs('assets/berries').length,0);
assert(!read('board.js').includes('assets/pokemon/'));
const state=SleepCore.emptyState();
const p={id:'source-test',species:'RAICHU',nickname:'',customName:'',memo:'',level:60,slots:['Apple','Apple','Apple'],nature:'BASHFUL',subskills:['BERRY_FINDING_S','HELPING_SPEED_M','HELPING_SPEED_S','HELPING_BONUS','INVENTORY_L'],ribbon:0,carry:null,mainSkillLevel:null};
state.pokemon=[p];state.berryAssignments.GREPA={pokemonId:p.id};
const rendered=BerryView.render(state);
assert(rendered.includes('ライチュウ'));assert(!rendered.includes('<img'));
assert(read('.github/workflows/pages.yml').includes('cp DATA_SOURCES.md _site/'));
assert(read('.github/workflows/pages.yml').includes("find assets/pokemon assets/berries"));
for(const file of ['data.js','core.js','README.md','app.js','AGENTS.md'])assert(read(file).includes('DATA_SOURCES.md'));
assert(read('licenses/NOTICE.txt').startsWith("Neroli's Lab\nCopyright The Neroli's Lab Authors"));
assert(read('licenses/PokeAPI-BSD-3-Clause.txt').includes('Redistribution and use'));
for(const id of ['FOONGUS','AMOONGUSS']){const sp=SleepCore.species(id);assert.equal(sp.sourceId,'raenonx-20261005');assert.equal(sp.carry,null);}
console.log('PASS source registry/credits published, unused game images excluded, image-free cards, separate source identities and unknown carry retained');

// Approved ingredient artwork is separate from removed Pokemon/berry images.
const svgNames=fs.readdirSync(path.join(root,'assets/ingredients')).filter(f=>f.endsWith('.svg'));
assert.deepEqual(svgNames.sort(),SleepData.ingredients.map(i=>i.id+'.svg').sort());
const iconState=SleepCore.emptyState(),iconHTML=BoardView.render({state:iconState});
for(const ingredient of SleepData.ingredients){
 const svg=read('assets/ingredients/'+ingredient.id+'.svg');
 assert(svg.includes('MIT License'));assert(svg.includes('Copyright (c) '+(['Pumpkin','Avocado'].includes(ingredient.id)?'2025':'2024')+' ちゃんりわ'));
 assert(svg.includes('Permission is hereby granted'));assert(svg.includes('THE SOFTWARE IS PROVIDED'));
 assert(svg.includes('11ebec8de7b7803e5d095e4f32ee29f6bc7db2fb'));assert(svg.includes('viewBox="0 0 200 200"'));
 assert(!/<image|<script|href=/.test(svg));
 assert(iconHTML.includes('src="assets/ingredients/'+ingredient.id+'.svg'));
 const elements=[...svg.matchAll(/<([A-Za-z][A-Za-z0-9-]*)\b/g)].map(m=>m[1]);
 assert(elements.every(tag=>['svg','g','path','ellipse','circle','rect','polygon','polyline','line','defs','linearGradient','radialGradient','stop','clipPath'].includes(tag)),ingredient.id+' must contain only native SVG, never unresolved React components');
 assert(elements.some(tag=>['path','ellipse','circle','rect','polygon','polyline','line'].includes(tag)),ingredient.id+' must contain real geometry');
 assert(!/\w+=\{/.test(svg),ingredient.id+' must not contain JSX attribute expressions');
}
assert(iconHTML.includes('aria-hidden="true"'));
assert(read('app.js').includes('img.decode()'));assert(read('app.js').includes('食材アイコン © 2024 / 2025 ちゃんりわ'));
assert(read('app.js').includes('href="licenses/nitoyon-ingredient-icons-MIT.txt"'));
assert(read('licenses/NOTICE.txt').includes('separate MIT-licensed artwork'));
console.log('PASS all 19 ID-keyed licensed SVG watermarks, authors/years, fixed source, no external image dependency, share decode and settings credit');

for(const id of ['Pumpkin','Avocado']){const svg=read('assets/ingredients/'+id+'.svg');assert(svg.includes('<g transform="scale(3.8)'));assert(svg.includes('fill="'+(id==='Pumpkin'?'#fea712':'#749f3e')+'"'));assert(iconHTML.includes(id+'.svg?v=20261017-grouped'));}
console.log('PASS grouped Pumpkin/Avocado geometry, transforms, original colors and cache refresh');
