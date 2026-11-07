(function(){
  'use strict';
  var ASSET='assets/';
  var visualMap={
    s0:{src:'pv-avatar.svg',alt:'Авторская иллюстрация фантазийного игрового аватара'},
    s1:{src:'pv-avatar.svg',alt:'Авторская иллюстрация игрового аватара — визуальный образ и самовыражение',cards:['pv-avatar.svg','pv-rarity.svg','pv-community.svg']},
    s2:{src:'pv-inventory.svg',alt:'Коллекция трёх оригинальных игровых косметических предметов'},
    s3:{src:'pv-community.svg',alt:'Три игровых аватара объединены общим символом'},
    s4:{src:'pv-inventory.svg',alt:'Витрина цифровых предметов и коллекции'},
    s8:{src:'pv-avatar.svg',alt:'Визуальный образ цифровой идентичности'},
    s9:{src:'pv-rarity.svg',alt:'Стилизованный редкий предмет и корона как символ статуса'},
    s10:{src:'pv-community.svg',alt:'Связи между игроками и общие символы сообщества'},
    s13:{src:'pv-inventory.svg',alt:'Коллекция предметов разной визуальной редкости'},
    s14:{src:'pv-rarity.svg',alt:'Символическая ценность косметического предмета'},
    s15:{src:'pv-lifecycle.svg',alt:'Пять этапов жизненного цикла цифрового предмета'},
    s16:{src:'pv-community.svg',alt:'Игроки и общие символы сообщества'},
    s20:{src:'pv-avatar.svg',alt:'Игровой аватар как образ цифрового Я'}
  };
  function addImage(host,src,alt,cls){
    var fig=document.createElement('figure');
    fig.className=cls;
    var img=document.createElement('img');
    img.src=ASSET+src; img.alt=alt||''; img.loading='lazy'; img.decoding='async';
    fig.appendChild(img); host.appendChild(fig); return fig;
  }
  function addGameIdentity(){
    var cards=document.querySelectorAll('#s14 .game-example');
    var marks=[
      {label:'D2',name:'Dota 2',shape:'diamond'},
      {label:'CS',name:'Counter-Strike',shape:'grid'},
      {label:'V',name:'VALORANT',shape:'slash'},
      {label:'FN',name:'Fortnite',shape:'star'}
    ];
    cards.forEach(function(card,i){
      if(card.querySelector('.game-mark')) return;
      var item=marks[i]; if(!item) return;
      var mark=document.createElement('div');
      mark.className='game-mark game-mark--'+item.shape;
      mark.setAttribute('aria-hidden','true');
      mark.innerHTML='<span>'+item.label+'</span><i></i>';
      var name=card.querySelector('.game-name');
      if(name) card.insertBefore(mark,name); else card.insertBefore(mark,card.firstChild);
      card.setAttribute('data-game',item.name);
    });
  }
  function addCosmeticShowcase(){
    var sec=document.getElementById('s13');
    if(!sec||sec.querySelector('.pv-cosmetic-strip')) return;
    var cards=sec.querySelectorAll('.fitbox .g3 .card');
    if(!cards.length) return;
    var strip=document.createElement('div');
    strip.className='pv-cosmetic-strip rv';
    strip.setAttribute('aria-label','Примеры нейтральных игровых косметических образов');
    strip.innerHTML=
      '<div class="pv-cosmetic pv-cosmetic--outfit"><span class="pv-cosmetic-art"><i></i><b></b></span><span><small>ОБРАЗ</small><strong>Персонаж и стиль</strong></span></div>'+
      '<div class="pv-cosmetic pv-cosmetic--aura"><span class="pv-cosmetic-art"><i></i><b></b></span><span><small>ЭФФЕКТ</small><strong>Аура и визуальные эффекты</strong></span></div>'+
      '<div class="pv-cosmetic pv-cosmetic--badge"><span class="pv-cosmetic-art"><i></i><b></b></span><span><small>ПРОФИЛЬ</small><strong>Значок и оформление</strong></span></div>';
    var parent=cards[0].parentNode;
    parent.insertBefore(strip,cards[0]);
  }
  function installStyles(){
    if(document.getElementById('pv-polish-v24')) return;
    var style=document.createElement('style'); style.id='pv-polish-v24';
    style.textContent=
      '.game-example{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(255,255,255,.10)!important;border-radius:15px!important;background:linear-gradient(145deg,rgba(34,39,60,.94),rgba(12,15,25,.98))!important;box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 12px 24px rgba(0,0,0,.26),0 24px 44px rgba(0,0,0,.16);transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s,border-color .35s;padding-top:12px!important}'+
      '.game-example:before{content:"";position:absolute;z-index:-1;inset:0;background:radial-gradient(90% 70% at 12% 0%,color-mix(in srgb,var(--game-ac) 24%,transparent),transparent 70%)}'+
      '.game-example:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--game-ac) 65%,white 8%)!important;box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 18px 34px rgba(0,0,0,.38)}'+
      '.game-mark{height:46px;width:46px;border-radius:13px;display:grid;place-items:center;position:relative;overflow:hidden;margin:0 0 10px;background:linear-gradient(145deg,color-mix(in srgb,var(--game-ac) 34%,#20263a),#0d111c);border:1px solid color-mix(in srgb,var(--game-ac) 58%,transparent);box-shadow:0 5px 18px color-mix(in srgb,var(--game-ac) 18%,transparent),0 1px 0 rgba(255,255,255,.16) inset}'+
      '.game-mark span{font:800 16px/1 Inter,system-ui,sans-serif;letter-spacing:-.06em;color:#fff;text-shadow:0 2px 12px var(--game-ac);z-index:2}'+
      '.game-mark i{position:absolute;width:26px;height:26px;border:1px solid color-mix(in srgb,var(--game-ac) 70%,white);transform:rotate(45deg);opacity:.55}'+
      '.game-mark--diamond i{border-radius:5px;box-shadow:0 0 16px var(--game-ac)}'+
      '.game-mark--grid i{transform:none;border-radius:3px;background:repeating-linear-gradient(0deg,transparent 0 5px,color-mix(in srgb,var(--game-ac) 45%,transparent) 6px),repeating-linear-gradient(90deg,transparent 0 5px,color-mix(in srgb,var(--game-ac) 45%,transparent) 6px)}'+
      '.game-mark--slash i{width:9px;height:38px;transform:rotate(24deg);border-width:0 2px;background:var(--game-ac);opacity:.5}'+
      '.game-mark--star i{border-radius:50%;width:34px;height:34px;border-style:dashed}'+
      '.game-name{font-size:clamp(12px,1.5vw,17px)!important;letter-spacing:.02em}'+
      '.game-kind{display:inline-flex!important;margin-top:8px;padding:4px 8px;border-radius:999px;background:color-mix(in srgb,var(--game-ac) 12%,transparent);border:1px solid color-mix(in srgb,var(--game-ac) 30%,transparent)}'+
      '.pv-cosmetic-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 14px;position:relative;z-index:3}'+
      '.pv-cosmetic{display:flex;align-items:center;gap:11px;min-width:0;padding:9px 12px;border-radius:13px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(145deg,rgba(31,36,55,.9),rgba(11,14,23,.94));box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 9px 20px rgba(0,0,0,.2)}'+
      '.pv-cosmetic-art{width:42px;height:42px;flex:0 0 42px;position:relative;border-radius:12px;display:block;overflow:hidden;background:radial-gradient(circle at 50% 38%,color-mix(in srgb,var(--pv-ac) 40%,transparent),transparent 70%),linear-gradient(145deg,#252b40,#101522);border:1px solid color-mix(in srgb,var(--pv-ac) 45%,transparent);box-shadow:0 5px 15px color-mix(in srgb,var(--pv-ac) 14%,transparent)}'+
      '.pv-cosmetic-art i{position:absolute;left:13px;top:6px;width:16px;height:16px;border-radius:50%;background:linear-gradient(145deg,var(--pv-ac),#f4f1ff);box-shadow:0 0 12px var(--pv-ac)}'+
      '.pv-cosmetic-art b{position:absolute;left:9px;bottom:-7px;width:25px;height:27px;border-radius:12px 12px 7px 7px;background:linear-gradient(145deg,var(--pv-ac),#1a2033);border:1px solid rgba(255,255,255,.25)}'+
      '.pv-cosmetic--outfit{--pv-ac:#9b7bff}.pv-cosmetic--aura{--pv-ac:#66dfc4}.pv-cosmetic--badge{--pv-ac:#ffbf69}'+
      '.pv-cosmetic--aura .pv-cosmetic-art:after{content:"";position:absolute;inset:4px;border:1px dashed var(--pv-ac);border-radius:50%;animation:pvOrbit 9s linear infinite}'+
      '.pv-cosmetic--badge .pv-cosmetic-art i{width:19px;height:19px;left:11px;top:10px;border-radius:5px;transform:rotate(45deg)}'+
      '.pv-cosmetic>span:last-child{display:flex;flex-direction:column;gap:3px;min-width:0}'+
      '.pv-cosmetic small{font:9px/1.2 "JetBrains Mono",monospace;letter-spacing:.16em;color:var(--pv-ac)}'+
      '.pv-cosmetic strong{font-size:clamp(10px,1.15vw,13px);line-height:1.25;color:var(--text);font-weight:650}'+
      '@keyframes pvOrbit{to{transform:rotate(360deg)}}'+
      '.card,.kpi,.sdt,.cmp-s,.tlstep,.eth,.vc{box-shadow:0 1px 0 rgba(255,255,255,.065) inset,0 5px 12px rgba(0,0,0,.22),0 18px 36px rgba(0,0,0,.18);transform:translateZ(0)}'+
      '.card:hover,.kpi:hover,.sdt:hover{transform:translateY(-3px);box-shadow:0 1px 0 rgba(255,255,255,.1) inset,0 9px 18px rgba(0,0,0,.32),0 24px 42px rgba(0,0,0,.25)}'+
      '.br-t{overflow:hidden!important;position:relative!important;background:rgba(255,255,255,.075)!important;border:1px solid rgba(255,255,255,.08);border-radius:999px!important;box-shadow:0 1px 3px rgba(0,0,0,.35) inset}'+
      '.br-f{display:block!important;height:100%!important;min-height:6px!important;width:0;max-width:100%;border-radius:999px!important;background:linear-gradient(90deg,var(--ac,var(--purple)),var(--ac2,var(--teal)))!important;box-shadow:0 0 12px color-mix(in srgb,var(--ac,var(--purple)) 35%,transparent),0 1px 0 rgba(255,255,255,.3) inset;transform:none!important;opacity:1!important;transition:width 1s cubic-bezier(.16,1,.3,1)!important}'+
      '.pv-visual-layer img,.pv-card-visual img{filter:drop-shadow(0 18px 26px rgba(0,0,0,.42)) saturate(1.08)}'+
      '.pv-card-visual{border:1px solid rgba(255,255,255,.08);background:radial-gradient(ellipse at 50% 60%,rgba(155,123,255,.18),transparent 72%),linear-gradient(145deg,rgba(255,255,255,.035),rgba(0,0,0,.08));box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 10px 24px rgba(0,0,0,.18)}'+
      '@media(max-width:800px){.pv-cosmetic-strip{grid-template-columns:1fr;gap:7px}.pv-cosmetic{padding:7px 9px}.pv-cosmetic-art{width:36px;height:36px;flex-basis:36px}.game-mark{width:38px;height:38px}.game-mark span{font-size:14px}}'+
      '@media(prefers-reduced-motion:reduce){.pv-cosmetic--aura .pv-cosmetic-art:after{animation:none}.game-example,.card,.kpi,.sdt{transition:none}}';
    document.head.appendChild(style);
  }
  function installFavicon(){
    var link=document.querySelector('link[rel~="icon"]');
    if(!link){link=document.createElement('link');link.rel='icon';document.head.appendChild(link);}
    link.type='image/svg+xml'; link.href=ASSET+'pv-favicon.svg';
    var shortcut=document.querySelector('link[rel="shortcut icon"]');
    if(!shortcut){shortcut=document.createElement('link');shortcut.rel='shortcut icon';shortcut.href=ASSET+'pv-favicon.svg';document.head.appendChild(shortcut);}
  }
  function fixBars(){
    document.querySelectorAll('.br-f[data-v]').forEach(function(bar){
      var v=parseFloat(bar.getAttribute('data-v'));
      if(!isFinite(v)) return;
      v=Math.max(0,Math.min(100,v));
      bar.style.setProperty('width',v+'%','important');
      bar.style.setProperty('transform','none','important');
      bar.style.setProperty('opacity','1','important');
    });
  }
  function updateYear(){
    var footer=document.querySelector('.ftnote span:first-child');
    if(footer) footer.textContent=footer.textContent.replace(/©\s*20\d{2}/,'© 2026');
    document.querySelectorAll('[data-year]').forEach(function(el){el.textContent='2026';});
  }
  function decorate(){
    Object.keys(visualMap).forEach(function(id){
      var sec=document.getElementById(id),spec=visualMap[id];
      if(!sec||sec.querySelector('.pv-visual-layer')) return;
      var box=sec.querySelector('.fitbox'); if(!box) return;
      var fig=addImage(box,spec.src,spec.alt,'pv-visual-layer'); fig.setAttribute('aria-hidden','true');
      if(id==='s20') fig.classList.add('pv-visual-layer--closing');
      if(id==='s0') fig.classList.add('pv-visual-layer--hero');
    });
    [['s1',['pv-avatar.svg','pv-rarity.svg','pv-community.svg']],['s3',['pv-avatar.svg','pv-rarity.svg','pv-community.svg']]].forEach(function(entry){
      var sec=document.getElementById(entry[0]); if(!sec) return;
      var cards=sec.querySelectorAll('.sdt');
      entry[1].forEach(function(src,i){if(cards[i]&&!cards[i].querySelector('.pv-card-visual')) addImage(cards[i],src,'','pv-card-visual');});
    });
    var identity=document.getElementById('s4');
    if(identity){var cards=identity.querySelectorAll('.card');['pv-avatar.svg','pv-inventory.svg','pv-community.svg'].forEach(function(src,i){if(cards[i]&&!cards[i].querySelector('.pv-card-visual'))addImage(cards[i],src,'','pv-card-visual pv-card-visual--compact');});}
    addGameIdentity(); addCosmeticShowcase(); installStyles(); installFavicon(); fixBars(); updateYear();
  }
  function start(){
    decorate();
    var observer=new MutationObserver(function(records){
      var needsBars=false;
      records.forEach(function(record){if(record.type==='attributes'&&record.attributeName==='class') needsBars=true;});
      if(needsBars) window.requestAnimationFrame(fixBars);
    });
    observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
    window.addEventListener('pageshow',fixBars);
    window.addEventListener('resize',fixBars);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)fixBars();});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('load',function(){decorate();fixBars();},{once:true});
})();