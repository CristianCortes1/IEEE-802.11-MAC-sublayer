// A scripted teaching example, not a radio simulator. State is derived from
// snapshots so seeking backwards never leaves future associations or NAV behind.
const wifiStory = (() => {
  const chapters = [
    ['anuncio','El AP anuncia'],['conexion-a','Llega A'],['datos-a','A envía datos'],
    ['conexion-c','Llega C'],['oculto','A y C no se oyen'],
    ['reserva-a','RTS/CTS para A'],['reserva-c','Después transmite C']
  ].map(([id,label])=>({id,label,start:0}));
  const steps=[];
  const add=(chapter,id,title,text,options={})=>steps.push({chapter,id,title,text,kind:'wait',terms:[],...options});
  const message=(from,to,label,kind='management',extra={})=>({from,to,label,kind,...extra});
  const management=(chapter,sta,aid)=>{
    const key=sta.toLowerCase();
    add(chapter,`${key}-auth-request`,`${sta} pide iniciar la relación.`,
      'Envía una solicitud de autenticación abierta (Open System). Es el intercambio básico de dos mensajes; aquí no se comprueba una contraseña.',
      {kind:'management',messages:[message(sta,'AP','Authentication Request')],terms:['autenticación abierta'],aView:sta==='A'?'Envía la solicitud.':'Está en silencio.',cView:sta==='C'?'Envía la solicitud.':'Todavía no ha llegado.',apView:`Recibe la solicitud de ${sta}.`});
    add(chapter,`${key}-auth-request-ack`,'El AP confirma que recibió la solicitud.',
      'Tras SIFS, el AP envía un ACK MAC. Este ACK confirma la recepción de una trama; todavía no es la respuesta al procedimiento solicitado.',
      {kind:'control',messages:[message('AP',sta,'ACK MAC','control')],terms:['ACK','SIFS'],apView:'Responde después de SIFS.'});
    add(chapter,`${key}-auth-response`,'El AP acepta el intercambio básico.',
      `Cuando obtiene acceso para enviar su respuesta, el AP transmite Authentication Response a ${sta}. La respuesta de gestión es distinta del ACK anterior. ${sta} aún no está asociada.`,
      {kind:'management',messages:[message('AP',sta,'Authentication Response')],patch:{[`${key}Auth`]:true},terms:['autenticación abierta'],apView:'Envía aceptación.',...(sta==='A'?{aView:'Aceptada, pero aún sin asociación.'}:{cView:'Aceptada, pero aún sin asociación.'})});
    add(chapter,`${key}-auth-response-ack`,`${sta} confirma la respuesta del AP.`,
      `Tras SIFS, ${sta} devuelve ACK. Ahora ha terminado este primer intercambio de gestión. Falta solicitar la asociación.`,
      {kind:'control',messages:[message(sta,'AP','ACK MAC','control')],terms:['ACK','SIFS']});
    add(chapter,`${key}-association-request`,`${sta} pide asociarse al AP.`,
      'Tras seguir las reglas de acceso, envía Association Request: pide pertenecer al conjunto que atiende el AP e informa de sus capacidades de comunicación.',
      {kind:'management',messages:[message(sta,'AP','Association Request')],terms:['asociación','BSS'],apView:'Recibe la petición de asociación.'});
    add(chapter,`${key}-association-request-ack`,'Recibir la petición no es lo mismo que aceptarla.',
      'El AP devuelve ACK tras SIFS para confirmar que la petición llegó correctamente. La aceptación de la asociación viene en otra trama.',
      {kind:'control',messages:[message('AP',sta,'ACK MAC','control')],terms:['ACK','SIFS']});
    add(chapter,`${key}-association-response`,`${sta} ya pertenece al conjunto del AP.`,
      `El AP obtiene acceso y envía Association Response con aceptación y AID=${aid}. AID es un número de la asociación dentro de este AP, no el nombre de la red ni la dirección MAC.`,
      {kind:'management',messages:[message('AP',sta,'Association Response')],patch:{[`${key}Assoc`]:true,[`${key}Aid`]:aid},terms:['asociación','AID'],apView:`Acepta a ${sta} y asigna AID=${aid}.`,...(sta==='A'?{aView:'Recibe la aceptación y su AID.'}:{cView:'Recibe la aceptación y su AID.'})});
    add(chapter,`${key}-association-response-ack`,`${sta} confirma la aceptación.`,
      `${sta} devuelve ACK tras SIFS. Puede participar en los intercambios de datos de este ejemplo, pero estar asociada no le da un turno permanente para transmitir.`,
      {kind:'control',messages:[message(sta,'AP','ACK MAC','control')],terms:['ACK','asociación']});
  };

  add(0,'ap-beacon','El AP anuncia «Aula», aunque nadie esté conectado.',
    'Envía un beacon: una trama de administración que anuncia el nombre de la red y otras características. Lo hace periódicamente, no sin parar. Entre anuncios puede haber datos o silencio.',
    {kind:'management',beacon:true,messages:[message('AP','all','Beacon')],terms:['AP','beacon','SSID'],apView:'Anuncia la red. Un beacon no requiere ACK.'});
  add(1,'a-arrives','Llega la primera estación: STA A.',
    'STA significa estación. El portátil A entra en una zona donde oye al AP y descubre «Aula» escuchando un beacon. Descubrirla no significa estar asociado.',
    {kind:'management',beacon:true,messages:[message('AP','all','Beacon')],patch:{aArrived:true},terms:['estación','beacon'],aView:'Oye el beacon y descubre Aula.',apView:'Anuncia; A todavía no se ha asociado.'});
  management(1,'A',1);
  add(2,'a-access','A tiene datos: primero debe conseguir acceso.',
    'El canal estaba ocupado. A espera DIFS libre y descuenta su backoff. Cuando el contador llega a cero puede iniciar el envío. El AP no le asigna un turno fijo.',
    {patch:{backoffA:'3 → 2 → 1 → 0'},terms:['DIFS','backoff','CSMA/CA'],aView:'Escucha y cuenta ranuras libres.',apView:'Todavía no recibe datos.'});
  add(2,'a-first-data','A transmite una trama de datos al AP.',
    'Ahora viaja el contenido. La trama también lleva direcciones, instrucciones y FCS para comprobar errores. C todavía no ha llegado.',
    {kind:'data',messages:[message('A','AP','DATOS · sec. 6','data')],patch:{backoffA:'0'},terms:['trama','Data','FCS'],aView:'Envía los datos.',apView:'Recibe la trama de A.'});
  add(2,'a-first-fcs','El AP comprueba la trama y prepara la respuesta.',
    'La verificación FCS resulta correcta. Esta escena amplía la comprobación para observarla: no añade un turno nuevo ni una espera extra al procedimiento.',
    {terms:['FCS','CRC'],aView:'Espera la confirmación.',apView:'FCS correcto: prepara ACK.'});
  add(2,'a-first-ack','Tras SIFS, el AP confirma a A.',
    'El ACK dice que la trama correspondiente llegó bien al AP. A termina este intento. El AP seguirá anunciando la red con beacons periódicos cuando pueda enviarlos.',
    {kind:'control',messages:[message('AP','A','ACK','control')],patch:{backoffA:'Sin datos pendientes'},terms:['ACK','SIFS'],aView:'Recibe el ACK: éxito.',apView:'Confirma a A.'});

  add(3,'c-arrives','Llega STA C, al otro lado de un obstáculo.',
    'C oye al AP y descubre el mismo BSS. En esta disposición A no oye a C y C tampoco oye a A; el AP sí puede recibir a ambas. El problema depende de quién puede escuchar a quién.',
    {kind:'management',beacon:true,messages:[message('AP','all','Beacon')],patch:{cArrived:true},terms:['estación','beacon','BSS'],aView:'Oye al AP, pero no a C.',cView:'Oye el beacon, pero no oye a A.',apView:'Su anuncio llega a A y C.'});
  management(3,'C',2);
  add(4,'hidden-access','Las dos tienen otra trama pendiente.',
    'A y C escuchan localmente y preparan su acceso. Estar asociadas al mismo AP no hace que se oigan entre sí. A necesitará enviar su nueva trama, con secuencia 7; C tiene la suya, con secuencia 11.',
    {patch:{backoffA:'Llega primero a 0',backoffC:'Aún contando'},terms:['nodo oculto','backoff'],aView:'Considera libre el canal.',cView:'También lo considera libre.',apView:'Puede recibir a ambas.'});
  add(4,'hidden-a-data','A empieza a enviar. C no la detecta.',
    'A llega a cero y transmite. Como C no oye a A, puede seguir descontando su propia espera. Escuchar el canal desde C no le permite conocer todo lo que está llegando al AP.',
    {kind:'data',messages:[message('A','AP','DATOS · sec. 7','data')],patch:{backoffA:'0',backoffC:'Sigue contando'},terms:['nodo oculto','CCA'],aView:'Transmite hacia el AP.',cView:'No oye a A y sigue contando.',apView:'Empieza a recibir a A.'});
  add(4,'collision','C también transmite: las señales se superponen en el AP.',
    'C llega a cero antes de que termine A. En este ejemplo la superposición impide recibir correctamente las tramas. El AP no puede confirmar una recepción válida. La colisión sucede en el receptor común.',
    {kind:'problem',messages:[message('A','AP','DATOS de A','problem'),message('C','AP','DATOS de C','problem')],patch:{backoffC:'0'},terms:['colisión','FCS'],aView:'No sabe aún que falló.',cView:'Tampoco detecta la colisión directamente.',apView:'Recepción dañada: no envía ACK.'});
  add(4,'timeout','A y C agotan la espera de ACK.',
    'Ninguna recibe confirmación. Cada una considera fallido su intento. Nosotros vimos la colisión; las estaciones solo saben que no llegó ACK, sin poder deducir la causa con certeza.',
    {terms:['timeout','ACK'],aView:'Timeout: no llegó ACK.',cView:'Timeout: no llegó ACK.',apView:'No hubo una trama válida que confirmar.'});

  add(5,'retry-window','Vuelven a intentar con una ventana mayor.',
    'Para los reintentos amplían CW dentro de su límite y eligen nuevos backoffs. Usaremos RTS/CTS para ilustrar cómo ayuda con el nodo oculto. Es opcional: no se activa obligatoriamente por cada colisión.',
    {patch:{backoffA:'Nuevo sorteo',backoffC:'Nuevo sorteo',navA:0,navC:0},terms:['CW','retransmisión','RTS'],aView:'Prepara la retransmisión.',cView:'Prepara su propio reintento.'});
  add(5,'retry-access','En este sorteo, A obtiene acceso primero.',
    'Tras las esperas de acceso, A llega a cero. A C le queda suficiente espera para no transmitir antes del CTS del siguiente intercambio. Es una elección del ejemplo: otros sorteos podrían producir otra colisión.',
    {patch:{backoffA:'0',backoffC:'En curso'},terms:['DIFS','backoff'],aView:'Ya puede enviar RTS.',cView:'Aún tiene espera pendiente.'});
  add(5,'a-rts','A envía RTS. C todavía no conoce la reserva.',
    'RTS solicita iniciar el intercambio. El AP lo recibe; C no oye a A, por lo que aún puede contar ranuras localmente libres. RTS por sí solo no ha resuelto el problema para C.',
    {kind:'control',messages:[message('A','AP','RTS','control')],terms:['RTS','NAV'],aView:'Envía la solicitud.',cView:'No oye RTS; NAV sigue en 0.',apView:'Recibe RTS de A.'});
  add(5,'a-sifs-cts','El AP espera SIFS antes de responder.',
    'La respuesta CTS es inmediata tras esta pausa corta; no es una nueva competencia con backoff. Todavía no le ha llegado a C el anuncio de reserva.',
    {terms:['SIFS','CTS'],aView:'Espera CTS.',cView:'Aún no oyó una reserva.',apView:'Prepara CTS para A.'});
  add(5,'a-cts','El CTS del AP sí llega a C.',
    'CTS está dirigido a A. C lo escucha también y establece su NAV con la duración restante. Eso le indica que espere; no le da permiso para transmitir. C congela el backoff que aún le faltaba.',
    {kind:'control',messages:[message('AP','A','CTS','control'),message('AP','C','Oye CTS','control',{overheard:true})],patch:{navC:272,backoffC:'Congelado'},terms:['CTS','NAV'],aView:'Recibe permiso para continuar.',cView:'Oye CTS y reserva 272 µs.',apView:'Responde a A; C puede oírlo.'});
  add(5,'a-sifs-data','A espera SIFS; C respeta el silencio reservado.',
    'Aunque no se esté emitiendo una trama durante SIFS, C no inicia otra transmisión: su NAV sigue activo. En los valores ilustrativos, pasa de 272 a 256 µs.',
    {patch:{navC:256},terms:['SIFS','NAV'],aView:'Prepara los datos.',cView:'Espera por NAV.',apView:'Espera los datos de A.'});
  add(5,'a-retry-data','A retransmite sus datos; C se mantiene en espera.',
    'C no necesita oír a A: recuerda el CTS. A repite la trama fallida con Retry=1 y la misma secuencia 7. Tras los 200 µs de datos del ejemplo, quedan 56 µs de reserva.',
    {kind:'data',messages:[message('A','AP','DATOS · reintento','data')],patch:{navC:56},terms:['Retry','número de secuencia','NAV'],aView:'Retransmite la trama pendiente.',cView:'No oye los datos, pero sigue esperando.',apView:'Recibe el reintento de A.'});
  add(5,'a-fcs-sifs','FCS correcto: el AP prepara ACK tras SIFS.',
    'La trama de A llegó correctamente. El AP realiza su comprobación y respeta el intervalo SIFS para responder; la escena no representa una espera adicional. Al acabar SIFS quedan 40 µs de NAV.',
    {patch:{navC:40},terms:['FCS','SIFS'],aView:'Espera la confirmación.',cView:'Aún no puede iniciar otro envío.',apView:'Comprobación correcta; responde ACK.'});
  add(5,'a-retry-ack','ACK para A: el intercambio se completa.',
    'El ACK ocupa los últimos 40 µs del ejemplo. C espera mientras se transmite; al terminar, la reserva llega a cero. A recibe confirmación y restablece su ventana inicial.',
    {kind:'control',messages:[message('AP','A','ACK','control')],patch:{navC:0,backoffA:'Entrega completada',backoffC:'Pendiente de reanudar'},terms:['ACK','CWmin'],aView:'Recibe ACK: reintento exitoso.',cView:'Espera hasta el fin del ACK.',apView:'Confirma a A.'});

  add(6,'c-resumes','C puede continuar su espera, no saltársela.',
    'Expiró NAV. C observa DIFS libre y reanuda las ranuras pendientes hasta llegar a cero. Para este tramo A ya no tiene datos nuevos: C consigue acceso sin otra colisión.',
    {patch:{backoffC:'Pendiente → 0'},terms:['DIFS','backoff'],aView:'Sin nuevos datos pendientes.',cView:'Reanuda, llega a cero.',apView:'Disponible para otro intercambio.'});
  add(6,'c-rts','Ahora C envía RTS al AP.',
    'El problema es mutuo: A tampoco oye a C. Esta vez A no aprende la reserva del RTS; la aprenderá de la respuesta del AP.',
    {kind:'control',messages:[message('C','AP','RTS','control')],patch:{backoffC:'0'},terms:['RTS','nodo oculto'],aView:'No oye a C.',cView:'Envía RTS.',apView:'Recibe RTS de C.'});
  add(6,'c-sifs-cts','El AP espera SIFS para responder a C.',
    'C espera su CTS. Aún no se ha anunciado a A la duración restante del intercambio.',
    {terms:['SIFS'],aView:'Todavía no tiene esta reserva.',cView:'Espera CTS.',apView:'Prepara CTS para C.'});
  add(6,'c-cts','El AP dirige CTS a C; A también lo oye.',
    'A interpreta la duración y establece su propio NAV. Ahora se invierten los papeles: A respeta la reserva mientras C envía sus datos.',
    {kind:'control',messages:[message('AP','C','CTS','control'),message('AP','A','Oye CTS','control',{overheard:true})],patch:{navA:272},terms:['CTS','NAV'],aView:'Oye CTS y establece NAV.',cView:'Puede continuar con su intercambio.',apView:'Responde a C.'});
  add(6,'c-sifs-data','SIFS antes de los datos de C.',
    'C espera la pausa corta; A mantiene la reserva virtual. Los valores de tiempo son los mismos de la demostración anterior.',
    {patch:{navA:256},terms:['SIFS','NAV'],aView:'Respeta NAV.',cView:'Prepara sus datos.'});
  add(6,'c-retry-data','C retransmite su trama fallida.',
    'Usa Retry=1 y la misma secuencia 11 de su intento anterior. A no oye esa transmisión, pero su NAV le indica que el intercambio todavía no termina.',
    {kind:'data',messages:[message('C','AP','DATOS · reintento','data')],patch:{navA:56},terms:['Retry','NAV'],aView:'No oye a C; mantiene la espera.',cView:'Envía el contenido pendiente.',apView:'Recibe los datos de C.'});
  add(6,'c-fcs-sifs','El AP comprueba y prepara el ACK para C.',
    'FCS resulta correcto. El AP prepara la respuesta que saldrá tras SIFS. La reserva de A aún cubre la confirmación.',
    {patch:{navA:40},terms:['FCS','SIFS'],aView:'La reserva sigue activa.',cView:'Espera ACK.',apView:'Comprobación correcta.'});
  add(6,'c-retry-ack','El AP confirma a C y termina la reserva.',
    'C recibe ACK y completa su reintento. A espera hasta el final de esa respuesta; entonces su NAV llega a cero. Ambos envíos fallidos se han recuperado en este ejemplo.',
    {kind:'control',messages:[message('AP','C','ACK','control')],patch:{navA:0,backoffC:'Entrega completada'},terms:['ACK','retransmisión'],aView:'NAV expira al terminar el ACK.',cView:'Entrega completada.',apView:'Confirma a C.'});
  add(6,'next-beacon','La red sigue funcionando y el AP vuelve a anunciarla.',
    'A y C siguen asociadas. El AP continúa con sus beacons periódicos cuando puede enviarlos. Cada nuevo envío de datos deberá respetar el acceso al medio; estar asociado no elimina el nodo oculto.',
    {kind:'management',beacon:true,messages:[message('AP','all','Beacon')],terms:['beacon','asociación','CSMA/CA'],aView:'Oye al AP; su envío terminó.',cView:'Oye al AP; su envío terminó.',apView:'Ambas estaciones siguen asociadas.'});

  const initial={aArrived:false,cArrived:false,aAuth:false,cAuth:false,aAssoc:false,cAssoc:false,aAid:null,cAid:null,navA:0,navC:0,backoffA:'—',backoffC:'—'};
  const states=[];
  steps.forEach((step,index)=>{states.push({...(index?states[index-1]:initial),...step.patch});});
  chapters.forEach((chapter,index)=>{chapter.start=steps.findIndex(step=>step.chapter===index);});
  return {chapters,steps,states};
})();

