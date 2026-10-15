// The drawing confirms a grouping, rather than asking for an exact sock outline.
// These positions match the two numbers in schema.mjs, in board coordinates.
const targets=[{x:210,y:79,rx:23,ry:30},{x:334,y:188,rx:20,ry:25}];
const others=[{x:435,y:79},{x:490,y:188}];

function inPolygon(point,polygon){
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const a=polygon[i],b=polygon[j];
    if(((a.y>point.y)!==(b.y>point.y))&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
  }
  return inside;
}

export function checkSockStroke(points,operation='add'){
  if(!Array.isArray(points)||points.length<5||points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))return {ok:false,reason:'closed'};
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
  const width=Math.max(...xs)-Math.min(...xs),height=Math.max(...ys)-Math.min(...ys);
  const gap=Math.hypot(points[0].x-points.at(-1).x,points[0].y-points.at(-1).y);
  let length=0,area=0;
  for(let i=0;i<points.length;i++){
    const a=points[i],b=points[(i+1)%points.length];
    length+=Math.hypot(a.x-b.x,a.y-b.y);area+=a.x*b.y-b.x*a.y;
  }
  if(width<90||height<90||length<180||Math.abs(area/2)<6000||gap>Math.max(38,Math.min(65,Math.hypot(width,height)*.22)))return {ok:false,reason:'closed'};
  const activeTargets=targets.map((t,i)=>operation==='subtract'&&i===0?{...t,rx:45}:t);
  if(!activeTargets.every(t=>[{x:t.x,y:t.y},{x:t.x-t.rx,y:t.y},{x:t.x+t.rx,y:t.y},{x:t.x,y:t.y-t.ry},{x:t.x,y:t.y+t.ry}].every(p=>inPolygon(p,points))))return {ok:false,reason:'targets'};
  if(others.some(p=>inPolygon(p,points)))return {ok:false,reason:'extra'};
  return {ok:true};
}

export function strokePath(points){
  return points.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)).map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}
