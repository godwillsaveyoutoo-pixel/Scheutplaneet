import {BridgeExercise} from './logic.mjs';
const practice=[[12,5],[16,7],[13,6],[17,9],[11,4],[18,9]];
const guided=[[14,6],[15,7],[13,5]];
export class LessonSession {
  constructor(mode='demo',{practicePairs=practice}={}){this.practice=practicePairs;this.setMode(mode);}
  get intro(){return ['goal','prior','prior-answers'].includes(this.chapter);}
  get canInteract(){if(this.intro||this.chapter==='discussion'||this.mode==='demo')return false;return this.mode==='solo'||this.chapter==='check'||this.ready;}
  get target(){return this.exercise.phase==='split'?`split-${this.exercise.activePart}`:this.exercise.phase;}
  setMode(mode){
    if(!['demo','guided','solo'].includes(mode))return false;
    this.mode=mode;this.practiceIndex=0;this.guidedIndex=0;this.demoIndex=0;this.chapter=mode==='demo'?'goal':'activity';this.ready=false;
    this.exercise=new BridgeExercise(...(mode==='demo'?[15,8]:mode==='guided'?guided[0]:this.practice[0]));this.lastTarget=this.target;return true;
  }
  afterInput(){if(this.mode==='guided'&&this.chapter==='activity'&&this.lastTarget!==this.target)this.ready=false;this.lastTarget=this.target;}
  advance(){
    if(this.mode==='demo'){
      if(this.chapter==='goal'){this.chapter='prior';return;}
      if(this.chapter==='prior'){this.chapter='prior-answers';return;}
      if(this.chapter==='prior-answers'){this.chapter='activity';return;}
      const e=this.exercise;
      if(this.demoIndex===0)e.openSplit();
      else if(this.demoIndex===1)e.choose(e.needed);
      else if(this.demoIndex===2)e.choose(e.remainder);
      else if(this.demoIndex===3){e.selectForSock('first');e.selectForSock('part');}
      else if(this.demoIndex===4)e.choose(e.remainder);
      else if(this.demoIndex===5)e.choose(e.total);
      else {this.setMode('guided');return;}
      this.demoIndex++;this.lastTarget=this.target;return;
    }
    if(this.mode==='guided'){
      if(this.chapter==='discussion')return;
      if(this.exercise.phase==='done'){
        if(this.chapter==='activity'){this.chapter='check';this.exercise=new BridgeExercise(12,5);this.ready=true;this.lastTarget=this.target;}
        else if(this.chapter==='check')this.chapter='discussion';
      }else if(this.chapter==='activity')this.ready=!this.ready;
      return;
    }
    if(this.exercise.phase==='done'){this.practiceIndex=(this.practiceIndex+1)%this.practice.length;this.exercise=new BridgeExercise(...this.practice[this.practiceIndex]);this.lastTarget=this.target;}
  }
  repeatGuided(){this.mode='guided';this.chapter='activity';this.ready=false;this.guidedIndex=(this.guidedIndex+1)%guided.length;this.exercise=new BridgeExercise(...guided[this.guidedIndex]);this.lastTarget=this.target;}
  reset(){if(this.mode==='demo'){this.setMode('demo');return;}if(this.chapter==='discussion')this.chapter='check';this.exercise.reset();this.ready=this.chapter==='check';this.lastTarget=this.target;}
  get actionLabel(){
    if(this.mode==='demo'){if(this.chapter==='goal')return 'Voorkennis';if(this.chapter==='prior')return 'Toon antwoorden';if(this.chapter==='prior-answers')return 'Doe voor';return this.exercise.phase==='done'?'Samen oefenen':'Volgende stap';}
    if(this.mode==='guided'){if(this.chapter==='discussion')return 'Zelf verder';if(this.exercise.phase==='done')return this.chapter==='check'?'Bespreek aanpak':'Korte controle';return this.ready?'Wacht even':'Laat kiezen';}
    return this.exercise.phase==='done'?'Nieuwe aftrekking':'';
  }
  get demoWords(){const e=this.exercise;return [
    `Ik reken ${e.first} − ${e.second} uit. Eerst ga ik terug naar 10.`,
    `Van ${e.first} naar 10 haal ik ${e.needed} weg. Ik splits ${e.second}.`,
    `Van ${e.second} haal ik eerst ${e.needed} weg. Er moet nog ${e.remainder} af.`,
    `${e.needed} en ${e.remainder} zijn samen ${e.second}. Dat is precies wat we weggeven.`,
    `${e.first} min ${e.needed} is 10. Er moet nog ${e.remainder} af.`,
    `10 min ${e.remainder} is ${e.total}.`,
    `Eerst naar 10, dan de rest. ${e.first} min ${e.second} is ${e.total}.`
  ][this.demoIndex];}
  get question(){const e=this.exercise;
    if(e.phase==='start')return 'Welk getal gaan we splitsen?';
    if(e.phase==='split')return e.activePart===0?`Hoeveel moet er van ${e.first} af om 10 over te houden?`:`Welk deel van ${e.second} moet er daarna nog af?`;
    if(e.phase==='group')return 'Welke aftrekking brengt ons op 10? Tik de twee getallen aan.';
    if(e.phase==='remainder')return 'Welk deel moet er nog van 10 af?';
    if(e.phase==='answer')return `Hoeveel is 10 min ${e.remainder}?`;
    return `Waarom is ${e.first} min ${e.second} hetzelfde als 10 min ${e.remainder}?`;
  }
}
