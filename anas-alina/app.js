import { LessonSession } from './lesson.mjs?v=extra-1';
import { BridgeExercise } from './logic.mjs';
import {applyTempoStyles,tempoStorageKey} from './playback-tempo.mjs?v=1';
import {createPracticeSeries} from './practice-series.mjs?v=1';

applyTempoStyles();
window.addEventListener('storage',event=>{if(event.key===tempoStorageKey)applyTempoStyles();});

const $ = id => document.getElementById(id);
// The book opens a fixed calculation; the standalone lesson keeps its full flow.
const bookExercise = (() => {
  const query = new URLSearchParams(window.location?.search || '');
  if (query.get('book') !== '1') return null;
  const first = query.get('first'), second = query.get('second');
  const mode = query.get('mode') || 'demo';
  if (!/^1[1-9]$/.test(first || '') || !/^[1-9]$/.test(second || '') || Number(first)-Number(second)>=10 || Number(first)-Number(second)<1 || !['demo','guided','solo'].includes(mode)) return null;
  return {first:Number(first),second:Number(second),mode};
})();
const extraPractice=(()=>{
  const query=new URLSearchParams(window.location?.search||'');
  if(bookExercise||query.get('extra')!=='1')return null;
  return {mode:['demo','guided','solo'].includes(query.get('mode'))?query.get('mode'):'solo'};
})();
const sequence=extraPractice?createPracticeSeries():null;
let seriesNumber=1;
const session = new LessonSession(extraPractice?.mode||'demo',extraPractice?{practicePairs:sequence.next()}:{});
$('extra-nav').hidden=!extraPractice;
$('trainer-header').hidden=!!extraPractice;
const story={enabled:false,visible:false,scene:null,reset:()=>session.reset(),setMode:mode=>session.setMode(mode),advance:()=>session.advance(),repeatGuided:()=>session.repeatGuided()};
function setBookMode(mode) {
  if (!session.setMode(mode)) return;
  session.exercise = new BridgeExercise(bookExercise.first, bookExercise.second);
  session.chapter = 'activity';
  session.lastTarget = session.target;
  story.enabled = false;
  story.scene = null;
}
if (bookExercise) {
  setBookMode(bookExercise.mode);
  $('viewport').classList.toggle('book-embedded',true);
  $('stage').classList.toggle('book-embedded',true);
} else if(extraPractice){
  if(extraPractice.mode==='demo')session.chapter='activity';
  $('viewport').classList.toggle('book-extra',true);
  $('stage').classList.toggle('book-extra',true);
}
const notifyBook = (type,details={}) => {
  if (bookExercise) window.parent.postMessage({type,first:bookExercise.first,second:bookExercise.second,...details},window.location.origin);
};
let exercise = session.exercise;
const partButtons = [$('part-left'),$('part-right')];
let feedback = '', badField = null;
let guideOpen = false, guideFocus = null;
const canInteract = () => session.canInteract && !story.visible && !guideOpen;

function fit() {
  const width = window.visualViewport?.width || innerWidth;
  const height = window.visualViewport?.height || innerHeight;
  const stageHeight=bookExercise||extraPractice?760:810,topInset=extraPractice?56:0;
  const scale = Math.min(width / 1440, (height-topInset) / stageHeight);
  Object.assign($('stage').style,{transform:`scale(${scale})`,left:`${(width-1440*scale)/2}px`,top:`${topInset+(height-topInset-stageHeight*scale)/2}px`});
  if(extraPractice){
    const choiceSize=Math.max(128,44/scale);
    $('stage').style.setProperty('--extra-instruction-size',`${Math.max(44,20/scale)}px`);
    $('stage').style.setProperty('--extra-choice-size',`${choiceSize}px`);
    $('stage').style.setProperty('--extra-choice-top',`${Math.min(690,stageHeight+70-choiceSize)}px`);
  }
  if (bookExercise) {
    // Keep the book's short instruction readable after the whole equation scales.
    $('stage').style.setProperty('--book-instruction-size',`${Math.min(64,Math.max(44,20/scale))}px`);
    $('stage').style.setProperty('--book-choice-width',`${Math.min(135,Math.max(128,44/scale))}px`);
    $('stage').style.setProperty('--book-choice-height',`${Math.min(135,Math.max(100,44/scale))}px`);
  }
}
addEventListener('resize',fit);
window.visualViewport?.addEventListener('resize',fit);
fit();

