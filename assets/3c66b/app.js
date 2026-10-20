(function(){
'use strict';
const M=window.BinaryJet,$=id=>document.getElementById(id),p={...M.defaults};
const colors={near:'#65d9ec',far:'#ffb578',bh:'#bf9bff',white:'#dbe7f3',muted:'#91a6ba',grid:'#20364a'};
let phase=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,speed=.1,trace=false,traceAngle=M.TAU,view='oblique',az=-.52,el=.35,zoom=1,last=0,dirty=true;
const definitions=[
 ['inclination','Orbital inclination, i',0,90,1,'°'],['jetAngle','Jet angle to sightline, θ',5,85,1,'°'],['near','8.4 GHz core distance, s₈',.005,.15,.005,' pc'],['far','2.3 GHz core distance, s₂',.16,.8,.01,' pc'],
 ['radius','Jet BH orbit radius, R',.002,.017,.0002,' pc'],['q','Mass ratio, q = m/M',.05,1,.05,''],['node','Orbit node PA, Ω',0,180,1,'°'],['jetPA','Mean jet PA',0,180,1,'°'],['beta','Jet speed, β = v/c',.5,.99,.01,''],['period','Observed period, P',.8,1.3,.01,' yr'],['distance','Angular distance, D',60,110,1,' Mpc']
];
const format=(v,step)=>Number(v).toFixed(step<.001?4:step<.01?3:step<1?2:0);
for(const [index,d] of definitions.entries()){
 const [key,label,min,max,step,unit]=d,wrap=document.createElement('label');wrap.className='control';
 wrap.innerHTML=`<span class="row"><span>${label}</span><output id="out-${key}"></output></span><input type="range" id="p-${key}" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${p[key]}">`;
 $(index<4?'controls':'advanced-controls').append(wrap);
 $('p-'+key).addEventListener('input',e=>{p[key]=+e.target.value;updateParameters();});
}
function updateParameters(){
 for(const [key,,min,max,step,unit] of definitions){$('p-'+key).value=p[key];$('out-'+key).textContent=format(p[key],step)+unit;}
 const d=M.derived(p),sci=x=>x.toExponential(2).replace('e+',' × 10^');
 $('derived').innerHTML=`<p>Separation <strong>${d.separation.toFixed(4)} pc</strong></p><p>M = <strong>${sci(d.M)} M☉</strong></p><p>m = <strong>${sci(d.m)} M☉</strong></p><p>Orbital speed <strong>${d.speed.toFixed(3)} c</strong></p><p>Jet / orbit-axis tilt <strong>${d.misalignment.toFixed(1)}°</strong></p><p>1 μas = <strong>${(p.distance*1e6/M.UAS).toFixed(6)} pc</strong></p>`;
 $('approximation').textContent=`First-order expansion scale vₘ/(βc) = ${d.wobble.toFixed(2)}. ${d.wobble>.3?'This setting is outside a comfortable small-angle regime; treat its geometry as qualitative.':'The jet response is approximate even in this small-angle regime.'} Masses use Newtonian Kepler dynamics and z = 0.0215.`;
 for(const [key,id] of [['near','8'],['far','2']]){const e=M.ellipse(p,p[key]);$('metrics'+id).innerHTML=`<span>Model a <strong>${e.a.toFixed(1)} μas</strong></span><span>b/a <strong>${e.ratio.toFixed(2)}</strong></span><span>PA <strong>${e.pa.toFixed(1)}°</strong></span>`;}
 dirty=true;
}
function setPlaying(value){playing=value;$('play').textContent=playing?'Pause':'Play';}
$('play').onclick=()=>setPlaying(!playing);
$('phase').oninput=e=>{phase=+e.target.value*M.DEG;trace=false;traceAngle=M.TAU;$('trace').textContent='Trace one orbit';setPlaying(false);dirty=true;};
$('speed').onchange=e=>speed=+e.target.value;
$('component').onchange=e=>{p.component=e.target.value;updateParameters();};
for(const id of ['rays','labels','fits'])$(id).onchange=()=>dirty=true;
$('trace').onclick=()=>{phase=0;trace=true;traceAngle=0;setPlaying(true);$('trace').textContent='Tracing…';dirty=true;};
function setView(v){view=v;zoom=1;az=v==='sky'?0:-.52;el=v==='sky'?0:.35;for(const [id,target] of [['oblique','oblique'],['sky-view','sky'],['binary-view','binary']])$(id).classList.toggle('selected',v===target);dirty=true;}
$('oblique').onclick=()=>setView('oblique');$('sky-view').onclick=()=>setView('sky');$('binary-view').onclick=()=>setView('binary');
$('reset').onclick=()=>{Object.assign(p,M.defaults);phase=0;trace=false;traceAngle=M.TAU;speed=.1;$('speed').value='0.1';$('component').value='both';$('fits').checked=$('rays').checked=$('labels').checked=true;$('trace').textContent='Trace one orbit';setView('oblique');setPlaying(!matchMedia('(prefers-reduced-motion: reduce)').matches);updateParameters();};
function prep(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height;if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.lineCap='round';c.lineJoin='round';return {c,w,h};}
function path(c,pts,color,width=1,dash=[]){if(!pts.length)return;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
function text(c,s,x,y,color=colors.muted,size=10,align='left'){c.font=`${size}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;c.textAlign=align;c.fillStyle=color;c.fillText(s,x,y);}
function dot(c,p,color,r=4,hollow=false,diamond=false){c.beginPath();if(diamond){c.moveTo(p[0],p[1]-r-1);c.lineTo(p[0]+r+1,p[1]);c.lineTo(p[0],p[1]+r+1);c.lineTo(p[0]-r-1,p[1]);c.closePath();}else c.arc(p[0],p[1],r,0,M.TAU);c.fillStyle=hollow?'#0b1929':color;c.fill();c.strokeStyle=color;c.lineWidth=1.4;c.stroke();}
function samples(fn,start=0,end=M.TAU,n=160){return Array.from({length:n+1},(_,k)=>fn(start+(end-start)*k/n));}
function arrow(c,a,b,color,width=1){path(c,[a,b],color,width);const t=Math.atan2(b[1]-a[1],b[0]-a[0]),l=7;path(c,[[b[0]-l*Math.cos(t-.4),b[1]-l*Math.sin(t-.4)],b,[b[0]-l*Math.cos(t+.4),b[1]-l*Math.sin(t+.4)]],color,width);}
// Orthographic 3D inspection camera. World basis is (east, north, toward observer).
function camera(point){const x=-point[0],y=point[1],z=point[2],xx=x*Math.cos(az)+z*Math.sin(az),zz=-x*Math.sin(az)+z*Math.cos(az);return [xx,y*Math.cos(el)-zz*Math.sin(el),y*Math.sin(el)+zz*Math.cos(el)];}
function scene(){
 const {c,w,h}=prep($('scene')),g=M.geometry(p),bh=M.blackHoles(p,phase),binary=view==='binary',length=binary?p.radius*3.3:p.far*1.17,skyZ=length*.75;
 const near=M.point(p,p.near,phase),far=M.point(p,p.far,phase),rays=$('rays').checked&&!binary;
 const orbit=samples(t=>M.blackHoles(p,t).m),orbits=[orbit,orbit.map(v=>M.mul(v,-p.q))];
 const trajectories=binary?[]:['near','far'].map(key=>samples(t=>M.point(p,p[key],t)));
 const planeCloud=trajectories.flat(),planeXs=planeCloud.map(v=>v[0]),planeYs=planeCloud.map(v=>v[1]),pad=p.radius*1.5;
 const planeCorners=binary?[]:[[Math.min(...planeXs)-pad,Math.min(...planeYs)-pad,skyZ],[Math.max(...planeXs)+pad,Math.min(...planeYs)-pad,skyZ],[Math.max(...planeXs)+pad,Math.max(...planeYs)+pad,skyZ],[Math.min(...planeXs)-pad,Math.max(...planeYs)+pad,skyZ]];
 const cloud=[...orbits.flat(),[0,0,0],M.mul(g.jet,length),[0,0,length],...trajectories.flat()];
 if(rays)cloud.push(...planeCorners);
 if(rays)for(const trajectory of trajectories)cloud.push(...trajectory.map(a=>[a[0],a[1],skyZ]));
 const transformed=cloud.map(camera),xs=transformed.map(v=>v[0]),ys=transformed.map(v=>v[1]),x0=(Math.min(...xs)+Math.max(...xs))/2,y0=(Math.min(...ys)+Math.max(...ys))/2;
 const scale=Math.min((w-150)/(Math.max(...xs)-Math.min(...xs)+p.radius),(h-125)/(Math.max(...ys)-Math.min(...ys)+p.radius))*zoom;
 const project=v=>{const a=camera(v);return [w/2+(a[0]-x0)*scale,h/2-(a[1]-y0)*scale,a[2]];};
 $('scene-scale').textContent=binary?'BINARY CLOSE-UP · jet truncated · BH sizes symbolic':`3D MODEL · distances in pc · ${p.component==='both'?'orbit + wobble':p.component==='orbit'?'orbit only':'wobble only (engine held at mean position)'}`;
 // A faint orbital plane makes the inclination legible.
 const planeRadius=p.radius*1.35,plane=[[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]].map(([a,b])=>project(M.add(M.mul(g.u,a*planeRadius),M.mul(g.v,b*planeRadius))));
 c.beginPath();plane.forEach((a,i)=>i?c.lineTo(a[0],a[1]):c.moveTo(a[0],a[1]));c.fillStyle='#bf9bff09';c.fill();path(c,plane,'#bf9bff30');
 const labels=[];const label=(s,v,color,dx=10,dy=-8)=>{if($('labels').checked)labels.push({s,anchor:project(v),color,dx,dy});};
 if(rays){
  const rect=[...planeCorners,planeCorners[0]].map(project);
  c.beginPath();rect.forEach((a,i)=>i?c.lineTo(a[0],a[1]):c.moveTo(a[0],a[1]));c.fillStyle='#65d9ec05';c.fill();path(c,rect,'#335c7155');
  for(const [index,key] of ['near','far'].entries()){
   path(c,trajectories[index].map(a=>project([a[0],a[1],skyZ])),colors[key]+'65',1,[3,4]);
   const a=key==='near'?near:far,b=[a[0],a[1],skyZ];path(c,[project(a),project(b)],colors[key]+'99',1,[4,5]);dot(c,project(b),colors[key],3,true,key==='far');
  }
  label('Sky plane ⟂ n',planeCorners[3],'#8caec2',0,-10);
 }
 path(c,[project([0,0,0]),project(M.mul(g.jet,length))],'#829bae70',1,[5,5]);
 const jetPts=samples(s=>M.point(p,s,phase),0,length,60).map(project);
 c.save();c.shadowColor='#72c8e3';c.shadowBlur=17;path(c,jetPts,'#6ec9e329',12);path(c,jetPts,'#81d9ed75',4);path(c,jetPts,'#b8eeffb0',1.2);c.restore();
 if(!binary){for(const [index,key] of ['near','far'].entries())path(c,samples(t=>project(M.point(p,p[key],t)),0,traceAngle),colors[key],1.6);}
 path(c,orbits[0].map(project),colors.bh+'a0',1.3);path(c,orbits[1].map(project),'#dbe7f380',1);
 const origin=project([0,0,0]);path(c,[[origin[0]-4,origin[1]],[origin[0]+4,origin[1]]],colors.white);path(c,[[origin[0],origin[1]-4],[origin[0],origin[1]+4]],colors.white);
 const points=[{v:bh.m,color:colors.bh,r:binary?9:5,blackhole:true},{v:bh.M,color:colors.white,r:binary?12:7,blackhole:true}];
 if(!binary)points.push({v:near,color:colors.near,r:6},{v:far,color:colors.far,r:6,diamond:true});
 points.sort((a,b)=>project(a.v)[2]-project(b.v)[2]);
 for(const a of points){const pt=project(a.v);c.save();c.shadowColor=a.color;c.shadowBlur=13;dot(c,pt,a.color,a.r,false,a.diamond);c.restore();if(a.blackhole){c.beginPath();c.arc(pt[0],pt[1],a.r*.78,0,M.TAU);c.fillStyle='#02070d';c.fill();} }
 const los=[0,0,length],lvec=M.mul(g.L,binary?p.radius*2:length*.2);
 arrow(c,origin,project(los),'#e4d89d',1.4);arrow(c,origin,project(lvec),colors.bh,1.3);
 label('n · toward observer',los,'#e4d89d',8,0);label('L · orbital angular momentum',lvec,colors.bh,8,-8);
 label('Mean jet axis',M.mul(g.jet,length),'#b1c6d5',10,-12);
 if(!binary){label(`8.4 GHz · τ ≈ 1 · s = ${p.near.toFixed(3)} pc`,near,colors.near,15,-14);label(`2.3 GHz · τ ≈ 1 · s = ${p.far.toFixed(2)} pc`,far,colors.far,14,-12);label('Binary / barycenter',[0,0,0],colors.white,-24,28);}
 else {label('m · jet-emitting BH',bh.m,colors.bh,12,-20);label('M · companion',bh.M,colors.white,12,24);path(c,[project(bh.M),project(bh.m)],'#dbe7f360',1,[3,3]);label(`r = ${(p.radius*(1+p.q)).toFixed(4)} pc`,M.mul(M.add(bh.m,bh.M),.5),colors.white,12,14);}
 // Collision-aware screen-space labels with leaders, kept inside the canvas.
 const boxes=[];
 for(const a of labels){c.font='10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';const tw=c.measureText(a.s).width+12;let x=Math.max(8,Math.min(w-tw-8,a.anchor[0]+a.dx)),y=Math.max(42,Math.min(h-42,a.anchor[1]+a.dy));for(let n=0;n<16&&boxes.some(b=>x<b.x+b.w&&x+tw>b.x&&y-12<b.y+5&&y+5>b.y-12);n++){y+=18;if(y>h-35)y=45;}boxes.push({x,y,w:tw});path(c,[[a.anchor[0],a.anchor[1]],[x+5,y-4]],a.color+'60',.7);c.fillStyle='#081422df';c.fillRect(x,y-12,tw,18);text(c,a.s,x+6,y,a.color,10);}
 // Fixed orientation triad distinguishes the camera from the physical line of sight.
 const ax=[w-61,h-58],alen=27,zero=camera([0,0,0]);
 for(const [v,name,color] of [[[1,0,0],'E',colors.near],[[0,1,0],'N',colors.white],[[0,0,1],'n','#e4d89d']]){const a=camera(v),end=[ax[0]+(a[0]-zero[0])*alen,ax[1]-(a[1]-zero[1])*alen];arrow(c,ax,end,color);text(c,name,end[0]+4,end[1]-4,color,9);}
}
function axes(c,w,h,extent,xy=true){const left=55,right=w-22,top=17,bottom=h-40,cx=(left+right)/2,cy=(top+bottom)/2,scale=Math.min(right-left,bottom-top)/(2*extent);const point=a=>[cx-a[0]*scale,cy-a[1]*scale];for(let k=-2;k<=2;k++){const value=extent*k/2,a=point([value,0]),b=point([0,value]);path(c,[[a[0],top],[a[0],bottom]],k?colors.grid:'#456077',k?.6:1);path(c,[[left,b[1]],[right,b[1]]],k?colors.grid:'#456077',k?.6:1);text(c,value.toFixed(0),a[0],bottom+16,colors.muted,9,'center');text(c,value.toFixed(0),left-8,b[1]+3,colors.muted,9,'right');}text(c,'Δα (μas)  ·  east ←',cx,h-4,colors.muted,10,'center');text(c,'Δδ (μas) · north ↑',left,10,colors.muted,9);return point;}
function skyPlot(key,id){const {c,w,h}=prep($(id)),e=M.ellipse(p,p[key]),extent=Math.ceil(Math.max(e.a,$('fits').checked?M.published[key].a:0)*1.28/10)*10,project=axes(c,w,h,Math.max(10,extent));
 if($('fits').checked)path(c,samples(t=>project(M.paperPoint(key,t))),colors[key]+'75',1.2,[5,5]);
 path(c,samples(t=>project(M.toSky(p,M.point(p,p[key],t,true))),0,traceAngle),colors[key],2);
 for(let j=0;j<6;j++)if(j*M.TAU/6<=traceAngle)dot(c,project(M.toSky(p,M.point(p,p[key],j*M.TAU/6,true))),colors[key],3,true,key==='far');
 const value=M.toSky(p,M.point(p,p[key],phase,true)),pt=project(value);path(c,[[pt[0],pt[1]],[pt[0],project([0,0])[1]]],colors[key]+'50',1,[2,4]);dot(c,pt,colors[key],5,false,key==='far');
 text(c,`Now: (${value[0].toFixed(1)}, ${value[1].toFixed(1)}) μas`,w-22,14,colors[key],10,'right');
}
function timePlot(component,id){const {c,w,h}=prep($(id)),left=50,right=w-18,top=10,bottom=h-30,curves=['near','far'].map(key=>samples(t=>M.toSky(p,M.point(p,p[key],t,true))[component]));const max=Math.max(1,...curves.flat().map(Math.abs))*1.2,project=(t,v)=>[left+t/M.TAU*(right-left),(top+bottom)/2-v/max*(bottom-top)/2];
 for(const k of [-1,0,1]){const y=project(0,k*max)[1];path(c,[[left,y],[right,y]],colors.grid);text(c,(k*max).toFixed(0),left-8,y+3,colors.muted,9,'right');}
 for(let k=0;k<=4;k++){const x=project(k/4*M.TAU,0)[0];path(c,[[x,top],[x,bottom]],colors.grid,.6);text(c,(p.period*k/4).toFixed(2),x,bottom+15,colors.muted,9,'center');}
 for(const key of ['near','far']){path(c,samples(t=>project(t,M.toSky(p,M.point(p,p[key],t,true))[component]),0,traceAngle),colors[key],1.7);dot(c,project(phase,M.toSky(p,M.point(p,p[key],phase,true))[component]),colors[key],4,false,key==='far');}
 const x=project(phase,0)[0];path(c,[[x,top],[x,bottom]],'#dbe7f350',1,[3,4]);text(c,'Observer time (yr) · arbitrary phase zero',w/2,h-1,colors.muted,9,'center');
}
let dragging=null;
$('scene').addEventListener('pointerdown',e=>{dragging=[e.clientX,e.clientY];$('scene').setPointerCapture(e.pointerId);});
$('scene').addEventListener('pointermove',e=>{if(!dragging)return;az+=(e.clientX-dragging[0])*.008;el=Math.max(-1.4,Math.min(1.4,el+(e.clientY-dragging[1])*.008));dragging=[e.clientX,e.clientY];dirty=true;});
for(const event of ['pointerup','pointercancel'])$('scene').addEventListener(event,()=>dragging=null);
$('scene').addEventListener('wheel',e=>{e.preventDefault();zoom=Math.min(3,Math.max(.55,zoom*Math.exp(-e.deltaY*.001)));dirty=true;},{passive:false});
$('scene').addEventListener('keydown',e=>{const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='];if(!keys.includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')az-=.1;if(e.key==='ArrowRight')az+=.1;if(e.key==='ArrowUp')el=Math.min(1.4,el+.1);if(e.key==='ArrowDown')el=Math.max(-1.4,el-.1);if(e.key==='+'||e.key==='=')zoom=Math.min(3,zoom*1.1);if(e.key==='-')zoom=Math.max(.55,zoom/1.1);dirty=true;});
$('download').onclick=()=>{const rows=[['# Illustrative analytical model; not observed VLBI data'],['# Parameters',JSON.stringify(p)],['# z',.0215],['phase_deg','t_observer_yr','core_GHz','east_pc','north_pc','toward_observer_pc','delta_RA_uas','delta_Dec_uas']];for(let k=0;k<=360;k++)for(const [key,freq] of [['near',8.4],['far',2.3]]){const v=M.point(p,p[key],k*M.DEG),a=M.toSky(p,M.point(p,p[key],k*M.DEG,true));rows.push([k,k/360*p.period,freq,...v,...a]);}const content=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n'),url=URL.createObjectURL(new Blob([content],{type:'text/csv'})),a=document.createElement('a');a.href=url;a.download='3c66b-illustrative-model.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
new ResizeObserver(()=>dirty=true).observe(document.querySelector('.laboratory'));window.addEventListener('resize',()=>dirty=true);
document.addEventListener('visibilitychange',()=>{last=0;dirty=true;});
function frame(now){const dt=last?Math.min((now-last)/1000,.06):0;last=now;if(playing&&!document.hidden){const delta=dt*speed*M.TAU;phase=(phase+delta)%M.TAU;if(trace){traceAngle=Math.min(M.TAU,traceAngle+delta);phase=traceAngle;if(traceAngle>=M.TAU){trace=false;setPlaying(false);$('trace').textContent='Trace one orbit';}}dirty=true;}
 if(dirty){scene();skyPlot('near','sky8');skyPlot('far','sky2');timePlot(0,'ra');timePlot(1,'dec');$('phase').value=phase/M.DEG;$('phase-text').textContent=(phase/M.DEG).toFixed(0)+'° · '+(phase/M.TAU*p.period).toFixed(2)+' yr';dirty=false;}requestAnimationFrame(frame);}
updateParameters();setPlaying(playing);requestAnimationFrame(frame);
})();
