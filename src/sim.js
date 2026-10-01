/* BLACKLINE simulation. No DOM or frame-clock dependency. Units: metres, seconds. */
(function(root){
'use strict';
const VERSION='0.1.0-alpha.1';
const C={max:220/3.6,boostMax:260/3.6,accel:8,brake:20,boostAccel:14,gravity:20,jumpVy:10,roadHalf:7.2,length:3600,limit:300};
const JUMP={start:2850,end:2890,corridor:.68,safeKmh:160};
const bends=[{a:350,b:680,k:1.2},{a:800,b:1130,k:-1.8},{a:1280,b:1590,k:2.15},{a:1750,b:2090,k:-2.05},{a:2190,b:2450,k:1.5}];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function curve(z){for(const b of bends)if(z>=b.a&&z<=b.b)return b.k*Math.sin(Math.PI*(z-b.a)/(b.b-b.a));return 0;}
function elevation(z){return 11*Math.sin(z/290)+6*Math.sin(z/145);}
function zone(z){return z<750?'LOCKDOWN AVENUE':z<1650?'FOUNDRY BENDS':z<2500?'THE ASCENT':z<2950?'BROKEN SKYWAY':'EXIT APPROACH';}
function newState(){return {mode:'title',z:0,x:0,v:0,lv:0,hp:100,boost:1,t:0,cooldown:0,collisions:0,jump:null,jumped:false,landed:false,airY:0,steer:0,braking:false,boosting:false,countdown:3,reason:'',events:[],resultCount:0,impact:0};}
function begin(s){Object.assign(s,newState(),{mode:'countdown'});}
function pause(s){if(s.mode==='running'||s.mode==='countdown'){s.resumeMode=s.mode;s.mode='paused';s.steer=0;s.braking=false;s.boosting=false;}}
function resume(s){if(s.mode==='paused'){s.mode='countdown';s.countdown=1;}}
function finish(s,reason){if(s.mode==='result')return;s.mode='result';s.reason=reason;s.resultCount++;s.steer=0;s.boosting=false;s.braking=false;s.events.push(reason==='escaped'?'win':'fail');}
function damage(s,amount){if(s.cooldown>0)return;s.hp=Math.max(0,s.hp-amount);s.cooldown=1;s.collisions++;s.impact=1;s.events.push('hit');if(s.hp<=0)finish(s,'destroyed');}
function drive(s,dt,input){
 if(s.mode!=='running')return;
 const steer=clamp(Number(input.steer)||0,-1,1),brake=!!input.brake;
 const boost=!!input.boost&&!brake&&!s.jump&&s.boost>0;
 s.steer=steer;s.braking=brake&&!s.jump;s.boosting=boost;
 s.cooldown=Math.max(0,s.cooldown-dt);s.impact=Math.max(0,s.impact-dt*3);
 if(s.jump){
   const untilLand=1-s.jump.age;
   const part=Math.min(dt,untilLand);
   s.lv=clamp(s.lv+steer*.25*part,-.5,.5);
   s.x+=s.lv*part;s.z+=s.v*part;s.jump.age+=part;
   s.airY=Math.max(0,C.jumpVy*s.jump.age-.5*C.gravity*s.jump.age*s.jump.age);
   s.t+=part;
   if(s.jump.age>=1-1e-8){
    s.jump=null;s.airY=0;
    if(s.z<JUMP.end-1e-7){finish(s,'jump-too-slow');return;}
    if(Math.abs(s.x)>1){finish(s,'missed-landing');return;}
    s.landed=true;s.events.push('land');if(Math.abs(s.x)>.85)damage(s,10);
    if(dt>part)drive(s,dt-part,input);
   }
   return;
 }
 const oldV=s.v;
 if(brake)s.v=Math.max(0,s.v-C.brake*dt);
 else s.v=Math.min(boost?C.boostMax:C.max,s.v+(boost?C.boostAccel:C.accel)*dt);
 // Smoothly settle overspeed after boost rather than snapping speed down.
 if(!boost&&!brake&&oldV>C.max)s.v=Math.max(C.max,oldV-10*dt);
 const speed=(oldV+s.v)/2;
 let travel=speed*dt;
 if(!s.jumped&&s.z<JUMP.start&&s.z+travel>=JUMP.start){
   const f=(JUMP.start-s.z)/travel;
   s.v=oldV;
   drive(s,Math.max(0,dt*f-1e-9),input);
   if(s.mode!=='running')return;
   s.z=JUMP.start;s.jumped=true;
   if(Math.abs(s.x)>JUMP.corridor){finish(s,'missed-ramp');return;}
   s.jump={age:0};s.lv=clamp(s.lv,-.25,.25);s.boosting=false;s.braking=false;s.events.push('jump');
   if(dt*(1-f)>0)drive(s,dt*(1-f),input);
   return;
 }
 if(s.z+travel>=C.length){const f=(C.length-s.z)/travel;dt*=f;travel=C.length-s.z;}
 const n=s.v/C.max;
 const steerRate=1.65*(.3+.7*n);
 const outward=curve(s.z)*n*n*.98;
 const target=steer*steerRate-outward;
 s.lv+=(target-s.lv)*Math.min(1,dt*(brake?9:7));
 s.x+=s.lv*dt;
 s.z+=travel;s.t+=dt;
 if(boost)s.boost=Math.max(0,s.boost-dt/2);else s.boost=Math.min(1,s.boost+dt/10);
 if(Math.abs(s.x)>1){
   const hp=s.hp;damage(s,12);if(s.hp!==hp)s.v*=.75;
   s.x=clamp(s.x,-1.16,1.16);
 }
 if(s.mode==='running'&&s.z>=C.length-1e-7)finish(s,s.t<C.limit?'escaped':'timeout');
}
function tick(s,dt,input={}){
 if(!Number.isFinite(dt)||dt<=0)return;
 if(dt>.25){pause(s);return;}
 if(s.mode==='countdown'){s.countdown-=dt;if(s.countdown<=0){s.mode='running';s.events.push('go');}return;}
 if(s.mode!=='running')return;
 const remaining=C.limit-s.t;
 drive(s,Math.min(dt,remaining),input);
 if(s.mode==='running'&&s.t>=C.limit-1e-8)finish(s,'timeout');
}
const api={VERSION,C,JUMP,bends,curve,elevation,zone,clamp,newState,begin,pause,resume,finish,tick};
root.BlacklineSim=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
