/* SIHYEON PARK — GA4 analytics (consent-first, analytics only).
   No Google Analytics requests or cookies before an explicit opt-in.
   Does not send names, emails, phone numbers, form contents or Stripe URLs. */
(function () {
  'use strict';
  const ID = 'G-99ESZ4BKT1';
  const KEY = 'sihyeonAnalyticsConsentV1';
  let choice = null, started = false;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  const page = location.pathname.split('/').pop() || 'index.html';
  const query = new URLSearchParams(location.search);
  const validThemes = ['red','blue','black','gold','white'];
  const theme = (query.get('theme') || '').toLowerCase();
  const id = query.get('id');
  function send(event, data) {
    if (!started || typeof window.gtag !== 'function') return;
    window.gtag('event', event, data || {});
  }
  function pageEvents() {
    if (page === 'artwork.html') send('artwork_theme_view', { artwork_theme: validThemes.includes(theme) ? theme : 'all' });
    if (page === 'artwork-detail.html' && id && window.ARTWORKS && window.ARTWORKS[id]) {
      const a = window.ARTWORKS[id];
      send('artwork_detail_view', { artwork_id: String(id), artwork_title: a.title, artwork_theme: a.theme });
    }
    if (page === 'smalls_collection-detail.html' && id && window.SMALLS_COLLECTION && window.SMALLS_COLLECTION[id]) {
      const p = window.SMALLS_COLLECTION[id];
      send('product_detail_view', { product_id: String(id), product_name: p.title, product_category: p.category });
    }
  }
  function start() {
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    document.head.appendChild(tag);
    pageEvents();
  }
  function setChoice(value) {
    choice = value;
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === 'accepted') start();
    if (value === 'rejected' && started) {
      // Consent revocation: stop sending events and remove GA cookies where accessible.
      started = false;
      window['ga-disable-' + ID] = true;
      document.cookie.split(';').forEach(function (part) {
        const name = part.split('=')[0].trim();
        if (/^_ga(?:_|$)/.test(name)) {
          document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
          const parts = location.hostname.split('.');
          for (let i = 0; i < parts.length - 1; i++) document.cookie = name + '=; Max-Age=0; path=/; domain=.' + parts.slice(i).join('.') + '; SameSite=Lax';
        }
      });
    }
    if (value === 'accepted') window['ga-disable-' + ID] = false;
    render();
  }
  function render() {
    const banner = document.getElementById('analytics-consent');
    if (banner) banner.hidden = choice === 'accepted' || choice === 'rejected';
  }
  function init() {
    const banner = document.createElement('aside');
    banner.id = 'analytics-consent';
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-label', 'Optional website analytics');
    banner.innerHTML = '<p>May we use optional Google Analytics cookies to understand visits to this website? We do not use Google Analytics for advertising. <a href="privacy-policy.html">Privacy Policy</a></p><div class="analytics-consent-actions"><button type="button" data-analytics-choice="rejected">DECLINE</button><button type="button" data-analytics-choice="accepted">ACCEPT ANALYTICS</button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (e) {
      const button = e.target.closest('[data-analytics-choice]');
      if (button) setChoice(button.dataset.analyticsChoice);
    });
    document.querySelectorAll('[data-analytics-settings]').forEach(function (button) {
      button.addEventListener('click', function () { choice = null; render(); });
    });
    render();
    if (choice === 'accepted') start();
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;
      if (link.matches('.grid-art')) {
        const u = new URL(link.href, location.href);
        send('artwork_select', { artwork_id: u.searchParams.get('id') || '' });
      }
      if (link.matches('.small-item')) {
        const u = new URL(link.href, location.href);
        send('product_select', { product_id: u.searchParams.get('id') || '' });
      }
      if (link.id === 'smalls-buy-now' && link.hasAttribute('href') && link.getAttribute('aria-disabled') !== 'true') {
        const p = window.SMALLS_COLLECTION && window.SMALLS_COLLECTION[id];
        send('begin_checkout', { product_id: id || '', product_name: p ? p.title : '', product_category: p ? p.category : '' });
      }
      if (link.href && /instagram\.com/i.test(link.hostname)) send('instagram_click', { link_location: link.closest('.drawer') ? 'drawer' : 'contact' });
      if (link.protocol === 'mailto:') send('contact_email_click');
    });
    document.querySelectorAll('.inquiry-form, .email-form').forEach(function (form) {
      form.addEventListener('submit', function () {
        // Hidden Google Forms iframe cannot reliably confirm acceptance; count attempts only.
        if (form.matches('.email-form')) send('subscribe_submit_attempt');
        else if (page === 'artwork-detail.html') send('artwork_inquiry_submit_attempt', { artwork_id: id || '' });
        else {
          const p = window.SMALLS_COLLECTION && window.SMALLS_COLLECTION[id];
          send('product_inquiry_submit_attempt', { product_id: id || '', product_category: p ? p.category : '' });
        }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
