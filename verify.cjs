// Dependency-free content and interaction checks. Run: node verify.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const nodes = new Map();
let selections = {};
function element() {
  const children = new Map();
  return {
    innerHTML: '', textContent: '', elements: {}, value: '',
    insertAdjacentHTML(_position,html){this.innerHTML+=html;},
    addEventListener(event,handler){this['on'+event]=handler;},
    querySelector(selector) {
      if (!children.has(selector)) children.set(selector, {focus(){}});
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
for (const file of ['lessons.js','lab-scenes.js','app.js','mini-quizzes.js']) vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
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
for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) assert.ok(fs.existsSync(match[1]),'Missing asset '+match[1]);
for(const file of ['index.html','app.js','lessons.js','lab-scenes.js','mini-quizzes.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/capa\s*3|\bIP\b|router|encaminamiento/i);
console.log('PASS: chapters, glossary, assets, scope, final exam, 7 mini quizzes (21 questions), review links, laboratory navigation and scenes.');
