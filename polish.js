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

  function ico(name){
    return '<div class="pv-ico" aria-hidden="true">'+(ICONS[name]||ICONS.spark)+'</div>';
  }

  function iconRow(names, colors){
    colors = colors || ['rgba(155,123,255,.28)','rgba(255,191,105,.24)','rgba(102,223,196,.24)'];
    return '<div class="pv-icons" aria-hidden="true">'+names.map(function(n,i){
      return '<div class="pv-icon-cell" style="--pv-a:'+colors[i%colors.length]+'">'+(ICONS[n]||ICONS.spark)+'</div>';
    }).join('')+'</div>';
  }

  function plate(kind){
    var plates={
      identity:'<figure class="pv-plate" aria-hidden="true"><svg viewBox="0 0 420 200" fill="none">'+
        '<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9b7bff"/><stop offset="1" stop-color="#66dfc4"/></linearGradient>'+
        '<radialGradient id="r1" cx=".4" cy=".3" r=".7"><stop stop-color="#9b7bff" stop-opacity=".4"/><stop offset="1" stop-color="transparent"/></radialGradient></defs>'+
        '<rect width="420" height="200" rx="16" fill="#0a0c12"/>'+
        '<ellipse cx="280" cy="90" rx="110" ry="70" fill="url(#r1)"/>'+
        '<circle cx="120" cy="80" r="36" stroke="url(#g1)" stroke-width="2.2" fill="rgba(155,123,255,.08)"/>'+
        '<path d="M78 150c6-40 22-58 42-58s36 18 42 58" stroke="url(#g1)" stroke-width="2.2" fill="rgba(155,123,255,.06)"/>'+
        '<path d="M250 55l10 28h30l-24 18 9 28-25-17-25 17 9-28-24-18h30z" fill="rgba(255,191,105,.12)" stroke="#ffbf69" stroke-width="1.5"/>'+
        '<circle cx="300" cy="145" r="11" stroke="#66dfc4" stroke-width="1.6"/><circle cx="328" cy="145" r="11" stroke="#66dfc4" stroke-width="1.6"/><circle cx="314" cy="168" r="11" stroke="#66dfc4" stroke-width="1.6"/>'+
        '<text x="24" y="188" fill="rgba(255,255,255,.3)" font-family="ui-monospace,monospace" font-size="10" letter-spacing="2.5">IDENTITY · SIGNAL · VALUE</text></svg></figure>',
      theory:'<figure class="pv-plate" aria-hidden="true"><svg viewBox="0 0 420 200" fill="none">'+
        '<defs><linearGradient id="g2" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#9b7bff"/><stop offset="1" stop-color="#00ff9c"/></linearGradient></defs>'+
        '<rect width="420" height="200" rx="16" fill="#0a0c12"/>'+
        '<circle cx="110" cy="100" r="48" stroke="rgba(155,123,255,.35)" stroke-width="1.5" stroke-dasharray="5 7"/>'+
        '<circle cx="110" cy="100" r="32" stroke="#9b7bff" stroke-width="2" fill="rgba(155,123,255,.07)"/>'+
        '<text x="98" y="105" fill="#c3adff" font-size="12" font-family="ui-monospace,monospace">SDT</text>'+
        '<path d="M170 100h40" stroke="rgba(255,255,255,.2)" stroke-width="1.5" stroke-dasharray="4 4"/>'+
        '<rect x="220" y="48" width="150" height="34" rx="8" fill="rgba(155,123,255,.1)" stroke="#9b7bff" stroke-width="1.4"/>'+
        '<text x="236" y="70" fill="#c3adff" font-size="11" font-family="system-ui">Автономия</text>'+
        '<rect x="220" y="92" width="150" height="34" rx="8" fill="rgba(0,255,156,.08)" stroke="#00ff9c" stroke-width="1.4"/>'+
        '<text x="236" y="114" fill="#8dffc9" font-size="11" font-family="system-ui">Компетентность</text>'+
        '<rect x="220" y="136" width="150" height="34" rx="8" fill="rgba(102,223,196,.08)" stroke="#66dfc4" stroke-width="1.4"/>'+
        '<text x="236" y="158" fill="#9df0de" font-size="11" font-family="system-ui">Связанность</text></svg></figure>',
      data:'<figure class="pv-plate" aria-hidden="true"><svg viewBox="0 0 420 200" fill="none">'+
        '<rect width="420" height="200" rx="16" fill="#0a0c12"/>'+
        '<path d="M40 160 V90 M80 160 V60 M120 160 V110 M160 160 V45 M200 160 V75 M240 160 V95 M280 160 V55 M320 160 V120 M360 160 V70" stroke="rgba(155,123,255,.45)" stroke-width="10" stroke-linecap="round"/>'+
        '<path d="M40 90 L80 60 L120 110 L160 45 L200 75 L240 95 L280 55 L320 120 L360 70" stroke="#00ff9c" stroke-width="2" fill="none" stroke-linejoin="round"/>'+
        '<circle cx="160" cy="45" r="5" fill="#00ff9c"/><circle cx="280" cy="55" r="5" fill="#00ff9c"/>'+
        '<text x="24" y="188" fill="rgba(255,255,255,.3)" font-family="ui-monospace,monospace" font-size="10" letter-spacing="2">n = 18 · SELF-REPORT</text></svg></figure>',
      insight:'<figure class="pv-plate" aria-hidden="true"><svg viewBox="0 0 420 200" fill="none">'+
        '<defs><radialGradient id="r3" cx=".5" cy=".45" r=".55"><stop stop-color="#00ff9c" stop-opacity=".25"/><stop offset="1" stop-color="transparent"/></radialGradient></defs>'+
        '<rect width="420" height="200" rx="16" fill="#0a0c12"/><ellipse cx="210" cy="95" rx="130" ry="80" fill="url(#r3)"/>'+
        '<path d="M210 40c-28 0-48 20-48 48 0 20 10 34 24 42v18h48v-18c14-8 24-22 24-42 0-28-20-48-48-48z" stroke="#00ff9c" stroke-width="2.2" fill="rgba(0,255,156,.06)"/>'+
        '<path d="M192 158h36M198 172h24" stroke="#00ff9c" stroke-width="2" stroke-linecap="round"/>'+
        '<circle cx="120" cy="70" r="3" fill="#9b7bff"/><circle cx="300" cy="60" r="2.5" fill="#ffbf69"/><circle cx="310" cy="130" r="3" fill="#66dfc4"/>'+
        '<text x="24" y="188" fill="rgba(255,255,255,.3)" font-family="ui-monospace,monospace" font-size="10" letter-spacing="2">MEANING · NOT DAMAGE</text></svg></figure>',
      ethics:'<figure class="pv-plate" aria-hidden="true"><svg viewBox="0 0 420 200" fill="none">'+
        '<rect width="420" height="200" rx="16" fill="#0a0c12"/>'+
        '<path d="M210 36l70 28v48c0 42-28 72-70 82-42-10-70-40-70-82V64l70-28z" stroke="#00ff9c" stroke-width="2.2" fill="rgba(0,255,156,.06)"/>'+
        '<path d="M178 108l18 18 36-40" stroke="#00ff9c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<circle cx="90" cy="150" r="18" stroke="#ff7d91" stroke-width="1.5" fill="rgba(255,125,145,.08)"/>'+
        '<text x="84" y="154" fill="#ff7d91" font-size="14" font-family="system-ui">$</text>'+
        '<text x="24" y="188" fill="rgba(255,255,255,.3)" font-family="ui-monospace,monospace" font-size="10" letter-spacing="2">TRANSPARENCY · CARE</text></svg></figure>',
      mono:'<figure class="pv-plate" aria-hidden="true"><svg viewBox="0 0 420 200" fill="none">'+
        '<rect width="420" height="200" rx="16" fill="#0a0c12"/>'+
        '<rect x="50" y="50" width="140" height="100" rx="12" fill="rgba(255,125,145,.08)" stroke="#ff7d91" stroke-width="1.6"/>'+
        '<text x="78" y="108" fill="#ff7d91" font-size="14" font-family="system-ui" font-weight="600">Pay-to-Win</text>'+
        '<rect x="230" y="50" width="140" height="100" rx="12" fill="rgba(155,123,255,.08)" stroke="#9b7bff" stroke-width="1.6"/>'+
        '<text x="258" y="108" fill="#c3adff" font-size="14" font-family="system-ui" font-weight="600">Cosmetic</text>'+
        '<path d="M200 100h20" stroke="rgba(255,255,255,.25)" stroke-width="2"/>'+
        '<text x="24" y="188" fill="rgba(255,255,255,.3)" font-family="ui-monospace,monospace" font-size="10" letter-spacing="2">TWO MONETIZATION LAYERS</text></svg></figure>'
    };
    return plates[kind]||'';
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

  function accent(){ return '<div class="pv-accent" aria-hidden="true"></div>'; }

  var SLIDE_ICONS={
    s2:['quest','theory','insight'],
    s5:['method','data','limit'],
    s6:['data','compet','group'],
    s7:['coin','skin','status'],
    s9:['status','coin','compet'],
    s10:['group','related','skin'],
    s12:['insight','spark','skin'],
    s15:['cycle','spark','coin'],
    s16:['voice','group','insight'],
    s19:['limit','method','data'],
    s21:['source','theory','insight'],
    s22:['source','ethics','data']
  };

  var SLIDE_PLATES={
    s1:'identity', s3:'theory', s4:'identity', s6:'data', s7:'data',
    s11:'theory', s12:'insight', s14:'mono', s17:'ethics', s20:'insight'
  };

  var CARD_ICONS={
    s1:['skin','status','group'],
    s3:['auto','compet','related'],
    s4:['skin','insight','status'],
    s8:['skin','status','group'],
    s11:['auto','compet','related'],
    s13:['skin','status','group'],
    s14:['mono','skin','ethics'],
    s17:['ethics','mono','limit'],
    s18:['design','ethics','skin']
  };

  function enhance(){
    document.querySelectorAll('.pv-strip').forEach(function(el){ el.remove(); });

    var s0=document.getElementById('s0');
    if(s0 && !s0.querySelector('.hero-plate')){
      var meta=s0.querySelector('.h-meta');
      if(meta) meta.insertAdjacentHTML('beforebegin', hero());
      else {
        var btns=s0.querySelector('.h-btns');
        if(btns) btns.insertAdjacentHTML('afterend', hero());
      }
    }

    Object.keys(SLIDE_PLATES).forEach(function(id){
      var sec=document.getElementById(id);
      if(!sec || sec.querySelector('.pv-plate')) return;
      var html=plate(SLIDE_PLATES[id]);
      if(!html) return;
      var hd=sec.querySelector('.hd');
      var tt=sec.querySelector('.tt, h1');
      var fit=sec.querySelector('.fitbox');
      if(tt) tt.insertAdjacentHTML('afterend', html);
      else if(hd) hd.insertAdjacentHTML('afterend', html);
      else if(fit) fit.insertAdjacentHTML('afterbegin', html);
    });

    Object.keys(SLIDE_ICONS).forEach(function(id){
      var sec=document.getElementById(id);
      if(!sec || sec.querySelector('.pv-icons')) return;
      var html=iconRow(SLIDE_ICONS[id]);
      var co=sec.querySelector('.co');
      var g=sec.querySelector('.g');
      var host=sec.querySelector('.fitbox') || sec;
      if(co) co.insertAdjacentHTML('beforebegin', html);
      else if(g) g.insertAdjacentHTML('beforebegin', html);
      else host.insertAdjacentHTML('beforeend', html);
    });

    Object.keys(CARD_ICONS).forEach(function(id){
      var sec=document.getElementById(id);
      if(!sec) return;
      var cards=sec.querySelectorAll('.card,.sdt');
      var names=CARD_ICONS[id];
      cards.forEach(function(card,i){
        if(card.querySelector('.pv-ico')) return;
        card.insertAdjacentHTML('afterbegin', ico(names[i%names.length]));
      });
    });

    document.querySelectorAll('.screen').forEach(function(sec){
      if(sec.id==='s0') return;
      if(sec.querySelector('.pv-orb')) return;
      sec.style.position = sec.style.position || 'relative';
      sec.insertAdjacentHTML('beforeend',
        '<div class="pv-orb a" aria-hidden="true"></div>'+
        '<div class="pv-orb b" aria-hidden="true"></div>'+
        '<div class="pv-orb c" aria-hidden="true"></div>');
    });

    document.querySelectorAll('.screen h1.tt, .screen .tt').forEach(function(h){
      if(h.nextElementSibling && (h.nextElementSibling.classList.contains('pv-accent')||h.nextElementSibling.classList.contains('pv-plate'))) return;
      if(h.closest('#s0')) return;
      h.insertAdjacentHTML('afterend', accent());
    });

    var top=document.querySelector('.top');
    if(top) top.classList.add('pv-chrome');
    document.querySelectorAll('.btn').forEach(function(b){ b.classList.add('pv-btn'); });
  }

  function forceReveal(sec){
    if(!sec) return;
    sec.querySelectorAll('.rv,.rvl,.rvr,.rvs,.rvc,.sweep').forEach(function(el){
      el.classList.remove('in');
      void el.offsetWidth;
      el.classList.add('in');
    });
    sec.querySelectorAll('.pv-icon-cell,.hero-plate,.pv-ico,.pv-plate').forEach(function(el){
      el.style.animation='none';
      void el.offsetWidth;
      el.style.animation='';
    });
  }

  function wrapPlay(){
    var _play=window.play;
    if(typeof _play==='function' && !_play.__pv){
      window.play=function(sec){
        try{ forceReveal(sec); }catch(e){}
        var r=_play.apply(this,arguments);
        try{ forceReveal(sec); }catch(e){}
        return r;
      };
      window.play.__pv=1;
    }
    var _go=window.go;
    if(typeof _go==='function' && !_go.__pv){
      window.go=function(){
        var r=_go.apply(this,arguments);
        setTimeout(function(){
          var on=document.querySelector('.screen.on')||document.querySelector('.screen[aria-hidden="false"]');
          forceReveal(on);
        },80);
        return r;
      };
      window.go.__pv=1;
    }
  }

  function boot(){
    try{ enhance(); }catch(e){ console.warn('pv enhance',e); }
    wrapPlay();
    setTimeout(wrapPlay, 400);
    setTimeout(wrapPlay, 1200);
    setTimeout(function(){
      var on=document.querySelector('.screen.on')||document.getElementById('s0');
      forceReveal(on);
    }, 600);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 800);
  setTimeout(boot, 2000);
})();
