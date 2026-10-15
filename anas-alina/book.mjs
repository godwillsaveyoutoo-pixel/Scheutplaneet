import {BookCursor} from './book-state.mjs';
import {prepareReadingPages} from './book-layout.mjs?v=anas-alina-1';
import {createBookPictures} from './book-pictures.mjs?v=tempo-1';
import {visualForPassage,visualsForPage} from './book-visuals.mjs?v=extra-prenten-1';
import {createVoicePlayer,indexVoiceClips,voiceClipFor} from './book-audio.mjs?v=tempo-1';
import {voiceClips} from './book-voices.mjs?v=milan-volume-3';
import {createTimedNarration} from './book-narration.mjs?v=tempo-1';
import {createBufferedNarration} from './book-buffered-narration.mjs?v=tempo-1';
import {narrationTracks} from './book-narration-data.mjs?v=milan-volume-3';
import {createSharingExercise} from './simple-math.mjs?v=tempo-1';
import {savedPlaybackRate,savePlaybackRate,applyTempoStyles} from './playback-tempo.mjs?v=1';

const $ = id => document.getElementById(id);
const STORAGE = 'anas-alina-boek-v1';
const VOICE_STORAGE = 'anas-alina-stemmen-v1';
let playbackRate=savedPlaybackRate();
applyTempoStyles(document.documentElement,playbackRate);
$('playback-tempo').value=String(playbackRate);
let pages, cursor, textVisible = true, activePuzzle = null, controlsOpen = false;
const preloaded = new Set();
const colors={Verteller:'#897348',Milan:'#ae7c26',Alina:'#a24b3b'};
const contents = $('contents'), math = $('math-dialog'), frame = $('math-frame');
const pictures=createBookPictures({front:$('page-picture'),back:$('page-picture-back'),status:$('image-status'),container:$('picture-wrap'),onReady:()=>fitPassage(),getPlaybackRate:()=>playbackRate});
const voiceIndex = indexVoiceClips(voiceClips);
let voicesEnabled = true;
try { voicesEnabled = localStorage.getItem(VOICE_STORAGE) !== 'false'; } catch {}
const voices = createVoicePlayer({enabled:voicesEnabled,isActive:()=>!document.hidden,playbackRate});
const createNarration=typeof(globalThis.AudioContext||globalThis.webkitAudioContext)==='function'?createBufferedNarration:createTimedNarration;
const narration=narrationTracks.length?createNarration({track:narrationTracks[0],playbackRate,onCue:showTimedCue,onState:state=>{refreshPlayback();if(state==='playing')prepareNextChapter();},onEnd:()=>render(),isActive:()=>canListen()&&currentNarration()?.track===narration.track}):{pause(){}};
const narrations = narrationTracks.map(track=>({track,player:narration}));
$('playback-tempo').addEventListener('change',()=>{
  playbackRate=savePlaybackRate($('playback-tempo').value);
  $('playback-tempo').value=String(playbackRate);
  applyTempoStyles(document.documentElement,playbackRate);
  voices.setPlaybackRate(playbackRate);narration.setPlaybackRate?.(playbackRate);
});
function prepareNextChapter(){
  const next=narrations[narrations.findIndex(entry=>entry.track===narration.track)+1];
  if(next&&narration.preload)narration.preload(next.track).catch(()=>{});
}
function canListen(){return !!cursor && voices.enabled && !document.hidden && math.hidden && !contents.open;}
function showTimedCue(cue){if(!cursor)return;cursor.page=cue.page-1;cursor.beat=cue.beat;render();}
function refreshPlayback(){if(cursor){updateVoiceControls();fitPassage();}}
function currentNarration(){return cursor?narrations.find(({track})=>track.cues.some(c=>c.page===cursor.page+1)):null;}
function timedPlayer(){return voices.available&&voices.enabled?currentNarration()?.player:null;}
function questionReady(){const player=timedPlayer();return !!cursor?.current.puzzle && (player?player.state==='ended'&&cursor.lastBeat:!textVisible||cursor.canSolve);}
function pauseAll(){voices.stop();narration.pause();}
function alignNarration(){
  const entry=currentNarration();if(!entry)return;
  const cue=entry.track.cues.find(c=>c.page===cursor.page+1&&c.beat===cursor.beat);entry.player.select(entry.track,cursor.atStart?0:cue?.start||0);
}
function toggleNarration(){
  const player=timedPlayer();if(!player||!math.hidden||contents.open)return;
  if(player.state==='playing'||player.state==='loading')player.pause();
  else {voices.stop();player.play();}
  updateVoiceControls();
}
function continueStory(){
  if(!questionReady())return;
  pauseAll();cursor.nextPage();alignNarration();render();
  const player=timedPlayer();if(player)player.play();else playCurrentVoice();
  focusNext();
}

