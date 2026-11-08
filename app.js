/* LINDE · editor de croquis y áreas para avalúos.
   Aplicación estática, sin servicios externos ni dependencias de JavaScript. */
(() => {
'use strict';
const SVGNS = 'http://www.w3.org/2000/svg';
const STORAGE = 'linde_proyectos_v1';
const PIXELS_PER_METER = 48;
const CAT = {
  construida: {label:'Área construida', color:'#d5ead9', border:'#6a9e82'},
  libre: {label:'Área libre', color:'#f5e7cb', border:'#c9a36b'},
  lote: {label:'Terreno / lote', color:'#e1dcf2', border:'#9180b6'},
  comun: {label:'Área común', color:'#d9e9f4', border:'#7ca5c2'},
  otra: {label:'No computable', color:'#e9edeb', border:'#9ba9a2'}
};
const ICON = {
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>', x:'<path d="M5 5l14 14M19 5L5 19"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
  upload:'<path d="M12 16V3m0 0L7 8m5-5 5 5M4 15v5h16v-5"/>',
  download:'<path d="M12 3v13m0 0 5-5m-5 5-5-5M4 18v3h16v-3"/>',
  sliders:'<path d="M4 7h16M4 17h16M9 4v6M15 14v6"/>',
  'panel-right':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
  'file-text':'<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  house:'<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  magnet:'<path d="M5 3v10a7 7 0 0 0 14 0V3h-5v10a2 2 0 0 1-4 0V3H5ZM5 8h5M14 8h5"/>',
  ruler:'<path d="m3 17 14-14 4 4L7 21zM12 8l3 3m-7 1 3 3m5-11 3 3"/>',
  lightbulb:'<path d="M9 18h6m-6 3h6m-7-6a7 7 0 1 1 8 0l-1 3H9z"/>',
  'arrow-up-right':'<path d="M6 18 18 6M8 6h10v10"/>',
  'chevron-down':'<path d="m6 9 6 6 6-6"/>',
  cursor:'<path d="M5 3v17l4.5-5 3.5 6 2.5-1.5-3.5-6.2L19 12z"/>',
  square:'<rect x="4" y="4" width="16" height="16" rx="1"/>',
  polygon:'<path d="M12 3 21 9l-3 12H6L3 9z"/><circle cx="12" cy="3" r="1"/><circle cx="21" cy="9" r="1"/><circle cx="6" cy="21" r="1"/>',
  wall:'<path d="M3 5h18v14H3zM3 12h18M9 5v7M15 12v7"/>',
  door:'<path d="M4 21V3h16v18M7 21V6h10v15M7 21a10 10 0 0 0 10-10"/>',
  window:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14M3 12h18"/>',
  type:'<path d="M4 6V4h16v2M12 4v16m-4 0h8"/>',
  hand:'<path d="M7 13V7a2 2 0 0 1 4 0v4-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v9a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-4L3 14a2 2 0 0 1 4-1z"/>',
  undo:'<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
  redo:'<path d="m15 14 5-5-5-5m5 5H10a6 6 0 0 0 0 12h3"/>',
  maximize:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  crosshair:'<circle cx="12" cy="12" r="7"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',
  trash:'<path d="M4 7h16M10 3h4m-8 4 1 14h10l1-14M10 11v6m4-6v6"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  area:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8v8H8z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m4 18 5-5 3 3 3-5 5 7"/>',
  print:'<path d="M6 9V3h12v6M6 18H4V9h16v9h-2M6 15h12v6H6z"/>',
  file:'<path d="M5 3h10l4 4v14H5zM15 3v5h4"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  'more-horizontal':'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
function ico(name){return `<svg xmlns="${SVGNS}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]||ICON.info}</svg>`;}
function putIcons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=ico(e.dataset.icon));}
const esc=(val)=>String(val??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const xml=(val)=>esc(val);
const id=()=>('l'+Math.random().toString(36).slice(2,10));
const clone=(v)=>JSON.parse(JSON.stringify(v));
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const fmt=(n,dec=2)=>Number(n||0).toLocaleString('es-CO',{minimumFractionDigits:dec,maximumFractionDigits:dec});
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Bogota'});
const safeFile=(name)=>String(name||'plano').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,55).replace(/^-|-$/g,'')||'plano';
const n2=(v)=>Number(Number(v).toFixed(3));
function pointsRect(x1,y1,x2,y2){return [[x1,y1],[x2,y1],[x2,y2],[x1,y2]];}
function signedArea(pts){return pts.reduce((acc,p,i)=>{const q=pts[(i+1)%pts.length];return acc+p[0]*q[1]-q[0]*p[1];},0)/2;}
function area(pts){return Math.abs(signedArea(pts));}
function perimeter(pts){return pts.reduce((s,p,i)=>s+dist(p,pts[(i+1)%pts.length]),0);}
function centroid(pts){let A=0,Cx=0,Cy=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length],f=p[0]*q[1]-q[0]*p[1];A+=f;Cx+=(p[0]+q[0])*f;Cy+=(p[1]+q[1])*f;}if(Math.abs(A)<.00001)return pts.reduce((c,p)=>[c[0]+p[0]/pts.length,c[1]+p[1]/pts.length],[0,0]);return [Cx/(3*A),Cy/(3*A)];}
function itemPoints(it){return it.kind==='area'?it.points:it.kind==='text'?[it.p]:[it.a,it.b];}
function getBounds(items){const all=items.flatMap(itemPoints).filter(p=>p&&Number.isFinite(p[0])&&Number.isFinite(p[1]));if(!all.length)return {minX:0,minY:0,maxX:12,maxY:8,w:12,h:8};const xs=all.map(p=>p[0]),ys=all.map(p=>p[1]);let minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);return{minX,minY,maxX,maxY,w:Math.max(.5,maxX-minX),h:Math.max(.5,maxY-minY)};}
const example = () => {
  const spaces=[
    {name:'Sala',x:0,y:0,w:4.2,h:3.5},{name:'Comedor',x:4.2,y:0,w:3.1,h:3.5},
    {name:'Cocina',x:7.3,y:0,w:2.9,h:3.5},{name:'Habitación principal',x:0,y:3.5,w:4.2,h:3.7},
    {name:'Habitación 2',x:4.2,y:3.5,w:3.3,h:3.7},{name:'Baño',x:7.5,y:3.5,w:2.7,h:2.0},
    {name:'Zona de ropas',x:7.5,y:5.5,w:2.7,h:1.7}
  ];
  const items=spaces.map((s,i)=>({id:id(),kind:'area',points:pointsRect(s.x,s.y,s.x+s.w,s.y+s.h),name:s.name,category:'construida',count:true,isRect:true,notes:''}));
  [[0,0,10.2,0],[10.2,0,10.2,7.2],[10.2,7.2,0,7.2],[0,7.2,0,0]].forEach((a)=>items.push({id:id(),kind:'wall',a:a.slice(0,2),b:a.slice(2),width:.18}));
  items.push({id:id(),kind:'opening',type:'door',a:[4.2,1.45],b:[4.2,2.3]});
  items.push({id:id(),kind:'opening',type:'window',a:[1.1,0],b:[2.7,0]});
  items.push({id:id(),kind:'text',p:[5.1,8.3],text:'Croquis de referencia · editar medidas en sitio',size:.22});
  const fid=id();return{id:id(),title:'Casa Los Pinos · ejemplo',address:'Inmueble de muestra',city:'Bogotá D.C.',reference:'EJEMPLO-001',client:'',analyst:'',date:today(),notes:'Proyecto demostrativo. Modifica o elimina sus elementos y crea tus propios proyectos. Las medidas no corresponden a un inmueble real.',floors:[{id:fid,name:'Planta baja',items}],activeFloorId:fid,createdAt:Date.now(),updatedAt:Date.now()};
};
function blankProject(title='Nuevo avalúo'){const fid=id();return{id:id(),title,address:'',city:'',reference:'',client:'',analyst:'',date:today(),notes:'',floors:[{id:fid,name:'Nivel 1',items:[]}],activeFloorId:fid,createdAt:Date.now(),updatedAt:Date.now()};}
let projects=[],activeId='',tool='select',selectedId=null,drawPoints=[],mouseWorld=null,drawDrag=null,drag=null,suppressClick=false,spaceDown=false;
let pan={x:130,y:100},zoom=1,history=[],future=[],toastTimer=null,vertexPanelOpen=false,ui={grid:true,snap:true,cotas:true};
const svg=$('#planSvg'),objects=$('#drawingObjects'),overlay=$('#selectionOverlay'),draft=$('#draftOverlay'),wrap=$('#canvasWrap');
function active(){return projects.find(p=>p.id===activeId)||projects[0];}
function floor(){const p=active();return p?.floors.find(f=>f.id===p.activeFloorId)||p?.floors[0];}
function selected(){return floor()?.items.find(it=>it.id===selectedId)||null;}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify({projects,activeId,ui}));$('#saveText').textContent='Guardado';$('#saveDot').classList.remove('unsaved');}catch(e){toast('No se pudo guardar: el navegador está sin espacio. Exporta un respaldo JSON.');}}
function commit(action){if(!active())return;history.push(JSON.stringify(active()));if(history.length>60)history.shift();future=[];action();active().updatedAt=Date.now();persist();render();}
function undo(){if(!history.length)return;future.push(JSON.stringify(active()));const old=JSON.parse(history.pop());projects[projects.findIndex(p=>p.id===activeId)]=old;ensureSelection();persist();render();}
function redo(){if(!future.length)return;history.push(JSON.stringify(active()));const newer=JSON.parse(future.pop());projects[projects.findIndex(p=>p.id===activeId)]=newer;ensureSelection();persist();render();}
function ensureSelection(){if(selectedId&&!selected())selectedId=null;}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3200);}
function setTool(t){tool=t;drawPoints=[];drawDrag=null;selectedId=t==='select'?selectedId:null;render();}
function snapPoint(p){return ui.snap?p.map(v=>Math.round(v*20)/20):p.map(n2);}
function toWorld(e,snap=true){const r=svg.getBoundingClientRect();const p=[(e.clientX-r.left-pan.x)/(zoom*PIXELS_PER_METER),(e.clientY-r.top-pan.y)/(zoom*PIXELS_PER_METER)];return snap?snapPoint(p):p;}
function getLocal(e){const r=svg.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function zoomAt(factor,client){const w=wrap.clientWidth,h=wrap.clientHeight;const center=client||{x:w/2,y:h/2};const old=zoom*PIXELS_PER_METER;const wx=(center.x-pan.x)/old,wy=(center.y-pan.y)/old;zoom=Math.max(.23,Math.min(4.5,zoom*factor));pan.x=center.x-wx*(zoom*PIXELS_PER_METER);pan.y=center.y-wy*(zoom*PIXELS_PER_METER);renderDrawing();renderToolState();}
function fitView(){if(!floor())return;const b=getBounds(floor().items),w=Math.max(wrap.clientWidth,270),h=Math.max(wrap.clientHeight,180),margin=w<700?25:75;const ratio=Math.min((w-2*margin)/Math.max(b.w+1,4),(h-2*margin)/Math.max(b.h+1,3));zoom=Math.max(.3,Math.min(2.5,ratio/PIXELS_PER_METER));const scale=zoom*PIXELS_PER_METER;pan={x:w/2-(b.minX+b.maxX)/2*scale,y:h/2-(b.minY+b.maxY)/2*scale};renderDrawing();renderToolState();}
function E(tag,attributes={},value){const node=document.createElementNS(SVGNS,tag);for(const[k,v]of Object.entries(attributes))if(v!==undefined&&v!==null)node.setAttribute(k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),String(v));if(value!==undefined)node.textContent=value;return node;}
const ap=(parent,node)=>{parent.appendChild(node);return node;};
const pathPoints=(pts)=>pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')+' Z';
function strokeLine(parent,a,b,color,width,dash){const attrs={x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,strokeWidth:width,strokeLinecap:'round'};if(dash)attrs.strokeDasharray=dash;return ap(parent,E('line',attrs));}
function textSvg(parent,x,y,label,opts={}){return ap(parent,E('text',{x,y,textAnchor:opts.anchor||'middle',dominantBaseline:'middle',fill:opts.color||'#24483e',fontFamily:'DM Sans, Arial, sans-serif',fontWeight:opts.weight||'700',fontSize:opts.size||.26,paintOrder:'stroke',stroke:opts.halo===false?'none':'#fff',strokeWidth:opts.halo===false?0:.055,strokeLinejoin:'round',pointerEvents:'none'},label));}
function renderMeasure(parent,a,b,color='#4b806c',label){const d=dist(a,b),v=[(b[0]-a[0])/(d||1),(b[1]-a[1])/(d||1)],perp=[-v[1],v[0]],t=.14;
  strokeLine(parent,a,b,color,.035);[a,b].forEach(p=>strokeLine(parent,[p[0]-perp[0]*t,p[1]-perp[1]*t],[p[0]+perp[0]*t,p[1]+perp[1]*t],color,.037));
  const mid=[(a[0]+b[0])/2+perp[0]*.23,(a[1]+b[1])/2+perp[1]*.23];textSvg(parent,mid[0],mid[1],label||fmt(d)+' m',{size:.23,color,weight:'800'});
}
function renderItem(it){const g=ap(objects,E('g',{'data-item':it.id,class:'canvas-element'}));
 if(it.kind==='area'){
   const cat=CAT[it.category]||CAT.construida;
   ap(g,E('path',{d:pathPoints(it.points),fill:cat.color,fillOpacity:.74,stroke:selectedId===it.id?'#2f8b68':cat.border,strokeWidth:selectedId===it.id?.092:.055,strokeLinejoin:'round',class:'area-outline'}));
   const c=centroid(it.points);let label=it.name||'Espacio';if(label.length>24)label=label.slice(0,23)+'…';
   textSvg(g,c[0],c[1]-.15,label,{size:.26});textSvg(g,c[0],c[1]+.19,fmt(area(it.points))+' m²',{size:.23,color:'#648378',weight:'600'});
 }else if(it.kind==='wall'){
   strokeLine(g,it.a,it.b,'#35594c',Math.max(.07,it.width||.15));
   strokeLine(g,it.a,it.b,'#74988a',.017);
   strokeLine(g,it.a,it.b,'transparent',.35);
 }else if(it.kind==='opening'){
   const a=it.a,b=it.b,d=dist(a,b),dir=[(b[0]-a[0])/(d||1),(b[1]-a[1])/(d||1)],nor=[-dir[1],dir[0]];
   strokeLine(g,a,b,'#fff',.22);
   if(it.type==='door'){
     const end=[a[0]+nor[0]*d,a[1]+nor[1]*d];strokeLine(g,a,end,'#c28a47',.055);
     const sweep=1;ap(g,E('path',{d:`M ${b[0]} ${b[1]} A ${d} ${d} 0 0 ${sweep} ${end[0]} ${end[1]}`,fill:'none',stroke:'#c28a47',strokeWidth:.035,strokeDasharray:'.07 .055'}));
     ap(g,E('circle',{cx:a[0],cy:a[1],r:.07,fill:'#c28a47'}));
   }else{
     strokeLine(g,a,b,'#65a8c7',.07);strokeLine(g,[a[0]+nor[0]*.08,a[1]+nor[1]*.08],[b[0]+nor[0]*.08,b[1]+nor[1]*.08],'#65a8c7',.03);
     strokeLine(g,[a[0]-nor[0]*.08,a[1]-nor[1]*.08],[b[0]-nor[0]*.08,b[1]-nor[1]*.08],'#65a8c7',.03);
   }
   strokeLine(g,a,b,'transparent',.35);
 }else if(it.kind==='measure'){
   renderMeasure(g,it.a,it.b,'#507f76');strokeLine(g,it.a,it.b,'transparent',.3);
 }else if(it.kind==='text'){
   textSvg(g,it.p[0],it.p[1],it.text,{size:it.size||.25,color:'#4d625b',weight:'600'});
   ap(g,E('rect',{x:it.p[0]-.3,y:it.p[1]-.2,width:.6,height:.4,fill:'transparent'}));
 }
 return g;
}
function renderSelection(){overlay.replaceChildren();const s=selected();if(!s)return;
 const pts=itemPoints(s);if(s.kind==='area'){
   ap(overlay,E('path',{d:pathPoints(s.points),fill:'none',stroke:'#2c8964',strokeWidth:.045,strokeDasharray:'.17 .10',pointerEvents:'none',class:'selection-ui'}));
   if(ui.cotas){s.points.forEach((p,i)=>{const q=s.points[(i+1)%s.points.length];if(dist(p,q)<.65)return;const dx=q[0]-p[0],dy=q[1]-p[1],len=dist(p,q),n=[dy/len,-dx/len],m=[(p[0]+q[0])/2+n[0]*.29,(p[1]+q[1])/2+n[1]*.29];textSvg(overlay,m[0],m[1],fmt(len)+' m',{size:.20,color:'#3c8070'});});}
 }
 pts.forEach((p,i)=>{ap(overlay,E('circle',{cx:p[0],cy:p[1],r:.12,stroke:'#fff',strokeWidth:.05,fill:'#2d8965',class:'vertex-handle','data-item':s.id,'data-handle':i}));});
}
function renderDraft(){draft.replaceChildren();if(!drawPoints.length&&!drawDrag)return;const points=drawPoints.slice(),last=mouseWorld||points[points.length-1];
 if(tool==='rect'&&drawDrag){const a=drawDrag.start,b=mouseWorld||a;const r=pointsRect(a[0],a[1],b[0],b[1]);ap(draft,E('path',{d:pathPoints(r),fill:'#bfe6c9',fillOpacity:.3,stroke:'#368d6c',strokeWidth:.05,strokeDasharray:'.15 .09',class:'draft-ui'}));if(dist(a,b)>.1){const center=[(a[0]+b[0])/2,(a[1]+b[1])/2];textSvg(draft,center[0],center[1],`${fmt(Math.abs(b[0]-a[0]))} × ${fmt(Math.abs(b[1]-a[1]))} m`,{size:.23});}return;}
 if(tool==='rect'&&points.length){const a=points[0],b=last;ap(draft,E('path',{d:pathPoints(pointsRect(a[0],a[1],b[0],b[1])),fill:'#bfe6c9',fillOpacity:.3,stroke:'#368d6c',strokeWidth:.05,strokeDasharray:'.15 .09'}));return;}
 if(tool==='poly'){
   if(points.length>1)ap(draft,E('path',{d:points.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' '),fill:'none',stroke:'#2d906d',strokeWidth:.055}));
   if(points.length>2)ap(draft,E('path',{d:pathPoints(points),fill:'#bde1c5',fillOpacity:.3,stroke:'none'}));
   points.forEach((p,i)=>ap(draft,E('circle',{cx:p[0],cy:p[1],r:i===0?.12:.077,fill:i===0?'#df9b4d':'#308666',stroke:'#fff',strokeWidth:.03})));
   if(last&&points.length)strokeLine(draft,points[points.length-1],last,'#3d9972',.045,'.12 .1');
   return;
 }
 if(points.length&&last){strokeLine(draft,points[0],last,'#338c6f',.05,'.14 .08');ap(draft,E('circle',{cx:points[0][0],cy:points[0][1],r:.09,fill:'#338c6f'}));if(dist(points[0],last)>.3)textSvg(draft,(points[0][0]+last[0])/2,(points[0][1]+last[1])/2-.2,fmt(dist(points[0],last))+' m',{size:.23});}
}
function renderDrawing(){if(!active()||!floor())return;const w=Math.max(1,wrap.clientWidth),h=Math.max(1,wrap.clientHeight),s=zoom*PIXELS_PER_METER;
 svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('data-tool',tool);
 const minor=$('#gridPattern'),major=$('#gridBigPattern');minor.setAttribute('width',s);minor.setAttribute('height',s);minor.setAttribute('patternTransform',`translate(${pan.x} ${pan.y})`);$('#gridPath').setAttribute('d',`M ${s} 0 H 0 V ${s}`);
 major.setAttribute('width',s*5);major.setAttribute('height',s*5);major.setAttribute('patternTransform',`translate(${pan.x} ${pan.y})`);$('#gridBigPath').setAttribute('d',`M ${s*5} 0 H 0 V ${s*5}`);
 $('#gridSurface').style.display=ui.grid?'':'none';$('#gridBigSurface').style.display=ui.grid?'':'none';
 $('#viewport').setAttribute('transform',`translate(${pan.x} ${pan.y}) scale(${s})`);
 objects.replaceChildren();floor().items.forEach(renderItem);renderSelection();renderDraft();
 $('#zoomLabel').textContent=Math.round(zoom*100)+'%';$('#scaleReadout').textContent=`1 m = ${Math.round(s)} px`;
}
function metricBy(f,c='construida'){return f.items.filter(it=>it.kind==='area'&&it.category===c&&it.count!==false).reduce((s,it)=>s+area(it.points),0);}
function renderProjects(){const p=active();$('#projectList').innerHTML=projects.map(project=>`<button class="project-option ${project.id===p.id?'active':''}" data-project="${esc(project.id)}" title="Abrir ${esc(project.title)}"><span class="project-icon">${ico('house')}</span><span class="project-meta"><strong>${esc(project.title)}</strong><small>${esc(project.city||'Sin ubicación')} · ${project.floors.length} nivel${project.floors.length===1?'':'es'}</small></span>${project.id===p.id?ico('check'):''}</button>`).join('');
 $('#floorList').innerHTML=p.floors.map(f=>`<button class="floor-option ${f.id===p.activeFloorId?'active':''}" data-floor="${esc(f.id)}" title="Abrir ${esc(f.name)} (doble clic para renombrar)"><span class="floor-icon">${ico('layers')}</span><span class="project-meta"><strong>${esc(f.name)}</strong><small>${fmt(metricBy(f))} m² construidos</small></span><span class="floor-right">${f.items.filter(it=>it.kind==='area').length}</span></button>`).join('');
}
function renderToolState(){const p=active(),f=floor();$$('.tool').forEach(btn=>{btn.classList.toggle('active',btn.dataset.tool===tool);btn.setAttribute('aria-pressed',String(btn.dataset.tool===tool));});
 const hints={select:'Haz clic en un espacio. Arrástralo o mueve sus vértices.',rect:'Marca dos esquinas o arrastra para dibujar un área.',poly:'Marca los vértices. Toca el primero o pulsa Terminar para cerrar.',wall:'Marca el inicio y el final del muro.',door:'Marca dos extremos para señalar una puerta.',window:'Marca los extremos de la ventana.',measure:'Marca dos puntos para medir una distancia.',text:'Toca el plano para añadir una anotación.',pan:'Arrastra sobre el plano para desplazarte.'};
 $('#toolHint').textContent=hints[tool];$('#stageFloorName').innerHTML=esc(f?.name||'Sin nivel')+' '+ico('chevron-down');
 const show=tool==='poly'&&drawPoints.length>0;$('#drawingControls').classList.toggle('hidden',!show);$('#drawingStatus').textContent=`${drawPoints.length} vértice${drawPoints.length===1?'':'s'} · mínimo 3`;
 $('#finishDrawing').disabled=drawPoints.length<3;$('#undoBtn').disabled=history.length===0;$('#redoBtn').disabled=future.length===0;
 $('#itemCount').textContent=f.items.length+' elemento'+(f.items.length===1?'':'s');
}
function renderInspector(){const p=active(),f=floor(),s=selected();let html='';
 if(!s){
  const built=metricBy(f),total=p.floors.reduce((n,fl)=>n+metricBy(fl),0),free=metricBy(f,'libre'),lot=metricBy(f,'lote');
  const areas=f.items.filter(it=>it.kind==='area');
  html=`<div><h3>Resumen del nivel</h3><p class="inspector-subtitle">${esc(p.title)} · ${esc(f.name)}</p></div>
   <div class="metric-hero"><small>ÁREA CONSTRUIDA · NIVEL</small><strong>${fmt(built)} <span>m²</span></strong><p>Calculada a partir de los espacios dibujados</p></div>
   <div class="mini-stat-row"><div class="mini-stat"><span class="stat-icon">${ico('layers')}</span><strong>${fmt(total)} m²</strong><span>Total construido · proyecto</span></div><div class="mini-stat"><span class="stat-icon">${ico('area')}</span><strong>${areas.length}</strong><span>Espacios en este nivel</span></div></div>
   <div class="inspector-section"><h4>OTRAS SUPERFICIES · NIVEL</h4><div class="read-pair"><span>Área libre</span><strong>${fmt(free)} m²</strong></div><div class="read-pair"><span>Terreno / lote</span><strong>${fmt(lot)} m²</strong></div></div>
   <div class="inspector-section"><h4>DESGLOSE DE ESPACIOS</h4><div class="area-list">${areas.length?areas.map(it=>`<div class="area-line"><i class="color-swatch" style="background:${CAT[it.category]?.border||CAT.otra.border}"></i><span>${esc(it.name)}${it.count===false?' · excluido':''}</span><strong>${fmt(area(it.points))} m²</strong></div>`).join(''):'<p class="empty-note">Aún no hay áreas. Selecciona Rectángulo o Polígono para dibujar.</p>'}</div></div>
   <div class="inspector-section"><h4>GESTIÓN DEL NIVEL</h4><div class="form-action-row"><button class="btn btn-secondary" data-inspector-action="renameFloor">${ico('type')} Renombrar</button><button class="btn button-danger" data-inspector-action="deleteFloor" ${p.floors.length===1?'disabled':''}>${ico('trash')}</button></div></div>`;
 }else{
  const name=s.kind==='area'?'Espacio':s.kind==='wall'?'Muro':s.kind==='opening'?(s.type==='door'?'Puerta':'Ventana'):s.kind==='measure'?'Medición':'Anotación';
  html=`<div class="selected-heading"><span class="selected-icon">${ico(s.kind==='area'?'area':s.kind==='wall'?'wall':s.kind==='opening'?s.type:s.kind==='text'?'type':'ruler')}</span><div><h3>${name}</h3><small>Elemento seleccionado · editable</small></div></div>`;
  if(s.kind==='area'){
   const size=getBounds([s]);html+=`<div class="inspector-section"><div class="field-group"><label for="areaName">Nombre del espacio</label><input class="field-input" id="areaName" data-property="name" maxlength="80" value="${esc(s.name)}"></div>
   <div class="field-group"><label for="areaCategory">Clasificación</label><select class="field-select" id="areaCategory" data-property="category">${Object.entries(CAT).map(([key,v])=>`<option value="${key}" ${s.category===key?'selected':''}>${esc(v.label)}</option>`).join('')}</select></div>
   <div class="read-metric"><span>Área calculada</span><strong>${fmt(area(s.points))} <small>m²</small></strong></div>
   <div class="read-pair"><span>Perímetro</span><strong>${fmt(perimeter(s.points))} m</strong></div><div class="read-pair"><span>Vértices</span><strong>${s.points.length}</strong></div>
   <div class="field-group" style="margin-top:15px"><label class="inline-check"><input type="checkbox" data-property="count" ${s.count!==false?'checked':''}> Incluir en la suma de su categoría</label></div>
   ${s.isRect?`<div class="inspector-section"><h4>DIMENSIONES DEL RECTÁNGULO</h4><div class="field-double"><div class="field-group"><label>Ancho (m)</label><input class="field-input" type="number" min="0.25" step="0.05" data-property="rectWidth" value="${n2(size.w)}"></div><div class="field-group"><label>Alto (m)</label><input class="field-input" type="number" min="0.25" step="0.05" data-property="rectHeight" value="${n2(size.h)}"></div></div><p class="small-help">También puedes arrastrar los puntos verdes directamente sobre el plano.</p></div>`:`<p class="small-help">Arrastra los puntos verdes para ajustar el contorno. Las medidas y el área se actualizan automáticamente.</p>`}
   <div class="inspector-section"><details class="vertex-details" id="vertexDetail" ${vertexPanelOpen?'open':''}><summary>Editar coordenadas exactas ${ico('chevron-down')}</summary><p class="small-help">Origen del croquis arbitrario; valores en metros. Cambiar una esquina puede transformar el rectángulo en polígono.</p><div class="vertex-grid">${s.points.map((pt,i)=>`<div class="vertex-index">P${i+1}</div><input type="number" class="field-input" step="0.01" value="${n2(pt[0])}" data-vertex-index="${i}" data-axis="0" aria-label="Punto ${i+1}, coordenada X"><input type="number" class="field-input" step="0.01" value="${n2(pt[1])}" data-vertex-index="${i}" data-axis="1" aria-label="Punto ${i+1}, coordenada Y">`).join('')}</div></details></div>
   <div class="inspector-section"><div class="field-group"><label>Observaciones del espacio</label><textarea class="field-textarea" data-property="notes" placeholder="Acabados, estado, observaciones…">${esc(s.notes||'')}</textarea></div></div>`;
  }else if(s.kind==='wall'){
   html+=`<div class="inspector-section"><div class="read-metric"><span>Longitud</span><strong>${fmt(dist(s.a,s.b))} <small>m</small></strong></div><div class="field-group"><label>Espesor de muro (m)</label><input class="field-input" type="number" min="0.05" max="1" step="0.01" data-property="width" value="${s.width||.15}"></div><p class="small-help">Arrastra los extremos para ajustar la posición y longitud.</p></div>`;
  }else if(s.kind==='opening'||s.kind==='measure'){
   html+=`<div class="inspector-section"><div class="read-metric"><span>${s.kind==='measure'?'Distancia medida':'Abertura'}</span><strong>${fmt(dist(s.a,s.b))} <small>m</small></strong></div><p class="small-help">Arrastra los extremos para ajustar la medida.</p></div>`;
  }else if(s.kind==='text'){
   html+=`<div class="inspector-section"><div class="field-group"><label>Texto de la anotación</label><textarea class="field-textarea" data-property="text" maxlength="200">${esc(s.text)}</textarea></div><div class="field-group"><label>Tamaño del texto (metros gráficos)</label><input class="field-input" data-property="size" type="number" min="0.1" max="2" step="0.05" value="${s.size||.25}"></div></div>`;
  }
  html+=`<div class="inspector-section"><h4>ACCIONES</h4><div class="form-action-row"><button class="btn btn-secondary" data-inspector-action="duplicate">${ico('copy')} Duplicar</button><button class="btn button-danger" data-inspector-action="delete">${ico('trash')} Eliminar</button></div><p class="small-help" style="margin-top:10px">Puedes usar Ctrl+Z para deshacer cambios.</p></div>`;
 }
 $('#inspectorContent').innerHTML=html;
}
function render(){if(!active())return;ensureSelection();$('#headerProjectName').textContent=active().title;$('#showGrid').checked=ui.grid;$('#useSnap').checked=ui.snap;$('#showCotas').checked=ui.cotas;renderProjects();renderInspector();renderToolState();renderDrawing();}
function addArea(points,isRect){if(points.length<3||area(points)<.04){toast('Esa área es demasiado pequeña. Dibuja un espacio mayor.');return;}const name='Espacio '+(floor().items.filter(i=>i.kind==='area').length+1);let newId=id();commit(()=>floor().items.push({id:newId,kind:'area',points:points.map(p=>p.map(n2)),name,category:'construida',count:true,isRect,notes:''}));selectedId=newId;setTool('select');openInspectorMobile();}
function createLine(a,b,kind){if(dist(a,b)<.12){toast('Marca dos puntos diferentes para crear el elemento.');return;}const newId=id();commit(()=>floor().items.push(kind==='wall'?{id:newId,kind:'wall',a,b,width:.15}:kind==='measure'?{id:newId,kind:'measure',a,b}:{id:newId,kind:'opening',type:kind,a,b}));selectedId=newId;setTool('select');}
function finishPolygon(){const pts=drawPoints.slice();if(pts.length>2&&dist(pts[pts.length-1],pts[0])<.04)pts.pop();drawPoints=[];if(pts.length<3){toast('Necesitas al menos tres vértices.');render();return;}if(area(pts)<.04){toast('El polígono no tiene un área válida.');render();return;}addArea(pts,false);}
function closeDraw(){drawPoints=[];drawDrag=null;render();}
function deleteSelection(){const s=selected();if(!s)return;commit(()=>{const f=floor();f.items=f.items.filter(it=>it.id!==s.id);selectedId=null;});toast('Elemento eliminado.');}
function duplicateSelection(){const s=selected();if(!s)return;const copy=clone(s);copy.id=id();if(copy.kind==='area'){copy.points=copy.points.map(p=>[n2(p[0]+.5),n2(p[1]+.5)]);copy.name+=' (copia)';}else if(copy.kind==='text'){copy.p=copy.p.map(v=>n2(v+.5));}else{copy.a=copy.a.map(v=>n2(v+.5));copy.b=copy.b.map(v=>n2(v+.5));}commit(()=>floor().items.push(copy));selectedId=copy.id;render();toast('Elemento duplicado.');}
function setProperty(prop,val){const item=selected();if(!item)return;const numeric=Number(val);if(['rectWidth','rectHeight','width','size'].includes(prop)&&(!Number.isFinite(numeric)||numeric<=0)){toast('Ingresa un número positivo válido.');renderInspector();return;}
 commit(()=>{
  if(prop==='rectWidth'||prop==='rectHeight'){
    const b=getBounds([item]),w=prop==='rectWidth'?numeric:b.w,h=prop==='rectHeight'?numeric:b.h;if(w>.05&&h>.05&&w<10000&&h<10000)item.points=pointsRect(b.minX,b.minY,n2(b.minX+w),n2(b.minY+h));
  }else if(prop==='count')item.count=Boolean(val);
  else if(prop==='width')item.width=Math.min(1,Math.max(.05,numeric));
  else if(prop==='size')item.size=Math.min(2,Math.max(.1,numeric));
  else if(['name','notes','text','category'].includes(prop))item[prop]=String(val).slice(0,prop==='notes'?1000:prop==='text'?200:80);
 });
}
function setActiveProject(projectId){if(!projects.find(p=>p.id===projectId))return;activeId=projectId;selectedId=null;drawPoints=[];history=[];future=[];closeDrawers();persist();render();fitView();}
function setActiveFloor(fid){if(!active().floors.find(f=>f.id===fid))return;active().activeFloorId=fid;selectedId=null;drawPoints=[];history=[];future=[];closeDrawers();persist();render();fitView();}
function switchSelection(s){selectedId=s;render();}
function openInspectorMobile(){if(matchMedia('(max-width:1050px)').matches){$('#inspector').classList.add('open');$('#sidebar').classList.remove('open');$('#drawerBackdrop').classList.add('open');}}
function closeDrawers(){$('#inspector').classList.remove('open');$('#sidebar').classList.remove('open');$('#drawerBackdrop').classList.remove('open');}
function pickItem(target){return target.closest?.('[data-item]')?.getAttribute('data-item')||null;}
function pointerDown(e){if(e.pointerType==='mouse'&&e.button!==0&&e.button!==1)return;const pt=toWorld(e);mouseWorld=pt;const local=getLocal(e);const moveCanvas=tool==='pan'||spaceDown||e.button===1;
 if(moveCanvas){drag={mode:'pan',x:e.clientX,y:e.clientY,origPan:{...pan}};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');return;}
 if(tool==='rect'){drawDrag={start:pt,x:e.clientX,y:e.clientY};svg.setPointerCapture(e.pointerId);renderDraft();return;}
 if(tool==='select'){
   const sid=pickItem(e.target),handle=e.target.closest?.('[data-handle]'),it=sid&&floor().items.find(i=>i.id===sid);
   if(it){selectedId=sid;drag={mode:handle?'vertex':'move',itemId:sid,index:handle?Number(handle.getAttribute('data-handle')):-1,start:toWorld(e,false),first:clone(it),before:JSON.stringify(active()),changed:false,clientX:e.clientX,clientY:e.clientY};svg.setPointerCapture(e.pointerId);render();}
   else{selectedId=null;render();}
 }
}
function pointerMove(e){mouseWorld=toWorld(e);$('#cursorCoords').textContent=`X ${fmt(mouseWorld[0])} · Y ${fmt(mouseWorld[1])} m`;
 if(drag?.mode==='pan'){pan.x=drag.origPan.x+(e.clientX-drag.x);pan.y=drag.origPan.y+(e.clientY-drag.y);renderDrawing();return;}
 if(tool==='rect'&&drawDrag){renderDraft();return;}
 if(drag&&(drag.mode==='move'||drag.mode==='vertex')){
   const it=floor().items.find(i=>i.id===drag.itemId);if(!it)return;
   const first=drag.first,delta=toWorld(e,false).map((v,i)=>v-drag.start[i]);
   if(Math.hypot(e.clientX-drag.clientX,e.clientY-drag.clientY)>3)drag.changed=true;
   if(drag.mode==='move'){
     const translated=p=>snapPoint([p[0]+delta[0],p[1]+delta[1]]);
     if(it.kind==='area')it.points=first.points.map(translated);
     else if(it.kind==='text')it.p=translated(first.p);
     else{it.a=translated(first.a);it.b=translated(first.b);}
   }else{
     const p=toWorld(e);if(it.kind==='area'){
       if(it.isRect&&it.points.length===4){const opposite=first.points[(drag.index+2)%4];it.points=pointsRect(Math.min(p[0],opposite[0]),Math.min(p[1],opposite[1]),Math.max(p[0],opposite[0]),Math.max(p[1],opposite[1]));
         // Conserva el índice del vértice arrastrado, incluso cuando cambia la orientación.
         if(drag.index===1)it.points=[it.points[1],it.points[2],it.points[3],it.points[0]];
         else if(drag.index===2)it.points=[it.points[2],it.points[3],it.points[0],it.points[1]];
         else if(drag.index===3)it.points=[it.points[3],it.points[0],it.points[1],it.points[2]];
       }else it.points[drag.index]=p;
     }else if(it.kind==='text')it.p=p;else if(drag.index===0)it.a=p;else it.b=p;
   }
   renderDrawing();return;
 }
 if(drawPoints.length)renderDraft();
}
function pointerUp(e){if(drag){if(drag.mode==='pan'){svg.classList.remove('dragging');if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5)suppressClick=true;}
 else if(drag.changed){const it=floor().items.find(i=>i.id===drag.itemId);if(it&&JSON.stringify(it)!==JSON.stringify(drag.first)){
    history.push(drag.before);if(history.length>60)history.shift();future=[];active().updatedAt=Date.now();persist();suppressClick=true;
   }}drag=null;render();return;}
 if(tool==='rect'&&drawDrag){const a=drawDrag.start,b=toWorld(e),moved=Math.hypot(e.clientX-drawDrag.x,e.clientY-drawDrag.y)>9;drawDrag=null;if(moved){suppressClick=true;addArea(pointsRect(Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[0],b[0]),Math.max(a[1],b[1])),true);}else renderDraft();}
}
function canvasClick(e){if(suppressClick){suppressClick=false;return;}if(tool==='select'||tool==='pan'||spaceDown)return;const pt=toWorld(e);
 if(tool==='text'){showTextModal(pt);return;}
 if(tool==='poly'){if(e.detail>1){if(drawPoints.length>=3)finishPolygon();return;}if(drawPoints.length>=3&&dist(pt,drawPoints[0])<.3){finishPolygon();return;}drawPoints.push(pt);renderDrawing();renderToolState();return;}
 if(tool==='rect'){if(!drawPoints.length){drawPoints=[pt];}else{const a=drawPoints[0];drawPoints=[];addArea(pointsRect(Math.min(a[0],pt[0]),Math.min(a[1],pt[1]),Math.max(a[0],pt[0]),Math.max(a[1],pt[1])),true);}renderDrawing();return;}
 if(['wall','door','window','measure'].includes(tool)){if(!drawPoints.length)drawPoints=[pt];else{const a=drawPoints[0];drawPoints=[];createLine(a,pt,tool);}renderDrawing();}
}
function formInput(label,name,value,type='text',placeholder=''){return `<div class="field-group"><label for="field_${esc(name)}">${label}</label><input class="field-input" id="field_${esc(name)}" name="${esc(name)}" type="${type}" value="${esc(value??'')}" placeholder="${esc(placeholder)}" ${type==='text'?'maxlength="140"':''}></div>`;}
let modalOnSave=null;
function modal({title,eyebrow='LINDE',body,footer,onSave}){$('#modalTitle').textContent=title;$('#modalEyebrow').textContent=eyebrow;$('#modalBody').innerHTML=body;$('#modalFooter').innerHTML=footer||`<button class="btn btn-secondary" data-modal="close">Cancelar</button><button class="btn btn-primary" data-modal="save">Guardar</button>`;modalOnSave=onSave||null;$('#modalBackdrop').classList.remove('hidden');putIcons($('#modalBackdrop'));setTimeout(()=>$('#modalBody').querySelector('input:not([type=hidden]), textarea, select')?.focus(),50);}
function closeModal(){$('#modalBackdrop').classList.add('hidden');modalOnSave=null;}
function formValues(){const obj={};$('#modalBody').querySelectorAll('[name]').forEach(el=>obj[el.name]=el.type==='checkbox'?el.checked:el.value.trim());return obj;}
function showProjectModal(isNew=false){const p=isNew?blankProject():active();const body=`<div class="modal-info">${isNew?'Organiza la información de un nuevo inmueble. Puedes agregar niveles y dibujar después.':'Estos datos se incluirán en el plano y en la ficha imprimible.'}</div><div class="field-double">${formInput('Nombre del proyecto','title',isNew?'':p.title,'text','Ej. Apartamento 301')}${formInput('Referencia / radicado','reference',p.reference)}</div>${formInput('Dirección del inmueble','address',p.address,'text','Dirección o identificación predial')}<div class="field-double">${formInput('Municipio / ciudad','city',p.city,'text','Ej. Madrid, Cundinamarca')}${formInput('Fecha de visita','date',p.date,'date')}</div><div class="field-double">${formInput('Solicitante','client',p.client)}${formInput('Responsable','analyst',p.analyst)}</div><div class="field-group"><label>Observaciones generales</label><textarea class="field-textarea" name="notes" rows="3" maxlength="2000">${esc(p.notes||'')}</textarea></div>`;
 const footer=isNew?null:`<button class="btn button-danger" data-modal="deleteProject" style="margin-right:auto">${ico('trash')} Eliminar</button><button class="btn btn-secondary" data-modal="duplicateProject">${ico('copy')} Copiar</button><button class="btn btn-primary" data-modal="save">Guardar cambios</button>`;
 modal({title:isNew?'Crear proyecto':'Ficha del inmueble',eyebrow:isNew?'NUEVO AVALÚO':'INFORMACIÓN DEL PREDIO',body,footer,onSave:()=>{
  const val=formValues();if(!val.title){toast('Escribe un nombre para el proyecto.');return false;}
  if(isNew){const np=blankProject(val.title);Object.assign(np,val);projects.unshift(np);activeId=np.id;selectedId=null;history=[];future=[];persist();render();fitView();}
  else{commit(()=>Object.assign(p,val));}return true;
 }});
}
function showFloorModal(existing=false){const f=floor();modal({title:existing?'Renombrar nivel':'Agregar nivel',eyebrow:'ORGANIZACIÓN DEL INMUEBLE',body:formInput('Nombre del nivel','name',existing?f.name:`Nivel ${active().floors.length+1}`,'text','Ej. Segundo piso'),onSave:()=>{
 const name=formValues().name;if(!name){toast('El nivel necesita un nombre.');return false;}if(existing){commit(()=>{f.name=name;});}else{const fid=id();commit(()=>{active().floors.push({id:fid,name,items:[]});active().activeFloorId=fid;selectedId=null;});history=[];future=[];fitView();}return true;
 }});}
