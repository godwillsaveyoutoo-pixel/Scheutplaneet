import { BridgeExercise } from './logic.mjs';

const practice = [[7,5],[9,6],[6,7],[8,7],[7,8],[9,3]];
const guided = [[8,6],[8,7],[9,5]];

export class LessonSession {
  constructor(mode='demo') { this.setMode(mode); }
  get intro() { return ['goal','prior','prior-answers'].includes(this.chapter); }
  get canInteract() {
    if(this.intro || this.chapter==='discussion' || this.mode==='demo') return false;
    return this.mode==='solo' || this.chapter==='check' || this.ready;
  }
  get target() { return this.exercise.phase==='split' ? `split-${this.exercise.activePart}` : this.exercise.phase; }
  setMode(mode) {
    if(!['demo','guided','solo'].includes(mode)) return false;
    this.mode=mode;this.practiceIndex=0;this.guidedIndex=0;this.demoIndex=0;
    this.chapter=mode==='demo'?'goal':'activity';this.ready=false;
    const pair=mode==='demo'?[8,5]:mode==='guided'?guided[0]:practice[0];
    this.exercise=new BridgeExercise(...pair);this.lastTarget=this.target;return true;
  }
  afterInput() {
    if(this.mode==='guided'&&this.chapter==='activity'&&this.lastTarget!==this.target) this.ready=false;
    this.lastTarget=this.target;
  }
  advance() {
    if(this.mode==='demo') {
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
    if(this.mode==='guided') {
      if(this.chapter==='discussion') return;
      if(this.exercise.phase==='done') {
        if(this.chapter==='activity') {this.chapter='check';this.exercise=new BridgeExercise(9,4);this.ready=true;this.lastTarget=this.target;}
        else if(this.chapter==='check') this.chapter='discussion';
      }else if(this.chapter==='activity') this.ready=!this.ready;
      return;
    }
    if(this.exercise.phase==='done') {
      this.practiceIndex=(this.practiceIndex+1)%practice.length;
      this.exercise=new BridgeExercise(...practice[this.practiceIndex]);this.lastTarget=this.target;
    }
  }
  repeatGuided() {
    this.mode='guided';this.chapter='activity';this.ready=false;
    this.guidedIndex=(this.guidedIndex+1)%guided.length;
    this.exercise=new BridgeExercise(...guided[this.guidedIndex]);this.lastTarget=this.target;
  }
  reset() {
    if(this.mode==='demo'){this.setMode('demo');return;}
    if(this.chapter==='discussion'){this.chapter='check';}
    this.exercise.reset();this.ready=this.chapter==='check';this.lastTarget=this.target;
  }
  get actionLabel() {
    if(this.mode==='demo') {
      if(this.chapter==='goal')return 'Voorkennis';
      if(this.chapter==='prior')return 'Toon antwoorden';
      if(this.chapter==='prior-answers')return 'Doe voor';
      return this.exercise.phase==='done'?'Samen oefenen':'Volgende stap';
    }
    if(this.mode==='guided') {
      if(this.chapter==='discussion')return 'Zelf verder';
      if(this.exercise.phase==='done')return this.chapter==='check'?'Bespreek aanpak':'Korte controle';
      return this.ready?'Wacht even':'Laat kiezen';
    }
    return this.exercise.phase==='done'?'Nieuwe som':'';
  }
  get demoWords() {
    const e=this.exercise;
    return [
      `Ik reken ${e.first} + ${e.second} uit. Ik maak eerst 10.`,
      `${e.first} heeft nog ${e.needed} nodig tot 10. Daarom splits ik ${e.second}.`,
      `Van ${e.second} gebruik ik ${e.needed}. Er blijft ${e.remainder} over.`,
      `${e.needed} en ${e.remainder} zijn samen nog steeds ${e.second}.`,
      `${e.first} en ${e.needed} in de sok: 10. De ${e.remainder} blijven buiten de sok.`,
      `10 en ${e.remainder} is ${e.total}.`,
      'We hebben anders gegroepeerd. De uitkomst blijft gelijk.'
    ][this.demoIndex];
  }
  get question() {
    const e=this.exercise;
    if(e.phase==='start')return 'Welk getal gaan we splitsen?';
    if(e.phase==='split')return e.activePart===0?`Hoeveel heeft ${e.first} nog nodig tot 10?`:`Welk deel van ${e.second} blijft er over?`;
    if(e.phase==='group')return 'Welke twee getallen maken samen 10?';
    if(e.phase==='remainder')return 'Welk deel blijft buiten de sok?';
    if(e.phase==='answer')return `Hoeveel is 10 + ${e.remainder}?`;
    return `Waarom is ${e.first} + ${e.second} hetzelfde als 10 + ${e.remainder}?`;
  }
}
