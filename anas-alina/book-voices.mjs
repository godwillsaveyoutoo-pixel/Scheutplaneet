// Individual source passages share the same existing takes as the mixed chapters.
let manifest={clips:[]};
try{const response=await fetch('audio-manifest.json?v=milan-audio-2');if(response.ok)manifest=await response.json();}catch{}
export const voiceClips=(manifest.clips||[]).filter(clip=>typeof clip.src==='string'&&clip.src.length>0);
