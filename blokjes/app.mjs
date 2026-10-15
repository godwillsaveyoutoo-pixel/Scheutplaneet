import {BlockExercise, blockPositions, bridgePairs, cellPosition, colours} from './model.mjs?v=plusmin-4';
import {brickSymbols, brickMarkup} from './brick.mjs?v=plusmin-4';
import {schemaMarkup} from './schema.mjs?v=plusmin-4';
import {checkSockStroke,strokePath} from './sock-drawing.mjs?v=plusmin-4';

const $=id=>document.getElementById(id);
const board=$('board'),bar=document.querySelector('.lesson-bar');
const params=new URLSearchParams(location.search);
let preferences={};try{preferences=JSON.parse(localStorage.getItem('scheutplaneet-blokjes-v1')||'{}');}catch{}
if(!preferences||typeof preferences!=='object')preferences={};
let mode=['demo','guided','solo'].includes(params.get('mode'))?params.get('mode'):['demo','guided','solo'].includes(preferences.mode)?preferences.mode:'guided';
let operation=params.get('operation')==='subtract'?'subtract':'add';
const colourModes={add:preferences.colourModes?.add==='one'?'one':'two',subtract:preferences.colourModes?.subtract==='two'?'two':'one'};
let firstColour=Object.hasOwn(colours,preferences.firstColour)?preferences.firstColour:'red';
let secondColour=Object.hasOwn(colours,preferences.secondColour)?preferences.secondColour:'blue';
const defaults=op=>op==='subtract'?[15,8]:[9,5];
const presets=op=>op==='subtract'?[[15,8],[14,6],[13,5],[16,7],[12,5],[17,9]]:[[9,5],[8,5],[7,6],[9,7],[8,6],[6,7]];
let exercise;try{exercise=new BlockExercise(Number(params.get('first')||defaults(operation)[0]),Number(params.get('second')||defaults(operation)[1]),operation);}catch{exercise=new BlockExercise(...defaults(operation),operation);}
let ready=false,drag=null,wrong=null,feedback='',exerciseNumber=1,inkPoints=[];
let pool=presets(operation).slice(1);
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const canMove=()=>['fill','take'].includes(exercise.phase)&&(mode==='solo'||(mode==='guided'&&ready));
const canDraw=()=>exercise.phase==='sock';
const canAnswer=()=>['remainder','answer'].includes(exercise.phase)&&(mode==='solo'||(mode==='guided'&&ready));
const colourOf=id=>colourModes[operation]==='one'?firstColour:exercise.isSubtract?(Number(id.slice(1))>=10?secondColour:firstColour):(id.startsWith('a')?firstColour:secondColour);
const drawInstruction=()=>exercise.isSubtract?'Teken rond de twee getallen waarmee je teruggaat naar 10.':'Teken rond de twee getallen die samen 10 maken.';
function savePreferences(){try{localStorage.setItem('scheutplaneet-blokjes-v1',JSON.stringify({mode,firstColour,secondColour,colourModes}));}catch{}}

function cancelDrag(){
  if(!drag)return;
  const current=drag;drag=null;
  board.querySelector('#drag-ghost')?.remove();
  board.querySelector('#sock-ink-active')?.remove();
  board.querySelector(`#block-${current.id}`)?.classList.remove('drag-origin');
  try{if(board.hasPointerCapture(current.pointerId))board.releasePointerCapture(current.pointerId);}catch{}
}

