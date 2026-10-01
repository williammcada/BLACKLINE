(function(){'use strict';
const S=window.BlacklineSim,W=480,H=270;
class Renderer{
 constructor(canvas){this.c=canvas;this.g=canvas.getContext('2d',{alpha:false});this.motion=true;this.g.imageSmoothingEnabled=false;}
 poly(points,color){const g=this.g;g.fillStyle=color;g.beginPath();points.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();}
 rect(x,y,w,h,c){const g=this.g;g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
 background(s,time){const g=this.g;const grad=g.createLinearGradient(0,0,0,175);grad.addColorStop(0,'#080d1d');grad.addColorStop(.6,'#382743');grad.addColorStop(1,'#a65653');g.fillStyle=grad;g.fillRect(0,0,W,H);
  // Smog sun and rainless, readable industrial skyline.
  this.rect(341,34,48,2,'#bb675a');for(let i=0;i<9;i++)this.rect(333+Math.abs(4-i)*2,37+i*4,64-Math.abs(4-i)*4,3,'#c16c58');
  for(let layer=0;layer<2;layer++)for(let i=-2;i<23;i++){const shift=(s.z*(layer?.022:.009)+s.x*3)%(layer?33:25),x=i*(layer?33:25)-shift,h=18+((i*17+71)%49),y=145-h;this.rect(x,y,layer?25:20,h,layer?'#17242f':'#252437');if(layer){this.rect(x+4,y-4,3,4,'#273d44');for(let j=0;j<h-8;j+=9)for(let k=0;k<3;k++)if((i+j+k)%3!==0)this.rect(x+4+k*6,y+5+j,2,3,(i+k)%3?'#5c534a':'#6e8f83');}}
  for(let i=0;i<4;i++){let x=55+i*132-(s.z*.025)%132;this.rect(x,91,9,60,'#182b32');this.rect(x-2,90,13,4,'#ca705a');for(let k=0;k<5;k++){g.fillStyle='#302d40';g.beginPath();g.ellipse(x+4+k*7,86-k*5,9+k*2,5,0,0,7);g.fill();}}
  this.rect(0,149,W,121,'#182a2c');
 }
 draw(s,time){const g=this.g;g.save();if(this.motion&&s.impact>0)g.translate(Math.round(Math.sin(time*83)*s.impact*2),Math.round(Math.cos(time*71)*s.impact));this.background(s,time);
  const cameraZ=s.z-10,cameraY=S.elevation(s.z)+4,camX=s.x*5,near=2,far=640,ds=8;
  const project=(z,offset)=>{const d=z-cameraZ,f=204/d;return {x:240+(offset-camX)*f,y:126+(cameraY-S.elevation(z))*f,w:S.C.roadHalf*f,f};};
  let offset=0,heading=0,maxY=H,props=[];
  for(let d=near;d<far;d+=ds){const z1=cameraZ+d,z2=z1+ds;const k=S.curve(z1);const off1=offset;heading+=k*.0019*ds;offset+=heading*ds;const a=project(z1,off1),b=project(z2,offset);if(b.y>=a.y||b.y>=maxY)continue;const oldMax=maxY;maxY=b.y;if(b.y>H)continue;
   const stripe=Math.floor(z1/24)%2, gap=z2>S.JUMP.start&&z1<S.JUMP.end;
   g.save();g.beginPath();g.rect(0,0,W,Math.min(H,oldMax));g.clip();
   this.rect(0,b.y,W,a.y-b.y+1,gap?'#08151d':stripe?'#1b3031':'#1c3333');
   if(!gap){
    this.poly([[a.x-a.w*1.18,a.y],[a.x+a.w*1.18,a.y],[b.x+b.w*1.18,b.y],[b.x-b.w*1.18,b.y]],stripe?'#536164':'#344750');
    this.poly([[a.x-a.w,a.y],[a.x+a.w,a.y],[b.x+b.w,b.y],[b.x-b.w,b.y]],stripe?'#29343c':'#2b363e');
    for(const side of [-1,1])this.poly([[a.x+a.w*side,a.y],[a.x+a.w*.965*side,a.y],[b.x+b.w*.965*side,b.y],[b.x+b.w*side,b.y]],'#d9a65e');
    if(stripe)for(const p of [-.333,.333])this.poly([[a.x+a.w*(p-.009),a.y],[a.x+a.w*(p+.009),a.y],[b.x+b.w*(p+.009),b.y],[b.x+b.w*(p-.009),b.y]],'#738887');
    if(z1>2770&&z1<2850){const green=s.v*3.6>=160?'#67e4b1':'#edab55';this.poly([[a.x-a.w*.68,a.y],[a.x+a.w*.68,a.y],[b.x+b.w*.68,b.y],[b.x-b.w*.68,b.y]],stripe?green:'#3b695c');}
    if(z1>=S.C.length&&z1<S.C.length+18)for(let n=0;n<10;n++)this.poly([[a.x-a.w+n*a.w/5,a.y],[a.x-a.w+(n+1)*a.w/5,a.y],[b.x-b.w+(n+1)*b.w/5,b.y],[b.x-b.w+n*b.w/5,b.y]],(n+stripe)%2?'#fff1ca':'#14252e');
   }else{
    this.poly([[a.x-a.w*1.18,a.y],[a.x+a.w*1.18,a.y],[b.x+b.w*1.18,b.y],[b.x-b.w*1.18,b.y]],'#080f18');
    if(z2>=S.JUMP.end)this.rect(b.x-b.w,b.y,b.w*2,Math.max(1,b.f*.4),'#f09361');
   }
   // Safety barriers and moving roadside light posts establish speed.
   if(!gap)for(const side of [-1,1]){const x1=a.x+side*a.w*1.1,x2=b.x+side*b.w*1.1;this.poly([[x1,a.y],[x1,a.y-a.f*.55],[x2,b.y-b.f*.55],[x2,b.y]],stripe?'#c68b61':'#4e6669');}
   if(Math.floor(z1/48)!==Math.floor(z2/48))props.push({p:b,z:z2,clip:oldMax});
   g.restore();
  }
  for(const {p,z,clip} of props.reverse()){
   if(p.f<.22)continue;g.save();g.beginPath();g.rect(0,0,W,Math.min(H,clip));g.clip();
   for(const side of [-1,1]){let x=p.x+side*p.w*1.45,y=p.y,h=Math.min(110,p.f*5);this.rect(x,y-h,Math.max(1,p.f*.16),h,'#46656b');this.rect(x-(side<0?0:p.f*1.4),y-h,p.f*1.6,Math.max(1,p.f*.25),'#ffc98a');}
   if(Math.floor(z/48)%6===0){let x=p.x-p.w*2,y=p.y-5*p.f;this.rect(x,y,3.8*p.f,2.1*p.f,'#263a43');this.rect(x,y,3.8*p.f,.18*p.f,'#db855c');if(p.f>.6){g.fillStyle='#ebc596';g.font=`bold ${Math.max(4,p.f*.65)}px monospace`;g.fillText('SECTOR 09',x+.2*p.f,y+1.3*p.f);}}
   g.restore();
  }
  // Spark trails, shadow and suspension stay aligned with the road coordinate.
  const px=240+s.x*44.9,py=214-s.airY*10;
  if(s.mode==='running'&&s.braking&&Math.abs(s.steer)>.1){for(let i=0;i<5;i++){this.rect(px-20+s.steer*i*2,py+23+i*3,3,2,'#6b7478');this.rect(px+18+s.steer*i*2,py+23+i*3,3,2,'#6b7478');}}
  g.fillStyle='#0c161bc0';g.beginPath();g.ellipse(px,241,36-s.airY*2,6,0,0,7);g.fill();
  g.save();g.translate(Math.round(px),Math.round(py));g.rotate(s.steer*(s.braking?.095:.045));
  if(s.boosting){this.poly([[-17,26],[-8,26],[-13,40+Math.sin(time*40)*5]],'#d5ffee');this.poly([[8,26],[17,26],[13,40+Math.cos(time*40)*5]],'#73f0cc');}
  this.rect(-30,4,8,23,'#0a1119');this.rect(22,4,8,23,'#0a1119');
  this.poly([[-27,0],[-19,-15],[18,-15],[27,0],[29,22],[-29,22]],'#7eafb0');
  this.poly([[-19,-12],[-13,-21],[12,-21],[19,-12],[21,-1],[-22,-1]],'#183b4b');
  this.poly([[-13,-18],[11,-18],[16,-5],[-18,-5]],'#397489');this.rect(-14,-16,24,2,'#85c0c1');
  this.rect(-28,3,56,16,'#c1cbb2');this.rect(-22,6,44,5,'#48616a');this.rect(-30,0,60,4,'#213744');
  this.rect(-27,15,15,4,s.braking?'#fff3c9':'#ff7258');this.rect(12,15,15,4,s.braking?'#fff3c9':'#ff7258');this.rect(-8,15,16,5,'#212c37');this.rect(-29,23,58,4,'#23323c');
  if(s.hp<50){this.rect(-19,4,5,2,'#31373c');this.rect(12,10,7,2,'#31373c');}
  g.restore();
  if(s.impact>.6)for(let i=0;i<6;i++)this.rect(px+(s.x<0?-30:30)+Math.sin(time*12+i)*12,py+Math.cos(time*9+i)*14,2,2,'#ffcc83');
  if(this.motion&&s.boosting){g.strokeStyle='#a0cfbf55';for(let i=0;i<6;i++){let side=i%2?1:-1,x=240+side*(100+i*14);g.beginPath();g.moveTo(x,175+i*9);g.lineTo(x+side*24,190+i*9);g.stroke();}}
  g.restore();
 }
}
window.BlacklineRenderer=Renderer;
})();
