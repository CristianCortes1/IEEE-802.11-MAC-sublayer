// Native dialog keeps keyboard focus inside the definition and supports Escape.
(() => {
  const definitions = new Map(Object.entries(glossary).map(([term, value]) => [slug(term), {term, definition:value[0]}]));
  document.body.insertAdjacentHTML('beforeend', `<dialog id="term-dialog" class="term-dialog" aria-labelledby="term-dialog-title" aria-describedby="term-dialog-definition"><div class="term-dialog-top"><span class="eyebrow">GLOSARIO DE BOLSILLO</span><button type="button" class="term-dialog-close" aria-label="Cerrar definición" autofocus>✕</button></div><h2 id="term-dialog-title"></h2><p id="term-dialog-definition"></p><p class="term-dialog-hint">Pulsa Escape o cierra esta ventana para seguir leyendo.</p></dialog>`);
  const dialog = document.getElementById('term-dialog');
  const title = document.getElementById('term-dialog-title');
  const definition = document.getElementById('term-dialog-definition');
  let trigger = null;
  document.querySelectorAll('a[href^="#def-"]').forEach(link => link.setAttribute('aria-haspopup','dialog'));
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#def-"]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button !== undefined && event.button !== 0)) return;
    const entry = definitions.get(link.getAttribute('href').slice(1));
    if (!entry) return;
    event.preventDefault(); // Preserve both the scroll position and the URL hash.
    trigger = link;
    title.textContent = entry.term;
    definition.textContent = entry.definition;
    if (!dialog.open) dialog.showModal();
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (trigger?.isConnected) trigger.focus({preventScroll:true});
    trigger = null;
  });
})();