function boardMarkup(){
  const e=exercise,positions=blockPositions(e),complete=e.leftCount===10;
  const slots=Array.from({length:10},(_,i)=>{const p=cellPosition('left',i);return `<rect class="mat-cell ${i>=e.leftCount?'vacant':''}" x="${p.x-2}" y="${p.y-4}" width="100" height="86" rx="13" ${i>=e.leftCount?'data-empty="true"':''}/>`;}).join('');
  const blocks=[...positions].map(([id,p])=>brickMarkup(id,p.x,p.y,colourOf(id),{interactive:canMove()&&e.movableIds.includes(id),label:`${colours[colourOf(id)].name} blokje naar ${e.isSubtract?'het vak weggehaald':'links'} verplaatsen`,scale:p.scale||1})).join('');
  const panels=e.isSubtract?subtractionPanels():`
    <path class="sock-outline ${complete?'complete':''}" d="M45 255H530Q585 255 585 305V460Q585 515 530 515H92Q28 515 28 460V305Q28 255 45 255Z"/>
    <rect class="right-panel" x="665" y="255" width="550" height="260" rx="31"/>
    <text class="panel-label" x="307" y="292" text-anchor="middle">${e.sockConfirmed?'10 IN DE SOK':complete?'LINKS ZIJN ER 10':'LINKS AANVULLEN TOT 10'}</text>
    <text class="panel-label" x="940" y="292" text-anchor="middle">${e.sockConfirmed?'BUITEN DE SOK':'RECHTS'}</text>
    ${slots}<path class="move-arrow" d="M645 382H606m10-10-11 10 11 10"/>
    <text class="one-brick-note" x="940" y="552" text-anchor="middle">1 blokje telt als 1</text>`;
  return `${brickSymbols()}${schemaMarkup(e,colourModes[operation]==='one'?firstColour:secondColour)}${panels}${blocks}${e.phase==='done'?'<text class="completion-mark" x="1192" y="62" text-anchor="end">✓</text>':''}`;
}

function subtractionPanels(){
  const e=exercise;
  const cells=Array.from({length:10},(_,i)=>`<rect class="mat-cell ${e.moved.includes(`a${i}`)?'vacant':''}" x="${40+(i%5)*92}" y="${310+Math.floor(i/5)*96}" width="88" height="86" rx="12"/>`).join('');
  return `<rect class="source-panel" x="20" y="255" width="825" height="280" rx="30"/><rect class="right-panel taken-panel" x="880" y="255" width="335" height="280" rx="30"/><text class="panel-label" x="432" y="292" text-anchor="middle">NOG BIJ ONS: ${e.leftCount}</text><text class="panel-label" x="1047" y="292" text-anchor="middle">WEG: ${e.rightCount} VAN ${e.second}</text>${cells}<path class="sub-divider" d="M525 311V507"/><path class="move-arrow" d="M850 386H872m-10-10 11 10-11 10"/><text class="one-brick-note" x="270" y="557" text-anchor="middle">1 blokje telt als 1</text><text class="one-brick-note" x="1047" y="557" text-anchor="middle">Eerst ${e.splitFirst} · daarna ${Math.max(0,e.moved.length-e.needed)}</text>`;
}

function stepWords(){
  const e=exercise;
  if(feedback)return [feedback,'Probeer gerust opnieuw.'];
  if(e.isSubtract){
    if(e.phase==='fill'){
      if(mode==='demo')return [`Ik haal eerst de losse blokjes weg, tot er 10 overblijven.`,`Er zijn nog ${e.leftCount} blokjes bij ons.`];
      if(mode==='guided'&&!ready)return ['Hoeveel moet er eerst weg om 10 over te houden?','Denk eerst na. De leerkracht geeft het weghalen vrij.'];
      return ['Haal eerst de losse blokjes naast het tienvak weg.','Sleep ze naar het vak WEG, of tik erop.'];
    }
    if(e.phase==='sock')return [drawInstruction(),'Teken bovenaan rond het eerste getal en het linker splitsdeel.'];
    if(e.phase==='ten')return [`${e.first} min ${e.needed} is 10.`,`${e.second} is gesplitst in ${e.needed} en ${e.remainder}. Er moet nog ${e.remainder} af.`];
    if(e.phase==='take')return [mode==='guided'&&!ready?'Hoeveel blokjes moeten er nu nog weg?':`Haal nog ${e.second-e.moved.length} blokjes uit het tienvak weg.`,'De weggehaalde blokjes blijven rechts liggen.'];
    if(e.phase==='answer')return [`Hoeveel is 10 − ${e.remainder}?`,`Er zijn ${e.second} blokjes weggehaald. Hoeveel zijn er over?`];
    return [`${e.first} − ${e.second} = ${e.total}.`,`Eerst ${e.needed} weg tot 10. Daarna nog ${e.remainder} weg.`];
  }
  if(e.phase==='fill'){
    if(mode==='demo')return [e.moved.length?`Er liggen nu ${e.leftCount} links. We vullen verder aan tot 10.`:`Ik maak eerst 10. Ik gebruik blokjes van het rechtergroepje.`,'Een verplaatst blokje houdt zijn kleur.'];
    if(mode==='guided'&&!ready)return ['Hoeveel heeft links nog nodig tot 10?','Denk eerst na. De leerkracht geeft het verplaatsen vrij.'];
    return ['Vul links aan tot 10.','Sleep een blokje van rechts naar links, of tik erop.'];
  }
  if(e.phase==='sock')return [drawInstruction(),'Teken bovenaan één gesloten vorm met je vinger, pen of muis.'];
  if(e.phase==='ten')return [`${e.first} en ${e.needed} samen: 10 in de sok.`,`${e.second} is gesplitst in ${e.needed} en ${e.remainder}.`];
  if(e.phase==='remainder')return ['Hoeveel blokjes blijven buiten de sok?',mode==='guided'&&!ready?'Denk eerst na. Straks kun je kiezen.':'Kijk naar het groepje rechts.'];
  if(e.phase==='answer')return [`Hoeveel is 10 + ${e.remainder}?`,'Tien in de sok, daarna de rest erbij.'];
  return [`${e.first} + ${e.second} = ${e.total}.`,`${e.first} + ${e.needed} = 10. Daarna ${e.remainder} erbij.`];
}