function currentVoiceClip() {
  if (!cursor || timedPlayer() || !textVisible || !math.hidden || contents.open) return null;
  return voiceClipFor(voiceIndex,cursor.page+1,cursor.passage);
}
function updateVoiceControls() {
  const hasRecordings=voiceClips.length>0||narrationTracks.length>0;
  $('voices-toggle').hidden=!hasRecordings;$('voice-replay').hidden=!hasRecordings;
  $('voices-toggle').disabled=!voices.available||!hasRecordings;
  $('voices-toggle').setAttribute('aria-pressed',String(voices.enabled));
  $('voices-toggle').title = voices.enabled ? 'Stemmen uitschakelen' : 'Stemmen inschakelen';
  const player=timedPlayer();
  $('voice-replay').disabled = !voices.available || !voices.enabled || (!player&&!currentVoiceClip());
  $('narration-play').hidden = !player || questionReady();
  $('narration-play').disabled = !player?.available;
  $('narration-play').setAttribute('aria-pressed',String(player?.state==='playing'||player?.state==='loading'));
  $('narration-play').textContent = player?.state==='loading'?'Laden stoppen':player?.state==='playing'?'Pauzeren':player?.state==='error'?'Opnieuw proberen':player?.time>1?'Verder luisteren':'Start voorlezen';
  $('narration-replay').hidden=!player;
  $('narration-replay').disabled=!player?.available;
  $('continue-story').hidden = !questionReady();
  $('reading-actions').hidden = !player && !questionReady();
  $('playback-status').textContent = player?.state==='loading'?'Geluid laden…':player?.state==='error'?'Het geluid kon niet starten. Tik op Opnieuw proberen.':'';
}
function playCurrentVoice() {
  voices.play(currentVoiceClip()?.src);
  updateVoiceControls();
}
function toggleText() {
  voices.stop();
  textVisible = !textVisible;
  render();
}

