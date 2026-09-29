(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('motech-theme');
  } catch {
    // Theme still works for this page when browser storage is unavailable.
  }
  if (savedTheme === 'dark' || savedTheme === 'light') root.dataset.theme = savedTheme;

  const updateThemeLabel = () => {
    if (!themeButton) return;
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    themeButton.setAttribute('aria-pressed', String(dark));
  };
  updateThemeLabel();

  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    try {
      localStorage.setItem('motech-theme', nextTheme);
    } catch {
      // The selected theme remains active until the page is closed.
    }
    updateThemeLabel();
  });

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation?.classList.toggle('is-open', !isOpen);
  });
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
