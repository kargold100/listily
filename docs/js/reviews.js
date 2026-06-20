// ─── Listily Reviews System ───────────────────────────────────────────────────
// Reviews work with a pluggable STORAGE_ADAPTER so the same review UI works
// whether you use localStorage (single-device demo) or a real backend.
//
// CHANGE THIS LINE TO SWITCH BACKENDS:
//   STORAGE_ADAPTER = 'localStorage'  → demo / single-device only (default)
//   STORAGE_ADAPTER = 'sheets'        → Google Sheets via Apps Script webhook
//   STORAGE_ADAPTER = 'firebase'      → Firebase Realtime Database
//   STORAGE_ADAPTER = 'supabase'      → Supabase (Postgres)
//
// See REVIEWS_BACKEND_SETUP.md for setup instructions for each.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────
  //  CONFIGURATION
  // ────────────────────────────────────────────────────────
  // Runtime-configurable backend:
  //   1. Admin can set the Sheets URL via the Admin > Backend tab (preferred)
  //   2. Or edit BACKEND_DEFAULT below for a hard-coded fallback
  //   3. Or change STORAGE_ADAPTER to bypass localStorage entirely
  const BACKEND_DEFAULT = {
    adapter: 'auto',  // 'auto' = use sheets if URL set, else localStorage
    sheets:  ''       // hard-coded fallback URL (admin panel overrides this)
  };

  function getRuntimeConfig() {
    try {
      const stored = JSON.parse(localStorage.getItem('_listily_backend_cfg') || '{}');
      return Object.assign({}, BACKEND_DEFAULT, stored);
    } catch (e) { return BACKEND_DEFAULT; }
  }

  const cfg = getRuntimeConfig();
  const SHEETS_URL = cfg.sheets || '';
  const STORAGE_ADAPTER = (cfg.adapter === 'auto')
    ? (SHEETS_URL ? 'sheets' : 'localStorage')
    : cfg.adapter || 'localStorage';

  const WEBHOOK_URLS = {
    sheets:    SHEETS_URL,
    firebase:  '',
    supabase:  ''
  };
  // ────────────────────────────────────────────────────────

  const STORE_KEY  = '_listily_reviews';
  const CONFIG_KEY = '_listily_review_cfg';

  // ── LOCAL STORAGE ADAPTER ──────────────────────────────
  const LocalAdapter = {
    getAll() {
      try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
      catch (e) { return []; }
    },
    saveAll(reviews) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(reviews)); } catch (e) {}
    },
    add(review) { const all = this.getAll(); all.push(review); this.saveAll(all); return review; },
    update(id, patch) { const all = this.getAll(); const r = all.find(x => x.id === id); if (r) { Object.assign(r, patch); this.saveAll(all); } },
    remove(id) { const all = this.getAll(); this.saveAll(all.filter(x => x.id !== id)); },
    clear() { localStorage.removeItem(STORE_KEY); },
    backendName: 'Browser localStorage (single-device demo)',
    isShared: false
  };

  // ── SHEETS ADAPTER (placeholder, ready to wire up) ─────
  const SheetsAdapter = {
    async getAll() {
      try {
        const url = WEBHOOK_URLS.sheets + '?action=getAll';
        const res = await fetch(url);
        return await res.json();
      } catch (e) { console.warn('Sheets backend error:', e); return []; }
    },
    async add(review) {
      try {
        await fetch(WEBHOOK_URLS.sheets, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add', review })
        });
        return review;
      } catch (e) { console.warn('Sheets add error:', e); return null; }
    },
    async update(id, patch) {
      try {
        await fetch(WEBHOOK_URLS.sheets, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update', id, patch })
        });
      } catch (e) { console.warn('Sheets update error:', e); }
    },
    async remove(id) {
      try {
        await fetch(WEBHOOK_URLS.sheets, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'remove', id })
        });
      } catch (e) { console.warn('Sheets remove error:', e); }
    },
    clear() { console.warn('Clear all not supported on Sheets backend — do it in the spreadsheet directly.'); },
    backendName: 'Google Sheets (shared, all users see same reviews)',
    isShared: true
  };

  // ── Pick adapter at runtime ─────────────────────────────
  const adapter = (STORAGE_ADAPTER === 'sheets') ? SheetsAdapter : LocalAdapter;
  // (firebase + supabase adapters would go here)

  // ── Config (per-user, e.g. auto-approve toggle) ─────────
  function getConfig() {
    try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveConfig(cfg) {
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  // In-memory cache (so getAll is synchronous for rendering)
  let _cache = null;
  let _loading = null;

  async function _loadAll() {
    if (_cache) return _cache;
    if (!_loading) _loading = Promise.resolve(adapter.getAll());
    _cache = await _loading;
    return _cache;
  }
  // Eagerly load
  _loadAll();

  function refreshCache() {
    _cache = null;
    _loading = null;
    return _loadAll();
  }

  function getAllSync() {
    if (Array.isArray(_cache)) return _cache;
    // Don't call adapter.getAll() here if it's async (Sheets) — that returns a Promise
    // Local adapter is sync and returns array; safe to call
    try {
      const r = adapter.getAll();
      return Array.isArray(r) ? r : [];
    } catch (e) { return []; }
  }

  // ── Public API ─────────────────────────────────────────
  window.Reviews = {
    backend:   () => adapter.backendName,
    isShared:  () => adapter.isShared,
    refresh:   refreshCache,

    getAll: getAllSync,

    // Reviews for a specific listing
    getFor(listingId, listingType, adminMode) {
      return getAllSync().filter(r =>
        String(r.listingId) === String(listingId) &&
        r.listingType === listingType &&
        (adminMode ? true : r.status === 'approved')
      ).sort((a, b) => new Date(b.ts) - new Date(a.ts));
    },

    // Average rating for a listing
    avgRating(listingId, listingType) {
      const approved = this.getFor(listingId, listingType);
      if (!approved.length) return null;
      return (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1);
    },

    // Submit a new review
    submit(data) {
      const cfg = getConfig();
      const autoApprove = cfg.autoApprove || false;
      const all = getAllSync();

      // Prevent duplicate from same device within 24h for same listing
      const recent = all.find(r =>
        String(r.listingId) === String(data.listingId) &&
        r.listingType === data.listingType &&
        r.device === getDeviceId() &&
        (Date.now() - new Date(r.ts).getTime()) < 86400000
      );
      if (recent) return { ok: false, reason: 'duplicate', msg: 'You have already submitted a review for this listing in the last 24 hours.' };

      const review = {
        id:          'r' + Date.now() + Math.random().toString(36).slice(2, 6),
        listingId:   String(data.listingId),
        listingType: data.listingType,
        listingName: data.listingName || '',
        reviewer:    (data.reviewer || 'Anonymous').trim().slice(0, 60),
        rating:      Math.min(5, Math.max(1, parseInt(data.rating) || 5)),
        title:       (data.title || '').trim().slice(0, 100),
        body:        (data.body || '').trim().slice(0, 800),
        suburb:      (data.suburb || '').trim().slice(0, 50),
        ts:          new Date().toISOString(),
        device:      getDeviceId(),
        status:      autoApprove ? 'approved' : 'pending',
        helpful:     0,
        reported:    false,
      };

      adapter.add(review);
      if (_cache) _cache.push(review);

      if (window.Listily?.track) {
        window.Listily.track('review_submit', { listingId: review.listingId, listingType: review.listingType, rating: review.rating });
      }
      return { ok: true, review, pending: !autoApprove };
    },

    markHelpful(id) {
      const all = getAllSync();
      const r = all.find(x => x.id === id);
      if (r) { r.helpful = (r.helpful || 0) + 1; adapter.update(id, { helpful: r.helpful }); }
    },

    report(id) {
      const all = getAllSync();
      const r = all.find(x => x.id === id);
      if (r) { r.reported = true; adapter.update(id, { reported: true }); }
      return true;
    },

    approve(id) {
      const all = getAllSync();
      const r = all.find(x => x.id === id);
      if (r) { r.status = 'approved'; r.reported = false; adapter.update(id, { status: 'approved', reported: false }); }
    },

    remove(id) {
      const all = getAllSync();
      const r = all.find(x => x.id === id);
      if (r) { r.status = 'removed'; adapter.update(id, { status: 'removed' }); }
    },

    purge(id) {
      adapter.remove(id);
      if (_cache) _cache = _cache.filter(x => x.id !== id);
    },

    setAutoApprove(val) { const cfg = getConfig(); cfg.autoApprove = !!val; saveConfig(cfg); },
    getAutoApprove() { return getConfig().autoApprove || false; },

    exportCSV() {
      const all = getAllSync();
      const rows = [['ID','Listing','Type','Reviewer','Rating','Title','Body','Suburb','Date','Status','Helpful','Reported']];
      all.forEach(r => rows.push([r.id, r.listingName, r.listingType, r.reviewer, r.rating, r.title, r.body, r.suburb, r.ts.slice(0,10), r.status, r.helpful, r.reported]));
      const csv = rows.map(row => row.map(c => '"' + String(c||'').replace(/"/g,'""') + '"').join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'listily-reviews-' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
    },

    clearAll() { adapter.clear(); _cache = []; },
  };

  function getDeviceId() {
    let id = sessionStorage.getItem('_listily_dev');
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('_listily_dev', id); }
    return id;
  }

  // ── Star rating HTML builder ───────────────────────────
  window.Reviews.starsHTML = function (rating, size) {
    const r = parseFloat(rating) || 0;
    const sz = size === 'lg' ? '20px' : size === 'md' ? '16px' : '13px';
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(r);
      const half   = !filled && i < r;
      const col    = (filled || half) ? '#F59E0B' : '#D1D5DB';
      const icon   = half ? 'fa-star-half-stroke' : 'fa-star';
      return `<i class="fa-${filled ? 'solid' : half ? 'solid' : 'regular'} ${icon}" style="color:${col};font-size:${sz}"></i>`;
    }).join('');
  };

  // ── Interactive star picker ────────────────────────────
  window.Reviews.starPicker = function (inputId) {
    let chosen = 0;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:4px;margin-bottom:6px;cursor:pointer';
    wrap.setAttribute('role', 'radiogroup');
    wrap.setAttribute('aria-label', 'Rating');

    const els = Array.from({ length: 5 }, (_, i) => {
      const el = document.createElement('i');
      el.className = 'fa-regular fa-star';
      el.style.cssText = 'font-size:28px;color:#D1D5DB;transition:color .1s';
      el.setAttribute('aria-label', `${i+1} star${i>0?'s':''}`);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'radio');
      el.onmouseenter = () => highlight(i + 1);
      el.onmouseleave = () => highlight(chosen);
      el.onclick      = () => { chosen = i + 1; highlight(chosen); setInput(); };
      el.onkeydown    = (e) => { if (e.key === 'Enter' || e.key === ' ') { chosen = i + 1; highlight(chosen); setInput(); } };
      wrap.appendChild(el);
      return el;
    });
    function highlight(n) { els.forEach((el, i) => { el.className = i < n ? 'fa-solid fa-star' : 'fa-regular fa-star'; el.style.color = i < n ? '#F59E0B' : '#D1D5DB'; }); }
    function setInput() { const inp = document.getElementById(inputId); if (inp) { inp.value = chosen; inp.dispatchEvent(new Event('change')); } }
    return wrap;
  };

  // ── Render review list ─────────────────────────────────
  window.Reviews.renderList = function (containerId, listingId, listingType) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const list = Reviews.getFor(listingId, listingType);
    const avg  = Reviews.avgRating(listingId, listingType);

    if (!list.length) {
      el.innerHTML = `<div style="padding:1rem 0;text-align:center;color:var(--text-3);font-size:13px">
        <i class="fa-regular fa-star" style="font-size:24px;display:block;margin-bottom:.5rem;opacity:.3"></i>
        No reviews yet — be the first to leave one.
      </div>`;
      return;
    }
    const dist = [5,4,3,2,1].map(n => ({ n, c: list.filter(r => r.rating === n).length }));
    const max  = Math.max(...dist.map(d => d.c), 1);
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;padding:1rem;background:var(--bg-tint);border-radius:var(--r-lg);margin-bottom:1rem">
        <div style="text-align:center">
          <div style="font-family:var(--font-d);font-size:40px;font-weight:700;line-height:1">${avg}</div>
          <div style="margin:4px 0">${Reviews.starsHTML(avg, 'md')}</div>
          <div style="font-size:12px;color:var(--text-3)">${list.length} review${list.length !== 1 ? 's' : ''}</div>
        </div>
        <div style="flex:1;min-width:160px">
          ${dist.map(({ n, c }) => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:11px;color:var(--text-3);width:10px;text-align:right">${n}</span>
            <i class="fa-solid fa-star" style="color:#F59E0B;font-size:11px"></i>
            <div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden">
              <div style="width:${Math.round(c/max*100)}%;height:100%;background:#F59E0B"></div>
            </div>
            <span style="font-size:11px;color:var(--text-3);width:16px">${c}</span>
          </div>`).join('')}
        </div>
      </div>
      ${list.map(r => `<div class="review-item" style="padding:1rem 0;border-top:1px solid var(--border)">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:6px">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
              ${Reviews.starsHTML(r.rating, 'sm')}
              <span style="font-size:13px;font-weight:600">${escHtml(r.title || '')}</span>
            </div>
            <div style="font-size:11px;color:var(--text-3)">
              ${escHtml(r.reviewer)}${r.suburb ? ` · ${escHtml(r.suburb)}` : ''} · ${new Date(r.ts).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}
            </div>
          </div>
        </div>
        ${r.body ? `<p style="font-size:13px;color:var(--text-2);line-height:1.65;margin-bottom:8px">${escHtml(r.body)}</p>` : ''}
        <div style="display:flex;align-items:center;gap:12px">
          <button onclick="Reviews.markHelpful('${escHtml(r.id)}');this.textContent='👍 Helpful';this.disabled=true" style="font-size:11px;color:var(--text-3);background:none;border:none;cursor:pointer;padding:0">👍 Helpful ${r.helpful > 0 ? `(${r.helpful})` : ''}</button>
          <button onclick="if(confirm('Report this review?')){Reviews.report('${escHtml(r.id)}');this.textContent='Reported';this.disabled=true}" style="font-size:11px;color:var(--text-3);background:none;border:none;cursor:pointer;padding:0">Report</button>
        </div>
      </div>`).join('')}`;
  };

  // ── Render review form ─────────────────────────────────
  window.Reviews.renderForm = function (containerId, listingId, listingType, listingName) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const formId   = 'review-form-' + listingId;
    const ratingId = 'review-rating-' + listingId;
    el.innerHTML = `<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)">
      <h4 style="font-size:14px;font-weight:600;margin-bottom:1rem;display:flex;align-items:center;gap:8px">
        <i class="fa-solid fa-pen-to-square" style="color:var(--brand)"></i> Leave a review
      </h4>
      <div id="${formId}">
        <div style="margin-bottom:10px">
          <div style="font-size:12px;color:var(--text-3);margin-bottom:6px;font-weight:500">Your rating <span style="color:var(--red-t)">*</span></div>
          <div id="star-picker-${listingId}"></div>
          <input type="hidden" id="${ratingId}" value="0">
          <div id="rating-err-${listingId}" style="font-size:12px;color:var(--red-t);display:none">Please select a star rating.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div class="form-group"><label style="font-size:12px;font-weight:500;color:var(--text-2)">Your name <span style="color:var(--text-3)">(optional)</span></label><input type="text" id="review-name-${listingId}" placeholder="First name or initials" maxlength="60"></div>
          <div class="form-group"><label style="font-size:12px;font-weight:500;color:var(--text-2)">Your suburb <span style="color:var(--text-3)">(optional)</span></label><input type="text" id="review-suburb-${listingId}" placeholder="e.g. Point Cook" maxlength="50"></div>
        </div>
        <div class="form-group" style="margin-bottom:10px"><label style="font-size:12px;font-weight:500;color:var(--text-2)">Review headline <span style="color:var(--text-3)">(optional)</span></label><input type="text" id="review-title-${listingId}" placeholder="e.g. Great service, highly recommend" maxlength="100"></div>
        <div class="form-group" style="margin-bottom:10px"><label style="font-size:12px;font-weight:500;color:var(--text-2)">Your review <span style="color:var(--text-3)">(optional)</span></label>
          <textarea id="review-body-${listingId}" rows="3" placeholder="Tell others about your experience…" maxlength="800"></textarea>
          <div style="font-size:11px;color:var(--text-3);text-align:right;margin-top:2px"><span id="review-charcount-${listingId}">0</span>/800</div>
        </div>
        <div style="font-size:12px;color:var(--text-3);margin-bottom:10px;padding:8px 12px;background:var(--bg-tint);border-radius:var(--r-md)">
          <i class="fa-solid fa-circle-info" style="color:var(--brand)"></i>
          Reviews are moderated before appearing publicly. Please be honest and respectful.
        </div>
        <button onclick="submitReviewFor('${listingId}','${listingType}','${escHtml(listingName).replace(/'/g,"\\'")}','${ratingId}')" class="btn btn-primary" style="width:100%;justify-content:center"><i class="fa-solid fa-paper-plane"></i> Submit review</button>
      </div>
      <div id="review-success-${listingId}" style="display:none;padding:1rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-lg);text-align:center;font-size:13px;color:var(--green-t)">
        <i class="fa-solid fa-circle-check" style="font-size:20px;display:block;margin-bottom:6px"></i>
        <strong>Thank you!</strong><br>Your review will appear after moderation.
      </div>
    </div>`;
    const pickerMount = document.getElementById('star-picker-' + listingId);
    if (pickerMount) pickerMount.appendChild(Reviews.starPicker(ratingId));
    const bodyEl = document.getElementById('review-body-' + listingId);
    const ccEl   = document.getElementById('review-charcount-' + listingId);
    if (bodyEl && ccEl) bodyEl.addEventListener('input', () => { ccEl.textContent = bodyEl.value.length; });
  };

  window.submitReviewFor = function (listingId, listingType, listingName, ratingId) {
    const rating = parseInt(document.getElementById(ratingId)?.value || '0');
    const errEl  = document.getElementById('rating-err-' + listingId);
    if (!rating || rating < 1) { if (errEl) errEl.style.display = 'block'; return; }
    if (errEl) errEl.style.display = 'none';
    const result = Reviews.submit({
      listingId, listingType, listingName, rating,
      reviewer: document.getElementById('review-name-' + listingId)?.value || 'Anonymous',
      suburb:   document.getElementById('review-suburb-' + listingId)?.value || '',
      title:    document.getElementById('review-title-' + listingId)?.value || '',
      body:     document.getElementById('review-body-' + listingId)?.value || '',
    });
    if (!result.ok) { showToast(result.msg || 'Could not submit review.', 'var(--red-t)'); return; }
    document.getElementById('review-form-' + listingId).style.display = 'none';
    document.getElementById('review-success-' + listingId).style.display = 'block';
    showToast('✓ Review submitted — thank you!');
  };
})();
