const topicQuizzes = [
  [
    {q:'¿Qué es una trama en este recorrido?',o:['Una unidad de información organizada para el intercambio en el enlace','El nombre visible de la red','El tiempo de espera antes de cada respuesta'],a:[0],e:'La trama es la unidad de capa 2: incluye campos para interpretar, dirigir y comprobar el intercambio.'},
    {q:'¿Qué dos problemas deben resolver las reglas del enlace?',o:['Coordinar a quienes comparten el medio','Garantizar que ninguna señal pueda sufrir interferencia','Permitir identificar el destinatario de una trama','Hacer que todos transmitan siempre a la vez'],a:[0,2],e:'Las reglas coordinan el acceso y permiten direccionar las tramas. No pueden garantizar la ausencia de interferencia.'},
    {q:'Relaciona «subcapa que organiza el acceso al medio y gestiona tramas» con su término.',o:['MAC','SSID','SIFS'],a:[0],match:true,e:'MAC es la subcapa de control de acceso al medio. SSID es un nombre de red y SIFS es un intervalo temporal.'}
  ],
  [
    {q:'Dos AP anuncian «Aula». ¿Ese nombre basta para afirmar que forman un ESS?',o:['Sí: compartir el nombre une automáticamente las redes','No: deben integrar la red extendida mediante el mismo sistema de distribución','Sí: todos los AP del mundo con ese nombre forman un ESS'],a:[1],e:'El SSID es un nombre; no conecta redes por sí solo. En nuestro ejemplo los BSS se integran mediante un mismo DS y conservan BSSID diferentes.'},
    {q:'Selecciona dos afirmaciones correctas sobre BSS y ESS.',o:['Un ESS puede reunir varios BSS unidos por un sistema de distribución','Todos los BSS de un ESS deben tener el mismo BSSID','Añadir otro portátil al mismo AP no crea otro BSS','ESS es una trama que confirma datos'],a:[0,2],e:'BSS es el conjunto básico; ESS es el conjunto extendido. Un AP puede atender varias estaciones dentro del mismo BSS y los BSS del ESS mantienen identificadores distintos.'},
    {q:'Asocia LLC con la descripción correcta.',o:['Espera aleatoria que decide cuándo transmitir','Interfaz lógica de enlace situada sobre MAC en la división clásica IEEE 802','Confirmación de que una trama llegó sin errores detectados'],a:[1],match:true,e:'LLC organiza la interfaz lógica y la identificación del contenido; el acceso al medio es responsabilidad de MAC.'}
  ],
  [
    {q:'A conserva un backoff de 2 ranuras cuando otra estación empieza a transmitir. ¿Qué hace A?',o:['Descuenta las 2 ranuras mientras la otra transmite','Borra el contador y transmite inmediatamente','Congela el 2 y lo reanuda tras el intervalo libre correspondiente'],a:[2],e:'En el caso DCF estudiado, conserva el contador durante la ocupación y lo continúa después de DIFS libre.'},
    {q:'Selecciona las tres afirmaciones correctas.',o:['Con CW=15 se puede elegir un contador entre 0 y 15, inclusive','SIFS es más corto que DIFS','DIFS es el valor aleatorio del backoff','La escucha física y la virtual intervienen en la decisión de acceso'],a:[0,1,3],e:'CW define el rango de sorteo; DIFS y SIFS son intervalos, no sorteos. El acceso combina evaluación física y reserva virtual.'},
    {q:'En el ejemplo con SIFS=16 microsegundos y ranura=9 microsegundos, ¿cuánto vale DIFS?',o:['25 microsegundos','34 microsegundos','144 microsegundos'],a:[1],e:'DIFS = SIFS + 2 × ranura = 16 + 2 × 9 = 34 microsegundos. Estos valores corresponden a la configuración del ejemplo.'}
  ],
  [
    {q:'C no oye a A, pero sí al AP. ¿Qué permite que C conozca el intercambio protegido de A?',o:['El CTS enviado por el AP','Que A tenga una dirección más corta','Que C transmita durante SIFS para preguntar'],a:[0],e:'El receptor anuncia el intercambio mediante CTS. C puede oír ese anuncio aunque no haya detectado el RTS de A.'},
    {q:'Selecciona dos afirmaciones correctas sobre RTS/CTS.',o:['RTS necesita obtener acceso al medio antes de enviarse','RTS y CTS eliminan todas las colisiones posibles','Las tramas de control adicionales consumen tiempo','Al expirar NAV, C recibe automáticamente el siguiente turno'],a:[0,2],e:'RTS también compite por el acceso. El mecanismo añade sobrecarga, puede sufrir colisiones y no asigna a C un turno fijo posterior.'},
    {q:'Asocia NAV con su función.',o:['Temporizador local que representa la reserva virtual del medio','Lista central de direcciones autorizadas a usar el AP','Comprobación matemática de errores de la trama'],a:[0],match:true,e:'NAV conserva el tiempo de reserva interpretado a partir de tramas recibidas. No bloquea físicamente el aire ni comprueba errores.'}
  ],
  [
    {q:'El AP recibe bien los datos, pero A no recibe el ACK. ¿Qué puede ocurrir después?',o:['A sabe con certeza que el AP no recibió nada','A reintenta y el AP puede reconocer la repetición','El AP debe entregar siempre una segunda copia del contenido'],a:[1],e:'A solo sabe que no recibió la confirmación. Puede retransmitir; el receptor utiliza la información de secuencia y el contexto para reconocer el duplicado.'},
    {q:'Selecciona dos afirmaciones correctas sobre la recuperación de fallos.',o:['FCS corrige automáticamente el contenido dañado','Un intento sin ACK puede deberse a datos perdidos o a un ACK perdido','Tras un fallo, ampliar CW aumenta el rango de posibles contadores','Una retransmisión puede ignorar las reglas de acceso'],a:[1,2],e:'FCS detecta errores, no los corrige. La ausencia de ACK no identifica una causa única; ampliar CW ayuda a separar nuevos intentos.'},
    {q:'Relaciona «campo de 4 bytes que permite detectar errores mediante CRC» con su término.',o:['ACK','Retry','FCS'],a:[2],match:true,e:'FCS es un campo de comprobación. ACK es una trama de respuesta y Retry es un indicador de retransmisión.'}
  ],
  [
    {q:'¿A qué clase pertenece una trama beacon?',o:['Administración (Management)','Datos (Data)','Es un ACK y no tiene clase'],a:[0],e:'Beacon anuncia información del BSS y pertenece a las tramas de administración.'},
    {q:'A envía contenido a C mediante el AP. Selecciona dos afirmaciones correctas.',o:['El ACK del AP a A confirma que el AP recibió la trama correspondiente','Ese ACK ya garantiza que C recibió el envío posterior','El AP debe aplicar las reglas de acceso para iniciar el envío de datos a C','El AP se convierte siempre en el origen del contenido de A'],a:[0,2],e:'La confirmación pertenece al primer intercambio. El reenvío de AP a C es otro intercambio, con acceso y confirmación propios.'},
    {q:'Relaciona «campo que contiene el número de secuencia y el número de fragmento» con su nombre.',o:['Duration/ID','Sequence Control','Cuerpo de trama'],a:[1],match:true,e:'Sequence Control contiene ambos números. Duration/ID puede anunciar reserva y el cuerpo lleva el contenido correspondiente al tipo de trama.'}
  ],
  [
    {q:'El AP confirma con ACK la solicitud de autenticación de A. Aún no ha enviado Authentication Response. ¿Qué sabe A?',o:['Que ya está autenticada y asociada','Que el AP recibió la solicitud, pero aún falta conocer el resultado','Que ya tiene un AID asignado'],a:[1],e:'El ACK es control y confirma recepción. La aceptación o el rechazo llegan en Authentication Response, una trama de administración. A aún está sin autenticar y sin asociar.'},
    {q:'Selecciona dos afirmaciones correctas sobre el procedimiento básico.',o:['Open System no comprueba una contraseña dentro de su intercambio','Estar autenticada no implica estar asociada','El ACK de una solicitud sustituye a la respuesta de administración','Cada estación debe contestar con ACK a todos los beacons'],a:[0,1],e:'Open System y asociación son procedimientos distintos. Un ACK no contiene su resultado y un beacon ordinario es difusión, sin ACK individual.'},
    {q:'Relaciona «número que el AP asigna a una asociación aceptada dentro de su BSS» con su término.',o:['SSID','BSSID','AID'],a:[2],match:true,e:'AID identifica la asociación dentro del BSS. SSID es el nombre de red y BSSID identifica el BSS. Ninguno sustituye a la dirección MAC de A.'}
  ],
  [
    {q:'¿Qué explicación integra correctamente los mecanismos estudiados?',o:['FCS asigna turnos, NAV corrige bits y ACK detecta el canal libre','MAC organiza el intercambio; CSMA/CA coordina el acceso y ACK confirma la recepción cuando corresponde','RTS/CTS hace innecesarios el direccionamiento y FCS'],a:[1],e:'Cada mecanismo tiene una función diferente: acceso, reserva, comprobación o confirmación. Trabajan juntos y no se sustituyen entre sí.'},
    {q:'Selecciona tres límites reales de estos mecanismos.',o:['CSMA/CA no elimina todas las colisiones','Una estación que no oye la reserva aún puede interferir','Un ACK del AP no confirma un reenvío posterior a otra estación','Las retransmisiones garantizan el éxito si se repiten indefinidamente'],a:[0,1,2],e:'El acceso es probabilístico, la información de reserva tiene alcance limitado y cada confirmación corresponde a su intercambio. Los reintentos tienen límites.'},
    {q:'Relaciona «intentar recuperar una entrega fallida después de volver a competir por el medio» con su término.',o:['Retransmisión','SSID','Beacon'],a:[0],match:true,e:'La retransmisión recupera intentos fallidos y sigue las reglas de acceso. No recibe permiso automático por ser un reintento.'}
  ]
];