function actionLabel(){
  const phase=exercise.phase;
  if(phase==='sock')return '';
  if(phase==='done')return 'Volgende oefening →';
  if(phase==='ten')return 'Verder →';
  if(mode==='demo')return ['fill','take'].includes(phase)?(exercise.isSubtract?'Haal er 1 weg →':'Leg er 1 bij →'):phase==='remainder'?'Toon wat overblijft →':'Toon het antwoord →';
  if(mode==='guided'&&!ready)return ['fill','take'].includes(phase)?(exercise.isSubtract?'Laat weghalen':'Laat verplaatsen'):'Laat kiezen';
  return '';
}

function render({oldPositions=null,dropPosition=null,movedId=null,focusAction=false}={}){
  cancelDrag();
  const previousFocus=document.activeElement;
  const wasChoice=previousFocus?.hasAttribute?.('data-answer');
  board.innerHTML=boardMarkup();
  board.setAttribute('aria-label',exercise.isSubtract?'Links het begin­aantal in een tiental en losse blokjes. Rechts de weggehaalde blokjes.':'Links aanvullen tot tien. Rechts liggen de overige blokjes.');
  board.classList.toggle('drawing-ready',canDraw());
  if(!canDraw())inkPoints=[];
  if(inkPoints.length)board.insertAdjacentHTML('beforeend',`<path id="sock-ink-error" class="sock-ink invalid" d="${strokePath(inkPoints)}"/>`);
  $('erase-stroke').hidden=!canDraw()||!inkPoints.length;
  const words=stepWords();$('instruction').textContent=words[0];$('instruction').classList.toggle('error',!!feedback);$('detail').textContent=words[1];
  const label=actionLabel();$('action').textContent=label;$('action').hidden=!label;
  $('undo').disabled=!exercise.moved.length;
  $('settings-open').innerHTML=`${exercise.first} ${exercise.symbol} ${exercise.second} <span aria-hidden="true">⌄</span>`;
  $('workspace').setAttribute('aria-label',`${exercise.isSubtract?'Aftrekken':'Optellen'} met een brug over tien`);
  $('story-return').setAttribute('href',exercise.isSubtract?'../anas-alina/?verder=1':'../optellen.html?verder=1');
  $('story-return').textContent=exercise.isSubtract?'Terug naar het aftrekverhaal':'Terug naar het optelverhaal';
  document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
  const choices=canAnswer();$('choices').hidden=!choices;bar.classList.toggle('has-choices',choices);
  $('choices').innerHTML=choices?(exercise.phase==='remainder'||exercise.isSubtract?[1,2,3,4,5,6,7,8,9]:[11,12,13,14,15,16,17,18]).map(n=>`<button data-answer="${n}" ${n===wrong?'class="wrong"':''}>${n}</button>`).join(''):'';
  if(oldPositions&&!reducedMotion()){
    for(const [id,to] of blockPositions(exercise)){
      const from=id===movedId&&dropPosition?dropPosition:oldPositions.get(id);
      const node=$(`block-${id}`);
      if(from&&node?.animate&&(from.x!==to.x||from.y!==to.y))node.animate([{transform:`translate(${from.x}px, ${from.y}px)`},{transform:`translate(${to.x}px, ${to.y}px)`}],{duration:320,easing:'cubic-bezier(.22,.7,.26,1)'});
    }
  }
  if(focusAction||wasChoice){if(!$('action').hidden)$('action').focus({preventScroll:true});else if(choices)$('choices').querySelector('button')?.focus({preventScroll:true});}
}

