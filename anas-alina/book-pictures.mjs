// Keep a decoded, opaque illustration underneath every incoming frame.
// Only the incoming layer fades: fading both layers reveals the background.
export function createBookPictures({front,back,status,container,createImage=()=>new Image(),reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,onReady=()=>{},getPlaybackRate=()=>1}) {
  const cache=new Map();
  let current=null,currentSrc='',wanted=null,running=null;
  front.hidden=true;back.hidden=true;

  async function decoded(image) {
    if(typeof image.decode==='function')await image.decode();
    else if(!image.complete)await new Promise((resolve,reject)=>{
      const clean=()=>{image.removeEventListener('load',loaded);image.removeEventListener('error',failed);};
      const loaded=()=>{clean();resolve();},failed=()=>{clean();reject(new Error('Image load failed'));};
      image.addEventListener('load',loaded);image.addEventListener('error',failed);
    });
    if(image.naturalWidth===0)throw new Error('Image has no pixels');
    return image;
  }
  function preload(src) {
    if(!cache.has(src)){
      const image=createImage();image.decoding='async';image.src=src;
      const ready=decoded(image).catch(error=>{cache.delete(src);throw error;});
      cache.set(src,ready);
      // Retain a small decoded window instead of all 33 full-size bitmaps.
      while(cache.size>6)cache.delete(cache.keys().next().value);
    }
    return cache.get(src);
  }
  async function drain() {
    while(wanted){
      const next=wanted;
      if(next.src===currentSrc){current.alt=next.alt;wanted=null;status.hidden=true;continue;}
      try {
        await preload(next.src);
        if(wanted!==next)continue;
        const incoming=current===front?back:front;
        incoming.hidden=true;
        incoming.src=next.src;
        await decoded(incoming);
        if(wanted!==next)continue;
        incoming.alt=next.alt;incoming.setAttribute('aria-hidden','false');
        incoming.style.zIndex='1';incoming.style.opacity='1';
        if(current){current.style.zIndex='0';current.setAttribute('aria-hidden','true');}
        status.hidden=true;incoming.hidden=false;
        const animation=current&&!reducedMotion()&&incoming.animate?.(
          [{opacity:0},{opacity:1}],{duration:320/getPlaybackRate(),easing:'ease-in-out',fill:'both'}
        );
        if(animation){try{await animation.finished;}catch{}animation.cancel();}
        if(current)current.hidden=true;
        current=incoming;currentSrc=next.src;
        container.dataset.displayedImage=next.src;
        if(wanted===next)wanted=null;
        onReady();
      }catch{
        if(wanted!==next)continue;
        wanted=null;
        status.classList.toggle('image-status-error',!!current);
        status.textContent='De prent kon niet laden. Kies deze bladzijde opnieuw via Bladzijden.';
        status.hidden=false;
      }
    }
  }
  function show(src,alt) {
    container.dataset.requestedImage=src;
    if(wanted?.src===src){wanted.alt=alt;return running;}
    wanted={src,alt};
    if(!running)start();
    return running;
  }
  function start(){running=drain().finally(()=>{running=null;if(wanted)start();});}
  return {show,preload,get settled(){return running||Promise.resolve();}};
}
