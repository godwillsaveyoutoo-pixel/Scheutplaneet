// The media clock owns captions. Pausing never leaves a separate text timer running.
export function createTimedNarration({track,AudioCtor=globalThis.Audio,onCue=()=>{},onState=()=>{},onEnd=()=>{},isActive=()=>true,
  requestFrame=globalThis.requestAnimationFrame?.bind(globalThis),cancelFrame=globalThis.cancelAnimationFrame?.bind(globalThis)}={}) {
  function validate(value){
    const list=value?.cues||[];
    if(!value?.src || !list.length || list.some((c,i)=>!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<c.start||i&&c.start<list[i-1].start))throw new Error('Invalid narration timeline');
    return list;
  }
  let cues=validate(track);
  const available=typeof AudioCtor==='function';
  let media=null,state='idle',position=0,cueIndex=-1,frame=null,revision=0,pendingSeek=null,seekIssued=null,seekMute=null,wantPlayback=false,playRequest=null,recoveryUsed=false;
  const setState=value=>{state=value;onState(value);};
  function cancel(){if(frame!==null)cancelFrame?.(frame);frame=null;}
  function clockReady(){return media && (typeof media.readyState!=='number'||media.readyState>=1);}
  function playingHere(){if(state!=='playing')return false;if(!isActive()){pause();return false;}return true;}
  function sync(force=false){
    if(pendingSeek===null && clockReady() && !media.seeking){
      const now=Math.max(0,Number(media.currentTime)||0);
      if(now<position-.25){pendingSeek=position;seekIssued=null;muteSeek();applySeek();}
      else {if(now>position+.05)recoveryUsed=false;position=Math.max(position,now);}
    }
    let next=0;
    for(let i=1;i<cues.length&&cues[i].start<=position+.005;i++)next=i;
    if(force||next!==cueIndex){cueIndex=next;onCue(cues[next],next);}
  }
  function tick(){frame=null;if(!playingHere())return;confirmSeek();sync();if(requestFrame)frame=requestFrame(tick);}
  function ensure(){
    if(media)return media;
    media=new AudioCtor();media.preload='auto';media.src=track.src;
    media.addEventListener?.('timeupdate',()=>{if(playingHere()){confirmSeek();sync();}});
    media.addEventListener?.('seeked',()=>{confirmSeek();if(pendingSeek!==null)applySeek();if(playingHere()){sync();resumeAfterReady();}});
    for(const event of ['loadedmetadata','loadeddata','canplay'])media.addEventListener?.(event,()=>{applySeek();if(playingHere()){sync();resumeAfterReady();}});
    media.addEventListener?.('pause',()=>{if(state==='playing'&&media.paused===true&&!media.ended)resumeAfterReady();});
    media.addEventListener?.('ended',()=>{
      if(!playingHere() || pendingSeek!==null || Number(media.currentTime)<(Number(media.duration)||track.duration)-.15)return;
      wantPlayback=false;revision++;cancel();position=Number(media.duration)||track.duration||cues.at(-1).end;
      cueIndex=cues.length-1;onCue(cues[cueIndex],cueIndex);setState('ended');onEnd();
    });
    media.addEventListener?.('error',()=>{wantPlayback=false;revision++;cancel();try{media.pause();}catch{}setState('error');});
    return media;
  }
  function muteSeek(){if(media&&seekMute===null){seekMute=!!media.muted;media.muted=true;}}
  function confirmSeek(){
    if(pendingSeek===null || !clockReady() || media.seeking)return;
    if(Math.abs(Number(media.currentTime)-pendingSeek)<.12){
      position=Math.max(pendingSeek,Number(media.currentTime));pendingSeek=null;seekIssued=null;
      if(seekMute!==null){media.muted=seekMute;seekMute=null;}
    }
  }
  function applySeek(){
    // Before metadata, an accepted currentTime assignment can still be discarded.
    // Keep the requested position until the browser has actually completed the seek.
    if(!media || pendingSeek===null)return;
    confirmSeek();if(pendingSeek===null)return;
    muteSeek();
    if(!clockReady())return;
    if(media.seeking && seekIssued===pendingSeek)return;
    try{seekIssued=pendingSeek;media.currentTime=pendingSeek;confirmSeek();}catch{seekIssued=null;}
  }
  function seek(seconds){
    position=Math.min(Math.max(0,Number(seconds)||0),track.duration||cues.at(-1).end);
    revision++;pendingSeek=position;seekIssued=null;applySeek();
    if(state==='ended')setState('paused');
    // Media may not have loaded metadata yet; the requested cue is still shown.
    let next=0;for(let i=1;i<cues.length&&cues[i].start<=position+.005;i++)next=i;
    cueIndex=next;onCue(cues[next],next);
  }
  function select(nextTrack,seconds=0){
    const nextCues=validate(nextTrack);
    if(nextTrack!==track){
      pause();track=nextTrack;cues=nextCues;position=0;cueIndex=-1;
      pendingSeek=null;seekIssued=null;
      if(media){
        if(seekMute!==null){media.muted=seekMute;seekMute=null;}
        // Keep the element activated by the teacher's original play gesture.
        // Replacing the file must never create a second, unactivated player.
        media.src=track.src;media.load?.();
      }
      setState('paused');
    }
    seek(seconds);
  }
  function pause(){
    wantPlayback=false;revision++;cancel();if(media){if(pendingSeek===null&&clockReady()&&!media.seeking)position=Math.max(position,Number(media.currentTime)||0);try{media.pause();}catch{}}
    if(state!=='ended'&&state!=='error')setState('paused');
  }
  function playbackFailed(){wantPlayback=false;cancel();try{media.pause();}catch{}setState('error');}
  function resumeAfterReady(){
    if(!wantPlayback||state!=='playing'||!isActive()||pendingSeek!==null||media?.ended||media?.paused!==true)return;
    if(!requestPlayback(true)&&!playRequest)pause();
  }
  function requestPlayback(recover=false){
    if(!media||!wantPlayback||state!=='playing'||!isActive())return false;
    if(playRequest?.token===revision)return true;
    if(recover&&recoveryUsed)return false;
    if(recover)recoveryUsed=true;
    const request={token:revision},a=media;playRequest=request;
    try{
      Promise.resolve(a.play()).then(()=>{
        if(playRequest===request)playRequest=null;
        if(request.token!==revision||!wantPlayback||state!=='playing'||!isActive()){
          if(!wantPlayback||state!=='playing'||!isActive())a.pause();return;
        }
        resumeAfterReady();
      },error=>{
        if(playRequest===request)playRequest=null;
        if(request.token!==revision||!wantPlayback)return;
        if(error?.name==='AbortError'){resumeAfterReady();return;}
        playbackFailed();
      });return true;
    }catch{if(playRequest===request)playRequest=null;playbackFailed();return false;}
  }
  function play(){
    if(!available||!isActive())return false;
    if(state==='ended')seek(0);
    revision++;wantPlayback=true;recoveryUsed=false;const a=ensure();
    try{
      if(state==='error'||a.error){
        pendingSeek=position;seekIssued=null;a.load?.();
      }
      if(pendingSeek===null && Math.abs((Number(a.currentTime)||0)-position)>.02){pendingSeek=position;seekIssued=null;}
      applySeek();
      sync(true);setState('playing');cancel();if(requestFrame)frame=requestFrame(tick);
      // Stay inside the teacher's click to retain browser audio activation.
      return requestPlayback();
    }catch{playbackFailed();return false;}
  }
  return {get available(){return available;},get track(){return track;},get state(){return state;},get time(){return pendingSeek??(state==='playing'&&clockReady()&&!media.seeking?Number(media.currentTime)||0:position);},get cueIndex(){return Math.max(0,cueIndex);},select,play,pause,seek};
}