function initializeWifiStory(){
  Object.assign(glossary,{
    'autenticación abierta':['Open System: intercambio básico de una solicitud y una respuesta de administración antes de la asociación. No comprueba una contraseña.'],
    'AID':['Association Identifier: número que el AP asigna a una asociación aceptada. Identifica esa asociación dentro del AP; no sustituye a la dirección MAC.']
  });
  renderTerms();
  const root=document.getElementById('wifi-story');
  const {steps,states,chapters}=wifiStory;
  root.innerHTML=`<div class="story-player"><div class="story-controls"><button id="story-play" class="primary" type="button" aria-controls="story-stage">▶ Reproducir historia</button><button id="story-prev" type="button" aria-controls="story-stage">← Anterior</button><button id="story-next" type="button" aria-controls="story-stage">Siguiente →</button><button id="story-reset" type="button">Reiniciar</button><label>Ritmo<select id="story-speed"><option value="6000">Para leer · 6 s/paso</option><option value="3500" selected>Normal · 3,5 s/paso</option><option value="1600">Rápido · 1,6 s/paso</option></select></label></div><div class="story-chapters" role="group" aria-label="Saltar a un capítulo de la historia">${chapters.map((chapter,i)=>`<button id="story-chapter-${i}" type="button" aria-controls="story-stage"><span>${String(i+1).padStart(2,'0')}</span>${chapter.label}</button>`).join('')}</div><div class="story-scrubber"><label for="story-position">Moverse por la historia</label><input id="story-position" type="range" min="0" max="${steps.length-1}" value="0" aria-controls="story-stage"><output id="story-position-label" for="story-position">Paso 1 de ${steps.length}</output></div><div id="story-stage"></div></div>`;
  let current=0,playing=false,timer=null,rendered=-1;
  const play=document.getElementById('story-play');
  const position=document.getElementById('story-position');
  const stage=document.getElementById('story-stage');
  const kindNames={management:'Administración',control:'Control',data:'Datos',wait:'Espera / observación',problem:'Fallo de recepción'};
  function stationStatus(state,key){
    if(!state[`${key}Arrived`])return 'Aún no ha llegado';
    if(state[`${key}Assoc`])return `Asociada · AID ${state[`${key}Aid`]}`;
    if(state[`${key}Auth`])return 'Intercambio básico aceptado; falta asociación';
    return 'Detecta al AP; aún sin asociación';
  }
  const points={AP:[400,112],A:[135,332],C:[665,332]};
  function svgMessage(message,state){
    if(message.to==='all')return ['A','C'].filter(sta=>state[`${sta.toLowerCase()}Arrived`]).map(sta=>svgMessage({...message,to:sta},state)).join('');
    const from=points[message.from],to=points[message.to];
    const dx=to[0]-from[0],dy=to[1]-from[1],distance=Math.hypot(dx,dy);
    const path=`M${from[0]+dx/distance*40} ${from[1]+dy/distance*40}L${to[0]-dx/distance*40} ${to[1]-dy/distance*40}`;
    return `<path class="story-path story-${message.kind}${message.overheard?' story-overheard':''}" d="${path}" marker-end="url(#story-arrow)"/><circle class="story-dot story-${message.kind}" r="8" style="offset-path:path('${path}')"/><text class="story-message-label" x="${(from[0]+to[0])/2+(message.to==='A'||message.from==='A'?-26:26)}" y="${(from[1]+to[1])/2-14}" text-anchor="middle">${message.overheard?'Oye CTS':message.label.startsWith('Authentication')?'Autenticación':message.label.startsWith('Association')?'Asociación':message.label.split(' · ')[0]}</text>`;
  }
  function diagram(step,state){
    const node=(sta,label)=>{
      const present=sta==='AP'||state[`${sta.toLowerCase()}Arrived`];
      const [x,y]=points[sta];
      return `<g class="story-node ${present?'':'story-absent'}" transform="translate(${x} ${y})">${sta==='AP'?'<rect class="story-device" x="-45" y="-30" width="90" height="60" rx="14"/><path class="story-antenna" d="M-28-30V-48M28-30V-48"/>':'<rect class="story-device" x="-36" y="-27" width="72" height="50" rx="7"/><path class="story-antenna" d="M-45 30H45L36 23H-36Z"/>'}<text class="story-node-letter" y="7">${sta}</text><text class="story-node-caption" y="${sta==='AP'?60:62}">${label}</text>${present&&sta!=='AP'&&state[`${sta.toLowerCase()}Assoc`]?'<circle class="story-associated" cx="40" cy="-28" r="10"/><text class="story-check" x="40" y="-24">✓</text>':''}</g>`;
    };
    return `<svg class="story-map" viewBox="0 0 800 460" role="img" aria-labelledby="story-map-title story-map-desc"><title id="story-map-title">${step.title}</title><desc id="story-map-desc">${step.messages?.map(m=>`${m.from} a ${m.to==='all'?'quienes puedan oírlo':m.to}: ${m.label}${m.overheard?' (escucha de una trama dirigida a otra estación)':''}`).join('. ')||'Ningún envío nuevo en esta etapa'}. A: ${stationStatus(state,'a')}. C: ${stationStatus(state,'c')}.</desc><defs><marker id="story-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker><pattern id="story-wall" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" class="story-wall-line"/></pattern></defs>${step.beacon?'<g class="story-radio"><circle cx="400" cy="112" r="75"/><circle cx="400" cy="112" r="120"/></g>':''}${state.aArrived?'<path class="story-link" d="M170 305L365 140"/>':''}${state.cArrived?'<path class="story-link" d="M435 140L630 305"/>':''}<rect class="story-wall" x="380" y="235" width="40" height="175" rx="3" fill="url(#story-wall)"/><text class="story-wall-label" x="400" y="437">Obstáculo</text>${step.messages?.map(message=>svgMessage(message,state)).join('')||''}${node('AP','Punto de acceso · Aula')}${node('A','STA A')}${node('C','STA C')}${state.cArrived?'<path class="story-hidden-link" d="M190 382H350M450 382H610"/><text class="story-hidden-label" x="400" y="457">A no oye a C · C no oye a A</text>':''}${step.kind==='problem'?'<text class="story-collision" x="400" y="36">✕ RECEPCIÓN DAÑADA</text>':''}</svg>`;
  }
  function stop(){playing=false;if(timer!==null)clearTimeout(timer);timer=null;}
  function draw(){
    const step=steps[current],state=states[current];
    root.setAttribute('data-playing',String(playing));
    if(rendered!==current){
      const associated=Number(state.aAssoc)+Number(state.cAssoc);
      const apStatus=`${associated} ${associated===1?'estación asociada':'estaciones asociadas'}`;
      const recent=steps.slice(0,current+1).flatMap(s=>(s.messages||[]).filter(m=>!m.overheard).map(m=>`${m.from} → ${m.to==='all'?'anuncio':m.to}: ${m.label}`)).slice(-4);
      stage.innerHTML=`<div class="story-grid"><div class="story-visual"><div class="story-frame-badge story-${step.kind}">${kindNames[step.kind]}${step.messages?.length?` · ${step.messages[0].label}`:''}</div>${diagram(step,state)}<div class="story-status-grid"><div><strong>STA A</strong><span>${stationStatus(state,'a')}</span></div><div><strong>AP · Aula</strong><span>${apStatus}</span></div><div><strong>STA C</strong><span>${stationStatus(state,'c')}</span></div></div><div class="story-radio-note">Topología ilustrativa: las líneas indican comunicación posible, no cobertura a escala. El AP sigue anunciando periódicamente; aquí solo se dibujan algunos beacons.</div></div><div class="story-narrative" aria-live="polite" aria-atomic="true"><div class="eyebrow">PASO ${current+1} DE ${steps.length}</div><h3>${step.title}</h3><p>${step.text}</p><div class="story-witnesses"><div><strong>A percibe</strong><span>${step.aView||(state.aArrived?'Oye al AP; no detecta a C.':'Todavía no está presente.')}</span></div><div><strong>El AP</strong><span>${step.apView||'Mantiene la relación con sus estaciones.'}</span></div><div><strong>C percibe</strong><span>${step.cView||(state.cArrived?'Oye al AP; no detecta a A.':'Todavía no está presente.')}</span></div></div><div class="story-terms">Términos de este paso: ${step.terms.length?step.terms.map(term=>t(term)).join(' · '):t('trama')}</div></div></div>${step.chapter>=5?`<div class="story-reservations"><div><strong>NAV de A</strong><span>${state.navA} µs</span><div class="story-nav-track"><i style="width:${state.navA/272*100}%"></i></div><small>Backoff: ${state.backoffA}</small></div><div><strong>NAV de C</strong><span>${state.navC} µs</span><div class="story-nav-track"><i style="width:${state.navC/272*100}%"></i></div><small>Backoff: ${state.backoffC}</small></div><p>NAV mostrado <strong>al terminar la etapa</strong>. Valores ilustrativos: SIFS 16 µs, DATOS 200 µs, ACK 40 µs. El tiempo de reproducción no está a escala.</p></div>`:''}<details class="story-log"><summary>Últimas tramas del relato</summary><ol>${recent.map(line=>`<li>${line}</li>`).join('')}</ol><p>Las flechas de «Oye CTS» muestran una escucha adicional: el CTS sigue dirigido a la estación que envió RTS.</p></details>`;
      rendered=current;
    }
    play.textContent=playing?'Ⅱ Pausar':current===steps.length-1?'↻ Reproducir de nuevo':'▶ Reproducir historia';
    play.setAttribute('aria-pressed',String(playing));
    document.getElementById('story-prev').disabled=current===0;
    document.getElementById('story-next').disabled=current===steps.length-1;
    position.value=String(current);
    position.setAttribute('aria-valuetext',`Paso ${current+1}: ${step.title}`);
    document.getElementById('story-position-label').textContent=`Paso ${current+1} de ${steps.length}`;
    chapters.forEach((chapter,index)=>document.getElementById(`story-chapter-${index}`).setAttribute('aria-pressed',String(step.chapter===index)));
  }
  function schedule(){timer=setTimeout(()=>{timer=null;if(!playing)return;current++;if(current===steps.length-1)stop();draw();if(playing)schedule();},Number(document.getElementById('story-speed').value)||3500);}
  function seek(index){stop();current=Math.max(0,Math.min(steps.length-1,index));draw();}
  play.onclick=()=>{if(playing)stop();else{if(current===steps.length-1)current=0;playing=true;schedule();}draw();};
  document.getElementById('story-prev').onclick=()=>seek(current-1);
  document.getElementById('story-next').onclick=()=>seek(current+1);
  document.getElementById('story-reset').onclick=()=>seek(0);
  position.oninput=()=>seek(Number(position.value));
  chapters.forEach((chapter,index)=>{document.getElementById(`story-chapter-${index}`).onclick=()=>seek(chapter.start);});
  document.getElementById('story-speed').onchange=()=>{if(playing){clearTimeout(timer);schedule();}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();draw();}});
  document.addEventListener('click',event=>{if(playing&&event.target.closest('a[href^="#def-"]')){stop();draw();}});
  draw();
}
initializeWifiStory();
