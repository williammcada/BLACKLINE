(function(){'use strict';
const Sim=window.BlacklineSim,$=id=>document.getElementById(id),state=Sim.newState(),renderer=new window.BlacklineRenderer($('canvas')),sound=new window.BlacklineSound();
const input=new window.BlacklineInput($('playfield'),()=>{Sim.pause(state);sound.pause();});
let prior=0,acc=0,lastMode='',ambient=0;
const portrait=()=>window.innerHeight>window.innerWidth&&('ontouchstart' in window||navigator.maxTouchPoints>0);
function viewport(){const h=window.visualViewport?.height||window.innerHeight;$('app').style.setProperty('--vh',Math.round(h)+'px');input.clear();if(state.mode==='running'||state.mode==='countdown')Sim.pause(state);}
window.addEventListener('resize',viewport);window.visualViewport?.addEventListener('resize',viewport);
async function start(){input.clear();sound.reset();Sim.begin(state,7319);if(portrait())Sim.pause(state);await sound.unlock();}
$('play').onclick=start;$('retry').onclick=start;
$('pause').onclick=()=>{input.interrupt();};
$('resume').onclick=async()=>{if(portrait())return;input.clear();await sound.unlock();Sim.resume(state);};
function title(){input.clear();Object.assign(state,Sim.newState());sound.pause();}
$('quit').onclick=title;$('back').onclick=title;
for(const [name,prop] of [['music','music'],['sfx','sfx'],['reduced','motion']]){
 for(const prefix of ['','p'])$(prefix+name).onchange=e=>{const on=e.target.checked;$(name).checked=$('p'+name).checked=on;if(prop==='motion')renderer.motion=!on;else sound[prop]=on;};
}
function time(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');}
const reasons={escaped:['You broke the Blackline.','The patrol signal fades behind you. Three gaps cleared. The last exit is yours.'],destroyed:['Your car is wrecked.','Dodge the red aim lane before the burst. Brake behind a rammer or steer away from its warning side.'],'jump-too-slow':['Not enough speed.','Follow the speed shown for each ramp. Straighten and accelerate before takeoff; boost is optional.'],'missed-ramp':['Missed the ramp.','Line up with the marked center corridor before the road ends.'],'missed-landing':['Missed the landing.','Straighten before takeoff. Only small steering corrections are possible in the air.'],timeout:['Lockdown complete.','The five-minute active-play limit expired. Carry speed out of bends and save boost for the straights.']};
function rear(){const g=$('scanner').getContext('2d');g.clearRect(0,0,172,54);g.fillStyle='#102936';g.fillRect(16,3,140,49);g.strokeStyle='#54766b';g.setLineDash([2,5]);for(const x of [61,111]){g.beginPath();g.moveTo(x,0);g.lineTo(x,54);g.stroke();}g.setLineDash([]);g.fillStyle='#bddac7';g.fillRect(80,0,12,5);for(const e of state.enemies){const distance=state.z-e.z,f=1-Sim.clamp(distance/340,0,1),w=9+9*f,x=86+e.x*49,y=13+Sim.clamp(distance/340,0,1)*30;g.fillStyle=e.type==='rammer'?'#d39c62':'#c56c86';g.fillRect(x-w/2,y,w,w*.58);g.fillStyle='#c3dae1';g.fillRect(x-w*.32,y+2,w*.25,2);g.fillRect(x+w*.1,y+2,w*.25,2);if(e.phase!=='follow'){g.strokeStyle='#ffd898';g.strokeRect(x-w/2-2,y-2,w+4,w*.58+4);}}
 const close=[...state.enemies].sort((a,b)=>Math.abs(a.z-state.z)-Math.abs(b.z-state.z))[0];$('threat').textContent=close?`${close.type==='rammer'?'ARMORED':'INTERCEPTOR'} · ${Math.round(Math.abs(state.z-close.z))} m ${close.z>state.z?'AHEAD':'BEHIND'}`:'NO CONTACT · KEEP MOVING';
}

function ui(){const active=state.mode!=='title';$('titleview').hidden=active;$('rear').hidden=!active;rear();$('hud').hidden=!active;$('controls').hidden=!['running','countdown'].includes(state.mode);$('pauseview').hidden=state.mode!=='paused';$('resultview').hidden=state.mode!=='result';$('rotate').hidden=!(active&&state.mode!=='result'&&portrait());$('pause').hidden=!['running','countdown'].includes(state.mode);
 $('speed').textContent=Math.round(state.v*3.6);$('hp').firstChild.textContent=Math.ceil(state.hp);$('charge').firstChild.textContent=Math.round(state.boost*100);$('integritybar').style.width=state.hp+'%';$('boostbar').style.width=state.boost*100+'%';$('progressbar').style.width=Math.min(100,state.z/Sim.C.length*100)+'%';$('time').textContent=time(state.t)+' / 05:00';$('zone').textContent=Sim.zone(state.z);
 $('count').hidden=state.mode!=='countdown';$('count').textContent=Math.max(1,Math.ceil(state.countdown));
 let cue='';if(state.mode==='running'){
  const j=Sim.nextJump(state.z),repair=Sim.REPAIRS.find((r,i)=>!state.picked.includes(i)&&r.z>state.z&&r.z-state.z<200);
  if(state.jump)cue=`HOLD YOUR LINE<small>JUMP ${state.jump.id+1} / 3</small>`;
  else if(j&&j.start-state.z<330)cue=`${state.v*3.6>=j.safeKmh?'SPEED READY':'BUILD SPEED'} · ${Math.ceil(j.start-state.z)} m<small>CENTER ON RAMP · ${j.safeKmh}+ KM/H</small>`;
  else if(state.t<state.safeUntil)cue=`JUMP ${state.landings} CLEARED<small>${state.landings===3?'THE EXIT IS AHEAD':'KEEP THE PATROL BEHIND YOU'}</small>`;
  else if(repair)cue=`REPAIR · ${Math.ceil(repair.z-state.z)} m<small>TAKE THE ${repair.x>0?'RIGHT':'LEFT'} LINE · +20 INTEGRITY</small>`;
  else{const next=Sim.bends.find(b=>state.z>b.a-130&&state.z<b.b-40);if(next)cue=`${next.k>0?'RIGHT':'LEFT'} BEND<small>${Math.abs(next.k)>1.6?'BRAKE EARLY · 150–175 KM/H':'FOLLOW THE LINE'}</small>`;}
 }
 const enemy=state.enemies.find(e=>e.phase!=='follow');$('attack').hidden=state.mode!=='running'||!enemy;
 $('attack').textContent=enemy?(enemy.type==='rammer'?`RAM ${enemy.side<0?'LEFT':'RIGHT'} · BRAKE OR MOVE AWAY`:(enemy.age<.7?'TARGETING · GET READY TO MOVE':'AIM LOCKED · MOVE SIDEWAYS')):'';
 $('notice').hidden=state.mode!=='running'||state.noticeUntil<state.t;$('notice').textContent=state.notice;
 $('cue').hidden=!cue;$('cue').innerHTML=cue;
 if(state.mode!==lastMode){if(['result','paused','title'].includes(state.mode))input.clear();if(state.mode==='result'){const r=reasons[state.reason]||['Run ended.','Try again.'];$('resulttitle').textContent=r[0];$('resulttext').textContent=state.reason==='destroyed'?`Final hit: ${state.deathCause==='burst'?'interceptor gunfire':state.deathCause==='ram'?'armored rammer':state.deathCause==='landing'?'rough landing':'barrier impact'}. ${r[1]}`:r[1];$('resultlabel').textContent=state.reason==='escaped'?'ESCAPED / BLACKLINE':'RUN ENDED / BLACKLINE';$('resultstats').innerHTML=`<div><span class="label">ACTIVE TIME</span><strong>${time(state.t)}</strong></div><div><span class="label">COURSE</span><strong>${Math.round(state.z/Sim.C.length*100)}%</strong></div><div><span class="label">JUMPS</span><strong>${state.landings}/3</strong></div><div><span class="label">ENEMY HITS</span><strong>${state.stats.hits}</strong></div>`;}lastMode=state.mode;}
}
function frame(ms){const dt=prior?(ms-prior)/1000:0;prior=ms;ambient+=Math.min(dt,.04);
 if(dt>.25){input.interrupt();acc=0;}else{acc+=dt;let count=0;while(acc>=1/60&&count++<8){Sim.tick(state,1/60,input.read());acc-=1/60;}if(count>=8)acc=0;}
 for(const e of state.events)sound.fx(e);state.events.length=0;sound.update(state);ui();renderer.draw(state,ambient);requestAnimationFrame(frame);
}
viewport();ui();requestAnimationFrame(frame);
// Observable read-only state for diagnostics; development hooks are injected by tests, not shipped.
Object.defineProperty(window,'BLACKLINE',{value:Object.freeze({version:Sim.VERSION,snapshot:()=>JSON.parse(JSON.stringify({...state,events:[]}))})});
})();
