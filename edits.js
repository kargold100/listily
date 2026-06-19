// ─── Listily Analytics ────────────────────────────────────────────────────────
// Lightweight client-side usage tracking using localStorage.
// No external services, no cookies, no PII collected.
// Tracks: page views, searches, filter usage, business/opp/mentor card clicks.
// Admin can view and export from the Analytics tab.

(function() {
  'use strict';

  const STORE_KEY = '_listily_analytics';
  const MAX_EVENTS = 500; // cap storage to ~50KB

  // ── Read / write ────────────────────────────────────────────────
  function getStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : { events: [], session_count: 0, first_visit: null };
    } catch(e) { return { events: [], session_count: 0, first_visit: null }; }
  }

  function saveStore(store) {
    try {
      // Keep only the most recent MAX_EVENTS
      if (store.events.length > MAX_EVENTS) {
        store.events = store.events.slice(-MAX_EVENTS);
      }
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch(e) {} // storage full — fail silently
  }

  // ── Track an event ──────────────────────────────────────────────
  function track(type, data) {
    const store = getStore();
    const now = new Date();
    store.events.push({
      t: type,
      d: data || {},
      ts: now.toISOString(),
      pg: window.location.pathname.split('/').pop() || 'index.html',
      ss: getSessionId()
    });
    if (!store.first_visit) store.first_visit = now.toISOString();
    saveStore(store);
  }

  // ── Session ID (reset after 30 min inactivity) ──────────────────
  function getSessionId() {
    const SESSION_KEY = '_listily_sid';
    const SESSION_TTL = 30 * 60 * 1000; // 30 minutes
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Date.now() - s.ts < SESSION_TTL) {
          s.ts = Date.now();
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
          return s.id;
        }
      }
      // New session
      const store = getStore();
      store.session_count = (store.session_count || 0) + 1;
      saveStore(store);
      const id = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, ts: Date.now() }));
      return id;
    } catch(e) { return 'unknown'; }
  }

  // ── Expose tracking API ─────────────────────────────────────────
  window.Listily = window.Listily || {};
  window.Listily.track = track;
  window.Listily.getStore = getStore;
  window.Listily.clearAnalytics = function() {
    localStorage.removeItem(STORE_KEY);
    sessionStorage.removeItem('_listily_sid');
  };
  window.Listily.exportCSV = function() {
    const store = getStore();
    const rows = [['Timestamp','Page','Event','Session','Details']];
    store.events.forEach(e => {
      rows.push([e.ts, e.pg, e.t, e.ss, JSON.stringify(e.d)]);
    });
    const csv = rows.map(r => r.map(c => '"' + String(c||'').replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'listily-analytics-' + new Date().toISOString().slice(0,10) + '.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Auto-track page view ────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    track('pageview', {
      title: document.title,
      referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
      params: Object.keys(params).length ? params : undefined
    });

    // ── Track search box usage ──────────────────────────────────
    const bizSearch = document.getElementById('hs-kw-biz');
    if (bizSearch) {
      bizSearch.addEventListener('change', function() {
        if (this.value.trim()) track('search_biz', { q: this.value.trim().slice(0,60) });
      });
    }
    const oppSearch = document.getElementById('hs-kw-opp');
    if (oppSearch) {
      oppSearch.addEventListener('change', function() {
        if (this.value.trim()) track('search_opp', { q: this.value.trim().slice(0,60) });
      });
    }

    // ── Track directory filters ─────────────────────────────────
    const dirSearch = document.getElementById('f-keyword');
    if (dirSearch) {
      let filterTimer;
      dirSearch.addEventListener('input', function() {
        clearTimeout(filterTimer);
        filterTimer = setTimeout(() => {
          if (this.value.trim()) track('filter_keyword', { q: this.value.trim().slice(0,60) });
        }, 1000);
      });
    }
    const stateFilter = document.getElementById('f-state');
    if (stateFilter) {
      stateFilter.addEventListener('change', function() {
        if (this.value) track('filter_state', { state: this.value });
      });
    }
    const indFilter = document.getElementById('f-industry');
    if (indFilter) {
      indFilter.addEventListener('change', function() {
        if (this.value) track('filter_industry', { industry: this.value });
      });
    }

    // ── Track register form tab switches ───────────────────────
    ['tab-biz','tab-opp','tab-mentor'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', function() {
        track('register_tab', { tab: id.replace('tab-','') });
      });
    });

    // ── Track CTA button clicks ─────────────────────────────────
    document.querySelectorAll('.btn-primary, .btn-mentor, .btn-cta-white').forEach(btn => {
      btn.addEventListener('click', function() {
        const label = (this.textContent || '').trim().slice(0,50);
        const href = this.getAttribute('href') || '';
        if (href) track('cta_click', { label, href });
      });
    });

    // ── Track industry card clicks on homepage ──────────────────
    document.getElementById('industry-grid')?.addEventListener('click', function(e) {
      const card = e.target.closest('.ind-card');
      if (card) {
        const name = card.querySelector('.ind-name')?.textContent || '';
        track('industry_click', { industry: name });
      }
    });

    // ── Track state chip clicks ─────────────────────────────────
    document.querySelectorAll('.state-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        track('state_chip_click', { state: this.textContent.trim().split(' ')[0] });
      });
    });
  });

})();
