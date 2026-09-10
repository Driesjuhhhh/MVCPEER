(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const read = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const valid = (value) => value === 'dark' || value === 'light';
  let preference = read('color-theme');
  if (!valid(preference)) {
    const previous = read('theme');
    const legacy = read('darkmode');
    preference = valid(previous) ? previous : legacy === 'true' ? 'dark' : legacy === 'false' ? 'light' : null;
  }

  function apply() {
    const dark = valid(preference) ? preference === 'dark' : systemTheme.matches;
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
    document.querySelectorAll('[id^="darkmode-button"]').forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Lichte modus inschakelen' : 'Donkere modus inschakelen');
    });
  }

  // Run before page content and Tailwind load to avoid a light flash.
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelectorAll('[id^="darkmode-button"]').forEach((button) => {
      button.addEventListener('click', () => {
        preference = root.classList.contains('dark') ? 'light' : 'dark';
        try {
          localStorage.setItem('color-theme', preference);
          localStorage.removeItem('theme');
          localStorage.removeItem('darkmode');
        } catch { /* The toggle also works when storage is unavailable. */ }
        apply();
      });
    });
  });
  systemTheme.addEventListener('change', () => { if (!valid(preference)) apply(); });
  window.addEventListener('storage', (event) => {
    if (event.key === 'color-theme' || event.key === null) {
      preference = read('color-theme');
      apply();
    }
  });
})();