function transfer(id,{dropPosition=null,byKeyboard=false}={}){
  if(!canMove())return false;
  const oldPositions=blockPositions(exercise);
  if(!exercise.move(id))return false;
  feedback='';wrong=null;if(['sock','answer'].includes(exercise.phase))ready=false;
  render({oldPositions,dropPosition,movedId:id,focusAction:byKeyboard&&exercise.phase==='sock'});
  if(byKeyboard&&canMove())board.querySelector('[data-brick][tabindex="0"]')?.focus();
  return true;
}

function newExercise(first,second,nextOperation=operation){
  let next;try{next=new BlockExercise(first,second,nextOperation);}catch{return false;}
  cancelDrag();inkPoints=[];operation=nextOperation;exercise=next;ready=false;feedback='';wrong=null;render({focusAction:true});return true;
}

function nextExercise(){
  if(!pool.length){pool=bridgePairs(operation).filter(([a,b])=>a!==exercise.first||b!==exercise.second);for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}}
  let pair=pool.shift();if(pair[0]===exercise.first&&pair[1]===exercise.second)pair=pool.shift()||defaults(operation);
  exerciseNumber++;newExercise(...pair);
}

function advance(){
  if(exercise.phase==='sock')return;
  feedback='';wrong=null;
  if(exercise.phase==='done'){nextExercise();return;}
  if(exercise.phase==='ten'){exercise.beginRemainder();ready=mode==='solo';render({focusAction:true});return;}
  if(mode==='demo'){
    if(['fill','take'].includes(exercise.phase)){
      const oldPositions=blockPositions(exercise),id=exercise.movableIds[0];exercise.move(id);render({oldPositions,movedId:id});
    }else if(exercise.phase==='remainder'){exercise.choose(exercise.remainder);render();}
    else if(exercise.phase==='answer'){exercise.choose(exercise.total);render();}
    return;
  }
  if(mode==='guided'){ready=true;render();if(canAnswer())$('choices').querySelector('button')?.focus({preventScroll:true});}
}

function point(event){
  const matrix=board.getScreenCTM();
  if(matrix&&typeof DOMPoint!=='undefined'){const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());return {x:p.x,y:p.y};}
  const box=board.getBoundingClientRect(),scale=Math.min(box.width/1240,box.height/570);
  return {x:(event.clientX-box.left-(box.width-1240*scale)/2)/scale,y:(event.clientY-box.top-(box.height-570*scale)/2)/scale};
}

