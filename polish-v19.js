(function(){
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

  function currentScreen(){
    return $('.screen.on') || $('.screen[aria-hidden="false"]') || $$('.screen')[0];
  }
  function currentIndex(){
    var s=currentScreen();
    return s ? parseInt(s.getAttribute('data-i')||'0',10) : 0;
  }

  function oneDecor(){
    $$('.screen').forEach(function(sec){
      sec.classList.add('pv-one-decor');
      var plate=sec.querySelector('.pv-plate');
      var chips=sec.querySelector('.pv-chips');
      var icons=sec.querySelector('.pv-icons');
      var n=0;
      if(plate && plate.style.display!=='none') n++;
      if(chips) n++;
      if(icons) n++;
      if(n>1){
        if(icons) icons.style.display='none';
        if(n>2 && chips) chips.style.display='none';
      }
    });
  }

  function dens(){ /* no duplicate denominator lines */ }

  function thesis(){
    var s6=document.getElementById('s6');
    if(!s6||s6.querySelector('.pv-thesis')) return;
    var html='<div class="pv-thesis"><p>Стиль заметнее давления друзей</p><span>главный тезис перед данными</span></div>';
    var tt=s6.querySelector('.tt,h1');
    if(tt) tt.insertAdjacentHTML('beforebegin', html);
  }

  function bigNum(){
    var s10=document.getElementById('s10');
    if(!s10||s10.querySelector('.pv-bignum')) return;
    var html='<div class="pv-bignum">8/18<small>не влияют друзья</small></div>';
    var vs=s10.querySelector('.pv-vs');
    var tt=s10.querySelector('.tt,h1');
    if(vs) vs.insertAdjacentHTML('beforebegin', html);
    else if(tt) tt.insertAdjacentHTML('afterend', html);
  }

  function moreQuotes(){
    var s16=document.getElementById('s16');
    if(!s16||s16.querySelector('.pv-quote-2')) return;
    var q1=s16.querySelector('.pv-quote');
    var html=
      '<blockquote class="pv-quote pv-quote-2"><p>Статус — это когда скин редкий и его узнают, а не когда он +12 к урону.</p><cite>— участник опроса</cite></blockquote>'+
      '<blockquote class="pv-quote pv-quote-3"><p>Если бы это был pay-to-win, я бы просто ушёл в другую игру.</p><cite>— участник опроса</cite></blockquote>';
    if(q1) q1.insertAdjacentHTML('afterend', html);
  }

  function recs(){
    var s17=document.getElementById('s17')||document.getElementById('s20');
    if(!s17||s17.querySelector('.pv-recs')) return;
    var html='<div class="pv-recs" aria-label="Рекомендации студии">'+
      '<article><b>01 · Прозрачность</b><p>Цены, drop rates и лимиты — на виду. Доверие дороже импульса.</p></article>'+
      '<article><b>02 · Не P2W</b><p>Косметика отделена от силы. Платишь за вид, не за победу.</p></article>'+
      '<article><b>03 · Самовыражение</b><p>Скины как язык стиля: редкость, история, «похоже на меня».</p></article>'+
      '</div>';
    var host=s17.querySelector('.fitbox')||s17;
    var take=s17.querySelector('.pv-take');
    if(take) take.insertAdjacentHTML('beforebegin', html);
    else host.insertAdjacentHTML('beforeend', html);
  }

  function faceoff(){
    var s14=document.getElementById('s14');
    if(!s14||s14.querySelector('.pv-faceoff')) return;
    var html='<div class="pv-faceoff">'+
      '<article class="bad"><h3>Pay-to-Win</h3><p>Деньги → сила в бою. Ломает справедливость и удержание.</p></article>'+
      '<article class="good"><h3>Cosmetic</h3><p>Деньги → вид и статус. Соревнуются стилем, не уроном.</p></article>'+
      '<div class="verdict">Вердикт: косметика совместима с этикой, если правила честные и прозрачные.</div>'+
      '</div>';
    var tt=s14.querySelector('.tt,h1');
    if(tt) tt.insertAdjacentHTML('afterend', html);
  }

  function morph(){ /* disabled: hero-plate already on s0 */ }

  var timerStart=null, timerIV=null;
  function presenterUI(){
    if($('.pv-presenter')) return;
    var el=document.createElement('aside');
    el.className='pv-presenter';
    el.innerHTML='<div class="pt">Докладчик · P</div><div class="pn">—</div><div class="pv-timer">00:00</div><div class="notes"></div><div class="next"><b>Далее</b><span class="nx">—</span></div>';
    document.body.appendChild(el);
  }
  function fmt(t){
    var m=Math.floor(t/60), s=t%60;
    return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  }
  function syncPresenter(){
    var panel=$('.pv-presenter'); if(!panel) return;
    var sec=currentScreen(); if(!sec) return;
    var i=currentIndex();
    panel.querySelector('.pn').textContent=(i<10?'0':'')+i+' / '+sec.getAttribute('data-title');
    panel.querySelector('.notes').textContent=sec.getAttribute('data-notes')||'Нет заметок';
    var all=$$('.screen');
    var next=all[i+1];
    panel.querySelector('.nx').textContent=next?(next.getAttribute('data-title')||('Слайд '+(i+1))):'Конец';
  }
  function togglePresenter(){
    document.body.classList.toggle('pv-pres');
    if(document.body.classList.contains('pv-pres')){
      if(!timerStart){ timerStart=Date.now(); }
      if(!timerIV){
        timerIV=setInterval(function(){
          var el=$('.pv-timer'); if(!el||!timerStart) return;
          el.textContent=fmt(Math.floor((Date.now()-timerStart)/1000));
        },1000);
      }
      syncPresenter();
    }
  }

  function overviewUI(){
    if($('.pv-overview')) return;
    var el=document.createElement('div');
    el.className='pv-overview';
    el.innerHTML='<h2>Оглавление · T закрыть</h2><div class="pv-ov-grid"></div>';
    document.body.appendChild(el);
    var grid=el.querySelector('.pv-ov-grid');
    $$('.screen').forEach(function(sec){
      var i=sec.getAttribute('data-i')||'0';
      var t=sec.getAttribute('data-title')||('Слайд '+i);
      var b=document.createElement('button');
      b.type='button';
      b.innerHTML='<div class="i">'+i+'</div><div class="t">'+t+'</div>';
      b.addEventListener('click',function(){
        document.body.classList.remove('pv-ov');
        if(typeof window.go==='function') window.go(parseInt(i,10));
      });
      grid.appendChild(b);
    });
  }
  function syncOverview(){
    var idx=currentIndex();
    $$('.pv-ov-grid button').forEach(function(b,k){ b.classList.toggle('on', k===idx); });
  }
  function toggleOverview(){
    document.body.classList.toggle('pv-ov');
    if(document.body.classList.contains('pv-ov')) syncOverview();
  }

  function toggleFocus(){ document.body.classList.toggle('pv-focus'); }

  var autoIV=null;
  function autoUI(){
    if($('.pv-auto')) return;
    var el=document.createElement('div');
    el.className='pv-auto';
    el.innerHTML='<i></i><span>AUTO · A</span>';
    document.body.appendChild(el);
  }
  function toggleAuto(){
    document.body.classList.toggle('pv-autoplay');
    if(autoIV){ clearInterval(autoIV); autoIV=null; }
    if(document.body.classList.contains('pv-autoplay')){
      autoIV=setInterval(function(){
        if(typeof window.go==='function'){
          var i=currentIndex();
          var n=$$('.screen').length;
          window.go(i+1>=n?0:i+1);
        }
      }, 35000);
    }
  }

  function fonts(){
    try{
      var s=document.createElement('style');
      s.textContent='*{font-display:swap}';
      document.head.appendChild(s);
    }catch(e){}
  }

  function onSlide(){ syncPresenter(); syncOverview(); }

  function wrapNav(){
    if(typeof window.go==='function' && !window.go.__pv19){
      var _g=window.go;
      window.go=function(){
        var r=_g.apply(this,arguments);
        setTimeout(onSlide,40);
        return r;
      };
      window.go.__pv19=1;
    }
  }

  function keys(){
    window.addEventListener('keydown',function(e){
      if(e.target && (/INPUT|TEXTAREA/.test(e.target.tagName))) return;
      var k=e.key.toLowerCase();
      if(k==='p'){ e.preventDefault(); togglePresenter(); }
      else if(k==='t'){ e.preventDefault(); toggleOverview(); }
      else if(k==='f'){ e.preventDefault(); toggleFocus(); }
      else if(k==='a' && !e.metaKey && !e.ctrlKey){ e.preventDefault(); toggleAuto(); }
      else if(k==='escape'){ document.body.classList.remove('pv-ov','pv-focus'); }
    });
  }

  function boot(){
    document.querySelectorAll('.pv-chapters,.pv-morph,.pv-den,.pv-src').forEach(function(el){el.remove();});
    fonts();
    presenterUI();
    overviewUI();
    autoUI();
    oneDecor();
    dens();
    thesis();
    bigNum();
    moreQuotes();
    recs();
    faceoff();
    morph();
    wrapNav();
    keys();
    onSlide();
    setTimeout(function(){
      document.querySelectorAll('.pv-chapters,.pv-morph,.pv-den').forEach(function(el){el.remove();});
      oneDecor(); thesis(); bigNum(); moreQuotes(); recs(); faceoff(); wrapNav(); onSlide();
    },900);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
  setTimeout(boot,700);
})();