function remember() {
  try { localStorage.setItem(STORAGE, JSON.stringify({...cursor.snapshot(),textVisible})); } catch {}
}
function focusNext() { $('next').focus({preventScroll:true}); }
function render() {
  const page = cursor.current, beat = cursor.passage;
  $('result-summary').hidden=!page.result||cursor.beat>0;
  if(page.result)$('result-summary').textContent=`Na het delen: ${page.result.giver} ${page.result.remaining} · ${page.result.receiver} ${page.result.given}`;
  const visual=visualForPassage(page,cursor.beat);
  pictures.show(visual.image,visual.alt);
  $('chapter-title').textContent = page.title;
  $('speaker').textContent = beat.speaker;
  $('speaker').style.setProperty('--speaker-color',colors[beat.speaker] || colors['Verteller']);
  const passage=beat.speaker === 'Verteller' ? beat.text : `“${beat.text}”`;
  if($('passage').textContent!==passage){
    $('passage').textContent=passage;
    if(!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)$('copy-center').animate?.([{opacity:.5,transform:'translateY(2px)'},{opacity:1,transform:'none'}],{duration:160/playbackRate,easing:'ease-out'});
  }
  $('story-copy').dataset.dialogue = String(beat.speaker !== 'Verteller');
  $('story-copy').dataset.short = String(beat.text.length < 25);
  $('book').classList.toggle('text-hidden',!textVisible);
  $('text-toggle').setAttribute('aria-pressed',String(textVisible));
  $('text-toggle').title = textVisible ? 'Tekst verbergen (T)' : 'Tekst tonen (T)';
  $('page-progress').textContent = `Bladzijde ${cursor.page + 1} van ${pages.length}`;
  $('previous').disabled = textVisible ? cursor.atStart : cursor.page === 0;
  $('page-hint').hidden = !cursor.atStart || !textVisible;
  $('page-hint').textContent=timedPlayer()?'Start het voorlezen. Bij de telvraag stopt het verhaal.':'Tik op de bladzijde om verder te lezen';
  $('solve').hidden = !questionReady();
  $('next').textContent = timedPlayer()&&timedPlayer().state!=='ended'?'Voorlezen starten of pauzeren':cursor.lastPage && (!textVisible || cursor.lastBeat) ? 'Opnieuw lezen ↻' : questionReady() ? 'Verder met het verhaal →' : !textVisible || cursor.lastBeat ? 'Volgende bladzijde →' : 'Verder →';
  $('beat-dots').replaceChildren(...page.beats.map((_,i)=>{
    const dot = document.createElement('i');
    dot.className = i === cursor.beat ? 'active' : i < cursor.beat ? 'read' : '';
    return dot;
  }));
  for (const button of $('page-grid').children) {
    if (Number(button.dataset.page) === cursor.page) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  }
  for (const neighbor of [page,pages[cursor.page+1],pages[cursor.page-1]]) {
    if(!neighbor)continue;
    for(const visual of visualsForPage(neighbor))if(!preloaded.has(visual.image)){
      preloaded.add(visual.image);
      pictures.preload(visual.image).catch(()=>{});
    }
  }
  remember();
  updateVoiceControls();
  fitPassage();
}
function fitPassage() {
  if(!cursor)return;
  const spread=$('book-spread'), copy=$('story-copy'), passage=$('passage'),panel=$('reading-panel');
  const layout=visualForPassage(cursor.current,cursor.beat).layout;
  spread.dataset.layout=textVisible?layout.anchor:'image-only';
  spread.dataset.authored=String(!!layout.authoredSpace);
  copy.dataset.surface=panel.dataset.surface=layout.textSurface||'painted';
  copy.dataset.anchor=layout.anchor;
  copy.style.setProperty('--copy-width',`${layout.widthPct}%`);
  copy.style.setProperty('--copy-top',`${layout.topPct??3}%`);
  copy.style.setProperty('--copy-side',`${layout.sidePct??3}%`);
  copy.style.setProperty('--copy-bottom',`${layout.bottomPct??3}%`);
  copy.style.setProperty('--copy-height',`${layout.maxHeightPct}%`);
  panel.dataset.anchor=layout.anchor;
  panel.style.setProperty('--copy-width',`${layout.widthPct}%`);
  panel.style.setProperty('--copy-side',`${layout.sidePct??3}%`);
  if(!textVisible)return;
  const width=spread.getBoundingClientRect?.().width;
  if(!width)return;
  // The picture and authored caption box never move when the speaker changes.
  // Controls live in their own dock, so loading/errors cannot push the text out.
  copy.style.setProperty('--caption-scale',String(width/1672));
  let size=Math.min(cursor.passage.text.length<25?54:46,width*(cursor.passage.text.length<25?.032:.026));
  passage.style.fontSize=`${size}px`;
  if(copy.clientHeight>0)while(size>8&&copy.scrollHeight>copy.clientHeight+1){size=Math.max(8,size-1);passage.style.fontSize=`${size}px`;}
}
function toggleControls(open) {
  controlsOpen=open;
  $('book-tools').hidden=!open;
  $('controls-toggle').setAttribute('aria-expanded',String(open));
  $('controls-toggle').setAttribute('aria-label',open?'Boekbediening sluiten':'Boekbediening openen');
  $('book').classList.toggle('controls-open',open);
}
function next() {
  if(!cursor)return;
  if (!math.hidden || contents.open) return;
  if(controlsOpen){toggleControls(false);return;}
  if(questionReady()){continueStory();return;}
  if(timedPlayer()&&timedPlayer().state!=='ended'){toggleNarration();return;}
  pauseAll();
  if (cursor.lastPage && (!textVisible || cursor.lastBeat)) cursor.goPage(0);
  else if (textVisible) cursor.next();
  else cursor.nextPage();
  alignNarration();
  render();
  playCurrentVoice();
}
function previous() {
  if(!cursor)return;
  if (!math.hidden || contents.open) return;
  if(timedPlayer()){
    const entry=currentNarration(),player=entry.player,playing=player.state==='playing';pauseAll();
    if(player.cueIndex>0)player.seek(entry.track.cues[player.cueIndex-1].start);
    else {const previous=narrations[narrations.indexOf(entry)-1];if(previous){previous.player.select(previous.track,previous.track.cues.at(-1).start);if(playing)previous.player.play();return;}}
    if(playing)player.play();return;
  }
  pauseAll();
  if (textVisible) cursor.previous();
  else cursor.goPage(cursor.page-1);
  alignNarration();
  render();
  playCurrentVoice();
}
function fillContents() {
  $('page-grid').replaceChildren(...pages.map((page,index)=>{
    const button = document.createElement('button');
    button.className = 'page-card'; button.dataset.page = index;
    const image = document.createElement('img');
    image.src = visualForPassage(page).image; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
    const label = document.createElement('span'); label.className = 'card-label';
    const number = document.createElement('small');
    number.textContent = `Bladzijde ${index+1}${page.puzzle?' · Rekenmoment':''}`;
    label.append(number,document.createTextNode(page.title));
    button.append(image,label);
    button.addEventListener('click',()=>{pauseAll();cursor.goPage(index);contents.close();alignNarration();render();if(!timedPlayer())playCurrentVoice();focusNext();});
    return button;
  }));
}
let bridgeReady=false, mathGuideOpen=false;
let sharingExercise;
function mathTools(open=false) {
  $('math-tools').hidden=!open;
  $('math-tools-toggle').setAttribute('aria-expanded',String(open));
}
function sendMathControl(action,extra={}) {
  if(!activePuzzle || math.hidden || frame.hidden || !bridgeReady)return;
  frame.contentWindow.postMessage({type:'delen-book:control',first:activePuzzle.first,second:activePuzzle.second,action,...extra},window.location.origin);
  mathTools();
}
function markMathComplete(complete) {
  $('math-skip').dataset.complete=String(complete);
  if(complete)$('math-action').hidden=true;
}
function closeMath(advance=false) {
  if (math.hidden) return;
  sharingExercise?.stop();
  math.hidden=true;
  $('book-spread').hidden=false;
  $('book').classList.toggle('calculating',false);
  frame.hidden = true; frame.removeAttribute('src'); activePuzzle = null;
  bridgeReady=false;mathGuideOpen=false;mathTools();
  if (advance) cursor.nextPage();
  if (advance) alignNarration();
  render();
  if(advance){const player=timedPlayer();if(player)player.play();else playCurrentVoice();}
  (advance ? $('next') : $('solve')).focus({preventScroll:true});
}
function prepareSimpleMath(puzzle) {
  sharingExercise?.stop();markMathComplete(false);
  sharingExercise=createSharingExercise({get:$,puzzle,onComplete:()=>{
    markMathComplete(true);$('math-skip').focus({preventScroll:true});
  }});
}
function openMath() {
  if(!cursor)return;
  const puzzle=cursor.current.puzzle;
  if(!puzzle || !math.hidden || !questionReady())return;
  pauseAll();
  const bridge=puzzle.first>10&&puzzle.first-puzzle.second<10;
  activePuzzle={...puzzle};bridgeReady=false;mathGuideOpen=false;
  $('math-title').textContent=`${bridge?'Brug over 10':puzzle.first>10?'Terug naar 10':'Aftrekken'}: ${puzzle.item}`;
  $('math-modes').hidden=!bridge;
  for(const mode of ['demo','guided','solo']){
    $('math-mode-'+mode).setAttribute('aria-pressed',String(mode===(puzzle.mode||'demo')));
    $('math-mode-'+mode).disabled=true;
  }
  $('math-action').hidden=true;$('math-action').disabled=true;
  $('math-guide').hidden=!bridge;$('math-guide').disabled=bridge;
  $('math-reset').disabled=bridge;
  markMathComplete(false);mathTools();toggleControls(false);
  $('simple-math').hidden=bridge;frame.hidden=!bridge;
  frame.title=`Aftrekken van ${puzzle.item} met splitsing en sok`;
  $('math-loading').hidden=!bridge;
  $('book-spread').hidden=true;math.hidden=false;
  $('book').classList.toggle('calculating',true);
  if(bridge)frame.src=`trainer.html?book=1&first=${puzzle.first}&second=${puzzle.second}&mode=${puzzle.mode||'demo'}&view=anas-alina-1`;
  else prepareSimpleMath(puzzle);
  $('math-title').focus({preventScroll:true});
}

