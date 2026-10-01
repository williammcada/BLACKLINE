(function(){'use strict';
const Sim=window.BlacklineSim,$=id=>document.getElementById(id),state=Sim.newState(),renderer=new window.BlacklineRenderer($('canvas')),sound=new window.BlacklineSound();
const input=new window.BlacklineInput($('playfield'),()=>{Sim.pause(state);sound.pause();});
let prior=0,acc=0,lastMode='',ambient=0;
const portrait=()=>window.innerHeight>window.innerWidth&&('ontouchstart' in window||navigator.maxTouchPoints>0);
function viewport(){const h=window.visualViewport?.height||window.innerHeight;$('app').style.setProperty('--vh',Math.round(h)+'px');input.clear();if(state.mode==='running'||state.mode==='countdown')Sim.pause(state);}
window.addEventListener('resize',viewport);window.visualViewport?.addEventListener('resize',viewport);
async function start(){input.clear();sound.reset();Sim.begin(state);if(portrait())Sim.pause(state);await sound.unlock();}
$('play').onclick=start;$('retry').onclick=start;
$('pause').onclick=()=>{input.interrupt();};
$('resume').onclick=async()=>{if(portrait())return;input.clear();await sound.unlock();Sim.resume(state);};
function title(){input.clear();Object.assign(state,Sim.newState());sound.pause();}
$('quit').onclick=title;$('back').onclick=title;
for(const [name,prop] of [['music','music'],['sfx','sfx'],['reduced','motion']]){
 for(const prefix of ['','p'])$(prefix+name).onchange=e=>{const on=e.target.checked;$(name).checked=$('p'+name).checked=on;if(prop==='motion')renderer.motion=!on;else sound[prop]=on;};
}
function time(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');}
const reasons={escaped:['Test course cleared.','You made the jump and reached the exit. How did the steering, braking and ramp feel?'],destroyed:['Interceptor wrecked.','Brake before the bend, then steer through it. Barrier impacts cost integrity and speed.'],'jump-too-slow':['Not enough speed.','Build at least 160 km/h on the straight before the ramp. Keep off the brake at takeoff.'],'missed-ramp':['Missed the ramp.','Line up with the marked center corridor before the road ends.'],'missed-landing':['Missed the landing.','Straighten before takeoff. Only small steering corrections are possible in the air.'],timeout:['Lockdown complete.','The five-minute active-play limit has expired. Try carrying more speed between bends.']};
function ui(){const active=state.mode!=='title';$('titleview').hidden=active;$('hud').hidden=!active;$('controls').hidden=!['running','countdown'].includes(state.mode);$('pauseview').hidden=state.mode!=='paused';$('resultview').hidden=state.mode!=='result';$('rotate').hidden=!(active&&state.mode!=='result'&&portrait());$('pause').hidden=!['running','countdown'].includes(state.mode);
 $('speed').textContent=Math.round(state.v*3.6);$('hp').firstChild.textContent=Math.ceil(state.hp);$('charge').firstChild.textContent=Math.round(state.boost*100);$('integritybar').style.width=state.hp+'%';$('boostbar').style.width=state.boost*100+'%';$('progressbar').style.width=Math.min(100,state.z/Sim.C.length*100)+'%';$('time').textContent=time(state.t)+' / 05:00';$('zone').textContent=Sim.zone(state.z);
 $('count').hidden=state.mode!=='countdown';$('count').textContent=Math.max(1,Math.ceil(state.countdown));
 let cue='';if(state.mode==='running'){
  if(state.jump)cue='HOLD YOUR LINE<small>AIRBORNE</small>';
  else if(state.z>2530&&state.z<2850)cue=`${state.v*3.6>=160?'SPEED READY':'BUILD SPEED'} · ${Math.ceil(2850-state.z)} m<small>CENTER ON RAMP · 160+ KM/H</small>`;
  else if(state.z>2890&&state.z<3050&&state.landed)cue='JUMP CLEARED<small>THE EXIT IS AHEAD</small>';
  else {const next=Sim.bends.find(b=>state.z>b.a-130&&state.z<b.b-40);if(next)cue=`${next.k>0?'RIGHT':'LEFT'} BEND<small>${Math.abs(next.k)>1.6?'BRAKE EARLY · 150–175 KM/H':'FOLLOW THE LINE'}</small>`;}
 }
 $('cue').hidden=!cue;$('cue').innerHTML=cue;
 if(state.mode!==lastMode){if(['result','paused','title'].includes(state.mode))input.clear();if(state.mode==='result'){const r=reasons[state.reason]||['Run ended.','Try again.'];$('resulttitle').textContent=r[0];$('resulttext').textContent=r[1];$('resultlabel').textContent=state.reason==='escaped'?'EXIT REACHED / DRIVING PROOF':'RUN ENDED / DRIVING PROOF';$('resultstats').innerHTML=`<div><span class="label">ACTIVE TIME</span><strong>${time(state.t)}</strong></div><div><span class="label">COURSE</span><strong>${Math.round(state.z/Sim.C.length*100)}%</strong></div><div><span class="label">IMPACTS</span><strong>${state.collisions}</strong></div>`;}lastMode=state.mode;}
}
function frame(ms){const dt=prior?(ms-prior)/1000:0;prior=ms;ambient+=Math.min(dt,.04);
 if(dt>.25){input.interrupt();acc=0;}else{acc+=dt;let count=0;while(acc>=1/60&&count++<8){Sim.tick(state,1/60,input.read());acc-=1/60;}if(count>=8)acc=0;}
 for(const e of state.events)sound.fx(e);state.events.length=0;sound.update(state);ui();renderer.draw(state,ambient);requestAnimationFrame(frame);
}
viewport();ui();requestAnimationFrame(frame);
// Observable read-only state for diagnostics; development hooks are injected by tests, not shipped.
Object.defineProperty(window,'BLACKLINE',{value:Object.freeze({version:Sim.VERSION,snapshot:()=>JSON.parse(JSON.stringify({...state,events:[]}))})});
})();
