// ─── Listily Reviews System ───────────────────────────────────────────────────
// Reviews are stored in localStorage, keyed by listing id and type.
// Each review: { id, listingId, listingType, listingName, reviewer, rating,
//               title, body, ts, device, status, helpful, reported }
//
// status: 'approved' (visible) | 'pending' (awaiting moderation) | 'removed'
// All new reviews go to 'pending' unless auto-approve is on (admin can toggle).
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const STORE_KEY   = '_listily_reviews';
  const CONFIG_KEY  = '_listily_review_cfg';

  // ── Storage helpers ────────────────────────────────────────────
  function getAll() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function saveAll(reviews) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(reviews)); } catch (e) {}
  }
  function getConfig() {
    try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveConfig(cfg) {
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  // ── Public API ─────────────────────────────────────────────────
  window.Reviews = {

    // All reviews (for admin)
    getAll,

    // Reviews for a specific listing — approved only (or all for admin)
    getFor(listingId, listingType, adminMode) {
      return getAll().filter(r =>
        r.listingId === String(listingId) &&
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
      const reviews = getAll();

      // Prevent duplicate from same device within 24h for same listing
      const recent = reviews.find(r =>
        r.listingId === String(data.listingId) &&
        r.listingType === data.listingType &&
        r.device === getDeviceId() &&
        (Date.now() - new Date(r.ts).getTime()) < 86400000
      );
      if (recent) return { ok: false, reason: 'duplicate', msg: 'You have already submitted a review for this listing in the last 24 hours.' };

      const review = {
        id:          'r' + Date.now() + Math.random().toString(36).slice(2, 6),
        listingId:   String(data.listingId),
        listingType: data.listingType,  // 'business' | 'mentor' | 'opportunity'
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

      reviews.push(review);
      saveAll(reviews);

      // Track in analytics
      if (window.Listily?.track) {
        window.Listily.track('review_submit', {
          listingId: review.listingId,
          listingType: review.listingType,
          rating: review.rating
        });
      }

      return { ok: true, review, pending: !autoApprove };
    },

    // Mark review as helpful
    markHelpful(id) {
      const reviews = getAll();
      const r = reviews.find(x => x.id === id);
      if (r) { r.helpful = (r.helpful || 0) + 1; saveAll(reviews); }
    },

    // Report a review
    report(id) {
      const reviews = getAll();
      const r = reviews.find(x => x.id === id);
      if (r) { r.reported = true; saveAll(reviews); }
      return true;
    },

    // Admin: approve
    approve(id) {
      const reviews = getAll();
      const r = reviews.find(x => x.id === id);
      if (r) { r.status = 'approved'; r.reported = false; saveAll(reviews); }
    },

    // Admin: remove
    remove(id) {
      const reviews = getAll();
      const idx = reviews.findIndex(x => x.id === id);
      if (idx > -1) { reviews[idx].status = 'removed'; saveAll(reviews); }
    },

    // Admin: delete permanently
    purge(id) {
      saveAll(getAll().filter(x => x.id !== id));
    },

    // Admin: toggle auto-approve
    setAutoApprove(val) {
      const cfg = getConfig();
      cfg.autoApprove = !!val;
      saveConfig(cfg);
    },
    getAutoApprove() {
      return getConfig().autoApprove || false;
    },

    // Export all reviews as CSV
    exportCSV() {
      const all = getAll();
      const rows = [['ID','Listing','Type','Reviewer','Rating','Title','Body','Suburb','Date','Status','Helpful','Reported']];
      all.forEach(r => rows.push([r.id, r.listingName, r.listingType, r.reviewer, r.rating, r.title, r.body, r.suburb, r.ts.slice(0,10), r.status, r.helpful, r.reported]));
      const csv = rows.map(row => row.map(c => '"' + String(c||'').replace(/"/g,'""') + '"').join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'listily-reviews-' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
    },

    // Clear all (admin)
    clearAll() { localStorage.removeItem(STORE_KEY); },
  };

  // ── Device fingerprint (anonymous, not PII) ────────────────────
  function getDeviceId() {
    let id = sessionStorage.getItem('_listily_dev');
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('_listily_dev', id);
    }
    return id;
  }

  // ── Star rating HTML builder ───────────────────────────────────
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

  // ── Interactive star picker (for review form) ──────────────────
  window.Reviews.starPicker = function (inputId) {
    const stars = 5;
    let chosen = 0;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:4px;margin-bottom:6px;cursor:pointer';
    wrap.setAttribute('role', 'radiogroup');
    wrap.setAttribute('aria-label', 'Rating');

    const els = Array.from({ length: stars }, (_, i) => {
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

    function highlight(n) {
      els.forEach((el, i) => {
        el.className = i < n ? 'fa-solid fa-star' : 'fa-regular fa-star';
        el.style.color = i < n ? '#F59E0B' : '#D1D5DB';
      });
    }

    function setInput() {
      const inp = document.getElementById(inputId);
      if (inp) { inp.value = chosen; inp.dispatchEvent(new Event('change')); }
    }

    return wrap;
  };

  // ── Render review list ─────────────────────────────────────────
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

    // Summary bar
    const dist = [5,4,3,2,1].map(n => ({ n, c: list.filter(r => r.rating === n).length }));
    const max  = Math.max(...dist.map(d => d.c), 1);

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;padding:1rem;background:var(--bg-tint);border-radius:var(--r-lg);margin-bottom:1rem">
        <div style="text-align:center">
          <div style="font-family:var(--font-d);font-size:40px;font-weight:700;color:var(--text);line-height:1">${avg}</div>
          <div style="margin:4px 0">${Reviews.starsHTML(avg, 'md')}</div>
          <div style="font-size:12px;color:var(--text-3)">${list.length} review${list.length !== 1 ? 's' : ''}</div>
        </div>
        <div style="flex:1;min-width:160px">
          ${dist.map(({ n, c }) => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:11px;color:var(--text-3);width:10px;text-align:right">${n}</span>
              <i class="fa-solid fa-star" style="color:#F59E0B;font-size:11px"></i>
              <div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden">
                <div style="width:${Math.round(c/max*100)}%;height:100%;background:#F59E0B;border-radius:3px"></div>
              </div>
              <span style="font-size:11px;color:var(--text-3);width:16px">${c}</span>
            </div>`).join('')}
        </div>
      </div>
      ${list.map(r => `
        <div class="review-item" id="ri-${escHtml(r.id)}" style="padding:1rem 0;border-top:1px solid var(--border)">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:6px">
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
                ${Reviews.starsHTML(r.rating, 'sm')}
                <span style="font-size:13px;font-weight:600;color:var(--text)">${escHtml(r.title || '')}</span>
              </div>
              <div style="font-size:11px;color:var(--text-3)">
                ${escHtml(r.reviewer)}${r.suburb ? ` · ${escHtml(r.suburb)}` : ''} · ${new Date(r.ts).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}
              </div>
            </div>
          </div>
          ${r.body ? `<p style="font-size:13px;color:var(--text-2);line-height:1.65;margin-bottom:8px">${escHtml(r.body)}</p>` : ''}
          <div style="display:flex;align-items:center;gap:12px">
            <button onclick="Reviews.markHelpful('${escHtml(r.id)}');this.textContent='👍 Helpful ('+parseInt(this.textContent.match(/\\d+/)||0)+')';this.disabled=true"
              style="font-size:11px;color:var(--text-3);background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px">
              👍 Helpful ${r.helpful > 0 ? `(${r.helpful})` : ''}
            </button>
            <button onclick="if(confirm('Report this review as inappropriate?')){Reviews.report('${escHtml(r.id)}');this.textContent='Reported';this.disabled=true}"
              style="font-size:11px;color:var(--text-3);background:none;border:none;cursor:pointer;padding:0">
              Report
            </button>
          </div>
        </div>`).join('')}`;
  };

  // ── Render review form ─────────────────────────────────────────
  window.Reviews.renderForm = function (containerId, listingId, listingType, listingName) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const formId   = 'review-form-' + listingId;
    const ratingId = 'review-rating-' + listingId;

    el.innerHTML = `
      <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)">
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
            <div class="form-group">
              <label style="font-size:12px;font-weight:500;color:var(--text-2)">Your name <span style="color:var(--text-3)">(or leave blank for Anonymous)</span></label>
              <input type="text" id="review-name-${listingId}" placeholder="First name or initials" maxlength="60">
            </div>
            <div class="form-group">
              <label style="font-size:12px;font-weight:500;color:var(--text-2)">Your suburb <span style="color:var(--text-3)">(optional)</span></label>
              <input type="text" id="review-suburb-${listingId}" placeholder="e.g. Point Cook" maxlength="50">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:10px">
            <label style="font-size:12px;font-weight:500;color:var(--text-2)">Review headline <span style="color:var(--text-3)">(optional)</span></label>
            <input type="text" id="review-title-${listingId}" placeholder="e.g. Great service, highly recommend" maxlength="100">
          </div>
          <div class="form-group" style="margin-bottom:10px">
            <label style="font-size:12px;font-weight:500;color:var(--text-2)">Your review <span style="color:var(--text-3)">(optional but helpful)</span></label>
            <textarea id="review-body-${listingId}" rows="3" placeholder="Tell others about your experience — what was good, what could be better…" maxlength="800"></textarea>
            <div style="font-size:11px;color:var(--text-3);text-align:right;margin-top:2px">
              <span id="review-charcount-${listingId}">0</span>/800
            </div>
          </div>
          <div style="font-size:12px;color:var(--text-3);margin-bottom:10px;padding:8px 12px;background:var(--bg-tint);border-radius:var(--r-md)">
            <i class="fa-solid fa-circle-info" style="color:var(--brand)"></i>
            Reviews are moderated before appearing publicly. Please be honest and respectful.
          </div>
          <button onclick="submitReviewFor('${listingId}','${listingType}','${escHtml(listingName).replace(/'/g,"\\'")}','${ratingId}')"
            class="btn btn-primary" style="width:100%;justify-content:center">
            <i class="fa-solid fa-paper-plane"></i> Submit review
          </button>
        </div>
        <div id="review-success-${listingId}" style="display:none;padding:1rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-lg);text-align:center;font-size:13px;color:var(--green-t)">
          <i class="fa-solid fa-circle-check" style="font-size:20px;display:block;margin-bottom:6px"></i>
          <strong>Thank you for your review!</strong><br>
          It will appear after moderation — usually within 24 hours.
        </div>
      </div>`;

    // Mount star picker
    const pickerMount = document.getElementById('star-picker-' + listingId);
    if (pickerMount) {
      const picker = Reviews.starPicker(ratingId);
      pickerMount.appendChild(picker);
    }

    // Character count
    const bodyEl = document.getElementById('review-body-' + listingId);
    const ccEl   = document.getElementById('review-charcount-' + listingId);
    if (bodyEl && ccEl) {
      bodyEl.addEventListener('input', () => { ccEl.textContent = bodyEl.value.length; });
    }
  };

  // ── Submit handler (global, called from inline HTML) ───────────
  window.submitReviewFor = function (listingId, listingType, listingName, ratingId) {
    const rating = parseInt(document.getElementById(ratingId)?.value || '0');
    const errEl  = document.getElementById('rating-err-' + listingId);

    if (!rating || rating < 1) {
      if (errEl) errEl.style.display = 'block';
      return;
    }
    if (errEl) errEl.style.display = 'none';

    const result = Reviews.submit({
      listingId,
      listingType,
      listingName,
      rating,
      reviewer: document.getElementById('review-name-' + listingId)?.value || 'Anonymous',
      suburb:   document.getElementById('review-suburb-' + listingId)?.value || '',
      title:    document.getElementById('review-title-' + listingId)?.value || '',
      body:     document.getElementById('review-body-' + listingId)?.value || '',
    });

    if (!result.ok) {
      showToast(result.msg || 'Could not submit review.', 'var(--red-t)');
      return;
    }

    document.getElementById('review-form-' + listingId).style.display = 'none';
    document.getElementById('review-success-' + listingId).style.display = 'block';
    showToast('✓ Review submitted — thank you!');
  };

})();
