// The lesson follows the basic Open System MAC procedure, not every possible
// network configuration. Each step stores an independent end-of-step snapshot.
const authenticationGlossary = {
  'autenticación 802.11':['Procedimiento MAC por el que una estación y un AP establecen el estado de autenticación previo a la asociación. En esta guía se estudia su método básico Open System; ese intercambio no comprueba una contraseña ni demuestra por sí solo la identidad de una persona.'],
  'autenticación abierta':['Open System: método básico de autenticación 802.11 formado por una solicitud y una respuesta de administración. La respuesta indica aceptación o rechazo. No verifica una contraseña dentro de ese intercambio y todavía falta asociarse.'],
  'Open System':['Nombre en inglés del método de autenticación abierta de 802.11. Su procedimiento básico tiene dos mensajes de administración: una solicitud de la estación y una respuesta del AP.'],
  'descubrimiento':['Etapa en la que una estación obtiene información sobre las redes y puntos de acceso que puede escuchar. Descubrir un AP no significa haberse autenticado ni asociado a él.'],
  'escaneo pasivo':['Búsqueda de redes escuchando los anuncios beacon de los puntos de acceso, sin enviar una solicitud de búsqueda.'],
  'escaneo activo':['Búsqueda de redes mediante solicitudes Probe Request y respuestas Probe Response. Es una alternativa a limitarse a escuchar beacons.'],
  'Probe Request':['Solicitud de sondeo: trama de administración que una estación envía para obtener información sobre redes inalámbricas cercanas.'],
  'Probe Response':['Respuesta de sondeo: trama de administración con la que un AP responde a una búsqueda compatible y comunica información de su BSS.'],
  'Authentication Request':['Solicitud de autenticación. En Open System la estación la dirige al AP elegido y marca el primer mensaje del procedimiento de autenticación.'],
  'Authentication Response':['Respuesta de autenticación que el AP dirige a la estación. Indica el resultado del procedimiento; recibir un ACK de la solicitud no sustituye a esta respuesta.'],
  'Association Request':['Solicitud de asociación. La estación autenticada pide incorporarse al BSS del AP e informa de la red y las capacidades de comunicación que propone utilizar.'],
  'Association Response':['Respuesta de asociación. El AP indica aceptación o rechazo; una aceptación incluye un identificador de asociación, AID.'],
  'AID':['Association Identifier: identificador numérico que el AP asigna a una asociación aceptada. Distingue esa asociación dentro del BSS; no sustituye al SSID, al BSSID ni a la dirección MAC de la estación.'],
  'código de estado':['Campo de una respuesta de administración que informa del resultado del procedimiento. En las respuestas de autenticación y asociación estudiadas, 0 indica éxito y un valor distinto de 0 informa de un rechazo o fallo.'],
  'capacidad de comunicación':['Característica de funcionamiento que un equipo admite y comunica a otro, por ejemplo las velocidades de transmisión que puede utilizar.'],
  'número de transacción':['Número que identifica el mensaje dentro de un procedimiento. Open System utiliza 1 para la solicitud y 2 para la respuesta. Es distinto del número de secuencia general de la cabecera MAC.'],
  'desasociación':['Procedimiento que termina la asociación con un AP. En el modelo básico de estados, la estación deja de estar asociada y puede conservar el estado de autenticación.'],
  'desautenticación':['Procedimiento que termina el estado de autenticación 802.11. Si había una asociación con ese AP, también termina.']
};

