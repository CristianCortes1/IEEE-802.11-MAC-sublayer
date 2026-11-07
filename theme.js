(() => {
  const key = 'enlace-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { preference = localStorage.getItem(key); } catch {}
  if (!['light', 'dark'].includes(preference)) preference = null;
  const root = document.documentElement;
  let button;
  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (button) {
      const dark = theme === 'dark';
      button.textContent = dark ? '☀ Modo claro' : '☾ Modo oscuro';
      button.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
      button.setAttribute('aria-pressed', String(dark));
    }
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', event => {
    if (!preference) apply(event.matches ? 'dark' : 'light');
  });
  document.addEventListener('DOMContentLoaded', () => {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch {}
      apply(preference);
    });
    document.querySelector('header').append(button);
    apply(root.dataset.theme);
  });
})();
