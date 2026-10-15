import {forestStories} from './forest.mjs';
// Narrative surrounds complete calculations; lesson pacing remains in LessonSession.
export class StoryFlow {
  constructor(session) { this.session=session; this.enabled=true; this.scene='opening';this.storyIndex=0; }
  get theme() {return forestStories[this.storyIndex];}
  chooseStory(index) {if(!Number.isInteger(index)||index<0||index>=forestStories.length)return false;this.storyIndex=index;return true;}
  nextStory() {this.storyIndex=(this.storyIndex+1)%forestStories.length;}
  get visible() { return this.enabled && this.scene!==null; }
  get actionLabel() {
    if(this.scene==='opening') return 'Naar de les →';
    if(this.scene==='problem') return this.session.mode==='demo'?'Doe voor →':'Reken uit →';
    return this.session.mode==='demo'?'Samen oefenen →':this.session.chapter==='check'?'Bespreek de aanpak →':this.session.mode==='guided'?'Korte controle →':'Verder in het bos →';
  }
  advance() {
    if(this.visible) {
      if(this.scene==='opening'||this.scene==='problem') {this.scene=null;return;}
      this.scene=null;this.transition(()=>this.session.advance());return;
    }
    if(this.enabled && !this.session.intro && this.session.chapter!=='discussion' && this.session.exercise.phase==='done') {this.scene='result';return;}
    this.transition(()=>this.session.advance());
  }
  transition(action) {
    const before=this.session.exercise, intro=this.session.intro;
    action();
    if(before!==this.session.exercise)this.nextStory();
    if(this.enabled && !this.session.intro && this.session.chapter!=='discussion' && (before!==this.session.exercise || intro)) this.scene='problem';
  }
  setMode(mode) {this.session.setMode(mode);this.scene=this.enabled?(mode==='demo'?'opening':'problem'):null;}
  repeatGuided() {this.session.repeatGuided();this.nextStory();this.scene=this.enabled?'problem':null;}
  reset() {this.session.reset();this.scene=this.enabled?(this.session.intro?'opening':'problem'):null;}
  toggle() {
    this.enabled=!this.enabled;
    this.scene=this.enabled?(this.session.intro?'opening':this.session.chapter==='discussion'?null:this.session.exercise.phase==='done'?'result':'problem'):null;
  }
}
