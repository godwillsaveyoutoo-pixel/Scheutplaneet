import {BookCursor} from './book-state.mjs';
import {createBookPictures} from './book-pictures.mjs?v=book-pictures-1';
import {prepareReadingPages, overlapsProtected} from './book-layout.mjs?v=book-narration-7';
import {createVoicePlayer,indexVoiceClips,voiceClipFor} from './book-audio.mjs?v=book-voices-1';
import {voiceClips} from './book-voices.mjs?v=book-narration-7';
import {createTimedNarration} from './book-narration.mjs?v=book-narration-7';
import {createBufferedNarration} from './book-buffered-narration.mjs?v=book-narration-7';
import {narrationTracks} from './book-narration-data.mjs?v=book-narration-7';

const $ = id => document.getElementById(id);
const STORAGE = 'herfst-boek-2026-v4';
const VOICE_STORAGE = 'herfst-boek-stemmen-v1';
let pages, cursor, textVisible = true, activePuzzle = null, controlsOpen = false, lessonView='intro',closingPhase=0;
const pictures=createBookPictures({front:$('page-picture'),back:$('page-picture-next'),status:$('image-status'),container:$('picture-wrap'),onReady:()=>fitPassage()});
const colors = {'Meester Bob':'#9b855e',Amina:'#d6a432',Sami:'#427d81',Maryam:'#a86470',Adam:'#b97543'};
const contents = $('contents'), math = $('math-dialog'), frame = $('math-frame');
const voiceIndex = indexVoiceClips(voiceClips);
let voicesEnabled = true;
try { voicesEnabled = localStorage.getItem(VOICE_STORAGE) !== 'false'; } catch {}
const voices = createVoicePlayer({enabled:voicesEnabled,isActive:()=>!document.hidden});
const createNarration=typeof(globalThis.AudioContext||globalThis.webkitAudioContext)==='function'?createBufferedNarration:createTimedNarration;
const narration = createNarration({track:narrationTracks[0],onCue:showTimedCue,onState:state=>{refreshPlayback();if(state==='playing')prepareNextChapter();},onEnd:()=>{if(cursor.lastPage)showLesson('closing');else render();},isActive:()=>canListen()&&currentNarration()?.track===narration.track});
const narrations = narrationTracks.map(track=>({track,player:narration}));
function prepareNextChapter(){
  const next=narrations[narrations.findIndex(entry=>entry.track===narration.track)+1];
  if(next&&narration.preload)narration.preload(next.track).catch(()=>{});
}
function canListen(){return !!cursor && lessonView==='story' && voices.enabled && !document.hidden && math.hidden && !contents.open;}
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
  const lesson=lessonView!=='story';
  $('text-toggle').disabled=lesson;
  $('voices-toggle').disabled = !voices.available||lesson;
  $('voices-toggle').setAttribute('aria-pressed',String(voices.enabled));
  $('voices-toggle').title = voices.enabled ? 'Stemmen uitschakelen' : 'Stemmen inschakelen';
  const player=timedPlayer();
  $('voice-replay').disabled = lesson || !voices.available || !voices.enabled || (!player&&!currentVoiceClip());
  $('narration-play').hidden = !player || questionReady();
  $('narration-play').disabled = !player?.available;
  $('narration-play').setAttribute('aria-pressed',String(player?.state==='playing'||player?.state==='loading'));
  $('narration-play').textContent = player?.state==='loading'?'Laden stoppen':player?.state==='playing'?'Pauzeren':player?.state==='error'?'Opnieuw proberen':player?.time>1?'Verder luisteren':'Start voorlezen';
  $('continue-story').hidden = !questionReady();
  $('reading-actions').hidden = lesson || !player && !questionReady();
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
function renderLesson(){
  $('lesson-intro').hidden=lessonView!=='intro';$('lesson-closing').hidden=lessonView!=='closing';
  $('book-spread').hidden=lessonView!=='story'||!math.hidden;
  $('book').classList.toggle('lesson-open',lessonView!=='story');
  $('intro-resume').hidden=!cursor||cursor.atStart;
  $('intro-start').disabled=!cursor;$('intro-status').hidden=!!cursor;
}
function renderClosing(){
  $('closing-equation').textContent=closingPhase===2?'8 + 4 = 12':'8 + 4 = ?';
  $('closing-split').hidden=closingPhase!==1;$('closing-result').hidden=closingPhase<2;
  $('closing-prompt').textContent=['Hoe splits je 4 om eerst 10 te maken?','Er blijven 2 over. Hoeveel is 10 en 2?','Waarom maakte je eerst 10?'][closingPhase];
  $('closing-reveal').textContent=['Toon de splitsing','Toon de uitkomst','Nog eens denken'][closingPhase];
}
function showLesson(view){
  if(!cursor)return;
  pauseAll();contents.close();toggleControls(false);lessonView=view;
  if(view==='closing'){closingPhase=0;renderClosing();}
  render();(view==='intro'?$('intro-title'):view==='closing'?$('closing-title'):$('narration-play')).focus({preventScroll:true});
}
function openStory(restart=false){
  if(!cursor)return;
  pauseAll();lessonView='story';if(restart)cursor.goPage(0);alignNarration();render();$('narration-play').focus({preventScroll:true});
}
function focusNext() { $('next').focus({preventScroll:true}); }
function render() {
  const page = cursor.current, beat = cursor.passage;
  pictures.show(page.image,page.alt);
  $('chapter-title').textContent = page.title;
  $('speaker').textContent = beat.speaker === 'Meester Bob' ? 'Meester Bob vertelt' : beat.speaker;
  $('speaker').style.setProperty('--speaker-color',colors[beat.speaker] || colors['Meester Bob']);
  const passage=beat.speaker === 'Meester Bob' ? beat.text : `“${beat.text}”`;
  if($('passage').textContent!==passage){
    $('passage').textContent=passage;
    if(!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)$('copy-center').animate?.([{opacity:.5,transform:'translateY(2px)'},{opacity:1,transform:'none'}],{duration:160,easing:'ease-out'});
  }
  $('story-copy').dataset.dialogue = String(beat.speaker !== 'Meester Bob');
  $('story-copy').dataset.short = String(beat.text.length < 25);
  $('book').classList.toggle('text-hidden',!textVisible);
  $('text-toggle').setAttribute('aria-pressed',String(textVisible));
  $('text-toggle').title = textVisible ? 'Tekst verbergen (T)' : 'Tekst tonen (T)';
  $('page-progress').textContent = `Bladzijde ${cursor.page + 1} van ${pages.length}`;
  $('previous').disabled = textVisible ? cursor.atStart : cursor.page === 0;
  $('page-hint').hidden = !cursor.atStart || !textVisible;
  $('page-hint').textContent=timedPlayer()?'Start het voorlezen. Bij de telvraag stopt het verhaal.':'Tik op de bladzijde om verder te lezen';
  $('solve').hidden = !questionReady();
  $('next').textContent = timedPlayer()&&timedPlayer().state!=='ended'?'Voorlezen starten of pauzeren':cursor.lastPage && (!textVisible || cursor.lastBeat) ? 'Wat heb ik geleerd? →' : questionReady() ? 'Verder met het verhaal →' : !textVisible || cursor.lastBeat ? 'Volgende bladzijde →' : 'Verder →';
  $('beat-dots').replaceChildren(...page.beats.map((_,i)=>{
    const dot = document.createElement('i');
    dot.className = i === cursor.beat ? 'active' : i < cursor.beat ? 'read' : '';
    return dot;
  }));
  for (const button of $('page-grid').children) {
    if (lessonView==='story' && Number(button.dataset.page) === cursor.page) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  }
  for (const neighbor of [pages[cursor.page+1],pages[cursor.page+2],pages[cursor.page-1]]) {
    if(neighbor)pictures.preload(neighbor.image).catch(()=>{});
  }
  remember();
  updateVoiceControls();
  renderLesson();
  fitPassage();
}
function fitPassage() {
  if(!cursor)return;
  const spread=$('book-spread'), copy=$('story-copy'), passage=$('passage');
  const layout=cursor.current.layout;
  spread.dataset.layout=textVisible?layout.anchor:'image-only';
  spread.dataset.authored=String(!!layout.authoredSpace);
  copy.dataset.anchor=layout.anchor;
  copy.style.setProperty('--copy-width',`${layout.widthPct}%`);
  copy.style.setProperty('--copy-top',`${layout.topPct??3}%`);
  copy.style.setProperty('--copy-side',`${layout.sidePct??3}%`);
  copy.style.setProperty('--copy-bottom',`${layout.bottomPct??3}%`);
  passage.style.fontSize='';
  if(!textVisible)return;
  if (typeof getComputedStyle !== 'function') return;
  // Small screens use the short paper margin so large text cannot cover a face.
  const viewport=window.visualViewport;
  const width=viewport?.width||window.innerWidth;
  const height=viewport?.height||window.innerHeight;
  if(width<height || height<480 && !layout.authoredSpace)spread.dataset.layout='outside-top';
  if(!spread.dataset.layout.startsWith('outside')) {
    const frameBox=spread.getBoundingClientRect(), textBox=copy.getBoundingClientRect();
    // overlapsProtected already applies the safety margin. Expanding this
    // rectangle too would reject the authored space on pages 26 and 32.
    const box={x:(textBox.left-frameBox.left)/frameBox.width*100,
      y:(textBox.top-frameBox.top)/frameBox.height*100,
      w:textBox.width/frameBox.width*100,h:textBox.height/frameBox.height*100};
    if(box.h>layout.maxHeightPct || overlapsProtected(box,layout.protected))spread.dataset.layout='outside-top';
  }
}
function toggleControls(open) {
  controlsOpen=open;
  $('book-tools').hidden=!open;
  $('controls-toggle').setAttribute('aria-expanded',String(open));
  $('controls-toggle').setAttribute('aria-label',open?'Boekbediening sluiten':'Boekbediening openen');
  $('book').classList.toggle('controls-open',open);
}
function next() {
  if(!cursor||lessonView!=='story')return;
  if (!math.hidden || contents.open) return;
  if(controlsOpen){toggleControls(false);return;}
  if(questionReady()){continueStory();return;}
  if(timedPlayer()&&timedPlayer().state!=='ended'){toggleNarration();return;}
  pauseAll();
  if (cursor.lastPage && (!textVisible || cursor.lastBeat)){showLesson('closing');return;}
  else if (textVisible) cursor.next();
  else cursor.nextPage();
  alignNarration();
  render();
  playCurrentVoice();
}
function previous() {
  if(!cursor||lessonView!=='story')return;
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
    image.src = page.image; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
    const label = document.createElement('span'); label.className = 'card-label';
    const number = document.createElement('small');
    number.textContent = `Bladzijde ${index+1}`;
    label.append(number,document.createTextNode(page.title));
    button.append(image,label);
    if(page.puzzle){
      const badge=document.createElement('span');badge.className='card-puzzle';
      badge.textContent=`${page.puzzle.first} + ${page.puzzle.second} · Telmoment`;button.append(badge);
    }
    button.addEventListener('click',()=>{pauseAll();lessonView='story';cursor.goPage(index);contents.close();alignNarration();render();if(!timedPlayer())playCurrentVoice();focusNext();});
    return button;
  }));
}
let bridgeReady=false, mathGuideOpen=false;
function mathTools(open=false) {
  $('math-tools').hidden=!open;
  $('math-tools-toggle').setAttribute('aria-expanded',String(open));
}
function sendMathControl(action,extra={}) {
  if(!activePuzzle || math.hidden || frame.hidden || !bridgeReady)return;
  frame.contentWindow.postMessage({type:'forest-book:control',first:activePuzzle.first,second:activePuzzle.second,action,...extra},window.location.origin);
  mathTools();
}
function markMathComplete(complete) {
  $('math-skip').dataset.complete=String(complete);
  if(complete)$('math-action').hidden=true;
}
function closeMath(advance=false) {
  if (math.hidden) return;
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
  const total=puzzle.first+puzzle.second;
  $('simple-kicker').textContent=total===10?'Aanvullen tot 10':'Samen tellen';
  $('simple-equation').textContent=`${puzzle.first} + ${puzzle.second} = ?`;
  $('simple-hint').textContent=total===10?`Er liggen ${puzzle.first} bladeren. Er komen ${puzzle.second} bij. Hoeveel zijn het nu?`:`${puzzle.first} rode en ${puzzle.second} gele bladeren. Hoeveel samen?`;
  $('simple-feedback').textContent='';
  markMathComplete(false);
  $('ten-frame').setAttribute('aria-label',`${puzzle.first} en ${puzzle.second} stippen in een tienveld`);
  $('ten-frame').replaceChildren(...Array.from({length:10},(_,i)=>{
    const cell=document.createElement('span');
    cell.className=`ten-cell${i<puzzle.first?' first':i<total?' second':''}`;
    return cell;
  }));
  $('simple-choices').replaceChildren(...Array.from({length:10},(_,i)=>{
    const button=document.createElement('button');button.textContent=i+1;
    button.addEventListener('click',()=>{
      if(i+1!==total){$('simple-feedback').textContent='Kijk nog eens naar de twee groepjes.';return;}
      $('simple-equation').textContent=`${puzzle.first} + ${puzzle.second} = ${total}`;
      $('simple-feedback').textContent=total===10?'Precies tien. Het tienveld is vol.':`Samen ${total} bladeren.`;
      for(const choice of $('simple-choices').children)choice.disabled=true;
      markMathComplete(true);$('math-skip').focus({preventScroll:true});
    });
    return button;
  }));
}
function openMath() {
  if(!cursor||lessonView!=='story')return;
  const puzzle=cursor.current.puzzle;
  if(!puzzle || !math.hidden || !questionReady())return;
  pauseAll();
  const bridge=puzzle.first+puzzle.second>10;
  activePuzzle={...puzzle};bridgeReady=false;mathGuideOpen=false;
  $('math-title').textContent=`${bridge?'Brug over 10':puzzle.first+puzzle.second===10?'Aanvullen tot 10':'Optellen'}: ${puzzle.item}`;
  $('math-modes').hidden=!bridge;
  for(const mode of ['demo','guided','solo']){
    $('math-mode-'+mode).setAttribute('aria-pressed',String(mode==='demo'));
    $('math-mode-'+mode).disabled=true;
  }
  $('math-action').hidden=true;$('math-action').disabled=true;
  $('math-guide').hidden=!bridge;$('math-guide').disabled=bridge;
  $('math-reset').disabled=bridge;
  markMathComplete(false);mathTools();toggleControls(false);
  $('simple-math').hidden=bridge;frame.hidden=!bridge;
  frame.title=`Optellen van ${puzzle.item} met splitsing en sok`;
  $('math-loading').hidden=!bridge;
  $('book-spread').hidden=true;math.hidden=false;
  $('book').classList.toggle('calculating',true);
  if(bridge)frame.src=`trainer.html?book=1&first=${puzzle.first}&second=${puzzle.second}&mode=demo&view=book-page-1`;
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
$('voice-replay').addEventListener('click',()=>{
  const player=timedPlayer();
  if(player){const {track}=currentNarration();player.pause();player.seek(track.cues[player.cueIndex].start);player.play();}
  else playCurrentVoice();toggleControls(false);focusNext();
});
$('controls-toggle').addEventListener('click',()=>toggleControls(!controlsOpen));
$('contents-open').addEventListener('click',()=>{pauseAll();toggleControls(false);if(cursor)contents.showModal();updateVoiceControls();});
$('contents-close').addEventListener('click',()=>{contents.close();updateVoiceControls();$('controls-toggle').focus();});
$('restart').addEventListener('click',()=>{pauseAll();cursor.goPage(0);alignNarration();showLesson('intro');});
$('intro-start').addEventListener('click',()=>openStory(true));
$('intro-resume').addEventListener('click',()=>openStory());
$('closing-open').addEventListener('click',()=>showLesson('closing'));
$('closing-back').addEventListener('click',()=>{lessonView='story';render();focusNext();});
$('closing-reveal').addEventListener('click',()=>{closingPhase=(closingPhase+1)%3;renderClosing();});
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
  if(data.type==='forest-book:ready'){
    bridgeReady=true;$('math-loading').hidden=true;
  }
  if(data.type==='forest-book:state'){
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
  if(data.type==='forest-book:focus-action'){
    (!$('math-action').hidden && !$('math-action').disabled ? $('math-action') : $('math-skip')).focus({preventScroll:true});
  }
  if(data.type==='forest-book:back')closeMath();
  if(data.type==='forest-book:complete')closeMath(true);
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
  if (!cursor || event.altKey || event.ctrlKey || event.metaKey || event.repeat || contents.open) return;
  if(!math.hidden){
    if(event.key==='Escape'){event.preventDefault();if(!$('math-tools').hidden)mathTools();else closeMath();}
    return;
  }
  if(lessonView!=='story')return;
  if(event.key==='Escape' && controlsOpen){event.preventDefault();toggleControls(false);return;}
  if (['ArrowRight','PageDown'].includes(event.key)) {event.preventDefault();next();}
  if (['ArrowLeft','PageUp'].includes(event.key)) {event.preventDefault();previous();}
  if (event.key.toLowerCase()==='t') {event.preventDefault();toggleText();}
});

