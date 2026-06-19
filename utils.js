// ─── Listily Listings — Sheet-backed master data ─────────────────────────────
// When a Google Sheets backend is configured (Admin → Backend setup), this
// module fetches the master business directory from the "Listings" tab and
// merges those listings into the global DB array.
//
// This means:
//   - You can edit listings directly in the Google Sheet
//   - You can bulk upload listings via the Sheet
//   - Edits applied by admin (via "Suggest an edit") update the Sheet too
//   - Every visitor sees the same data on every device
//
// Cache: 60-second localStorage cache to avoid hammering Sheets on every nav.
// Fallback: if Sheet fetch fails, the bundled DB in data.js is used.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const CACHE_KEY = '_listily_listings_cache';
  const CACHE_TTL_MS = 60 * 1000; // 60 seconds

  function getRuntimeConfig() {
    try { return JSON.parse(localStorage.getItem('_listily_backend_cfg') || '{}'); }
    catch (e) { return {}; }
  }
  const cfg = getRuntimeConfig();
  const SHEETS_URL = cfg.sheets || '';
  const SHARED = !!SHEETS_URL;

  // ── Parse a sheet row into a DB-compatible listing ─────────
  function rowToListing(row, idx) {
    if (!row) return null;
    const id = parseInt(row.id, 10);
    if (!id || !row.name) return null;

    const listing = {
      id: id,
      name: String(row.name).trim(),
      industry: String(row.industry || 'Community & Culture').trim(),
      cat: String(row.cat || 'Community Centre').trim(),
      suburb: String(row.suburb || '').trim(),
      state: String(row.state || 'VIC').trim(),
      desc: String(row.desc || '').trim(),
      icon: String(row.icon || '🏢').trim(),
      tags: parseTags(row.tags),
      hours: parseHours(row.hours),
      lastUpdated: String(row.lastUpdated || new Date().toISOString().slice(0, 10)),
      submittedAt: String(row.submittedAt || new Date().toISOString().slice(0, 10)),
      contact: String(row.contact || '').trim(),
      status: String(row.status || 'approved').trim(),
      addedBy: String(row.addedBy || 'sheet').trim(),
    };

    // Optional contact fields - only set if non-empty
    ['phone', 'mobile', 'wa', 'email', 'web', 'address', 'notes'].forEach(k => {
      if (row[k] && String(row[k]).trim()) listing[k] = String(row[k]).trim();
    });

    if (row.featured === true || row.featured === 'true' || row.featured === 'TRUE' || row.featured === 1 || row.featured === '1') {
      listing.featured = true;
    }

    return listing;
  }

  function parseTags(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return String(v).split(/[,|;]/).map(t => t.trim()).filter(Boolean);
  }

  function parseHours(v) {
    if (!v) {
      return { Mon:'9am–5pm', Tue:'9am–5pm', Wed:'9am–5pm', Thu:'9am–5pm', Fri:'9am–5pm', Sat:'Closed', Sun:'Closed', PH:'Closed' };
    }
    if (typeof v === 'object') return v;
    // Try to parse JSON string
    try { return JSON.parse(v); } catch (e) {}
    // Otherwise treat as a single "always open" hours string
    const s = String(v).trim();
    return { Mon:s, Tue:s, Wed:s, Thu:s, Fri:s, Sat:s, Sun:s, PH:s };
  }

  // ── Fetch from sheet (with cache) ──────────────────────────
  async function fetchListings() {
    if (!SHARED) return null;

    // Try cache first
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.ts && (Date.now() - cached.ts) < CACHE_TTL_MS) {
        return cached.data;
      }
    } catch (e) {}

    try {
      const res = await fetch(SHEETS_URL + '?action=getListings');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid response');

      // Save cache
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch (e) {}
      return data;
    } catch (e) {
      console.warn('[Listily] Could not fetch listings from sheet:', e.message);
      return null;
    }
  }

  // ── Merge sheet listings into in-memory DB ─────────────────
  function mergeIntoD(rows) {
    if (!Array.isArray(rows) || typeof DB === 'undefined') return 0;
    let added = 0, updated = 0;
    rows.forEach((row, idx) => {
      const listing = rowToListing(row, idx);
      if (!listing) return;
      const existing = DB.findIndex(b => String(b.id) === String(listing.id));
      if (existing > -1) {
        // Merge — sheet wins
        DB[existing] = { ...DB[existing], ...listing };
        updated++;
      } else {
        DB.push(listing);
        added++;
      }
    });
    return { added, updated };
  }

  // ── Public API ─────────────────────────────────────────────
  window.SheetListings = {
    isShared: () => SHARED,
    backend: () => SHARED ? 'Google Sheets (Listings tab)' : 'Bundled data.js only',

    // Re-fetch from sheet, ignoring cache
    async refresh() {
      try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
      const rows = await fetchListings();
      if (!rows) return null;
      const result = mergeIntoD(rows);
      console.info(`[Listily] Sheet sync: ${result.added} added, ${result.updated} updated`);
      // Re-render current page if a render hook exists
      if (typeof window.applyOverridesAndRender === 'function') window.applyOverridesAndRender();
      if (typeof window.renderHome === 'function') window.renderHome();
      if (typeof window.renderDirectoryPage === 'function') window.renderDirectoryPage();
      return result;
    },

    // Push a listing to the sheet (used by admin when applying edits)
    async upsert(listing) {
      if (!SHARED) return false;
      try {
        await fetch(SHEETS_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'upsertListing', listing })
        });
        try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
        return true;
      } catch (e) {
        console.warn('[Listily] Could not upsert listing:', e.message);
        return false;
      }
    },

    // Delete a listing from the sheet
    async deleteListing(id) {
      if (!SHARED) return false;
      try {
        await fetch(SHEETS_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'deleteListing', id: String(id) })
        });
        // Remove from in-memory DB too
        if (typeof DB !== 'undefined') {
          const idx = DB.findIndex(b => String(b.id) === String(id));
          if (idx > -1) DB.splice(idx, 1);
        }
        try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
        return true;
      } catch (e) { return false; }
    },

    // Bulk push many listings (used by admin bulk upload)
    async bulkUpsert(listings) {
      if (!SHARED) return false;
      if (!Array.isArray(listings) || !listings.length) return false;
      // Send in batches of 50 to avoid request size limits
      const BATCH = 50;
      for (let i = 0; i < listings.length; i += BATCH) {
        const batch = listings.slice(i, i + BATCH);
        try {
          await fetch(SHEETS_URL, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'bulkUpsertListings', listings: batch })
          });
        } catch (e) {
          console.warn('[Listily] Batch failed:', e.message);
        }
      }
      try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
      return true;
    },
  };

  // ── On script load: fetch and merge into DB ────────────────
  async function init() {
    if (!SHARED) return;
    const rows = await fetchListings();
    if (rows) {
      const result = mergeIntoD(rows);
      console.info(`[Listily] Loaded ${rows.length} listings from sheet (${result.added} added, ${result.updated} updated)`);
      // After merging, ask any overrides system to re-apply on top
      if (typeof window.ListingOverrides !== 'undefined' && window.ListingOverrides.applyAll) {
        window.ListingOverrides.applyAll();
      }
      // Trigger re-render of current page
      ['renderHome', 'renderDirectoryPage', 'renderMentors', 'renderOpps'].forEach(fn => {
        if (typeof window[fn] === 'function') {
          try { window[fn](); } catch (e) {}
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