function showTextModal(pt){modal({title:'Nueva anotación',eyebrow:'TEXTO DEL PLANO',body:'<div class="field-group"><label>Texto visible en el plano</label><textarea class="field-textarea" name="content" maxlength="200" placeholder="Ej. Acceso principal, patio, observación técnica…"></textarea></div>',onSave:()=>{
 const val=formValues().content;if(!val){toast('Escribe el texto de la anotación.');return false;}let newId=id();commit(()=>floor().items.push({id:newId,kind:'text',p:pt,text:val,size:.25}));selectedId=newId;setTool('select');return true;
 }});}
function showHelp(){modal({title:'Guía rápida',eyebrow:'APRENDE A USAR LINDE',body:`<div class="help-section"><strong>1. Dibuja las áreas reales</strong><p>Usa <span class="kbd">R</span> Rectángulo para habitaciones regulares o <span class="kbd">P</span> Polígono para contornos irregulares. Marca esquinas en metros. Termina el polígono tocando el primer punto, haciendo doble clic o pulsando el botón Terminar.</p></div><div class="help-section"><strong>2. Ajusta medidas y clasificaciones</strong><p>Con Seleccionar, arrastra un espacio o sus puntos verdes. En el inspector, cambia nombre, categoría, ancho y alto de los rectángulos. Un cuadro de cuadrícula equivale a 1 m, con ajuste de 0,05 m activado.</p></div><div class="help-section"><strong>3. Añade detalles técnicos</strong><p>Usa Muro, Puerta, Ventana, Medir y Texto. Cada línea se dibuja seleccionando dos puntos. Puedes crear diferentes niveles para el mismo inmueble.</p></div><div class="help-section"><strong>4. Exporta y conserva el trabajo</strong><p>Exportar genera PNG, SVG, resumen CSV, respaldo JSON o ficha PDF mediante Imprimir. Los proyectos se guardan solo en este navegador: exporta el JSON como copia de seguridad y no uses modo incógnito.</p></div><div class="modal-info">Importante: el croquis es una herramienta de apoyo. No sustituye un levantamiento topográfico, un plano arquitectónico firmado ni una certificación de cabida y linderos. Verifica siempre medidas, áreas y normativa aplicable.</div>`,footer:'<button class="btn btn-primary" data-modal="close">Entendido</button>'});}
function showExport(){modal({title:'Exportar plano',eyebrow:'ENTREGABLES',body:`<p class="inspector-subtitle" style="margin-bottom:15px">Elige el formato para tu informe, cliente o respaldo.</p><div class="export-grid">
 <button class="export-card" data-export="png"><span class="export-card-icon">${ico('image')}</span><strong>Imagen PNG</strong><span>Plano en alta resolución para informes.</span></button>
 <button class="export-card" data-export="svg"><span class="export-card-icon">${ico('polygon')}</span><strong>Vector SVG</strong><span>Plano ampliable sin perder calidad.</span></button>
 <button class="export-card" data-export="pdf"><span class="export-card-icon">${ico('print')}</span><strong>Ficha PDF</strong><span>Abre la impresión para guardar como PDF.</span></button>
 <button class="export-card" data-export="csv"><span class="export-card-icon">${ico('list')}</span><strong>Áreas CSV</strong><span>Desglose por nivel para Excel.</span></button>
 <button class="export-card" data-export="json"><span class="export-card-icon">${ico('file')}</span><strong>Respaldo JSON</strong><span>Guarda el proyecto editable y sus datos.</span></button>
 </div>`,footer:'<button class="btn btn-secondary" data-modal="close">Cerrar</button>'});}
