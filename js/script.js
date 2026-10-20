(() => {
  const root = document.documentElement;
  root.classList.add('js');

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

  // Scroll-reveal animation for [data-reveal] elements
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // Single-page ScrollSpy: updates aria-current="page" as user scrolls
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = document.querySelectorAll('main > section[id]');

  const updateActiveSection = () => {
    let currentId = 'home';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 150) {
        currentId = section.id;
      }
    });
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();
})();
