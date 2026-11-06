(function(){
  var ICONS={
    skin:'<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="16" r="8" stroke="#9b7bff" stroke-width="2.2"/><path d="M12 40c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#9b7bff" stroke-width="2.2" stroke-linecap="round"/></svg>',
    status:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 6l3.5 10.5H38l-8.5 6.5 3.2 10.5L24 27.5 15.3 33.5l3.2-10.5L10 16.5h10.5L24 6z" stroke="#ffbf69" stroke-width="2.2"/></svg>',
    group:'<svg viewBox="0 0 48 48" fill="none"><circle cx="16" cy="16" r="5.5" stroke="#66dfc4" stroke-width="2"/><circle cx="32" cy="16" r="5.5" stroke="#66dfc4" stroke-width="2"/><circle cx="24" cy="30" r="5.5" stroke="#66dfc4" stroke-width="2"/></svg>',
    auto:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 8v32M16 16l8-8 8 8" stroke="#9b7bff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    compet:'<svg viewBox="0 0 48 48" fill="none"><path d="M10 34l8-16 6 10 6-14 8 20" stroke="#00ff9c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    related:'<svg viewBox="0 0 48 48" fill="none"><path d="M14 24c0-6 4-10 10-10s10 4 10 10-4 10-10 10" stroke="#66dfc4" stroke-width="2.2"/><path d="M24 14v20" stroke="#66dfc4" stroke-width="2.2"/></svg>',
    coin:'<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke="#ffbf69" stroke-width="2.2"/><path d="M20 18h8c2 0 4 1.5 4 4s-2 4-4 4h-8m0 0h9c2 0 4 1.5 4 4s-2 4-4 4h-9M24 14v4m0 16v4" stroke="#ffbf69" stroke-width="2" stroke-linecap="round"/></svg>',
    spark:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 6v10M24 32v10M6 24h10M32 24h10M12 12l7 7M29 29l7 7M36 12l-7 7M19 29l-7 7" stroke="#00ff9c" stroke-width="2" stroke-linecap="round"/></svg>',
    quest:'<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="#00ff9c" stroke-width="2.2"/><path d="M18 20c0-3.5 2.5-6 6-6s6 2.5 6 6c0 2.5-1.5 4-3.5 5l-1 2.5M24 34v.5" stroke="#00ff9c" stroke-width="2.2" stroke-linecap="round"/></svg>',
    theory:'<svg viewBox="0 0 48 48" fill="none"><rect x="10" y="10" width="28" height="28" rx="4" stroke="#9b7bff" stroke-width="2"/><path d="M16 20h16M16 26h12M16 32h8" stroke="#9b7bff" stroke-width="2" stroke-linecap="round"/></svg>',
    method:'<svg viewBox="0 0 48 48" fill="none"><path d="M14 34V14h20v20H14z" stroke="#ffbf69" stroke-width="2"/><path d="M20 22h8M20 28h5" stroke="#ffbf69" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="16" r="3" fill="#ffbf69"/></svg>',
    data:'<svg viewBox="0 0 48 48" fill="none"><path d="M12 34V18l8 8 8-12 8 16" stroke="#9b7bff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 36h28" stroke="#9b7bff" stroke-width="2" stroke-linecap="round"/></svg>',
    insight:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 8c-6 0-10 4-10 10 0 4 2 7 5 9v4h10v-4c3-2 5-5 5-9 0-6-4-10-10-10z" stroke="#00ff9c" stroke-width="2.2"/><path d="M20 36h8M22 40h4" stroke="#00ff9c" stroke-width="2" stroke-linecap="round"/></svg>',
    ethics:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 8l14 6v10c0 9-6 16-14 18-8-2-14-9-14-18V14l14-6z" stroke="#00ff9c" stroke-width="2.2"/><path d="M18 24l4 4 8-9" stroke="#00ff9c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    limit:'<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke="#ffbf69" stroke-width="2.2"/><path d="M16 16l16 16M32 16L16 32" stroke="#ffbf69" stroke-width="2.2" stroke-linecap="round"/></svg>',
    source:'<svg viewBox="0 0 48 48" fill="none"><path d="M14 12h20v24H14z" stroke="#9b7bff" stroke-width="2"/><path d="M18 18h12M18 24h12M18 30h8" stroke="#9b7bff" stroke-width="1.8" stroke-linecap="round"/></svg>',
    mono:'<svg viewBox="0 0 48 48" fill="none"><rect x="12" y="14" width="24" height="20" rx="3" stroke="#ff7d91" stroke-width="2"/><path d="M18 22h12M18 28h8" stroke="#ff7d91" stroke-width="2" stroke-linecap="round"/></svg>',
    cycle:'<svg viewBox="0 0 48 48" fill="none"><path d="M14 24a10 10 0 0118-7M34 24a10 10 0 01-18 7" stroke="#ffbf69" stroke-width="2.2" stroke-linecap="round"/><path d="M30 12l2 5 5 1M18 36l-2-5-5-1" stroke="#ffbf69" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    design:'<svg viewBox="0 0 48 48" fill="none"><path d="M12 32l8-20 8 12 8-16" stroke="#66dfc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="12" r="3" fill="#66dfc4"/></svg>',
    voice:'<svg viewBox="0 0 48 48" fill="none"><path d="M16 20v8c0 4 3.5 8 8 8s8-4 8-8v-8" stroke="#9b7bff" stroke-width="2.2" stroke-linecap="round"/><path d="M14 22h4M30 22h4M24 12v6" stroke="#9b7bff" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function ico(n){return '<div class="pv-ico" aria-hidden="true">'+(ICONS[n]||ICONS.spark)+'</div>';}
  function iconRow(ns,cs){
    cs=cs||['rgba(155,123,255,.28)','rgba(255,191,105,.24)','rgba(102,223,196,.24)'];
    return '<div class="pv-icons" aria-hidden="true">'+ns.map(function(n,i){
      return '<div class="pv-icon-cell" style="--pv-a:'+cs[i%cs.length]+'">'+(ICONS[n]||ICONS.spark)+'</div>';
    }).join('')+'</div>';
  }
  function hero(){
    return '<figure class="hero-plate" aria-hidden="true"><svg viewBox="0 0 520 292" fill="none">'+
      '<defs><linearGradient id="hpG" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9b7bff"/><stop offset="1" stop-color="#00ff9c"/></linearGradient>'+
      '<radialGradient id="hpR" cx=".5" cy=".4" r=".6"><stop stop-color="#9b7bff" stop-opacity=".35"/><stop offset="1" stop-color="transparent"/></radialGradient></defs>'+
      '<rect width="520" height="292" fill="#0a0c12"/><ellipse cx="360" cy="120" rx="140" ry="90" fill="url(#hpR)"/>'+
      '<circle class="ring" cx="190" cy="110" r="52" stroke="rgba(155,123,255,.25)" stroke-width="1" stroke-dasharray="4 6"/>'+
      '<circle cx="190" cy="110" r="42" stroke="url(#hpG)" stroke-width="2.2" fill="rgba(255,255,255,.03)"/>'+
      '<path d="M130 230c8-48 28-72 60-72s52 24 60 72" stroke="url(#hpG)" stroke-width="2.2" fill="rgba(155,123,255,.06)"/>'+
      '<path d="M360 70l12 34h36l-29 22 11 34-30-21-30 21 11-34-29-22h36z" fill="rgba(255,191,105,.15)" stroke="#ffbf69" stroke-width="1.6"/>'+
      '<circle cx="320" cy="210" r="14" stroke="#66dfc4" stroke-width="1.8"/><circle cx="355" cy="210" r="14" stroke="#66dfc4" stroke-width="1.8"/><circle cx="338" cy="238" r="14" stroke="#66dfc4" stroke-width="1.8"/>'+
      '<text x="28" y="268" fill="rgba(255,255,255,.35)" font-family="ui-monospace,monospace" font-size="11" letter-spacing="3">STYLE · STATUS · BELONGING</text></svg></figure>';
  }
  function accent(){return '<div class="pv-accent" aria-hidden="true"></div>';}

  var SLIDE_ICONS={
    s2:['quest','theory','insight'],s5:['method','data','limit'],s9:['status','coin','compet'],
    s10:['group','related','skin'],s12:['insight','spark','skin'],s15:['cycle','spark','coin'],
    s16:['voice','group','insight'],s19:['limit','method','data'],s21:['source','theory','insight'],s22:['source','ethics','data']
  };
  var CARD_ICONS={
    s1:['skin','status','group'],s3:['auto','compet','related'],s4:['skin','insight','status'],
    s11:['auto','compet','related'],s13:['skin','status','group'],s14:['mono','skin','ethics'],
    s17:['ethics','mono','limit'],s18:['design','ethics','skin']
  };

  function fillBars(root){
    root=root||document;
    root.querySelectorAll('.br-f[data-v]').forEach(function(f,i){
      var v=parseFloat(f.getAttribute('data-v'));
      if(isNaN(v)) v=0;
      f.style.setProperty('--pv-w','0%');
      void f.offsetWidth;
      setTimeout(function(){
        f.style.setProperty('--pv-w', v+'%');
        f.style.setProperty('width', v+'%', 'important');
      }, 60+i*80);
    });
  }

  function glassWrap(){
    document.querySelectorAll('.bars[data-bars]').forEach(function(bars){
      if(bars.closest('.pv-chart-card')) return;
      var parent=bars.parentElement; if(!parent) return;
      var card=document.createElement('div');
      card.className='pv-chart-card';
      var big=parent.querySelector(':scope > .bigstat');
      if(big){ parent.insertBefore(card,big); card.appendChild(big); card.appendChild(bars); }
      else { bars.parentNode.insertBefore(card,bars); card.appendChild(bars); }
    });
  }

  function enhance(){
    document.querySelectorAll('.pv-strip').forEach(function(el){el.remove();});
    var s0=document.getElementById('s0');
    if(s0&&!s0.querySelector('.hero-plate')){
      var meta=s0.querySelector('.h-meta');
      if(meta) meta.insertAdjacentHTML('beforebegin',hero());
      else{ var btns=s0.querySelector('.h-btns'); if(btns) btns.insertAdjacentHTML('afterend',hero()); }
    }
    Object.keys(SLIDE_ICONS).forEach(function(id){
      var sec=document.getElementById(id);
      if(!sec||sec.querySelector('.pv-icons')) return;
      var html=iconRow(SLIDE_ICONS[id]);
      var co=sec.querySelector('.co'), g=sec.querySelector('.g'), host=sec.querySelector('.fitbox')||sec;
      if(co) co.insertAdjacentHTML('beforebegin',html);
      else if(g) g.insertAdjacentHTML('beforebegin',html);
      else host.insertAdjacentHTML('beforeend',html);
    });
    Object.keys(CARD_ICONS).forEach(function(id){
      var sec=document.getElementById(id); if(!sec) return;
      sec.querySelectorAll('.card,.sdt').forEach(function(c,i){
        if(c.querySelector('.pv-ico')) return;
        c.insertAdjacentHTML('afterbegin',ico(CARD_ICONS[id][i%CARD_ICONS[id].length]));
      });
    });
    document.querySelectorAll('.screen').forEach(function(sec){
      if(sec.id==='s0'||sec.querySelector('.pv-orb')) return;
      sec.style.position=sec.style.position||'relative';
      sec.insertAdjacentHTML('beforeend','<div class="pv-orb a" aria-hidden="true"></div><div class="pv-orb b" aria-hidden="true"></div><div class="pv-orb c" aria-hidden="true"></div>');
    });
    document.querySelectorAll('.screen h1.tt, .screen .tt').forEach(function(h){
      if(h.nextElementSibling&&h.nextElementSibling.classList.contains('pv-accent')) return;
      if(h.closest('#s0')) return;
      h.insertAdjacentHTML('afterend',accent());
    });
    var top=document.querySelector('.top'); if(top) top.classList.add('pv-chrome');
    document.querySelectorAll('.btn').forEach(function(b){b.classList.add('pv-btn');});
    try{glassWrap();}catch(e){}
  }

  function onSlide(sec){
    if(!sec) return;
    sec.querySelectorAll('.rv,.rvl,.rvr,.rvs').forEach(function(el){el.classList.add('in');});
    fillBars(sec);
    setTimeout(function(){fillBars(sec);},250);
    setTimeout(function(){fillBars(document);},500);
  }

  function wrapNav(){
    if(typeof window.play==='function'&&!window.play.__pv4){
      var _p=window.play;
      window.play=function(sec){var r=_p.apply(this,arguments);onSlide(sec);return r;};
      window.play.__pv4=1;
    }
    if(typeof window.go==='function'&&!window.go.__pv4){
      var _g=window.go;
      window.go=function(){
        var r=_g.apply(this,arguments);
        setTimeout(function(){
          onSlide(document.querySelector('.screen.on')||document.querySelector('.screen[aria-hidden="false"]'));
        },50);
        return r;
      };
      window.go.__pv4=1;
    }
  }

  function boot(){
    try{enhance();}catch(e){console.warn('pv',e);}
    wrapNav();
    setTimeout(wrapNav,400);
    [400,900,1600,2800].forEach(function(t){setTimeout(function(){fillBars(document);},t);});
    setInterval(function(){
      var on=document.querySelector('.screen.on')||document.querySelector('.screen[aria-hidden="false"]');
      if(on) fillBars(on);
    },2000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
  setTimeout(boot,700);
  setTimeout(boot,1600);
})();
