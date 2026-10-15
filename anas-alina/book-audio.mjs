import {normalizePlaybackRate} from './playback-tempo.mjs?v=1';
// Voice clips follow source beats, so later caption wrapping cannot reorder audio.
export function indexVoiceClips(clips) {
  const index = new Map();
  for (const clip of clips) {
    if (!Number.isInteger(clip.page) || clip.page < 1 || !Number.isInteger(clip.sourceBeat) || clip.sourceBeat < 0 ||
        typeof clip.speaker !== 'string' || typeof clip.text !== 'string' || typeof clip.src !== 'string' || !clip.src) continue;
    const key = `${clip.page}:${clip.sourceBeat}`;
    // An ambiguous mapping is silent rather than choosing the wrong child.
    index.set(key,index.has(key) ? null : clip);
  }
  return index;
}

export function voiceClipFor(index,page,beat) {
  if (!beat || beat.part > 0) return null;
  const clip = index.get(`${page}:${beat.sourceBeat}`);
  return clip && clip.speaker === beat.speaker && clip.text === (beat.sourceText||beat.text) ? clip : null;
}

export function createVoicePlayer({AudioCtor=globalThis.Audio,enabled=true,isActive=()=>true,playbackRate=1}={}) {
  const available = typeof AudioCtor === 'function';
  let current = null, token = 0;
  let rate=normalizePlaybackRate(playbackRate);
  function applyRate(){if(current){current.defaultPlaybackRate=current.playbackRate=rate;current.preservesPitch=true;current.webkitPreservesPitch=true;current.mozPreservesPitch=true;}}
  function release(audio) {
    try { audio.pause(); } catch {}
    try { audio.removeAttribute?.('src'); audio.load?.(); } catch {}
  }
  function stop() {
    token += 1;
    const previous = current;
    current = null;
    if (previous) release(previous);
  }
  function setEnabled(value) {
    enabled = !!value;
    if (!enabled) stop();
  }
  function play(src) {
    stop();
    if (!available || !enabled || !src || !isActive()) return false;
    const request = token;
    let audio;
    try {
      audio = new AudioCtor();
      audio.preload = 'auto';
      audio.src = src;
      current = audio;
      applyRate();
      audio.addEventListener?.('ended',()=>{if (request === token && current === audio) current = null;},{once:true});
      // Called synchronously from the reader's gesture; no fetch or await may
      // consume browser activation before this call.
      Promise.resolve(audio.play()).then(()=>{
        if (request !== token || current !== audio || !enabled || !isActive()) release(audio);
      },()=>{
        // Autoplay restrictions, interrupted requests and missing media never
        // interrupt reading. The next explicit tap can try another clip.
        if (request === token && current === audio) current = null;
        release(audio);
      });
      return true;
    } catch {
      if (current === audio) current = null;
      if (audio) release(audio);
      return false;
    }
  }
  function setPlaybackRate(value){rate=normalizePlaybackRate(value);applyRate();return rate;}
  return {get available(){return available;},get enabled(){return enabled;},get playbackRate(){return rate;},setPlaybackRate,setEnabled,play,stop};
}
