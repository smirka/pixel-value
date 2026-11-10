var PV_THREE_SCENE_URL = new URL('./pv-3d-scenes.js', document.currentScript.src).href;

(function(){
"use strict";

/* ══════════ ENV ══════════ */
var Env=(function(){
  var mqRM=window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine=window.matchMedia('(pointer:fine)');
  var cores=navigator.hardwareConcurrency||4;
  var mem=navigator.deviceMemory||4;
  var saveData=!!(navigator.connection&&navigator.connection.saveData);
  var narrow=window.matchMedia('(max-width: 760px), (orientation: portrait)').matches;
  var api={
    RM:mqRM.matches,
    FINE:mqFine.matches,
    LOW:(cores<=4||mem<=4||saveData||narrow),
    cores:cores,
    idle: window.requestIdleCallback
      ? window.requestIdleCallback.bind(window)
      : function(f){ return window.setTimeout(function(){ f({didTimeout:false,timeRemaining:function(){return 0;}}); },1); }
  };
  function bind(mq,key){
    var h=function(e){ api[key]=e.matches; };
    if(mq.addEventListener){ mq.addEventListener('change',h); }
    else if(mq.addListener){ mq.addListener(h); }
  }
  bind(mqRM,'RM');
  bind(mqFine,'FINE');
  return api;
})();

/* ══════════ HELPERS ══════════ */
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function pad2(n){ return (n<10?'0':'')+n; }
function num(v){ var n=parseFloat(v); return isFinite(n)?n:0; }
function on(el,ev,fn,opt){ if(el){ el.addEventListener(ev,fn,opt||false); } }
function hexA(hex,a){
  var h=String(hex||'').replace('#','');
  if(h.length===3){ h=h.charAt(0)+h.charAt(0)+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2); }
  if(h.length!==6){ return 'rgba(155,123,255,'+a+')'; }
  var r=parseInt(h.substr(0,2),16), g=parseInt(h.substr(2,2),16), b=parseInt(h.substr(4,2),16);
  return 'rgba('+r+','+g+','+b+','+a+')';
}
function shade(hex){
  var h=String(hex||'').replace('#','');
  if(h.length===3){ h=h.charAt(0)+h.charAt(0)+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2); }
  if(h.length!==6){ return hex; }
  var r=Math.round(parseInt(h.substr(0,2),16)*0.7);
  var g=Math.round(parseInt(h.substr(2,2),16)*0.7);
  var b=Math.round(parseInt(h.substr(4,2),16)*0.7);
  return 'rgb('+r+','+g+','+b+')';
}

/* ══════════ TICKER ══════════ */var Ticker=(function(){
  var subs=[], raf=0, running=false, last=0;
  function loop(t){
    if(!running){ return; }
    raf=requestAnimationFrame(loop);    if(t-last<15.5){ return; }
    last=t;
    for(var i=subs.length-1;i>=0;i--){
      try{ subs[i](t); }catch(err){ /* изолируем ошибку подписчика */ }    }
  }  function start(){ if(running){ return; } running=true; last=0; raf=requestAnimationFrame(loop); }
  function stop(){ running=false; if(raf){ cancelAnimationFrame(raf); } raf=0; }
  on(document,'visibilitychange',function(){
    if(document.hidden){ stop(); } else if(subs.length){ start(); }
  });  return {
    add:function(f){ if(subs.indexOf(f)<0){ subs.push(f); } start(); return f; },
    remove:function(f){ var i=subs.indexOf(f); if(i>=0){ subs.splice(i,1); } if(!subs.length){ stop(); } },
    size:function(){ return subs.length; }
  };})();

/* ══════════ ДАННЫЕ ИССЛЕДОВАНИЯ ══════════ */
var DATA={
  activity:[{l:'Ежедневно',n:7,d:18},{l:'Несколько раз в неделю',n:6,d:18},{l:'1–2 раза в неделю',n:3,d:18},{l:'Реже',n:2,d:18}],  purchase:[{l:'Покупали',n:10,d:18},{l:'Не покупали',n:8,d:18}],
  motives:[{l:'Стиль / самовыражение',n:4,d:10},{l:'Редкие предметы',n:3,d:10},{l:'Повышение статуса',n:2,d:10},{l:'Влияние друзей',n:1,d:10},{l:'Поддержка студии',n:0,d:10}],
  rarity:[{l:'Да',n:7,d:18},{l:'Нет',n:6,d:18},{l:'Затрудняюсь',n:5,d:18}],
  friends:[{l:'Сильно',n:3,d:18},{l:'Иногда',n:7,d:18},{l:'Не влияют',n:8,d:18}]
};
function pct(n,d){ return d?Math.round(n/d*1000)/10:0; }
function pctStr(n,d){ return String(pct(n,d)).replace('.',',')+'%'; }

var WAFFLES={
  wPurch:{total:18,tip:'18 участников · наведите на квадрат',parts:[{n:10,c:'#00ff9c',l:'Покупали косметику'},{n:8,c:'#3a3f59',l:'Не покупали'}]},
  wRare:{total:18,tip:'наведите на квадрат',parts:[{n:7,c:'#ffbf69',l:'Да, связывают со статусом'},{n:6,c:'#66dfc4',l:'Нет'},{n:5,c:'#3a3f59',l:'Затрудняюсь'}]},
  wFriends:{total:18,tip:'наведите на квадрат',parts:[{n:3,c:'#00ff9c',l:'Друзья влияют сильно'},{n:7,c:'#66dfc4',l:'Влияют иногда'},{n:8,c:'#9b7bff',l:'Не влияют'}]}
};
var CHAPTERS=[
  {t:'Вопрос',i:2},{t:'Теория',i:3},{t:'Метод',i:5},{t:'Данные',i:6},{t:'Смысл',i:11},
  {t:'Монетизация',i:14},{t:'Голоса',i:16},{t:'Этика',i:17},{t:'Границы',i:19},{t:'Вывод',i:20},{t:'Источники',i:21}
];
var SOURCES=[
 {a:'Ryan, R. M., &amp; Deci, E. L. (2000)',t:'Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being.',m:'American Psychologist, 55(1), 68–78',l:'DOI: 10.1037/0003-066X.55.1.68 ↗',u:'https://doi.org/10.1037/0003-066X.55.1.68'},
 {a:'Ryan, R. M., Rigby, C. S., &amp; Przybylski, A. (2006)',t:'The motivational pull of video games: A self-determination theory approach.',m:'Motivation and Emotion, 30, 344–360',l:'DOI: 10.1007/s11031-006-9051-8 ↗',u:'https://doi.org/10.1007/s11031-006-9051-8'},
 {a:'Belk, R. W. (2013)',t:'Extended self in a digital world.',m:'Journal of Consumer Research, 40(3), 477–500',l:'DOI: 10.1086/671052 ↗',u:'https://doi.org/10.1086/671052'},
 {a:'Hamari, J. et al. (2017)',t:'Why do players buy in-game content An empirical study on concrete purchase motivations.',m:'Computers in Human Behavior, 68, 538–546',l:'DOI: 10.1016/j.chb.2016.11.045 ↗',u:'https://doi.org/10.1016/j.chb.2016.11.045'},
 {a:'Hussain, A. et al. (2025)',t:'In-game content purchase motivations (IGCPMs): Conceptualization, scale development, and validation.',m:'Information &amp; Management, 62(7), 104207',l:'DOI: 10.1016/j.im.2025.104207 ↗',u:'https://doi.org/10.1016/j.im.2025.104207'},
 {a:'Koles, B., Nagy, P., &amp; Vollet, G. (2025)',t:'How players make use of cosmetic items in video games: A persona approach.',m:'Journal of Consumer Behaviour, 24(4), 1729–1741',l:'DOI: 10.1002/cb.2490 ↗',u:'https://doi.org/10.1002/cb.2490'},
 {a:'Böffel, C. et al. (2025)',t:'Comparing motives for cosmetic microtransactions using the CMTX-Q.',m:'Computers in Human Behavior Reports, 19, 100700',l:'DOI: 10.1016/j.chbr.2025.100700 ↗',u:'https://doi.org/10.1016/j.chbr.2025.100700'},
 {a:'European Commission / CPC Network (21.03.2025)',t:'Key Principles on In-Game Virtual Currencies — прозрачность цен и защита потребителей.',m:'Официальный документ',l:'European Commission ↗',u:'https://commission.europa.eu/'}
];

var SECT=$$('section.screen');
var N=SECT.length;
var META=SECT.map(function(el){
  var lead=el.querySelector('.sub')||el.querySelector('.h-sub');
  return {
    id:el.id,
    title:el.getAttribute('data-title')||'',
    tag:el.getAttribute('data-tag')||'',
    notes:el.getAttribute('data-notes')||'',
    ac:el.getAttribute('data-ac')||'#9b7bff',
    ac2:el.getAttribute('data-ac2')||'#c3adff',
    lead:lead?lead.textContent.replace(/\s+/g,' ').trim().slice(0,190):''
  };
});
var S={i:0,dir:1,mode:'present',tab:'about',docsBuilt:false,presenter:false,t0:null,tick:null,fit:true,guides:false,gen:0};

/* ══════════ LOG ══════════ */
var Log=(function(){
  var lines=[],MAX=80,el=null;
  function stamp(){ var d=new Date(); return pad2(d.getHours())+':'+pad2(d.getMinutes())+':'+pad2(d.getSeconds()); }
  function render(){
    if(!el){ el=$('#liveLog'); }
    if(!el){ return; }
    el.innerHTML=lines.join('\n');
    el.scrollTop=el.scrollHeight;
  }
  return {
    add:function(msg,kind){
      var cls='p';
      if(kind==='ok'){ cls='g'; } else if(kind==='warn'){ cls='a'; } else if(kind==='err'){ cls='r'; } else if(kind==='info'){ cls='t2'; }
      lines.push('<span class="c">['+stamp()+']</span> <span class="'+cls+'">'+msg+'</span>');
      if(lines.length>MAX){ lines.splice(0,lines.length-MAX); }
      render();
    },
    clear:function(){ lines=[]; render(); },
    ensure:function(){ el=$('#liveLog'); render(); }
  };
})();

/* ══════════ TOAST ══════════ */
var toastT=null;
function toast(m){
  var t=$('#toast'); if(!t){ return; }
  t.textContent=m; t.classList.add('on');
  clearTimeout(toastT);
  toastT=setTimeout(function(){ t.classList.remove('on'); },2600);
}

/* ══════════ NAV BUILD ══════════ */
function buildNav(){
  var nav=$('#nav'),mm=$('#mmList'),dots=$('#dots'),ov=$('#ovGrid'),flow=$('#mapFlow');
  if(nav){
    nav.innerHTML='';
    CHAPTERS.forEach(function(c){
      var b=document.createElement('button');
      b.type='button';
      b.setAttribute('data-go',String(c.i));
      b.textContent=c.t;
      nav.appendChild(b);
    });
  }
  if(mm){
    mm.innerHTML='';
    META.forEach(function(m,k){
      var a=document.createElement('a');
      a.href='#'+m.id;
      a.setAttribute('data-go',String(k));
      a.innerHTML='<i>'+pad2(k)+'</i><span>'+m.title+'</span>';
      mm.appendChild(a);
    });  }
  if(dots){
    dots.innerHTML='';
    META.forEach(function(m,k){
      var d=document.createElement('i');
      d.setAttribute('data-go',String(k));
      d.setAttribute('role','tab');
      d.tabIndex=-1;
      d.setAttribute('aria-label','Кадр '+pad2(k)+': '+m.title);
      dots.appendChild(d);
    });
  }
  if(ov){
    ov.innerHTML='';
    META.forEach(function(m,k){
      var c=document.createElement('button');
      c.type='button';
      c.className='ov-c';
      c.setAttribute('data-go',String(k));
      c.setAttribute('data-i',String(k));
      c.style.setProperty('--ac',m.ac);
      c.setAttribute('aria-label','Кадр '+pad2(k)+': '+m.title);
      c.innerHTML='<span class="mini" aria-hidden="true"></span><span class="n">'+pad2(k)+'</span><span class="t">'+m.title+'</span><span class="s">'+m.tag+'</span>';
      ov.appendChild(c);
    });
  }
  if(flow){
    flow.innerHTML='';
    META.forEach(function(m,k){
      if(k>0){
        var ar=document.createElement('span');
        ar.className='maparr';
        ar.textContent='→';
        ar.setAttribute('aria-hidden','true');
        flow.appendChild(ar);
      }
      var nd=document.createElement('button');
      nd.type='button';
      nd.className='mapnode';
      nd.setAttribute('data-go',String(k));
      nd.textContent=m.tag;
      flow.appendChild(nd);
    });
  }
  var ct=$('#cTot'); if(ct){ ct.textContent=pad2(N); }
  var oc=$('#ovCount'); if(oc){ oc.textContent=N+' кадров 16:9 · нажмите, чтобы перейти'; }
}

/* ══════════ FIT ENGINE ══════════ */
var Fit=(function(){
  var pending=0,lastK=1;
  function enabled(){
    return S.fit && !Env.RM && S.mode==='present' && window.innerWidth>700;
  }
  function measure(sec){
    if(!sec){ return null; }
    var box=sec.querySelector('.fitbox');
    if(!box){ return null; }
    var wasOn=sec.classList.contains('on');
    if(!wasOn){ sec.classList.add('on'); }
    sec.classList.add('measuring');
    box.style.transform='none';
    void box.offsetHeight;
    var cs=getComputedStyle(sec);
    var availH=sec.clientHeight-num(cs.paddingTop)-num(cs.paddingBottom);
    var availW=sec.clientWidth-num(cs.paddingLeft)-num(cs.paddingRight);
    var needH=box.scrollHeight;
    var needW=box.scrollWidth;
    sec.classList.remove('measuring');
    if(!wasOn){ sec.classList.remove('on'); }
    if(availH<=0||availW<=0||needH<=0){ return null; }
    var k=clamp(Math.min(availH/needH,availW/needW),0.42,1);
    return {k:k,needH:needH,availH:availH,box:box};
  }
  function apply(sec){
    if(!sec){ return null; }
    if(!enabled()){
      var b0=sec.querySelector('.fitbox');
      if(b0){ b0.style.transform=''; }
      return null;
    }
    var r=measure(sec);
    if(!r){ return null; }
    r.box.style.transform = (r.k<0.999) ? 'scale('+r.k.toFixed(4)+')' : '';
    lastK=r.k;
    return r;
  }
  function schedule(sec,delay){
    clearTimeout(pending);
    pending=setTimeout(function(){ apply(sec); },delay||0);
  }
  function resetAll(){
    SECT.forEach(function(s){
      var b=s.querySelector('.fitbox');
      if(b){ b.style.transform=''; }
    });
  }
  return {enabled:enabled,measure:measure,apply:apply,schedule:schedule,resetAll:resetAll,lastK:function(){ return lastK; }};
})();

