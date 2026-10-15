import { LessonSession } from './lesson.mjs';
import { StoryFlow } from './story.mjs';
import { BridgeExercise } from './logic.mjs';

const $ = id => document.getElementById(id);
// The book opens a fixed calculation; the standalone lesson keeps its full flow.
const bookExercise = (() => {
  const query = new URLSearchParams(window.location?.search || '');
  if (query.get('book') !== '1') return null;
  const first = query.get('first'), second = query.get('second');
  const mode = query.get('mode') || 'demo';
  if (!/^[1-9]$/.test(first || '') || !/^[1-9]$/.test(second || '') || Number(first) + Number(second) <= 10 || !['demo','guided','solo'].includes(mode)) return null;
  return {first:Number(first),second:Number(second),mode};
})();
const session = new LessonSession();
const story = new StoryFlow(session);
const extraPractice=(()=>{
  const query=new URLSearchParams(window.location?.search||'');
  if(bookExercise || query.get('extra')!=='1')return null;
  const mode=query.get('mode');
  return {mode:['demo','guided','solo'].includes(mode)?mode:'solo'};
})();
$('extra-nav').hidden=!extraPractice;
$('trainer-header').hidden=!!extraPractice;
$('forest-picker').hidden=!!extraPractice;
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
  story.setMode(extraPractice.mode);
  if(extraPractice.mode==='demo'){session.chapter='activity';story.scene='problem';}
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
  const stageHeight=bookExercise?760:810;
  const topInset=extraPractice?56:0;
  const scale = Math.min(width / 1440, (height-topInset) / stageHeight);
  Object.assign($('stage').style,{transform:`scale(${scale})`,left:`${(width-1440*scale)/2}px`,top:`${topInset+(height-topInset-stageHeight*scale)/2}px`});
  if (bookExercise) {
    // Keep the book's short instruction readable after the whole equation scales.
    $('stage').style.setProperty('--book-instruction-size',`${Math.min(64,Math.max(44,20/scale))}px`);
    $('stage').style.setProperty('--book-choice-height',`${Math.min(135,Math.max(100,44/scale))}px`);
  }
}
addEventListener('resize',fit);
window.visualViewport?.addEventListener('resize',fit);
fit();