function validateImportedProject(p){if(!p||!Array.isArray(p.floors)||!p.floors.length||p.floors.length>100)throw Error('No hay niveles válidos.');const np=blankProject(String(p.title||'Proyecto importado').slice(0,140));['title','address','city','reference','client','analyst','date','notes'].forEach(k=>np[k]=String(p[k]||'').slice(0,2000));np.id=id();np.floors=p.floors.map(f=>{
 if(!Array.isArray(f.items)||f.items.length>2500)throw Error('Demasiados elementos en el nivel.');
 return{id:id(),name:String(f.name||'Nivel').slice(0,140),items:f.items.filter(it=>['area','wall','opening','measure','text'].includes(it.kind)).map(it=>{
  const item=clone(it);item.id=id();if(item.kind==='area'){
   if(!Array.isArray(item.points)||item.points.length<3||item.points.length>300)throw Error('Polígono inválido.');item.points=item.points.map(p=>validPoint(p));item.name=String(item.name||'Espacio').slice(0,80);item.category=CAT[item.category]?item.category:'otra';item.notes=String(item.notes||'').slice(0,1000);item.isRect=Boolean(item.isRect&&item.points.length===4);item.count=item.count!==false;
  }else if(item.kind==='text'){item.p=validPoint(item.p);item.text=String(item.text||'Anotación').slice(0,200);item.size=Math.max(.1,Math.min(2,Number(item.size)||.25));}
  else{item.a=validPoint(item.a);item.b=validPoint(item.b);if(item.kind==='wall')item.width=Math.max(.05,Math.min(1,Number(item.width)||.15));if(item.kind==='opening')item.type=item.type==='window'?'window':'door';}return item;
 })};});np.activeFloorId=np.floors[0].id;return np;
}
function validPoint(p){if(!Array.isArray(p)||p.length!==2||!p.every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<100000))throw Error('Coordenadas inválidas.');return p.map(n2);}
async function importJsonFile(file){if(!file)return;if(file.size>4_000_000){toast('Archivo demasiado grande.');return;}try{
 const data=JSON.parse(await file.text());const raw=(data.project&&typeof data.project==='object')?data.project:data;
 const project=validateImportedProject(raw);if(projects.length>=80)throw Error('Demasiados proyectos guardados en este navegador.');projects.unshift(project);activeId=project.id;history=[];future=[];selectedId=null;persist();render();fitView();toast('Proyecto importado correctamente.');
 }catch(err){toast('No fue posible importar: '+err.message);}}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function exportJSON(){const p=active();download(new Blob([JSON.stringify({format:'linde-v1',exportedAt:new Date().toISOString(),project:p},null,2)],{type:'application/json'}),safeFile(p.title)+'-respaldo.json');toast('Respaldo editable descargado.');}
