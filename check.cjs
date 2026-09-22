const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map(),registered=[];const make=()=>({style:{},hidden:true,open:false,addEventListener(){},getContext(){return{}},getBoundingClientRect(){return {width:1200,height:530}},focus(){}});const sandbox={document:{getElementById(id){if(!elements.has(id))elements.set(id,make());return elements.get(id)},addEventListener(){},modelContext:{registerTool(t){registered.push(t)}}},ResizeObserver:class{observe(){}},requestAnimationFrame(){},Math,console};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/game.js','utf8'),sandbox);const run=s=>vm.runInContext(s,sandbox);
run('angle=60; startCharge(); power=.88; fire()');assert.equal(run('phase'),'flight');assert.equal(run('mult'),2);for(let i=0;i<1500&&run('phase')==='flight';i++)run('update(1/60)');assert.equal(run('phase'),'result');assert(run('total')>0);assert.equal(run('total'),run('shot'));run('next()');assert.equal(run('shot'),0);assert.equal(run('phase'),'aim');
run('startCharge();fire();ball={x:500,y:301,vx:0,vy:-200,r:9,rest:0}; update(.03)');assert(run('ball.vy')>0);assert(run('shot')>=150);
run('ball={x:800,y:412,vx:0,vy:200,r:9,rest:0};update(.03)');assert.equal(run('phase'),'result');assert(run('total')>=150);
run('next();startCharge();fire();ball={x:460,y:410,vx:0,vy:200,r:9,rest:0};update(.04)');assert.equal(run('mult'),2);
run('ball={x:620,y:397,vx:0,vy:200,r:9,rest:0};update(.04)');assert(run('ball.vy')< -400);
run('shot=1500;finish("test")');assert(run('level')>=3);assert.equal(registered[0].execute().level,run('level'));console.log('PASS: launch, perfect timing, shot completion, next shot, island underside, sticky trap, multiplier, slime, level-up, registered state readback');