function instruction() {
  if (feedback) return feedback;
  if (session.chapter === 'goal') return 'Lees het doel samen. Wat betekent aanvullen tot 10?';
  if (session.chapter === 'prior') return 'Laat iedereen eerst nadenken en antwoorden.';
  if (session.chapter === 'prior-answers') return 'Bespreek de antwoorden. Oefen nog even als dat nodig is.';
  if (session.mode === 'demo') return session.demoWords;
  if (session.chapter === 'discussion') return 'Waarom splits je bij 9 + 4 de 4 in 1 en 3?';
  if (session.mode === 'guided' && session.chapter === 'activity') return session.question;
  const {phase, first, second, activePart, parts, chosen} = exercise;
  if (phase === 'start') return `Tik op de ${second} om te splitsen.`;
  if (phase === 'split') return activePart === 0 ? 'Vul het eerste deel van de splitsing in.' : 'Vul het tweede deel van de splitsing in.';
  if (phase === 'group') return chosen.size ? 'Tik ook het andere getal aan dat erbij hoort.' : 'Welke twee getallen maken samen 10? Tik ze aan.';
  if (phase === 'remainder') return 'Welk deel blijft buiten de sok? Vul het bovenaan in.';
  if (phase === 'answer') return `10 en nog ${exercise.remainder}. Hoeveel is dat samen?`;
  return `Goed! Eerst 10 maken, dan ${exercise.remainder} erbij.`;
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
  $('first').setAttribute('aria-label',phase === 'group' ? `Kies ${first} voor de sok` : String(first));
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
  $('finished').hidden = phase!=='done' || session.mode !== 'solo';
  const choices = phase==='answer' ? Array.from({length:10},(_,i)=>10+i) : Array.from({length:9},(_,i)=>1+i);
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
  $('choices').setAttribute('aria-label',phase==='answer'?'Kies het eindantwoord, 10 tot en met 19':'Kies een getal, 1 tot en met 9');
  $('equation').setAttribute('aria-label',phase==='done' ? `${first} plus ${second} is 10 plus ${exercise.remainder} is ${exercise.total}` : sock ? `${first} plus ${second} is 10 plus ${exercise.enteredRemainder===null?'hoeveel':exercise.enteredRemainder}${final?', samen hoeveel':''}` : split ? `${first} plus ${second}. Splits de ${second}.` : `${first} plus ${second} is hoeveel`);
  renderLesson();
  renderStory();
  if (bookExercise) notifyBook('forest-book:state',{
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
    $('extra-mode-'+mode).disabled=guideOpen;
  }
  $('extra-menu-toggle').disabled=guideOpen;
  $('lesson-intro').hidden = !session.intro;
  const prior = ['prior','prior-answers'].includes(session.chapter);
  $('prior-prompts').hidden = !prior;
  $('intro-kicker').textContent = prior ? 'Voorkennis' : 'Ons doel';
  $('intro-title').textContent = prior ? 'Wat weten we al?' : 'Eerst 10 maken';
  $('intro-body').textContent = prior ? 'Aanvullen tot 10 en een getal splitsen.' : 'Ik kan een som over tien uitrekenen door eerst 10 te maken. Met 10 kan ik handig rekenen.';
  $('prior-ten').textContent = session.chapter==='prior-answers' ? '7 + 3 = 10' : '7 + ? = 10';
  $('prior-split').textContent = session.chapter==='prior-answers' ? '5 = 2 + 3' : '5 = 2 + ?';
  const decision = session.chapter==='discussion';
  $('decision').hidden = !decision;
  const withAction = !decision && !!session.actionLabel && !(session.chapter==='check' && exercise.phase!=='done');
  $('lesson-action').hidden = !withAction;
  $('lesson-action').textContent = bookExercise && exercise.phase==='done' ? 'Verder met het verhaal' : story.enabled && exercise.phase==='done' && !decision ? 'Naar het verhaal →' : session.actionLabel;
  if(extraPractice && exercise.phase==='done' && !decision)$('lesson-action').textContent=session.mode==='demo'?'Samen oefenen →':session.mode==='guided'&&session.chapter==='check'?'Bespreek aanpak':'Volgende oefening →';
  $('stage').classList.toggle('with-action',withAction);
  $('context-label').textContent = session.chapter==='check' ? 'Korte controle' : decision ? 'Bespreek de aanpak' : session.mode==='guided' && !session.ready && exercise.phase!=='done' ? 'Eerst samen nadenken' : '';
  $('guide-heading').textContent = session.mode==='demo'?'Hardop voordoen':session.mode==='guided'?'Samen oefenen en begrijpen':'Zelfstandig oefenen';
  $('guide-current').textContent = session.intro ? 'Bespreek het doel en waarom rekenen met 10 helpt. Controleer aanvullen tot 10, splitsen en optellen met 10. Geef extra uitleg waar nodig.' : session.mode==='demo' ? session.demoWords : session.question;
  const e=exercise;
  $('guide-explanation').textContent = session.chapter==='discussion'
    ? 'Verwachte uitleg: 9 heeft nog 1 nodig tot 10. Daarom splits ik 4 in 1 en 3. Er gaat niets verloren: 1 en 3 blijven samen 4. Als kinderen dit nog niet kunnen uitleggen, oefen dan samen verder.'
    : `${e.first} heeft ${e.needed} nodig tot 10. Daarom splitsen we ${e.second} in ${e.needed} en ${e.remainder}. Samen blijft dat ${e.second}. In de sok is altijd 10; ${e.remainder} blijven over.`;
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
    notifyBook('forest-book:focus-action');return;
  }
  if(story.visible){$('story-action').focus({preventScroll:true});return;}
  if(session.chapter==='discussion'){ $('go-solo').focus({preventScroll:true});return; }
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
  if(extraPractice && session.mode==='demo'){session.chapter='activity';story.scene='problem';}
  feedback='';badField=null;render();focusNext();
}
$('reset').addEventListener('click',resetLesson);
function changeMode(mode) {
  if(guideOpen)return;if(bookExercise)setBookMode(mode);else story.setMode(mode);
  if(extraPractice && mode==='demo'){session.chapter='activity';story.scene='problem';}
  feedback='';badField=null;render();focusNext();
}
for(const mode of ['demo','guided','solo']) {
  $('mode-'+mode).addEventListener('click',()=>changeMode(mode));
  $('extra-mode-'+mode).addEventListener('click',()=>{extraTools(false);changeMode(mode);});
}
function advanceLesson() {
  if(guideOpen || $('lesson-action').hidden || $('lesson-action').disabled)return;
  if(bookExercise && exercise.phase==='done'){notifyBook('forest-book:complete');return;}
  if(extraPractice && exercise.phase==='done')story.transition(()=>session.advance());else story.advance();
  feedback='';badField=null;render();focusNext();
}
$('lesson-action').addEventListener('click',advanceLesson);
$('repeat-guided').addEventListener('click',()=>{story.repeatGuided();feedback='';badField=null;render();focusNext();});
$('go-solo').addEventListener('click',()=>{story.setMode('solo');feedback='';badField=null;render();focusNext();});
function renderPile(id,count) {
  const pile=$(id);
  const theme=story.theme;
  if(pile.dataset.count===`${theme.id}-${count}`)return;
  pile.replaceChildren();
  for(let i=0;i<count;i++) {
    const acorn=document.createElement(theme.id==='squirrel'?'img':'span');
    if(theme.id==='squirrel'){acorn.src='assets/acorn.png';acorn.alt='';}
    else acorn.className=`count-object object-${theme.id}`;
    acorn.setAttribute('aria-hidden','true');
    pile.append(acorn);
  }
  pile.dataset.count=`${theme.id}-${count}`;
  pile.setAttribute('aria-label',`${count} ${theme.item}`);
}
function renderStory() {
  const visible=story.visible, result=story.scene==='result', opening=story.scene==='opening';
  $('story-scene').hidden=!visible;
  $('math-activity').hidden=visible;
  $('stage').classList.toggle('in-story',visible);
  $('story-scene').classList.toggle('is-opening',opening);
  $('story-scene').classList.toggle('is-result',result);
  $('story-toggle').setAttribute('aria-pressed',String(story.enabled));
  $('story-toggle').hidden = !!bookExercise || !!extraPractice;
  $('story-toggle').setAttribute('aria-label',story.enabled?'Verhaal uitschakelen':'Verhaal inschakelen');
  const e=exercise, theme=story.theme;
  $('story-scene').dataset.theme=theme.id;
  $('story-scene').style.backgroundImage=`url('assets/${theme.background}')`;
  for(const id of ['squirrel','hedgehog','mouse','beaver']) $('forest-'+id).setAttribute('aria-pressed',String(theme.id===id));
  for(const side of ['left','right']) {
    const animal=$('animal-'+side);
    animal.style.backgroundImage=`url('assets/${theme.sprite===null?'squirrels.png':'forest-animals.png'}')`;
    animal.style.backgroundSize=theme.sprite===null?'400% 200%':theme.spriteSize||'300% 100%';
    animal.style.backgroundPosition=theme.sprite===null?(side==='left'?'0 0':'0 100%'):`${theme.sprite}% 0`;
    $('friend-'+side).style.transform=side==='right'&&theme.sprite!==null?'scaleX(-1)':'';
  }
  $('story-kicker').textContent=theme.place;
  $('story-title').textContent=result?`Samen ${e.total} ${theme.item}!`:opening?theme.title:'Hoeveel hebben ze samen?';
  $('story-text').textContent=result?theme.ending(e.total):opening?theme.intro:theme.problem(e.first,e.second);
  $('story-piles').hidden=opening;
  $('pile-left-label').textContent=result?'Eerst 10':`${theme.left} · ${e.first} ${theme.item}`;
  $('pile-right-label').textContent=result?`${e.remainder} erbij`:`${theme.right} · ${e.second} ${theme.item}`;
  renderPile('pile-left',result?10:e.first);
  renderPile('pile-right',result?e.remainder:e.second);
  $('story-total').hidden=!result;
  $('story-total').textContent=`10 + ${e.remainder} = ${e.total}`;
  $('story-prompt').textContent=result?theme.finish:opening?'Helpen jullie hen tellen?':'We rekenen het uit door eerst 10 te maken.';
  $('story-action').textContent=story.actionLabel;
  if(story.enabled && !session.intro && !$('context-label').textContent) $('context-label').textContent=`Hoeveel ${theme.item} hebben ze samen?`;
  if(visible){
    $('guide-current').textContent=opening?`Introduceer ${theme.left} en ${theme.right}. Ga daarna naar het lesdoel en de voorkennis.`:result?`Verbind de uitkomst ${e.total} met het verhaal. De hoeveelheid blijft gelijk: eerst 10, dan ${e.remainder} erbij.`:`Laat kinderen de hoeveelheden benoemen. Welke som past bij ${e.first} en ${e.second} ${theme.item} samen? Ga daarna naar het rekenscherm.`;
  }
}
$('story-action').addEventListener('click',()=>{if(guideOpen)return;story.advance();feedback='';badField=null;render();focusNext();});
for(const [index,id] of ['squirrel','hedgehog','mouse','beaver'].entries()) $('forest-'+id).addEventListener('click',()=>{if(extraPractice||guideOpen||!story.visible)return;story.chooseStory(index);render();});
$('story-toggle').addEventListener('click',()=>{if(guideOpen)return;story.toggle();feedback='';badField=null;render();focusNext();});
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
function extraTools(open){
  $('extra-tools').hidden=!open;
  $('extra-menu-toggle').setAttribute('aria-expanded',String(open));
}
$('extra-menu-toggle').addEventListener('click',()=>extraTools($('extra-tools').hidden));
$('extra-guide').addEventListener('click',()=>{extraTools(false);toggleGuide(true);});
$('extra-reset').addEventListener('click',()=>{extraTools(false);resetLesson();});
document.addEventListener('click',event=>{if(!event.composedPath?.().includes($('extra-menu')))extraTools(false);});
addEventListener('message',event=>{
  if(!bookExercise || event.origin!==window.location.origin || event.source!==window.parent)return;
  const message=event.data;
  if(!message || typeof message!=='object' || message.type!=='forest-book:control' || message.first!==bookExercise.first || message.second!==bookExercise.second)return;
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
  if(guideOpen){
    if(event.key==='Escape'){event.preventDefault();toggleGuide(false);}
    else if(event.key==='Tab'){
      if(event.shiftKey&&document.activeElement===$('guide-close')){event.preventDefault();$('guide-done').focus();}
      else if(!event.shiftKey&&document.activeElement===$('guide-done')){event.preventDefault();$('guide-close').focus();}
    }
    return;
  }
  if(extraPractice && event.key==='Escape' && !$('extra-tools').hidden){event.preventDefault();extraTools(false);$('extra-menu-toggle').focus();return;}
  if(bookExercise && event.key==='Escape'){
    event.preventDefault();notifyBook('forest-book:back');return;
  }
  if(event.altKey||event.ctrlKey||event.metaKey||event.repeat) return;
  if(/^[1-9]$/.test(event.key)&&['split','remainder'].includes(exercise.phase)) {event.preventDefault();choose(Number(event.key));}
});
render();
if (bookExercise) notifyBook('forest-book:ready');