$('next').addEventListener('click',next);
$('previous').addEventListener('click',previous);
$('solve').addEventListener('click',openMath);
$('narration-play').addEventListener('click',toggleNarration);
$('continue-story').addEventListener('click',continueStory);
$('text-toggle').addEventListener('click',toggleText);
$('voices-toggle').addEventListener('click',()=>{
  voices.setEnabled(!voices.enabled);
  if(!voices.enabled)pauseAll();else alignNarration();
  try { localStorage.setItem(VOICE_STORAGE,String(voices.enabled)); } catch {}
  render();
  // Switching voices on is an explicit request to hear this child, if present.
  if (voices.enabled && !timedPlayer()) playCurrentVoice();
});
function replayPassage(){
  const player=timedPlayer();
  if(player){
    const {track}=currentNarration(),cue=track.cues.find(c=>c.page===cursor.page+1&&c.beat===cursor.beat)||track.cues[0];
    if(player.replay)player.replay(cue.start);
    else {player.pause();player.seek(cue.start);player.play();}
  }
  else playCurrentVoice();toggleControls(false);focusNext();
}
$('voice-replay').addEventListener('click',replayPassage);
$('narration-replay').addEventListener('click',replayPassage);
$('controls-toggle').addEventListener('click',()=>toggleControls(!controlsOpen));
$('contents-open').addEventListener('click',()=>{pauseAll();toggleControls(false);if(cursor)contents.showModal();updateVoiceControls();});
$('contents-close').addEventListener('click',()=>{contents.close();updateVoiceControls();$('controls-toggle').focus();});
$('restart').addEventListener('click',()=>{pauseAll();cursor.goPage(0);contents.close();alignNarration();render();focusNext();});
contents.addEventListener('close',updateVoiceControls);
contents.addEventListener('click',event=>{
  if(event.target!==contents)return;
  const rect=contents.getBoundingClientRect();
  if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom){contents.close();updateVoiceControls();}
});
$('math-close').addEventListener('click',()=>closeMath());
$('math-skip').addEventListener('click',()=>closeMath(true));
for(const mode of ['demo','guided','solo'])$('math-mode-'+mode).addEventListener('click',()=>sendMathControl('mode',{mode}));
$('math-action').addEventListener('click',()=>{if(!mathGuideOpen)sendMathControl('advance');});
$('math-tools-toggle').addEventListener('click',()=>mathTools($('math-tools').hidden));
$('math-guide').addEventListener('click',()=>sendMathControl('guide'));
$('math-reset').addEventListener('click',()=>{
  if(frame.hidden && activePuzzle){prepareSimpleMath(activePuzzle);mathTools();}
  else sendMathControl('reset');
});
window.addEventListener('message',event=>{
  if(event.origin!==window.location.origin || event.source!==frame.contentWindow || math.hidden || !activePuzzle)return;
  const data=event.data;
  if(data?.first!==activePuzzle.first || data?.second!==activePuzzle.second)return;
  if(data.type==='delen-book:ready'){
    bridgeReady=true;$('math-loading').hidden=true;
  }
  if(data.type==='delen-book:state'){
    if(!['demo','guided','solo'].includes(data.mode) || typeof data.actionLabel!=='string' || data.actionLabel.length>120 || typeof data.actionVisible!=='boolean' || typeof data.guideOpen!=='boolean' || typeof data.complete!=='boolean')return;
    bridgeReady=true;mathGuideOpen=data.guideOpen;$('math-loading').hidden=true;
    for(const mode of ['demo','guided','solo']){
      $('math-mode-'+mode).setAttribute('aria-pressed',String(mode===data.mode));
      $('math-mode-'+mode).disabled=data.guideOpen;
    }
    $('math-action').textContent=data.actionLabel;
    $('math-action').hidden=!data.actionVisible || data.complete;
    $('math-action').disabled=data.guideOpen;
    $('math-reset').disabled=data.guideOpen;$('math-guide').disabled=false;
    markMathComplete(data.complete);
  }
  if(data.type==='delen-book:focus-action'){
    (!$('math-action').hidden && !$('math-action').disabled ? $('math-action') : $('math-skip')).focus({preventScroll:true});
  }
  if(data.type==='delen-book:back')closeMath();
  if(data.type==='delen-book:complete')closeMath(true);
});
window.addEventListener('resize',()=>{if(cursor)fitPassage();});
window.addEventListener('pagehide',pauseAll);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAll();});
async function toggleFullscreen(){
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { $('fullscreen').title='Volledig scherm is niet beschikbaar in deze browser'; }
}
$('fullscreen').addEventListener('click',toggleFullscreen);
$('math-fullscreen').addEventListener('click',()=>{mathTools();toggleFullscreen();});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Verlaat volledig scherm':'Volledig scherm');});
document.addEventListener('keydown',event=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(event.target?.tagName))return;
  if (!cursor || event.altKey || event.ctrlKey || event.metaKey || event.repeat || contents.open) return;
  if(!math.hidden){
    if(event.key==='Escape'){event.preventDefault();if(!$('math-tools').hidden)mathTools();else closeMath();}
    return;
  }
  if(event.key==='Escape' && controlsOpen){event.preventDefault();toggleControls(false);return;}
  if (['ArrowRight','PageDown'].includes(event.key)) {event.preventDefault();next();}
  if (['ArrowLeft','PageUp'].includes(event.key)) {event.preventDefault();previous();}
  if (event.key.toLowerCase()==='t') {event.preventDefault();toggleText();}
});

try {
  const response = await fetch('book-pages.json?v=milan-audio-1');
  if (!response.ok) throw new Error('Book content unavailable');
  pages = prepareReadingPages(await response.json());
  let saved = {};
  try {
    saved=JSON.parse(localStorage.getItem(STORAGE))||{};

  } catch {}
  cursor = new BookCursor(pages,saved);
  const requestedPage=new URLSearchParams(window.location?.search||'').get('bladzijde');
  if(requestedPage && /^\d+$/.test(requestedPage))cursor.goPage(Number(requestedPage)-1);
  if (typeof saved.textVisible==='boolean') textVisible=saved.textVisible;
  fillContents();alignNarration();render();
  document.fonts?.ready.then(()=>fitPassage());
} catch {
  $('image-status').textContent = 'Het verhaal kon niet worden geopend. Vernieuw de pagina om opnieuw te proberen.';
  $('next').disabled = true; $('previous').disabled = true;
}
