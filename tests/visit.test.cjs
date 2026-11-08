const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'..','app.js'),'utf8');
const numberSource=source.slice(source.indexOf('function visitNumber('),source.indexOf('function showVisit()',source.indexOf('function visitNumber(')));
const validation=source.slice(source.indexOf('function validateVisitEntries('),source.indexOf('function validatePhotos(',source.indexOf('function validateVisitEntries(')));
const ctx={CAT:{construida:{},libre:{}},id:()=>'new-id'};vm.createContext(ctx);vm.runInContext(numberSource+validation,ctx);
assert.equal(ctx.visitNumber('3,50'),3.5);assert.equal(ctx.visitNumber(''), '');assert.ok(Number.isNaN(ctx.visitNumber('-1')));assert.ok(Number.isNaN(ctx.visitNumber('abc')));
const entries=ctx.validateVisitEntries([{name:'Sala',width:'3.5',length:'4.2',notes:'Puerta',category:'libre',drawn:true}]);assert.equal(entries[0].width,'3.5');assert.equal(entries[0].drawn,true);assert.equal(entries[0].notes,'Puerta');assert.throws(()=>ctx.validateVisitEntries([{width:'-4'}]));
console.log('Cuaderno de visita: OK');
