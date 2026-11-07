// Dependency-free content and interaction checks. Run: node verify.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const nodes = new Map();
let selections = {};
function element() {
  const children = new Map();
  return {
    innerHTML: '', textContent: '', elements: {}, value: '',style:{},
    attributes: {},setAttribute(name,value){this.attributes[name]=value;},
    insertAdjacentHTML(_position,html){this.innerHTML+=html;},
    addEventListener(event,handler){this['on'+event]=handler;},
    querySelector(selector) {
      if (!children.has(selector)) children.set(selector, {focus(){},addEventListener(event,handler){this['on'+event]=handler;}});
      return children.get(selector);
    },
    querySelectorAll(selector) {
      const name = selector.match(/name="([^"]+)"/);
      return name ? (selections[name[1]] || []).map(value=>({value:String(value)})) : [];
    },
    reset(){selections={};Object.values(this.elements).forEach(e=>e.value='');},
    scrollIntoView(){}
  };
}
function get(id) { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); }
const context = {
  console,
  document: {
    querySelector: selector=>get(selector.replace(/^#/,'')),
    getElementById: get, querySelectorAll: ()=>[], addEventListener(){}
  },
  IntersectionObserver: class {observe(){}}
};
vm.createContext(context);
for (const file of ['architecture.js','lessons.js','lab-scenes.js','app.js','mini-quizzes.js']) vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
vm.runInContext(`
  if(lessons.length!==7||questions.length!==16)throw Error('Unexpected curriculum size');
  for(const q of questions){
    if(!q.a.length||q.a.some(i=>!q.o[i])||q.s<1||q.s>7)throw Error('Invalid quiz answer or review target');
  }
  const html=document.querySelector('#lessons').innerHTML;
  for(const match of html.matchAll(/href="#(def-[^"]+)"/g)){
    if(!Object.keys(glossary).some(k=>slug(k)===match[1]))throw Error('Missing glossary target: '+match[1]);
  }
  for(const lesson of lessons){if(lesson[2].replace(/<[^>]*>/g,'').split(/\\s+/).length<300)throw Error('Chapter too short: '+lesson[0]);}
`, context);
const questions = vm.runInContext('questions',context);
const quiz = get('quiz');
questions.forEach((q,i)=>{if(q.match) quiz.elements['q'+i]={value:''};});
get('grade').onclick();
assert.match(get('result').textContent,/^0 \/ 16/);
assert.match(get('feedback0').innerHTML,/Sin responder/);
questions.forEach((q,i)=>{if(q.match)quiz.elements['q'+i].value=String(q.a[0]);else selections['q'+i]=[...q.a];});
get('grade').onclick();
assert.match(get('result').textContent,/^16 \/ 16/);
selections.q1.push(1); // An extra incorrect choice must invalidate the answer.
get('grade').onclick();
assert.match(get('result').textContent,/^15 \/ 16/);
assert.match(get('feedback1').innerHTML,/href="#tema2"/);
get('reset').onclick();
assert.equal(get('result').textContent,'');
for(const [id,count] of [['simulador',7],['hidden-lab',5],['retry-lab',5]]) {
  const lab=get(id);
  assert.match(lab.innerHTML,new RegExp('1 / '+count));
  for(let i=1;i<count;i++) lab.querySelector('[data-next]').onclick();
  assert.match(lab.innerHTML,new RegExp(count+' / '+count));
  assert.match(lab.innerHTML,/lab-scene/);
  lab.querySelector('[data-prev]').onclick();
  assert.match(lab.innerHTML,new RegExp((count-1)+' / '+count));
  lab.querySelector('[data-start]').onclick();
  assert.match(lab.innerHTML,new RegExp('1 / '+count));
}
const html=fs.readFileSync('index.html','utf8');
assert.match(get('lessons').innerHTML,/architecture-map-title/);
assert.match(get('lessons').innerHTML,/layer-diagram/);
assert.match(get('lessons').innerHTML,/mac-bytes/);
assert.equal(get('architecture-map').attributes['data-focus'],'bss1');
for(const key of ['bss2','distribution','bss1']){
  get('arch-'+key).onclick();
  assert.equal(get('architecture-map').attributes['data-focus'],key);
  assert.equal(get('arch-'+key).attributes['aria-pressed'],'true');
  for(const other of ['bss1','bss2','distribution'].filter(name=>name!==key))assert.equal(get('arch-'+other).attributes['aria-pressed'],'false');
  assert.ok(get('architecture-detail').innerHTML.length>100);
}
const miniQuizzes=vm.runInContext('topicQuizzes',context);
assert.equal(miniQuizzes.length,7);
for(const [index,items] of miniQuizzes.entries()){
  const topic=index+1, prefix=`mini-${topic}`, form=get(prefix), result=get(`${prefix}-result`);
  assert.equal(items.length,3);
  assert.match(get(`tema${topic}`).innerHTML,new RegExp(`id="${prefix}"`));
  for(const [i,q] of items.entries()){
    assert.ok(q.a.length>0 && q.a.every(n=>q.o[n]));
    if(q.match)form.elements[`${prefix}-q${i}`]={value:''};
  }
  form.onsubmit({preventDefault(){}});
  assert.match(result.textContent,/^0 de 3/);
  assert.match(get(`${prefix}-feedback0`).innerHTML,/Sin responder/);
  for(const [i,q] of items.entries()){
    if(q.match)form.elements[`${prefix}-q${i}`].value=String(q.a[0]);
    else selections[`${prefix}-q${i}`]=[...q.a];
  }
  form.onsubmit({preventDefault(){}});
  assert.match(result.textContent,/^3 de 3/);
  const multi=items.findIndex(q=>q.a.length>1), q=items[multi];
  selections[`${prefix}-q${multi}`].push(q.o.findIndex((_,i)=>!q.a.includes(i)));
  form.onsubmit({preventDefault(){}});
  assert.match(result.textContent,/^2 de 3/);
  assert.match(get(`${prefix}-feedback${multi}`).innerHTML,new RegExp(`href="#tema${topic}"`));
  form.onchange();
  assert.equal(result.textContent,'');
  assert.equal(get(`${prefix}-feedback${multi}`).innerHTML,'');
  form.onsubmit({preventDefault(){}});
  form.onreset();
  assert.equal(result.textContent,'');
  assert.equal(get(`${prefix}-feedback0`).innerHTML,'');
}
assert.equal(get('result').textContent,''); // Mini quizzes must not alter final exam results.
// Definition popup: click interception, correct content, dismissal and focus return.
const popupEvents = {};
context.document.body = element();
context.document.addEventListener = (type,handler)=>{popupEvents[type]=handler;};
const timers=new Map();let nextTimer=0;
context.setTimeout=fn=>{timers.set(++nextTimer,fn);return nextTimer;};
context.clearTimeout=id=>timers.delete(id);
vm.runInContext(fs.readFileSync('backoff-animation.js','utf8'),context,{filename:'backoff-animation.js'});
assert.match(get('backoff-stage').innerHTML,/PASO 1 DE 13/);
for(let i=0;i<4;i++)get('backoff-next').onclick();
assert.match(get('backoff-stage').innerHTML,/A llega a cero/);
assert.match(get('backoff-stage').innerHTML,/Congelado/);
for(let i=0;i<2;i++)get('backoff-next').onclick();
assert.match(get('backoff-stage').innerHTML,/ACK para A/);
assert.match(get('backoff-stage').innerHTML,/Congelado/);
get('backoff-prev').onclick();
assert.match(get('backoff-stage').innerHTML,/PASO 6 DE 13/);
get('backoff-reset').onclick();
get('backoff-play').onclick();assert.equal(timers.size,1);
get('backoff-play').onclick();assert.equal(timers.size,0);
get('backoff-play').onclick();
let ticks=0;
while(timers.size){assert.ok(++ticks<=13,'Playback must stop at the last step');const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}
assert.match(get('backoff-stage').innerHTML,/PASO 13 DE 13/);
assert.equal(get('backoff-next').disabled,true);
assert.equal(get('backoff-play').attributes['aria-pressed'],'false');
get('backoff-play').onclick();assert.match(get('backoff-stage').innerHTML,/PASO 1 DE 13/);
context.document.hidden=true;popupEvents.visibilitychange();assert.equal(timers.size,0);context.document.hidden=false;
get('backoff-reset').onclick();assert.equal(get('backoff-progress').attributes['aria-valuenow'],'1');
const dialog = get('term-dialog');
dialog.open = false;
dialog.showModal = ()=>{dialog.open=true;};
dialog.close = ()=>{dialog.open=false;dialog.onclose();};
dialog.getBoundingClientRect = ()=>({left:100,right:500,top:100,bottom:400});
vm.runInContext(fs.readFileSync('glossary-dialog.js','utf8'),context,{filename:'glossary-dialog.js'});
let prevented = false, focusOptions;
const link={isConnected:true,getAttribute:()=> '#def-ap',focus:options=>{focusOptions=options;}};
const popupClick=(options={})=>({target:{closest:()=>link},button:0,preventDefault(){prevented=true;},...options});
popupEvents.click(popupClick());
assert.equal(prevented,true);
assert.equal(dialog.open,true);
assert.equal(get('term-dialog-title').textContent,'AP');
assert.match(get('term-dialog-definition').textContent,/Access Point/);
dialog.onclick({target:dialog,clientX:200,clientY:200});
assert.equal(dialog.open,true); // Clicking inside must not dismiss the popup.
dialog.querySelector('button').onclick();
assert.equal(dialog.open,false);
assert.equal(focusOptions.preventScroll,true);
popupEvents.click(popupClick());
dialog.onclick({target:dialog,clientX:20,clientY:20});
assert.equal(dialog.open,false);
prevented=false;
popupEvents.click(popupClick({ctrlKey:true}));
assert.equal(prevented,false);
assert.equal(dialog.open,false);
popupEvents.click(popupClick({target:{closest:()=>({getAttribute:()=> '#def-unknown'})}}));
assert.equal(prevented,false);
for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) assert.ok(fs.existsSync(match[1]),'Missing asset '+match[1]);
for(const file of ['index.html','app.js','architecture.js','lessons.js','lab-scenes.js','backoff-animation.js','mini-quizzes.js','glossary-dialog.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/capa\s*3|\bIP\b|router|encaminamiento/i);
console.log('PASS: backoff animation/playback/pause/reset, architecture, chapters, glossary popup, assets, scope, final exam, mini quizzes, review links and laboratories.');
