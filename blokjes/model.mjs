import {BridgeExercise} from '../logic.mjs';
import {BridgeExercise as SubtractionExercise} from '../anas-alina/logic.mjs';

export const colours = {
  red: {name:'rood', top:'#e95447', face:'#c32b29', side:'#961e25', stud:'#f16b5d'},
  blue: {name:'blauw', top:'#479bdd', face:'#2373b4', side:'#17568d', stud:'#69b2e8'},
  yellow: {name:'geel', top:'#f4cc45', face:'#dcaa26', side:'#bb851a', stud:'#ffe16b'}
};

export class BlockExercise {
  constructor(first=9, second=5, operation='add') {
    if(!['add','subtract'].includes(operation))throw new RangeError('Choose addition or subtraction.');
    const e=operation==='subtract'?new SubtractionExercise(first,second):new BridgeExercise(first,second);
    this.first=e.first;this.second=e.second;this.operation=operation;this.reset();
  }
  get isSubtract(){return this.operation==='subtract';}
  get symbol(){return this.isSubtract?'−':'+';}
  reset(){this.moved=[];this.phase='fill';this.sockConfirmed=false;this.enteredRemainder=null;this.answer=null;}
  get needed(){return this.isSubtract?this.first-10:10-this.first;}
  get remainder(){return this.second-this.needed;}
  get total(){return this.isSubtract?this.first-this.second:this.first+this.second;}
  get leftCount(){return this.isSubtract?this.first-this.moved.length:this.first+this.moved.length;}
  get rightCount(){return this.isSubtract?this.moved.length:this.second-this.moved.length;}
  get splitFirst(){return Math.min(this.moved.length,this.needed);}
  get splitRest(){return this.second-this.splitFirst;}
  get bridgeCount(){return this.isSubtract?this.first-this.splitFirst:this.first+this.splitFirst;}
  get sourceIds(){return Array.from({length:this.isSubtract?this.first:this.second},(_,i)=>`${this.isSubtract?'a':'b'}${i}`);}
  get rightIds(){return this.isSubtract?[...this.moved]:this.sourceIds.filter(id=>!this.moved.includes(id));}
  get movableIds(){
    if(!this.isSubtract)return this.phase==='fill'?this.rightIds:[];
    if(!['fill','take'].includes(this.phase))return [];
    return this.sourceIds.filter(id=>!this.moved.includes(id)&&(this.phase==='fill'?Number(id.slice(1))>=10:Number(id.slice(1))<10));
  }
  move(id){
    if(!this.movableIds.includes(id))return false;
    this.moved.push(id);
    if(this.phase==='fill'&&this.leftCount===10)this.phase='sock';
    else if(this.isSubtract&&this.phase==='take'&&this.moved.length===this.second)this.phase='answer';
    return true;
  }
  undo(){
    if(!this.moved.length)return false;
    this.moved.pop();
    if(this.isSubtract&&this.moved.length>=this.needed&&this.sockConfirmed)this.phase='take';
    else{this.phase='fill';this.sockConfirmed=false;}
    this.enteredRemainder=null;this.answer=null;return true;
  }
  confirmSock(){if(this.phase!=='sock'||this.leftCount!==10)return false;this.sockConfirmed=true;this.phase='ten';return true;}
  beginRemainder(){if(this.phase!=='ten')return false;this.phase=this.isSubtract?'take':'remainder';if(this.isSubtract)this.enteredRemainder=this.remainder;return true;}
  choose(value){
    if(!Number.isInteger(value))return false;
    if(this.phase==='remainder'&&value===this.remainder){this.enteredRemainder=value;this.phase='answer';return true;}
    if(this.phase==='answer'&&value===this.total){this.answer=value;this.phase='done';return true;}
    return false;
  }
}

export function bridgePairs(operation='add'){
  const pairs=[];
  if(operation==='subtract'){
    for(let first=11;first<=19;first++)for(let second=1;second<=9;second++)if(first-second>0&&first-second<10)pairs.push([first,second]);
    return pairs;
  }
  for(let first=2;first<=9;first++)for(let second=2;second<=9;second++)if(first+second>10)pairs.push([first,second]);
  return pairs;
}

export function cellPosition(side,index){
  return {x:(side==='left'?46:684)+(index%5)*104,y:314+Math.floor(index/5)*96};
}

export function blockPositions(exercise){
  const positions=new Map();
  if(exercise.isSubtract){
    for(const id of exercise.sourceIds){
      const index=Number(id.slice(1)),taken=exercise.moved.indexOf(id);
      const p=taken>=0?{x:902+(taken%3)*102,y:314+Math.floor(taken/3)*74}:index<10?{x:44+(index%5)*92,y:314+Math.floor(index/5)*96}:{x:550+((index-10)%3)*94,y:314+Math.floor((index-10)/3)*74};
      positions.set(id,{...p,side:taken>=0?'right':'left',origin:'first',scale:.84,group:index<10?'ten':'extra'});
    }
    return positions;
  }
  for(let i=0;i<exercise.first;i++)positions.set(`a${i}`,{...cellPosition('left',i),side:'left',origin:'first'});
  exercise.moved.forEach((id,i)=>positions.set(id,{...cellPosition('left',exercise.first+i),side:'left',origin:'second'}));
  exercise.rightIds.forEach((id,i)=>positions.set(id,{...cellPosition('right',i),side:'right',origin:'second'}));
  return positions;
}