function authenticationLesson(t) {
  return `
    <div id="autenticacion" class="auth-introduction">
      <p class="intro">Ves «Aula» en la lista de redes y pulsas conectar. Entre descubrir ese nombre y poder intercambiar datos hay varios pasos. Vamos a separar lo que ocurre en cada uno, quién envía cada mensaje y qué sabe realmente tu portátil.</p>
      <div class="callout"><strong>Todo este recorrido pertenece a la ${t('capa 2')}.</strong> Los anuncios, la ${t('autenticación 802.11')} y la ${t('asociación')} usan tramas de ${t('Management')} o administración. Sus ${t('ACK')} son tramas de ${t('Control')}. La ${t('capa 1')} transporta las señales de radio con las que viajan estas tramas.</div>
      <p>El ejemplo utiliza ${t('Open System')}, también llamado ${t('autenticación abierta')}. <strong>Ese intercambio no comprueba la contraseña del Wi-Fi.</strong> Su nombre no demuestra que toda la red esté configurada sin contraseña: pueden existir comprobaciones adicionales. Aquí seguimos únicamente el procedimiento MAC básico para entenderlo bien.</p>
      <p><a class="back" href="#auth-animation">Ir directamente al ejemplo animado ↓</a></p>
    </div>

    <h3>1. Tres etapas que no significan lo mismo</h3>
    <p>Una ${t('estación')} es el equipo con Wi-Fi, que también se abrevia STA. Llamaremos <strong>A</strong> al portátil. El ${t('AP')} es el punto de acceso y anuncia el ${t('SSID')} «Aula». El SSID es el nombre de la red. El ${t('BSSID')} identifica el ${t('BSS')} concreto, es decir, el conjunto atendido por ese AP en este ejemplo.</p>
    <ol class="auth-state-overview" aria-label="Estados básicos de una estación respecto a un AP">
      <li><span>ESTADO 1</span><strong>Sin autenticar y sin asociar</strong><p>Puede descubrir la red e iniciar los procedimientos de administración.</p></li>
      <li><span>ESTADO 2</span><strong>Autenticada y sin asociar</strong><p>El AP aceptó la autenticación básica. A todavía debe pedir la asociación.</p></li>
      <li><span>ESTADO 3</span><strong>Autenticada y asociada</strong><p>El AP aceptó su incorporación al BSS y le asignó un AID.</p></li>
    </ol>
    <p>Estos estados describen la relación <strong>entre A y un AP concreto</strong>. Escuchar un beacon no cambia por sí solo al estado 2 o 3. Cada cambio depende del procedimiento correspondiente y de su resultado.</p>

    <h3>2. Descubrimiento: ¿cómo sabe A que existe el AP?</h3>
    <p>El ${t('descubrimiento')} permite conocer las redes cercanas. En el ${t('escaneo pasivo')}, A escucha un ${t('beacon')}: un anuncio de administración que el AP transmite periódicamente. El anuncio lleva información del BSS, como su nombre, parámetros para sincronizarse y características de comunicación. <strong>El AP puede anunciarse aunque todavía no haya estaciones asociadas.</strong></p>
    <p>«Periódicamente» no significa emitir sin parar. Entre anuncios puede haber datos, otras tramas o silencio. La ocupación del ${t('canal')} puede retrasar el envío de un anuncio. Un beacon ordinario es ${t('broadcast')}, dirigido a todos: cada portátil no le contesta con un ACK individual.</p>
    <details class="self-check"><summary>¿Y si el portátil busca activamente en lugar de esperar un beacon?</summary><p>En el ${t('escaneo activo')}, la estación envía una ${t('Probe Request')}, que significa solicitud de sondeo. Un AP que corresponde a la búsqueda puede contestar con ${t('Probe Response')}, una respuesta con información de su red. Escuchar beacons y realizar sondeos son dos formas de obtener información antes de elegir un AP. El ejemplo animado usa la escucha de beacons.</p></details>
    <div class="flow"><span>AP anuncia su BSS</span><i aria-hidden="true">→</i><span>A escucha y conoce «Aula»</span><i aria-hidden="true">→</i><span>A elige un AP compatible</span></div>
    <p>Aún no se ha autenticado ni asociado. Si dos AP anuncian el mismo SSID, A sigue necesitando distinguir con cuál establece la relación; para eso importa el BSSID, no solo el nombre mostrado.</p>

    <h3>3. Autenticación básica: solicitud y respuesta</h3>
    <p>La ${t('autenticación 802.11')} es un procedimiento del enlace. En el método Open System se intercambian <strong>dos mensajes de administración</strong>. La estación pide realizar el procedimiento y el AP indica si lo acepta. El término «autenticación» aquí no implica que se haya comprobado quién es la persona que utiliza el portátil.</p>
    <ol>
      <li><strong>A obtiene acceso al medio y envía ${t('Authentication Request')}.</strong> Es la solicitud de autenticación dirigida al AP elegido.</li>
      <li><strong>El AP devuelve ${t('Authentication Response')} cuando obtiene acceso para enviarla.</strong> Esa respuesta de administración contiene un ${t('código de estado')} que indica el resultado. El valor 0 significa éxito.</li>
    </ol>
    <p>Si A recibe una respuesta de éxito, pasa al <strong>estado 2: autenticada y todavía sin asociar</strong>. Si la respuesta rechaza la solicitud, A no puede dar por completado este paso ni continuar como si el AP la hubiera aceptado.</p>
    <details class="self-check"><summary>¿Qué información distingue esos dos mensajes?</summary><p>Ambos son tramas del subtipo Authentication. Dentro del procedimiento se indica el método, Open System, y un ${t('número de transacción')}: <strong>1 para la solicitud y 2 para la respuesta</strong>. La respuesta informa del resultado. Estos números 1 y 2 identifican los mensajes del procedimiento; no son el ${t('número de secuencia')} general de la cabecera MAC. Las ${t('dirección MAC')} permiten identificar emisor y receptor. No se envía la contraseña como parte de este intercambio básico.</p></details>
    <div class="callout"><strong>¿Por qué se llama autenticación si no comprueba una contraseña?</strong> Es el nombre del procedimiento y del estado definidos en 802.11. Open System es un método muy sencillo para completar ese paso. Su éxito, por sí solo, no demuestra la identidad de una persona ni significa que la estación ya esté asociada.</div>

    <h3>4. Asociación: ahora A pide pertenecer al BSS</h3>
    <p>La ${t('asociación')} establece la pertenencia de A al BSS del AP. Es otro procedimiento, con otra solicitud y otra respuesta. Haber completado la autenticación básica permite llegar a este paso, pero no lo sustituye.</p>
    <ol>
      <li><strong>A envía ${t('Association Request')}.</strong> Solicita incorporarse al BSS e informa del SSID y de su ${t('capacidad de comunicación')}, por ejemplo las velocidades que admite.</li>
      <li><strong>El AP examina la solicitud y envía ${t('Association Response')}.</strong> Si acepta, comunica éxito y asigna un ${t('AID')}, identificador de asociación.</li>
    </ol>
    <p>Supongamos que el AP asigna <code>AID = 7</code>. Ese 7 identifica la asociación de A dentro de ese BSS. <strong>No es una nueva dirección MAC ni el nombre de la red.</strong> Otro BSS puede utilizar el mismo número para otra asociación: no es un identificador mundial.</p>
    <div class="table-wrap"><table><thead><tr><th scope="col">Dato</th><th scope="col">Qué identifica</th><th scope="col">Ejemplo ilustrativo</th></tr></thead><tbody><tr><td>${t('SSID')}</td><td>El nombre anunciado de la red.</td><td>Aula</td></tr><tr><td>${t('BSSID')}</td><td>Este BSS concreto.</td><td><code>02:AA:00:00:00:01</code></td></tr><tr><td>${t('dirección MAC')} de A</td><td>La interfaz de la estación.</td><td><code>02:11:22:33:44:55</code></td></tr><tr><td>${t('AID')}</td><td>La asociación aceptada dentro del BSS.</td><td>7</td></tr></tbody></table></div>
    <p>Con la aceptación, A llega al <strong>estado 3: autenticada y asociada</strong>. En el caso básico estudiado puede continuar con los intercambios de datos. También deberá respetar ${t('CSMA/CA')}: estar asociada no le concede el canal de forma permanente.</p>

    <h3>5. La confusión habitual: ACK no es aceptación</h3>
    <p>Hasta aquí hemos contado los mensajes que resuelven cada procedimiento. Por radio también aparecen confirmaciones MAC. En este ejemplo, cada solicitud y cada respuesta de administración es ${t('unicast')}, dirigida a un receptor, y recibe su propio ACK si llega correctamente.</p>
    <div class="auth-ack-contrast"><div><span>TRAMA DE CONTROL</span><strong>${t('ACK')}: «Recibí tu trama»</strong><p>Confirma la recepción correcta. No comunica el resultado de la autenticación ni asigna un AID.</p></div><div><span>TRAMA DE ADMINISTRACIÓN</span><strong>Response: «Este es el resultado»</strong><p>La respuesta de autenticación o asociación contiene el código de estado que indica aceptación o rechazo.</p></div></div>
    <p>Por ejemplo: A envía una solicitud de asociación; el AP la recibe bien y manda un ACK. Después puede responder rechazando la asociación. <strong>El ACK y el rechazo son compatibles</strong>: el primero confirma que la petición llegó, y el segundo informa de la decisión.</p>
    <p>Los ACK se envían tras ${t('SIFS')}. La respuesta de administración es una trama distinta que necesita obtener acceso al medio. No debes suponer que Authentication Response o Association Response salen automáticamente tras SIFS por ser «respuestas».</p>

    <h3 id="auth-animation">6. Sigue cada trama, incluidos los ACK</h3>
    <p>Observa el estado de A después de cada paso. Prueba primero una conexión correcta y después un rechazo. Puedes avanzar a mano, retroceder o reproducir. Los tiempos de la animación se amplían para poder leerlos; no representan tiempos reales de radio.</p>
    <div id="authentication-player"></div>
    <p>Sin contar el beacon, los dos procedimientos correctos suman <strong>cuatro tramas de administración y cuatro ACK</strong> en este ejemplo. El envío de datos y su ACK aparecen después para mostrar que obtener la asociación y transmitir contenido son intercambios diferentes.</p>

    <h3>7. ¿Qué pasa si algo falla o se termina la relación?</h3>
    <ul>
      <li><strong>No llega el ACK:</strong> el emisor no tiene confirmación de recepción. Una ${t('retransmisión')} puede ser necesaria. No se puede deducir automáticamente que el AP haya rechazado la autenticación o asociación.</li>
      <li><strong>Llega un ACK, pero falta la respuesta de administración:</strong> la solicitud llegó, pero aún no se conoce el resultado. El procedimiento tiene un tiempo máximo de espera o ${t('timeout')}.</li>
      <li><strong>La respuesta rechaza la autenticación:</strong> A sigue sin autenticar y sin asociar a ese AP.</li>
      <li><strong>La respuesta rechaza la asociación:</strong> A puede seguir autenticada, pero no ha completado su incorporación al BSS. No recibe un AID de una asociación aceptada.</li>
      <li><strong>La trama llega dañada:</strong> el receptor comprueba ${t('FCS')}. Si detecta un error, descarta la trama; no obtiene de ella una decisión válida del procedimiento.</li>
    </ul>
    <details class="self-check"><summary>¿Desasociación y desautenticación también son diferentes?</summary><p>Sí. En el modelo básico, la ${t('desasociación')} termina la pertenencia al BSS, pero puede conservar la autenticación: del estado 3 al 2. La ${t('desautenticación')} termina la autenticación y también cualquier asociación con ese AP: se vuelve al estado 1. Son procedimientos de administración de la capa 2.</p></details>

    <h3>8. Explícalo con tus palabras en la exposición</h3>
    <blockquote class="auth-exposition">El punto de acceso anuncia su red mediante beacons. La estación descubre y elige un AP. Primero intercambia una solicitud y una respuesta de autenticación básica. Después solicita asociarse. Si el AP acepta la asociación, le asigna un AID. Las solicitudes y respuestas tienen sus propios ACK, que confirman la recepción de cada trama. A partir de ahí, en nuestro ejemplo básico, la estación puede competir por el medio para enviar datos.</blockquote>
    <p><a class="back" href="#historia-completa">Ver estos pasos dentro de la historia completa con dos estaciones →</a></p>
    <p class="auth-sources">Fuentes: <a href="https://documentation.meraki.com/Wireless/Design_and_Configure/Architecture_and_Best_Practices/802.11_Association_Process_Explained" target="_blank" rel="noopener">Cisco Meraki · Estados y proceso de asociación</a> y <a href="https://www.cisco.com/c/en/us/support/docs/wireless-mobility/80211/200527-Fundamentals-of-802-11-Wireless-Sniffing.html" target="_blank" rel="noopener">Cisco · Tramas de administración y Open System</a>.</p>
  `;
}

