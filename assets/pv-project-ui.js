(function(){
'use strict';
function icon(type,accent){
 var common='fill="none" stroke="'+accent+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
 if(type==='dota')return '<svg viewBox="0 0 48 48" aria-hidden="true"><path '+common+' d="M24 5 39 13v22L24 43 9 35V13Z"/><path '+common+' d="m16 15 16 18M32 15 16 33"/><path d="m24 11 7 13-7 13-7-13Z" fill="'+accent+'" opacity=".2"/></svg>';
 if(type==='cs')return '<svg viewBox="0 0 48 48" aria-hidden="true"><path '+common+' d="M10 10h28v28H10zM10 19h28M19 10v28M29 10v28M10 29h28"/></svg>';
 if(type==='valo')return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 10h12L40 38H28Z" fill="'+accent+'"/><path d="M8 38 18 23l7 10-3 5Z" fill="#f4e8e9"/></svg>';
 return '<svg viewBox="0 0 48 48" aria-hidden="true"><path '+common+' d="M24 5 29 16 41 18 32 27 34 40 24 34 14 40 16 27 7 18 19 16Z"/><path d="m24 13 3 8 8 1-6 6 1 8-6-4-6 4 1-8-6-6 8-1Z" fill="'+accent+'" opacity=".22"/></svg>';
}
function cosmetic(type){
 if(type==='avatar')return '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="pvA" x2="1" y2="1"><stop stop-color="#a994e9"/><stop offset="1" stop-color="#536a9c"/></linearGradient></defs><path d="M32 7 44 14 48 29 43 48 32 57 21 48 16 29 20 14Z" fill="#242b40" stroke="#a994e9"/><path d="M22 24q10-18 20 0l-3 11H25Z" fill="url(#pvA)"/><circle cx="32" cy="30" r="8" fill="#d5c8ed"/><path d="m19 51 4-12 9-4 9 4 4 12-13 7Z" fill="#687da8" stroke="#9d8be0"/></svg>';
 if(type==='aura')return '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="24" fill="none" stroke="#66cdbb" stroke-width="2" stroke-dasharray="3 4"/><circle cx="32" cy="32" r="16" fill="#193b3c" stroke="#66cdbb"/><path d="m32 18 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#a6eee0"/><circle cx="32" cy="32" r="4" fill="#f1f4f2"/></svg>';
 return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 53 18v27L32 58 11 45V18Z" fill="#3c2d25" stroke="#d6a66d" stroke-width="1.6"/><path d="M32 13 46 21v20L32 50 18 41V21Z" fill="#d6a66d" opacity=".2"/><path d="m32 17 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z" fill="#e8c58c"/></svg>';
}
function addGames(){
 var games=[['dota','#bba8f5'],['cs','#c4c7d2'],['valo','#e08b96'],['fortnite','#78cdbb']];
 var cards=$('.game-examples .game-example');
 cards.forEach(function(card,i){
  if(card.querySelector('.game-mark'))return;
  var cfg=games[i];if(!cfg)return;
  var mark=document.createElement('div');mark.className='game-mark';mark.innerHTML=icon(cfg[0],cfg[1]);
  var title=card.querySelector('.game-name');
  if(title)card.insertBefore(mark,title);else card.insertBefore(mark,card.firstChild);
 });
}
function $(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function addCosmetics(){
 var sec=$('#s13 .g3')[0];
 if(!sec||sec.querySelector('.pv-cosmetic-strip'))return;
 var strip=document.createElement('div');strip.className='pv-cosmetic-strip';
 strip.innerHTML='<div class="pv-cosmetic"><span>'+cosmetic('avatar')+'</span><span><small>ОБРАЗ</small><strong>Персонаж и стиль</strong></span></div><div class="pv-cosmetic"><span>'+cosmetic('aura')+'</span><span><small>ЭФФЕКТ</small><strong>Аура и оформление</strong></span></div><div class="pv-cosmetic"><span>'+cosmetic('badge')+'</span><span><small>КОЛЛЕКЦИЯ</small><strong>Значок и эмблема</strong></span></div>';
 sec.parentNode.insertBefore(strip,sec);
}
function addPrintNotes(){
 document.querySelectorAll('.screen[data-notes]').forEach(function(slide){
  if(slide.querySelector('.print-speaker-note'))return;
  var note=document.createElement('aside');note.className='print-speaker-note';
  note.innerHTML='<strong>Заметки докладчика</strong><p></p><small>PIXEL / VALUE · версия 10.11.2026 · smirka.github.io/pixel-value</small>';
  note.querySelector('p').textContent=slide.getAttribute('data-notes')||'';
  slide.appendChild(note);
 });
}
function setFavicon(){
 var href='assets/pv-favicon.svg';
 ['icon','shortcut icon'].forEach(function(rel){
  var l=document.querySelector('link[rel="'+rel+'"]');
  if(!l){l=document.createElement('link');l.rel=rel;document.head.appendChild(l)}
  l.type='image/svg+xml';l.href=href;
 });
}
function init(){
 setFavicon();addGames();addCosmetics();addPrintNotes();
 document.querySelectorAll('.ftnote span:first-child').forEach(function(el){el.textContent=el.textContent.replace(/©\s*20\d{2}/,'© 2026')});
 document.querySelectorAll('.logo-t small').forEach(function(el){el.textContent='ИССЛЕДОВАНИЕ · 2026'});
 document.querySelectorAll('.h-meta span').forEach(function(el){if(/2025/.test(el.textContent))el.textContent=el.textContent.replace('2025','2026')});
 document.querySelectorAll('.ftnote').forEach(function(el){if(el.textContent.indexOf('© 2026')<0)el.textContent=el.textContent.replace('© 2025','© 2026')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
