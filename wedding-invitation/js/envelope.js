/*
 * Последовательность экранов:
 *   1) languageSelector — выбор языка
 *   2) envelopeOverlay   — закрытый конверт, ждёт клика по печати
 *   3) siteShell         — сам сайт с приглашением
 *
 * Раньше здесь было два бага:
 *  - при выборе языка сайт открывался сразу, минуя конверт;
 *  - для гостя с уже сохранённым языком сайт сначала показывался,
 *    а через мгновение конверт снова "выскакивал" поверх него.
 * Теперь переходы явные и синхронизированы с CSS-transition
 * (0.7–0.8s на скрытие/появление слоя, 1.1s на раскрытие конверта).
 */
(function () {
  const site = window.WeddingSite;

  const languageSelector = document.getElementById('languageSelector');
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const siteShell = document.getElementById('siteShell');
  const seal = document.getElementById('seal');

  // Должно совпадать с длительностью transform-перехода .panel в CSS (1.1s)
  const ENVELOPE_OPEN_DURATION = 1100;
  let pendingSiteReveal = null;

  function forceUiState() {
    if (languageSelector) languageSelector.classList.add('hidden');
    if (envelopeOverlay) {
      envelopeOverlay.classList.add('hidden');
      envelopeOverlay.classList.remove('is-open');
    }
    if (siteShell) siteShell.classList.remove('hidden');
  }

  function showLanguageStep() {
    console.log('[envelope] showLanguageStep()');
    if (siteShell) siteShell.classList.add('hidden');
    if (envelopeOverlay) {
      envelopeOverlay.classList.add('hidden');
      envelopeOverlay.classList.remove('is-open');
    }
    if (languageSelector) languageSelector.classList.remove('hidden');
  }

  function showEnvelopeStep() {
    console.log('[envelope] showEnvelopeStep()');
    if (languageSelector) languageSelector.classList.add('hidden');
    if (siteShell) siteShell.classList.add('hidden');
    if (envelopeOverlay) {
      envelopeOverlay.classList.remove('is-open');
      envelopeOverlay.classList.remove('hidden');
      void envelopeOverlay.offsetWidth;
    }
  }

  function showSiteStep() {
    console.log('[envelope] showSiteStep()');

    const finalizeSite = () => {
      if (languageSelector) languageSelector.classList.add('hidden');
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('hidden');
        envelopeOverlay.classList.remove('is-open');
      }
      if (siteShell) siteShell.classList.remove('hidden');
      // Дополнительная синхронизация после отрисовки, чтобы исключить
      // кратковременный визуальный “дребезг” на первом открытии страницы.
      document.body?.classList.add('site-ready');
    };

    if (document.readyState !== 'complete') {
      console.log('[envelope] page not fully loaded, waiting for load event');
      const onLoad = () => {
        window.removeEventListener('load', onLoad);
        requestAnimationFrame(() => {
          requestAnimationFrame(finalizeSite);
        });
      };
      window.addEventListener('load', onLoad, { once: true });
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(finalizeSite);
    });
  }

  function openEnvelope() {
    if (!envelopeOverlay || envelopeOverlay.classList.contains('is-open')) return;
    console.log('[envelope] openEnvelope()');
    envelopeOverlay.classList.add('is-open');
    try { localStorage.setItem('wedding-visited', '1'); } catch (e) {}

    if (window.WeddingAudio && typeof window.WeddingAudio.play === 'function') {
      window.WeddingAudio.play();
    }

    if (pendingSiteReveal) {
      window.clearTimeout(pendingSiteReveal);
    }

    pendingSiteReveal = window.setTimeout(() => {
      showSiteStep();
    }, ENVELOPE_OPEN_DURATION + 200);
  }

  if (seal) {
    seal.addEventListener('click', openEnvelope);
  }

  // Язык выбран -> показываем конверт (а не сразу сайт)
  document.addEventListener('wedding:language-selected', showEnvelopeStep);

  site.showLanguageStep = showLanguageStep;
  site.showEnvelopeStep = showEnvelopeStep;
  site.showSiteStep = showSiteStep;

  // ---- Начальное состояние при загрузке страницы ----
  // Сохраняем корректный сценарий: первый заход -> выбор языка,
  // повторный заход -> показать готовый сайт, если пользователь уже выбрал язык.
  let savedLang = null;
  let visited = null;
  try {
    savedLang = localStorage.getItem('wedding-language');
    visited = localStorage.getItem('wedding-visited');
  } catch (error) {
    savedLang = null;
    visited = null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const forceReset = urlParams.get('resetWelcome') === '1' || window.location.hash === '#reset';
  if (forceReset) {
    try {
      localStorage.removeItem('wedding-language');
      localStorage.removeItem('wedding-visited');
    } catch (e) {}
    savedLang = null;
    visited = null;
  }

  if (!visited) {
    showLanguageStep();
  } else if (savedLang && ['kg', 'ru'].includes(savedLang)) {
    site.setLanguage(savedLang, { silent: true });
    forceUiState();
  } else {
    showLanguageStep();
  }
})();
