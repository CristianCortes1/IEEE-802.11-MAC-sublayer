const rtsSteps = [
  {phase:'Nodo oculto',title:'A y C no se oyen; el AP oye a ambas.',text:'A y C tienen datos para el AP. Cada una puede detectar al AP, pero no la transmisión de la otra. Las líneas representan quién puede comunicarse, no distancias exactas.',c:'No detecta a A',nav:0},
  {phase:'El riesgo, sin RTS/CTS',title:'Dos decisiones locales pueden acabar en una colisión.',text:'Esta escena ilustra el problema: A transmite y C también cree libre el canal porque no oye a A. Sus señales llegan al AP al mismo tiempo y pueden impedir la recepción. Desde el siguiente paso veremos un intercambio correcto con RTS/CTS.',send:'collision',c:'Puede interferir',nav:0},
  {phase:'Preparar el intercambio',title:'RTS también necesita obtener acceso.',text:'Para el ejemplo correcto, A primero escucha el medio y aplica DIFS y el backoff que correspondan. Supondremos que gana el acceso y que todas las tramas siguientes llegan correctamente. RTS no da permiso para saltarse la contención.',c:'También puede competir',nav:0},
  {phase:'A → RTS → AP',title:'A solicita transmitir.',text:'RTS significa Request to Send. A envía esta trama de control al AP y anuncia la duración que falta para completar el intercambio. C no oye a A: todavía no ha aprendido esta reserva. El RTS también podría colisionar; aquí suponemos que se recibe bien.',send:'rts',c:'No oye RTS',nav:0},
  {phase:'SIFS antes de CTS',title:'El AP prepara una respuesta inmediata.',text:'El AP espera SIFS antes de responder. Esta pausa corta forma parte del intercambio. C aún no conoce la reserva de A: el CTS del siguiente paso es la pieza que le permitirá enterarse.',c:'Aún sin reserva aprendida',nav:0},
  {phase:'AP → CTS → A · C lo oye',title:'El receptor informa al nodo oculto.',text:'CTS significa Clear to Send. El AP lo dirige a A. C también lo recibe porque sí oye al AP y utiliza su información de duración para establecer NAV. No es una autorización para C: le informa de que debe esperar.',send:'cts',c:'Oye CTS y establece NAV',nav:272},
  {phase:'SIFS antes de DATOS',title:'C respeta la reserva durante el silencio.',text:'A espera SIFS antes de enviar datos. C no aprovecha esta pausa para transmitir: su NAV sigue activo. En los tiempos ilustrativos, pasa de 272 a 256 microsegundos tras este SIFS de 16.',c:'Espera por NAV',nav:256},
  {phase:'A → DATOS → AP',title:'A transmite; C mantiene la espera.',text:'A envía sus datos al AP. C no oye esta transmisión, pero recuerda la reserva que aprendió del CTS. Tras los 200 microsegundos de datos del ejemplo, todavía quedan 56 para SIFS y ACK.',send:'data',c:'No oye a A, pero espera',nav:56},
  {phase:'SIFS antes de ACK',title:'Todavía falta la confirmación.',text:'Si los datos llegaron correctamente, el AP espera SIFS antes del ACK. Durante ese intervalo C sigue esperando. Al terminar este SIFS ilustrativo quedan 40 microsegundos de reserva.',c:'Sigue esperando',nav:40},
  {phase:'AP → ACK → A',title:'El AP confirma la recepción de los datos.',text:'ACK confirma a A que el AP recibió correctamente la trama correspondiente. En el ejemplo tarda 40 microsegundos: la reserva se consume durante esa respuesta y llega a cero al terminar. La flecha indica el destinatario del ACK.',send:'ack',c:'Espera hasta terminar ACK',nav:0},
  {phase:'Fin de la reserva',title:'C vuelve a competir, no recibe un turno fijo.',text:'Terminó el intercambio y expiró NAV. Si C tiene datos pendientes, debe seguir las reglas normales de acceso: escucha, intervalo libre y el backoff que corresponda. RTS/CTS redujo el riesgo del nodo oculto; no garantiza que desaparezcan todas las colisiones.',c:'Vuelve a competir',nav:0}
];

