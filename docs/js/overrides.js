// ─── Listing Overrides ───────────────────────────────────────────────────────
// When an admin applies an edit submission, the change is saved here as an
// "override" — a delta layered on top of the static data.js entries.
//
// This means an applied edit (e.g. updated phone number) is visible to ALL
// visitors on the next page load, not just the admin who applied it.
//
// Uses the same pluggable backend storage as Reviews and Edits.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const STORE_KEY = '_listily_overrides';

  function getRuntimeConfig() {
    try { return JSON.parse(localStorage.getItem('_listily_backend_cfg') || '{}'); }
    catch (e) { return {}; }
  }
  const cfg = getRuntimeConfig();
  const SHEETS_URL = cfg.sheets || '';
  const SHARED = !!SHEETS_URL;

  // Local adapter
  const LocalAdapter = {
    getAll() {
      try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
      catch (e) { return []; }
    },
    saveAll(arr) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {}
    },
    add(ov) {
      const all = this.getAll();
      // Replace existing override for same listing/type
      const idx = all.findIndex(x => String(x.listingId) === String(ov.listingId) && x.listingType === ov.listingType);
      if (idx > -1) {
        all[idx] = { ...all[idx], ...ov, changes: { ...all[idx].changes, ...ov.changes } };
      } else {
        all.push(ov);
      }
      this.saveAll(all);
      return ov;
    },
    clear() { localStorage.removeItem(STORE_KEY); },
  };

  // Sheets adapter — reuses the same Apps Script endpoint
  const SheetsAdapter = {
    async getAll() {
      try {
        const res = await fetch(SHEETS_URL + '?action=getOverrides');
        return await res.json();
      } catch (e) { console.warn('Overrides getAll error:', e); return []; }
    },
    async add(ov) {
      try {
        await fetch(SHEETS_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'addOverride', override: ov })
        });
      } catch (e) { console.warn('Overrides add error:', e); }
      // Also save locally so admin sees it immediately
      LocalAdapter.add(ov);
    },
    clear() { LocalAdapter.clear(); /* don't auto-clear shared backend */ },
  };

  const adapter = SHARED ? SheetsAdapter : LocalAdapter;

  // ── Public API ─────────────────────────────────────────────
  window.ListingOverrides = {
    getAll() { return LocalAdapter.getAll(); /* sync, from local cache */ },

    isShared: () => SHARED,

    save(override) {
      const ov = {
        listingId:   String(override.listingId),
        listingType: override.listingType,
        changes:     override.changes || {},
        appliedBy:   override.appliedBy || 'admin',
        ts:          override.ts || new Date().toISOString(),
      };
      adapter.add(ov);
      return ov;
    },

    // Fetch fresh overrides from backend (call on page load if shared)
    async refresh() {
      if (!SHARED) return;
      try {
        const remote = await SheetsAdapter.getAll();
        if (Array.isArray(remote)) {
          LocalAdapter.saveAll(remote);
          applyAll();
        }
      } catch (e) { /* silent */ }
    },

    // Apply all overrides to in-memory DB / MENTORS / OPPORTUNITIES
    applyAll: applyAll,

    clear() { adapter.clear(); },
  };

  // ── Apply overrides to source arrays ───────────────────────
  function applyAll() {
    const all = LocalAdapter.getAll();
    let appliedCount = 0;
    all.forEach(ov => {
      let arr = null;
      if (ov.listingType === 'business' && typeof DB !== 'undefined') arr = DB;
      else if (ov.listingType === 'mentor' && typeof MENTORS !== 'undefined') arr = MENTORS;
      else if (ov.listingType === 'opportunity' && typeof OPPORTUNITIES !== 'undefined') arr = OPPORTUNITIES;
      if (!arr) return;
      const target = arr.find(x => String(x.id) === String(ov.listingId));
      if (!target) return;
      Object.entries(ov.changes || {}).forEach(([k, v]) => {
        if (v !== '' && v !== undefined && v !== null) target[k] = v;
      });
      target.lastUpdated = ov.ts ? ov.ts.slice(0, 10) : target.lastUpdated;
      appliedCount++;
    });
    if (appliedCount > 0 && window.console) {
      console.info(`[Listily] Applied ${appliedCount} override(s) to listings`);
    }
  }

  // Apply on script load (after data.js loads)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyAll();
      if (SHARED) ListingOverrides.refresh();
    });
  } else {
    applyAll();
    if (SHARED) ListingOverrides.refresh();
  }
})();
