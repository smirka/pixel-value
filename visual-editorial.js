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
    img.src=ASSET+src;
    img.alt=alt||'';
    img.loading='lazy';
    img.decoding='async';
    fig.appendChild(img);
    host.appendChild(fig);
    return fig;
  }
  function decorate(){
    Object.keys(visualMap).forEach(function(id){
      var sec=document.getElementById(id), spec=visualMap[id];
      if(!sec||sec.querySelector('.pv-visual-layer')) return;
      var box=sec.querySelector('.fitbox');
      if(!box) return;
      var fig=addImage(box,spec.src,spec.alt,'pv-visual-layer');
      fig.setAttribute('aria-hidden','true');
      if(id==='s20') fig.classList.add('pv-visual-layer--closing');
      if(id==='s0') fig.classList.add('pv-visual-layer--hero');
    });
    var first=document.getElementById('s1');
    if(first){
      var cards=first.querySelectorAll('.sdt');
      ['pv-avatar.svg','pv-rarity.svg','pv-community.svg'].forEach(function(src,i){
        if(cards[i]&&!cards[i].querySelector('.pv-card-visual')){
          addImage(cards[i],src,'','pv-card-visual');
        }
      });
    }
    var theory=document.getElementById('s3');
    if(theory){
      var cards=theory.querySelectorAll('.sdt');
      ['pv-avatar.svg','pv-rarity.svg','pv-community.svg'].forEach(function(src,i){
        if(cards[i]&&!cards[i].querySelector('.pv-card-visual')){
          addImage(cards[i],src,'','pv-card-visual');
        }
      });
    }
    var identity=document.getElementById('s4');
    if(identity){
      var cards=identity.querySelectorAll('.card');
      if(cards[0]&&!cards[0].querySelector('.pv-card-visual')) addImage(cards[0],'pv-avatar.svg','','pv-card-visual pv-card-visual--compact');
      if(cards[1]&&!cards[1].querySelector('.pv-card-visual')) addImage(cards[1],'pv-inventory.svg','','pv-card-visual pv-card-visual--compact');
      if(cards[2]&&!cards[2].querySelector('.pv-card-visual')) addImage(cards[2],'pv-community.svg','','pv-card-visual pv-card-visual--compact');
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',decorate,{once:true});
  else decorate();
  window.addEventListener('load',decorate,{once:true});
})();