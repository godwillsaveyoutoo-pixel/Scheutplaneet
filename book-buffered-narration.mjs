// Load complete chapters: the host can return 200/full audio for Range requests.
// Playback offsets and captions use the same persistent Web Audio clock.
export function createBufferedNarration({track,ContextCtor=globalThis.AudioContext||globalThis.webkitAudioContext,
  fetchAudio=globalThis.fetch?.bind(globalThis),onCue=()=>{},onState=()=>{},onEnd=()=>{},isActive=()=>true,
  requestFrame=globalThis.requestAnimationFrame?.bind(globalThis),cancelFrame=globalThis.cancelAnimationFrame?.bind(globalThis),
  loadTimeoutMs=15000}={}){
  function validate(value){
    if(!value?.src||!value.cues?.length||value.cues.some((c,i)=>!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start||i&&c.start<value.cues[i-1].end))throw new Error('Invalid narration timeline');
  }
  validate(track);
  const available=typeof ContextCtor==='function'&&typeof fetchAudio==='function',cache=new Map();
  let context=null,buffer=null,source=null,state='idle',position=0,startedAt=0,cueIndex=-1,revision=0,frame=null;
  const setState=value=>{state=value;onState(value);};
  const duration=()=>buffer?.duration||track.duration||track.cues.at(-1).end;
  const time=()=>Math.min(duration(),position+(state==='playing'?Math.max(0,context.currentTime-startedAt):0));
  function cancel(){if(frame!==null)cancelFrame?.(frame);frame=null;}
  function stopSource(){const old=source;source=null;if(old){old.onended=null;try{old.stop();}catch{}try{old.disconnect();}catch{}}}
  function sync(force=false){
    const at=time();let next=0;
    for(let i=1;i<track.cues.length&&track.cues[i].start<=at+.005;i++)next=i;
    if(force||next!==cueIndex){cueIndex=next;onCue(track.cues[next],next);}
  }
  function tick(){frame=null;if(state!=='playing')return;if(!isActive()){pause();return;}sync();if(requestFrame)frame=requestFrame(tick);}
  function ensureContext(){
    if(!context||context.state==='closed'){
      context=new ContextCtor({latencyHint:'interactive'});cache.clear();buffer=null;
      context.addEventListener?.('statechange',()=>{
        if(state==='playing'&&['interrupted','closed'].includes(context.state)){pause();setState('error');}
      });
    }
    return context;
  }
  async function download(value,ctx){
    for(let attempt=0;attempt<2;attempt++){
      const abort=new AbortController();
      const timeout=setTimeout(()=>abort.abort(),loadTimeoutMs);
      try{
        const response=await fetchAudio(value.src,{credentials:'same-origin',signal:abort.signal,...(attempt?{cache:'reload'}:{})});
        if(!response.ok)throw new Error('Audio request failed');
        if(response.headers?.get('content-type')?.includes('text/html'))throw new Error('Audio request returned a page');
        const decoded=await ctx.decodeAudioData(await response.arrayBuffer());
        if(!Number.isFinite(decoded.duration)||decoded.duration<value.cues.at(-1).end-.1)throw new Error('Incomplete audio');
        return decoded;
      }catch(error){if(attempt)throw error;}
      finally{clearTimeout(timeout);}
    }
  }
  function load(value){
    const ctx=ensureContext();let item=cache.get(value.src);
    if(!item){
      // Retain only the current chapter and the one being prepared.
      for(const key of cache.keys())if(key!==track.src&&key!==value.src)cache.delete(key);
      item={};cache.set(value.src,item);
      item.promise=download(value,ctx).catch(error=>{if(cache.get(value.src)===item)cache.delete(value.src);throw error;});
    }
    return item.promise;
  }
  function pause(){
    position=time();revision++;cancel();stopSource();
    if(state!=='ended'&&state!=='error')setState('paused');
  }
  function seek(seconds){
    const resume=state==='playing'||state==='loading';pause();
    position=Math.min(Math.max(0,Number(seconds)||0),duration());
    if(state==='ended')setState('paused');sync(true);if(resume)play();
  }
  function select(nextTrack,seconds=0){
    validate(nextTrack);pause();
    if(nextTrack!==track){track=nextTrack;buffer=null;cueIndex=-1;position=0;setState('paused');}
    seek(seconds);
  }
  function play(){
    if(!available||!isActive())return false;
    if(state==='playing'||state==='loading')return true;
    if(state==='ended')position=0;
    const token=++revision,value=track;let ctx,ready;
    try{
      ctx=ensureContext();
      // Resume synchronously in the teacher's gesture, before any network await.
      const resumed=ctx.resume();let resumeTimer;
      ready=Promise.race([Promise.resolve(resumed),new Promise((_,reject)=>{resumeTimer=setTimeout(()=>reject(new Error('Audio activation timed out')),loadTimeoutMs);})]).finally(()=>clearTimeout(resumeTimer));
      setState('loading');sync(true);
      Promise.all([ready,load(value)]).then(([,decoded])=>{
        if(token!==revision||track!==value||state!=='loading')return;
        if(!isActive()){pause();return;}
        if(ctx.state!=='running')throw new Error('Audio context did not resume');
        buffer=decoded;position=Math.min(position,decoded.duration);
        const node=ctx.createBufferSource();node.buffer=decoded;node.connect(ctx.destination);source=node;
        node.onended=()=>{
          if(source!==node||token!==revision||state!=='playing')return;
          source=null;try{node.disconnect();}catch{}cancel();position=decoded.duration;
          sync(true);setState('ended');onEnd();
        };
        startedAt=ctx.currentTime;node.start(0,position,Math.max(0,decoded.duration-position));
        setState('playing');sync(true);if(requestFrame)frame=requestFrame(tick);
      }).catch(()=>{
        if(token!==revision||track!==value)return;
        position=time();cancel();stopSource();setState('error');
      });return true;
    }catch{cancel();stopSource();setState('error');return false;}
  }
  return {get available(){return available;},get track(){return track;},get state(){return state;},get time(){return time();},get cueIndex(){return Math.max(0,cueIndex);},
    select,play,pause,seek,preload:load};
}
