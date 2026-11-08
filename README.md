# IEEE 802.11 — Subcapa MAC

Página educativa en español para estudiar IEEE 802.11 y la capa de enlace de datos.

## Demo

[Abrir la demo interactiva](https://cristiancortes1.github.io/IEEE-802.11-MAC-sublayer/)

## Contenido

- Siete capítulos: introducción, arquitectura y MAC, CSMA/CA, RTS/CTS, ACK y errores, tramas y conclusiones.
- Explicaciones detalladas desde cero, ejemplos numéricos resueltos y preguntas de comprensión con respuestas desplegables, centrados en la capa de enlace.
- Términos enlazados con definiciones en una ventana emergente, sin saltos de lectura; cierre con botón, Escape o clic fuera. El glosario completo conserva su buscador.
- Mini cuestionario al final de cada uno de los siete temas: 3 preguntas, corrección con explicaciones, enlace de repaso y nuevos intentos independientes del parcial final.
- Diagramas y tres laboratorios interactivos paso a paso, con estados visuales de las estaciones en cada etapa.
- Arquitectura visual: STA/AP → BSS → sistema de distribución (DS) → ESS → SSID/BSSID. El mapa SVG permite explorar cada BSS, su conexión y el ESS completo; incluye preguntas de repaso y una definición enlazada de ESS.
- Ejemplo A=3/C=5 animado en 13 pasos: reproducir/pausar, anterior, siguiente y reiniciar; contadores, congelación y envíos DATOS/ACK visibles. La animación se pausa al ocultar la pestaña y respeta la preferencia de movimiento reducido.
- RTS/CTS animado en 11 pasos: riesgo del nodo oculto, acceso inicial, solicitud, respuesta del AP escuchada por C, reserva NAV y secuencia DATOS/ACK. Incluye reproducción, pausa, velocidades y navegación manual.
- Tramas: tarjetas de clases, un sobre explorable por partes y una animación de nueve etapas de A al AP y del AP a C. Los detalles de campos y direcciones quedan en desplegables.
- Historia completa en siete capítulos: beacons, llegada y conexión de A, primer envío, llegada y conexión de C, nodo oculto, colisión, reintentos y reserva RTS/CTS en ambos sentidos. Incluye Open System básico, asociación/AID, ACK de gestión, FCS y NAV; reproducción, velocidad, capítulos y barra para ir a cualquier paso.
- Parcial de 16 ejercicios con selección de una, dos o tres respuestas y asociaciones mediante listas desplegables.
- Calificación, explicación y enlaces a las secciones que deben repasarse.
- Nota provisional del parcial de 0 a 5, visible mientras respondes y actualizada al confirmar cada respuesta. Se calcula sobre las 16 preguntas; las no confirmadas valen cero. Si editas una respuesta, debes confirmarla de nuevo.
- Diseño adaptable a móviles y navegación con teclado.
- Modos claro y oscuro: botón en la cabecera, preferencia guardada y tema del sistema en la primera visita.

## Uso

Abre `index.html` en un navegador. No necesita instalación ni compilación. También puedes servir esta carpeta con cualquier servidor de archivos estáticos.

Los archivos `style.css`, `app.js`, `architecture.js`, `frames.js`, `lessons.js`, `lab-scenes.js`, `backoff-animation.js`, `rts-animation.js`, `mini-quizzes.js`, `glossary-dialog.js` y `theme.js` deben mantenerse junto a `index.html`. Las fuentes de Google Fonts requieren conexión; si no está disponible, se usan fuentes alternativas del sistema. El contenido y los ejercicios se ejecutan localmente en el navegador.

La historia completa usa también `full-story.js` y `full-story.css`, en la misma carpeta. Se accede desde «Historia completa» o con `#historia-completa` en la URL.

## Alcance

La guía se centra en fundamentos de las capas 1 y 2: señales, medio compartido, estaciones y AP, subcapas LLC/MAC, tramas, DCF, CSMA/CA, RTS/CTS, NAV, FCS y ACK. Los ejemplos de acceso al canal usan DCF clásico con tiempos ilustrativos. Las fuentes oficiales de consulta están enlazadas al final de la página.

La historia añade solo el intercambio básico Open System previo a la asociación. Los eventos se han elegido con fines didácticos: no es un simulador de propagación ni de todos los resultados posibles de la contención. Los tiempos de reproducción y el NAV por etapas no están a escala. El estado se reconstruye al retroceder o saltar de capítulo.

## Verificación

Con Node.js instalado, ejecuta `node verify.cjs`. Comprueba los enlaces al glosario, los recursos locales, la calificación y el reinicio del parcial y la navegación de los laboratorios. Son comprobaciones de contenido y lógica; no sustituyen una revisión visual en un navegador.
