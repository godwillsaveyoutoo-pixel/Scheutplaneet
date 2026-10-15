import {colours} from './model.mjs';

// A 2 x 4 brick: eight studs, four along its length and two across its width.
// Shared symbols keep the classroom board light on lower-powered devices.
export function brickSymbols(){
  return `<defs><filter id="brick-shadow" x="-25%" y="-25%" width="160%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="2.3" flood-color="#343526" flood-opacity=".17"/></filter>${Object.entries(colours).map(([key,c])=>{
    const studs=[];
    for(let row=0;row<2;row++)for(let col=0;col<4;col++){
      const x=21+col*21+row*15,y=18+col*4.4-row*10;
      studs.push(`<g class="stud"><path d="M${x-7} ${y-3}v5c0 5 14 5 14 0v-5" fill="${c.face}" stroke="${c.side}" stroke-width=".65"/><ellipse cx="${x}" cy="${y-3}" rx="7" ry="3.8" fill="${c.stud}" stroke="${c.side}" stroke-width=".6"/><path d="M${x-4.5} ${y-4.1}q4-2 8 0" fill="none" stroke="white" stroke-opacity=".35" stroke-width="1"/></g>`);
    }
    return `<symbol id="brick-${key}" viewBox="0 0 124 84"><g filter="url(#brick-shadow)"><path d="M8 25 41 3 116 19 83 43Z" fill="${c.top}" stroke="${c.side}" stroke-width="1.1"/><path d="M8 25 83 43 83 70 8 51Z" fill="${c.face}" stroke="${c.side}" stroke-width="1.1"/><path d="M83 43 116 19 116 46 83 70Z" fill="${c.side}" stroke="${c.side}" stroke-width="1.1"/><path d="M10 27 82 45M10 48 81 66M86 45 113 25" fill="none" stroke="white" stroke-opacity=".17" stroke-width="1.2"/>${studs.join('')}</g></symbol>`;
  }).join('')}</defs>`;
}

export function brickMarkup(id,x,y,colour,{interactive=false,label='',ghost=false,scale=1}={}){
  return `<g ${ghost?'id="drag-ghost"':`id="block-${id}" data-brick="${id}"`} transform="translate(${x} ${y})" class="brick ${interactive?'movable':''} ${ghost?'ghost':''}" ${interactive?`role="button" tabindex="0" aria-label="${label}"`:''}><rect x="-14" y="-20" width="124" height="124" fill="transparent"/><g transform="scale(${scale})"><use href="#brick-${colour}" width="96" height="72" aria-hidden="true"/></g></g>`;
}
