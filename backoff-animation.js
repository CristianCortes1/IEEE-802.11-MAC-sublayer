const backoffSteps = [
  {a:3,c:5,phase:'DIFS inicial',title:'Primero, un intervalo libre.',text:'A y C tienen datos pendientes y ya obtuvieron contadores 3 y 5. Tras un periodo ocupado, observan DIFS de canal libre antes de descontar ranuras. DIFS no reduce los contadores.'},
  {a:3,c:5,phase:'Comienza la cuenta',title:'Ambas estaciones pueden contar.',text:'Terminó DIFS. A conserva 3 y C conserva 5. El AP no asignó estos valores: proceden de la selección aleatoria de cada estación.'},
  {a:2,c:4,phase:'Ranura libre 1',title:'Una ranura, una unidad menos.',text:'Como el canal sigue libre, A baja de 3 a 2 y C de 5 a 4. Ninguna ha llegado a cero: todavía no transmiten.'},
  {a:1,c:3,phase:'Ranura libre 2',title:'Las dos cuentas avanzan juntas.',text:'Transcurre otra ranura libre. A queda en 1 y C en 3. Estos contadores no son tiempos de transmisión, sino ranuras pendientes de espera.'},
  {a:0,c:2,phase:'DATOS de A',title:'A llega a cero y transmite.',text:'En la tercera ranura A llega a 0; C queda en 2. A inicia su trama hacia el AP y C congela el contador porque el medio está ocupado.',send:'a',kind:'DATOS',frozen:true},
  {a:0,c:2,phase:'SIFS · responde el AP',title:'Un silencio breve no abre otro turno.',text:'El AP recibió correctamente los datos de A. Espera SIFS antes de responder. C conserva su 2: esta pausa forma parte del intercambio y no le permite reanudar el backoff.',frozen:true},
  {a:0,c:2,phase:'ACK para A',title:'El AP confirma a A.',text:'Después de SIFS, el AP envía ACK a A. C sigue con 2 ranuras pendientes. Su contador no baja durante la confirmación.',send:'ack-a',kind:'ACK',frozen:true},
  {a:'✓',c:2,phase:'Nuevo DIFS',title:'C espera antes de continuar.',text:'A ha completado este intercambio y en este ejemplo no tiene más datos pendientes. C observa un nuevo DIFS libre: todavía conserva las dos ranuras que faltaban.'},
  {a:'✓',c:1,phase:'C reanuda · ranura 1',title:'C continúa desde donde quedó.',text:'Tras DIFS, pasa una ranura libre. C baja de 2 a 1. No vuelve a 5 ni sortea otro contador solo por haber esperado a A.'},
  {a:'✓',c:0,phase:'DATOS de C',title:'Ahora C llega a cero.',text:'Pasa otra ranura libre y C baja de 1 a 0. Empieza su envío al AP. Obtuvo el acceso al completar su espera, no por recibir un turno automático al terminar A.',send:'c',kind:'DATOS'},
  {a:'✓',c:0,phase:'SIFS · responde el AP',title:'Se completa el intercambio de C.',text:'El AP recibió correctamente la trama de C y espera SIFS para contestar. Es la misma regla de respuesta inmediata que se aplicó al envío de A.'},
  {a:'✓',c:0,phase:'ACK para C',title:'El AP confirma a C.',text:'El AP transmite el ACK correspondiente a C. Cada trama de datos del ejemplo tiene su propia confirmación.',send:'ack-c',kind:'ACK'},
  {a:'✓',c:'✓',phase:'Ejemplo completado',title:'La clave: congelar y reanudar.',text:'A y C completaron sus intercambios. C pasó por 5 → 4 → 3 → 2, mantuvo el 2 durante el intercambio de A y, tras DIFS, continuó 2 → 1 → 0. Supusimos recepciones correctas y ninguna otra estación compitiendo.'}
];