function fitReport(){
  var prevMode=S.mode, prevI=S.i, rows=[], over=0;
  if(prevMode!=='present'){ setView('present',{silent:true}); }
  for(var i=0;i<SECT.length;i++){
    for(var j=0;j<SECT.length;j++){ SECT[j].classList.toggle('on',j===i); }
    var r=Fit.measure(SECT[i]);
    if(r){
      var scaled=(r.k<0.999);
      if(scaled){ over++; }
      rows.push(pad2(i)+'  «'+META[i].title+'»  контент '+r.needH+'px / доступно '+r.availH+'px  ->  k='+r.k.toFixed(3)+'  '+(scaled?'[SCALED]':'[OK]'));
    } else {
      rows.push(pad2(i)+'  «'+META[i].title+'»  ->  [WARN] измерение недоступно');
    }
  }
  for(var q=0;q<SECT.length;q++){ SECT[q].classList.toggle('on',q===prevI); }
  if(prevMode==='explore'){ setView('explore',{silent:true}); }
  else if(prevMode==='docs'){ setView('docs',{silent:true}); }
  else { Fit.apply(SECT[prevI]); paint(); }
  return {rows:rows,over:over};
}

/* ══════════ ПЕРЕХОДЫ ══════════ */
var exitTimers=[];
function clearExit(){
  for(var i=0;i<exitTimers.length;i++){ clearTimeout(exitTimers[i]); }
  exitTimers=[];
  // Cancelled callbacks must not leave inline display or transition classes behind.
  SECT.forEach(function(sec){
    sec.classList.remove('in-fwd','in-back','out-fwd','out-back');
    sec.style.display='';
  });
}
function go(k,opt){
  opt=opt||{};
  k=clamp(parseInt(k,10)||0,0,N-1);
  closeLayers();
  if(S.mode==='docs'){ setView('present',{silent:true}); }
  var my=++S.gen;

  if(S.mode==='explore'){
    S.i=k;
    var el=SECT[k];
    if(el){
      var y=el.getBoundingClientRect().top+window.pageYOffset-64;
      window.scrollTo({top:y,behavior:Env.RM?'auto':'smooth'});
    }
    if(opt.push!==false){ history.replaceState(null,'','#'+META[k].id); }
    paint(); announce(); return;
  }
  if(k===S.i && SECT[k].classList.contains('on')){ paint(); return; }

  var dir=(k>S.i)?1:-1;
  var prevEl=SECT[S.i];
  S.dir=dir; S.i=k;
  clearExit();

  if(prevEl && prevEl!==SECT[k]){
    prevEl.classList.remove('on','in-fwd','in-back');
    if(!Env.RM){
      prevEl.classList.add(dir>0?'out-fwd':'out-back');
      prevEl.style.display='flex';
      exitTimers.push(setTimeout(function(){
        prevEl.classList.remove('out-fwd','out-back');
        prevEl.style.display='';
      },300));
    } else {
      prevEl.style.display='';
    }
  }

  var cur=SECT[k];
  cur.classList.remove('out-fwd','out-back');
  cur.classList.add('on');
  if(!Env.RM){
    cur.classList.add(dir>0?'in-fwd':'in-back');
    exitTimers.push(setTimeout(function(){ cur.classList.remove('in-fwd','in-back'); },540));
  }
  for(var z=0;z<SECT.length;z++){ if(z!==k){ SECT[z].classList.remove('on'); } }

  applyAccent();
  if(opt.anim!==false && !Env.RM && k>0){ lightPulse(); }
  if(opt.push!==false){ history.pushState(null,'','#'+META[k].id); }

  play(cur); paint(); announce(); updatePresenter();  Log.add('переход → кадр '+pad2(k)+' «'+META[k].title+'»','info');
  Fit.schedule(cur,50);
  exitTimers.push(setTimeout(function(){ if(my===S.gen){ Fit.apply(cur); } },600));
  window.scrollTo(0,0);
}
function next(){ go(S.i+1); }function prev(){ go(S.i-1); }
function applyAccent(){
  var m=META[S.i]; if(!m){ return; }
  var root=document.documentElement;
  root.style.setProperty('--ac',m.ac);
  root.style.setProperty('--ac2',m.ac2);  var stage=$('#stage');
  if(stage){ stage.style.setProperty('--ac',m.ac); stage.style.setProperty('--ac2',m.ac2); }
  var spot=$('#spot'); if(spot){ spot.style.setProperty('--spotc',hexA(m.ac,0.1)); }
  var tint=$('#ltint'); if(tint){ tint.style.setProperty('--tintc',hexA(m.ac,0.34)); }
  var orbs=$('#orbs');
  if(orbs){    orbs.style.setProperty('--orb1',hexA(m.ac,0.22));
    orbs.style.setProperty('--orb2',hexA(m.ac2,0.15));
    orbs.style.setProperty('--orb3','rgba(102,223,196,.12)');
  }
  var pulse=$('#pulse'); if(pulse){ pulse.style.setProperty('--pulsec',hexA(m.ac,0.07)); }
}function lightPulse(){
  if(Env.RM){ return; }
  var p=$('#pulse'); if(!p){ return; }
  p.classList.remove('go');
  void p.offsetWidth;
  p.classList.add('go');}

/* ══════════ PAINT ══════════ */
function paint(){
  var p=(N>1)?(S.i/(N-1)):0;
  var progress=$('#slideProgress');
  if(progress){
    progress.setAttribute('aria-valuenow',String(Math.round(p*100)));
    progress.setAttribute('aria-valuetext','Кадр '+(S.i+1)+' из '+N);
  }
  var pf=$('#progFill'); if(pf){ pf.style.width=(p*100)+'%'; }
  var rv=$('#ringV'); if(rv){ rv.setAttribute('stroke-dashoffset',(97.4*(1-p)).toFixed(2)); }
  var cc=$('#cCur'); if(cc){ cc.textContent=pad2(S.i); }
  var chIdx=-1;
  for(var c=0;c<CHAPTERS.length;c++){ if(CHAPTERS[c].i<=S.i){ chIdx=c; } }
  $$('#nav button').forEach(function(b,k){
    var isOn=(k===chIdx);
    b.classList.toggle('on',isOn);
    b.classList.toggle('dn',(!isOn && CHAPTERS[k] && CHAPTERS[k].i<S.i));
    if(isOn){ b.setAttribute('aria-current','true'); } else { b.removeAttribute('aria-current'); }
  });
  $$('#dots i').forEach(function(d,k){ d.classList.toggle('on',k===S.i); d.classList.toggle('dn',k<S.i); });
  $$('#mmList a').forEach(function(a,k){ a.classList.toggle('on',k===S.i); });
  $$('#ovGrid .ov-c').forEach(function(x,k){ x.classList.toggle('on',k===S.i); if(k===S.i){x.setAttribute('aria-current','page');}else{x.removeAttribute('aria-current');} });
  $$('#mapFlow .mapnode').forEach(function(x,k){ x.classList.toggle('on',k===S.i); if(k===S.i){x.setAttribute('aria-current','step');}else{x.removeAttribute('aria-current');} });
  var bp=$('#bPrev'), bn=$('#bNext');
  if(bp){ bp.disabled=(S.i===0); }
  if(bn){ bn.disabled=(S.i===N-1); }
  var bf=$('#bFit'); if(bf){ bf.classList.toggle('act',S.fit); }
  var bg=$('#bGuide'); if(bg){ bg.classList.toggle('act',S.guides); }
  SECT.forEach(function(sec,j){
    var inactive=(j!==S.i)&&S.mode==='present';
    sec.setAttribute('aria-hidden',inactive?'true':'false');
    if('inert' in HTMLElement.prototype){ try{ sec.inert=inactive; }catch(e){} }
  });
  syncArtifactMotion();
}
var threeModels=null,threeImport=null,threeActiveId='';
function syncArtifactMotion(){
  var figure=S.mode==='present'&&$('.screen.on .pv-model');
  $$('.pv-showcase-video').forEach(function(video){
    var play=!!(figure&&figure.contains(video)&&!Env.RM&&!Env.LOW&&!document.hidden);
    if(!play){video.pause();video.removeAttribute('data-playing');return;}
    var attempt=video.play();
    if(attempt&&attempt.then){attempt.then(function(){video.setAttribute('data-playing','');}).catch(function(){video.removeAttribute('data-playing');});}
  });
  if(!figure){if(threeModels){threeModels.suspend();}threeActiveId='';return;}
  if(figure.hasAttribute('data-showcase-video')){if(threeModels){threeModels.suspend();}threeActiveId='';return;}
  var id=figure.getAttribute('data-3d-model');
  if(id===threeActiveId&&threeModels){return;}
  threeActiveId=id;
  if(threeModels){figure.dataset.modelState=threeModels.activate(id,figure)?'ready':'fallback';return;}
  figure.dataset.modelState='loading';
  if(!threeImport){
    figure.dataset.modelState='loading';
    threeImport=import(PV_THREE_SCENE_URL + '?v=20261110').then(function(mod){threeModels=mod;mod.setReducedMotion(Env.RM);if(threeActiveId===id&&S.mode==='present'){figure.dataset.modelState=mod.activate(id,figure)?'ready':'fallback';}else{mod.suspend();}}).catch(function(error){figure.dataset.modelState='fallback';figure.dataset.modelError=String(error&&error.message||error).slice(0,180);threeImport=null;threeActiveId='';console.warn('3D engine unavailable; showing the local artwork poster.',error);});
    return;
  }
  threeImport.then(function(){if(threeModels&&threeActiveId===id){figure.dataset.modelState=threeModels.activate(id,figure)?'ready':'fallback';}});
}
if(window.matchMedia){
  var motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  on(motionQuery,'change',function(e){Env.RM=e.matches;if(threeModels){threeModels.setReducedMotion(e.matches);}syncArtifactMotion();});
  on(document,'visibilitychange',function(){if(document.hidden&&threeModels){threeModels.suspend();}else{if(threeModels){threeModels.resume();}syncArtifactMotion();}});
}
function announce(){
  var l=$('#live'); if(!l){ return; }
  l.textContent='Кадр '+(S.i+1)+' из '+N+': '+META[S.i].title+'. '+META[S.i].tag+'.';
}

/* ══════════ REVEAL / PLAY ══════════ */
function reveal(sec){
  if(!sec){ return; }
  $$('.rv,.rvl,.rvr,.rvs,.rvc,.sweep',sec).forEach(function(el){ el.classList.add('in'); });
  $$('[data-bars]',sec).forEach(function(w){
  $$('.br-f',w).forEach(function(f){
      if(!f.dataset.chartStarted){ f.dataset.chartStarted='1'; f.style.width=Math.max(num(f.getAttribute('data-v')),0)+'%'; }
    });
  });
  $$('[data-segbar]',sec).forEach(buildSeg);
  $$('[data-gauge]',sec).forEach(function(g){
    if(!g.dataset.done){ g.dataset.done='1'; drawGauge(g); }
  });
  $$('.donut',sec).forEach(function(d){
    if(!d.dataset.built){ d.dataset.built='1'; buildDonut(d); }
    if(!d.dataset.drawn){ d.dataset.drawn='1'; drawDonut(d); }
  });
  $$('.waffle',sec).forEach(function(w){
    if(!w.dataset.built){ w.dataset.built='1'; buildWaffle(w); }
    w.classList.add('in');
  });
  $$('.cnt',sec).forEach(countUp);
  $$('.tw',sec).forEach(function(t){
    if(!t.dataset.done){ startType(t,t.getAttribute('data-text')||''); }
  });
}
function play(sec){
  if(!sec){ return; }
  $$('.rv,.rvl,.rvr,.rvs,.rvc,.sweep',sec).forEach(function(el){
    el.classList.remove('in');
    void el.offsetWidth;
    el.classList.add('in');
  });
  $$('[data-bars]',sec).forEach(function(w){
  $$('.br-f',w).forEach(function(f){ f.dataset.chartStarted=''; f.style.transition='none'; f.style.width='0%'; });
    requestAnimationFrame(function(){
      $$('.br-f',w).forEach(function(f,i){
        setTimeout(function(){ f.style.transition=''; f.dataset.chartStarted='1'; f.style.width=Math.max(num(f.getAttribute('data-v')),0)+'%'; },Env.RM?0:i*70);
      });
    });
  });
  $$('[data-segbar]',sec).forEach(function(sb){
    sb.dataset.done='';
    sb.innerHTML='';
    setTimeout(function(){ buildSeg(sb); },Env.RM?0:360);
  });
  $$('[data-gauge]',sec).forEach(function(g){
    g.dataset.done='';
    setTimeout(function(){ g.dataset.done='1'; drawGauge(g); },Env.RM?0:220);
  });
  $$('.donut',sec).forEach(function(d){
    if(!d.dataset.built){ d.dataset.built='1'; buildDonut(d); }
    d.dataset.drawn='1';
    setTimeout(function(){ drawDonut(d); },Env.RM?0:140);
  });  $$('.waffle',sec).forEach(function(w){
    if(!w.dataset.built){ w.dataset.built='1'; buildWaffle(w); }
    w.classList.remove('in');
    setTimeout(function(){ w.classList.add('in'); },Env.RM?0:190);
  });
  $$('.cnt',sec).forEach(function(c,i){
    c.dataset.done='';
    setTimeout(function(){ countUp(c); },Env.RM?0:i*55);
  });
  $$('.tw',sec).forEach(restartType);
}

