const glossary={
'IEEE':['Instituto de Ingenieros Eléctricos y Electrónicos: organización que desarrolla estándares técnicos, entre otras actividades.'],
'estándar':['Documento de reglas compartidas que permite que equipos de distintos fabricantes se comuniquen.'],
'IEEE 802.11':['Familia de estándares que define el acceso al medio (MAC) y la transmisión física (PHY) de redes locales inalámbricas.'],
'Wi-Fi':['Nombre de uso común para redes inalámbricas basadas en IEEE 802.11; Wi-Fi también identifica un programa de certificación de interoperabilidad.'],
'red':['Conjunto de dispositivos capaces de intercambiar información mediante conexiones y reglas comunes.'],
'LAN':['Local Area Network: red local, como la de una casa, aula u oficina.'],
'WLAN':['Wireless LAN: red local que utiliza enlaces inalámbricos.'],
'OSI':['Modelo de referencia que organiza las funciones de comunicación en capas. Esta guía estudia la capa de enlace de datos.'],
'capa 2':['Capa de enlace de datos del modelo OSI: organiza el intercambio de tramas en un enlace y el acceso al medio.'],
'capa 1':['Capa física: convierte información en señales y define cómo se transmiten y reciben.'],
'protocolo':['Conjunto de reglas que establece cómo intercambiar e interpretar mensajes.'],
'subcapa':['División funcional dentro de una capa de un modelo de comunicación.'],
'MAC':['Medium Access Control: subcapa que organiza el acceso al medio y gestiona tramas y direcciones del enlace. También se usa la expresión dirección MAC para el identificador de una interfaz.'],
'LLC':['Logical Link Control: subcapa de enlace definida en IEEE 802.2 que ofrece una interfaz lógica hacia protocolos superiores.'],
'PHY':['Physical Layer: funciones de la capa física que transmiten y reciben señales.'],
'medio':['Recurso por el que viajan las señales: por ejemplo, un cable o el espacio radioeléctrico.'],
'canal':['Recurso de comunicación asociado a un rango de frecuencias de radio; los equipos que comparten su uso deben coordinarse.'],
'frecuencia':['Cantidad de oscilaciones de una señal por segundo; se mide en hercios.'],
'estación':['Dispositivo con una interfaz MAC y PHY compatible con IEEE 802.11; también se abrevia STA.'],
'AP':['Access Point o punto de acceso: estación que conecta dispositivos inalámbricos con un sistema de distribución. Actúa como punto de unión de las estaciones de un BSS con el sistema de distribución.'],
'BSS':['Basic Service Set: conjunto básico de estaciones coordinadas; en infraestructura se organiza alrededor de un AP.'],
'BSSID':['Identificador de un BSS, de 48 bits; en infraestructura suele corresponder a la dirección MAC de la interfaz del AP que presta ese servicio.'],
'SSID':['Nombre de la red inalámbrica anunciado al usuario; no es lo mismo que BSSID.'],
'sistema de distribución':['Mecanismo que interconecta puntos de acceso y otras redes; puede utilizar Ethernet.'],
'dirección MAC':['Identificador de enlace de 48 bits usado por interfaces IEEE 802. Se suele escribir en seis grupos hexadecimales. Cada pareja de cifras hexadecimales representa un byte.'],
'bit':['Unidad binaria de información que toma el valor 0 o 1.'],
'byte':['Grupo de ocho bits; también llamado octeto.'],
'hexadecimal':['Sistema numérico de base 16 que usa los símbolos 0–9 y A–F.'],
'Ethernet':['Familia IEEE 802.3 para redes locales, habitualmente cableadas.'],
'CSMA/CA':['Carrier Sense Multiple Access with Collision Avoidance: acceso múltiple con escucha del medio y mecanismos para reducir la probabilidad de colisión.'],
'CSMA/CD':['Carrier Sense Multiple Access with Collision Detection: acceso con detección de colisiones usado en Ethernet compartido de funcionamiento semidúplex.'],
'colisión':['Superposición de transmisiones que impide recibir correctamente una o más tramas.'],
'interferencia':['Señal no deseada que dificulta la recepción; puede venir de otras redes o de dispositivos que no usan Wi-Fi.'],
'DCF':['Distributed Coordination Function: mecanismo distribuido clásico de acceso al medio de 802.11 basado en CSMA/CA.'],
'CCA':['Clear Channel Assessment: evaluación física que determina si el canal está ocupado según las reglas y señales detectadas por PHY.'],
'DIFS':['DCF Interframe Space: intervalo de canal libre antes de competir por el medio en el acceso DCF. DIFS = SIFS + dos tiempos de ranura.'],
'SIFS':['Short Interframe Space: intervalo corto antes de respuestas inmediatas, como CTS o ACK. Es menor que DIFS y permite completar un intercambio antes de una nueva competencia.'],
'ranura':['Unidad temporal del conteo de backoff; su duración depende de la capa física. También llamada slot.'],
'backoff':['Espera aleatoria expresada en ranuras. El contador disminuye con el canal libre y se congela cuando se ocupa.'],
'ventana de contención':['Rango del que se elige el contador de backoff; con parámetro CW se elige un entero entre 0 y CW, inclusive.'],
'CW':['Contention Window: parámetro de la ventana de contención. Tras un fallo crece, hasta CWmax; tras un éxito se restablece a CWmin.'],
'RTS':['Request to Send: trama de control con la que un emisor solicita iniciar un intercambio protegido.'],
'CTS':['Clear to Send: trama de control que responde a RTS y anuncia la reserva temporal a estaciones que puedan oírla.'],
'NAV':['Network Allocation Vector: temporizador local que representa cuánto tiempo se considera reservado el medio a partir de información de duración recibida. Es escucha virtual.'],
'nodo oculto':['Estación que no detecta a otra transmisora, aunque ambas pueden alcanzar al mismo receptor; sus transmisiones pueden colisionar allí.'],
'ACK':['Acknowledgement: trama de control que confirma recepción correcta en un intercambio que requiere confirmación. No demuestra entrega a una aplicación.'],
'FCS':['Frame Check Sequence: campo de comprobación al final de la trama; permite detectar errores mediante un CRC de 32 bits.'],
'CRC':['Cyclic Redundancy Check: cálculo matemático sobre bits que permite detectar muchos patrones de error; permite detectar errores, pero no reconstruye los bits originales.'],
'trama':['Unidad de información de capa 2, compuesta por campos de control, direcciones, contenido cuando corresponde y comprobación de errores.'],
'unicast':['Envío dirigido a un único destinatario.'],
'broadcast':['Envío destinado a todas las estaciones del dominio de difusión.'],
'multicast':['Envío dirigido a un grupo de destinatarios.'],
'retransmisión':['Nuevo intento de enviar una trama después de un fallo; se limita para evitar intentos indefinidos.'],
'timeout':['Vencimiento de un tiempo máximo de espera, por ejemplo mientras se espera un ACK.'],
'Retry':['Indicador en el control de trama que señala que el envío es una retransmisión.'],
'número de secuencia':['Identificador utilizado junto con otros campos para ordenar o reconocer duplicados de tramas.'],
'Management':['Administración: clase de tramas que permite descubrir y establecer o mantener una relación con una red.'],
'Control':['Control: clase de tramas que ayuda a coordinar el acceso y confirmar intercambios.'],
'Data':['Datos: clase de tramas que transporta información de protocolos superiores; existen subtipos sin carga de usuario.'],
'beacon':['Trama de administración periódica del AP que anuncia información del BSS.'],
'asociación':['Procedimiento por el que una estación establece su pertenencia a un BSS de infraestructura.'],
'Frame Control':['Campo inicial con versión, tipo, subtipo e indicadores de la trama, como Retry y To DS/From DS.'],
'Duration/ID':['Campo que normalmente anuncia duración restante de un intercambio; en determinados subtipos tiene otro significado.'],
'To DS/From DS':['Indicadores que señalan la relación de una trama con el sistema de distribución y determinan cómo interpretar sus direcciones.'],
'Sequence Control':['Campo con número de secuencia y número de fragmento.'],
'semidúplex':['Comunicación en la que se transmite o recibe por turnos en un mismo medio.'],
'dúplex completo':['Comunicación que permite transmitir y recibir simultáneamente en un enlace.'],
'sobrecarga':['Tiempo o información adicional necesarios para coordinar una comunicación, aparte de los datos útiles.']};
Object.assign(glossary, {"enlace": ["Relación de comunicación entre interfaces que permite intercambiar tramas; por ejemplo, el salto de radio de un portátil a un AP."], "modo infraestructura": ["Organización de una red 802.11 en la que las estaciones se asocian a un punto de acceso que proporciona acceso al sistema de distribución."], "microsegundo": ["Una millonésima de segundo; se representa con el símbolo µs. Los intervalos entre tramas suelen expresarse en esta unidad."], "OFDM": ["Orthogonal Frequency Division Multiplexing: técnica física que distribuye la transmisión en varias subportadoras. Sus parámetros influyen en los tiempos usados en ejemplos de acceso."], "CWmin": ["Valor mínimo o inicial del parámetro de ventana de contención para el procedimiento y la configuración correspondientes."], "CWmax": ["Límite superior del parámetro de ventana de contención; el crecimiento por fallos no debe superarlo."], "cuerpo de trama": ["Parte de la trama que contiene el contenido transportado o información específica de administración. Su presencia y tamaño dependen del tipo de trama."], "fragmento": ["Parte de una unidad de información dividida en varias piezas para transmitirla. Sequence Control incluye un número para distinguir fragmentos."]});
const slug=t=>'def-'+t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
const t=x=>`<a class="term" href="#${slug(x)}">${x}</a>`;
const lessons=buildLessons(t, slug);
document.querySelector('#nav').innerHTML=lessons.map((l,i)=>`<a href="#tema${i+1}"><span>0${i+1}</span>${l[0]}</a>`).join('');
document.querySelector('#lessons').innerHTML=lessons.map((l,i)=>`<section id="tema${i+1}"><div class="eyebrow">CAPÍTULO 0${i+1} / ${l[0].toUpperCase()}</div><h2>${l[1]}</h2>${l[2]}</section>`).join('');
function lab(id,title,steps){
  let current=0;const el=document.getElementById(id);
  function render(focus){
    el.innerHTML=`<div class="lab"><div class="eyebrow">LABORATORIO INTERACTIVO</div><h3>${title}</h3><div class="timeline">${steps.map((s,i)=>`<span class="${i===current?'current':i<current?'done':''}" ${i===current?'aria-current="step"':''}>${s[0]}</span>`).join('')}</div><div aria-live="polite" aria-atomic="true">${labScene(id,current)}<h3>${steps[current][0]}</h3><p>${steps[current][1]}</p></div><div class="controls"><button data-prev ${current===0?'disabled':''}>← Anterior</button><button data-next ${current===steps.length-1?'disabled':''}>Siguiente →</button><button data-start>Reiniciar</button><span class="step-count">${current+1} / ${steps.length}</span></div></div>`;
    el.querySelector('[data-prev]').onclick=()=>{current--;render(current===0?'[data-next]':'[data-prev]')};
    el.querySelector('[data-next]').onclick=()=>{current++;render(current===steps.length-1?'[data-prev]':'[data-next]')};
    el.querySelector('[data-start]').onclick=()=>{current=0;render('[data-start]')};
    if(focus)el.querySelector(focus).focus();
  }render();
}
lab('simulador','Una cuenta atrás con interrupción',[
['Escuchar','A tiene una trama pendiente. La evaluación física detecta una transmisión de B: A espera. El NAV también debe permitir el acceso.'],['DIFS','B termina. El canal permanece libre durante DIFS antes de continuar la competencia.'],['Backoff: 3 → 2','A tiene un contador ilustrativo de 3 ranuras. Pasa una ranura libre: baja a 2. Otra estación puede tener otro número; no existe un turno asignado por el AP.'],['Pausa: 2','C empieza a transmitir. A congela su contador en 2: no baja mientras el medio está ocupado.'],['DIFS otra vez','C termina. A espera un DIFS de medio libre; conserva las 2 ranuras pendientes.'],['2 → 1 → 0','Pasan dos ranuras libres. Al llegar a cero, A transmite. Si otra estación llega a cero a la vez, todavía puede haber colisión.'],['Datos → SIFS → ACK','El receptor comprueba FCS y responde ACK tras SIFS si la recepción es correcta. Otras estaciones deben esperar antes de competir de nuevo.']]);
lab('retry-lab','El dato llega, pero se pierde el ACK',[
['Datos correctos','A transmite y el AP recibe con FCS válido. Entrega el contenido localmente y prepara un ACK.'],['ACK perdido','El AP envía el ACK tras SIFS, pero A no lo recibe. El dato sí llegó: la falta de ACK no prueba una colisión del dato.'],['Timeout','A agota su tiempo de espera. Considera fallido el intento, aumenta CW hasta el límite permitido y elige un nuevo backoff.'],['Nuevo intento','Después de competir de nuevo, A retransmite con el indicador Retry y el número de secuencia correspondiente.'],['Duplicado reconocido','El AP reconoce el duplicado en su contexto, evita entregar otra copia y confirma de nuevo. A recibe el ACK y vuelve a CWmin.']]);
const termEl=document.getElementById('terms');
function renderTerms(q=''){
  termEl.innerHTML=Object.entries(glossary).filter(([k,v])=>(k+' '+v[0]).toLocaleLowerCase().includes(q.toLocaleLowerCase())).map(([k,v])=>`<article class="definition" id="${slug(k)}"><h3>${k}</h3><p>${v[0]}</p></article>`).join('')||'<p>No hay coincidencias. Prueba otra palabra.</p>';
}
renderTerms();
document.getElementById('search').oninput=e=>renderTerms(e.target.value);
const questions=[
{q:'¿Qué especifica la familia IEEE 802.11?',o:['Solo nombres de redes inalámbricas','Funciones MAC y de capa física para redes locales inalámbricas','El contenido de los mensajes de una aplicación'],a:[1],s:1,e:'802.11 especifica reglas MAC para el enlace y PHY para la transmisión de señales.'},
{q:'Selecciona las funciones relacionadas con MAC.',o:['Coordinar el acceso al medio','Elegir el nombre que el usuario da a cada documento','Gestionar direcciones de enlace y tramas','Diseñar el texto de una página'],a:[0,2],s:2,e:'MAC coordina el acceso y maneja tramas y direccionamiento del enlace.'},
{q:'¿Qué ocurre si el canal se ocupa durante el backoff?',o:['El contador se congela y continúa después del intervalo libre correspondiente','Se pone siempre en cero','Sigue disminuyendo durante la transmisión ajena'],a:[0],s:3,e:'El contador se congela y en DCF se reanuda tras DIFS de canal libre.'},
{q:'Selecciona tres afirmaciones correctas sobre el acceso DCF.',o:['SIFS es más corto que DIFS','Backoff se expresa en ranuras','CSMA/CA elimina todas las colisiones','La escucha física y la virtual influyen en el acceso'],a:[0,1,3],s:3,e:'El mecanismo combina escucha física/virtual y espera aleatoria; aún pueden ocurrir colisiones.'},
{q:'A y C no se oyen, pero ambas alcanzan al AP. ¿Qué problema describe?',o:['Nodo oculto','Dirección MAC demasiado larga','Duplicación del nombre SSID'],a:[0],s:4,e:'Las estaciones ocultas pueden creer libre el medio y colisionar en el receptor común.'},
{q:'Selecciona dos afirmaciones correctas sobre RTS/CTS.',o:['CTS puede informar a quien no oyó RTS','Es obligatorio antes de cualquier trama','Introduce sobrecarga','Elimina la posibilidad de colisión de RTS'],a:[0,2],s:4,e:'CTS puede alcanzar al nodo oculto. Las tramas extra cuestan tiempo y RTS puede colisionar.'},
{q:'El emisor no recibe ACK. ¿Qué puede haber ocurrido? Elige tres posibilidades.',o:['Se perdió la trama de datos','Se perdió el ACK','Hubo interferencia en la recepción','El destinatario final necesariamente leyó el mensaje'],a:[0,1,2],s:5,e:'La ausencia de ACK no permite identificar una única causa ni dice nada sobre la lectura del mensaje.'},
{q:'¿Para qué sirve FCS?',o:['Corregir automáticamente todos los bits dañados','Detectar errores mediante CRC','Asignar el siguiente turno de transmisión'],a:[1],s:5,e:'FCS permite detectar errores; no los corrige ni asigna turnos de transmisión.'},
{q:'Selecciona tres asociaciones correctas.',o:['Beacon → administración','RTS → control','Trama que transporta contenido de usuario → datos','ACK → administración'],a:[0,1,2],s:6,e:'Beacon anuncia información del BSS; RTS y ACK son control; las tramas de datos pueden transportar contenido de usuario.'},
{q:'Selecciona dos diferencias correctas entre Ethernet y Wi-Fi.',o:['Ethernet conmutado dúplex completo no usa CSMA/CD','Wi-Fi puede utilizar hasta cuatro campos de dirección','Wi-Fi siempre tiene solo origen y destino','Ethernet necesita RTS/CTS para cada envío'],a:[0,1],s:2,e:'Los enlaces modernos Ethernet dúplex completo no compiten con CSMA/CD y 802.11 distingue varias funciones de dirección.'},
{q:'Asocia el término NAV con su definición.',o:['Temporizador local de reserva virtual del medio','Nombre visible de la red','Campo que corrige errores'],a:[0],s:4,e:'NAV representa el tiempo que se considera reservado el medio.',match:true},
{q:'Asocia el término LLC con su definición.',o:['Identificador de 48 bits','Interfaz lógica hacia protocolos superiores en la división clásica IEEE 802','Señal de radio de respuesta a RTS'],a:[1],s:2,e:'LLC es la subcapa de control de enlace lógico situada sobre MAC.',match:true},
{q:'¿Qué término corresponde a «intervalo corto antes de respuestas inmediatas como ACK»?',o:['DIFS','SIFS','CW'],a:[1],s:3,e:'SIFS permite responder antes de que comience una nueva competencia DCF.',match:true},
{q:'¿Qué término corresponde a «trama de control que confirma recepción correcta»?',o:['ACK','FCS','SSID'],a:[0],s:5,e:'ACK es una trama de confirmación; FCS es un campo de comprobación.',match:true},
{q:'Asocia BSSID con su definición.',o:['Nombre de red elegido para mostrar al usuario','Identificador de 48 bits de un conjunto básico de servicio','Contador aleatorio de acceso al medio'],a:[1],s:2,e:'BSSID identifica el BSS; SSID es el nombre de red.',match:true},
{q:'¿Qué término corresponde a «clase de tramas que permite descubrir y mantener la red»?',o:['Data','Control','Management'],a:[2],s:6,e:'Management incluye beacon y tramas de asociación.',match:true}
];
const quiz=document.getElementById('quiz');quiz.innerHTML=questions.map((q,i)=>`<div class="question"><fieldset><legend><span class="qmeta">EJERCICIO ${String(i+1).padStart(2,'0')} · ${q.match?'ASOCIACIÓN':q.a.length+' RESPUESTA'+(q.a.length>1?'S CORRECTAS':' CORRECTA')}</span>${q.q}</legend>${q.match?`<label for="q${i}" class="qmeta">Selecciona la correspondencia</label><select id="q${i}" name="q${i}"><option value="">Elige una opción…</option>${q.o.map((o,j)=>`<option value="${j}">${o}</option>`).join('')}</select>`:q.o.map((o,j)=>`<label class="option"><input type="${q.a.length===1?'radio':'checkbox'}" name="q${i}" value="${j}"><span>${o}</span></label>`).join('')}</fieldset><div id="feedback${i}"></div></div>`).join('');
document.getElementById('grade').onclick=()=>{let score=0;questions.forEach((q,i)=>{const selected=q.match?(quiz.elements['q'+i].value===''?[]:[Number(quiz.elements['q'+i].value)]):Array.from(quiz.querySelectorAll(`input[name="q${i}"]:checked`)).map(x=>Number(x.value));const correct=selected.length===q.a.length&&selected.every(x=>q.a.includes(x));if(correct)score++;document.getElementById('feedback'+i).innerHTML=`<div class="feedback ${correct?'correct':'wrong'}">${correct?'✓ Correcto.':selected.length?'↗ Revisa esta respuesta.':'○ Sin responder.'} ${q.e}${correct?'':`<br>Respuesta correcta: ${q.a.map(x=>q.o[x]).join('; ')}.<a href="#tema${q.s}">Repasar: ${lessons[q.s-1][0]} →</a>`}</div>`});const r=document.getElementById('result');r.textContent=`${score} / ${questions.length} puntos · ${Math.round(score/questions.length*100)} % · Nota de práctica: ${(score/questions.length*5).toFixed(1)} / 5.0`;r.scrollIntoView({behavior:'smooth',block:'center'})};
document.getElementById('reset').onclick=()=>{quiz.reset();questions.forEach((_,i)=>document.getElementById('feedback'+i).innerHTML='');document.getElementById('result').textContent='';quiz.scrollIntoView({behavior:'smooth'})};quiz.onsubmit=e=>e.preventDefault();
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}})},{rootMargin:'-10% 0px -60% 0px'});document.querySelectorAll('#lessons section').forEach(s=>observer.observe(s));

initializeArchitecture();
