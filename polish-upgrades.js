(function(){
  var N_BADGES={s6:{t:'n = 18 · все участники',k:'all'},s7:{t:'n = 18 · все участники',k:'all'},s8:{t:'n = 10 · только покупатели',k:'buyers'},s9:{t:'n = 10 · только покупатели',k:'buyers'},s10:{t:'n = 18 · все участники',k:'all'}};
  var SRC_FOOT={s6:'n = 18 · самоотчёт · описательная выборка',s7:'n = 18 · каждый квадрат = 1 участник',s8:'n = 10 покупателей · знаменатель не 18',s9:'n = 10 · мотивы среди покупателей',s10:'n = 18 · вопрос задавался всем, не только покупателям'};
  var tipEl=null;
  function ensureTip(){if(tipEl)return tipEl;tipEl=document.createElement('div');tipEl.className='pv-wtip';tipEl.style.display='none';document.body.appendChild(tipEl);return tipEl;}
  function wireWaffles(){
    document.querySelectorAll('.waffle i').forEach(function(cell){
      if(cell.__pvTip) return; cell.__pvTip=1;
      cell.addEventListener('mouseenter',function(){
        var t=ensureTip(); var label=cell.getAttribute('data-l')||'';
        if(!label||label==='—') return;
        t.textContent=label; t.style.display='block';
        var r=cell.getBoundingClientRect();
        t.style.left=(r.left+r.width/2)+'px'; t.style.top=(r.top-8)+'px'; t.style.transform='translate(-50%,-100%)';
      });
      cell.addEventListener('mouseleave',function(){ if(tipEl) tipEl.style.display='none'; });
    });
  }
  function buildChapterBar(){
    if(document.querySelector('.pv-chapters')) return;
    var CH=window.CHAPTERS||[{t:'Вопрос',i:2},{t:'Теория',i:3},{t:'Метод',i:5},{t:'Данные',i:6},{t:'Смысл',i:11},{t:'Монетизация',i:14},{t:'Голоса',i:16},{t:'Этика',i:17},{t:'Границы',i:19},{t:'Вывод',i:20},{t:'Источники',i:21}];
    var bar=document.createElement('div'); bar.className='pv-chapters'; bar.setAttribute('role','navigation'); bar.setAttribute('aria-label','Главы');
    CH.forEach(function(c){ var b=document.createElement('button'); b.type='button'; b.textContent=c.t; b.setAttribute('data-go',String(c.i));
      b.addEventListener('click',function(){ if(typeof window.go==='function') window.go(c.i); }); bar.appendChild(b); });
    document.body.appendChild(bar);
  }
  function syncChapters(){
    var bar=document.querySelector('.pv-chapters'); if(!bar) return;
    var on=document.querySelector('.screen.on')||document.querySelector('.screen[aria-hidden="false"]');
    var idx=on?parseInt(on.getAttribute('data-i')||'0',10):0;
    var CH=window.CHAPTERS||[]; var chIdx=-1;
    for(var i=0;i<CH.length;i++){ if(CH[i].i<=idx) chIdx=i; }
    bar.querySelectorAll('button').forEach(function(b,k){ b.classList.toggle('on',k===chIdx); b.classList.toggle('dn',k<chIdx); });
  }
  function enhanceTakeaway(){
    var s20=document.getElementById('s20'); if(!s20||s20.querySelector('.pv-take')) return;
    var html='<div class="pv-take" aria-label="Ключевые выводы"><article><b>01 · Сигнал</b><p>Платят за стиль и статус, а не за урон в бою.</p></article><article><b>02 · Друзья</b><p>Социальное влияние слабее, чем принято считать.</p></article><article><b>03 · Этика</b><p>Косметика ок, если прозрачно и без pay-to-win.</p></article></div>';
    var g=s20.querySelector('.g.g3'); var co=s20.querySelector('.co');
    if(g) g.insertAdjacentHTML('afterend',html); else if(co) co.insertAdjacentHTML('beforebegin',html);
    else { var box=s20.querySelector('.fitbox'); if(box) box.insertAdjacentHTML('beforeend',html); }
  }
  function injectBadges(){
    Object.keys(N_BADGES).forEach(function(id){
      var sec=document.getElementById(id); if(!sec||sec.querySelector('.pv-n')) return;
      var b=N_BADGES[id]; var tt=sec.querySelector('.tt, h1'); var hd=sec.querySelector('.hd');
      var html='<div class="pv-n '+b.k+'">'+b.t+'</div>';
      if(tt) tt.insertAdjacentHTML('afterend',html); else if(hd) hd.insertAdjacentHTML('afterend',html);
    });
    Object.keys(SRC_FOOT).forEach(function(id){
      var sec=document.getElementById(id); if(!sec||sec.querySelector('.pv-src')) return;
      var host=sec.querySelector('.fitbox')||sec;
      host.insertAdjacentHTML('beforeend','<div class="pv-src">'+SRC_FOOT[id]+'</div>');
    });
  }
  function run(){
    try{injectBadges();}catch(e){}
    try{enhanceTakeaway();}catch(e){}
    try{buildChapterBar();}catch(e){}
    try{wireWaffles();}catch(e){}
    try{syncChapters();}catch(e){}
  }
  function wrap(){
    if(typeof window.go==='function'&&!window.go.__pv15){
      var _g=window.go;
      window.go=function(){ var r=_g.apply(this,arguments); setTimeout(function(){run();syncChapters();},80); return r; };
      window.go.__pv15=1;
    }
    if(typeof window.play==='function'&&!window.play.__pv15){
      var _p=window.play;
      window.play=function(sec){ var r=_p.apply(this,arguments); setTimeout(run,80); return r; };
      window.play.__pv15=1;
    }
  }
  function boot(){ wrap(); run(); setTimeout(run,600); setTimeout(run,1400); setInterval(function(){wireWaffles();syncChapters();},2000); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  setTimeout(boot,800);
})();
