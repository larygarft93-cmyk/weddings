(function () {
  const site = window.WeddingSite;
  const urlParams = new URLSearchParams(window.location.search);
  site.guestName = urlParams.get('guest');

  const langTitle = document.getElementById('lang-title');
  const langSubtitle = document.getElementById('lang-subtitle');

  function translateAll() {
    document.querySelectorAll('[data-kg]').forEach((el) => {
      const key = site.lang === 'ru' ? 'data-ru' : 'data-kg';
      const fallback = el.getAttribute(key) || el.getAttribute('data-ru') || el.getAttribute('data-kg') || el.textContent;

      if (el.id === 'hero-greeting' && site.guestName) {
        el.innerHTML = site.lang === 'kg'
          ? `${site.guestName}, сизди тоюбузда күтөбүз!`
          : `${site.guestName}, ждем вас на нашей свадьбе!`;
      } else {
        el.innerHTML = fallback;
      }
    });

    if (langTitle) {
      langTitle.textContent = site.lang === 'kg' ? 'Тилди тандаңыз' : 'Выберите язык';
    }

    if (langSubtitle) {
      langSubtitle.textContent = site.lang === 'kg'
        ? 'Төмөнкү тилдердин бирин тандаңыз'
        : 'Выберите один из языков ниже';
    }

    document.querySelectorAll('[data-kg-placeholder]').forEach((el) => {
      const key = site.lang === 'ru' ? 'data-ru-placeholder' : 'data-kg-placeholder';
      el.placeholder = el.getAttribute(key) || el.getAttribute('data-kg-placeholder') || el.placeholder;
    });

    document.documentElement.lang = site.lang;

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.innerText = site.lang === 'kg' ? 'RU' : 'KG';
    }

    if (typeof site.renderMiniCalendar === 'function') {
      site.renderMiniCalendar();
    }
  }

  function setLanguage(lang, options = {}) {
    site.lang = ['kg', 'ru'].includes(lang) ? lang : 'kg';
    translateAll();

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === site.lang);
    });

    if (!options.silent) {
      document.dispatchEvent(new CustomEvent('wedding:language-selected', { detail: { lang: site.lang } }));
    }
  }

  site.setLanguage = setLanguage;
  site.translateAll = translateAll;

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const next = site.lang === 'kg' ? 'ru' : 'kg';
      setLanguage(next, { silent: true });
    });
  }
})();