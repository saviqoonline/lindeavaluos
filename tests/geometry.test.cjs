const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'..','app.js'),'utf8');
const start=source.indexOf('function geometryWarnings('),end=source.indexOf('function photoOwner()',start);
const context={dist:(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),centroid:p=>[p.reduce((n,x)=>n+x[0],0)/p.length,p.reduce((n,x)=>n+x[1],0)/p.length]};
vm.createContext(context);vm.runInContext(source.slice(start,end),context);
const rect=(x,y,w,h)=>({kind:'area',name:'Espacio',category:'construida',points:[[x,y],[x+w,y],[x+w,y+h],[x,y+h]]});
for(const [label,items,expected] of [['separados',[rect(0,0,2,2),rect(3,0,2,2)],false],['adyacentes',[rect(0,0,2,2),rect(2,0,2,2)],false],['iguales',[rect(0,0,2,2),rect(0,0,2,2)],true],['solapados',[rect(0,0,3,3),rect(2,1,3,3)],true],['contorno cruzado',[{kind:'area',name:'X',category:'construida',points:[[0,0],[2,2],[0,2],[2,0]]}],true]]){assert.equal(context.geometryWarnings({items}).length>0,expected,label);}
console.log('Validaciones de geometría: OK');
