// Exercise the real transition controller under rapid forward/back navigation.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/pv-presentation.js', 'utf8');
const controller = source.slice(source.indexOf('var exitTimers=[];'), source.indexOf('function next(){'));
function run(reduced) {
  const timers = new Map(); let id = 0;
  const slides = Array.from({length: 4}, (_, i) => {
    const classes = new Set(i === 0 ? ['on'] : []);
    return {style: {display: ''}, classList: {
      add: (...xs) => xs.forEach(x => classes.add(x)),
      remove: (...xs) => xs.forEach(x => classes.delete(x)),
      contains: x => classes.has(x)
    }};
  });
  const ctx = {S: {mode:'present', i:0, gen:0}, SECT:slides, N:4,
    Env:{RM:reduced}, META:slides.map((_, i) => ({id:'s'+i,title:''})),
    clamp:(v,a,b)=>Math.min(b,Math.max(a,v)), closeLayers(){},
    setTimeout:fn=>{timers.set(++id, fn);return id}, clearTimeout:n=>timers.delete(n),
    applyAccent(){}, lightPulse(){}, history:{pushState(){}}, play(){},
    paint(){}, announce(){}, updatePresenter(){}, Log:{add(){}},pad2:String,
    Fit:{schedule(){},apply(){}},window:{scrollTo(){}}
  };
  vm.createContext(ctx); vm.runInContext(controller,ctx);
  [1,2,3,1,0,2].forEach(i=>ctx.go(i));
  for (const fn of timers.values()) fn();
  const visible = slides.flatMap((s,i)=>s.classList.contains('on') || s.style.display==='flex' ? [i] : []);
  assert.deepEqual(visible,[2], 'rapid navigation must not leave old slides displayed');
  assert.equal(ctx.S.i,2);
}
run(false);run(true);
console.log('Rapid navigation: normal and reduced motion passed.');