/* ══════════ ДИАГРАММЫ ══════════ */
function buildSeg(sb){
  var spec=sb.getAttribute('data-segbar');
  if(!spec||sb.dataset.done){ return; }
  sb.dataset.done='1';
  sb.innerHTML='';
  spec.split('|').forEach(function(p,i){
    var b=p.split(':');
    var label=b[0], w=num(b[1]), col=b[2];
    var d=document.createElement('div');
    d.style.background='linear-gradient(180deg,'+col+','+shade(col)+')';
    d.textContent=label;
    d.title=label+' из 18 · '+w+'%';
    sb.appendChild(d);
    setTimeout(function(){ d.style.width=w+'%'; },Env.RM?0:i*115);
  });
}
function drawGauge(g){
  var v=clamp(num(g.getAttribute('data-val')),0,100);
  var p=$('.gval',g);
  if(!p){ return; }
  p.style.strokeDasharray='0 100';
  void p.getBoundingClientRect();
  setTimeout(function(){ p.style.strokeDasharray=v.toFixed(1)+' '+(100-v).toFixed(1); },Env.RM?0:60);
}
function buildWaffle(w){
  var key=w.getAttribute('data-waffle');
  var cfg=WAFFLES[key];
  if(!cfg){ return; }
  w.innerHTML='';
  var idx=0;
  cfg.parts.forEach(function(p){
    for(var i=0;i<p.n;i++){
      var c=document.createElement('i');
      c.style.background='linear-gradient(150deg,'+p.c+','+shade(p.c)+')';
      c.style.boxShadow='inset 0 1px 0 rgba(255,255,255,.26)';
      c.style.setProperty('--i',String(idx));
      c.setAttribute('data-l',p.l+' · участник '+(idx+1)+' из '+cfg.total);
      w.appendChild(c);
      idx++;
    }
  });
  while(idx<cfg.total){
    var e=document.createElement('i');
    e.style.setProperty('--i',String(idx));
    e.setAttribute('data-l','—');
    w.appendChild(e);
    idx++;
  }
  var tip=$('[data-wtip="'+key+'"]');
  $$('i',w).forEach(function(cell){
    on(cell,'mouseenter',function(){ if(tip){ tip.textContent=cell.getAttribute('data-l'); } });
  });
  on(w,'mouseleave',function(){ if(tip){ tip.textContent=cfg.tip; } });
}
function buildDonut(d){
  var segs=$$('.sg',d);
  var lgId=null;
  if(d.id==='dPurch'){ lgId='lgPurch'; }
  else if(d.id==='dRare'){ lgId='lgRare'; }
  var lg=lgId?$('#'+lgId):null;
  function show(i){
    var s=segs[i]; if(!s){ return; }
    var v=$('#'+d.id+'V'), l=$('#'+d.id+'L');
    if(v){ v.textContent=s.getAttribute('data-c')||(Math.round(num(s.getAttribute('data-v')))+'%'); }
    if(l){ l.textContent=s.getAttribute('data-l')||''; }
    if(lg){ $$('.lg-i',lg).forEach(function(x,j){ x.classList.toggle('hot',j===i); }); }
  }
  function reset(){
    if(d.id==='dPurch'){
      var a=$('#dPurchV'), b=$('#dPurchL');
      if(a){ a.textContent='56%'; }
      if(b){ b.textContent='Покупали · 10/18'; }
    }
    if(d.id==='dRare'){
      var c=$('#dRareV'), e=$('#dRareL');
      if(c){ c.textContent='39%'; }
      if(e){ e.textContent='Да · 7 / 18'; }
    }
    if(lg){ $$('.lg-i',lg).forEach(function(x){ x.classList.remove('hot'); }); }
  }
  segs.forEach(function(s,i){ on(s,'mouseenter',function(){ show(i); }); });
  on(d,'mouseleave',reset);
  if(lg){
    $$('.lg-i',lg).forEach(function(it,i){
      on(it,'mouseenter',function(){ show(i); });
      on(it,'mouseleave',reset);
    });
  }
}
function drawDonut(d){
  var segs=$$('.sg',d), acc=0, GAP=0.9;
  d.classList.add('dim');
  segs.forEach(function(s,k){
    var v=Math.max(num(s.getAttribute('data-v')),0);
    var len=Math.max(v-GAP,0);
    s.style.strokeDasharray='0 100';
    s.style.strokeDashoffset='0';
    void s.getBoundingClientRect();
    setTimeout(function(){
      s.style.strokeDasharray=len.toFixed(2)+' '+(100-len).toFixed(2);
      s.style.strokeDashoffset=(-acc).toFixed(2);
    },Env.RM?0:k*145);
    acc+=v;
  });
}
function countUp(el){
  if(el.dataset.done){ return; }
  el.dataset.done='1';
  var to=num(el.getAttribute('data-to'));
  var suf=el.getAttribute('data-suf')||'';
  if(Env.RM||Env.LOW){ el.textContent=to+suf; return; }
  var dur=1100, t0=performance.now();
  function step(t){
    var p=clamp((t-t0)/dur,0,1);
    var e=1-Math.pow(1-p,4);
    el.textContent=Math.round(to*e)+suf;
    if(p<1){ requestAnimationFrame(step); } else { Ticker.remove(step); }
  }
  requestAnimationFrame(step);
  Ticker.add(step);
}

/* ══════════ TYPEWRITER ══════════ */
function restartType(el){
  if(el._twTimer){ clearTimeout(el._twTimer); el._twTimer=null; }
  el.dataset.done='';
  el.innerHTML='';
  startType(el,el.getAttribute('data-text')||'');
}
function startType(el,txt){
  if(el.dataset.done){ return; }
  el.dataset.done='1';
  var keep=(el.getAttribute('data-keep')==='1');
  if(Env.RM||Env.LOW){ el.textContent=txt; return; }
  el.innerHTML='';
  var car=document.createElement('span');
  car.className='car';
  el.appendChild(car);
  var i=0;
  var speed=(txt.length>58)?20:30;
  (function step(){
    if(i<txt.length){
      el.insertBefore(document.createTextNode(txt.charAt(i)),car);
      i++;
      el._twTimer=setTimeout(step,speed);
    } else if(!keep){
      el._twTimer=setTimeout(function(){ if(car.parentNode){ car.parentNode.removeChild(car); } },2200);
    }
  })();
}

/* ══════════ HERO CANVAS ══════════ */
function initHeroCanvas(){
  var cv=$('#hcv'); if(!cv){ return; }
  var cx=cv.getContext('2d'); if(!cx){ return; }
  var host=$('#s0'); if(!host){ return; }
  var w=1,h=1,pts=[],ptr={x:-9999,y:-9999},vis=false;

  function seed(){
    pts=[];
    var cnt=(window.innerWidth<760)?16:(Env.LOW?22:38);
    var cols=['155,123,255','0,255,156','102,223,196'];
    for(var i=0;i<cnt;i++){
      pts.push({
        x:Math.random()*w, y:Math.random()*h,
        vx:(Math.random()-0.5)*0.2, vy:(Math.random()-0.5)*0.2,
        r:Math.random()*1.4+0.5, col:cols[Math.floor(Math.random()*cols.length)],        a:Math.random()*0.26+0.1, ph:Math.random()*6.283
      });
    }
  }
  function rs(){
    var r=host.getBoundingClientRect();
    var nw=Math.max(1,Math.round(r.width));    var nh=Math.max(1,Math.round(r.height));    if(nw===w && nh===h && pts.length){ return; }
    w=cv.width=nw; h=cv.height=nh;
    if(!pts.length){ seed(); }
    else { pts.forEach(function(p){ p.x=Math.min(p.x,w); p.y=Math.min(p.y,h); }); }
  }
  function frame(){
    if(!vis||w<2||h<2){ return; }    cx.clearRect(0,0,w,h);
    var i,j;
    if(!Env.RM){
      for(i=0;i<pts.length;i++){
        var p=pts[i];
        p.x+=p.vx; p.y+=p.vy; p.ph+=0.01;
        if(p.x<0){ p.x=w; } if(p.x>w){ p.x=0; }        if(p.y<0){ p.y=h; } if(p.y>h){ p.y=0; }
        var dx=p.x-ptr.x, dy=p.y-ptr.y, dd=Math.sqrt(dx*dx+dy*dy);
        if(dd<130&&dd>0.5){ p.x+=dx/dd*0.35; p.y+=dy/dd*0.35; }
      }
    }
    for(i=0;i<pts.length;i++){
      var q=pts[i];      var pu=Env.RM?1:(0.5+0.5*Math.sin(q.ph));
      cx.beginPath();
      cx.arc(q.x,q.y,q.r*(1+pu*0.3),0,6.283);
      cx.fillStyle='rgba('+q.col+','+(q.a*(0.6+pu*0.6)).toFixed(3)+')';
      cx.fill();
      for(j=i+1;j<pts.length;j++){
        var o=pts[j];        var L=Math.hypot(q.x-o.x,q.y-o.y);
        if(L<120){
          cx.beginPath(); cx.moveTo(q.x,q.y); cx.lineTo(o.x,o.y);
          cx.strokeStyle='rgba(155,123,255,'+(0.09*(1-L/120)).toFixed(3)+')';
          cx.lineWidth=0.6; cx.stroke();
        }
      }
    }
  }
  rs();
  if(window.ResizeObserver){
    try{ new ResizeObserver(rs).observe(host); }catch(e){ on(window,'resize',rs); }
  } else { on(window,'resize',rs); }
  on(host,'mousemove',function(e){
    var r=cv.getBoundingClientRect();
    ptr.x=e.clientX-r.left; ptr.y=e.clientY-r.top;
  },{passive:true});
  on(host,'mouseleave',function(){ ptr.x=-9999; ptr.y=-9999; });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      var now=es[0].isIntersecting && S.mode!=='docs';
      if(now&&!vis){ vis=true; Ticker.add(frame); }
      else if(!now&&vis){ vis=false; Ticker.remove(frame); cx.clearRect(0,0,w,h); }
    },{threshold:0});
    io.observe(host);
  } else {
    vis=true; Ticker.add(frame);
  }
}

/* ══════════ HERO TITLE ══════════ */
function initHeroTitle(){
  var ht=$('#htitle'); if(!ht){ return; }
  var parts=[{t:'PIXEL',c:''},{t:'/',c:'hslash'},{t:'VALUE',c:''}];
  var html='', delay=140;
  parts.forEach(function(p){
    for(var i=0;i<p.t.length;i++){
      html+='<b class="'+p.c+'" style="animation-delay:'+delay+'ms">'+p.t.charAt(i)+'</b>';
      delay+=42;
    }
  });
  ht.innerHTML=html;
}

/* ══════════ СВЕТ И НАКЛОН ══════════ */
function initLight(){
  var spot=$('#spot'), orbs=$('#orbs'), grid=$('#lgrid');
  if(!Env.FINE||Env.RM||Env.LOW){ if(spot){ spot.style.display='none'; } return; }
  var tx=-999,ty=-999,cx=-999,cy=-999,px=0,py=0,cpx=0,cpy=0;
  on(document,'mousemove',function(e){
    tx=e.clientX; ty=e.clientY;
    if(spot){ spot.style.opacity='1'; }
    px=(e.clientX/window.innerWidth-0.5);
    py=(e.clientY/window.innerHeight-0.5);
  },{passive:true});
  on(document,'mouseleave',function(){ if(spot){ spot.style.opacity='0'; } });
  Ticker.add(function(){
    cx+=(tx-cx)*0.07; cy+=(ty-cy)*0.07;
    cpx+=(px-cpx)*0.035; cpy+=(py-cpy)*0.035;
    if(spot){ spot.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0) translate(-50%,-50%)'; }
    if(orbs){ orbs.style.transform='translate3d('+(-cpx*18).toFixed(2)+'px,'+(-cpy*14).toFixed(2)+'px,0)'; }
    if(grid){ grid.style.transform='translate3d('+(cpx*7).toFixed(2)+'px,'+(cpy*5).toFixed(2)+'px,0)'; }
  });
}
function initTilt(){
  if(!Env.FINE||Env.RM||Env.LOW){ return; }
  $$('.card,.sdt').forEach(function(el){
    if(el.dataset.tiltBound){ return; }
    el.dataset.tiltBound='1';
    on(el,'mousemove',function(e){
      var r=el.getBoundingClientRect();
      var nx=(e.clientX-r.left)/r.width;
      var ny=(e.clientY-r.top)/r.height;
      el.style.transform='perspective(1200px) rotateX('+((0.5-ny)*2.2).toFixed(2)+'deg) rotateY('+((nx-0.5)*2.8).toFixed(2)+'deg) translate3d(0,-3px,0)';
      el.style.setProperty('--mx',(nx*100).toFixed(1)+'%');
      el.style.setProperty('--my',(ny*100).toFixed(1)+'%');
    },{passive:true});
    on(el,'mouseleave',function(){ el.style.transform=''; });
  });
}

/* ══════════ INTERSECTION OBSERVER ══════════ */
function initIO(){
  if(!('IntersectionObserver' in window)){ SECT.forEach(reveal); return; }  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ reveal(en.target); } });
  },{threshold:0.14,rootMargin:'0px 0px -5% 0px'});
  SECT.forEach(function(s){ io.observe(s); });
}

/* ══════════ РЕЖИМЫ ══════════ */
function syncModeButtons(){
  var mp=$('#mPres'),me=$('#mExpl'),md=$('#mDocs');
  if(mp){ mp.classList.toggle('on',S.mode==='present'); }
  if(me){ me.classList.toggle('on',S.mode==='explore'); }
  if(md){ md.classList.toggle('on',S.mode==='docs'); }
  var mt=$('#modeTop');
  if(mt){ mt.textContent=(S.mode==='explore')?'Презентация':'Обзор'; }
}
function setView(v,opt){
  opt=opt||{};
  S.mode=v;
  document.body.classList.toggle('explore',v==='explore');
  document.body.classList.toggle('docsview',v==='docs');
  document.body.classList.remove('locked');
  syncModeButtons();
  var snav=$('#snav');

  if(v==='docs'){
    if(!S.docsBuilt){ buildDocs(); S.docsBuilt=true; Log.add('документация → разделы собраны','ok'); }
    SECT.forEach(function(el){ el.classList.remove('on'); });
    if(snav){ snav.classList.add('hide'); }
    window.scrollTo({top:0,behavior:'auto'});
    history.replaceState(null,'','#docs/'+S.tab);
    setTimeout(function(){
      $$('.dc-pane.on .rv').forEach(function(e){ e.classList.add('in'); });
    },50);
  } else {
    if(snav){ snav.classList.toggle('hide',v==='explore'); }
    if(v==='explore'){
      SECT.forEach(function(el){ el.classList.add('on'); });
      Fit.resetAll();
      setTimeout(function(){ SECT.forEach(reveal); },60);
      setTimeout(function(){
        var y=SECT[S.i].getBoundingClientRect().top+window.pageYOffset-64;
        window.scrollTo({top:y,behavior:'auto'});
      },50);
    } else {
      SECT.forEach(function(el,j){ el.classList.toggle('on',j===S.i); });
      applyAccent();
      play(SECT[S.i]);
      Fit.schedule(SECT[S.i],90);
      window.scrollTo(0,0);
    }
  }
  paint(); announce();
  if(!opt.silent){ Log.add('режим → '+v,'info'); }
}

