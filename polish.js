(function(){
  var ICONS={
    skin:'<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="16" r="8" stroke="#9b7bff" stroke-width="2.2"/><path d="M12 40c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#9b7bff" stroke-width="2.2" stroke-linecap="round"/></svg>',
    status:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 6l3.5 10.5H38l-8.5 6.5 3.2 10.5L24 27.5 15.3 33.5l3.2-10.5L10 16.5h10.5L24 6z" stroke="#ffbf69" stroke-width="2.2"/></svg>',
    group:'<svg viewBox="0 0 48 48" fill="none"><circle cx="16" cy="16" r="5.5" stroke="#66dfc4" stroke-width="2"/><circle cx="32" cy="16" r="5.5" stroke="#66dfc4" stroke-width="2"/><circle cx="24" cy="30" r="5.5" stroke="#66dfc4" stroke-width="2"/></svg>',
    auto:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 8v32M16 16l8-8 8 8" stroke="#9b7bff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    compet:'<svg viewBox="0 0 48 48" fill="none"><path d="M10 34l8-16 6 10 6-14 8 20" stroke="#00ff9c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    related:'<svg viewBox="0 0 48 48" fill="none"><path d="M14 24c0-6 4-10 10-10s10 4 10 10-4 10-10 10" stroke="#66dfc4" stroke-width="2.2"/><path d="M24 14v20" stroke="#66dfc4" stroke-width="2.2"/></svg>',
    coin:'<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke="#ffbf69" stroke-width="2.2"/><path d="M20 18h8c2 0 4 1.5 4 4s-2 4-4 4h-8m0 0h9c2 0 4 1.5 4 4s-2 4-4 4h-9M24 14v4m0 16v4" stroke="#ffbf69" stroke-width="2" stroke-linecap="round"/></svg>',
    spark:'<svg viewBox="0 0 48 48" fill="none"><path d="M24 6v10M24 32v10M6 24h10M32 24h10M12 12l7 7M29 29l7 7M36 12l-7 7M19 29l-7 7" stroke="#00ff9c" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function ico(name){
    return '<div class="pv-ico" aria-hidden="true">'+ (ICONS[name]||ICONS.spark) +'</div>';
  }

  function strip(items){
    return '<div class="pv-strip" aria-hidden="true">'+ items.map(function(it){
      return '<div class="pv-tile" style="--pv-a:'+it.c+'"><div class="g">'+ICONS[it.i]+'</div><div class="t">'+it.t+'</div><div class="l">'+it.l+'</div></div>';
    }).join('') +'</div>';
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

  function enhance(){
    var s0=document.getElementById('s0');
    if(s0 && !s0.querySelector('.hero-plate')){
      var meta=s0.querySelector('.h-meta');
      if(meta) meta.insertAdjacentHTML('beforebegin', hero());
      else {
        var btns=s0.querySelector('.h-btns');
        if(btns) btns.insertAdjacentHTML('afterend', hero());
      }
    }

    var s1=document.getElementById('s1');
    if(s1 && !s1.querySelector('.pv-strip')){
      var host=s1.querySelector('.co') || s1.querySelector('.g') || s1;
      var html=strip([
        {t:'Стиль',l:'Автономия',i:'skin',c:'rgba(155,123,255,.25)'},
        {t:'Статус',l:'Компетентность',i:'status',c:'rgba(255,191,105,.22)'},
        {t:'Круг',l:'Связанность',i:'group',c:'rgba(102,223,196,.22)'}
      ]);
      if(host.classList && host.classList.contains('co')) host.insertAdjacentHTML('beforebegin', html);
      else host.insertAdjacentHTML('afterbegin', html);
    }

    var s3=document.getElementById('s3');
    if(s3 && !s3.querySelector('.pv-strip')){
      var box=s3.querySelector('.g')||s3;
      box.insertAdjacentHTML('afterbegin', strip([
        {t:'Автономия',l:'Выбор стиля',i:'auto',c:'rgba(155,123,255,.25)'},
        {t:'Компетентность',l:'Редкость',i:'compet',c:'rgba(0,255,156,.2)'},
        {t:'Связанность',l:'Сообщество',i:'related',c:'rgba(102,223,196,.22)'}
      ]));
    }

    var s13=document.getElementById('s13');
    if(s13 && !s13.querySelector('.pv-strip')){
      var b=s13.querySelector('.g')||s13;
      b.insertAdjacentHTML('afterbegin', strip([
        {t:'Выражение',l:'Кто я',i:'skin',c:'rgba(155,123,255,.25)'},
        {t:'Статус',l:'Как меня видят',i:'status',c:'rgba(255,191,105,.22)'},
        {t:'Принадлежность',l:'С кем я',i:'group',c:'rgba(102,223,196,.22)'}
      ]));
    }

    var s20=document.getElementById('s20');
    if(s20 && !s20.querySelector('.pv-strip')){
      var c=s20.querySelector('.g')||s20;
      c.insertAdjacentHTML('afterbegin', strip([
        {t:'Значение',l:'Не урон',i:'spark',c:'rgba(0,255,156,.22)'},
        {t:'Смысл',l:'Идентичность',i:'skin',c:'rgba(155,123,255,.25)'},
        {t:'Ценность',l:'Социальный слой',i:'coin',c:'rgba(255,191,105,.22)'}
      ]));
    }

    ['s1','s3','s4','s11','s13','s14','s17','s18'].forEach(function(id){
      var sec=document.getElementById(id);
      if(!sec) return;
      var cards=sec.querySelectorAll('.card,.sdt');
      var names=['skin','status','group','auto','compet','related','coin','spark'];
      cards.forEach(function(card,i){
        if(card.querySelector('.pv-ico')) return;
        var first=card.firstElementChild;
        if((first && (first.tagName==='H3' || first.tagName==='H4')) || (first && first.classList && first.classList.contains('t'))){
          card.insertAdjacentHTML('afterbegin', ico(names[i%names.length]));
        } else if(!card.querySelector('svg')){
          card.insertAdjacentHTML('afterbegin', ico(names[i%names.length]));
        }
      });
    });

    document.querySelectorAll('.screen').forEach(function(sec){
      if(sec.querySelector('.pv-orb')) return;
      sec.style.position = sec.style.position || 'relative';
      sec.insertAdjacentHTML('beforeend', '<div class="pv-orb a" aria-hidden="true"></div><div class="pv-orb b" aria-hidden="true"></div>');
    });

    document.querySelectorAll('.screen h1, .screen h2').forEach(function(h){
      if(h.nextElementSibling && h.nextElementSibling.classList.contains('pv-accent')) return;
      if(h.closest('#s0')) return;
      h.insertAdjacentHTML('afterend', accent());
    });
  }

  function replayMotion(sec){
    if(!sec || (window.Env && Env.RM)) return;
    sec.querySelectorAll('.h-pre,.h-sub,.h-q,.h-btns,.h-meta,.h-t b,.hero-plate,.pv-tile').forEach(function(el){
      el.style.animation='none';
      void el.offsetWidth;
      el.style.animation='';
    });
  }

  function wrapPlay(){
    var _play=window.play;
    if(typeof _play==='function' && !_play.__pv){
      window.play=function(sec){
        try{replayMotion(sec);}catch(e){}
        return _play.apply(this,arguments);
      };
      window.play.__pv=1;
    }
  }

  function boot(){
    try{enhance();}catch(e){console.warn('pv enhance',e)}
    wrapPlay();
    setTimeout(wrapPlay, 500);
    setTimeout(wrapPlay, 1500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