function authenticationSteps(scenario='success') {
  const steps=[];
  let state={discovered:false,authenticated:false,associated:false,aid:null};
  const add=(id,title,text,options={})=>{
    if(options.change)state={...state,...options.change};
    const {change,...rest}=options;
    steps.push({id,title,text,phase:'Esperar',kind:'wait',frame:null,from:null,to:null,...rest,state:{...state}});
  };
  const send=(id,title,text,frame,from,to,options={})=>add(id,title,text,{kind:'management',phase:'Administración',frame,from,to,...options});
  const ack=(id,from,to,text)=>send(id,`${from} confirma la recepción.`,text,'ACK',from,to,{kind:'control',phase:'Control · tras SIFS',fields:[['Confirma','La trama inmediatamente anterior'],['No comunica','Aceptación ni rechazo del procedimiento']]});
  add('beacon','El AP anuncia «Aula».','El AP envía un beacon periódico. Es un anuncio para las estaciones que puedan oírlo y no requiere un ACK individual.',{kind:'management',phase:'Descubrimiento',frame:'beacon',from:'AP',to:'Todos',visual:'Beacon',fields:[['SSID','Aula'],['BSSID','02:AA:00:00:00:01']]});
  add('discover','A descubre y elige este AP.','A escucha el anuncio y conoce el BSS. Saber que existe la red todavía no cambia su estado de autenticación ni de asociación.',{phase:'Descubrimiento',change:{discovered:true}});
  send('auth-request','A pide la autenticación básica.','Cuando obtiene acceso al medio, A envía la solicitud Open System al AP elegido. Todavía no sabe si este la aceptará.','Authentication Request','A','AP',{visual:'Solicitud',fields:[['Método','Open System'],['Transacción','1: solicitud']]});
  ack('auth-request-ack','AP','A','El AP recibió bien la solicitud y devuelve ACK tras SIFS. A sigue sin autenticar y sin asociar: falta la respuesta de administración.');
  add('auth-response-access','El AP prepara una respuesta diferente del ACK.','La respuesta de autenticación también necesita acceso al medio. El ACK anterior no le ha concedido un turno automático para transmitirla.',{phase:'Acceso al medio'});
  const authAccepted=scenario!=='auth-rejected';
  send('auth-response',authAccepted?'El AP acepta la autenticación básica.':'El AP rechaza la autenticación.',authAccepted?'A recibe una respuesta de éxito. Ahora está autenticada, pero sigue sin asociarse al BSS. No se ha comprobado una contraseña en este intercambio.':'La respuesta comunica un código de estado distinto de 0. El ACK anterior solo había confirmado la recepción de la solicitud. A continúa en el estado 1.','Authentication Response','AP','A',{visual:'Respuesta',change:{authenticated:authAccepted},rejected:!authAccepted,fields:[['Transacción','2: respuesta'],['Código de estado',authAccepted?'0: éxito':'Distinto de 0: rechazo']]});
  ack('auth-response-ack','A','AP','A confirma la recepción de la respuesta con ACK tras SIFS. También confirma una respuesta de rechazo si la recibió correctamente.');
  if(!authAccepted){
    add('auth-failed','La asociación no se ha iniciado.','Este intento termina sin autenticación ni asociación. Puedes volver al principio o elegir otro caso para comparar. Un ACK no cambia un rechazo en aceptación.',{phase:'Intento terminado',rejected:true});
    return steps;
  }
  send('association-request','A solicita incorporarse al BSS.','A vuelve a obtener acceso y envía su solicitud de asociación. Informa del SSID y de las características de comunicación que puede utilizar.','Association Request','A','AP',{visual:'Solicitud',fields:[['SSID','Aula'],['Capacidades','Características de comunicación compatibles']]});
  ack('association-request-ack','AP','A','El AP confirma que la solicitud de asociación llegó. Este ACK todavía no asigna AID ni acepta la incorporación de A.');
  add('association-response-access','El AP decide y espera su acceso.','El AP prepara Association Response. La decisión se comunica en esa respuesta de administración, después de obtener acceso para transmitirla.',{phase:'Acceso al medio'});
  const associated=scenario!=='association-rejected';
  send('association-response',associated?'El AP acepta y asigna AID = 7.':'El AP rechaza la asociación.',associated?'A recibe la aceptación y su identificador de asociación dentro de este BSS. Ahora está autenticada y asociada. El 7 no sustituye a su dirección MAC.':'En este caso didáctico, el AP no admite la asociación solicitada. A sigue autenticada, pero no asociada. No se le asigna un AID de una asociación aceptada.','Association Response','AP','A',{visual:'Respuesta',change:{associated,aid:associated?7:null},rejected:!associated,fields:[['Código de estado',associated?'0: éxito':'Distinto de 0: rechazo'],['AID',associated?'7 (valor ilustrativo)':'Sin asignar']]});
  ack('association-response-ack','A','AP','A devuelve ACK tras SIFS para confirmar la recepción de la respuesta. El resultado de asociación ya venía en la trama de administración.');
  if(!associated){
    add('association-failed','Autenticada, pero todavía sin asociación.','La autenticación aceptada no garantiza que después se acepte la asociación. En este intento A permanece en el estado 2.',{phase:'Intento terminado',rejected:true});
    return steps;
  }
  add('associated','La asociación básica está completada.','En este ejemplo básico A ya puede participar en intercambios de datos. El AP sigue enviando beacons periódicos; no se detienen porque A esté asociada.',{phase:'Relación establecida'});
  add('data-access','A tiene contenido y debe obtener acceso.','La asociación no entrega un turno fijo. A aplica CSMA/CA, la escucha y las esperas correspondientes antes de iniciar el envío.',{phase:'Acceso al medio'});
  send('data','Ahora A envía contenido al AP.','La trama de datos es un intercambio posterior. El AP comprueba su FCS. Suponemos que llega correctamente.','Data','A','AP',{kind:'data',phase:'Datos',visual:'DATOS',fields:[['Receptor','AP'],['Comprobación','FCS correcto en este ejemplo']]});
  ack('data-ack','AP','A','Tras SIFS, el AP confirma la recepción de esta trama de datos. Este ACK es distinto de los usados durante la autenticación y la asociación.');
  add('complete','A completó el recorrido básico.','Descubrir, autenticarse, asociarse y enviar datos fueron pasos diferentes. Retrocede hasta una respuesta o cambia a un caso de rechazo para comprobar qué estado conserva A.',{phase:'Recorrido completado'});
  return steps;
}

