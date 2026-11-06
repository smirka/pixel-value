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

  function strip(items){
    return '<div class="pv-strip" aria-hidden="true">'+items.map(function(it){
      return '<div class="pv-tile" style="--pv-a:'+it.c+'"><div class="g">'+(ICONS[it.i]||ICONS.spark)+'</div><div class="t">'+it.t+'</div><div class="l">'+it.l+'</div></div>';
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

  function accent(){ return '<div class="pv-accent" aria-hidden="true"></div>'; }

  var SLIDE_FIGS={
    s1:[{i:'skin',t:'Стиль',l:'Автономия',c:'rgba(155,123,255,.25)'},{i:'status',t:'Статус',l:'Компетентность',c:'rgba(255,191,105,.22)'},{i:'group',t:'Круг',l:'Связанность',c:'rgba(102,223,196,.22)'}],
    s2:[{i:'quest',t:'Вопрос',l:'Мотивы',c:'rgba(0,255,156,.22)'},{i:'theory',t:'Рамка',l:'SDT',c:'rgba(155,123,255,.25)'},{i:'insight',t:'Гипотеза',l:'Смысл',c:'rgba(102,223,196,.22)'}],
    s3:[{i:'auto',t:'Автономия',l:'Выбор стиля',c:'rgba(155,123,255,.25)'},{i:'compet',t:'Компетентность',l:'Редкость',c:'rgba(0,255,156,.2)'},{i:'related',t:'Связанность',l:'Сообщество',c:'rgba(102,223,196,.22)'}],
    s4:[{i:'skin',t:'Предмет',l:'Скин',c:'rgba(102,223,196,.22)'},{i:'insight',t:'Смысл',l:'Я',c:'rgba(155,123,255,.25)'},{i:'status',t:'Образ',l:'Показ',c:'rgba(0,255,156,.2)'}],
    s5:[{i:'method',t:'Опрос',l:'n = 18',c:'rgba(255,191,105,.22)'},{i:'data',t:'Данные',l:'Самоотчёт',c:'rgba(155,123,255,.25)'},{i:'limit',t:'Границы',l:'Выборка',c:'rgba(255,125,145,.22)'}],
    s6:[{i:'data',t:'Активность',l:'Часы',c:'rgba(155,123,255,.25)'},{i:'compet',t:'Опыт',l:'Игры',c:'rgba(0,255,156,.2)'},{i:'group',t:'Социум',l:'Друзья',c:'rgba(102,223,196,.22)'}],
    s7:[{i:'coin',t:'Покупки',l:'Косметика',c:'rgba(255,191,105,.22)'},{i:'skin',t:'Скины',l:'Внешний вид',c:'rgba(155,123,255,.25)'},{i:'status',t:'Редкость',l:'Статус',c:'rgba(0,255,156,.2)'}],
    s8:[{i:'skin',t:'Мотив',l:'Выражение',c:'rgba(155,123,255,.25)'},{i:'status',t:'Мотив',l:'Статус',c:'rgba(255,191,105,.22)'},{i:'group',t:'Мотив',l:'Круг',c:'rgba(102,223,196,.22)'}],
    s9:[{i:'status',t:'Редкость',l:'Сигнал',c:'rgba(255,191,105,.22)'},{i:'coin',t:'Цена',l:'Восприятие',c:'rgba(0,255,156,.2)'},{i:'compet',t:'Опыт',l:'Узнаваемость',c:'rgba(155,123,255,.25)'}],
    s10:[{i:'group',t:'Друзья',l:'Влияние',c:'rgba(102,223,196,.22)'},{i:'related',t:'Команда',l:'Общее',c:'rgba(155,123,255,.25)'},{i:'skin',t:'Символ',l:'Принадлежность',c:'rgba(0,255,156,.2)'}],
    s11:[{i:'auto',t:'Автономия',l:'SDT',c:'rgba(155,123,255,.25)'},{i:'compet',t:'Компетентность',l:'SDT',c:'rgba(0,255,156,.2)'},{i:'related',t:'Связанность',l:'SDT',c:'rgba(102,223,196,.22)'}],
    s12:[{i:'insight',t:'Инсайт',l:'Смысл',c:'rgba(0,255,156,.22)'},{i:'spark',t:'Ценность',l:'Не урон',c:'rgba(155,123,255,.25)'},{i:'skin',t:'Я',l:'Ощущение',c:'rgba(102,223,196,.22)'}],
    s13:[{i:'skin',t:'Выражение',l:'Кто я',c:'rgba(155,123,255,.25)'},{i:'status',t:'Статус',l:'Как видят',c:'rgba(255,191,105,.22)'},{i:'group',t:'Принадлежность',l:'С кем я',c:'rgba(102,223,196,.22)'}],
    s14:[{i:'mono',t:'Pay-to-Win',l:'Преимущество',c:'rgba(255,125,145,.22)'},{i:'skin',t:'Косметика',l:'Внешность',c:'rgba(155,123,255,.25)'},{i:'ethics',t:'Честность',l:'Прозрачность',c:'rgba(0,255,156,.2)'}],
    s15:[{i:'cycle',t:'После',l:'Цикл',c:'rgba(255,191,105,.22)'},{i:'spark',t:'Эмоция',l:'Отклик',c:'rgba(0,255,156,.2)'},{i:'coin',t:'Повтор',l:'Покупка',c:'rgba(155,123,255,.25)'}],
    s16:[{i:'voice',t:'Голоса',l:'Реплики',c:'rgba(155,123,255,.25)'},{i:'group',t:'Игроки',l:'Опыт',c:'rgba(102,223,196,.22)'},{i:'insight',t:'Смысл',l:'Слова',c:'rgba(0,255,156,.2)'}],
    s17:[{i:'ethics',t:'Этика',l:'Ответственность',c:'rgba(0,255,156,.22)'},{i:'mono',t:'Цены',l:'Прозрачность',c:'rgba(255,125,145,.22)'},{i:'limit',t:'Защита',l:'Уязвимые',c:'rgba(255,191,105,.22)'}],
    s18:[{i:'design',t:'Дизайн',l:'Принципы',c:'rgba(102,223,196,.22)'},{i:'ethics',t:'Честность',l:'UX',c:'rgba(0,255,156,.2)'},{i:'skin',t:'Смысл',l:'Ценность',c:'rgba(155,123,255,.25)'}],
    s19:[{i:'limit',t:'Границы',l:'Выборка',c:'rgba(255,191,105,.22)'},{i:'method',t:'Метод',l:'Ограничения',c:'rgba(155,123,255,.25)'},{i:'data',t:'Данные',l:'Самоотчёт',c:'rgba(255,125,145,.22)'}],
    s20:[{i:'spark',t:'Значение',l:'Не урон',c:'rgba(0,255,156,.22)'},{i:'skin',t:'Смысл',l:'Идентичность',c:'rgba(155,123,255,.25)'},{i:'coin',t:'Ценность',l:'Соц. слой',c:'rgba(255,191,105,.22)'}],
    s21:[{i:'source',t:'Теория',l:'Источники',c:'rgba(155,123,255,.25)'},{i:'theory',t:'SDT',l:'Belk',c:'rgba(102,223,196,.22)'},{i:'insight',t:'Рамка',l:'Концепции',c:'rgba(0,255,156,.2)'}],
    s22:[{i:'source',t:'2025',l:'Материалы',c:'rgba(102,223,196,.22)'},{i:'ethics',t:'Регуляция',l:'ЕС',c:'rgba(0,255,156,.2)'},{i:'data',t:'Проверка',l:'DOI',c:'rgba(155,123,255,.25)'}]
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
    var s0=document.getElementById('s0');
    if(s0 && !s0.querySelector('.hero-plate')){
      var meta=s0.querySelector('.h-meta');
      if(meta) meta.insertAdjacentHTML('beforebegin', hero());
      else {
        var btns=s0.querySelector('.h-btns');
        if(btns) btns.insertAdjacentHTML('afterend', hero());
      }
    }

    Object.keys(SLIDE_FIGS).forEach(function(id){
      var sec=document.getElementById(id);
      if(!sec || sec.querySelector('.pv-strip')) return;
      var host=sec.querySelector('.fitbox') || sec.querySelector('.g') || sec;
      var items=SLIDE_FIGS[id];
      var html=strip(items);
      var co=sec.querySelector('.co');
      var g=sec.querySelector('.g');
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
      sec.insertAdjacentHTML('beforeend', '<div class="pv-orb a" aria-hidden="true"></div><div class="pv-orb b" aria-hidden="true"></div>');
    });

    document.querySelectorAll('.screen h1.tt, .screen .tt').forEach(function(h){
      if(h.nextElementSibling && h.nextElementSibling.classList.contains('pv-accent')) return;
      if(h.closest('#s0')) return;
      h.insertAdjacentHTML('afterend', accent());
    });
  }

  function forceReveal(sec){
    if(!sec) return;
    sec.querySelectorAll('.rv,.rvl,.rvr,.rvs,.rvc,.sweep').forEach(function(el){
      el.classList.remove('in');
      void el.offsetWidth;
      el.classList.add('in');
    });
    sec.querySelectorAll('.pv-tile,.hero-plate,.pv-ico').forEach(function(el){
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
