import {savedPlaybackRate} from './playback-tempo.mjs?v=1';
const artwork={gummibeertjes:'gummy',mandarijnpartjes:'mandarin',hazelnoten:'hazelnut'};

// The three warm-ups share the same concrete action: select, give away, answer.
export function createSharingExercise({get,puzzle,onComplete}) {
  const {first,second,giver,receiver,item}=puzzle,remaining=first-second;
  let phase='select',stopped=false;
  const selected=new Set(),buttons=[],animations=[],flying=[];
  const root=get('simple-math'),equation=get('simple-equation');
  const transfer=get('simple-transfer'),choices=get('simple-choices');
  const extraOnly=first>10&&remaining===10;
  const image=()=>{
    const img=document.createElement('img');
    img.src=`assets/counting/${artwork[item]||'hazelnut'}.svg`;
    img.alt='';img.draggable=false;img.setAttribute('aria-hidden','true');
    return img;
  };
  const setPhase=value=>{phase=value;root.dataset.phase=value;};
  const showEquation=answer=>{
    equation.setAttribute('aria-label',`${first} min ${second} is ${answer==='?'?'hoeveel':answer}`);
    equation.replaceChildren(...[first,'−',second,'=',answer].map((value,i)=>{
      const span=document.createElement('span');span.textContent=value;
      span.className=i===2?'equation-give':i===4?'equation-answer':i%2?'equation-sign':'equation-start';
      return span;
    }));
  };
  const refreshSelection=()=>{
    get('simple-selection').textContent=`Gekozen: ${selected.size} van ${second}`;
    transfer.disabled=selected.size!==second;
    for(const [i,button] of buttons.entries())if(button){
      const active=selected.has(i);
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
      button.setAttribute('aria-label',`${item}, plaats ${i+1}${active?', gekozen':''}`);
    }
  };
  const makeCell=i=>{
    if(i>=first){const empty=document.createElement('span');empty.className='ten-cell empty';empty.setAttribute('aria-hidden','true');return empty;}
    const button=document.createElement('button');button.type='button';button.className='ten-cell first';
    button.append(image());button.disabled=extraOnly&&i<10;buttons[i]=button;
    button.addEventListener('click',()=>{
      if(stopped||phase!=='select'||button.disabled)return;
      if(selected.has(i))selected.delete(i);
      else if(selected.size<second)selected.add(i);
      else {get('simple-feedback').textContent=`Je hebt er al ${second}. Tik een gekozen voorwerp aan om te wisselen.`;return;}
      get('simple-feedback').textContent='';refreshSelection();
    });return button;
  };
  get('simple-kicker').textContent=extraOnly?'Precies terug naar 10':first===10?'Aftrekken van 10':'Even herhalen';
  get('simple-giver').textContent=`Bij ${giver}`;get('simple-receiver').textContent=`Naar ${receiver}`;
  get('simple-hint').textContent=extraOnly?`Tik de ${second} extra ${item} aan.`:`Tik ${second} ${item} aan om weg te geven.`;
  get('simple-feedback').textContent='';get('simple-selection').hidden=false;
  transfer.hidden=false;transfer.textContent=`Geef er ${second} weg →`;choices.hidden=true;
  get('ten-frame').setAttribute('aria-label',`${Math.min(first,10)} ${item} in een tienveld`);
  get('ten-frame').replaceChildren(...Array.from({length:10},(_,i)=>makeCell(i)));
  get('extra-frame').hidden=first<=10;
  get('extra-frame').replaceChildren(...Array.from({length:Math.max(0,first-10)},(_,i)=>makeCell(i+10)));
  const receipt=Array.from({length:second},()=>{const slot=document.createElement('span');slot.className='received-slot';return slot;});
  get('received-items').replaceChildren(...receipt);
  choices.replaceChildren(...Array.from({length:11},(_,value)=>{
    const button=document.createElement('button');button.textContent=value;button.disabled=true;
    button.addEventListener('click',()=>{
      if(stopped||phase!=='answer')return;
      if(value!==remaining){get('simple-feedback').textContent=`Tel wat er bij ${giver} blijft liggen.`;return;}
      setPhase('done');showEquation(remaining);
      get('simple-hint').textContent=`${giver} houdt ${remaining} over.`;
      get('simple-feedback').textContent=`${receiver} heeft er ${second} gekregen.`;
      button.classList.toggle('correct',true);
      for(const choice of choices.children)choice.disabled=true;
      onComplete();
    });return button;
  }));
  const give=async()=>{
    if(stopped||phase!=='select'||selected.size!==second)return;
    setPhase('giving');transfer.disabled=true;get('simple-feedback').textContent='';
    for(const button of buttons)if(button)button.disabled=true;
    const moves=[...selected].sort((a,b)=>a-b).map((i,n)=>{
      const button=buttons[i],slot=receipt[n];
      slot.append(image());slot.classList.toggle('filled',true);
      slot.setAttribute('aria-label',`${item}, weggegeven`);
      button.classList.toggle('given',true);
      button.setAttribute('aria-label',`Lege plaats ${i+1}`);
      if(!root.getBoundingClientRect||!button.getBoundingClientRect||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return Promise.resolve();
      const from=button.getBoundingClientRect(),to=slot.getBoundingClientRect(),base=root.getBoundingClientRect();
      const fly=document.createElement('span');fly.className='sharing-flight';fly.append(image());
      if(!fly.animate)return Promise.resolve();
      Object.assign(fly.style,{left:`${from.left-base.left}px`,top:`${from.top-base.top}px`,width:`${from.width}px`,height:`${from.height}px`});
      root.append(fly);flying.push(fly);slot.classList.toggle('arriving',true);
      const animation=fly.animate([
        {transform:'translate(0,0) rotate(-5deg)',opacity:1},
        {transform:`translate(${(to.left-from.left)*.5}px,${(to.top-from.top)*.5-35}px) rotate(5deg)`,opacity:1,offset:.5},
        {transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width})`,opacity:1}
      ],{duration:540/savedPlaybackRate(),delay:n*65/savedPlaybackRate(),easing:'ease-in-out',fill:'backwards'});
      animations.push(animation);
      return animation.finished.catch(()=>{}).then(()=>{fly.remove();slot.classList.toggle('arriving',false);});
    });
    await Promise.all(moves);
    if(stopped)return;
    setPhase('answer');transfer.hidden=true;get('simple-selection').hidden=true;
    choices.hidden=false;for(const choice of choices.children)choice.disabled=false;
    get('simple-hint').textContent=`Hoeveel blijven er bij ${giver}?`;
    get('simple-feedback').textContent=extraOnly?'De tien blijft heel.':'';
    choices.children[0]?.focus({preventScroll:true});
  };
  // A single property handler replaces the previous exercise on every reset.
  transfer.onclick=give;
  setPhase('select');showEquation('?');refreshSelection();
  return {stop(){stopped=true;for(const animation of animations)animation.cancel();for(const fly of flying)fly.remove();}};
}
