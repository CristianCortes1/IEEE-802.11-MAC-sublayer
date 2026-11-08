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
function get(id) { if (!nodes.has(id)) {const el=element();if(id==='quiz')for(let i=10;i<16;i++)el.elements['q'+i]={value:''};nodes.set(id,el);} return nodes.get(id); }
const context = {
  console,
  document: {
    querySelector: selector=>get(selector.replace(/^#/,'')),
    getElementById: get, querySelectorAll: ()=>[], addEventListener(){}
  },
  IntersectionObserver: class {observe(){}}
};
vm.createContext(context);
for (const file of ['architecture.js','frames.js','lessons.js','lab-scenes.js','app.js','mini-quizzes.js']) vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
vm.runInContext(`
  if(lessons.length!==7||questions.length!==16)throw Error('Unexpected curriculum size');
  for(const q of questions){
    if(!q.a.length||q.a.some(i=>!q.o[i])||q.s<1||q.s>7)throw Error('Invalid quiz answer or review target');
  }
  const html=document.querySelector('#lessons').innerHTML;
  for(const match of html.matchAll(/href="#(def-[^"]+)"/g)){
    if(!Object.keys(glossary).some(k=>slug(k)===match[1]))throw Error('Missing glossary target: '+match[1]);
  }
  for(const lesson of lessons.filter((_,i)=>i!==5)){if(lesson[2].replace(/<[^>]*>/g,'').split(/\\s+/).length<300)throw Error('Chapter too short: '+lesson[0]);}
`, context);
const questions = vm.runInContext('questions',context);
const quiz = get('quiz');
questions.forEach((q,i)=>{if(q.match) quiz.elements['q'+i]={value:''};});
get('grade').onclick();
assert.match(get('result').textContent,/^0 \/ 16/);
assert.match(get('feedback0').innerHTML,/Sin confirmar/);
get('confirm0').onclick();assert.match(get('confirm-status0').textContent,/Selecciona/);
questions.forEach((q,i)=>{if(q.match)quiz.elements['q'+i].value=String(q.a[0]);else selections['q'+i]=[...q.a];});
quiz.onchange();
assert.equal(get('live-grade').textContent,'0.00 / 5.00');
questions.forEach((_,i)=>get('confirm'+i).onclick());
assert.equal(get('live-grade').textContent,'5.00 / 5.00');
assert.equal(get('live-answered').textContent,'16 de 16 confirmadas');
get('grade').onclick();
assert.match(get('result').textContent,/^16 \/ 16/);
selections.q1.push(1);quiz.onchange();
assert.equal(get('confirm1').disabled,false);
assert.equal(get('live-grade').textContent,'4.69 / 5.00');
get('confirm1').onclick(); // An extra incorrect choice must invalidate the answer.
get('grade').onclick();
assert.match(get('result').textContent,/^15 \/ 16/);
assert.equal(get('live-grade').textContent,'4.69 / 5.00');
assert.match(get('feedback1').innerHTML,/href="#tema2"/);
get('reset').onclick();
assert.equal(get('live-grade').textContent,'0.00 / 5.00');
assert.equal(get('live-answered').textContent,'0 de 16 confirmadas');
selections.q0=[1];quiz.onchange();assert.equal(get('live-grade').textContent,'0.00 / 5.00');
get('confirm0').onclick();assert.equal(get('live-grade').textContent,'0.31 / 5.00');
assert.equal(get('confirm0').disabled,true);
selections.q0=[0];quiz.onchange();assert.equal(get('live-grade').textContent,'0.00 / 5.00');
assert.equal(get('confirm0').disabled,false);get('confirm0').onclick();assert.equal(get('live-grade').textContent,'0.00 / 5.00');
get('reset').onclick();
assert.equal(get('result').textContent,'');
for(const [id,count] of [['simulador',7],['retry-lab',5]]) {
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
for(const key of ['bss2','distribution','ess','bss1']){
  get('arch-'+key).onclick();
  assert.equal(get('architecture-map').attributes['data-focus'],key);
  assert.equal(get('arch-'+key).attributes['aria-pressed'],'true');
  for(const other of ['bss1','bss2','distribution','ess'].filter(name=>name!==key))assert.equal(get('arch-'+other).attributes['aria-pressed'],'false');
  assert.ok(get('architecture-detail').innerHTML.length>100);
}
get('arch-ess').onclick();
assert.match(get('architecture-detail').innerHTML,/ESS: el conjunto extendido/);
assert.match(get('lessons').innerHTML,/ess-boundary/);
assert.equal(vm.runInContext('Object.hasOwn(glossary,"ESS")',context),true);
assert.ok(questions.some(q=>q.q.includes('ESS')&&q.s===2));
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
get('backoff-play').onclick();assert.match(get('backoff-stage').innerHTML,/PASO 2 DE 13/);
context.document.hidden=true;popupEvents.visibilitychange();assert.equal(timers.size,0);context.document.hidden=false;
get('backoff-reset').onclick();assert.equal(get('backoff-progress').attributes['aria-valuenow'],'1');
vm.runInContext('initializeFrameLesson()',context);
get('frame-type-control').onclick();assert.match(get('frame-type-detail').innerHTML,/ACK/);
get('frame-type-data').onclick();assert.match(get('frame-type-detail').innerHTML,/contenido/);
get('frame-part-check').onclick();assert.match(get('frame-part-detail').innerHTML,/FCS/);
get('frame-part-addresses').onclick();assert.match(get('frame-part-detail').innerHTML,/receptor/);
for(let i=0;i<3;i++)get('journey-next').onclick();
assert.match(get('journey-stage').innerHTML,/C todavía no ha recibido/);
get('journey-next').onclick();assert.match(get('journey-stage').innerHTML,/turno automático/);
get('journey-prev').onclick();assert.match(get('journey-stage').innerHTML,/PASO 4 DE 9/);
get('journey-reset').onclick();get('journey-play').onclick();assert.equal(timers.size,1);
get('journey-play').onclick();assert.equal(timers.size,0);
get('journey-play').onclick();let journeyTicks=0;
while(timers.size){assert.ok(++journeyTicks<=9);const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}
assert.match(get('journey-stage').innerHTML,/PASO 9 DE 9/);
assert.equal(get('journey-next').disabled,true);
get('journey-play').onclick();context.document.hidden=true;popupEvents.visibilitychange();assert.equal(timers.size,0);context.document.hidden=false;
get('journey-reset').onclick();assert.match(get('journey-stage').innerHTML,/PASO 1 DE 9/);
vm.runInContext(fs.readFileSync('rts-animation.js','utf8'),context,{filename:'rts-animation.js'});
assert.match(get('rts-stage').innerHTML,/PASO 1 DE 11/);
for(let i=0;i<5;i++)get('rts-next').onclick();
assert.match(get('rts-stage').innerHTML,/C oye CTS/);
assert.match(get('rts-stage').innerHTML,/272/);
get('rts-next').onclick();assert.match(get('rts-stage').innerHTML,/256/);
get('rts-next').onclick();assert.match(get('rts-stage').innerHTML,/56/);
get('rts-prev').onclick();assert.equal(get('rts-progress').attributes['aria-valuenow'],'7');
get('rts-reset').onclick();get('rts-play').onclick();assert.equal(timers.size,1);
get('rts-play').onclick();assert.equal(timers.size,0);
get('rts-play').onclick();let rtsTicks=0;
while(timers.size){assert.ok(++rtsTicks<=11);const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}
assert.match(get('rts-stage').innerHTML,/PASO 11 DE 11/);
assert.equal(get('rts-play').attributes['aria-pressed'],'false');
get('rts-play').onclick();assert.equal(timers.size,1);
context.document.hidden=true;popupEvents.visibilitychange();assert.equal(timers.size,0);context.document.hidden=false;
get('rts-reset').onclick();assert.equal(get('rts-progress').attributes['aria-valuenow'],'1');
// Full story: association must precede data, hidden stations learn NAV from CTS,
// and seeking backwards restores the earlier state rather than mutating history.
vm.runInContext(fs.readFileSync('full-story.js','utf8'),context,{filename:'full-story.js'});
const story=vm.runInContext('wifiStory',context);
assert.equal(story.chapters.length,7);
assert.equal(new Set(story.steps.map(step=>step.id)).size,story.steps.length);
const indexOf=id=>story.steps.findIndex(step=>step.id===id);
const seekStory=id=>{get('story-position').value=String(indexOf(id));get('story-position').oninput();};
for(const [index,step] of story.steps.entries()){
  const state=story.states[index];
  if(state.aAssoc)assert.ok(state.aAuth&&state.aArrived);
  if(state.cAssoc)assert.ok(state.cAuth&&state.cArrived);
  for(const message of step.messages||[]){
    for(const sta of [message.from,message.to].filter(sta=>sta==='A'||sta==='C'))assert.ok(state[`${sta.toLowerCase()}Arrived`]);
    if(message.kind==='data')assert.ok(state[`${message.from.toLowerCase()}Assoc`]);
  }
  for(const term of step.terms)assert.equal(vm.runInContext(`Object.hasOwn(glossary,${JSON.stringify(term)})`,context),true);
}
assert.equal(story.states[indexOf('a-rts')].navC,0);
assert.equal(story.states[indexOf('a-cts')].navC,272);
assert.equal(story.states[indexOf('a-retry-data')].navC,56);
assert.equal(story.states[indexOf('a-retry-ack')].navC,0);
assert.equal(story.states[indexOf('c-cts')].navA,272);
assert.equal(story.states[indexOf('c-retry-ack')].navA,0);
assert.equal(story.states[indexOf('a-cts')].backoffC,'Congelado');
assert.equal(story.states[indexOf('a-rts')].backoffC,'En curso');
seekStory('c-association-response');
assert.match(get('story-stage').innerHTML,/Asociada · AID 2/);
seekStory('a-arrives');
assert.doesNotMatch(get('story-stage').innerHTML,/Asociada · AID 2/);
assert.match(get('story-stage').innerHTML,/Aún no ha llegado/);
get('story-chapter-5').onclick();
assert.equal(get('story-position').value,String(story.chapters[5].start));
assert.equal(get('story-chapter-5').attributes['aria-pressed'],'true');
seekStory('a-cts');assert.match(get('story-stage').innerHTML,/Oye CTS/);
assert.match(get('story-stage').innerHTML,/272 µs/);
get('story-prev').onclick();
assert.equal(get('story-position').value,String(indexOf('a-sifs-cts')));
get('story-reset').onclick();assert.equal(get('story-position').value,'0');
get('story-play').onclick();assert.equal(timers.size,1);
get('story-play').onclick();assert.equal(timers.size,0);
const pausedScene=get('story-stage').innerHTML;
get('story-play').onclick();assert.equal(get('story-stage').innerHTML,pausedScene);
get('story-speed').value='1600';get('story-speed').onchange();assert.equal(timers.size,1);
let storyTicks=0;
while(timers.size){assert.ok(++storyTicks<=story.steps.length);const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}
assert.equal(get('story-position').value,String(story.steps.length-1));
assert.equal(get('story-next').disabled,true);
assert.equal(get('story-play').attributes['aria-pressed'],'false');
get('story-play').onclick();assert.equal(get('story-position').value,'0');
context.document.hidden=true;popupEvents.visibilitychange();assert.equal(timers.size,0);context.document.hidden=false;
get('story-play').onclick();popupEvents.click({target:{closest:()=>({})}});assert.equal(timers.size,0);
get('story-reset').onclick();assert.equal(get('story-prev').disabled,true);
assert.doesNotMatch(fs.readFileSync('full-story.js','utf8'),/capa\s*3|\bIP\b|router|\bQoS\b|\bEDCA\b|\bAIFS\b|Block ACK/i);
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
for(const match of html.matchAll(/(?:src|href)="([^"#?]+\.(?:js|css))(?:\?[^"#]*)?"/g)) assert.ok(fs.existsSync(match[1]),'Missing asset '+match[1]);
for(const file of ['index.html','app.js','architecture.js','frames.js','lessons.js','lab-scenes.js','backoff-animation.js','rts-animation.js','mini-quizzes.js','glossary-dialog.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/capa\s*3|\bIP\b|router|encaminamiento|\bQoS\b|\bEDCA\b|\bAIFS\b|seguridad|autenticación|Block ACK/i);
console.log('PASS: complete Wi-Fi story/state restoration/playback, backoff, architecture, chapters, glossary popup, assets, scope, final exam, mini quizzes and laboratories.');
