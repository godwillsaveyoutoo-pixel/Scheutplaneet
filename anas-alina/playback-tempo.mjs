export const playbackRates=Object.freeze([0.6,0.7,0.8,0.9,1,1.1,1.25]);
export const tempoStorageKey='milan-alina-tempo-v1';
export function normalizePlaybackRate(value){
  const rate=Number(value);
  return playbackRates.find(candidate=>Math.abs(candidate-rate)<.00001)??1;
}
export function savedPlaybackRate(){
  try{return normalizePlaybackRate(globalThis.localStorage?.getItem(tempoStorageKey));}catch{return 1;}
}
export function savePlaybackRate(value){
  const rate=normalizePlaybackRate(value);
  try{globalThis.localStorage?.setItem(tempoStorageKey,String(rate));}catch{}
  return rate;
}
export function applyTempoStyles(root=globalThis.document?.documentElement,rate=savedPlaybackRate()){
  root?.style?.setProperty('--playback-rate',String(normalizePlaybackRate(rate)));
}
export function narrationSource(src,rate){
  const speed=normalizePlaybackRate(rate);
  return speed===1?src:`assets/audio/tempo/${Math.round(speed*100)}/${src.split('/').at(-1)}`;
}