function initializeAuthenticationLesson() {
  const root=document.getElementById('authentication-player');
  if(!root)return;
  root.innerHTML=`<div class="auth-player"><div class="auth-player-options"><div><label for="auth-scenario">Caso que quieres observar</label><select id="auth-scenario"><option value="success">Conexión básica correcta</option><option value="auth-rejected">Autenticación rechazada</option><option value="association-rejected">Asociación rechazada</option></select></div><div><label for="auth-speed">Ritmo</label><select id="auth-speed"><option value="9000">Para leer · 9 s/paso</option><option value="6000" selected>Normal · 6 s/paso</option><option value="2500">Rápido · 2,5 s/paso</option></select></div></div><div class="auth-controls"><button id="auth-play" type="button" class="primary" aria-controls="auth-stage">▶ Reproducir</button><button id="auth-prev" type="button" aria-controls="auth-stage">← Anterior</button><button id="auth-next" type="button" aria-controls="auth-stage">Siguiente →</button><button id="auth-reset" type="button">Reiniciar</button></div><progress id="auth-progress" aria-label="Progreso del ejemplo de conexión" value="1" max="17"></progress><ol class="auth-states" aria-label="Estado de A respecto al AP"><li id="auth-state-1"><span>ESTADO 1</span><strong>Sin autenticar<br>Sin asociar</strong></li><li id="auth-state-2"><span>ESTADO 2</span><strong>Autenticada<br>Sin asociar</strong></li><li id="auth-state-3"><span>ESTADO 3</span><strong>Autenticada<br>Asociada</strong></li></ol><div id="auth-stage"></div><p class="auth-model-note">El estado mostrado corresponde a A al terminar cada paso. Modelo Open System básico; duraciones ampliadas para leer. Los valores y rechazos son ejemplos didácticos.</p></div>`;
  const play=document.getElementById('auth-play'),scenarioSelect=document.getElementById('auth-scenario'),speed=document.getElementById('auth-speed');
  scenarioSelect.value='success';
  let scenario='success',steps=authenticationSteps(),current=0,playing=false,timer=null,rendered='';
  const stop=()=>{playing=false;if(timer!==null)clearTimeout(timer);timer=null;};
  function diagram(s) {
    const direction=s.from==='A'?'to-ap':'to-station';
    const isFrame=Boolean(s.frame),label=s.visual||(s.frame==='ACK'?'ACK':'');
    return `<svg class="auth-radio" viewBox="0 0 620 220" role="img" aria-labelledby="auth-diagram-title"><title id="auth-diagram-title">${isFrame?`${s.from} envía ${s.frame} a ${s.to}`:'A y el punto de acceso esperan el siguiente intercambio'}</title><path class="auth-radio-link" d="M148 104H472"/>${isFrame?`<path class="auth-radio-route" d="${direction==='to-ap'?'M148 104H472':'M472 104H148'}"/><circle class="auth-packet ${direction}" r="9"/><text class="auth-radio-message" x="310" y="76">${label}</text>`:`<text class="auth-radio-message" x="310" y="76">Sin trama en vuelo</text>`}<g transform="translate(100 104)"><circle class="auth-radio-node" r="45"/><text class="auth-radio-node-label" y="7">A</text></g><g transform="translate(520 104)"><circle class="auth-radio-node" r="45"/><text class="auth-radio-node-label" y="7">AP</text></g><text class="auth-radio-caption" x="100" y="174">Estación</text><text class="auth-radio-caption" x="520" y="174">Punto de acceso</text><text class="auth-radio-caption" x="310" y="207">SSID: Aula · AID de A: ${s.state.aid===null?'sin asignar':s.state.aid}</text></svg>`;
  }
  function draw() {
    const s=steps[current],stateNumber=s.state.associated?3:s.state.authenticated?2:1;
    root.setAttribute('data-playing',String(playing));
    root.setAttribute('data-state',String(stateNumber));
    root.setAttribute('data-scenario',scenario);
    root.setAttribute('data-associated',String(s.state.associated));
    const progress=document.getElementById('auth-progress');
    progress.max=steps.length;progress.value=current+1;
    progress.setAttribute('aria-valuetext',`Paso ${current+1} de ${steps.length}`);
    [1,2,3].forEach(n=>document.getElementById(`auth-state-${n}`).setAttribute('aria-current',n===stateNumber?'step':'false'));
    const key=`${scenario}:${current}`;
    if(rendered!==key){
      const frame=s.frame?`<p class="auth-frame-name">${t(s.frame)}<span>${s.kind==='control'?'Control':s.kind==='data'?'Datos':'Administración'} · ${s.from} a ${s.to}</span></p>`:'<p class="auth-frame-name">Escucha, espera o cambio de estado<span>No se transmite una trama nueva en este paso.</span></p>';
      document.getElementById('auth-stage').innerHTML=`<div class="auth-step-grid"><div class="auth-visual auth-${s.kind}">${diagram(s)}${frame}${s.fields?`<dl class="auth-fields">${s.fields.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`:''}</div><div class="auth-copy ${s.rejected?'auth-rejected':''}" aria-live="polite" aria-atomic="true"><span class="eyebrow">PASO ${current+1} DE ${steps.length} · ${s.phase}</span><h4>${s.title}</h4><p>${s.text}</p><p class="auth-state-result"><strong>Al terminar:</strong> ${stateNumber===3?'A está autenticada y asociada.':stateNumber===2?'A está autenticada, pero sin asociar.':'A está sin autenticar y sin asociar.'}</p></div></div>`;
      rendered=key;
    }
    play.textContent=playing?'Ⅱ Pausar':current===steps.length-1?'↻ Reproducir de nuevo':'▶ Reproducir';
    play.setAttribute('aria-pressed',String(playing));
    document.getElementById('auth-prev').disabled=current===0;
    document.getElementById('auth-next').disabled=current===steps.length-1;
  }
  function schedule() {
    timer=setTimeout(()=>{timer=null;if(!playing)return;current=Math.min(current+1,steps.length-1);if(current===steps.length-1)stop();draw();if(playing)schedule();},Number(speed.value)||6000);
  }
  const seek=n=>{stop();current=Math.max(0,Math.min(n,steps.length-1));draw();};
  play.onclick=()=>{if(playing)stop();else{if(current===steps.length-1)current=0;playing=true;schedule();}draw();};
  document.getElementById('auth-prev').onclick=()=>seek(current-1);
  document.getElementById('auth-next').onclick=()=>seek(current+1);
  document.getElementById('auth-reset').onclick=()=>seek(0);
  scenarioSelect.onchange=()=>{stop();scenario=['success','auth-rejected','association-rejected'].includes(scenarioSelect.value)?scenarioSelect.value:'success';steps=authenticationSteps(scenario);current=0;draw();};
  speed.onchange=()=>{if(playing){clearTimeout(timer);schedule();}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();draw();}});
  document.addEventListener('click',event=>{if(playing&&event.target.closest('a[href^="#def-"]')){stop();draw();}});
  draw();
}
