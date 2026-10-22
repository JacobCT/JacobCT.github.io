(function(){
'use strict';
const J=window.JetEmission,$=id=>document.getElementById(id),p={...J.defaults};
const C={a:'#65d9ec',b:'#ffb578',text:'#dbe7f3',muted:'#91a6ba',grid:'#24394b',purple:'#bf9bff'};
let data=null,extent=.3,emitters=[],observerData=[],dirty=true,visible=false,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,time=0,last=0;
const definitions=[
 ['frequency','Observing frequency, ν',1,86,.1,' GHz'],['field','Magnetic field normalization, B₀',.3,3,.05,'×'],['density','Radiating electron density, K₀',.3,3,.05,'×'],['theta','Jet angle to sightline, θ',12,80,1,'°'],['origin','Inspect distance, r',-2.5,.7,.02,' pc'],['view','Jet distance shown',-1.5,1,.02,' pc'],['m','Magnetic field decline, m',.5,1.7,.05,''],['n','Electron density decline, n',1,3,.05,'']
];
for(const [i,[key,label,min,max,step,unit]] of definitions.entries()){
 const wrap=document.createElement('label');wrap.className='control';
 wrap.innerHTML=`<span class="row"><span>${label}</span><output id="em-out-${key}"></output></span><input type="range" id="em-p-${key}" aria-label="${label}" min="${min}" max="${max}" step="${step}">`;
 $(i<6?'em-controls':'em-gradients').append(wrap);
 $('em-p-'+key).oninput=e=>{
  p[key]=key==='origin'||key==='view'?10**(+e.target.value):+e.target.value;
  if(key==='view')p.origin=Math.min(p.origin,p.view*.5);
  if(key==='origin'||key==='theta'){const b=J.bounds(p.origin,p);p.view=Math.min(J.RMAX,Math.max(p.view,(p.origin+b.front*b.c)*1.3));}
  update();
 };
}
const fmt=r=>r<.01?r.toFixed(4):r<1?r.toFixed(3):r.toFixed(2);
const percent=x=>x<.0001?'<0.01%':(x*100).toFixed(x<.01?2:1)+'%';
const tauText=x=>x>1000?'>1,000':x<.001?'<0.001':x.toFixed(x<1?3:1);
const relative=x=>x===0?'0×':x<.001||x>=1000?x.toExponential(2)+'×':x.toFixed(x<1?3:2)+'×';
function update(){
 for(const [key,,,,step,unit] of definitions){const distance=key==='origin'||key==='view',value=distance?Math.log10(p[key]):p[key];$('em-p-'+key).value=value;$('em-out-'+key).textContent=(distance?fmt(p[key]):p[key].toFixed(step<1?key==='frequency'?1:2:0))+unit;$('em-p-'+key).setAttribute('aria-valuetext',$('em-out-'+key).textContent);}
 $('em-absorption').checked=p.absorption;
 const band=Array.from($('em-band').options).find(o=>o.value!=='custom'&&Math.abs(+o.value-p.frequency)<.01);
 $('em-band').value=band?band.value:'custom';
 data=J.profile(p.frequency,p);
 extent=p.view;
 observerData=J.observerProfile(data,p,extent);
 emitters=J.axialEmitters(p,extent,data.peak).map((source,i)=>({...source,appearance:J.packetAppearance(source.budget.weight),phase:i*.237,samples:Array.from({length:64},(_,k)=>J.packet(source.r,p.frequency,p,(.5+k*.618033988749895)%1))}));
 const budget=J.emissionBudget(p.origin,p.frequency,p);
 const sightlineBrightness=Math.max(0,Math.min(1,J.transfer(p.origin,p.frequency,p).intensity/data.maximum));
 $('em-budget').innerHTML=`<article><h4 class="cyan">${p.frequency.toFixed(1)} GHz · inspected region at ${fmt(p.origin)} pc</h4><dl><div><dt>Produced locally</dt><dd>${relative(budget.produced)}</dd></div><div><dt>Fraction escaping</dt><dd>${percent(budget.escape)}</dd></div><div><dt>Local emission reaching us</dt><dd>${relative(budget.escaped)}</dd></div><div><dt>Whole sightline brightness</dt><dd>${percent(sightlineBrightness)} of peak</dd></div></dl><p>Each packet on this stream carries <strong>${relative(budget.weight)}</strong> the reference energy. ${budget.weight>16?'Hollow rings identify groups too large to show with proportional area.':'Filled packet area is proportional to its carried energy.'}</p></article>`;
 $('em-packet-weights').innerHTML=emitters.map(source=>`<tr><td>${fmt(source.r)} pc${source.core?' · core':''}${source.inspected?' · inspected':''}</td><td>${relative(source.budget.weight)}</td><td>${source.appearance.grouped?'Hollow group':'Filled packet'}</td></tr>`).join('');
 $('em-observer-note').textContent=`${p.frequency.toFixed(1)} GHz · brightness comes from emission and absorption through the entire jet along each sightline. The peak at ${fmt(data.peak)} pc defines 100%; the inspected sightline is ${percent(sightlineBrightness)} of that peak. The strip is a model sky cut before telescope blurring.`;
 $('em-legend-a').textContent='● Radiation at '+p.frequency.toFixed(1)+' GHz';
 $('em-band-label').textContent=p.frequency.toFixed(1)+' GHz';
 $('em-core-label-a').textContent=p.frequency.toFixed(1)+' GHz brightness peak';
 $('em-core-a').innerHTML=fmt(data.peak)+' <small>pc</small>';
 $('em-surface').innerHTML=data.surface===null?'None':fmt(data.surface)+' <small>pc</small>';
 const angular=data.peak*Math.sin(p.theta*J.DEG)*206264806247.09636/85e6;
 $('em-projected').innerHTML=(angular<1?angular.toFixed(2):angular.toFixed(0))+' <small>μas</small>';
 const tau=J.foregroundTau(p.origin,p.frequency,p);
 $('em-escape-label').textContent='Escape at inspected region';$('em-escape').textContent=percent(budget.escape);
 $('em-status').innerHTML=p.absorption?`At <strong>${p.frequency.toFixed(1)} GHz</strong>, the bright core is at <strong>${fmt(data.peak)} pc</strong>. At the inspected distance <strong>${fmt(p.origin)} pc</strong>, τ = ${tauText(tau)} and <strong>${percent(budget.escape)}</strong> of locally emitted energy escapes. All animated streams use this one observing frequency.`:'<strong>Self-absorption is off.</strong> Every packet escapes, but fewer are emitted farther downstream. Brightness peaks at the inner edge of this finite model; the opacity-driven core shift disappears.';
 const kr=J.exponents(p).kr;$('em-law').textContent=`These settings give kᵣ = ${kr.toFixed(2)} and r ∝ ν^${(-1/kr).toFixed(2)} away from the jet boundaries. The displayed brightness peak comes from the transfer calculation, rather than being placed with this scaling law.`;
 time=0;dirty=true;
}
function setPlaying(value){playing=value;$('em-play').textContent=value?'Pause photons':'Play photons';dirty=true;}
$('em-play').onclick=()=>setPlaying(!playing);
$('em-band').onchange=e=>{if(e.target.value!=='custom'){p.frequency=+e.target.value;update();}};
$('em-absorption').onchange=e=>{p.absorption=e.target.checked;update();};
$('em-frame-core').onclick=()=>{p.origin=Math.max(10**-2.5,Math.min(10**.7,data.peak));const b=J.bounds(p.origin,p);p.view=Math.min(J.RMAX,Math.max(10**-1.5,data.peak*3.2,(data.surface||0)*1.3,(p.origin+b.front*b.c)*1.3));update();};
$('em-reset').onclick=()=>{Object.assign(p,J.defaults);update();setPlaying(!matchMedia('(prefers-reduced-motion: reduce)').matches);};
function canvas(id){const a=$(id),r=a.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(a.width!==Math.round(r.width*dpr)||a.height!==Math.round(r.height*dpr)){a.width=Math.round(r.width*dpr);a.height=Math.round(r.height*dpr);}const c=a.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,r.width,r.height);c.lineCap='round';c.lineJoin='round';return {c,w:r.width,h:r.height};}
function line(c,points,color,width=1,dash=[]){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
function text(c,s,x,y,color=C.muted,size=10,align='left'){c.font=`${size}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;c.textAlign=align;c.fillStyle=color;c.fillText(s,x,y);}
function marker(c,x,y,color,size=4,diamond=false){c.beginPath();if(diamond){c.moveTo(x,y-size);c.lineTo(x+size,y);c.lineTo(x,y+size);c.lineTo(x-size,y);c.closePath();}else c.arc(x,y,size,0,Math.PI*2);c.fillStyle=color;c.fill();}
function energyPacket(c,x,y,appearance){
 c.save();
 if(appearance.grouped){c.beginPath();c.arc(x,y,appearance.radius,0,Math.PI*2);c.strokeStyle=C.a;c.lineWidth=1.3;c.stroke();line(c,[[x-2.5,y],[x+2.5,y]],C.a,1);line(c,[[x,y-2.5],[x,y+2.5]],C.a,1);}
 else marker(c,x,y,C.a,appearance.radius);
 c.restore();
}
function arrow(c,a,b,color){line(c,[a,b],color,1.3);const angle=Math.atan2(b[1]-a[1],b[0]-a[0]);line(c,[[b[0]-7*Math.cos(angle-.4),b[1]-7*Math.sin(angle-.4)],b,[b[0]-7*Math.cos(angle+.4),b[1]-7*Math.sin(angle+.4)]],color,1.3);}
function label(c,s,x,y,color,align='left'){c.font='10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';const width=c.measureText(s).width+12;x=Math.max(8,Math.min(x, c.canvas.width/(Math.min(devicePixelRatio||1,2))-width-8));c.fillStyle='#071421ea';c.fillRect(x,y-13,width,20);text(c,s,x+6,y,color,10,align);}
function lookup(profile,r){const values=profile.values,pos=(Math.log(r/J.RMIN)/Math.log(J.RMAX/J.RMIN))*(values.length-1),i=Math.max(0,Math.min(values.length-2,Math.floor(pos))),f=Math.max(0,Math.min(1,pos-i));return (values[i].intensity*(1-f)+values[i+1].intensity*f)/profile.maximum;}
function drawScene(){
 const {c,w,h}=canvas('em-scene'),left=42,right=w-34,mid=h*.65;
 const scale=(right-left)/extent,half=Math.tan(J.OPENING),cs=Math.cos(p.theta*J.DEG),sn=Math.sin(p.theta*J.DEG);
 const screen=(r,y)=>[left+r*scale,mid-y*scale];
 const jet=[[0,0],[extent,half*extent],[extent,-half*extent],[0,0]].map(([r,y])=>screen(r,y));
 c.save();c.beginPath();jet.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.clip();
 c.fillStyle='#13304a';c.fillRect(left,mid-half*extent*scale,right-left,2*half*extent*scale);
 const glow=c.createLinearGradient(left,0,right,0);
 for(let k=0;k<=160;k++){const r=extent*k/160,intensity=Math.max(0,Math.min(1,lookup(data,Math.max(J.RMIN,r))));glow.addColorStop(k/160,`rgba(101,217,236,${.06+intensity*.64})`);}
 c.fillStyle=glow;c.fillRect(left,mid-half*extent*scale,right-left,2*half*extent*scale);
 c.restore();
 line(c,jet,'#4c7188',1.2);line(c,[[left,mid],[right,mid]],'#b1d3e540',1,[5,6]);
 c.save();c.shadowColor=C.purple;c.shadowBlur=13;marker(c,left,mid,C.purple,9);marker(c,left,mid,'#01060c',6);c.restore();
 text(c,'Engine',left-17,mid+30,C.text,10);text(c,'Dashed: jet axis →',right,mid+half*extent*scale+8,C.muted,10,'right');
 // One core and one optical-depth reference at the selected observing frequency.
 const coreX=screen(data.peak,0)[0];
 if(data.peak<=extent){line(c,[[coreX,mid],[coreX,mid-43]],C.a+'a0',1);marker(c,coreX,mid,C.a,5);}
 if(data.surface&&data.surface<=extent){
  const q=screen(data.surface,0)[0];line(c,[[q,mid-24],[q,mid+24]],C.b,1,[3,4]);
  line(c,[[q,mid-26],[q,mid-75]],C.b+'80',1);
 }
 // Fixed axial regions emit simultaneously. A common energy reference preserves
 // emissivity differences between positions and frequencies; only crowded streams
 // are grouped. Packet samples govern absorption, independently of production.
 for(const source of emitters){
  const r=source.r,origin=screen(r,0),flight=Math.max(.001,Math.min((right-8-origin[0])/(cs*scale),(mid-65)/(sn*scale)));
  const map=t=>screen(r+t*cs,t*sn);
  line(c,[map(0),map(flight)],source.inspected?C.purple+'90':source.core?C.a+'70':C.a+'20',source.inspected||source.core?1.4:.7);
  marker(c,origin[0],origin[1],C.a,source.inspected?3:2);
  for(const event of J.packetSchedule(time+source.phase,source.budget.rate)){
   const sample=source.samples[event.sample],u=event.progress,stop=sample.absorbed?sample.distance/flight:1;
   if(u<=stop){const [x,y]=map(u*flight);energyPacket(c,x,y,source.appearance);}
   else if(sample.absorbed&&u-stop<.055){const [x,y]=map(sample.distance),size=Math.max(2,source.appearance.radius*.7);c.globalAlpha=Math.max(0,1-(u-stop)/.055);line(c,[[x-size,y-size],[x+size,y+size]],C.b,1.3);line(c,[[x-size,y+size],[x+size,y-size]],C.b,1.3);c.globalAlpha=1;}
  }
 }
 // Keep annotations legible above the animated rays.
 if(data.peak<=extent)label(c,`${p.frequency.toFixed(1)} GHz core`,coreX-35,mid-51,C.a);
 else label(c,'Core beyond view → use Frame core',right-210,mid-51,C.a);
 if(data.surface&&data.surface<=extent)label(c,`${p.frequency.toFixed(1)} GHz: τ = 1`,screen(data.surface,0)[0]-40,mid-83,C.b);
 const inspected=screen(p.origin,0);
 c.beginPath();c.ellipse(inspected[0],inspected[1],10,5,-.4,0,Math.PI*2);c.strokeStyle=C.purple;c.lineWidth=1.5;c.stroke();
 label(c,`Inspect · ${fmt(p.origin)} pc`,inspected[0]-34,mid+73,C.purple);
 // A separate parallel arrow identifies the common viewing direction.
 const arrowStart=[w-110,112],arrowLength=55;
 arrow(c,arrowStart,[arrowStart[0]+arrowLength*cs,arrowStart[1]-arrowLength*sn],'#e4d89d');
 text(c,'To observer · n',w-17,48,'#e4d89d',10,'right');
 // Coordinate and physical field of view are explicit; the observer is not an on-axis camera.
 const y=h-27;arrow(c,[left,y],[right,y],'#4b657a');
 for(let k=0;k<=4;k++){const r=extent*k/4,x=left+k/4*(right-left);line(c,[[x,y-3],[x,y+3]],'#627b90');text(c,r.toFixed(extent<.4?2:1),x,y+15,C.muted,9,'center');}
 text(c,'Distance along jet (pc) · linear scale',left,22,C.muted,10);text(c,`θ = ${p.theta.toFixed(0)}°`,w-17,22,C.muted,10,'right');
 text(c,'Glow: brightness normalized to its peak',left,43,C.muted,9);
 const coreSource=emitters.find(source=>source.core),downstream=emitters.find(source=>source.r>data.peak*1.2);
 if(coreSource)label(c,'Core packet energy: '+relative(coreSource.budget.weight),left,64,C.a);
 if(coreSource&&downstream)label(c,'Downstream packet energy: '+relative(downstream.budget.weight),left,87,C.a);
}
function drawObserver(){
 const {c,w,h}=canvas('em-observer'),left=42,right=w-34,top=34,height=30;
 const x=r=>left+r/extent*(right-left);
 c.fillStyle='#020609';c.fillRect(left,top,right-left,height);
 const glow=c.createLinearGradient(left,0,right,0);
 for(const point of observerData){const b=point.brightness;glow.addColorStop(point.r/extent,`rgb(${Math.round(101*b)},${Math.round(217*b)},${Math.round(236*b)})`);}
 c.fillStyle=glow;c.fillRect(left,top,right-left,height);
 c.strokeStyle=C.grid;c.lineWidth=1;c.strokeRect(left,top,right-left,height);
 if(data.peak<=extent){const coreX=x(data.peak);line(c,[[coreX,top-6],[coreX,top+height+5]],C.a,1.2);label(c,'Core · 100%',coreX-30,19,C.a);}
 else text(c,'Core outside this view',left,19,C.a,10);
 const selected=x(p.origin);line(c,[[selected,top+height+2],[selected,top+height+13]],C.purple,1.3);
 label(c,'Inspected sightline',selected-38,top+height+29,C.purple);
 const angle=observerData[observerData.length-1].offset;
 const y=h-30;
 for(let k=0;k<=4;k++){const q=left+(right-left)*k/4;line(c,[[q,y-4],[q,y]],C.muted,.8);text(c,(angle*k/4).toFixed(angle<10?1:0),q,y+12,C.muted,9,'center');}
 text(c,'Projected offset from engine (μas)',(left+right)/2,h-1,C.muted,9,'center');
}
function drawPlot(id,opacity){
 const {c,w,h}=canvas(id),left=48,right=w-19,top=21,bottom=h-36,lmin=Math.log10(J.RMIN),lmax=Math.log10(J.RMAX);
 const x=r=>left+(Math.log10(r)-lmin)/(lmax-lmin)*(right-left);
 const y=value=>opacity?bottom-(Math.max(-2,Math.min(2,Math.log10(Math.max(value,1e-30))))+2)/4*(bottom-top):bottom-Math.max(0,Math.min(1,value))*(bottom-top);
 const ticks=opacity?[.01,.1,1,10,100]:[0,.5,1];
 for(const t of ticks){line(c,[[left,y(t)],[right,y(t)]],opacity&&t===1?'#7c8b9b':C.grid,.8,opacity&&t===1?[4,4]:[]);text(c,String(t),left-8,y(t)+3,C.muted,9,'right');}
 for(const r of [.001,.01,.1,1,10]){line(c,[[x(r),top],[x(r),bottom]],C.grid,.6);text(c,String(r),x(r),bottom+14,C.muted,9,'center');}
 if(opacity)text(c,'τ = 1',right-2,y(1)-5,C.text,9,'right');
 c.save();c.beginPath();c.rect(left,top,right-left,bottom-top);c.clip();
 const points=data.values.map(v=>[x(v.r),y(opacity?v.foreground:v.intensity/data.maximum)]);
 if(!(opacity&&!p.absorption))line(c,points,C.a,1.7);
 const reference=opacity?data.surface:data.peak;
 if(reference!==null)marker(c,x(reference),y(1),opacity?C.b:C.a,4);
 line(c,[[x(p.origin),top],[x(p.origin),bottom]],C.purple+'b0',1,[3,5]);c.restore();
 label(c,`Inspect · ${fmt(p.origin)} pc`,Math.max(left,Math.min(x(p.origin)-50,right-137)),top+12,C.purple);
 text(c,'Distance along jet (pc) · logarithmic scale',(left+right)/2,h-1,C.muted,9,'center');
 if(opacity&&!p.absorption)text(c,'Absorption off: τ = 0 everywhere',(left+right)/2,(top+bottom)/2,C.text,11,'center');
}
function frame(now){const dt=last?Math.min(.06,(now-last)/1000):0;last=now;
 if(visible&&!document.hidden){if(playing){time+=dt;dirty=true;}if(dirty){drawScene();drawObserver();drawPlot('em-brightness',false);drawPlot('em-opacity',true);dirty=false;}}
 requestAnimationFrame(frame);
}
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dirty=true;last=0;},{rootMargin:'120px'}).observe($('emission-physics'));
new ResizeObserver(()=>dirty=true).observe($('emission-physics'));document.addEventListener('visibilitychange',()=>{last=0;dirty=true;});
update();setPlaying(playing);requestAnimationFrame(frame);
})();