board.addEventListener('pointerdown',event=>{
  if(event.button!==0||drag)return;
  if(canDraw()){
    const p=point(event);if(p.y<0||p.y>250)return;
    inkPoints=[];feedback='';board.querySelector('#sock-ink-error')?.remove();
    $('instruction').classList.remove('error');$('instruction').textContent=drawInstruction();
    $('erase-stroke').hidden=true;
    drag={kind:'ink',pointerId:event.pointerId,points:[p]};
    board.insertAdjacentHTML('beforeend',`<path id="sock-ink-active" class="sock-ink" d="${strokePath(drag.points)}"/>`);
    try{board.setPointerCapture(event.pointerId);}catch{}
    event.preventDefault();return;
  }
  if(!canMove())return;
  const target=event.target.closest('[data-brick]');if(!target||!exercise.movableIds.includes(target.dataset.brick))return;
  const p=point(event),position=blockPositions(exercise).get(target.dataset.brick);
  drag={id:target.dataset.brick,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,offsetX:p.x-position.x,offsetY:p.y-position.y,moved:false,scale:position.scale||1};
  try{board.setPointerCapture(event.pointerId);}catch{}
  event.preventDefault();
});
board.addEventListener('pointermove',event=>{
  if(!drag||drag.pointerId!==event.pointerId)return;
  if(drag.kind==='ink'){
    const samples=event.getCoalescedEvents?.()||[event];
    for(const sample of samples.length?samples:[event]){
      const p=point(sample),last=drag.points.at(-1);
      if(Math.hypot(p.x-last.x,p.y-last.y)>=1.5&&drag.points.length<4096)drag.points.push(p);
    }
    $('sock-ink-active')?.setAttribute('d',strokePath(drag.points));event.preventDefault();return;
  }
  if(!drag.moved&&Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)<6)return;
  if(!drag.moved){drag.moved=true;$(`block-${drag.id}`)?.classList.add('drag-origin');board.insertAdjacentHTML('beforeend',brickMarkup(drag.id,0,0,colourOf(drag.id),{ghost:true,scale:drag.scale}));}
  const p=point(event);drag.lastPosition={x:p.x-drag.offsetX,y:p.y-drag.offsetY};
  $('drag-ghost')?.setAttribute('transform',`translate(${drag.lastPosition.x} ${drag.lastPosition.y})`);
  event.preventDefault();
});
board.addEventListener('pointerup',event=>{
  if(!drag||drag.pointerId!==event.pointerId)return;
  const current={...drag},p=point(event);cancelDrag();
  if(current.kind==='ink'){
    current.points.push(p);
    const result=checkSockStroke(current.points,operation);
    if(result.ok&&exercise.confirmSock()){inkPoints=[];feedback='';ready=false;render({focusAction:true});}
    else{
      inkPoints=current.points;
      feedback=result.reason==='extra'?'Laat de andere getallen buiten je vorm.':result.reason==='targets'?'Teken rond het eerste getal én het linker splitsdeel.':'Maak één bijna gesloten vorm rond beide getallen.';
      render();
    }
    return;
  }
  const correctDrop=exercise.isSubtract?(p.x>=880&&p.x<=1215&&p.y>=255&&p.y<=535):(p.x>=28&&p.x<=585&&p.y>=255&&p.y<=515);
  if(!current.moved||correctDrop)transfer(current.id,{dropPosition:current.moved?current.lastPosition:null});
});
board.addEventListener('pointercancel',cancelDrag);
board.addEventListener('lostpointercapture',()=>{if(drag)cancelDrag();});
board.addEventListener('keydown',event=>{
  if(event.key==='Escape'){cancelDrag();return;}
  const target=event.target.closest('[data-brick]');
  if(target&&['Enter',' '].includes(event.key)){event.preventDefault();transfer(target.dataset.brick,{byKeyboard:true});}
});
board.addEventListener('click',event=>{
  // Assistive technologies may activate role=button with a synthetic click.
  if(event.detail!==0)return;
  const target=event.target.closest('[data-brick]');if(target)transfer(target.dataset.brick,{byKeyboard:true});
});

$('action').addEventListener('click',advance);
$('erase-stroke').addEventListener('click',()=>{cancelDrag();inkPoints=[];feedback='';render();});
$('undo').addEventListener('click',()=>{const oldPositions=blockPositions(exercise);if(exercise.undo()){feedback='';wrong=null;ready=mode!=='demo';render({oldPositions});}});
$('choices').addEventListener('click',event=>{
  const button=event.target.closest('[data-answer]');if(!button||!canAnswer())return;
  const value=Number(button.dataset.answer);
  if(!exercise.choose(value)){wrong=value;feedback=exercise.isSubtract?'Kijk naar de blokjes die nog bij ons zijn.':exercise.phase==='remainder'?'Kijk nog eens naar de blokjes buiten de sok.':'Begin bij tien en tel de rest erbij.';render();return;}
  wrong=null;feedback='';ready=mode==='solo';render({focusAction:true});
});
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{cancelDrag();mode=button.dataset.mode;ready=false;feedback='';wrong=null;savePreferences();render();}));

