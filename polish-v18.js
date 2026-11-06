(function(){
  var SOUND_ON = false;
  var audioCtx = null;

  function beep(freq, dur, type, vol){
    if(!SOUND_ON) return;
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      var o=audioCtx.createOscillator();
      var g=audioCtx.createGain();
      o.type=type||'sine';
      o.frequency.value=freq||440;
      g.gain.value=(vol||0.03);
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime+(dur||0.06));
      o.stop(audioCtx.currentTime+(dur||0.08));
    }catch(e){}
  }

  function soundBtn(){
    if(document.querySelector('.pv-sound')) return;
    var b=document.createElement('button');
    b.type='button'; b.className='pv-sound'; b.title='Звук (выкл)';
    b.setAttribute('aria-label','Переключить звук');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    b.addEventListener('click',function(){
      SOUND_ON=!SOUND_ON;
      b.classList.toggle('on',SOUND_ON);
      b.title=SOUND_ON?'Звук (вкл)':'Звук (выкл)';
      if(SOUND_ON){
        b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>';
        beep(660,0.05,'sine',0.04);
      } else {
        b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
      }
    });
    document.body.appendChild(b);
  }

  function keysHint(){
    if(sessionStorage.getItem('pv_keys_seen')) return;
    if(document.querySelector('.pv-keys')) return;
    var el=document.createElement('div');
    el.className='pv-keys';
    el.innerHTML='<kbd>←</kbd><kbd>→</kbd><span>или</span><kbd>Space</kbd><span>листать</span>';
    document.body.appendChild(el);
    var hide=function(){
      el.classList.add('out');
      sessionStorage.setItem('pv_keys_seen','1');
      setTimeout(function(){ el.remove(); },450);
    };
    setTimeout(hide, 4500);
    window.addEventListener('keydown', function once(){ hide(); window.removeEventListener('keydown', once); }, {once:true});
  }

  function ensureProg(){
    var bar=document.querySelector('.pv-chapters');
    if(!bar) return null;
    var p=bar.querySelector('.pv-prog');
    if(!p){
      p=document.createElement('div');
      p.className='pv-prog';
      p.innerHTML='<i></i>';
      bar.appendChild(p);
    }
    return p.querySelector('i');
  }

  function syncProg(){
    var fill=ensureProg(); if(!fill) return;
    var on=document.querySelector('.screen.on')||document.querySelector('.screen[aria-hidden="false"]');
    var idx=on?parseInt(on.getAttribute('data-i')||'0',10):0;
    var total=document.querySelectorAll('.screen').length||23;
    var pct=Math.max(2, Math.min(100, ((idx+1)/total)*100));
    fill.style.width=pct+'%';
  }

  function applyAccent(){
    document.querySelectorAll('.screen[data-ac]').forEach(function(sec){
      var ac=sec.getAttribute('data-ac');
      if(ac) sec.style.setProperty('--ac', ac);
    });
  }

  var DENSE=['s6','s7','s8','s9','s10'];
  function applyDense(){
    DENSE.forEach(function(id){
      var sec=document.getElementById(id);
      if(sec) sec.classList.add('pv-dense');
    });
  }

  function injectLimit(){
    var s5=document.getElementById('s5');
    if(!s5||s5.querySelector('.pv-limit')) return;
    var html='<div class="pv-limit" role="note"><b style="color:#ffbf69">Ограничение.</b> n = 18, выборка неслучайная. Результаты описательные — не обобщаем на всех игроков.</div>';
    var host=s5.querySelector('.fitbox')||s5;
    var g=s5.querySelector('.g');
    if(g) g.insertAdjacentHTML('beforebegin', html);
    else host.insertAdjacentHTML('beforeend', html);
  }

  function injectVs(){
    var s10=document.getElementById('s10');
    if(!s10||s10.querySelector('.pv-vs')) return;
    var html='<div class="pv-vs" aria-label="Ожидание против факта">'+
      '<article class="exp"><b>Ожидание</b><p>Друзья сильно толкают к покупке скина.</p></article>'+
      '<div class="mid">→</div>'+
      '<article class="fact"><b>Факт</b><p>8 из 18 — «не влияют». Чаще всего влияние слабое или нулевое.</p></article>'+
      '</div>';
    var bars=s10.querySelector('.pv-chart-card')||s10.querySelector('.bars');
    if(bars) bars.insertAdjacentHTML('beforebegin', html);
    else {
      var tt=s10.querySelector('.tt,h1');
      if(tt) tt.insertAdjacentHTML('afterend', html);
    }
  }

  function injectQuote(){
    var s16=document.getElementById('s16');
    if(!s16||s16.querySelector('.pv-quote')) return;
    var html='<blockquote class="pv-quote"><p>Беру скин, когда он похож на меня — не когда все в отряде уже купили.</p><cite>— участник опроса</cite></blockquote>';
    var host=s16.querySelector('.fitbox')||s16;
    var first=s16.querySelector('.tt,h1,.hd');
    if(first) first.insertAdjacentHTML('afterend', html);
    else host.insertAdjacentHTML('beforeend', html);
  }

  function thinVisuals(){
    applyDense();
    ['s1','s4','s6','s7','s12'].forEach(function(id){
      var sec=document.getElementById(id);
      if(!sec) return;
      var plate=sec.querySelector('.pv-plate');
      if(plate) plate.style.display='none';
    });
  }

  function onNav(){
    beep(520, 0.04, 'sine', 0.025);
    syncProg();
  }

  function wrapGo(){
    if(typeof window.go==='function' && !window.go.__pv18){
      var _g=window.go;
      window.go=function(){
        var r=_g.apply(this,arguments);
        setTimeout(onNav, 30);
        return r;
      };
      window.go.__pv18=1;
    }
    if(typeof window.play==='function' && !window.play.__pv18){
      var _p=window.play;
      window.play=function(sec){
        var r=_p.apply(this,arguments);
        setTimeout(function(){ syncProg(); }, 40);
        return r;
      };
      window.play.__pv18=1;
    }
  }

  function boot(){
    try{soundBtn();}catch(e){}
    try{keysHint();}catch(e){}
    try{applyAccent();}catch(e){}
    try{thinVisuals();}catch(e){}
    try{injectLimit();}catch(e){}
    try{injectVs();}catch(e){}
    try{injectQuote();}catch(e){}
    try{ensureProg();syncProg();}catch(e){}
    wrapGo();
    setTimeout(function(){wrapGo();syncProg();thinVisuals();}, 800);
    setTimeout(function(){injectVs();injectQuote();injectLimit();}, 1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1500);
})();