function instruction() {
  if(feedback)return feedback;
  if(session.chapter==='goal')return 'Lees het doel samen. Wat betekent eerst terug naar 10?';
  if(session.chapter==='prior')return 'Laat iedereen eerst nadenken en antwoorden.';
  if(session.chapter==='prior-answers')return 'Bespreek teruggaan naar 10 en splitsen.';
  if(session.mode==='demo')return session.demoWords;
  if(session.chapter==='discussion')return 'Waarom splits je bij 12 min 5 de 5 in 2 en 3?';
  if(session.mode==='guided'&&session.chapter==='activity')return session.question;
  const {phase,first,second,activePart,chosen}=exercise;
  if(phase==='start')return `Tik op de ${second} om te splitsen.`;
  if(phase==='split')return activePart===0?'Vul in wat er eerst af moet tot 10.':'Vul in wat er daarna nog af moet.';
  if(phase==='group')return chosen.size?'Tik ook het andere getal van de eerste aftrekking aan.':'Welke aftrekking brengt ons op 10? Tik de twee getallen aan.';
  if(phase==='remainder')return 'Welk deel moet er nog van 10 af? Vul het bovenaan in.';
  if(phase==='answer')return `10 min ${exercise.remainder}. Hoeveel blijft er over?`;
  return `Goed! Eerst naar 10, dan nog ${exercise.remainder} eraf.`;
}
function numberState(element,{active=false,pickable=false,chosen=false,settled=false,invalid=false,disabled=true}={}) {
  for (const [name,on] of Object.entries({active,pickable,chosen,settled,invalid})) element.classList.toggle(name,on);
  element.disabled = disabled;
  if (pickable) element.setAttribute('aria-pressed',String(chosen)); else element.removeAttribute('aria-pressed');
}
function render() {
  exercise = session.exercise;
  const {phase, parts, activePart, chosen, first, second} = exercise;
  const interact = canInteract();
  const split = phase !== 'start';
  const sock = ['remainder','answer','done'].includes(phase);
  const final = ['answer','done'].includes(phase);
  $('equation').classList.toggle('has-sock', sock);
  $('equation').classList.toggle('is-final', final);
  $('equation').hidden = session.intro;
  $('first').textContent = first;
  $('second').textContent = second;
  $('second').setAttribute('aria-label',phase === 'start' ? `Splits de ${second}` : `Het getal ${second} is gesplitst`);
  numberState($('second'),{pickable:phase==='start',disabled:!interact||phase!=='start'});
  numberState($('first'),{pickable:phase==='group',chosen:chosen.has('first'),settled:sock,disabled:!interact||phase!=='group'});
  $('first').setAttribute('aria-label',phase === 'group' ? `Kies ${first} voor de eerste aftrekking` : String(first));
  // SVG does not reflect the HTML .hidden property; change the attribute itself.
  $('split-arrows').toggleAttribute('hidden', !split);
  partButtons.forEach((button,index)=>{
    button.hidden = !split;
    button.textContent = parts[index] === null ? '?' : parts[index];
    const pickable = phase==='group';
    numberState(button,{active:phase==='split'&&activePart===index,pickable,chosen:index===0&&chosen.has('part'),settled:sock,invalid:badField===`part-${index}`,disabled:!interact||!['split','group'].includes(phase)});
    button.setAttribute('aria-label',`${index===0?'Eerste':'Tweede'} deel van ${second}: ${parts[index]===null?'nog in te vullen':parts[index]}${phase==='split'?', kies dit vakje om het in te vullen':''}`);
  });
  $('sock').toggleAttribute('hidden', !sock);
  $('sock-operation').hidden = !sock;
  $('sock-label').hidden = !sock;
  $('initial-gap').hidden = sock;
  for (const id of ['ten','ten-plus','remainder']) $(id).hidden = !sock;
  $('remainder').textContent = exercise.enteredRemainder === null ? '?' : exercise.enteredRemainder;
  numberState($('remainder'),{active:phase==='remainder',settled:final,invalid:badField==='remainder',disabled:!interact||phase!=='remainder'});
  for (const id of ['final-equals','answer']) $(id).hidden = !final;
  $('answer').textContent = exercise.answer === null ? '?' : exercise.answer;
  numberState($('answer'),{active:phase==='answer',settled:phase==='done',invalid:badField==='answer',disabled:!interact||phase!=='answer'});
  $('instruction').textContent = instruction();
  $('instruction').classList.toggle('feedback',!!feedback);
  const withChoices = interact && ['split','remainder','answer'].includes(phase);
  $('choices').hidden = !withChoices;
  $('finished').hidden = phase!=='done' || session.mode !== 'solo' || !!extraPractice;
  const choices=Array.from({length:9},(_,i)=>1+i);
  const rangeKey = phase==='answer' ? 'answers' : 'parts';
  // Keep number buttons mounted while splitting so touch/keyboard focus is stable.
  if ($('choices').dataset.range !== rangeKey) {
    $('choices').replaceChildren();
    for (const value of choices) {
      const button = document.createElement('button');
      button.className = 'choice'; button.textContent = value; button.dataset.value = value;
      button.setAttribute('aria-label',`Kies ${value}`);
      button.addEventListener('click',()=>choose(value));
      $('choices').append(button);
    }
    $('choices').dataset.range = rangeKey;
  }
  $('choices').setAttribute('aria-label',phase==='answer'?'Kies wat overblijft, 1 tot en met 9':'Kies een getal, 1 tot en met 9');
  $('equation').setAttribute('aria-label',phase==='done'?`${first} min ${second} is 10 min ${exercise.remainder} is ${exercise.total}`:sock?`${first} min ${second} is 10 min ${exercise.enteredRemainder===null?'hoeveel':exercise.enteredRemainder}`:`${first} min ${second}. ${split?'Splits de '+second:'Hoeveel blijft over?'}`);
  renderLesson();
  renderStory();
  if (bookExercise) notifyBook('delen-book:state',{
    mode:session.mode,
    actionLabel:$('lesson-action').textContent,
    actionVisible:!$('lesson-action').hidden,
    guideOpen,
    complete:exercise.phase==='done'
  });
}
function renderLesson() {
  for (const mode of ['demo','guided','solo']) {
    $('mode-'+mode).setAttribute('aria-pressed',String(session.mode===mode));
    $('extra-mode-'+mode).setAttribute('aria-pressed',String(session.mode===mode));
  }
  $('lesson-intro').hidden = !session.intro;
  const prior = ['prior','prior-answers'].includes(session.chapter);
  $('prior-prompts').hidden = !prior;
  $('intro-kicker').textContent = prior ? 'Voorkennis' : 'Ons doel';
  $('intro-title').textContent = prior ? 'Wat weten we al?' : 'Eerst terug naar 10';
  $('intro-body').textContent = prior ? 'Teruggaan naar 10 en een getal splitsen.' : 'Ik kan aftrekken tot twintig met brug over tien. Eerst naar 10, dan de rest eraf.';
  $('prior-ten').textContent = session.chapter==='prior-answers' ? '15 − 5 = 10' : '15 − ? = 10';
  $('prior-split').textContent = session.chapter==='prior-answers' ? '8 = 5 + 3' : '8 = 5 + ?';
  const decision = session.chapter==='discussion';
  $('decision').hidden = !decision;
  const withAction = !decision && !!session.actionLabel && !(session.chapter==='check' && exercise.phase!=='done');
  $('lesson-action').hidden = !withAction;
  $('lesson-action').textContent = bookExercise && exercise.phase==='done' ? 'Verder met het verhaal' : story.enabled && exercise.phase==='done' && !decision ? 'Naar het verhaal →' : session.actionLabel;
  if(extraPractice&&session.mode==='solo'&&exercise.phase==='done')$('lesson-action').textContent=session.practiceIndex===session.practice.length-1?'Nieuwe reeks →':'Volgende oefening →';
  $('extra-action').hidden=!extraPractice||!withAction;
  $('extra-action').disabled=guideOpen;
  $('extra-action').textContent=$('lesson-action').textContent;
  $('extra-progress').hidden=!extraPractice||session.mode!=='solo';
  $('extra-progress').textContent=`Reeks ${seriesNumber} · ${session.practiceIndex+1} / ${session.practice.length}`;
  $('stage').classList.toggle('with-action',withAction);
  $('context-label').textContent = session.chapter==='check' ? 'Korte controle' : decision ? 'Bespreek de aanpak' : session.mode==='guided' && !session.ready && exercise.phase!=='done' ? 'Eerst samen nadenken' : '';
  $('guide-heading').textContent = session.mode==='demo'?'Hardop voordoen':session.mode==='guided'?'Samen oefenen en begrijpen':'Zelfstandig oefenen';
  $('guide-current').textContent = session.intro ? 'Benoem het lesdoel. Controleer teruggaan naar tien, splitsen en aftrekken van tien. Laat alle leerlingen antwoorden voordat je verdergaat.' : session.mode==='demo' ? session.demoWords : session.question;
  const e=exercise;
  $('guide-explanation').textContent=session.chapter==='discussion'
    ? 'Verwachte uitleg: van 12 naar 10 moet er 2 af. Daarom splits ik 5 in 2 en 3. Na de eerste 2 moeten er nog 3 af. Zo blijft 7 over. Oefen samen verder als de kinderen dit nog niet kunnen uitleggen.'
    : `Van ${e.first} naar 10 moet er ${e.needed} af. Splits ${e.second} in ${e.needed} en ${e.remainder}. Eerst ${e.first} min ${e.needed} is 10; dan 10 min ${e.remainder} is ${e.total}. Samen nemen we precies ${e.second} weg.`;
}
function act(result,field=null) {
  session.afterInput();
  feedback = result.message || '';
  badField = result.ok ? null : field;
  render();
}
function choose(value) {
  if (!canInteract()) return;
  const before = exercise.phase;
  const beforePart = exercise.activePart;
  const result = exercise.choose(value);
  const field = before==='split'?`part-${exercise.activePart}`:before;
  if (result.reason==='ten') act(result,'part-0'); else act(result,field);
  if (before !== exercise.phase || (exercise.phase === 'split' && beforePart !== exercise.activePart)) focusNext();
}
function focusNext() {
  if(guideOpen)return;
  if(bookExercise && (exercise.phase==='done' || !session.canInteract)){
    notifyBook('delen-book:focus-action');return;
  }
  if(session.chapter==='discussion'){ $('go-solo').focus({preventScroll:true});return; }
  if(extraPractice&&(!session.canInteract||exercise.phase==='done')){$('extra-action').focus({preventScroll:true});return;}
  if(!session.canInteract){ $('lesson-action').focus({preventScroll:true});return; }
  const phase = exercise.phase;
  const target = phase==='split' ? partButtons[exercise.activePart] : phase==='group' ? $('first') : phase==='remainder' ? $('remainder') : phase==='answer' ? $('answer') : phase==='done' ? $('reset') : $('second');
  target.focus({preventScroll:true});
}
$('second').addEventListener('click',()=>{if(!canInteract())return;act(exercise.openSplit());focusNext();});
$('first').addEventListener('click',()=>{if(!canInteract())return;act(exercise.selectForSock('first'));if(exercise.phase==='remainder')focusNext();});
partButtons.forEach((button,index)=>button.addEventListener('click',()=>{
  if(!canInteract())return;
  if(exercise.phase==='split') { exercise.focusPart(index); session.afterInput();feedback='';badField=null;render(); }
  else if(exercise.phase==='group') {act(exercise.selectForSock(index===0?'part':'other'),`part-${index}`);if(exercise.phase==='remainder')focusNext();}
}));
for (const id of ['remainder','answer']) $(id).addEventListener('click',()=>{feedback='';badField=null;render();});
function resetLesson() {
  if(bookExercise)setBookMode(session.mode);else story.reset();
  if(extraPractice&&session.mode==='demo')session.chapter='activity';
  feedback='';badField=null;render();focusNext();
}
$('reset').addEventListener('click',resetLesson);
function changeMode(mode) {
  if(guideOpen)return;if(bookExercise)setBookMode(mode);else story.setMode(mode);
  if(extraPractice&&mode==='demo')session.chapter='activity';
  feedback='';badField=null;render();focusNext();
}
for(const mode of ['demo','guided','solo']) {
  $('mode-'+mode).addEventListener('click',()=>changeMode(mode));
  $('extra-mode-'+mode).addEventListener('click',()=>{extraTools(false);changeMode(mode);});
}
function advanceLesson() {
  if(guideOpen || $('lesson-action').hidden || $('lesson-action').disabled)return;
  if(bookExercise && exercise.phase==='done'){notifyBook('delen-book:complete');return;}
  if(extraPractice&&session.mode==='solo'&&exercise.phase==='done'&&session.practiceIndex===session.practice.length-1){
    session.practice=sequence.next();session.practiceIndex=-1;seriesNumber++;
  }
  story.advance();feedback='';badField=null;render();focusNext();
}
$('lesson-action').addEventListener('click',advanceLesson);
$('extra-action').addEventListener('click',advanceLesson);
$('repeat-guided').addEventListener('click',()=>{story.repeatGuided();feedback='';badField=null;render();focusNext();});
$('go-solo').addEventListener('click',()=>{story.setMode('solo');feedback='';badField=null;render();focusNext();});
function renderStory() {
  $('math-activity').hidden=false;
  $('stage').classList.toggle('in-story',false);
}
function toggleGuide(open) {
  guideOpen=open;$('guide-overlay').hidden=!open;
  if(open){guideFocus=document.activeElement;render();$('guide-card').scrollTop=0;$('guide-close').focus({preventScroll:true});}
  else{
    render();
    if(bookExercise)focusNext();else guideFocus?.focus({preventScroll:true});
  }
}
$('guide-open').addEventListener('click',()=>toggleGuide(true));
$('guide-close').addEventListener('click',()=>toggleGuide(false));
$('guide-done').addEventListener('click',()=>toggleGuide(false));
$('guide-overlay').addEventListener('click',event=>{if(event.target===$('guide-overlay'))toggleGuide(false);});
function extraTools(open){$('extra-tools').hidden=!open;$('extra-menu-toggle').setAttribute('aria-expanded',String(open));}
$('extra-menu-toggle').addEventListener('click',()=>extraTools($('extra-tools').hidden));
$('extra-guide').addEventListener('click',()=>{extraTools(false);toggleGuide(true);});
$('extra-reset').addEventListener('click',()=>{extraTools(false);resetLesson();});
document.addEventListener('click',event=>{if(!event.composedPath?.().includes($('extra-menu')))extraTools(false);});
addEventListener('message',event=>{
  if(!bookExercise || event.origin!==window.location.origin || event.source!==window.parent)return;
  const message=event.data;
  if(!message || typeof message!=='object' || message.type!=='delen-book:control' || message.first!==bookExercise.first || message.second!==bookExercise.second)return;
  if(message.action==='mode' && ['demo','guided','solo'].includes(message.mode))changeMode(message.mode);
  else if(message.action==='reset')resetLesson();
  else if(message.action==='guide')toggleGuide(!guideOpen);
  else if(message.action==='advance')advanceLesson();
});
async function toggleFullscreen(){
  try {
    if(document.fullscreenElement) await document.exitFullscreen();
    else if(document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
  } catch { $('fullscreen').title='Volledig scherm is niet beschikbaar in deze browser'; }
}
$('fullscreen').addEventListener('click',toggleFullscreen);
$('extra-fullscreen').addEventListener('click',()=>{extraTools(false);toggleFullscreen();});
document.addEventListener('fullscreenchange',()=>{ $('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Verlaat volledig scherm':'Volledig scherm');fit(); });
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!$('extra-tools').hidden){event.preventDefault();extraTools(false);return;}
  if(guideOpen){
    if(event.key==='Escape'){event.preventDefault();toggleGuide(false);}
    else if(event.key==='Tab'){
      if(event.shiftKey&&document.activeElement===$('guide-close')){event.preventDefault();$('guide-done').focus();}
      else if(!event.shiftKey&&document.activeElement===$('guide-done')){event.preventDefault();$('guide-close').focus();}
    }
    return;
  }
  if(bookExercise && event.key==='Escape'){
    event.preventDefault();notifyBook('delen-book:back');return;
  }
  if(event.altKey||event.ctrlKey||event.metaKey||event.repeat) return;
  if(/^[1-9]$/.test(event.key)&&['split','remainder'].includes(exercise.phase)) {event.preventDefault();choose(Number(event.key));}
});
render();
if (bookExercise) notifyBook('delen-book:ready');
