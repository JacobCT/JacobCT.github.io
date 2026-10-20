/* Pure analytical model. Positions: pc; time: yr; angles: degrees; sky: microarcsec.
   This is a first-order illustration of Sudou+2003 Fig. 3, not a fit to VLBI data. */
(function(root){
'use strict';
const TAU=2*Math.PI, DEG=Math.PI/180, C=.3066013938, UAS=206264806247.09636;
const defaults={radius:.0084,inclination:76,node:89,jetAngle:45,jetPA:50,near:.04,far:.35,beta:.8,q:.1,period:1.05,distance:85,component:'both'};
const published={near:{a:45,ratio:.24,pa:89,period:1.02},far:{a:243,ratio:.31,pa:113,period:1.10}};
const add=(a,b)=>a.map((x,i)=>x+b[i]), mul=(a,s)=>a.map(x=>x*s), dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function geometry(p){
 const i=p.inclination*DEG,o=p.node*DEG,j=p.jetAngle*DEG,k=p.jetPA*DEG;
 const u=[Math.sin(o),Math.cos(o),0],v=[-Math.cos(o)*Math.cos(i),Math.sin(o)*Math.cos(i),Math.sin(i)];
 const jet=[Math.sin(j)*Math.sin(k),Math.sin(j)*Math.cos(k),Math.cos(j)];
 const perp=a=>add(a,mul(jet,-dot(a,jet)));
 const speed=TAU*p.radius/(p.period/1.0215),factor=speed/(p.beta*C);
 return {u,v,jet,L:cross(u,v),speed,factor,up:perp(u),vp:perp(v)};
}
function coefficients(p,s){
 const g=geometry(p),orbit=p.component==='wobble'?0:1,wobble=p.component==='orbit'?0:1;
 return {A:add(mul(g.u,p.radius*orbit),mul(g.vp,s*g.factor*wobble)),B:add(mul(g.v,p.radius*orbit),mul(g.up,-s*g.factor*wobble)),center:mul(g.jet,s)};
}
function harmonic(A,B,phase){return add(mul(A,Math.cos(phase)),mul(B,Math.sin(phase)));}
function point(p,s,phase,centered=false){const c=coefficients(p,s),d=harmonic(c.A,c.B,phase);return centered?d:add(c.center,d);}
function blackHoles(p,phase){const g=geometry(p),m=harmonic(mul(g.u,p.radius),mul(g.v,p.radius),phase);return {m,M:mul(m,-p.q)};}
function toSky(p,v){return [v[0]*UAS/(p.distance*1e6),v[1]*UAS/(p.distance*1e6)];}
function ellipse(p,s){
 const c=coefficients(p,s),A=toSky(p,c.A),B=toSky(p,c.B);
 const xx=A[0]**2+B[0]**2,yy=A[1]**2+B[1]**2,xy=A[0]*A[1]+B[0]*B[1];
 const d=Math.hypot(xx-yy,2*xy),a=Math.sqrt(Math.max(0,(xx+yy+d)/2)),b=Math.sqrt(Math.max(0,(xx+yy-d)/2));
 const angle=.5*Math.atan2(2*xy,xx-yy),pa=((90-angle/DEG)%180+180)%180;
 return {a,b,ratio:a?b/a:0,pa};
}
function paperPoint(key,phase){const p=published[key],a=p.a*Math.cos(phase),b=p.a*p.ratio*Math.sin(phase),t=p.pa*DEG;return [a*Math.sin(t)+b*Math.cos(t),a*Math.cos(t)-b*Math.sin(t)];}
function derived(p){
 const g=geometry(p),separation=p.radius*(1+p.q),period=p.period/1.0215;
 // Newtonian Kepler law: AU^3 / yr^2 = solar masses.
 const total=(separation*206264.80624709636)**3/period**2;
 return {separation,total,M:total/(1+p.q),m:total*p.q/(1+p.q),speed:g.speed/C,wobble:g.factor,misalignment:Math.acos(Math.max(-1,Math.min(1,dot(g.L,g.jet))))/DEG};
}
const api={TAU,DEG,C,UAS,defaults,published,add,mul,dot,cross,geometry,coefficients,harmonic,point,blackHoles,toSky,ellipse,paperPoint,derived};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BinaryJet=api;
})(typeof window==='undefined'?this:window);
