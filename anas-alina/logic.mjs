export class BridgeExercise {
  constructor(first=15,second=8) {
    if(!Number.isInteger(first)||!Number.isInteger(second)||first<11||first>19||second<1||second>9||first-second<1||first-second>=10)throw new RangeError('Use a subtraction within twenty crossing ten.');
    this.first=first;this.second=second;this.reset();
  }
  get needed(){return this.first-10;}
  get remainder(){return this.second-this.needed;}
  get total(){return this.first-this.second;}
  reset(){this.phase='start';this.parts=[null,null];this.activePart=0;this.chosen=new Set();this.enteredRemainder=null;this.answer=null;}
  openSplit(){if(this.phase!=='start')return {ok:false};this.phase='split';return {ok:true};}
  focusPart(index){if(this.phase!=='split'||![0,1].includes(index))return false;this.activePart=index;return true;}
  choose(value){
    if(!Number.isInteger(value))return {ok:false};
    if(this.phase==='split'){
      if(value<1||value>9)return {ok:false};
      this.parts[this.activePart]=value;
      if(this.parts.some(n=>n===null)){this.activePart=this.parts[0]===null?0:1;return {ok:true};}
      if(this.parts[0]+this.parts[1]!==this.second){if(this.parts[0]===this.needed)this.activePart=1;return {ok:false,reason:'sum',message:`Je twee delen moeten samen ${this.second} zijn.`};}
      if(this.first-this.parts[0]!==10){this.activePart=0;return {ok:false,reason:'ten',message:`Hoeveel moet er van ${this.first} af om 10 over te houden? Zet dat deel links.`};}
      this.phase='group';return {ok:true};
    }
    if(this.phase==='remainder'){
      if(value!==this.remainder)return {ok:false,reason:'remainder',message:'Kijk naar het tweede deel. Dat moet er nog af.'};
      this.enteredRemainder=value;this.phase='answer';return {ok:true};
    }
    if(this.phase==='answer'){
      if(value!==this.total)return {ok:false,reason:'answer',message:`Begin bij 10. Haal er nog ${this.remainder} af.`};
      this.answer=value;this.phase='done';return {ok:true};
    }
    return {ok:false};
  }
  selectForSock(role){
    if(this.phase!=='group')return {ok:false};
    if(!['first','part'].includes(role))return {ok:false,reason:'group',message:`Kies ${this.first} en het eerste deel: ${this.first} min dat deel is 10.`};
    if(this.chosen.has(role))this.chosen.delete(role);else this.chosen.add(role);
    if(this.chosen.size===2)this.phase='remainder';return {ok:true};
  }
}