function csvCell(val){const t=String(val??'');const safe=/^[=+@-]/.test(t)?"'"+t:t;return '"'+safe.replace(/"/g,'""')+'"';}
function exportCSV(){const p=active(),rows=[['Nivel','Espacio','Clasificación','Área m2','Perímetro m','Incluida en el total','Notas']];p.floors.forEach(f=>f.items.filter(it=>it.kind==='area').forEach(it=>rows.push([f.name,it.name,(CAT[it.category]||CAT.otra).label,area(it.points).toFixed(2),perimeter(it.points).toFixed(2),it.count===false?'No':'Sí',it.notes||''])));
 const content='\ufeff'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n');download(new Blob([content],{type:'text/csv;charset=utf-8'}),safeFile(p.title)+'-areas.csv');toast('Desglose de áreas descargado.');}
function makeExportSVG(){const p=active(),f=floor(),b=getBounds(f.items),scale=Math.min(56,3500/Math.max(b.w,1),2200/Math.max(b.h,1)),width=Math.round(Math.max(920,b.w*scale+160)),height=Math.round(Math.max(590,b.h*scale+215));
 const offX=(width-b.w*scale)/2-b.minX*scale,offY=90+(height-180-b.h*scale)/2-b.minY*scale;
 const drawing=objects.cloneNode(true);drawing.querySelectorAll('[data-item]').forEach(n=>n.removeAttribute('data-item'));drawing.querySelectorAll('path.area-outline').forEach(n=>n.setAttribute('stroke-width','.055'));
 const cleaned=drawing.outerHTML.replace(/ id="drawingObjects"/,'');
 const built=metricBy(f),free=metricBy(f,'libre'),lot=metricBy(f,'lote');
 return `<svg xmlns="${SVGNS}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="none" stroke="#dde6df" stroke-width="1.5"/>
  <rect x="20" y="20" width="${width-40}" height="58" fill="#f2f7f1"/>
  <text x="40" y="47" font-family="Arial, sans-serif" font-weight="800" font-size="25" fill="#204638">linde.</text>
  <text x="142" y="46" font-family="Arial, sans-serif" font-weight="700" font-size="15" fill="#355a4c">${xml(p.title)}</text>
  <text x="142" y="64" font-family="Arial, sans-serif" font-size="11" fill="#788b80">${xml(f.name)} · ${xml(p.address||p.city||'Sin ubicación')}</text>
  <text x="${width-42}" y="48" text-anchor="end" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="#648476">CROQUIS DE ÁREAS · m</text>
  <g transform="translate(${offX} ${offY}) scale(${scale})">${cleaned}</g>
  <line x1="20" y1="${height-74}" x2="${width-20}" y2="${height-74}" stroke="#dde6df"/>
  <text x="40" y="${height-49}" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#35584b">ÁREA CONSTRUIDA: ${xml(fmt(built))} m²</text>
  <text x="${width*.42}" y="${height-49}" font-family="Arial, sans-serif" font-size="11" fill="#627d6e">ÁREA LIBRE: ${xml(fmt(free))} m²</text>
  <text x="${width*.69}" y="${height-49}" font-family="Arial, sans-serif" font-size="11" fill="#627d6e">TERRENO: ${xml(fmt(lot))} m²</text>
  <text x="40" y="${height-30}" font-family="Arial, sans-serif" font-size="9" fill="#839389">Croquis de apoyo para visita de avalúo. Verificar medidas en campo.</text>
  <text x="${width-40}" y="${height-30}" text-anchor="end" font-family="Arial, sans-serif" font-size="9" fill="#839389">${xml(p.reference||'Sin referencia')} · ${xml(p.date||today())}</text>
 </svg>`;
}
function exportSVG(){download(new Blob([makeExportSVG()],{type:'image/svg+xml;charset=utf-8'}),safeFile(active().title)+'-'+safeFile(floor().name)+'.svg');toast('Plano vectorial descargado.');}
async function exportPNG(){try{const source=makeExportSVG();const image=new Image(),url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml;charset=utf-8'}));await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});const canvas=document.createElement('canvas'),ratio=2;canvas.width=image.width*ratio;canvas.height=image.height*ratio;if(canvas.width>12500||canvas.height>12500)throw Error('Plano demasiado grande para una imagen. Usa SVG.');const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.scale(ratio,ratio);ctx.drawImage(image,0,0);URL.revokeObjectURL(url);canvas.toBlob(blob=>{if(!blob){toast('No se pudo generar el PNG.');return;}download(blob,safeFile(active().title)+'-'+safeFile(floor().name)+'.png');toast('Imagen del plano descargada.');},'image/png');
 }catch(err){toast('Error al generar PNG: '+err.message);}}
function printReport(){const p=active(),f=floor();const rows=p.floors.flatMap(fl=>fl.items.filter(it=>it.kind==='area').map(it=>({level:fl.name,...it,measure:area(it.points)})));
 const meta=[['INMUEBLE',p.title],['DIRECCIÓN',p.address||'No especificada'],['MUNICIPIO',p.city||'No especificado'],['RADICADO',p.reference||'Sin referencia'],['RESPONSABLE',p.analyst||'No especificado'],['SOLICITANTE',p.client||'No especificado'],['FECHA',p.date||today()],['NIVELES',String(p.floors.length)]];
 $('#printSheet').innerHTML=`<div class="print-header"><div class="print-brand">linde.<small>ESTUDIO DE INMUEBLES</small></div><div class="print-title"><h1>Ficha de áreas y croquis</h1><p>Documento de apoyo para visita de avalúo</p></div></div>
 <div class="print-meta">${meta.map(m=>`<div><small>${esc(m[0])}</small><strong>${esc(m[1])}</strong></div>`).join('')}</div>
 <div class="print-plan">${makeExportSVG()}</div><div class="print-lower"><div><h2>CUADRO DE ÁREAS · TODOS LOS NIVELES</h2><table><thead><tr><th>Nivel</th><th>Espacio</th><th>Tipo</th><th>Incluida</th><th>Área (m²)</th></tr></thead><tbody>${rows.map(it=>`<tr><td>${esc(it.level)}</td><td>${esc(it.name)}</td><td>${esc((CAT[it.category]||CAT.otra).label)}</td><td>${it.count===false?'No':'Sí'}</td><td>${fmt(it.measure)}</td></tr>`).join('')}<tr><td colspan="4"><strong>TOTAL ÁREA CONSTRUIDA</strong></td><td>${fmt(p.floors.reduce((a,fl)=>a+metricBy(fl),0))}</td></tr></tbody></table></div><div><h2>OBSERVACIONES Y ALCANCE</h2><p class="print-notes">${esc(p.notes||'Sin observaciones registradas.')}</p><p class="print-notes" style="margin-top:10px">Nota: las áreas del cuadro se calculan geométricamente a partir de los polígonos trazados. Las categorías no se suman entre sí. Un croquis no reemplaza una medición profesional verificada ni documentos técnicos exigidos por las autoridades.</p></div></div>
 <div class="print-footer"><span>Generado con Linde · Herramienta de apoyo</span><span>${esc(new Date().toLocaleDateString('es-CO',{timeZone:'America/Bogota'}))}</span></div>`;
 closeModal();setTimeout(()=>window.print(),180);
}
function handleExport(type){if(type==='json')exportJSON();else if(type==='csv')exportCSV();else if(type==='png')exportPNG();else if(type==='svg')exportSVG();else if(type==='pdf'){printReport();return;}closeModal();}
function wireEvents(){
 $$('.tool').forEach(btn=>btn.addEventListener('click',()=>setTool(btn.dataset.tool)));
 $('#toggleSidebar').addEventListener('click',()=>{$('#sidebar').classList.toggle('open');$('#inspector').classList.remove('open');$('#drawerBackdrop').classList.toggle('open',$('#sidebar').classList.contains('open'));});
 $('#toggleInspector').addEventListener('click',()=>{$('#inspector').classList.toggle('open');$('#sidebar').classList.remove('open');$('#drawerBackdrop').classList.toggle('open',$('#inspector').classList.contains('open'));});
 $('#closeSidebar').addEventListener('click',closeDrawers);$('#closeInspector').addEventListener('click',closeDrawers);$('#drawerBackdrop').addEventListener('click',closeDrawers);
 $('#projectList').addEventListener('click',e=>{const b=e.target.closest('[data-project]');if(b)setActiveProject(b.dataset.project);});
 $('#floorList').addEventListener('click',e=>{const b=e.target.closest('[data-floor]');if(b)setActiveFloor(b.dataset.floor);});
 $('#floorList').addEventListener('dblclick',e=>{const b=e.target.closest('[data-floor]');if(b){setActiveFloor(b.dataset.floor);showFloorModal(true);}});
 $('#stageFloorName').addEventListener('click',()=>{if(matchMedia('(max-width:700px)').matches){$('#toggleSidebar').click();}else showFloorModal(true);});
 $('#newProjectBtn').addEventListener('click',()=>showProjectModal(true));$('#projectInfoBtn').addEventListener('click',()=>showProjectModal(false));
 $('#newFloorBtn').addEventListener('click',()=>showFloorModal(false));$('#helpBtn').addEventListener('click',showHelp);
 $('#exportBtn').addEventListener('click',showExport);$('#exportReportBtn').addEventListener('click',printReport);
 $('#importBtn').addEventListener('click',()=>$('#jsonFile').click());$('#jsonFile').addEventListener('change',e=>{importJsonFile(e.target.files[0]);e.target.value='';});
 $('#showGrid').addEventListener('change',e=>{ui.grid=e.target.checked;persist();renderDrawing();});
 $('#useSnap').addEventListener('change',e=>{ui.snap=e.target.checked;persist();});
 $('#showCotas').addEventListener('change',e=>{ui.cotas=e.target.checked;persist();renderDrawing();});
 $('#undoBtn').addEventListener('click',undo);$('#redoBtn').addEventListener('click',redo);$('#fitBtn').addEventListener('click',fitView);
 $('#zoomInBtn').addEventListener('click',()=>zoomAt(1.2));$('#zoomOutBtn').addEventListener('click',()=>zoomAt(1/1.2));
 $('#finishDrawing').addEventListener('click',finishPolygon);$('#cancelDrawing').addEventListener('click',closeDraw);
 $('#modalClose').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});
 $('#modalBackdrop').addEventListener('click',e=>{const b=e.target.closest('[data-modal]');if(!b)return;
   const action=b.dataset.modal;
   if(action==='close'){closeModal();return;}if(action==='save'){if(modalOnSave?.()!==false)closeModal();return;}
   if(action==='duplicateProject'){const copy=clone(active());copy.id=id();copy.title+=' (copia)';copy.createdAt=Date.now();copy.updatedAt=Date.now();projects.unshift(copy);activeId=copy.id;history=[];future=[];selectedId=null;closeModal();persist();render();fitView();toast('Copia del proyecto creada.');return;}
   if(action==='deleteProject'){if(projects.length===1){toast('Debe quedar al menos un proyecto. Crea otro antes de eliminar este.');return;}if(confirm('¿Eliminar este proyecto y todos sus niveles? Esta acción no se puede deshacer.')){projects=projects.filter(p=>p.id!==activeId);activeId=projects[0].id;selectedId=null;history=[];future=[];closeModal();persist();render();fitView();toast('Proyecto eliminado.');}}
 });
 $('#modalBody').addEventListener('click',e=>{const b=e.target.closest('[data-export]');if(b)handleExport(b.dataset.export);});
 $('#inspectorContent').addEventListener('toggle',e=>{if(e.target?.id==='vertexDetail')vertexPanelOpen=e.target.open;},true);
 $('#inspectorContent').addEventListener('change',e=>{const vertex=e.target.closest('[data-vertex-index]');if(vertex){const s=selected(),index=Number(vertex.dataset.vertexIndex),axis=Number(vertex.dataset.axis),value=Number(vertex.value);if(s?.kind==='area'&&Number.isFinite(value)&&Math.abs(value)<100000&&s.points[index]){commit(()=>{s.points[index][axis]=n2(value);s.isRect=false;});}return;}const el=e.target.closest('[data-property]');if(el)setProperty(el.dataset.property,el.type==='checkbox'?el.checked:el.value);});
 $('#inspectorContent').addEventListener('click',e=>{const b=e.target.closest('[data-inspector-action]');if(!b)return;const action=b.dataset.inspectorAction;
   if(action==='delete')deleteSelection();if(action==='duplicate')duplicateSelection();if(action==='renameFloor')showFloorModal(true);
   if(action==='deleteFloor'&&active().floors.length>1&&confirm('¿Eliminar este nivel y todos sus elementos?')){commit(()=>{active().floors=active().floors.filter(f=>f.id!==active().activeFloorId);active().activeFloorId=active().floors[0].id;selectedId=null;});history=[];future=[];fitView();toast('Nivel eliminado.');}
 });
 svg.addEventListener('pointerdown',pointerDown);svg.addEventListener('pointermove',pointerMove);svg.addEventListener('pointerup',pointerUp);svg.addEventListener('pointercancel',()=>{drag=null;drawDrag=null;render();});svg.addEventListener('click',canvasClick);
 svg.addEventListener('wheel',e=>{e.preventDefault();const pos=getLocal(e);zoomAt(e.deltaY<0?1.1:1/1.1,pos);},{passive:false});
 svg.addEventListener('contextmenu',e=>e.preventDefault());
 window.addEventListener('keydown',e=>{
   const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;
   const mod=e.ctrlKey||e.metaKey;if(mod&&e.key.toLowerCase()==='s'){e.preventDefault();persist();toast('Proyecto guardado en este navegador.');return;}
   if(mod&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)redo();else undo();return;}
   if(mod&&e.key.toLowerCase()==='y'){e.preventDefault();redo();return;}
   if(!$('#modalBackdrop').classList.contains('hidden')){if(e.key==='Escape')closeModal();return;}
   if(e.key==='Escape'){if(drawPoints.length)closeDraw();else if(selectedId)switchSelection(null);else closeDrawers();return;}
   if(e.key==='Enter'&&tool==='poly'&&drawPoints.length>=3){e.preventDefault();finishPolygon();return;}
   if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();deleteSelection();return;}
   if(e.key===' '){e.preventDefault();spaceDown=true;return;}
   if(e.key==='+'||e.key==='='){zoomAt(1.2);return;}if(e.key==='-'){zoomAt(1/1.2);return;}
   if(e.altKey||mod)return;
   const shortcuts={v:'select',r:'rect',p:'poly',l:'wall',m:'measure',t:'text',h:'pan'};const chosen=shortcuts[e.key.toLowerCase()];if(chosen)setTool(chosen);
 });
 window.addEventListener('keyup',e=>{if(e.key===' ')spaceDown=false;});window.addEventListener('blur',()=>spaceDown=false);
 const resizeObserver=new ResizeObserver(()=>{renderDrawing();});resizeObserver.observe(wrap);
}
function boot(){putIcons();try{const stored=JSON.parse(localStorage.getItem(STORAGE)||'null');if(stored&&Array.isArray(stored.projects)&&stored.projects.length){projects=stored.projects.filter(p=>p&&Array.isArray(p.floors)&&p.floors.length);activeId=stored.activeId;ui={grid:true,snap:true,cotas:true,...stored.ui};}}catch(err){console.warn('No se pudo restaurar el almacenamiento',err);}
 if(!projects.length){projects=[example()];activeId=projects[0].id;persist();}if(!projects.some(p=>p.id===activeId))activeId=projects[0].id;
 wireEvents();render();requestAnimationFrame(()=>fitView());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