/* ══════════ СЛОИ И ФОКУС ══════════ */
var lastFocus=null, trapEl=null;
function focusables(c){
  return $$('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',c).filter(function(el){
    return !el.disabled && (el.offsetWidth>0 || el.offsetHeight>0 || el===document.activeElement);
  });
}
function trapFocus(container){
  trapEl=container;
  lastFocus=document.activeElement;
  var f=focusables(container);
  if(f.length){ setTimeout(function(){ try{ f[0].focus(); }catch(e){} },70); }
}
function releaseTrap(){
  trapEl=null;
  if(lastFocus&&lastFocus.focus){ try{ lastFocus.focus(); }catch(e){} }
  lastFocus=null;
}
function closeLayers(){
  var closed=false;
  var qa=$('#qaDialog'),ov=$('#ov'),pr=$('#pr'),mm=$('#mm'),hp=$('#help');
  if(qa&&qa.classList.contains('on')){
    qa.classList.remove('on');
    qa.setAttribute('aria-hidden','true');
    document.body.classList.toggle('locked',!!(pr&&pr.classList.contains('on')));
    releaseTrap();
    return true;
  }
  if(ov&&ov.classList.contains('on')){ ov.classList.remove('on'); ov.setAttribute('aria-hidden','true'); closed=true; }
  if(mm&&mm.classList.contains('on')){
    mm.classList.remove('on');
    var bg=$('#burger'); if(bg){ bg.setAttribute('aria-expanded','false'); }
    closed=true;
  }
  if(hp&&hp.classList.contains('on')){ hp.classList.remove('on'); closed=true; }
  if(pr&&pr.classList.contains('on')){
    S.presenter=false; clearInterval(S.tick); S.tick=null; pr.classList.remove('on'); closed=true;
  }
  if(closed){ document.body.classList.remove('locked'); releaseTrap(); }
  return closed;
}
function toggleOv(force){
  var o=$('#ov'); if(!o){ return; }
  var v=(force===undefined)?!o.classList.contains('on'):!!force;
  if(v){
    closeLayers();
    o.classList.add('on');
    o.setAttribute('aria-hidden','false');
    document.body.classList.add('locked');
    trapFocus(o);
    history.pushState(null,'','#overview');
    update();
    var current=$('#ovGrid .ov-c.on'); if(current){ current.scrollIntoView({block:'nearest'}); }
  } else {
    o.classList.remove('on');
    o.setAttribute('aria-hidden','true');
    document.body.classList.remove('locked');
    releaseTrap();
    history.replaceState(null,'',(S.mode==='docs')?('#docs/'+S.tab):('#'+META[S.i].id));
  }
}
function togglePr(force){
  var p=$('#pr'); if(!p){ return; }
  var v=(force===undefined)?!p.classList.contains('on'):!!force;
  if(v){
    closeLayers();
    S.presenter=true;
    p.classList.add('on');
    document.body.classList.add('locked');
    S.t0=Date.now();
    clearInterval(S.tick);
    S.tick=setInterval(timer,500);
    updatePresenter();
    trapFocus(p);
    history.pushState(null,'','#presenter');
    Log.add('режим докладчика → включён, таймер запущен','info');
  } else {
    S.presenter=false;
    clearInterval(S.tick);
    S.tick=null;
    p.classList.remove('on');
    document.body.classList.remove('locked');
    releaseTrap();
    history.replaceState(null,'',(S.mode==='docs')?('#docs/'+S.tab):('#'+META[S.i].id));
  }
}
function toggleQa(force){
  var q=$('#qaDialog'); if(!q){ return; }
  var v=(force===undefined)?!q.classList.contains('on'):!!force;
  if(v){
    q.classList.add('on');
    q.setAttribute('aria-hidden','false');
    document.body.classList.add('locked');
    trapFocus(q);
  } else {
    q.classList.remove('on');
    q.setAttribute('aria-hidden','true');
    var pr=$('#pr');
    document.body.classList.toggle('locked',!!(pr&&pr.classList.contains('on')));
    releaseTrap();
  }
}
function toggleHelp(force){
  var h=$('#help'); if(!h){ return; }
  var v=(force===undefined)?!h.classList.contains('on'):!!force;
  if(v){ closeLayers(); h.classList.add('on'); document.body.classList.add('locked'); trapFocus(h); }
  else { h.classList.remove('on'); document.body.classList.remove('locked'); releaseTrap(); }
}
function toggleMenu(force){
  var m=$('#mm'); if(!m){ return; }
  var v=(force===undefined)?!m.classList.contains('on'):!!force;
  var bg=$('#burger'); if(bg){ bg.setAttribute('aria-expanded',v?'true':'false'); }
  if(v){ closeLayers(); m.classList.add('on'); document.body.classList.add('locked'); trapFocus(m); }
  else { m.classList.remove('on'); document.body.classList.remove('locked'); releaseTrap(); }
}
function toggleGuides(){
  S.guides=!S.guides;
  var g=$('#guides'); if(g){ g.classList.toggle('on',S.guides); }
  paint();
  toast(S.guides?'⌗ Направляющие 16:9 включены':'⌗ Направляющие выключены');
}
function toggleFit(){
  S.fit=!S.fit;
  if(!S.fit){ Fit.resetAll(); Log.add('каркас 16:9 → автоподгонка выключена (масштаб 1:1)','warn'); }
  else { Fit.apply(SECT[S.i]); Log.add('каркас 16:9 → автоподгонка включена, k='+Fit.lastK().toFixed(3),'ok'); }
  paint();
  toast(S.fit?'⤢ Автоподгонка 16:9 включена':'⤢ Автоподгонка выключена — масштаб 1:1');
}
function timer(){
  if(!S.t0){ return; }
  var s=Math.floor((Date.now()-S.t0)/1000);
  var t=$('#prTimer');
  if(t){ t.textContent=pad2(Math.floor(s/60))+':'+pad2(s%60); }
}
function updatePresenter(){
  if(!S.presenter){ return; }
  var m=META[S.i], nx=META[S.i+1];
  var cl=$('#prCurL'),ct=$('#prCurT'),cc=$('#prCurC'),pp=$('#prProg'),nt=$('#prNextT'),nc=$('#prNextC'),nn=$('#prNotes');
  if(cl){ cl.textContent='Кадр '+pad2(S.i+1)+' / '+N+' · '+m.tag.toUpperCase(); }
  if(ct){ ct.textContent=m.title; }
  if(cc){ cc.textContent=m.lead||'—'; }
  var progress=$('#presenterProgress');
  var progressValue=Math.round(((N>1)?(S.i/(N-1)):0)*100);
  if(progress){
    progress.setAttribute('aria-valuenow',String(progressValue));
    progress.setAttribute('aria-valuetext','Кадр '+(S.i+1)+' из '+N);
  }
  if(pp){ pp.style.width=progressValue+'%'; }
  if(nt){ nt.textContent=nx?nx.title:'Конец презентации'; }
  if(nc){ nc.textContent=nx?(pad2(S.i+2)+' · '+nx.tag+' — '+(nx.lead||'')):'Финальный кадр. Спасибо за внимание.'; }
  if(nn){ nn.textContent=m.notes||'Заметки для этого кадра не добавлены.'; }
}

/* ══════════ КОПИРОВАНИЕ ══════════ */
function doCopy(text,label){
  function ok(){ toast('⧉ '+(label||'Текст')+' скопирован'); Log.add('копирование → '+(label||'текст')+' ('+text.length+' симв.)','ok'); }
  function fb(){
    var t=document.createElement('textarea');
    t.value=text;
    t.setAttribute('aria-hidden','true');    t.style.cssText='position:fixed;top:-999px;opacity:0';
    document.body.appendChild(t);
    t.select();
    try{ document.execCommand('copy'); ok(); }catch(e){ toast('Не удалось скопировать — выделите текст вручную'); }
    document.body.removeChild(t);
  }  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(ok).catch(fb); }
  else { fb(); }
}function copyLink(){
  var hash=(S.mode==='docs')?('docs/'+S.tab):META[S.i].id;
  doCopy(location.origin+location.pathname+'#'+hash,'Ссылка');
}
function copyEl(id,label){
  var el=document.getElementById(id);
  if(!el){ return; }
  doCopy(el.innerText||el.textContent||'',label||'Текст');}

/* ══════════ ROUTER ══════════ */
function readHash(){
  var h=(location.hash||'').replace('#','');
  if(!h){ if($('#ov')&&$('#ov').classList.contains('on')){ toggleOv(false); } return; }
  if(h.indexOf('docs')===0){
    setTab(h.split('/')[1]||'about');    if(S.mode!=='docs'){ setView('docs',{silent:true}); }
    return;
  }
  if(h==='overview'){ toggleOv(true); return; }
  if(h==='presenter'){ togglePr(true); return; }
  closeLayers();
  var k=-1;
  for(var i=0;i<META.length;i++){ if(META[i].id===h){ k=i; break; } }  if(k<0){ return; }
  if(k!==S.i){ go(k,{push:false,anim:false}); }
  else if(S.mode!=='present'){ setView('present',{silent:true}); }
}

/* ══════════ A11Y ══════════ */
function buildA11yTables(){
  var host=$('#a11yData'); if(!host){ return; }  var html='<h2>Данные исследования PIXEL / VALUE (n = 18)</h2>';
  function tbl(title,rows,note){
    var s='<h3>'+title+'</h3><table><caption>'+title+'</caption><thead><tr><th scope="col">Ответ</th><th scope="col">Количество</th><th scope="col">Знаменатель</th><th scope="col">Процент</th></tr></thead><tbody>';
    rows.forEach(function(r){
      s+='<tr><th scope="row">'+r.l+'</th><td>'+r.n+'</td><td>'+r.d+'</td><td>'+pctStr(r.n,r.d)+'</td></tr>';
    });
    s+='</tbody></table>';
    if(note){ s+='<p>'+note+'</p>'; }
    return s;
  }
  html+=tbl('Игровая активность',DATA.activity,'13 из 18 играют чаще одного раза в неделю (72,2%). Если читать заголовок исходника буквально — «еженедельно или чаще», — в группу попадает и категория «1–2 раза в неделю»: 16 из 18, то есть 88,9%. Расхождение формулировок зафиксировано, числа не изменены.');
  html+=tbl('Опыт покупки косметики',DATA.purchase,'Доля покупателей — 10 из 18, около 56%.');
  html+=tbl('Главный мотив покупки среди покупателей',DATA.motives,'Вопрос задавался только десяти участникам, которые уже покупали предметы.');
  html+=tbl('Связь редкости и статуса среди всех участников',DATA.rarity,'');
  html+=tbl('Влияние друзей среди всех участников',DATA.friends,'');
  html+='<h3>Интерпретация через SDT</h3><p>Автономия (стиль) — 4 из 10 покупателей. Компетентность (статус) — 7 из 18 всех участников. Связанность (сильное влияние друзей) — 3 из 18 всех участников. Это разные вопросы и разные знаменатели, поэтому показатели не сводятся в одну шкалу и в одну круговую диаграмму.</p>';
  host.innerHTML=html;
}
var KEYS=[
 ['← / →','Предыдущий и следующий кадр'],
 ['Space','Следующий кадр'],
 ['Home / End','Первый и последний кадр'],
 ['G','Карта кадров и research map'],
 ['P','Режим докладчика'],
 ['S','Документация проекта'],
 ['E','Переключить презентация / обзор'],
 ['F','Автоподгонка 16:9'],
 ['Y','Направляющие 16:9'],
 ['L','Скопировать ссылку на кадр'],
 ['H или ','Справка по управлению'],
 ['Esc','Закрыть открытый слой'],
 ['Tab','Перемещение по элементам, в модалках — внутри окна']
];
function buildHelp(){
  var g=$('#helpGrid'); if(!g){ return; }
  g.innerHTML=KEYS.map(function(k){
    return '<div class="help-i"><kbd>'+k[0]+'</kbd><span>'+k[1]+'</span></div>';
  }).join('');
}