function miniQuizMarkup(items, topic) {
  const prefix = `mini-${topic}`;
  return `<div class="mini-quiz" aria-labelledby="${prefix}-title"><div class="eyebrow">PAUSA PARA PRACTICAR</div><h3 id="${prefix}-title">Mini cuestionario · tema ${topic}</h3><p class="mini-intro">3 preguntas sobre este tema. Comprueba tus respuestas antes de continuar; puedes volver a intentarlo.</p><form id="${prefix}">${items.map((q,i)=>`<div class="question"><fieldset><legend><span class="qmeta">PREGUNTA ${i+1} · ${q.match?'ASOCIACIÓN':q.a.length+' RESPUESTA'+(q.a.length>1?'S CORRECTAS':' CORRECTA')}</span>${q.q}</legend>${q.match?`<label class="qmeta" for="${prefix}-q${i}">Selecciona la correspondencia</label><select id="${prefix}-q${i}" name="${prefix}-q${i}"><option value="">Elige una opción…</option>${q.o.map((option,j)=>`<option value="${j}">${option}</option>`).join('')}</select>`:q.o.map((option,j)=>`<label class="option"><input type="${q.a.length===1?'radio':'checkbox'}" name="${prefix}-q${i}" value="${j}"><span>${option}</span></label>`).join('')}</fieldset><div id="${prefix}-feedback${i}"></div></div>`).join('')}<div class="quiz-actions"><button class="primary" type="submit">Comprobar respuestas →</button><button type="reset">Volver a intentar</button></div><div class="mini-result" id="${prefix}-result" role="status" aria-live="polite"></div></form></div>`;
}

