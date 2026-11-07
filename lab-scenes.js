// Each scene describes the same step as the accompanying explanation.
function labScene(id, step) {
  const scenes = {
    simulador: [
      ['Espera: canal ocupado','Recibe otra transmisión','B está transmitiendo','B → AP · A escucha y espera','El contador de A no avanza mientras detecta el medio ocupado.'],
      ['Observa DIFS libre','En silencio','En silencio','Canal libre durante DIFS','Esta espera es fija; todavía no es el descuento del backoff.'],
      ['Contador: 3 → 2','En silencio','En silencio','Una ranura libre transcurre','Solo pasó una ranura útil de la cuenta atrás.'],
      ['Contador congelado: 2','Recibe a C','C transmite','C → AP · A no transmite','La pausa conserva las dos ranuras pendientes de A.'],
      ['Conserva contador: 2','En silencio','Ya terminó de transmitir','Nuevo DIFS de medio libre','DIFS no consume las dos ranuras pendientes.'],
      ['Contador: 2 → 1 → 0','Listo para recibir','Espera','A → AP · DATOS al llegar a cero','A usa el medio cuando termina su cuenta atrás.'],
      ['Recibe confirmación','Comprueba y responde','No inicia otro intercambio','A → DATOS → AP · SIFS · AP → ACK → A','SIFS permite responder antes de una nueva competencia.']
    ],
    'hidden-lab': [
      ['No oye a C','Puede recibir señales de ambas','No oye a A','A → AP ← C · posible colisión en AP','A y C no se detectan entre sí; el problema aparece en su receptor común.'],
      ['Envía RTS','Recibe solicitud','No oye el RTS de A','A → RTS → AP','RTS se envía después de obtener acceso al medio.'],
      ['Recibe CTS','Responde tras SIFS','Oye CTS y establece NAV','AP → CTS → A y C','C recibe el anuncio desde el AP, no desde A.'],
      ['Envía DATOS tras SIFS','Recibe datos','NAV activo: espera','A → DATOS → AP · C permanece en espera','El canal está reservado para completar el intercambio.'],
      ['Recibe ACK','Responde tras SIFS','Espera al fin de reserva','AP → ACK → A · termina el intercambio','Al expirar NAV, C vuelve a competir; no tiene un turno garantizado.']
    ],
    'retry-lab': [
      ['Envía trama, secuencia n','Recibe correctamente','Espera por el medio','A → DATOS (n) → AP','AP tiene una copia válida del contenido.'],
      ['No recibe ACK','Envía ACK','Espera','AP → ACK → ✕ · no llega a A','Falla la confirmación; la recepción anterior de datos sí fue correcta.'],
      ['Timeout: aumenta CW','Ya recibió el contenido','Puede competir','A prepara otro intento','A sabe que no recibió ACK, pero desconoce por qué.'],
      ['Retransmite: Retry=1, secuencia n','Recibe repetición','Respeta el acceso obtenido','A → DATOS repetidos (n) → AP','El reintento mantiene los datos de identificación necesarios para reconocerlo.'],
      ['Recibe ACK: éxito','Reconoce duplicado y confirma','Continúa el acceso normal','AP → ACK → A · no entrega otra copia','A vuelve a CWmin; AP evita duplicar la entrega del contenido.']
    ]
  };
  const state = scenes[id]?.[step];
  if (!state) return '';
  return `<figure class="lab-scene"><div class="scene-nodes">${['Estación A','Punto de acceso AP','Otra estación'].map((name,i)=>`<div class="scene-node"><strong>${name}</strong><span>${state[i]}</span></div>`).join('')}</div><div class="scene-exchange">${state[3]}</div><figcaption>${state[4]}</figcaption></figure>`;
}