function initializeBackoffAnimation() {
  const container=document.getElementById('backoff-animation');
  container.innerHTML=`<div class="backoff-player"><div class="eyebrow">ANIMACIÓN · ACCESO AL MEDIO</div><h3>A obtiene 3 y C obtiene 5, paso a paso.</h3><p class="backoff-intro">Observa los contadores y los envíos al AP. Reproduce el ejemplo completo o avanza a tu ritmo. La animación usa tiempo didáctico: las pausas y transmisiones no están a escala.</p><div class="backoff-controls"><button type="button" id="backoff-play" class="primary" aria-controls="backoff-stage">▶ Reproducir</button><button type="button" id="backoff-prev" aria-controls="backoff-stage">← Anterior</button><button type="button" id="backoff-next" aria-controls="backoff-stage">Paso siguiente →</button><button type="button" id="backoff-reset">Reiniciar</button></div><label class="backoff-speed">Velocidad <select id="backoff-speed"><option value="4500">Pausada · 4,5 s/paso</option><option value="2000" selected>Normal · 2 s/paso</option><option value="1000">Rápida · 1 s/paso</option></select></label><div id="backoff-stage" class="backoff-stage"></div><div class="backoff-progress" id="backoff-progress" role="progressbar" aria-label="Avance del ejemplo" aria-valuemin="1" aria-valuemax="13"><span id="backoff-progress-fill"></span></div></div>`;
  let current=0, playing=false, timer=null, rendered=-1;
  const stage=document.getElementById('backoff-stage');
  const play=document.getElementById('backoff-play');
  const previous=document.getElementById('backoff-prev');
  const next=document.getElementById('backoff-next');
  function stop(){playing=false;if(timer!==null)clearTimeout(timer);timer=null;}
  function draw(){
    const s=backoffSteps[current];
    container.setAttribute('data-playing',String(playing));
    const paths={a:'M100 208 L280 88',c:'M460 208 L280 88','ack-a':'M280 88 L100 208','ack-c':'M280 88 L460 208'};
    const activeA=s.send==='a'||s.send==='ack-a',activeC=s.send==='c'||s.send==='ack-c';
    if(rendered!==current){
    stage.innerHTML=`<div class="backoff-visual"><svg viewBox="0 0 560 285" role="img" aria-label="${s.phase}: contador A ${s.a}, contador C ${s.c}${s.frozen?', contador de C congelado':''}"><defs><marker id="backoff-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker></defs><path class="backoff-link" d="M100 208L280 88L460 208"/>${s.send?`<path class="backoff-transfer ${s.kind==='ACK'?'ack-transfer':''}" d="${paths[s.send]}" marker-end="url(#backoff-arrow)"/><circle class="backoff-packet ${s.kind==='ACK'?'ack-packet':''}" r="9" style="offset-path:path('${paths[s.send]}')"/><text class="backoff-packet-label" x="${activeA?155:405}" y="130">${s.kind}</text>`:''}<g transform="translate(280 60)"><rect class="backoff-ap" x="-38" y="-20" width="76" height="40" rx="12"/><path class="backoff-icon" d="M-24-20V-33M24-20V-33"/><text class="backoff-node-label" y="6">AP</text><text class="backoff-note" y="50">Punto de acceso</text></g>${[[100,'A',activeA],[460,'C',activeC]].map(([x,label,active])=>`<g transform="translate(${x} 220)" class="${active?'backoff-active':''}"><circle class="backoff-station" r="32"/><text class="backoff-node-label" y="6">${label}</text><text class="backoff-note" y="58">Estación ${label}</text></g>`).join('')}</svg><div class="backoff-counters"><div class="backoff-counter"><span>CONTADOR A</span><strong>${s.a}</strong><small>${s.a==='✓'?'Intercambio terminado':s.send==='a'?'Transmite':s.send==='ack-a'?'Recibe ACK':'Ranuras pendientes'}</small></div><div class="backoff-counter ${s.frozen?'is-frozen':''}"><span>CONTADOR C</span><strong>${s.c}</strong><small>${s.frozen?'Ⅱ Congelado':s.c==='✓'?'Intercambio terminado':s.send==='c'?'Transmite':s.send==='ack-c'?'Recibe ACK':'Ranuras pendientes'}</small></div></div></div><div class="backoff-explanation" aria-live="polite" aria-atomic="true"><span class="eyebrow">PASO ${current+1} DE ${backoffSteps.length}</span><div class="backoff-phase">${s.phase}</div><h4>${s.title}</h4><p>${s.text}</p><div class="backoff-legend"><span>↗ DATOS: estación → AP</span><span>↙ ACK: AP → estación</span></div></div>`;
    rendered=current;
    }
    play.textContent=playing?'Ⅱ Pausar':current===backoffSteps.length-1?'↻ Reproducir de nuevo':'▶ Reproducir';
    play.setAttribute('aria-pressed',String(playing));
    previous.disabled=current===0;next.disabled=current===backoffSteps.length-1;
    document.getElementById('backoff-progress').setAttribute('aria-valuenow',String(current+1));
    document.getElementById('backoff-progress-fill').style.width=`${(current+1)/backoffSteps.length*100}%`;
  }
  function schedule(){timer=setTimeout(()=>{timer=null;if(!playing)return;current++;if(current===backoffSteps.length-1)stop();draw();if(playing)schedule();},Number(document.getElementById('backoff-speed').value)||2000);}
  play.onclick=()=>{if(playing)stop();else{if(current===backoffSteps.length-1)current=0;if(current===0)current=1;playing=true;schedule();}draw();};
  document.getElementById('backoff-speed').onchange=()=>{if(playing){clearTimeout(timer);schedule();}};
  previous.onclick=()=>{stop();current=Math.max(0,current-1);draw();};
  next.onclick=()=>{stop();current=Math.min(backoffSteps.length-1,current+1);draw();};
  document.getElementById('backoff-reset').onclick=()=>{stop();current=0;draw();};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();draw();}});
  draw();
}
initializeBackoffAnimation();
