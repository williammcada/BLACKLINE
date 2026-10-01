/* One contact ownership mechanism for every standalone/embedded build. */
(function(){'use strict';
class Input{
 constructor(surface,onInterrupt){
  this.contacts=new Map();this.keys=new Set();this.listeners=[];this.onInterrupt=onInterrupt;this.surface=surface;
  const on=(t,n,f,o)=>{t.addEventListener(n,f,o);this.listeners.push(()=>t.removeEventListener(n,f,o));};
  const keyMap={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowDown:'brake',KeyS:'brake',Space:'boost'};
  on(window,'keydown',e=>{if(e.target.matches('input,select,textarea'))return;const a=keyMap[e.code];if(a){e.preventDefault();if(!e.repeat)this.keys.add(e.code);}else if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat){e.preventDefault();this.interrupt();}});
  on(window,'keyup',e=>{this.keys.delete(e.code);});
  for(const b of surface.querySelectorAll('[data-action]')){
   on(b,'pointerdown',e=>{e.preventDefault();if(e.pointerType==='mouse'&&e.button!==0)return;this.contacts.set(e.pointerId,{action:b.dataset.action,type:e.pointerType,button:b});b.classList.add('held');try{b.setPointerCapture(e.pointerId);}catch{this.interrupt();}});
   on(b,'lostpointercapture',e=>{if(this.contacts.has(e.pointerId))this.interrupt();});
  }
  const release=e=>{this.contacts.delete(e.pointerId);this.paint();};
  on(window,'pointerup',release,true);on(window,'pointercancel',()=>this.interrupt(),true);
  on(window,'pointermove',e=>{if(e.pointerType==='mouse'&&e.buttons===0)release(e);});
  // Reconcile native touch lists by count: a missing pointerup cannot retain ownership.
  on(window,'touchend',e=>{const owned=[...this.contacts.values()].filter(x=>x.type==='touch').length;if(e.touches.length<owned)this.interrupt();},{capture:true,passive:true});
  on(window,'touchcancel',()=>this.interrupt(),{capture:true,passive:true});
  on(window,'blur',()=>this.interrupt());on(document,'visibilitychange',()=>{if(document.hidden)this.interrupt();});
  on(window,'pagehide',()=>this.interrupt());on(window,'orientationchange',()=>this.interrupt());
  for(const name of ['contextmenu','dragstart','selectstart'])on(surface,name,e=>{if(e.target.closest('input,select,textarea'))return;e.preventDefault();if(name==='contextmenu')this.interrupt();});
  on(surface,'touchmove',e=>{if(!e.target.closest('input,select,textarea'))e.preventDefault();},{passive:false});
  on(surface,'gesturestart',e=>{e.preventDefault();this.interrupt();},{passive:false});
  this.keyMap=keyMap;
 }
 paint(){for(const b of this.surface.querySelectorAll('[data-action]'))b.classList.toggle('held',[...this.contacts.values()].some(x=>x.button===b));}
 clear(){this.contacts.clear();this.keys.clear();this.paint();}
 interrupt(){this.clear();this.onInterrupt();}
 read(){const a=new Set([...this.keys].map(k=>this.keyMap[k]));for(const c of this.contacts.values())a.add(c.action);return {steer:Number(a.has('right'))-Number(a.has('left')),brake:a.has('brake'),boost:a.has('boost')};}
 destroy(){this.clear();for(const f of this.listeners)f();this.listeners=[];}
}
window.BlacklineInput=Input;
})();
