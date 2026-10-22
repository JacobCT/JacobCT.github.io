/* Teaching model: steady conical jet, power-law synchrotron emission and absorption.
   r and ray length in pc; frequencies in observed GHz. Fixed Doppler factor/redshift
   cancel in frequency ratios. Arbitrary opacity and intensity normalizations; not a
   fit to 3C 66B. Formal transfer is integrated through each physical ray chord. */
(function(root){
'use strict';
const DEG=Math.PI/180,RMIN=.001,RMAX=10,RREF=.1,NUREF=8.4,P=2.4,OPENING=4*DEG;
const defaults={frequency:8.4,field:1,density:1,theta:45,m:1,n:2,origin:.1,view:1,absorption:true};
function bounds(r,p){
 const c=Math.cos(p.theta*DEG),s=Math.sin(p.theta*DEG),h=Math.tan(OPENING);
 return {back:Math.max(-h*r/(s+h*c),(RMIN-r)/c),front:Math.min(h*r/(s-h*c),(RMAX-r)/c),c,s};
}
function integral(r,length,c,eta){
 if(length<=0)return 0;
 const ratio=1+length*c/r;
 return Math.pow(r/RREF,-eta)*r*(-Math.expm1((1-eta)*Math.log(ratio)))/(c*(eta-1));
}
const refBounds=bounds(RREF,defaults),ALPHA0=1/integral(RREF,refBounds.front,refBounds.c,4.2);
function exponents(p){return {eta:p.n+(P+2)*p.m/2,emissivity:p.n+(P+1)*p.m/2,frequency:(P+4)/2,kr:(p.n+(P+2)*p.m/2-1)/((P+4)/2)};}
function coefficients(r,frequency,p){
 const j=ALPHA0*p.density*Math.pow(p.field,(P+1)/2)*Math.pow(r/RREF,-exponents(p).emissivity)*Math.pow(frequency/NUREF,-(P-1)/2);
 const alpha=p.absorption?ALPHA0*p.density*Math.pow(p.field,(P+2)/2)*Math.pow(r/RREF,-exponents(p).eta)*Math.pow(frequency/NUREF,-(P+4)/2):0;
 return {j,alpha};
}
function foregroundTau(r,frequency,p,length){
 if(!p.absorption)return 0;
 const b=bounds(r,p),distance=length===undefined?b.front:Math.min(Math.max(0,length),b.front);
 const a=ALPHA0*p.density*Math.pow(p.field,(P+2)/2)*Math.pow(frequency/NUREF,-(P+4)/2);
 return a*integral(r,distance,b.c,exponents(p).eta);
}
function transfer(r,frequency,p,steps=72){
 const b=bounds(r,p),dl=(b.front-b.back)/steps;
 if(dl<=0)return {intensity:0,tau:0};
 let intensity=0,tau=0;
 for(let i=0;i<steps;i++){
  const x=r+(b.back+(i+.5)*dl)*b.c,{j,alpha}=coefficients(x,frequency,p),dt=alpha*dl;
  const transmission=Math.exp(-dt),emitted=dt<1e-8?j*dl:j/alpha*(-Math.expm1(-dt));
  intensity=intensity*transmission+emitted;tau+=dt;
 }
 return {intensity,tau};
}
function surface(frequency,p){
 if(!p.absorption||foregroundTau(RMIN,frequency,p)<1)return null;
 let lo=Math.log(RMIN),hi=Math.log(RMAX);
 for(let i=0;i<55;i++){const mid=(lo+hi)/2;if(foregroundTau(Math.exp(mid),frequency,p)>1)lo=mid;else hi=mid;}
 return Math.exp((lo+hi)/2);
}
function profile(frequency,p,count=190){
 const values=Array.from({length:count},(_,i)=>{const r=Math.exp(Math.log(RMIN)+i/(count-1)*Math.log(RMAX/RMIN));return {r,...transfer(r,frequency,p),foreground:foregroundTau(r,frequency,p)};});
 let index=0;values.forEach((v,i)=>{if(v.intensity>values[index].intensity)index=i;});
 let lo=Math.log(values[Math.max(0,index-1)].r),hi=Math.log(values[Math.min(count-1,index+1)].r);
 for(let i=0;i<28;i++){const a=(2*lo+hi)/3,b=(lo+2*hi)/3;if(transfer(Math.exp(a),frequency,p).intensity<transfer(Math.exp(b),frequency,p).intensity)lo=a;else hi=b;}
 const peak=Math.exp((lo+hi)/2),maximum=transfer(peak,frequency,p).intensity;
 return {frequency,values,peak,maximum,surface:surface(frequency,p)};
}
function packet(r,frequency,p,quantile){
 const b=bounds(r,p),tau=foregroundTau(r,frequency,p),threshold=-Math.log1p(-Math.min(.999999999,Math.max(0,quantile)));
 let distance=b.front,absorbed=threshold<tau;
 if(absorbed){let lo=0,hi=b.front;for(let i=0;i<35;i++){const mid=(lo+hi)/2;if(foregroundTau(r,frequency,p,mid)<threshold)lo=mid;else hi=mid;}distance=(lo+hi)/2;}
 return {absorbed,distance,tau,escape:Math.exp(-tau),threshold};
}
function emissionBudget(r,frequency,p){
 // Equal volume, solid angle and frequency bandwidth. These are energy packets,
 // not equal numbers of photons at different frequencies. Keep one fixed reference
 // across all controls, rather than normalizing away the downstream emissivity drop.
 const produced=coefficients(r,frequency,p).j/coefficients(RREF,NUREF,defaults).j;
 const escape=Math.exp(-foregroundTau(r,frequency,p)),rate=Math.min(18,60*produced);
 return {produced,escape,escaped:produced*escape,rate,weight:rate?60*produced/rate:0};
}
function axialEmitters(p,extent,core=null){
 // Sample fixed physical positions, with equal representative emitting volumes.
 // Frequency changes do not move or renormalize those sources. The inspected
 // position and the calculated core add highlighted examples; these samples do
 // not compute the full sightline intensity used by the observer strip.
 const radii=Array.from({length:13},(_,i)=>.002*2**i).filter(r=>r<extent*.65);
 const close=radii.findIndex(r=>Math.abs(Math.log(r/p.origin))<.06);
 if(close>=0)radii[close]=p.origin;else radii.push(p.origin);
 if(core!==null&&core>=RMIN&&core<=extent&&!radii.some(r=>Math.abs(r-core)<core*1e-10))radii.push(core);
 return radii.sort((a,b)=>a-b).map(r=>({r,inspected:r===p.origin,core:core!==null&&Math.abs(r-core)<core*1e-10,budget:emissionBudget(r,p.frequency,p)}));
}
function packetAppearance(weight){
 // Filled area is proportional to carried energy up to 16 reference packets.
 // Larger groups use an explicitly unscaled hollow ring, never a filled dot that
 // could be mistaken for the same energy as a smaller packet.
 return {radius:2.2*Math.sqrt(Math.min(16,Math.max(0,weight))),grouped:weight>16};
}
function observerProfile(profile,p,extent){
 // A 1-D sky cut: each point integrates the full physical chord through the jet.
 // Retain the global peak normalization even when it lies outside the current view.
 // Include the refined peak explicitly so the brightness strip marks its true max.
 const radii=[0,extent,...profile.values.filter(v=>v.r<extent).map(v=>v.r)];
 if(profile.peak<=extent)radii.push(profile.peak);
 const angular=206264806247.09636*Math.sin(p.theta*DEG)/85e6;
 return Array.from(new Set(radii)).sort((a,b)=>a-b).map(r=>({r,offset:r*angular,brightness:r<RMIN?0:Math.max(0,Math.min(1,transfer(r,profile.frequency,p).intensity/profile.maximum))}));
}
function packetSchedule(time,rate,duration=10/3){
 // No minimum rate: genuinely weak emission must become sparse. Pre-fill only
 // the preceding flight time so changing a control gives an immediate steady view.
 if(!(rate>0))return [];
 const packets=[];
 for(let index=Math.ceil((time-duration)*rate-.5);index<=Math.floor(time*rate-.5);index++){
  packets.push({index,progress:(time-(index+.5)/rate)/duration,sample:((index%64)+64)%64});
 }
 return packets;
}
const api={DEG,RMIN,RMAX,RREF,NUREF,P,OPENING,ALPHA0,defaults,bounds,integral,exponents,coefficients,foregroundTau,transfer,surface,profile,packet,emissionBudget,axialEmitters,packetAppearance,observerProfile,packetSchedule};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.JetEmission=api;
})(typeof window==='undefined'?this:window);
