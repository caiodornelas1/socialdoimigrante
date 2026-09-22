/* =========================================================================
   Social do Imigrante — 3ª Edição
   Vanilla JS: mobile nav, countdown, sticky CTA, cookie consent (RGPD/GDPR).
   No frameworks, no build step, no external deps.
   ========================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------------------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }

  function openMenu() {
    mobileMenu.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
    });
  }

  /* -----------------------------------------------------------------------
     COUNTDOWN — Sábado, 03/10/2026, horário de início a confirmar.
     Usamos meio-dia (12h, horário de Paris) como placeholder de exibição
     até o horário oficial ser confirmado pelo cliente.
     --------------------------------------------------------------------- */
  var EVENT_DATE = new Date('2026-10-03T12:00:00+02:00');

  var cdDays = document.getElementById('cd-days');
  var cdHours = document.getElementById('cd-hours');
  var cdMin = document.getElementById('cd-min');
  var cdSec = document.getElementById('cd-sec');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    if (!cdDays) { return; }
    var now = new Date();
    var diff = EVENT_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      cdDays.textContent = '0';
      cdHours.textContent = '00';
      cdMin.textContent = '00';
      cdSec.textContent = '00';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    cdDays.textContent = String(days);
    cdHours.textContent = pad(hours);
    cdMin.textContent = pad(minutes);
    cdSec.textContent = pad(seconds);
  }

  updateCountdown();
  // Seconds tick is a small delight; skip the interval entirely under
  // prefers-reduced-motion to avoid unnecessary repaints, updating once a minute instead.
  if (!prefersReducedMotion) {
    window.setInterval(updateCountdown, 1000);
  } else {
    window.setInterval(updateCountdown, 60000);
  }

  /* -----------------------------------------------------------------------
     STICKY MOBILE CTA — appears after scrolling past the hero.
     --------------------------------------------------------------------- */
  var stickyCta = document.getElementById('stickyCta');
  var heroEl = document.querySelector('.hero');

  if (stickyCta && heroEl && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          stickyCta.classList.remove('is-visible');
        } else {
          stickyCta.classList.add('is-visible');
        }
      });
    }, { threshold: 0 });
    io.observe(heroEl);
  }

  /* -----------------------------------------------------------------------
     COOKIE CONSENT (RGPD/GDPR)
     Non-essential scripts (analytics/pixel) must only load after explicit
     "Aceitar". Choice persists in localStorage. "Recusar" blocks them.
     --------------------------------------------------------------------- */
  var CONSENT_KEY = 'si_cookie_consent'; // 'accepted' | 'declined'
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieDecline = document.getElementById('cookieDecline');
  var openCookiePrefs = document.getElementById('openCookiePrefs');

  function getConsent() {
    try { return window.localStorage.getItem(CONSENT_KEY); }
    catch (e) { return null; }
  }

  function setConsent(value) {
    try { window.localStorage.setItem(CONSENT_KEY, value); }
    catch (e) { /* localStorage indisponível (modo privado etc.) — segue sem persistir */ }
  }

  /**
   * Placeholder for loading non-essential scripts (Google Analytics,
   * Meta/Instagram Pixel, etc.) once the client confirms which tools
   * will actually run — see "Em aberto" em notas-projeto.md.
   * Only called after explicit consent.
   */
  function loadNonEssentialScripts() {
    // Exemplo de integração futura (mantido comentado até confirmação do cliente):
    //
    // var ga = document.createElement('script');
    // ga.src = 'https://www.googletagmanager.com/gtag/js?id=SEU_ID_AQUI';
    // ga.async = true;
    // document.head.appendChild(ga);
    console.info('[cookies] Consentimento concedido — scripts não essenciais liberados (nenhum configurado ainda).');
  }

  function showCookieBanner() {
    if (cookieBanner) { cookieBanner.hidden = false; }
  }

  function hideCookieBanner() {
    if (cookieBanner) { cookieBanner.hidden = true; }
  }

  var existingConsent = getConsent();
  if (existingConsent === 'accepted') {
    loadNonEssentialScripts();
  } else if (existingConsent !== 'declined') {
    // Nenhuma decisão ainda: mostra o banner.
    showCookieBanner();
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      setConsent('accepted');
      hideCookieBanner();
      loadNonEssentialScripts();
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', function () {
      setConsent('declined');
      hideCookieBanner();
    });
  }

  if (openCookiePrefs) {
    openCookiePrefs.addEventListener('click', function (e) {
      e.preventDefault();
      showCookieBanner();
    });
  }

})();