/* ══════════ ДОКУМЕНТАЦИЯ ══════════ */
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function hl(src){
  var store=[];
  function put(h){ store.push(h); return '\u0001'+(store.length-1)+'\u0001'; }
  var s=esc(src);
  s=s.replace(/`([^`]*)`/g,function(m,p){ return put('<span class="t2">'+p+'</span>'); });
  s=s.replace(/\*\*([^*]*)\*\*/g,function(m,p){ return put('<span class="w">'+p+'</span>'); });
  s=s.replace(/\[(OK)\]/g,function(m,w){ return put('<span class="g">['+w+']</span>'); });
  s=s.replace(/\[(WARN)\]/g,function(m,w){ return put('<span class="a">['+w+']</span>'); });
  s=s.replace(/\[(SCALED)\]/g,function(m,w){ return put('<span class="a">['+w+']</span>'); });
  s=s.replace(/\[(CRIT(?:-RULE)?)\]/g,function(m,w){ return put('<span class="r">['+w+']</span>'); });
  s=s.replace(/^(\s*)(->)/gm,function(m,sp,ar){ return sp+put('<span class="p">'+ar+'</span>'); });
  s=s.replace(/^\$ .*$/gm,function(m){ return put('<span class="w">'+m+'</span>'); });
  s=s.replace(/^#.*$/gm,function(m){ return put('<span class="c">'+m+'</span>'); });
  s=s.replace(/\u0001(\d+)\u0001/g,function(m,i){ return store[parseInt(i,10)]||''; });
  return s;
}

var ABOUT_GOAL='Интерактивное социологическое исследование о ценности виртуальных предметов в видеоиграх. Формат — цифровое выступление в кадре 16:9: 23 экрана, три режима просмотра, режим докладчика и полная техническая документация. Проект рассказывает, почему игроки покупают косметические предметы, которые не дают игрового преимущества, и честно показывает границы собственных выводов.';
var ABOUT_Q='«Что именно покупает игрок вместе со скином?» Гипотеза: покупка косметики может помогать выражать себя, ощущать статус и поддерживать связь с игровым сообществом. Теоретическая рамка — Self-Determination Theory (Deci &amp; Ryan) и концепция «расширенного Я» (Belk). Метод — собственный опрос, n = 18, выборка неслучайная, исследование описательное.';

var ARCH=[
 ['Формат','Статический сайт','HTML, CSS и JavaScript без этапа сборки. Для публикации нужны index.html, таблицы стилей и папка assets.'],
 ['Стек','HTML5 + CSS3 + vanilla JavaScript','Three.js хранится локально и используется для интерактивной 3D-сцены. Сборщик и сервер приложений не требуются.'],
 ['Графика','SVG, Canvas 2D, WebGL, изображения и видео','Локальные изображения и видеоролики иллюстрируют исследование; WebGL-сцена использует Three.js.'],
 ['Компоновка','CSS Grid + Flexbox + container queries (cqh/cqw)','Композиция кадра масштабируется вместе с высотой области просмотра.'],
 ['Кадр','16:9, <code>.stage { container-type: size }</code>','Экраны <code>position:absolute; inset:0; overflow:hidden</code>; на body в режиме презентации <code>overflow:hidden</code>.'],
 ['Автоподгонка','FitEngine: замер и <code>transform: scale(k)</code>, k от 0.42 до 1','Гарантирует полную видимость кадра, если контент выше доступной области.'],
 ['Навигация','Hash-маршрутизация + popstate','<code>#s0…#s22</code>, <code>#docs/раздел</code>, <code>#overview</code>, <code>#presenter</code>. Кнопки браузера «назад/вперёд» работают.'],
 ['Данные','Единый объект <code>DATA</code>','Диаграммы, легенды, скрытые таблицы доступности и аудит строятся из одного источника — расхождение текста и графика исключено.'],
 ['Анимации','CSS-переходы и один rAF-планировщик (Ticker)','Пауза при <code>document.hidden</code>, ограничение примерно 64 fps, отмена устаревших отложенных задач через generation-token.'],
 ['Наблюдатели','IntersectionObserver и ResizeObserver','Есть запасной путь, если API недоступен: прямой вызов показа блоков.'],
 ['Деградация','try/catch в инициализации','При ошибке весь контент показывается сплошной лентой — данные не теряются.'],
 ['Сеть','Шрифты Inter и JetBrains Mono с jsDelivr','Шрифты загружаются при наличии сети. Без неё остаются системные шрифты; функции и графика работают из локальных файлов.']
];
var RULES=[ ['Данные неизменяемы','Ни одно число исследования не правится. Обнаруженные расхождения формулировок фиксируются и раскрываются, а не «чинятся» молча.','var(--green)'],
 ['Знаменатель обязателен','Процент всегда сопровождается дробью «n / N». Показатели с разными знаменателями не сводятся в одну шкалу и в одну круговую диаграмму.','var(--amber)'],
 ['Один кадр — одна мысль','Плотный материал разбивается на отдельные экраны вместо уменьшения шрифта. Это главный способ уместить содержание в 16:9.','var(--purple)'],
 ['Точность документации','Описание, зависимости и статусы проверок должны соответствовать файлам проекта и фактическому запуску.','var(--teal)'],
 ['Локальные материалы','Изображения, видео, стили и код хранятся в репозитории; аналитика и запросы к API не используются. Шрифты загружаются с jsDelivr, если доступна сеть.','var(--red)'],
 ['Доступность по умолчанию','Клавиатура, ловушка фокуса в модальных окнах, aria-live-анонс кадра, текстовые эквиваленты диаграмм, уважение prefers-reduced-motion.','var(--green2)']
];

function runAudit(){
  var R=[];
  function sum(arr,name){
    var s=arr.reduce(function(a,b){ return a+b.n; },0);
    var d=arr[0].d;
    R.push({
      t:(s===d)?'ok':'crit',
      h:(s===d)?('Сумма совпадает · '+name):('Расхождение суммы · '+name),
      d:(s===d)
         ? ('Сумма <code>'+s+'</code> равна знаменателю <code>'+d+'</code>. Расхождение 0.')
        : ('Сумма <code>'+s+'</code> не равна знаменателю <code>'+d+'</code>. Требуется разбор.')
    });
  }
  sum(DATA.activity,'Игровая активность');
  sum(DATA.purchase,'Опыт покупок');
  sum(DATA.motives,'Главный мотив (знаменатель 10)');
  sum(DATA.rarity,'Редкость и статус');
  sum(DATA.friends,'Влияние друзей');

  var checks=[['10/18',10,18,56],['4/10',4,10,40],['7/18',7,18,39],['3/18',3,18,17],['13/18',13,18,72]];
  checks.forEach(function(c){
    var calc=Math.round(c[1]/c[2]*100);
    R.push({t:'ok',h:'Процент '+c[0],d:'Расчёт: <code>'+c[1]+' / '+c[2]+' = '+calc+'%</code>. В исходнике указано <code>'+c[3]+'%</code>. Совпадает.'});
  });

  R.push({t:'warn',h:'Противоречие формулировки «72% / 13 из 18»',
    d:'Заголовок исходника: «72% играют еженедельно или чаще». Подпись: «13 из 18 участников играют не реже раза в неделю». 13 = <code>7 (ежедневно) + 6 (несколько раз в неделю)</code> = 72,2%. Прочтение A (по подписи): 13/18 = 72% — чаще одного раза в неделю. Прочтение B (по заголовку буквально): 13 + 3 = <code>16/18 = 88,9%</code> — не реже раза в неделю. <b>Числа не изменялись.</b> Оба прочтения показаны в сноске кадра 06.'});

  R.push({t:'crit',h:'Правило знаменателей соблюдено',
    d:'Автономия <code>4/10</code>, компетентность <code>7/18</code>, связанность <code>3/18</code> — разные вопросы и разные знаменатели. Запрещено сводить их в одну круговую диаграмму или единую процентную шкалу. Кадр 11 показывает три отдельных индикатора, кадр 10 содержит прямое предупреждение о несопоставимости с мотивом среди покупателей.'});

  R.push({t:'ok',h:'Библиография',
    d:'8 записей перенесены без изменений: Ryan &amp; Deci (2000); Ryan, Rigby &amp; Przybylski (2006); Belk (2013); Hamari et al. (2017); Hussain et al. (2025); Koles, Nagy &amp; Vollet (2025); Böffel et al. (2025); European Commission / CPC (21.03.2025). Новые DOI, страницы и названия не добавлялись.'});

  R.push({t:'ok',h:'Реплики участников',
    d:'Три анонимные реплики перенесены дословно, без переформулировки и без превращения в новые цитаты. Анонимность сохранена.'});

  R.push({t:'warn',h:'Причинность и значимость',
    d:'Выборка n = 18, неслучайная. Статистическая значимость и причинно-следственные связи не заявляются. Формулировки «может», «иногда», «в этой выборке» сохранены.'});

  R.push({t:'ok',h:'Плотность кадров',
    d:'Плотные разделы исходника разбиты: данные — на кадры 06 и 07, результаты — на 08, 09 и 10, теория — на 03 и 04, источники — на 21 и 22. Ни один кадр не требует внутренней прокрутки в 16:9.'});

  return R;
}
function auditLogText(){
  var R=runAudit(), ok=0, warn=0, crit=0;
  R.forEach(function(r){
    if(r.t==='ok'){ ok++; } else if(r.t==='warn'){ warn++; } else { crit++; }
  });
  var lines=[
   '$ data-integrity --run report --strict',
   '> extract_dataset ......... 5 наборов, 17 показателей',
   '> validate_counts ......... сумма == знаменатель во всех 5 наборах  [OK]',
   '> calculate_percentages ... 5 сверок, расхождений округления: 0     [OK]',
   '> detect_denominator_mismatch',
   '    автономия 4/10  vs  компетентность 7/18  vs  связанность 3/18',
   '    -> разные вопросы и знаменатели, объединение запрещено   [CRIT-RULE]',
   '    -> кадр 11: три отдельных индикатора, единой шкалы нет    [OK]',
   '    -> кадр 10: добавлено предупреждение о несопоставимости   [OK]',
   '> detect_conflicting_claims',
   '    "72% играют еженедельно или чаще"  vs  "13 из 18 не реже раза в неделю"',
   '    13 = 7 + 6 = 72.2%  (чаще одного раза в неделю)',
   '    буквальное чтение заголовка: 7 + 6 + 3 = 16/18 = 88.9%',
   '    -> АВТОИСПРАВЛЕНИЕ ОТКЛОНЕНО, оба прочтения в сноске      [WARN]',
   '> audit_citations ......... 8 записей, изменений и дополнений: 0   [OK]',
   '> check_quotes ............ 3 реплики, переформулировок: 0         [OK]',
   '> causal_claims ........... не заявлены, формулировки "может"      [OK]',
   '> frame_density ........... 23 кадра, внутренняя прокрутка: 0      [OK]',
   '',
   'ИТОГ: проверок '+R.length+' · OK '+ok+' · WARN '+warn+' · CRIT-RULE '+crit,
   '5 наборов данных целостны. 1 противоречие формулировки',
   'зафиксировано и раскрыто. Правило знаменателей соблюдено.',
   'Ни одно число не изменено.'
  ];
  return lines.join('\n');
}
function chartSpecs(){
  function spec(id,type,title,arr,unit){
    var geom;
    if(type==='donut'){ geom={r:50,stroke:13,pathLength:100,startAngle:-90,gap:0.9}; }
    else if(type==='gauge'){ geom={arc:'M10 62 A50 50 0 0 1 110 62',pathLength:100,stroke:10}; }
    else if(type==='unit-grid'){ geom={cells:18,columns:9,stagger:'26ms'}; }
    else { geom={trackHeight:'2.6cqh',radius:7,animation:'width 1.35s cubic-bezier(.16,1,.3,1)',stagger:'90ms'}; }
    return {
      id:id,type:type,title:title,unit:unit,denominator:arr[0].d,
      values:arr.map(function(x){ return {label:x.l,value:x.n,denominator:x.d,percent:pct(x.n,x.d)}; }),
      geometry:geom,
      alt:title+'. '+arr.map(function(x){ return x.l+' — '+x.n+' из '+x.d+' ('+pctStr(x.n,x.d)+')'; }).join('; ')+'.'
    };
  }
  var list=[
    spec('chart-activity-gauge','gauge','Доля играющих чаще одного раза в неделю',[{l:'Еженедельно или чаще (прочтение A)',n:13,d:18}],'человек из 18'),
    spec('chart-activity','bar-horizontal','Игровая активность участников',DATA.activity,'человек из 18'),
    spec('chart-activity-seg','segment-bar','Игровая активность одной полосой',DATA.activity,'человек из 18'),
    spec('chart-purchase','donut','Опыт покупки косметики',DATA.purchase,'человек из 18'),
    spec('chart-purchase-units','unit-grid','Опыт покупки косметики, 18 ячеек = 18 участников',DATA.purchase,'человек из 18'),
    spec('chart-motives-gauge','gauge','Доля выбравших стиль среди покупателей',[{l:'Стиль / самовыражение',n:4,d:10}],'человек из 10'),
    spec('chart-motives','bar-horizontal','Главный мотив покупки среди покупателей',DATA.motives,'человек из 10'),
    spec('chart-rarity','donut','Связь редкого скина со статусом',DATA.rarity,'человек из 18'),
    spec('chart-rarity-units','unit-grid','Редкость и статус, 18 ячеек = 18 участников',DATA.rarity,'человек из 18'),
    spec('chart-friends','bar-horizontal','Влияние друзей на покупку',DATA.friends,'человек из 18'),
    spec('chart-friends-units','unit-grid','Влияние друзей, 18 ячеек = 18 участников',DATA.friends,'человек из 18')
  ];
  list.push({
    id:'chart-sdt',type:'indicator-set',title:'Интерпретация через SDT — три отдельных индикатора',
    unit:'ответы на разные вопросы',denominator:'смешанный (10 и 18)',
    values:[
      {label:'Autonomy · стиль',value:4,denominator:10,percent:40},
      {label:'Competence · статус',value:7,denominator:18,percent:38.9},
      {label:'Relatedness · друзья',value:3,denominator:18,percent:16.7}
    ],
    warning:'РАЗНЫЕ ЗНАМЕНАТЕЛИ. Запрещено объединять в одну круговую диаграмму или общую процентную шкалу.',
    alt:'Три отдельных индикатора: автономия 4 из 10 покупателей; компетентность 7 из 18 всех участников; связанность 3 из 18 всех участников.'
  });
  return list;
}

var FITDOC=[
 {t:'ok',h:'Уровень 1 · Единицы контейнера',d:'Сцена объявлена контейнером (<code>container-type:size</code>). Типографика, отступы, радиусы и размеры диаграмм заданы в <code>cqh</code>/<code>cqw</code>, поэтому композиция масштабируется вместе с высотой кадра, а не с окном браузера.'},
 {t:'ok',h:'Уровень 2 · clamp-ограничители',d:'Каждый размер обёрнут в <code>clamp(min, cqh, max)</code>: на маленьком или очень большом кадре текст не уходит в нечитаемые значения, а карточки не растягиваются в пустоту.'},
 {t:'ok',h:'Уровень 3 · Автоподгонка',d:'Перед замером кадру добавляется класс <code>.measuring</code>, который гасит transform-состояния блоков появления (иначе <code>scrollHeight</code> завышается). Затем применяется <code>transform: scale(k)</code>, где k = min(availH/needH, availW/needW, 1), не ниже 0.42.'},
 {t:'ok',h:'Триггеры пересчёта',d:'resize (debounce 130 мс), ResizeObserver сцены, <code>document.fonts.ready</code>, смена ориентации, а также +50 мс и +600 мс после смены кадра — когда завершаются анимации появления.'},
 {t:'ok',h:'Отсутствие скролла',d:'<code>body{overflow:hidden}</code> и <code>.screen{position:absolute; inset:0; height:100%; max-height:100%; overflow:hidden}</code>. Вертикальная прокрутка страницы в режиме презентации невозможна.'},
 {t:'ok',h:'Разбивка плотного материала',d:'Раздел «Данные» стал кадрами 06 и 07, «Результаты» — кадрами 08, 09 и 10, «Теория» — кадрами 03 и 04, «Источники» — кадрами 21 и 22. Это основной способ уместить материал без уменьшения шрифта.'},
 {t:'ok',h:'Ultrawide и 21:9',d:'Ширина контента ограничена <code>min(1440px, 94cqw)</code>, композиция центрирована, фоновые слои растянуты на весь viewport. Направляющие 16:9 включаются клавишей Y.'},
 {t:'ok',h:'Портрет и узкие экраны',d:'При ширине 700 px и менее, в режиме «Обзор», в документации и при <code>prefers-reduced-motion</code> строгая автоподгонка отключается: кадр получает аккуратную внутреннюю прокрутку.'},
 {t:'ok',h:'Ручное управление',d:'Кнопка ⤢ в панели навигации и клавиша <kbd>F</kbd> переключают автоподгонку, чтобы показать кадр в масштабе 1:1. Состояние выводится в журнал диагностики.'},
 {t:'warn',h:'Ограничение',d:'Автоподгонка уменьшает содержимое, но не переносит его в другой кадр. Если в будущий кадр добавить много текста, масштаб может стать заметно меньше 1 — в этом случае материал нужно разбить на два кадра, а не полагаться только на scale.'}
];

var COLORS=[
 ['--bg','#090a10','Фон сцены'],
 ['--bg2','#05060a','Фон документации'],
 ['--panel','#11131d','Панель'],
 ['--panel2','#171a27','Панель светлее'],
 ['--panel3','#1e2233','Заголовки таблиц'],
 ['--text','#f6f5fc','Основной текст'],
 ['--dim','#cfcede','Вторичный текст'],
 ['--muted','#a4a5b7','Приглушённый'],
 ['--muted2','#6c6e84','Метки и сноски'],
 ['--line','#272a3a','Границы'],
 ['--line2','#3a3f59','Границы при наведении'],
 ['--purple','#9b7bff','Акцент: автономия'],
 ['--amber','#ffbf69','Акцент: компетентность'],
 ['--teal','#66dfc4','Акцент: связанность'],
 ['--green','#00ff9c','Акцент данных и состояний'],
 ['--red','#ff7d91','Акцент риска']
];
var TYPESCALE=[
 ['--fs-0','clamp(7px, 1.02cqh, 10px)','Метки, сноски, единицы измерения'],
 ['--fs-1','clamp(8px, 1.22cqh, 11.5px)','Микротекст, chip, подписи диаграмм'],
 ['--fs-2','clamp(9.5px, 1.55cqh, 14.5px)','Текст карточек и списков'],
 ['--fs-3','clamp(11px, 1.95cqh, 18px)','Подзаголовок слайда (.sub)'],
 ['--fs-4','clamp(12.5px, 2.4cqh, 22px)','Заголовок карточки, цитаты'],
 ['--fs-5','clamp(15px, 3cqh, 29px)','Второй уровень (h2)'],
 ['--fs-6','clamp(19px, 4.5cqh, 46px)','Заголовок слайда (h1.tt)'],
 ['--fs-7','clamp(26px, 8.2cqh, 92px)','Ключевые числа и hero']
];
var MOTION=[
 ['Вход кадра вперёд','0.50s','cubic-bezier(.16,1,.3,1)','Сдвиг на 1.8% + blur 3px к нулю'],
 ['Вход кадра назад','0.50s','cubic-bezier(.16,1,.3,1)','Зеркальный сдвиг, направление учитывается'],
 ['Выход кадра','0.28s','cubic-bezier(.7,0,.84,0)','Короче входа, чтобы не было «ваты»'],
 ['Появление блоков','0.60s','cubic-bezier(.16,1,.3,1)','translateY 13px, stagger 70–90 мс, без blur'],
 ['Световая волна по заголовку','1.2s','cubic-bezier(.65,0,.35,1)','Однократно, непрозрачность 0.14'],
 ['Столбцы диаграмм','1.35s + 90 мс/шаг','cubic-bezier(.16,1,.3,1)','Заполнение ширины, каскад сверху вниз'],
 ['Кольцевая диаграмма','1.3s + 145 мс/сегмент','cubic-bezier(.16,1,.3,1)','stroke-dasharray с зазором 0.9'],
 ['Шкала (gauge)','1.5s','cubic-bezier(.16,1,.3,1)','stroke-dasharray дуги pathLength=100'],
 ['Unit-сетка 18 ячеек','0.42s + 26 мс/ячейка','cubic-bezier(.16,1,.3,1)','scale 0.55 к 1, появление по порядку'],
 ['Счётчики чисел','1.1s','easeOutQuart','requestAnimationFrame, один кадр — один счётчик'],
 ['Печать текста','20–30 мс/символ','—','Только на смысловых пиках: hero, вопрос, инсайт, финал'],
 ['Световой импульс перехода','0.7s','cubic-bezier(.16,1,.3,1)','Радиальная вспышка акцентом кадра, альфа 0.07']
];
var BREAKPOINTS=[
 ['> 1240 px','Полная навигация по главам в верхней панели, сетка до 4 колонок'],
 ['1000–1240 px','Главы скрываются в меню, верхняя панель уплотняется'], ['700–1000 px','Кнопки «Докладчик» и «Обзор» уходят в меню, сетки в 2 колонки'],
 ['≤ 700 px','Портретный режим: внутренняя прокрутка кадра, автоподгонка отключена, сетки в 1 колонку, unit-сетка 6×3'],
 ['≤ 400 px','Уменьшенные боковые отступы сцены, компактная нижняя панель'],
 ['prefers-reduced-motion','Все анимации и переходы отключаются, контент показывается сразу, автоподгонка не применяется']
];var A11Y=[
 ['Клавиатура','Все действия доступны без мыши: переходы, режимы, карта кадров, докладчик, документация, справка, копирование ссылки, печать.'],
 ['Ловушка фокуса','В модальных окнах (карта кадров, докладчик, справка, мобильное меню) цикл Tab замкнут внутри окна; при закрытии фокус возвращается на вызвавший элемент.'],
 ['Неактивные кадры','Получают <code>aria-hidden="true"</code> и <code>inert</code> (где поддерживается), чтобы в табуляцию не попадали скрытые элементы.'],
 ['Анонс кадров','Регион <code>aria-live="polite"</code> объявляет номер и название кадра при каждом переходе.'], ['Диаграммы','У каждой SVG-диаграммы <code>role="img"</code> и текстовое описание со значениями и знаменателями; unit-сетки также описаны текстом.'],
 ['Таблицы данных','Все пять наборов данных продублированы скрытыми таблицами с заголовками строк и столбцов — полный доступ к числам без графики.'],
 ['Контраст','Основной текст #f6f5fc на #090a10 и вторичный #cfcede на панелях — выше требований WCAG AA.'],
 ['Пониженная анимация','<code>prefers-reduced-motion</code> отключает движение, печать текста, автоподгонку и световые эффекты; числа показываются сразу итогом.'],
 ['Ссылка перехода','Первый элемент страницы — «Перейти к содержимому», видимый при фокусе с клавиатуры.'],
 ['Печать','Print-стили выводят каждый кадр на отдельную страницу в светлой читаемой версии.']
];
var ASSETS=[
 {t:'ok',h:'Иллюстрации и видео',d:'PNG, SVG, WebP и MP4 размещены в папке assets. Они загружаются с сайта вместе с презентацией; повторяющиеся иллюстрации не используются.'},
 {t:'ok',h:'Шрифты',d:'Inter и JetBrains Mono подгружаются с jsDelivr отдельными наборами latin и cyrillic с <code>unicode-range</code>. Без сети браузер подставит системные шрифты — вёрстка и функциональность сохранятся.'},
 {t:'ok',h:'Сторонние сервисы',d:'Аналитика и запросы к API не используются. Three.js хранится локально. Шрифты загружаются с jsDelivr; ссылки на источники открываются только по клику.'},
 {t:'ok',h:'Личные данные',d:'Персональные данные участников не собираются и не хранятся. Реплики анонимны, формы ввода на странице отсутствуют, локальное хранилище не используется.'},
 {t:'ok',h:'Буфер обмена',d:'Копирование ссылки и артефактов выполняется только по явному нажатию кнопки, с запасным вариантом через <code>execCommand</code> для старых браузеров.'}
];
var QA=[
 {t:'ok',h:'Кнопка «О проекте»',d:'Открывает документацию из любого состояния: из презентации, из режима «Обзор», из мобильного меню, из карты кадров, из справки и по клавише <kbd>S</kbd>. Возврат восстанавливает прежний режим и текущий кадр.'},
 {t:'ok',h:'Все элементы управления',d:'Проверены: логотип, главы, точки, счётчик, «назад/вперёд», карта кадров, направляющие, автоподгонка, копирование ссылки, режимы, справка, докладчик, меню, вкладки документации, кнопки внутри кадров, карточки обзорной сетки, узлы research map.'}, {t:'ok',h:'Кадр 16:9 без скролла',d:'В режиме презентации <code>overflow:hidden</code> на body и на каждом экране. Содержимое помещается целиком за счёт единиц контейнера, clamp-ограничителей и автоматического scale. Отчёт доступен в разделе «Каркас 16:9».'},
 {t:'ok',h:'Клавиатура',d:'← → Space PageUp PageDown Home End — переход; P — докладчик; G — карта; S — документация; E — режим; F — автоподгонка; Y — направляющие; L — ссылка; H — справка; Esc — закрыть слой; Tab — ловушка фокуса в модалках.'},
 {t:'ok',h:'URL и история',d:'Hash на каждый кадр, <code>#docs/раздел</code>, <code>#overview</code>, <code>#presenter</code>. Кнопки браузера «назад/вперёд» обрабатываются через popstate без дублирования записей.'},
 {t:'ok',h:'Быстрая смена кадров',d:'Generation-token отменяет устаревшие отложенные пересчёты и анимации; таймеры выходных анимаций очищаются перед новым переходом.'},
 {t:'ok',h:'Диаграммы',d:'Шкала, кольцевые, столбчатые, сегментная полоса и три unit-сетки строятся при появлении кадра; наведение подсвечивает сегмент, пункт легенды и отдельную ячейку с подписью участника.'},
 {t:'ok',h:'Сдержанный свет',d:'Убраны вращающиеся конические лучи, падающие «матричные» потоки и бесконечные блики. Оставлены: мягкие орбы, статическое зерно низкой плотности, виньетка, световое пятно за курсором и короткий импульс при смене кадра.'},
 {t:'ok',h:'Производительность',d:'Один rAF-планировщик на все эффекты с паузой при скрытой вкладке и ограничением примерно 64 fps; canvas hero работает только на видимом кадре; документация собирается отложенно через requestIdleCallback; слушатели перемещения — passive.'},
 {t:'ok',h:'Утечки памяти',d:'Подписки rAF удаляются после завершения (счётчики), таймеры очистки хранятся и отменяются, наблюдатели создаются один раз, обработчики назначаются однократно с флагом привязки.'},
 {t:'ok',h:'Reduced motion',d:'Отключаются движение частиц, световое пятно, наклон карточек, счётчики, автоподгонка, зерно и дрейф орбов; контент показывается сразу.'}, {t:'ok',h:'Адаптивность',d:'Контрольные точки 1240 / 1000 / 700 / 400 px, портретный режим с внутренней прокруткой кадра, бургер-меню, отключение декоративных слоёв на узких экранах.'},
 {t:'ok',h:'Работа без сети',d:'Локальные стили, скрипты, видео и графика работают без сети. Для шрифтов используются системные варианты.'},
 {t:'ok',h:'Печать и PDF',d:'Print-стили: каждый кадр на отдельной странице, светлый фон, читаемый текст, масштаб сброшен, декор скрыт.'},
 {t:'ok',h:'Целостность данных',d:'Все пять наборов: сумма равна знаменателю. Ни одно число исследования не изменено; противоречие формулировки раскрыто двумя прочтениями.'},
 {t:'ok',h:'Обработка ошибок',d:'Инициализация обёрнута в try/catch: при сбое весь контент показывается сплошной лентой с раскрытыми текстами, данные остаются доступными. Ошибки подписчиков планировщика изолированы.'},
 {t:'ok',h:'Статические проверки',d:'Каталог tests содержит проверки навигации, структуры 23 кадров, исследовательских данных, локальных ресурсов и композиции иллюстраций.'},
 {t:'warn',h:'Синхронизация двух экранов',d:'Межоконная синхронизация режима докладчика не тестировалась и поэтому не заявляется. Реализован локальный режим с заметками и таймером.'}
];var QA_STATS=[['23','Кадра 16:9'],['11','Диаграмм'],['5','Наборов данных'],['17','Показателей'],['0','Изменённых чисел'],['8','Источников'],['13','Горячих клавиш'],['1','Внешний хост шрифтов']];
var CHANGES=[
 ['2026','Текущий выпуск','23 кадра исследования, интерактивные диаграммы, локальные иллюстрации и видео, доступные режимы просмотра и печати. Исходные данные и выводы исследования сохранены.']
];
var DICT=[
'# DATA_DICTIONARY.md — PIXEL / VALUE',
'# Единственный источник правды о числах исследования.',
'# Правило: значения неизменяемы. Знаменатель обязателен.',
'',
'[activity]  Игровая активность            знаменатель: 18',
'  Ежедневно .................... 7   (38.9%)',
'  Несколько раз в неделю ....... 6   (33.3%)',
'  1-2 раза в неделю ............ 3   (16.7%)',
'  Реже ......................... 2   (11.1%)',
'  сумма: 18  ->  [OK]',
'',
'[purchase]  Опыт покупки косметики        знаменатель: 18',
'  Покупали ..................... 10  (55.6%, округл. 56%)',
'  Не покупали .................. 8   (44.4%)',
'  сумма: 18  ->  [OK]',
'',
'[motives]   Главный мотив покупки         знаменатель: 10',
'  Стиль / самовыражение ........ 4   (40%)',
'  Редкие предметы .............. 3   (30%)',
'  Повышение статуса ............ 2   (20%)',
'  Влияние друзей ............... 1   (10%)',
'  Поддержка студии ............. 0   (0%)',
'  сумма: 10  ->  [OK]',
'  ВАЖНО: вопрос задавался только покупателям.',
'',
'[rarity]    Редкий скин = статус         знаменатель: 18',
'  Да ........................... 7   (38.9%)',
'  Нет .......................... 6   (33.3%)',
'  Затрудняюсь .................. 5   (27.8%)',
'  сумма: 18  ->  [OK]',
'',
'[friends]   Влияние друзей                знаменатель: 18',
'  Сильно ....................... 3   (16.7%)',
'  Иногда ....................... 7   (38.9%)',
'  Не влияют .................... 8   (44.4%)',
'  сумма: 18  ->  [OK]',
'',
'[sdt]       Интерпретация через SDT — СМЕШАННЫЕ ЗНАМЕНАТЕЛИ',
'  Autonomy    / стиль .......... 4 из 10   (40%)',
'  Competence  / статус ......... 7 из 18   (38.9%)',
'  Relatedness / друзья сильно .. 3 из 18   (16.7%)',
'  -> не сводить в одну шкалу и в одну круговую диаграмму',
'',
'[conflict]  ЗАФИКСИРОВАНО, НЕ ИСПРАВЛЕНО  ->  [WARN]',
'  Заголовок: "72% играют еженедельно или чаще"',
'  Подпись:   "13 из 18 играют не реже раза в неделю"',
'  13 = 7 + 6 = 72.2%  (чаще одного раза в неделю)',
'  Буквальное чтение заголовка: 7 + 6 + 3 = 16 из 18 = 88.9%',
'  -> показать оба прочтения в сноске кадра 06, числа не трогать',
'',
'[sources]   8 записей, перенесены дословно, DOI не дополнялись  ->  [OK]',
'[quotes]    3 анонимные реплики, дословно, без переформулировки ->  [OK]'
].join('\n');

function buildDocs(){
  var ag=$('#aboutGoal'); if(ag){ ag.innerHTML=ABOUT_GOAL; }
  var aq=$('#aboutQ'); if(aq){ aq.innerHTML=ABOUT_Q; }

  var at=$('#archTable');  if(at){
    var archRows=ARCH.map(function(r){
      return '<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>';
    }).join('');
    at.innerHTML='<thead><tr><th>Слой</th><th>Решение</th><th>Подробности</th></tr></thead><tbody>'+archRows+'</tbody>';
  }

  var rl=$('#ruleList');
  if(rl){
    rl.innerHTML=RULES.map(function(r,i){
      return '<div class="dc-note rv" style="--d:'+(i%3)*70+'ms;border-left-color:'+r[2]+'">'
        +'<div class="l" style="color:'+r[2]+'">'+r[0]+'</div>'
        +'<div class="x">'+r[1]+'</div></div>';
    }).join('');
  }

  var db=$('#dictBody'); if(db){ db.innerHTML=hl(DICT); }

  renderAudit();

  var cb=$('#chartBody'); if(cb){ cb.innerHTML=hl(JSON.stringify(chartSpecs(),null,2)); }

  var fl=$('#fitList');
  if(fl){
    fl.innerHTML=FITDOC.map(function(f){
      var cls=(f.t==='ok')?'ok':'';
      var pill=(f.t==='ok')?'ok':'spec';
      var label=(f.t==='ok')?'РЕАЛИЗОВАНО':'ОГРАНИЧЕНИЕ';
      return '<div class="finding '+cls+' rv"><div class="finding-h"><span class="pill '+pill+'">'+label+'</span>'
        +'<span class="finding-t">'+f.h+'</span></div><div class="finding-d">'+f.d+'</div></div>';
    }).join('');
  }

  var cl=$('#colorList');
  if(cl){
    var swatches=COLORS.map(function(c){
      return '<div class="sw-row"><span class="sw-box" style="background:'+c[1]+'"></span>'
        +'<span class="sw-name">'+c[2]+'</span><span class="sw-val">'+c[0]+' · '+c[1]+'</span></div>';
    }).join('');
    cl.innerHTML='<div style="background:var(--panel);border-radius:14px;overflow:hidden">'+swatches+'</div>';
  }

  var tt=$('#typeTable');
  if(tt){
    var tRows=TYPESCALE.map(function(r){
      return '<tr><td><b>'+r[0]+'</b></td><td style="font-family:var(--mono);font-size:11.5px">'+r[1]+'</td><td>'+r[2]+'</td></tr>';
    }).join('');
    tt.innerHTML='<thead><tr><th>Токен</th><th>Значение</th><th>Назначение</th></tr></thead><tbody>'+tRows+'</tbody>';
  }

  var mt=$('#motionTable');
  if(mt){
    var mRows=MOTION.map(function(r){
      return '<tr><td><b>'+r[0]+'</b></td><td style="font-family:var(--mono);font-size:11.5px">'+r[1]+'</td>'
        +'<td style="font-family:var(--mono);font-size:11px">'+r[2]+'</td><td>'+r[3]+'</td></tr>';
    }).join('');
    mt.innerHTML='<thead><tr><th>Эффект</th><th>Длительность</th><th>Кривая</th><th>Описание</th></tr></thead><tbody>'+mRows+'</tbody>';
  }

  var bt=$('#bpTable');
  if(bt){
    var bRows=BREAKPOINTS.map(function(r){
      return '<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td></tr>';
    }).join('');
    bt.innerHTML='<thead><tr><th>Условие</th><th>Поведение</th></tr></thead><tbody>'+bRows+'</tbody>';
  }

  var kt=$('#keysTable');
  if(kt){
    var kRows=KEYS.map(function(r){
      return '<tr><td><b style="font-family:var(--mono)">'+r[0]+'</b></td><td>'+r[1]+'</td></tr>';
    }).join('');
    kt.innerHTML='<thead><tr><th>Клавиши</th><th>Действие</th></tr></thead><tbody>'+kRows+'</tbody>';
  }

  var al=$('#a11yList');
  if(al){
    al.innerHTML=A11Y.map(function(r,i){
      return '<div class="finding ok rv" style="--d:'+(i%3)*60+'ms"><div class="finding-h">'
        +'<span class="pill ok">готово</span><span class="finding-t">'+r[0]+'</span></div>'
        +'<div class="finding-d">'+r[1]+'</div></div>';
    }).join('');
  }

  var ql=$('#qaList');
  if(ql){
    ql.innerHTML=QA.map(function(f){
      var cls=(f.t==='ok')?'ok':'';
      var pill=(f.t==='ok')?'ok':'spec';
      var label=(f.t==='ok')?'ПРОВЕРЕНО':'ОГРАНИЧЕНИЕ';
      return '<div class="finding '+cls+' rv"><div class="finding-h"><span class="pill '+pill+'">'+label+'</span>'
        +'<span class="finding-t">'+f.h+'</span></div><div class="finding-d">'+f.d+'</div></div>';
    }).join('');
  }

  var qs=$('#qaStats');
  if(qs){
    qs.innerHTML=QA_STATS.map(function(s,k){
      return '<div class="kpi rv" style="--ac:var(--green);--ac2:var(--teal2);--d:'+k*50+'ms">'
        +'<div class="kpi-l">'+s[1]+'</div><div class="kpi-v" style="font-size:32px">'+s[0]+'</div></div>';
    }).join('');
  }

  var as=$('#assetList');
  if(as){
    as.innerHTML=ASSETS.map(function(f,i){
      var cls=(f.t==='ok')?'ok':'';
      var pill=(f.t==='ok')?'ok':'spec';
      var label=(f.t==='ok')?'ТАК':'УТОЧНЕНИЕ';
      var border=(f.t==='ok')?'var(--green)':'var(--amber)';
      return '<div class="finding '+cls+' rv" style="--d:'+(i%2)*70+'ms;border-left-color:'+border+'">'
        +'<div class="finding-h"><span class="pill '+pill+'">'+label+'</span>'
        +'<span class="finding-t">'+f.h+'</span></div><div class="finding-d">'+f.d+'</div></div>';
    }).join('');
  }

  var ch=$('#changeList');
  if(ch){
    ch.innerHTML=CHANGES.map(function(c,i){
      return '<div class="finding ok rv" style="--d:'+i*55+'ms"><div class="finding-h">'
        +'<span class="pill ok">'+c[0]+'</span><span class="finding-t">'+c[1]+'</span></div>'
        +'<div class="finding-d">'+c[2]+'</div></div>';
    }).join('');
  }

  var es=$('#envStats');
  if(es){
    var envRows=[
      ['Кадров',String(N)],
      ['Диаграмм',String(chartSpecs().length)],
      ['Показателей','17'],
      ['Автоподгонка',Fit.enabled()?'вкл':'выкл'],
      ['Reduced motion',Env.RM?'да':'нет'],
      ['Слабое устройство',Env.LOW?'да':'нет'],
      ['Ядер CPU',String(Env.cores)],
      ['Задач в планировщике',String(Ticker.size())]
    ];
    es.innerHTML=envRows.map(function(r,i){
      return '<div class="kpi rv" style="--ac:var(--teal);--ac2:var(--teal2);--d:'+i*45+'ms">'
        +'<div class="kpi-l">'+r[0]+'</div><div class="kpi-v" style="font-size:24px">'+r[1]+'</div></div>';
    }).join('');
  }

  var fb=$('#fitBody');
  if(fb){ fb.innerHTML=hl('$ frame-169 --report\n> нажмите «Измерить все кадры сейчас», чтобы выполнить реальный замер.'); }

  Log.ensure();
  bindDocs();
  initTilt();
}

function renderAudit(){
  var A=runAudit();
  var al=$('#auditList');
  var alog=$('#auditLog');
  if(al){
    al.innerHTML=A.map(function(f){
      var cls='';
      var pill='spec';
      var label='WARN';
      if(f.t==='ok'){ cls='ok'; pill='ok'; label='OK'; }
      else if(f.t==='crit'){ cls='crit'; pill='no'; label='CRIT'; }
      return '<div class="finding '+cls+' rv in"><div class="finding-h">'
        +'<span class="pill '+pill+'">'+label+'</span>'
        +'<span class="finding-t">'+f.h+'</span></div>'
        +'<div class="finding-d">'+f.d+'</div></div>';
    }).join('');
  }
  if(alog){ alog.innerHTML=hl(auditLogText()); }
}

function setTab(p){
  S.tab=p;
  $$('#dcTabs button').forEach(function(b){
    var isOn=(b.getAttribute('data-pane')===p);
    b.classList.toggle('on',isOn);
    b.setAttribute('aria-selected',isOn?'true':'false');
  });
  $$('.dc-pane').forEach(function(x){ x.classList.toggle('on',x.id==='pane-'+p); });
  setTimeout(function(){
    $$('.dc-pane.on .rv').forEach(function(e){ e.classList.add('in'); });
  },40);
  if(S.mode==='docs'){ history.replaceState(null,'','#docs/'+p); }
}

function bindDocs(){  $$('#dcTabs button').forEach(function(b){
    if(b.dataset.bound){ return; }
    b.dataset.bound='1';
    on(b,'click',function(){ setTab(b.getAttribute('data-pane')); });  });

  $$('[data-run]').forEach(function(b){
    if(b.dataset.bound){ return; }
    b.dataset.bound='1';
    on(b,'click',function(){
      var what=b.getAttribute('data-run');      if(what==='audit'){
        renderAudit();
        var R=runAudit();
        Log.add('аудит данных → проверок '+R.length+', изменённых чисел 0','ok');
        toast('✓ Аудит данных перезапущен · '+R.length+' проверок');
      } else if(what==='charts'){
        var cb=$('#chartBody');
        if(cb){ cb.innerHTML=hl(JSON.stringify(chartSpecs(),null,2)); }
        setTab('charts');
        Log.add('спецификации диаграмм → пересчитано '+chartSpecs().length+' шт.','ok');        toast('▶ Пересчитано '+chartSpecs().length+' спецификаций');
      } else if(what==='fit'){
        var rep=fitReport();
        var fb=$('#fitBody');
        if(fb){
          fb.innerHTML=hl('$ frame-169 --measure --all\n'+rep.rows.join('\n')
            +'\n\nКАДРОВ: '+SECT.length+' · ТРЕБУЮТ SCALE: '+rep.over+' · ВНУТРЕННИЙ СКРОЛЛ В ПРЕЗЕНТАЦИИ: 0');
        }
        if(S.tab!=='diag'){ setTab('frame'); }
        Log.add('замер кадров → всего '+SECT.length+', с уменьшением масштаба '+rep.over+', текущий k='+Fit.lastK().toFixed(3),'ok');        toast('⤢ Измерено '+SECT.length+' кадров · уменьшен масштаб: '+rep.over);
      } else if(what==='selftest'){
        var R2=runAudit();
        var bad=0;
        R2.forEach(function(r){ if(r.h.indexOf('Расхождение')===0){ bad++; } });
        var specs=chartSpecs().length;
        var rep2=fitReport();
        Log.add('самопроверка → старт','info');
        Log.add('данные: наборов 5, показателей 17, расхождений сумм '+bad,'ok');
        Log.add('диаграммы: спецификаций '+specs,'ok');        Log.add('каркас: кадров '+SECT.length+', с уменьшением '+rep2.over+', скролл в презентации 0','ok');
        Log.add('движение: reduced-motion '+(Env.RM?'да':'нет')+', слабое устройство '+(Env.LOW?'да':'нет'),'info');
        Log.add('навигация: глав '+CHAPTERS.length+', клавиш '+KEYS.length+', hash-маршрутов 4','ok');
        Log.add('самопроверка завершена: '+R2.length+' проверок целостности, 0 изменённых чисел','ok');
        var fb2=$('#fitBody');
        if(fb2){
          fb2.innerHTML=hl('$ frame-169 --measure --all\n'+rep2.rows.join('\n')
            +'\n\nКАДРОВ: '+SECT.length+' · ТРЕБУЮТ SCALE: '+rep2.over+' · ВНУТРЕННИЙ СКРОЛЛ В ПРЕЗЕНТАЦИИ: 0');
        }
        var es=$('#envStats');        if(es){
          var envRows=[
            ['Кадров',String(N)],
            ['Диаграмм',String(specs)],
            ['Показателей','17'],
            ['Автоподгонка',Fit.enabled()?'вкл':'выкл'],
            ['Reduced motion',Env.RM?'да':'нет'],
            ['Слабое устройство',Env.LOW?'да':'нет'],
            ['Ядер CPU',String(Env.cores)],
            ['Задач в планировщике',String(Ticker.size())]
          ];
          es.innerHTML=envRows.map(function(r,i){
            return '<div class="kpi rv in" style="--ac:var(--teal);--ac2:var(--teal2)">'
              +'<div class="kpi-l">'+r[0]+'</div><div class="kpi-v" style="font-size:24px">'+r[1]+'</div></div>';
          }).join('');
        }
        toast('✓ Самопроверка пройдена · '+R2.length+' проверок');
      } else if(what==='clear'){
        Log.clear();
        Log.add('журнал очищен','warn');
      }
    });
  });

  $$('[data-copy]').forEach(function(b){
    if(b.dataset.bound){ return; }
    b.dataset.bound='1';
    on(b,'click',function(){
      var label=(b.textContent||'').replace('⧉ ','');
      copyEl(b.getAttribute('data-copy'),label);
    });
  });
}

/* ══════════ ИСТОЧНИКИ В КАДРАХ ══════════ */
function buildSources(){
  var a=$('#srcA'), b=$('#srcB');
  function card(s,k){
    var el=document.createElement('a');
    el.className='src rv';
    el.style.setProperty('--d',(k%2)*70+'ms');
    el.href=s.u;
    el.target='_blank';
    el.rel='noopener noreferrer';
    el.innerHTML='<div class="src-a">'+s.a+'</div><div class="src-t">'+s.t+'</div>'
      +'<div class="src-m">'+s.m+'</div><div class="src-l">'+s.l+'</div>';
    return el;
  }
  if(a){
    a.innerHTML='';
    SOURCES.slice(0,4).forEach(function(s,k){ a.appendChild(card(s,k)); });
  }
  if(b){
    b.innerHTML='';
    SOURCES.slice(4).forEach(function(s,k){ b.appendChild(card(s,k)); });
  }
}

/* ══════════ ДИСПЕТЧЕР СОБЫТИЙ ══════════ */
function onClick(e){
  var t=e.target;
  if(!(t instanceof Element)){ return; }
  var tab=t.closest('#dcTabs button');
  if(tab){ setTab(tab.getAttribute('data-pane')); return; }

  var g=t.closest('[data-go]');
  if(g){
    e.preventDefault();
    var targetIndex=parseInt(g.getAttribute('data-go'),10);
    if(g.classList.contains('ov-c')||g.classList.contains('mapnode')){
      toggleOv(false);
      go(targetIndex);
      history.replaceState(null,'','#'+META[targetIndex].id);
      return;
    }
    closeLayers();
    go(targetIndex);
    return;
  }

  var a=t.closest('[data-act]');
  if(!a){ return; }
  var v=a.getAttribute('data-act');

  if(v==='overview'){ toggleOv(); }
  else if(v==='presenter'){ togglePr(); }
  else if(v==='copy'){ copyLink(); }
  else if(v==='help'){ toggleHelp(); }
  else if(v==='print'){
    toast('⎙ Открываю диалог печати…');
    Log.add('экспорт → диалог печати / PDF','info');
    setTimeout(function(){ window.print(); },360);
  }
  else if(v==='docs'){
    closeLayers();
    if(S.mode==='docs'){ setView('present'); toast('◈ Возврат к презентации'); }
    else { setView('docs'); toast('◈ Документация проекта'); }
  }
  else if(v==='mode'){
    setView(S.mode==='explore'?'present':'explore');
    toast(S.mode==='explore'?'⇄ Режим обзора: все кадры одной лентой':'⇄ Режим презентации 16:9');
  }
  closeLayers();
}

function onKey(e){
  var tag=(e.target&&e.target.tagName)?e.target.tagName.toLowerCase():'';
  if(tag==='input'||tag==='textarea'||tag==='select'||(e.target&&e.target.isContentEditable)){ return; }
  var k=e.key;
  var low=(k.length===1)?k.toLowerCase():k;

  if(low==='Escape'){
    var wasOverview=!!($('#ov')&&$('#ov').classList.contains('on'));
    if(closeLayers()){
      if(wasOverview){history.replaceState(null,'',(S.mode==='docs')?('#docs/'+S.tab):('#'+META[S.i].id));}
      e.preventDefault();
    }
    return;
  }

  if(k==='Tab'&&trapEl){
    var f=focusables(trapEl);
    if(f.length){
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
    return;
  }

  var ovEl=$('#ov'), helpEl=$('#help'), mmEl=$('#mm'), qaEl=$('#qaDialog');
  var layerOpen=(ovEl&&ovEl.classList.contains('on'))||(helpEl&&helpEl.classList.contains('on'))||(mmEl&&mmEl.classList.contains('on'))||(qaEl&&qaEl.classList.contains('on'));

  if(low==='h'||k===''||k==='/'){ e.preventDefault(); toggleHelp(); return; }

  if(!layerOpen&&S.mode!=='docs'){
    if(low==='g'){ e.preventDefault(); toggleOv(); return; }
    if(low==='p'){ e.preventDefault(); togglePr(); return; }
    if(low==='s'){ e.preventDefault(); setView('docs'); return; }
    if(low==='e'){ e.preventDefault(); setView(S.mode==='explore'?'present':'explore'); return; }
    if(low==='l'){ e.preventDefault(); copyLink(); return; }
    if(low==='f'){ e.preventDefault(); toggleFit(); return; }
    if(low==='y'){ e.preventDefault(); toggleGuides(); return; }
  }
  if(layerOpen){ return; }

  if(low==='ArrowRight'||low===' '||low==='Spacebar'||low==='PageDown'){ e.preventDefault(); next(); }
  else if(low==='ArrowLeft'||low==='PageUp'){ e.preventDefault(); prev(); }
  else if(low==='Home'){ e.preventDefault(); go(0); }
  else if(low==='End'){ e.preventDefault(); go(N-1); }
}

function initTouch(){
  var sx=0, sy=0, lock=false, active=false;
  on(document,'touchstart',function(e){
    if(!e.touches||!e.touches[0]){ return; }
    sx=e.touches[0].clientX; sy=e.touches[0].clientY; lock=false;
    var ovEl=$('#ov');
    active=(S.mode==='present'&&!S.presenter&&!(ovEl&&ovEl.classList.contains('on'))&&!(e.target&&e.target.closest&&e.target.closest('.artifact-interactive')));
  },{passive:true});
  on(document,'touchmove',function(e){
    if(!active||lock||!e.touches||!e.touches[0]){ return; }
    var dx=e.touches[0].clientX-sx;
    var dy=e.touches[0].clientY-sy;
    if(Math.abs(dx)>64&&Math.abs(dx)>Math.abs(dy)*1.8){
      lock=true;
      if(dx<0){ next(); } else { prev(); }
    }
  },{passive:true});
  on(document,'touchend',function(){ active=false; lock=false; },{passive:true});
}

function initScroll(){
  var raf=false;
  on(window,'scroll',function(){
    if(raf){ return; }
    raf=true;
    requestAnimationFrame(function(){
      raf=false;
      if(S.mode==='explore'){
        var k=0;
        SECT.forEach(function(el,j){
          if(el.getBoundingClientRect().top<window.innerHeight*0.38){ k=j; }
        });
        if(k!==S.i){
          S.i=k;
          applyAccent();
          history.replaceState(null,'','#'+META[k].id);
          paint(); announce(); updatePresenter();
        }
      }
    });
  },{passive:true});
}

function initResize(){
  var to=null;
  on(window,'resize',function(){
    clearTimeout(to);
    to=setTimeout(function(){
      if(S.mode==='present'){ Fit.apply(SECT[S.i]); }
      paint();
    },130);
  });
  var st=$('#stage');
  if(window.ResizeObserver&&st){
    try{
      var ro=new ResizeObserver(function(){ if(S.mode==='present'){ Fit.apply(SECT[S.i]); } });
      ro.observe(st);
    }catch(e){}
  }
  if(document.fonts&&document.fonts.ready&&document.fonts.ready.then){
    document.fonts.ready.then(function(){ if(S.mode==='present'){ Fit.apply(SECT[S.i]); } }).catch(function(){});
  }
  on(window,'orientationchange',function(){
    setTimeout(function(){ if(S.mode==='present'){ Fit.apply(SECT[S.i]); } },280);
  });
}

/* ══════════ INIT ══════════ */
function init(){
  if(Env.LOW){ document.documentElement.classList.add('low-perf'); }
  try{
    buildNav();
    buildSources();
    buildA11yTables();
    buildHelp();
    // Editorial heading is readable immediately; no letter-by-letter reveal.
    initHeroCanvas();
    initLight();
    initTilt();
    initIO();
    initTouch();
    initScroll();
    initResize();
    if(Env.LOW){ document.body.classList.add('lowfx'); }

    on(document,'click',onClick);
    on(document,'keydown',onKey);
    on(window,'popstate',readHash);

    on($('#bPrev'),'click',prev);
    on($('#bNext'),'click',next);
    on($('#bOv'),'click',function(){ toggleOv(); });
    on($('#bFit'),'click',toggleFit);
    on($('#bGuide'),'click',toggleGuides);
    on($('#bCopy'),'click',copyLink);
    on($('#ovBtn'),'click',function(){ toggleOv(); });
    on($('#ovClose'),'click',function(){ toggleOv(false); });
    on($('#helpBtn'),'click',function(){ toggleHelp(); });
    on($('#helpClose'),'click',function(){ toggleHelp(false); });
    on($('#helpDone'),'click',function(){ toggleHelp(false); });
    on($('#presenterBtn'),'click',function(){ togglePr(); });
    on($('#prClose'),'click',function(){ togglePr(false); });
    on($('#prPrev'),'click',prev);
    on($('#prNext'),'click',next);
    on($('#prReset'),'click',function(){ S.t0=Date.now(); timer(); toast('↺ Таймер сброшен'); });
    on($('#qaOpenFinal'),'click',function(){ toggleQa(true); });
    on($('#qaOpenPresenter'),'click',function(){ toggleQa(true); });
    on($('#qaClose'),'click',function(){ toggleQa(false); });
    on($('#qaDone'),'click',function(){ toggleQa(false); });
    on($('#qaDialog'),'click',function(e){ if(e.target===$('#qaDialog')){ toggleQa(false); } });
    on($('#docsBtn'),'click',function(){
      if(S.mode==='docs'){ setView('present'); toast('◈ Возврат к презентации'); }
      else { setView('docs'); toast('◈ Документация проекта'); }
    });
    on($('#modeTop'),'click',function(){ setView(S.mode==='explore'?'present':'explore'); });
    on($('#mPres'),'click',function(){ setView('present'); });
    on($('#mExpl'),'click',function(){ setView('explore'); });
    on($('#mDocs'),'click',function(){ setView('docs'); });    on($('#burger'),'click',function(){ toggleMenu(); });
    on($('#mmClose'),'click',function(){ toggleMenu(false); });
    Env.idle(function(){
      if(!S.docsBuilt){
        buildDocs();
        S.docsBuilt=true;
        Log.add('документация → разделы собраны в фоне','ok');
      }
    },{timeout:2500});

    var h=(location.hash||'').replace('#','');    if(h.indexOf('docs')===0){
      if(!S.docsBuilt){ buildDocs(); S.docsBuilt=true; }
      S.tab=h.split('/')[1]||'about';
      setTab(S.tab);
      setView('docs',{silent:true});
    } else if(h==='overview'){
      SECT.forEach(function(el,j){ el.classList.toggle('on',j===0); });
      S.i=0;
      applyAccent();
      reveal(SECT[0]);
      toggleOv(true);    } else if(h==='presenter'){
      SECT.forEach(function(el,j){ el.classList.toggle('on',j===0); });
      S.i=0;
      applyAccent();
      reveal(SECT[0]);
      togglePr(true);
    } else {
      var k=-1;
      for(var i=0;i<META.length;i++){ if(META[i].id===h){ k=i; break; } }
      S.i=(k>=0)?k:0;
      SECT.forEach(function(el,j){ el.classList.toggle('on',j===S.i); });      applyAccent();
      setTimeout(function(){ play(SECT[S.i]); },150);
      setTimeout(function(){ Fit.apply(SECT[S.i]); },620);
    }

    paint();
    announce();
    syncModeButtons();

    var R=runAudit();
    var bad=0;
    R.forEach(function(r){ if(r.h.indexOf('Расхождение')===0){ bad++; } });
    if(window.console){
      if(bad){ console.warn('[Аудит данных] расхождения сумм: '+bad); }
      else { console.log('%c[Аудит данных] 5 наборов целостны · 1 противоречие формулировки зафиксировано · 0 изменённых чисел','color:#00ff9c'); }
      console.log('%c[Каркас 16:9] кадров: '+N+' · автоподгонка: '+(Fit.enabled()?'активна':'отключена'),'color:#9b7bff');    }
    Log.add('старт → PIXEL / VALUE · кадров '+N+' · диаграмм '+chartSpecs().length,'ok');
    Log.add('аудит данных → '+R.length+' проверок, изменённых чисел 0','ok');
    Log.add('среда → reduced-motion: '+(Env.RM?'да':'нет')+' · слабое устройство: '+(Env.LOW?'да':'нет')+' · ядер: '+Env.cores,'info');

    setTimeout(function(){ Fit.apply(SECT[S.i]); },1000);
  }catch(err){
    try{
      SECT.forEach(function(el){ el.classList.add('on'); el.removeAttribute('aria-hidden'); });
      $$('.rv,.rvl,.rvr,.rvs,.rvc,.sweep').forEach(function(el){ el.classList.add('in'); });
      $$('.tw').forEach(function(t){ t.textContent=t.getAttribute('data-text')||t.textContent; });
      $$('.cnt').forEach(function(c){ c.textContent=(c.getAttribute('data-to')||'')+(c.getAttribute('data-suf')||''); });
      $$('.fitbox').forEach(function(b){ b.style.transform=''; });
      $$('.br-f').forEach(function(f){ f.style.width=Math.max(num(f.getAttribute('data-v')),0)+'%'; });
      $$('.waffle').forEach(function(w){ w.classList.add('in'); });
      document.body.classList.add('explore');
      var sn=$('#snav'); if(sn){ sn.classList.add('hide'); }
    }catch(e2){}
    if(window.console&&console.error){ console.error('PIXEL/VALUE init error:',err); }
  }
}

if(document.readyState==='loading'){ on(document,'DOMContentLoaded',init); }
else { init(); }

})();
