(function(){
  'use strict';
  var videos=Array.prototype.slice.call(document.querySelectorAll('.pv-showcase-video'));
  var motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function shouldPlay(video){
    return !!(video.closest('.screen.on')&&!motion.matches&&!document.documentElement.classList.contains('low-perf')&&!document.hidden);
  }
  function play(video){
    if(!shouldPlay(video)){video.removeAttribute('data-scrubbing');return;}
    var result=video.play();
    if(result&&result.then)result.then(function(){video.setAttribute('data-playing','');video.removeAttribute('data-scrubbing');}).catch(function(){video.removeAttribute('data-playing');video.removeAttribute('data-scrubbing');});
  }
  videos.forEach(function(video){
    var drag=null;
    video.addEventListener('playing',function(){video.setAttribute('data-playing','');});
    video.addEventListener('pause',function(){if(video.paused)video.removeAttribute('data-playing');});
    video.addEventListener('pointerdown',function(event){
      if(event.button!==undefined&&event.button!==0)return;
      drag={id:event.pointerId,x:event.clientX,y:event.clientY,time:video.currentTime,active:false};
    },{passive:true});
    video.addEventListener('pointermove',function(event){
      if(!drag||drag.id!==event.pointerId)return;
      var dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(!drag.active&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2&&Number.isFinite(video.duration)){
        drag.active=true;video.setAttribute('data-scrubbing','');video.pause();
        try{video.setPointerCapture(event.pointerId);}catch(_){/* Pointer capture is optional. */}
      }
      if(!drag.active||!Number.isFinite(video.duration))return;
      var duration=video.duration,turn=dx/Math.max(video.clientWidth,1)*duration;
      video.currentTime=((drag.time+turn)%duration+duration)%duration;
    },{passive:true});
    function release(event){
      if(!drag||drag.id!==event.pointerId)return;
      var moved=drag.active;drag=null;
      if(moved)play(video);
    }
    video.addEventListener('pointerup',release,{passive:true});
    video.addEventListener('pointercancel',release,{passive:true});
    video.addEventListener('keydown',function(event){
      if(!['ArrowLeft','ArrowRight','Home'].includes(event.key)||!Number.isFinite(video.duration))return;
      event.preventDefault();event.stopPropagation();
      if(event.key==='Home')video.currentTime=0;
      else video.currentTime=(video.currentTime+(event.key==='ArrowRight'?1:-1)*(event.shiftKey?0.4:0.12)+video.duration)%video.duration;
      play(video);
    });
  });
})();