function initializeRtsAnimation(){
  const container=document.getElementById('hidden-lab');
  container.innerHTML=`<div class="backoff-player rts-player"><div class="eyebrow">ANIMACIÓN · RTS / CTS / NAV</div><h3>El nodo oculto se entera al oír al AP.</h3><p class="backoff-intro">Explora primero el riesgo y después el intercambio correcto. El indicador viaja en el sentido de cada trama; C muestra si conoce la reserva. Las etapas y los movimientos usan tiempo didáctico.</p><div class="backoff-controls"><button type="button" id="rts-play" class="primary" aria-controls="rts-stage">▶ Reproducir</button><button type="button" id="rts-prev">← Anterior</button><button type="button" id="rts-next">Paso siguiente →</button><button type="button" id="rts-reset">Reiniciar</button></div><label class="backoff-speed">Velocidad <select id="rts-speed"><option value="4500">Pausada · 4,5 s/paso</option><option value="2500" selected>Normal · 2,5 s/paso</option><option value="1200">Rápida · 1,2 s/paso</option></select></label><div id="rts-stage"></div><div class="backoff-progress" id="rts-progress" role="progressbar" aria-label="Avance de RTS/CTS" aria-valuemin="1" aria-valuemax="11"><span id="rts-progress-fill"></span></div></div>`;
  let current=0,playing=false,timer=null,rendered=-1;
  const play=document.getElementById('rts-play');
  function stop(){playing=false;if(timer!==null)clearTimeout(timer);timer=null;}
  function draw(){
    container.setAttribute('data-playing',String(playing));
    const s=rtsSteps[current];
    if(rendered!==current){
      const arrow=(path,label,x,kind='')=>`<path class="backoff-transfer ${kind}" d="${path}" marker-end="url(#rts-arrow)"/><circle r="9" class="backoff-packet ${kind} ${kind==='ack-transfer'?'ack-packet':''}" style="offset-path:path('${path}')"/><text class="backoff-packet-label" x="${x}" y="124">${label}</text>`;
      let exchange='';
      if(s.send==='collision')exchange=arrow('M112 160L266 160','DATOS',190,'rts-danger')+arrow('M488 160L334 160','DATOS',410,'rts-danger');
      if(s.send==='rts')exchange=arrow('M112 160L266 160','RTS',190);
      if(s.send==='cts')exchange=arrow('M266 160L112 160','CTS → A',190)+arrow('M334 160L488 160','C oye CTS',410,'rts-overheard');
      if(s.send==='data')exchange=arrow('M112 160L266 160','DATOS',190);
      if(s.send==='ack')exchange=arrow('M266 160L112 160','ACK',190,'ack-transfer');
      const node=(x,label,description)=>`<g transform="translate(${x} 160)"><${label==='AP'?'rect x="-34" y="-26" width="68" height="52" rx="12"':'circle r="32"'} class="backoff-station"/><text class="backoff-node-label" y="6">${label}</text><text class="backoff-note" y="60">${description}</text></g>`;
      document.getElementById('rts-stage').innerHTML=`<div class="backoff-stage rts-stage"><div class="backoff-visual"><svg viewBox="0 0 600 305" role="img" aria-label="${s.phase}. C: ${s.c}. NAV al finalizar esta etapa: ${s.nav} microsegundos."><defs><marker id="rts-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs><path class="backoff-link" d="M112 160H488"/>${exchange}${node(80,'A','Emisor')}${node(300,'AP','Receptor')}${node(520,'C','Nodo oculto')}<path class="hidden-relation" d="M80 245Q300 290 520 245"/><text class="backoff-note" x="300" y="300">A y C no se detectan entre sí</text>${s.send==='collision'?'<text class="collision-mark" x="300" y="92">✕ Posible colisión</text>':''}</svg><div class="rts-nav"><div><strong>C · ${s.c}</strong><span>NAV al terminar la etapa: <b>${s.nav} µs</b></span></div><div class="rts-nav-track"><span style="width:${s.nav/272*100}%"></span></div><small>Valores ilustrativos: SIFS 16 µs · DATOS 200 µs · ACK 40 µs. El NAV no depende de oír a A.</small></div></div><div class="backoff-explanation" aria-live="polite" aria-atomic="true"><span class="eyebrow">PASO ${current+1} DE ${rtsSteps.length}</span><div class="backoff-phase">${s.phase}</div><h4>${s.title}</h4><p>${s.text}</p><div class="backoff-legend"><span>Flecha con punta: dirección de la trama</span><span>CTS hacia C: escucha de una trama dirigida a A</span></div></div></div><div class="rts-sequence" aria-label="Secuencia del intercambio">${[['RTS',3],['SIFS',4],['CTS',5],['SIFS',6],['DATOS',7],['SIFS',8],['ACK',9]].map(([name,step])=>`<span class="${current===step?'sequence-current':current>step?'sequence-done':''}" ${current===step?'aria-current="step"':''}>${name}<small>${name==='SIFS'?'pausa':name==='CTS'||name==='ACK'?'AP → A':'A → AP'}</small></span>`).join('')}</div>`;
      rendered=current;
    }
    play.textContent=playing?'Ⅱ Pausar':current===rtsSteps.length-1?'↻ Reproducir de nuevo':'▶ Reproducir';
    play.setAttribute('aria-pressed',String(playing));
    document.getElementById('rts-prev').disabled=current===0;
    document.getElementById('rts-next').disabled=current===rtsSteps.length-1;
    document.getElementById('rts-progress').setAttribute('aria-valuenow',String(current+1));
    document.getElementById('rts-progress-fill').style.width=`${(current+1)/rtsSteps.length*100}%`;
  }
  function schedule(){timer=setTimeout(()=>{timer=null;if(!playing)return;current++;if(current===rtsSteps.length-1)stop();draw();if(playing)schedule();},Number(document.getElementById('rts-speed').value)||2500);}
  play.onclick=()=>{if(playing)stop();else{if(current===rtsSteps.length-1)current=0;playing=true;schedule();}draw();};
  document.getElementById('rts-next').onclick=()=>{stop();current=Math.min(rtsSteps.length-1,current+1);draw();};
  document.getElementById('rts-prev').onclick=()=>{stop();current=Math.max(0,current-1);draw();};
  document.getElementById('rts-reset').onclick=()=>{stop();current=0;draw();};
  document.getElementById('rts-speed').onchange=()=>{if(playing){clearTimeout(timer);schedule();}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();draw();}});
  draw();
}
initializeRtsAnimation();