function mountMiniQuizzes() {
  topicQuizzes.forEach((items,index)=>{
    const topic = index+1, prefix = `mini-${topic}`;
    document.getElementById(`tema${topic}`).insertAdjacentHTML('beforeend',miniQuizMarkup(items,topic));
    const form = document.getElementById(prefix);
    const result = document.getElementById(`${prefix}-result`);
    function clearFeedback() {
      items.forEach((_,i)=>{document.getElementById(`${prefix}-feedback${i}`).innerHTML='';});
      result.textContent='';
    }
    form.onsubmit = event=>{
      event.preventDefault();
      let score=0;
      items.forEach((q,i)=>{
        const name=`${prefix}-q${i}`;
        const selected=q.match?(form.elements[name].value===''?[]:[Number(form.elements[name].value)]):Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(input=>Number(input.value));
        const correct=selected.length===q.a.length && selected.every(value=>q.a.includes(value));
        if(correct)score++;
        document.getElementById(`${prefix}-feedback${i}`).innerHTML=`<div class="feedback ${correct?'correct':'wrong'}">${correct?'✓ Correcto.':selected.length?'↗ Revisa tu respuesta.':'○ Sin responder.'} ${q.e}${correct?'':`<br>Respuesta correcta: ${q.a.map(value=>q.o[value]).join('; ')}.<a href="#tema${topic}">Repasar este tema →</a>`}</div>`;
      });
      result.textContent=`${score} de ${items.length} correctas. ${score===items.length?'¡Listo! Puedes continuar.':'Revisa las explicaciones y vuelve a intentarlo.'}`;
    };
    form.onreset=clearFeedback;
    form.addEventListener('change',clearFeedback);
  });
}
mountMiniQuizzes();