try {
  const response = await fetch('book-pages.json?v=book-narration-7');
  if (!response.ok) throw new Error('Book content unavailable');
  pages = prepareReadingPages(await response.json());
  let saved = {};
  try {
    saved=JSON.parse(localStorage.getItem(STORAGE))||{};
    if(!localStorage.getItem(STORAGE)) {
      const previous=JSON.parse(localStorage.getItem('herfst-boek-2026-v3'))||JSON.parse(localStorage.getItem('herfst-boek-2026-v2'))||JSON.parse(localStorage.getItem('herfst-boek-2026-v1'));
      if(previous && pages[previous.page]) {
        // Narration is shorter in the painted edition; retain the page and
        // start its new reading sequence rather than reusing an old text index.
        saved={...previous,page:[0,3,4,1,2][previous.page]??previous.page,beat:0};
      }
    }
  } catch {}
  cursor = new BookCursor(pages,saved);
  const requestedPage=new URLSearchParams(window.location?.search||'').get('bladzijde');
  if(requestedPage && /^\d+$/.test(requestedPage)&&cursor.goPage(Number(requestedPage)-1))lessonView='story';
  if(new URLSearchParams(window.location?.search||'').get('verder')==='1')lessonView='story';
  if (typeof saved.textVisible==='boolean') textVisible=saved.textVisible;
  fillContents();alignNarration();render();
  document.fonts?.ready.then(()=>fitPassage());
} catch {
  $('intro-status').hidden=false;$('intro-status').textContent='Het verhaal kon niet laden. Vernieuw de pagina om opnieuw te proberen.';
  $('image-status').textContent = 'Het verhaal kon niet worden geopend. Vernieuw de pagina om opnieuw te proberen.';
  $('next').disabled = true; $('previous').disabled = true;
}
