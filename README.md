# IEEE 802.11 — Subcapa MAC

Página educativa en español para estudiar IEEE 802.11 y la capa de enlace de datos.

## Demo

[Abrir la demo interactiva](https://cristiancortes1.github.io/IEEE-802.11-MAC-sublayer/)

## Contenido

- Siete capítulos: introducción, arquitectura y MAC, CSMA/CA, RTS/CTS, ACK y errores, tramas y conclusiones.
- Explicaciones detalladas desde cero, ejemplos numéricos resueltos y preguntas de comprensión con respuestas desplegables, centrados en la capa de enlace.
- Glosario enlazado con regreso a la lectura.
- Diagramas y tres laboratorios interactivos paso a paso, con estados visuales de las estaciones en cada etapa.
- Parcial de 16 ejercicios con selección de una, dos o tres respuestas y asociaciones mediante listas desplegables.
- Calificación, explicación y enlaces a las secciones que deben repasarse.
- Diseño adaptable a móviles y navegación con teclado.
- Modos claro y oscuro: botón en la cabecera, preferencia guardada y tema del sistema en la primera visita.

## Uso

Abre `index.html` en un navegador. No necesita instalación ni compilación. También puedes servir esta carpeta con cualquier servidor de archivos estáticos.

Los archivos `style.css`, `app.js`, `lessons.js`, `lab-scenes.js` y `theme.js` deben mantenerse junto a `index.html`. Las fuentes de Google Fonts requieren conexión; si no está disponible, se usan fuentes alternativas del sistema. El contenido y los ejercicios se ejecutan localmente en el navegador.

## Alcance

Los ejemplos de acceso al canal explican DCF clásico con tiempos ilustrativos. El contenido distingue mecanismos modernos como EDCA y Block ACK. Las fuentes oficiales de consulta están enlazadas al final de la página.

## Verificación

Con Node.js instalado, ejecuta `node verify.cjs`. Comprueba los enlaces al glosario, los recursos locales, la calificación y el reinicio del parcial y la navegación de los laboratorios. Son comprobaciones de contenido y lógica; no sustituyen una revisión visual en un navegador.