function closeMenu(){$('menu-items').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');}
$('menu-toggle').addEventListener('click',()=>{const open=$('menu-items').hidden;$('menu-items').hidden=!open;$('menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',event=>{if(!event.target.closest('.menu'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){cancelDrag();closeMenu();}});
$('reset').addEventListener('click',()=>{closeMenu();cancelDrag();inkPoints=[];exercise.reset();ready=false;feedback='';wrong=null;render({focusAction:true});});
$('fullscreen').addEventListener('click',async()=>{closeMenu();try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('instruction').textContent='Gebruik de schermvullende stand van je browser.';}});
$('guide-open').addEventListener('click',()=>{closeMenu();$('guide').showModal();});

function refreshSettings(){
  $('first-number').innerHTML=Array.from({length:9},(_,i)=>`<option value="${i+(operation==='subtract'?11:1)}">${i+(operation==='subtract'?11:1)}</option>`).join('');
  $('second-number').innerHTML=Array.from({length:9},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('');
  $('first-number').value=exercise.first;$('second-number').value=exercise.second;$('own-symbol').textContent=exercise.symbol;$('pair-error').textContent='';
  document.querySelectorAll('[data-operation]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.operation===operation)));
  document.querySelectorAll('[data-pair]').forEach((b,i)=>{const p=presets(operation)[i];b.setAttribute('data-pair',p.join(','));b.textContent=`${p[0]} ${exercise.symbol} ${p[1]}`;});
}
$('settings-open').addEventListener('click',()=>{refreshSettings();$('settings').showModal();});
document.querySelectorAll('[data-operation]').forEach(button=>button.addEventListener('click',()=>{const op=button.dataset.operation;if(op!==operation){pool=presets(op).slice(1);newExercise(...defaults(op),op);}refreshSettings();}));
document.querySelectorAll('[data-pair]').forEach(button=>button.addEventListener('click',()=>{const pair=button.dataset.pair.split(',').map(Number);if(newExercise(...pair))$('settings').close();}));
$('start-pair').addEventListener('click',()=>{if(newExercise(Number($('first-number').value),Number($('second-number').value)))$('settings').close();else $('pair-error').textContent=exercise.isSubtract?'Kies een aftrekking die via tien onder tien uitkomt.':'Kies twee getallen die samen meer dan tien zijn.';});

function renderColours(){
  document.querySelectorAll('[data-colour-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colourMode===colourModes[operation])));
  $('second-colour-group').hidden=colourModes[operation]==='one';
  $('first-colour-label').textContent=colourModes[operation]==='one'?'Alle blokjes':exercise.isSubtract?'Groep van tien':'Eerste groepje · links';
  $('second-colour-label').textContent=exercise.isSubtract?'Losse blokjes naast tien':'Tweede groepje · rechts';
  for(const side of ['first','second'])$(`${side}-colours`).innerHTML=Object.entries(colours).map(([key,c])=>`<button type="button" data-colour="${key}" data-side="${side}" aria-pressed="${(side==='first'?firstColour:secondColour)===key}"><span class="swatch" style="--swatch:${c.top}" aria-hidden="true"></span>${c.name}</button>`).join('');
}
$('colours-open').addEventListener('click',()=>{closeMenu();renderColours();$('colour-dialog').showModal();});
$('colour-dialog').addEventListener('click',event=>{const count=event.target.closest('[data-colour-mode]');if(count){colourModes[operation]=count.dataset.colourMode;savePreferences();renderColours();render();return;}const button=event.target.closest('[data-colour]');if(!button)return;const {side,colour}=button.dataset;if(side==='first')firstColour=colour;else secondColour=colour;savePreferences();renderColours();render();$(`${side}-colours`).querySelector(`[data-colour="${colour}"]`)?.focus({preventScroll:true});});
window.addEventListener('blur',cancelDrag);
window.addEventListener('resize',cancelDrag);
refreshSettings();render();
