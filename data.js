// ─── Listily Edit Submissions ────────────────────────────────────────────────
// Allows business owners or members of the public to submit edits to listings.
// Admin reviews and applies the edit (or rejects it).
//
// Uses the SAME pluggable storage adapter pattern as reviews.js so you can
// switch from localStorage (demo) to a shared backend (Google Sheets, Firebase,
// Supabase) with a single config change.
//
// CHANGE THIS LINE TO SWITCH BACKENDS:
//   STORAGE_ADAPTER = 'localStorage'  → demo / single-device only (default)
//   STORAGE_ADAPTER = 'sheets'        → Google Sheets via Apps Script webhook
//   STORAGE_ADAPTER = 'firebase'      → Firebase Realtime Database
//   STORAGE_ADAPTER = 'supabase'      → Supabase (Postgres)
//
// See REVIEWS_BACKEND_SETUP.md — same setup applies.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────
  //  CONFIGURATION — same pattern as reviews.js
  // ────────────────────────────────────────────────────────
  // Runtime-configurable backend (same pattern as reviews.js)
  function getRuntimeConfig() {
    try { return JSON.parse(localStorage.getItem('_listily_backend_cfg') || '{}'); }
    catch (e) { return {}; }
  }
  const cfg = getRuntimeConfig();
  const SHEETS_URL = cfg.sheets || '';
  const STORAGE_ADAPTER = (cfg.adapter === 'auto' || !cfg.adapter)
    ? (SHEETS_URL ? 'sheets' : 'localStorage')
    : cfg.adapter;
  const WEBHOOK_URLS = { sheets: SHEETS_URL, firebase: '', supabase: '' };
  const STORE_KEY = '_listily_edits';

  // ── LocalStorage adapter ──────────────────────────────
  const LocalAdapter = {
    getAll() {
      try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
      catch (e) { return []; }
    },
    saveAll(edits) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(edits)); } catch (e) {}
    },
    add(edit) { const all = this.getAll(); all.push(edit); this.saveAll(all); return edit; },
    update(id, patch) {
      const all = this.getAll();
      const r = all.find(x => x.id === id);
      if (r) { Object.assign(r, patch); this.saveAll(all); }
    },
    remove(id) {
      const all = this.getAll();
      this.saveAll(all.filter(x => x.id !== id));
    },
    backendName: 'Browser localStorage (single-device demo)',
    isShared: false,
  };

  // ── Sheets adapter (scaffold, ready to wire) ──────────
  const SheetsAdapter = {
    async getAll() {
      try {
        const res = await fetch(WEBHOOK_URLS.sheets + '?action=getEdits');
        return await res.json();
      } catch (e) { console.warn('Sheets edits getAll error:', e); return []; }
    },
    async add(edit) {
      try {
        await fetch(WEBHOOK_URLS.sheets, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'addEdit', edit })
        });
        return edit;
      } catch (e) { console.warn('Sheets edit add error:', e); return null; }
    },
    async update(id, patch) {
      try {
        await fetch(WEBHOOK_URLS.sheets, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updateEdit', id, patch })
        });
      } catch (e) { console.warn('Sheets edit update error:', e); }
    },
    async remove(id) {
      try {
        await fetch(WEBHOOK_URLS.sheets, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'removeEdit', id })
        });
      } catch (e) { console.warn('Sheets edit remove error:', e); }
    },
    backendName: 'Google Sheets (shared)',
    isShared: true,
  };

  const adapter = (STORAGE_ADAPTER === 'sheets') ? SheetsAdapter : LocalAdapter;

  // ── In-memory cache for synchronous reads ────────────
  let _cache = null;
  async function _load() {
    if (_cache) return _cache;
    _cache = adapter.getAll instanceof Function
      ? (Array.isArray(adapter.getAll()) ? adapter.getAll() : await adapter.getAll())
      : [];
    return _cache;
  }
  _load();
  function refresh() { _cache = null; return _load(); }
  function getAllSync() { return _cache || adapter.getAll() || []; }

  // ── Public API ────────────────────────────────────────
  window.ListingEdits = {
    backend:  () => adapter.backendName,
    isShared: () => adapter.isShared,
    refresh,

    getAll:  getAllSync,

    // Pending edits for a specific listing
    getFor(listingId, listingType) {
      return getAllSync().filter(e =>
        String(e.listingId) === String(listingId) &&
        e.listingType === listingType
      ).sort((a, b) => new Date(b.ts) - new Date(a.ts));
    },

    // Pending edits (admin)
    getPending() {
      return getAllSync().filter(e => e.status === 'pending')
                         .sort((a, b) => new Date(b.ts) - new Date(a.ts));
    },

    // Submit an edit request
    submit(data) {
      const all = getAllSync();
      // Prevent duplicate from same device within 1h
      const recent = all.find(e =>
        String(e.listingId) === String(data.listingId) &&
        e.listingType === data.listingType &&
        e.device === getDeviceId() &&
        (Date.now() - new Date(e.ts).getTime()) < 3600000
      );
      if (recent) return { ok: false, msg: 'You have already submitted an edit for this listing in the last hour.' };

      // Whitelist allowed fields
      const allowed = ['name','desc','phone','mobile','wa','email','web','suburb','state','address','hours','tags','industry','cat'];
      const changes = {};
      for (const k of allowed) {
        if (data.changes && data.changes[k] !== undefined) changes[k] = data.changes[k];
      }

      const edit = {
        id:          'e' + Date.now() + Math.random().toString(36).slice(2, 6),
        listingId:   String(data.listingId),
        listingType: data.listingType,
        listingName: data.listingName || '',
        submitterName:  (data.submitterName || 'Anonymous').trim().slice(0, 80),
        submitterEmail: (data.submitterEmail || '').trim().slice(0, 120),
        submitterRole:  data.submitterRole || 'public',   // 'owner' | 'staff' | 'public'
        relationship:   (data.relationship || '').trim().slice(0, 200),
        changes:        changes,
        reason:         (data.reason || '').trim().slice(0, 500),
        ts:             new Date().toISOString(),
        device:         getDeviceId(),
        status:         'pending',  // 'pending' | 'approved' | 'rejected' | 'applied'
        adminNotes:     '',
      };

      adapter.add(edit);
      if (_cache) _cache.push(edit);

      if (window.Listily?.track) {
        window.Listily.track('edit_submit', {
          listingId: edit.listingId,
          listingType: edit.listingType,
          role: edit.submitterRole,
          fields: Object.keys(changes),
        });
      }
      return { ok: true, edit };
    },

    approve(id, applied) {
      const all = getAllSync();
      const e = all.find(x => x.id === id);
      if (e) {
        e.status = applied ? 'applied' : 'approved';
        adapter.update(id, { status: e.status });
      }
    },

    reject(id, notes) {
      const all = getAllSync();
      const e = all.find(x => x.id === id);
      if (e) {
        e.status = 'rejected';
        e.adminNotes = (notes || '').slice(0, 300);
        adapter.update(id, { status: 'rejected', adminNotes: e.adminNotes });
      }
    },

    purge(id) {
      adapter.remove(id);
      if (_cache) _cache = _cache.filter(x => x.id !== id);
    },

    exportCSV() {
      const all = getAllSync();
      const rows = [['ID','Listing','Type','Submitter','Email','Role','Changes','Reason','Date','Status']];
      all.forEach(e => rows.push([
        e.id, e.listingName, e.listingType, e.submitterName, e.submitterEmail,
        e.submitterRole, JSON.stringify(e.changes), e.reason, e.ts.slice(0,10), e.status
      ]));
      const csv = rows.map(row => row.map(c => '"' + String(c||'').replace(/"/g,'""') + '"').join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'listily-edits-' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
    },

    clearAll() {
      const all = getAllSync();
      all.forEach(e => adapter.remove(e.id));
      _cache = [];
    },
  };

  function getDeviceId() {
    let id = sessionStorage.getItem('_listily_dev');
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('_listily_dev', id);
    }
    return id;
  }

  // ── UI helper: render edit form for a listing ────────
  window.ListingEdits.renderForm = function (containerId, listing, listingType) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const lid = listing.id;
    const isMentor = listingType === 'mentor';
    const isOpp    = listingType === 'opportunity';

    const fieldHTML = (label, key, val, type='text', placeholder='') => `
      <div class="form-group" style="margin-bottom:10px">
        <label style="font-size:12px;font-weight:500;color:var(--text-2)">${label}</label>
        ${type === 'textarea'
          ? `<textarea id="edit-${key}-${lid}" rows="2" placeholder="${escHtml(placeholder)}">${escHtml(val||'')}</textarea>`
          : `<input type="${type}" id="edit-${key}-${lid}" value="${escHtml(val||'')}" placeholder="${escHtml(placeholder)}">`}
      </div>`;

    el.innerHTML = `
      <div style="margin-top:1rem;padding:1rem;background:var(--bg-tint);border-radius:var(--r-lg);border:1px solid var(--border)">
        <h4 style="font-size:14px;font-weight:600;margin-bottom:.25rem;display:flex;align-items:center;gap:8px">
          <i class="fa-solid fa-pen-to-square" style="color:var(--brand)"></i> Suggest an edit
        </h4>
        <p style="font-size:12px;color:var(--text-3);margin-bottom:1rem;line-height:1.5">Are you the business owner, or did you notice something incorrect? Submit your suggested changes and an admin will review them.</p>
        <div id="edit-form-${lid}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div class="form-group" style="margin-bottom:10px">
              <label style="font-size:12px;font-weight:500;color:var(--text-2)">Your name <span style="color:var(--red-t)">*</span></label>
              <input type="text" id="edit-submitter-${lid}" placeholder="Your name" maxlength="80">
            </div>
            <div class="form-group" style="margin-bottom:10px">
              <label style="font-size:12px;font-weight:500;color:var(--text-2)">Your email <span style="color:var(--red-t)">*</span></label>
              <input type="email" id="edit-email-${lid}" placeholder="So admin can confirm with you" maxlength="120">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:10px">
            <label style="font-size:12px;font-weight:500;color:var(--text-2)">Your relationship to this listing <span style="color:var(--red-t)">*</span></label>
            <select id="edit-role-${lid}">
              <option value="">Select…</option>
              <option value="owner">I am the business owner / mentor / poster</option>
              <option value="staff">I work at this business</option>
              <option value="public">I am a member of the public reporting an issue</option>
            </select>
          </div>
          <div style="border-top:1px solid var(--border);margin:1rem 0;padding-top:1rem">
            <p style="font-size:12px;font-weight:600;color:var(--text-2);margin-bottom:8px">Fill in only the fields you want to update — leave the rest blank.</p>
            ${!isOpp && !isMentor ? `
              ${fieldHTML('Business name', 'name', listing.name, 'text', listing.name)}
              ${fieldHTML('Suburb',        'suburb', listing.suburb, 'text', listing.suburb)}
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                ${fieldHTML('Phone',  'phone',  listing.phone||'',  'tel', '03 9000 0000')}
                ${fieldHTML('Mobile', 'mobile', listing.mobile||'', 'tel', '04xx xxx xxx')}
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                ${fieldHTML('Email',   'email', listing.email||'', 'email', 'info@example.com.au')}
                ${fieldHTML('Website', 'web',   listing.web||'',   'url',   'https://…')}
              </div>
              ${fieldHTML('Description', 'desc', listing.desc||'', 'textarea', 'Short description of the business')}
            ` : isMentor ? `
              ${fieldHTML('Name',       'name',  listing.name, 'text', listing.name)}
              ${fieldHTML('Speciality', 'cat',   listing.specialty||'', 'text', '')}
              ${fieldHTML('Email',      'email', listing.email||'',     'email', '')}
              ${fieldHTML('Bio',        'desc',  listing.bio||'',       'textarea', '')}
            ` : `
              ${fieldHTML('Title',  'name', listing.title||'', 'text', '')}
              ${fieldHTML('Email',  'email', listing.email||'', 'email', '')}
              ${fieldHTML('Description', 'desc', listing.desc||'', 'textarea', '')}
            `}
          </div>
          <div class="form-group" style="margin-bottom:10px">
            <label style="font-size:12px;font-weight:500;color:var(--text-2)">Reason for the edit <span style="color:var(--text-3)">(optional, helps admin)</span></label>
            <textarea id="edit-reason-${lid}" rows="2" placeholder="e.g. We changed phone numbers · I noticed the suburb is wrong · Hours have changed" maxlength="500"></textarea>
          </div>
          <div style="font-size:11px;color:var(--text-3);margin-bottom:10px;padding:8px 12px;background:var(--bg-card);border-radius:var(--r-md);border:1px solid var(--border)">
            <i class="fa-solid fa-circle-info" style="color:var(--brand)"></i>
            All edits are reviewed by an admin before going live. We may contact you to verify the changes.
          </div>
          <button onclick="submitEditFor('${lid}','${listingType}','${escHtml((listing.name||listing.title||'')).replace(/'/g,"\\'")}')" class="btn btn-primary" style="width:100%;justify-content:center">
            <i class="fa-solid fa-paper-plane"></i> Submit edit
          </button>
        </div>
        <div id="edit-success-${lid}" style="display:none;padding:1rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-lg);text-align:center;font-size:13px;color:var(--green-t)">
          <i class="fa-solid fa-circle-check" style="font-size:20px;display:block;margin-bottom:6px"></i>
          <strong>Edit submitted — thank you!</strong><br>
          An admin will review your suggested changes within 24 hours.
        </div>
      </div>`;
  };

  // ── Toggle-able trigger button (for use in modal) ────
  window.ListingEdits.renderTrigger = function (containerId, listing, listingType) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const lid = listing.id;
    el.innerHTML = `
      <button onclick="toggleEditForm('${lid}','${listingType}')"
        style="background:none;border:1px solid var(--border);color:var(--text-2);font-size:12px;padding:6px 12px;border-radius:var(--r-full);cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:var(--font);transition:all .15s"
        onmouseover="this.style.background='var(--bg-tint)';this.style.borderColor='var(--brand-border)';this.style.color='var(--brand-dark)'"
        onmouseout="this.style.background='none';this.style.borderColor='var(--border)';this.style.color='var(--text-2)'">
        <i class="fa-solid fa-pen-to-square"></i> Suggest an edit
      </button>
      <div id="edit-form-wrap-${lid}" style="display:none"></div>`;
  };

  // Globally available
  window.toggleEditForm = function (lid, listingType) {
    const wrap = document.getElementById('edit-form-wrap-' + lid);
    if (!wrap) return;
    if (wrap.style.display === 'none') {
      wrap.style.display = 'block';
      // Find the listing data
      let listing = null;
      if (listingType === 'business' && typeof DB !== 'undefined')
        listing = DB.find(b => String(b.id) === String(lid));
      else if (listingType === 'mentor' && typeof MENTORS !== 'undefined')
        listing = MENTORS.find(m => String(m.id) === String(lid));
      else if (listingType === 'opportunity' && typeof OPPORTUNITIES !== 'undefined')
        listing = OPPORTUNITIES.find(o => String(o.id) === String(lid));
      if (!listing) return;
      ListingEdits.renderForm('edit-form-wrap-' + lid, listing, listingType);
    } else {
      wrap.style.display = 'none';
    }
  };

  window.submitEditFor = function (lid, listingType, listingName) {
    const submitterName  = document.getElementById('edit-submitter-' + lid)?.value.trim();
    const submitterEmail = document.getElementById('edit-email-'     + lid)?.value.trim();
    const submitterRole  = document.getElementById('edit-role-'      + lid)?.value;

    if (!submitterName || !submitterEmail || !submitterRole) {
      showToast('Please fill in your name, email and relationship.', 'var(--red-t)');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) {
      showToast('Please enter a valid email address.', 'var(--red-t)');
      return;
    }

    const changes = {};
    ['name','suburb','phone','mobile','email','web','desc','cat'].forEach(key => {
      const v = document.getElementById('edit-' + key + '-' + lid)?.value.trim();
      if (v) changes[key] = v;
    });

    if (Object.keys(changes).length === 0) {
      showToast('Please change at least one field.', 'var(--red-t)');
      return;
    }

    const result = ListingEdits.submit({
      listingId: lid, listingType, listingName,
      submitterName, submitterEmail, submitterRole,
      changes,
      reason: document.getElementById('edit-reason-' + lid)?.value || '',
    });

    if (!result.ok) { showToast(result.msg || 'Could not submit edit.', 'var(--red-t)'); return; }

    document.getElementById('edit-form-' + lid).style.display = 'none';
    document.getElementById('edit-success-' + lid).style.display = 'block';
    showToast('✓ Edit submitted — thank you!');
  };
})();
