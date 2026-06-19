// ─── Admin credentials ──────────────────────────────────────────
// Credentials are stored here. Change these before deploying to production.
const ADMIN_USER = "listly_admin";
const ADMIN_PASS = "ListlyAdmin123$";

let adminLoggedIn = false;

function doLogin() {
  const u = document.getElementById("a-user").value.trim();
  const p = document.getElementById("a-pass").value;
  const err = document.getElementById("login-err");
  if (!u || !p) { err.textContent = "Please enter both username and password."; return; }
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    adminLoggedIn = true;
    document.getElementById("admin-login-view").style.display = "none";
    document.getElementById("admin-dash").style.display = "block";
    document.getElementById("logout-btn").style.display = "";
    renderAdminDash();
  } else {
    err.textContent = "Incorrect username or password.";
    document.getElementById("a-pass").value = "";
  }
}

function doLogout() {
  adminLoggedIn = false;
  document.getElementById("admin-login-view").style.display = "block";
  document.getElementById("admin-dash").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
  ["a-user", "a-pass"].forEach(id => { document.getElementById(id).value = ""; });
  document.getElementById("login-err").textContent = "";
}

function updateStats() {
  const ab = DB.filter(b => b.status === 'approved').length;
  const am = (typeof MENTORS !== 'undefined') ? MENTORS.filter(m => m.status === 'approved').length : 0;
  const pm = (typeof MENTORS !== 'undefined') ? MENTORS.filter(m => m.status === 'pending').length : 0;
  const pb = DB.filter(b => b.status === 'pending').length;
  const rb = DB.filter(b => b.status === 'rejected').length;
  const ao = OPPORTUNITIES.filter(o => o.status === 'approved').length;
  const po = OPPORTUNITIES.filter(o => o.status === 'pending').length;
  document.getElementById('st-ab').textContent = ab;
  document.getElementById('st-pb').textContent = pb;
  document.getElementById('st-rb').textContent = rb;
  document.getElementById('st-ao').textContent = ao;
  document.getElementById('st-po').textContent = po;
  document.getElementById('st-total').textContent = DB.length + OPPORTUNITIES.length + (typeof MENTORS!=='undefined'?MENTORS.length:0);
  const ae = OPPORTUNITIES.filter(o => o.status === 'expired').length;
  const stEx = document.getElementById('st-expired');
  if (stEx) stEx.textContent = ae;
  const badge = document.getElementById('atab-pending');
  const tot = pb + po + pm;
  if (badge) { badge.textContent = tot; badge.style.display = tot > 0 ? 'inline-flex' : 'none'; }
}

function renderAdminDash() { updateStats(); renderPending(); renderApproved(); renderRejected(); renderOppPending(); renderOppApproved(); renderExpired(); renderBulkUpload(); renderReviews(); renderListingEdits(); renderBackendConfig(); renderAnalytics(); }

function switchAdminTab(t, btn) {
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  ['pending','approved','rejected','opp-pending','opp-approved','expired','bulk-upload','reviews','edits','backend','analytics'].forEach(tab => {
    const pane = document.getElementById('admin-pane-' + tab);
    if (pane) pane.style.display = tab === t ? 'block' : 'none';
  });
}

function renderPending() {
  const list = DB.filter(b => b.status === 'pending');
  const el = document.getElementById('admin-pane-pending');
  if (!list.length) { el.innerHTML = `<div class="no-results"><i class="fa-solid fa-circle-check" style="color:var(--brand)"></i><h3>No pending business submissions</h3></div>`; return; }
  el.innerHTML = list.map(b => {
    const idx = DB.indexOf(b);
    return `<div class="pending-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px">
        <div><div style="font-weight:600;font-size:14px">${b.icon} ${escHtml(b.name)}</div></div>
        <span class="status-badge sb-pending">Pending</span>
      </div>
      <div class="pending-meta">
        <span><i class="fa-solid fa-location-dot"></i>${escHtml(b.suburb)}, ${escHtml(b.state)}</span>
        <span><i class="fa-solid fa-tag"></i>${escHtml(b.industry)}</span>
        ${b.contact ? `<span><i class="fa-solid fa-user"></i>${escHtml(b.contact)}</span>` : ''}
        <span><i class="fa-regular fa-calendar"></i>${escHtml(b.submittedAt || '')}</span>
      </div>
      <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin-bottom:8px">${escHtml(b.desc)}</p>
      <div class="biz-tags" style="margin-bottom:8px">${renderTags(b.tags)}</div>
      <div style="font-size:12px;color:var(--text-3);display:flex;flex-wrap:wrap;gap:12px;margin-bottom:10px">
        ${b.mobile ? `<span><i class="fa-solid fa-mobile-screen"></i> ${escHtml(b.mobile)}</span>` : ''}
        ${b.email ? `<span><i class="fa-solid fa-envelope"></i> ${escHtml(b.email)}</span>` : ''}
      </div>
      <textarea class="reject-reason-box" id="reason-b-${idx}" placeholder="Rejection reason (optional)…" rows="2" style="display:none"></textarea>
      <div class="pending-actions">
        <button class="btn-approve" onclick="approveB(${idx})"><i class="fa-solid fa-check"></i> Approve</button>
        <button class="btn-reject-act" onclick="toggleReject('b-${idx}')"><i class="fa-solid fa-xmark"></i> Reject</button>
        <button class="btn-preview-sm" onclick="openBizModal(${b.id})"><i class="fa-solid fa-eye"></i> Preview</button>
      </div>
      <div id="rp-b-${idx}" style="display:none;margin-top:6px">
        <button class="btn-reject-act" onclick="rejectB(${idx})">Confirm rejection</button>
        <button class="btn-preview-sm" onclick="toggleReject('b-${idx}')" style="margin-left:6px">Cancel</button>
      </div>
    </div>`;
  }).join('');
}

function toggleReject(key) {
  const r = document.getElementById('reason-' + key), rp = document.getElementById('rp-' + key);
  const show = r.style.display === 'none' || !r.style.display;
  r.style.display = show ? 'block' : 'none'; rp.style.display = show ? 'flex' : 'none';
}
function approveB(idx) { DB[idx].status = 'approved'; DB[idx].lastUpdated = new Date().toISOString().slice(0,10); showToast('✓ ' + DB[idx].name + ' approved'); renderAdminDash(); }
function rejectB(idx) { DB[idx].status = 'rejected'; DB[idx].rejectReason = (document.getElementById('reason-b-' + idx)||{}).value || 'Did not meet criteria'; showToast('Listing rejected','var(--red-t)'); renderAdminDash(); }
function approveO(idx) { OPPORTUNITIES[idx].status = 'approved'; OPPORTUNITIES[idx].lastUpdated = new Date().toISOString().slice(0,10); showToast('✓ Opportunity approved'); renderAdminDash(); }
function rejectO(idx) { OPPORTUNITIES[idx].status = 'rejected'; OPPORTUNITIES[idx].rejectReason = (document.getElementById('reason-o-' + idx)||{}).value || 'Did not meet criteria'; showToast('Opportunity rejected','var(--red-t)'); renderAdminDash(); }
function removeB(idx) { if (!confirm(`Remove "${DB[idx].name}"?`)) return; DB[idx].status = 'rejected'; DB[idx].rejectReason = 'Removed by admin'; showToast('Listing removed','var(--amber-t)'); renderAdminDash(); }
function reinstateB(idx) { DB[idx].status = 'approved'; DB[idx].lastUpdated = new Date().toISOString().slice(0,10); delete DB[idx].rejectReason; showToast('✓ Reinstated'); renderAdminDash(); }

function renderOppPending() {
  const list = OPPORTUNITIES.filter(o => o.status === 'pending');
  const el = document.getElementById('admin-pane-opp-pending');
  if (!list.length) { el.innerHTML = `<div class="no-results"><i class="fa-solid fa-circle-check" style="color:var(--brand)"></i><h3>No pending opportunity submissions</h3></div>`; return; }
  el.innerHTML = list.map(o => {
    const idx = OPPORTUNITIES.indexOf(o);
    return `<div class="pending-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px">
        <div><div style="font-weight:600;font-size:14px">${o.icon} ${escHtml(o.title)}</div></div>
        <span class="status-badge sb-pending">Pending</span>
      </div>
      <div class="pending-meta">
        <span>${oppTypeBadge(o.type)}</span>
        <span><i class="fa-solid fa-building"></i>${escHtml(o.org)}</span>
        <span><i class="fa-solid fa-location-dot"></i>${escHtml(o.suburb)}, ${escHtml(o.state)}</span>
        <span><i class="fa-regular fa-calendar"></i>${escHtml(o.postedAt || '')}</span>
      </div>
      <p style="font-size:13px;color:var(--text-2);line-height:1.5;margin-bottom:10px">${escHtml((o.desc||'').substring(0,200))}</p>
      <textarea class="reject-reason-box" id="reason-o-${idx}" placeholder="Rejection reason (optional)…" rows="2" style="display:none"></textarea>
      <div class="pending-actions">
        <button class="btn-approve" onclick="approveO(${idx})"><i class="fa-solid fa-check"></i> Approve</button>
        <button class="btn-reject-act" onclick="toggleReject('o-${idx}')"><i class="fa-solid fa-xmark"></i> Reject</button>
        <button class="btn-preview-sm" onclick="openOppDetail(${o.id})"><i class="fa-solid fa-eye"></i> Preview</button>
      </div>
      <div id="rp-o-${idx}" style="display:none;margin-top:6px">
        <button class="btn-reject-act" onclick="rejectO(${idx})">Confirm rejection</button>
        <button class="btn-preview-sm" onclick="toggleReject('o-${idx}')" style="margin-left:6px">Cancel</button>
      </div>
    </div>`;
  }).join('');
}

function renderApproved() {
  const list = DB.filter(b => b.status === 'approved');
  const el = document.getElementById('admin-pane-approved');
  if (!list.length) { el.innerHTML = `<div class="no-results"><h3>No approved listings.</h3></div>`; return; }
  el.innerHTML = `<div class="list-table">${list.map(b => {
    const idx = DB.indexOf(b);
    return `<div class="list-row"><span style="font-size:20px">${b.icon}</span>
      <div style="flex:1;min-width:0"><div class="list-name">${escHtml(b.name)}</div>
      <div class="list-sub">${escHtml(b.suburb)}, ${escHtml(b.state)} · ${escHtml(b.cat)} · ${relDate(b.lastUpdated)}</div></div>
      <span class="status-badge sb-approved">Active</span>
      <div class="list-actions">
        <button class="btn-icon" onclick="openBizModal(${b.id})"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon btn-icon-red" onclick="removeB(${idx})"><i class="fa-solid fa-trash"></i></button>
      </div></div>`;
  }).join('')}</div>`;
}

function renderOppApproved() {
  const list = OPPORTUNITIES.filter(o => o.status === 'approved');
  const el = document.getElementById('admin-pane-opp-approved');
  if (!list.length) { el.innerHTML = `<div class="no-results"><h3>No approved opportunities.</h3></div>`; return; }
  el.innerHTML = `<div class="list-table">${list.map(o => {
    const idx = OPPORTUNITIES.indexOf(o);
    return `<div class="list-row"><span style="font-size:20px">${o.icon}</span>
      <div style="flex:1;min-width:0"><div class="list-name">${escHtml(o.title)}</div>
      <div class="list-sub">${escHtml(o.org)} · ${escHtml(o.suburb)}, ${escHtml(o.state)} · ${escHtml(o.type)} · ${relDate(o.lastUpdated)}</div></div>
      ${oppTypeBadge(o.type)}
      <div class="list-actions">
        <button class="btn-icon" onclick="openOppDetail(${o.id})"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon btn-icon-red" onclick="removeO(${idx})"><i class="fa-solid fa-trash"></i></button>
      </div></div>`;
  }).join('')}</div>`;
}

function removeO(idx) { if (!confirm(`Remove "${OPPORTUNITIES[idx].title}"?`)) return; OPPORTUNITIES[idx].status = 'rejected'; OPPORTUNITIES[idx].rejectReason = 'Removed by admin'; showToast('Removed','var(--amber-t)'); renderAdminDash(); }

function renderRejected() {
  const bl = DB.filter(b => b.status === 'rejected');
  const ol = OPPORTUNITIES.filter(o => o.status === 'rejected');
  const el = document.getElementById('admin-pane-rejected');
  if (!bl.length && !ol.length) { el.innerHTML = `<div class="no-results"><h3>No rejected items.</h3></div>`; return; }
  el.innerHTML =
    (bl.length ? `<h3 style="font-size:14px;font-weight:600;margin-bottom:8px;color:var(--text-2)">Businesses</h3><div class="list-table" style="margin-bottom:1rem">${bl.map(b => { const idx=DB.indexOf(b); return `<div class="list-row"><span style="font-size:20px">${b.icon}</span><div style="flex:1;min-width:0"><div class="list-name">${escHtml(b.name)}</div><div class="list-sub">${escHtml((b.rejectReason||'').substring(0,50))}</div></div><span class="status-badge sb-rejected">Rejected</span><button class="btn-icon btn-icon-green" onclick="reinstateB(${idx})" title="Reinstate"><i class="fa-solid fa-rotate-left"></i></button></div>`; }).join('')}</div>` : '')
    + (ol.length ? `<h3 style="font-size:14px;font-weight:600;margin-bottom:8px;color:var(--text-2)">Opportunities</h3><div class="list-table">${ol.map(o => `<div class="list-row"><span style="font-size:20px">${o.icon}</span><div style="flex:1;min-width:0"><div class="list-name">${escHtml(o.title)}</div><div class="list-sub">${escHtml(o.org)} · ${escHtml((o.rejectReason||'').substring(0,40))}</div></div><span class="status-badge sb-rejected">Rejected</span></div>`).join('')}</div>` : '');
}

function renderAnalytics() {
  const el = document.getElementById('admin-pane-analytics');

  // ── Directory stats ────────────────────────────────────────────
  const ab = DB.filter(b => b.status === 'approved');
  const ao = OPPORTUNITIES.filter(o => o.status === 'approved');
  const sc={}, ic={}, tc={};
  ab.forEach(b => { sc[b.state]=(sc[b.state]||0)+1; ic[b.industry]=(ic[b.industry]||0)+1; });
  ao.forEach(o => { tc[o.type]=(tc[o.type]||0)+1; });
  const mS=Math.max(...Object.values(sc),1), mI=Math.max(...Object.values(ic),1), mT=Math.max(...Object.values(tc),1);

  // ── Usage analytics from localStorage ─────────────────────────
  let usageHTML = '';
  try {
    const store = window.Listily?.getStore?.() || null;
    if (store && store.events && store.events.length > 0) {
      const events = store.events;
      const sessions = store.session_count || 0;
      const firstVisit = store.first_visit ? new Date(store.first_visit).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) : 'Unknown';

      // Page views
      const pvs = events.filter(e => e.t === 'pageview');
      const pvByPage = {};
      pvs.forEach(e => { pvByPage[e.pg]=(pvByPage[e.pg]||0)+1; });
      const maxPV = Math.max(...Object.values(pvByPage),1);

      // Search terms
      const searches = events.filter(e => e.t === 'search_biz' || e.t === 'search_opp' || e.t === 'filter_keyword');
      const searchTerms = {};
      searches.forEach(e => {
        const q = (e.d?.q || '').toLowerCase().trim();
        if (q) searchTerms[q]=(searchTerms[q]||0)+1;
      });
      const topSearches = Object.entries(searchTerms).sort((a,b)=>b[1]-a[1]).slice(0,10);

      // Industry clicks
      const indClicks = {};
      events.filter(e => e.t === 'industry_click').forEach(e => {
        const ind = e.d?.industry || 'Unknown';
        indClicks[ind]=(indClicks[ind]||0)+1;
      });
      const maxIC = Math.max(...Object.values(indClicks),1);

      // State filter usage
      const stateUse = {};
      events.filter(e => e.t === 'filter_state' || e.t === 'state_chip_click').forEach(e => {
        const s = e.d?.state || 'Unknown';
        stateUse[s]=(stateUse[s]||0)+1;
      });

      // CTA clicks
      const ctaClicks = events.filter(e => e.t === 'cta_click').slice(-20).reverse();

      // Activity by day (last 14 days)
      const days = {};
      const now = new Date();
      for (let i=13;i>=0;i--) {
        const d = new Date(now); d.setDate(d.getDate()-i);
        days[d.toISOString().slice(0,10)] = 0;
      }
      pvs.forEach(e => {
        const day = e.ts?.slice(0,10);
        if (days[day] !== undefined) days[day]++;
      });
      const maxDay = Math.max(...Object.values(days),1);

      usageHTML = `
        <div style="margin-bottom:1.5rem">
          <h3 style="font-size:16px;font-weight:600;margin-bottom:.5rem">Usage overview</h3>
          <p style="font-size:13px;color:var(--text-3)">Collected locally from this browser. Data resets when browser storage is cleared. <button onclick="if(confirm('Clear all usage data?')){window.Listily.clearAnalytics();renderAdminDash()}" style="font-size:12px;color:var(--red-t);background:none;border:none;cursor:pointer;padding:0;margin-left:6px">Clear data</button> <button onclick="window.Listily.exportCSV()" style="font-size:12px;color:var(--brand-dark);background:none;border:none;cursor:pointer;padding:0;margin-left:8px"><i class="fa-solid fa-download"></i> Export CSV</button></p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:1.5rem">
          <div class="stat-card stat-green"><div class="stat-val">${pvs.length}</div><div class="stat-lbl">Page views</div></div>
          <div class="stat-card stat-blue"><div class="stat-val">${sessions}</div><div class="stat-lbl">Sessions</div></div>
          <div class="stat-card stat-amber"><div class="stat-val">${searches.length}</div><div class="stat-lbl">Searches</div></div>
          <div class="stat-card stat-purple"><div class="stat-val">${events.filter(e=>e.t==='cta_click').length}</div><div class="stat-lbl">CTA clicks</div></div>
          <div class="stat-card stat-gray"><div class="stat-val" style="font-size:16px">${firstVisit}</div><div class="stat-lbl">First visit</div></div>
        </div>

        <div class="analytics-grid">
          <div class="analytics-card">
            <h3>Activity — last 14 days</h3>
            ${Object.entries(days).map(([day,n])=>`
              <div class="bar-row" title="${day}">
                <span class="bar-lbl" style="font-size:10px">${day.slice(5)}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/maxDay*100)}%"></div></div>
                <span class="bar-val">${n}</span>
              </div>`).join('')}
          </div>

          <div class="analytics-card">
            <h3>Page views by page</h3>
            ${Object.entries(pvByPage).sort((a,b)=>b[1]-a[1]).map(([pg,n])=>`
              <div class="bar-row">
                <span class="bar-lbl">${escHtml(pg||'home')}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/maxPV*100)}%"></div></div>
                <span class="bar-val">${n}</span>
              </div>`).join('')}
          </div>

          <div class="analytics-card">
            <h3>Top search terms</h3>
            ${topSearches.length ? topSearches.map(([q,n])=>`
              <div class="bar-row">
                <span class="bar-lbl" title="${escHtml(q)}">${escHtml(q)}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/topSearches[0][1]*100)}%"></div></div>
                <span class="bar-val">${n}</span>
              </div>`).join('')
            : '<p style="font-size:13px;color:var(--text-3)">No searches recorded yet.</p>'}
          </div>

          <div class="analytics-card">
            <h3>Industry interest (clicks)</h3>
            ${Object.keys(indClicks).length ? Object.entries(indClicks).sort((a,b)=>b[1]-a[1]).map(([ind,n])=>`
              <div class="bar-row">
                <span class="bar-lbl" title="${escHtml(ind)}">${escHtml(ind)}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/maxIC*100)}%"></div></div>
                <span class="bar-val">${n}</span>
              </div>`).join('')
            : '<p style="font-size:13px;color:var(--text-3)">No industry clicks yet.</p>'}
          </div>

          <div class="analytics-card">
            <h3>State filter usage</h3>
            ${Object.keys(stateUse).length ? Object.entries(stateUse).sort((a,b)=>b[1]-a[1]).map(([s,n])=>{
              const mx = Math.max(...Object.values(stateUse));
              return `<div class="bar-row"><span class="bar-lbl">${escHtml(s)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/mx*100)}%"></div></div><span class="bar-val">${n}</span></div>`;
            }).join('')
            : '<p style="font-size:13px;color:var(--text-3)">No state filters used yet.</p>'}
          </div>

          <div class="analytics-card">
            <h3>Recent CTA clicks</h3>
            ${ctaClicks.length ? ctaClicks.slice(0,8).map(e=>`
              <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
                <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-2)">${escHtml(e.d?.label||'')}</span>
                <span style="color:var(--text-3);font-size:10px;margin-left:8px;flex-shrink:0">${e.ts?.slice(0,10)||''}</span>
              </div>`).join('')
            : '<p style="font-size:13px;color:var(--text-3)">No CTA clicks recorded yet.</p>'}
          </div>
        </div>

        <div style="margin-top:1.5rem;padding:1rem;background:var(--blue-bg);border:1px solid var(--blue-b);border-radius:var(--r-lg);font-size:13px;color:var(--blue-t)">
          <i class="fa-solid fa-circle-info"></i>
          <strong>Privacy note:</strong> This analytics data is stored only in <em>your browser's</em> localStorage. No data is sent to any external server. Each visitor's data is visible only to whoever opens the admin panel on that same device. For multi-device analytics, integrate a privacy-first service like Plausible or Fathom (see roadmap Phase 7).
        </div>`;
    } else {
      usageHTML = `<div style="padding:2rem;text-align:center;color:var(--text-3)">
        <i class="fa-solid fa-chart-bar" style="font-size:32px;display:block;margin-bottom:1rem;color:var(--border-2)"></i>
        <p style="font-size:14px;">No usage data collected yet. Visit the site pages to start recording analytics.</p>
      </div>`;
    }
  } catch(err) {
    usageHTML = `<div style="padding:1rem;color:var(--text-3);font-size:13px">Analytics unavailable: ${escHtml(err.message)}</div>`;
  }

  el.innerHTML = `
    <h2 style="font-size:18px;font-weight:600;margin-bottom:1.25rem">Analytics & directory health</h2>
    ${usageHTML}
    <hr style="border:none;border-top:1px solid var(--border);margin:2rem 0">
    <h3 style="font-size:15px;font-weight:600;margin-bottom:1rem">Directory breakdown</h3>
    <div class="analytics-grid">
      <div class="analytics-card"><h3>Listings by state</h3>${Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([s,n])=>`<div class="bar-row"><span class="bar-lbl">${escHtml(s)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/mS*100)}%"></div></div><span class="bar-val">${n}</span></div>`).join('')}</div>
      <div class="analytics-card"><h3>Listings by industry</h3>${Object.entries(ic).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([ind,n])=>`<div class="bar-row"><span class="bar-lbl" title="${escHtml(ind)}">${escHtml(ind)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/mI*100)}%"></div></div><span class="bar-val">${n}</span></div>`).join('')}</div>
      <div class="analytics-card"><h3>Opportunities by type</h3>${Object.entries(tc).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<div class="bar-row"><span class="bar-lbl">${escHtml(t)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/mT*100)}%"></div></div><span class="bar-val">${n}</span></div>`).join('')}</div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('a-pass')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});

// ─── Expired opportunities queue ────────────────────────────────
function renderExpired() {
  const el = document.getElementById('admin-pane-expired');
  if (!el) return;
  const bl = DB.filter(b => b.status === 'rejected');
  const ol = OPPORTUNITIES.filter(o => o.status === 'expired');

  let html = '';
  if (ol.length) {
    html += `<div style="margin-bottom:1rem">
      <h3 style="font-size:15px;font-weight:600;margin-bottom:4px;color:var(--text-2)">Expired opportunities <span style="font-size:12px;font-weight:400;color:var(--text-3)">(${ol.length} total — kept for historical reference)</span></h3>
      <p style="font-size:13px;color:var(--text-3);margin-bottom:1rem">Opportunities past their closing date are automatically moved here. They are hidden from the public directory but preserved for records.</p>
    </div>
    <div class="list-table" style="margin-bottom:1.5rem">
      ${ol.map(o => {
        const idx = OPPORTUNITIES.indexOf(o);
        return `<div class="list-row"><span style="font-size:18px">${o.icon}</span>
          <div style="flex:1;min-width:0">
            <div class="list-name">${escHtml(o.title)}</div>
            <div class="list-sub">${escHtml(o.org)} · ${escHtml(o.suburb)}, ${escHtml(o.state)} · Closed ${escHtml(o.closingDate||'unknown')} · Added by: <strong>${escHtml(o.addedBy||'public')}</strong></div>
          </div>
          <span class="status-badge" style="background:var(--red-bg);color:var(--red-t)">Expired</span>
          <div class="list-actions">
            <button class="btn-icon btn-icon-green" onclick="reinstateOpp(${idx})" title="Re-activate (extend closing date)"><i class="fa-solid fa-rotate-left"></i></button>
            <button class="btn-icon btn-icon-red" onclick="purgeOpp(${idx})" title="Permanently delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }

  if (bl.length) {
    html += `<h3 style="font-size:15px;font-weight:600;margin-bottom:8px;color:var(--text-2)">Rejected business listings</h3>
    <div class="list-table">
      ${bl.map(b => {
        const idx = DB.indexOf(b);
        return `<div class="list-row"><span style="font-size:20px">${b.icon}</span>
          <div style="flex:1;min-width:0">
            <div class="list-name">${escHtml(b.name)}</div>
            <div class="list-sub">${escHtml((b.rejectReason||'').substring(0,60))} · Added by: <strong>${escHtml(b.addedBy||'public')}</strong></div>
          </div>
          <span class="status-badge sb-rejected">Rejected</span>
          <button class="btn-icon btn-icon-green" onclick="reinstateB(${idx})" title="Reinstate"><i class="fa-solid fa-rotate-left"></i></button>
        </div>`;
      }).join('')}
    </div>`;
  }

  if (!ol.length && !bl.length) {
    html = `<div class="no-results"><i class="fa-solid fa-clock-rotate-left"></i><h3>No expired or rejected items.</h3></div>`;
  }

  el.innerHTML = html;
}

function reinstateOpp(idx) {
  const o = OPPORTUNITIES[idx];
  // Set new closing date 90 days from today
  const d = new Date(); d.setDate(d.getDate() + 90);
  o.closingDate = d.toISOString().slice(0,10);
  o.status = 'approved';
  delete o.expiredAt;
  showToast('✓ Opportunity re-activated (closes ' + o.closingDate + ')');
  renderAdminDash();
}
function purgeOpp(idx) {
  if (!confirm('Permanently delete "' + OPPORTUNITIES[idx].title + '"? This cannot be undone.')) return;
  OPPORTUNITIES.splice(idx, 1);
  showToast('Opportunity deleted', 'var(--red-t)');
  renderAdminDash();
}

// ─── Bulk upload ────────────────────────────────────────────────
function renderBulkUpload() {
  const el = document.getElementById('admin-pane-bulk-upload');
  if (!el) return;
  el.innerHTML = `
  <div style="background:var(--brand-bg);border:1px solid var(--brand-border);border-radius:var(--r-lg);padding:1rem 1.25rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
    <i class="fa-solid fa-cloud-arrow-up" style="font-size:24px;color:var(--brand-dark)"></i>
    <div style="flex:1;min-width:200px">
      <div style="font-size:14px;font-weight:600;color:var(--brand-dark);margin-bottom:2px">Bulk upload — add many listings at once</div>
      <div style="font-size:12px;color:var(--brand-dark);opacity:.85">Perfect for adding local supplier directories, council databases, or migrating from another platform. Two methods below: CSV file or JSON paste.</div>
    </div>
  </div>
  <h2 style="font-size:18px;font-weight:600;margin-bottom:.5rem">Bulk upload listings</h2>
  <p style="font-size:13px;color:var(--text-3);margin-bottom:1.5rem">All bulk-imported listings are marked <strong>"Added by: admin"</strong> and appear in the "Admin uploads" list at the bottom of this page.</p>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

    <!-- CSV Upload -->
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:1.375rem">
      <h3 style="font-size:15px;font-weight:600;margin-bottom:.5rem"><i class="fa-solid fa-file-csv" style="color:var(--brand)"></i> CSV upload</h3>
      <p style="font-size:13px;color:var(--text-2);margin-bottom:1rem;line-height:1.6">Upload a CSV with the columns below. First row must be headers.</p>
      <div style="background:var(--bg-tint);border-radius:var(--r-md);padding:.875rem;font-size:12px;font-family:monospace;color:var(--text-2);margin-bottom:1rem;overflow-x:auto;white-space:nowrap">
        name, industry, cat, suburb, state, desc, phone, mobile, email, web, tags
      </div>
      <div style="margin-bottom:1rem">
        <button class="btn btn-ghost btn-sm" onclick="downloadCSVTemplate()"><i class="fa-solid fa-download"></i> Download template</button>
      </div>
      <label style="display:block">
        <input type="file" id="bulk-csv-file" accept=".csv" style="display:none" onchange="previewCSV(this)">
        <div style="border:2px dashed var(--border);border-radius:var(--r-lg);padding:2rem;text-align:center;cursor:pointer;transition:all .15s" onclick="document.getElementById('bulk-csv-file').click()" id="csv-drop-zone">
          <i class="fa-solid fa-cloud-arrow-up" style="font-size:28px;color:var(--text-3);display:block;margin-bottom:.75rem"></i>
          <p style="font-size:13px;font-weight:500;color:var(--text-2)">Click to upload CSV</p>
          <p style="font-size:12px;color:var(--text-3);margin-top:4px">businesses or opportunities</p>
        </div>
      </label>
      <div id="csv-preview" style="margin-top:1rem"></div>
      <div id="csv-actions" style="margin-top:1rem;display:none">
        <button class="btn btn-primary full-btn" onclick="importCSV()"><i class="fa-solid fa-check"></i> Import all as pending</button>
        <button class="btn btn-ghost full-btn" onclick="importCSV(true)" style="margin-top:6px"><i class="fa-solid fa-rocket"></i> Import and auto-approve</button>
      </div>
    </div>

    <!-- JSON paste -->
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:1.375rem">
      <h3 style="font-size:15px;font-weight:600;margin-bottom:.5rem"><i class="fa-solid fa-code" style="color:var(--brand)"></i> JSON paste</h3>
      <p style="font-size:13px;color:var(--text-2);margin-bottom:1rem;line-height:1.6">Paste an array of listing objects. Useful for developer imports or migrating data.</p>
      <div style="background:var(--bg-tint);border-radius:var(--r-md);padding:.875rem;font-size:11.5px;font-family:monospace;color:var(--text-2);margin-bottom:1rem;line-height:1.5">
[{<br>
&nbsp;"name":"My Business",<br>
&nbsp;"industry":"Home &amp; Trade Services",<br>
&nbsp;"cat":"Electrician",<br>
&nbsp;"suburb":"Point Cook",<br>
&nbsp;"state":"VIC",<br>
&nbsp;"desc":"Description here",<br>
&nbsp;"phone":"03 xxxx xxxx",<br>
&nbsp;"email":"info@example.com.au"<br>
}]
      </div>
      <textarea id="json-paste" rows="8" style="width:100%;padding:10px;border:1.5px solid var(--border);border-radius:var(--r-md);font-size:12px;font-family:monospace;background:var(--bg-card);color:var(--text);resize:vertical" placeholder="Paste JSON array here…"></textarea>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn btn-primary" style="flex:1" onclick="importJSON()"><i class="fa-solid fa-check"></i> Import as pending</button>
        <button class="btn btn-ghost" style="flex:1" onclick="importJSON(true)"><i class="fa-solid fa-rocket"></i> Import &amp; approve</button>
      </div>
      <div id="json-result" style="margin-top:10px;font-size:13px"></div>
    </div>
  </div>

  <!-- Recent admin uploads -->
  <div style="margin-top:1.5rem">
    <h3 style="font-size:15px;font-weight:600;margin-bottom:.875rem">Admin-uploaded listings</h3>
    <div class="list-table">
      ${[...DB.filter(b=>b.addedBy==='admin'), ...OPPORTUNITIES.filter(o=>o.addedBy==='admin')]
        .sort((a,b)=>new Date(b.submittedAt||b.postedAt||0)-new Date(a.submittedAt||a.postedAt||0))
        .slice(0,20)
        .map(item=>{
          const isOpp = !!item.type;
          return `<div class="list-row">
            <span style="font-size:18px">${item.icon||'📋'}</span>
            <div style="flex:1;min-width:0">
              <div class="list-name">${escHtml(item.name||item.title)}</div>
              <div class="list-sub">${isOpp?escHtml(item.type)+' · ':''} ${escHtml(item.suburb||'')}, ${escHtml(item.state||'')} · ${escHtml(item.submittedAt||item.postedAt||'')}</div>
            </div>
            <span class="status-badge ${item.status==='approved'?'sb-approved':item.status==='expired'?'':'sb-pending'}">${escHtml(item.status)}</span>
            <span style="font-size:11px;color:var(--brand-dark);font-weight:600;padding:0 8px"><i class="fa-solid fa-shield-halved"></i> Admin</span>
          </div>`;
        }).join('') || '<div style="padding:1rem;color:var(--text-3);font-size:13px">No admin uploads yet.</div>'}
    </div>
  </div>`;
}

let _csvParsed = [];

function downloadCSVTemplate() {
  const csv = 'name,industry,cat,suburb,state,desc,phone,mobile,email,web,tags\n"Example Business","Home & Trade Services","Electrician","Point Cook","VIC","Description of your business","03 9000 0000","0411 000 000","info@example.com.au","https://example.com.au","Tag1,Tag2,Tag3"';
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'listily-bulk-upload-template.csv'; a.click();
}

function previewCSV(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // Proper CSV parsing — handles quoted fields with commas and escaped quotes
    function parseCSV(str) {
      const rows = [];
      let row = [], field = '', inQuotes = false;
      for (let i = 0; i < str.length; i++) {
        const ch = str[i], next = str[i+1];
        if (inQuotes) {
          if (ch === '"' && next === '"') { field += '"'; i++; }
          else if (ch === '"') { inQuotes = false; }
          else { field += ch; }
        } else {
          if (ch === '"') { inQuotes = true; }
          else if (ch === ',') { row.push(field); field = ''; }
          else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
          else { field += ch; }
        }
      }
      if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
      return rows.filter(r => r.some(c => c.trim() !== ''));
    }
    const rows = parseCSV(text);
    if (rows.length < 2) { document.getElementById('csv-preview').innerHTML = '<p style="color:var(--red-t);font-size:13px">No data rows found.</p>'; return; }
    const headers = rows[0].map(h => h.trim().toLowerCase());
    _csvParsed = rows.slice(1).map(vals => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    }).filter(o => o.name);
    const preview = document.getElementById('csv-preview');
    preview.innerHTML = `<p style="font-size:13px;color:var(--green-t);margin-bottom:.5rem"><i class="fa-solid fa-circle-check"></i> Found <strong>${_csvParsed.length}</strong> valid rows.</p>
      <div style="max-height:180px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r-md)">
        ${_csvParsed.slice(0,5).map(r=>`<div style="padding:6px 12px;border-bottom:1px solid var(--border);font-size:12px"><strong>${escHtml(r.name)}</strong> — ${escHtml(r.suburb||'')}, ${escHtml(r.state||'')} · ${escHtml(r.industry||'')}</div>`).join('')}
        ${_csvParsed.length>5?`<div style="padding:6px 12px;font-size:12px;color:var(--text-3)">+ ${_csvParsed.length-5} more rows…</div>`:''}
      </div>`;
    document.getElementById('csv-actions').style.display = 'block';
  };
  reader.readAsText(file);
}

function importCSV(autoApprove=false) {
  if (!_csvParsed.length) { showToast('No rows to import','var(--red-t)'); return; }
  const today = new Date().toISOString().slice(0,10);
  let count = 0;
  _csvParsed.forEach(row => {
    if (!row.name || !row.industry) return;
    DB.push({
      id: Date.now() + Math.random(),
      name: row.name, industry: row.industry, cat: row.cat||'',
      suburb: row.suburb||'', state: row.state||'',
      desc: row.desc||'', phone: row.phone||'', mobile: row.mobile||'',
      email: row.email||'', web: row.web||'',
      tags: (row.tags||'').split(',').map(t=>t.trim()).filter(Boolean).slice(0,3),
      icon: '🏢', hours: {},
      lastUpdated: today, submittedAt: today,
      status: autoApprove ? 'approved' : 'pending',
      addedBy: 'admin'
    });
    count++;
  });
  showToast(`✓ ${count} listings imported${autoApprove?' and approved':' as pending'}`);
  _csvParsed = [];
  document.getElementById('csv-preview').innerHTML = '';
  document.getElementById('csv-actions').style.display = 'none';
  document.getElementById('bulk-csv-file').value = '';
  // Push the newly imported listings to the sheet if shared backend is active
  if (typeof SheetListings !== 'undefined' && SheetListings.isShared()) {
    const newOnes = DB.slice(-count);
    SheetListings.bulkUpsert(newOnes).then(ok => {
      if (ok) showToast(`✓ Also pushed ${newOnes.length} listings to sheet`);
    });
  }
  renderAdminDash();
}

function importJSON(autoApprove=false) {
  const raw = document.getElementById('json-paste')?.value.trim();
  const result = document.getElementById('json-result');
  if (!raw) { result.innerHTML = '<span style="color:var(--red-t)">Please paste JSON first.</span>'; return; }
  let data;
  try { data = JSON.parse(raw); } catch(e) {
    result.innerHTML = `<span style="color:var(--red-t)"><i class="fa-solid fa-xmark"></i> Invalid JSON: ${escHtml(e.message)}</span>`;
    return;
  }
  if (!Array.isArray(data)) { result.innerHTML = '<span style="color:var(--red-t)">Expected a JSON array [ ... ]</span>'; return; }
  const today = new Date().toISOString().slice(0,10);
  let count = 0;
  data.forEach(row => {
    if (!row.name) return;
    DB.push({
      id: Date.now() + Math.random(),
      name: row.name, industry: row.industry||'', cat: row.cat||'',
      suburb: row.suburb||'', state: row.state||'',
      desc: row.desc||'', phone: row.phone||'', mobile: row.mobile||'',
      email: row.email||'', web: row.web||'', wa: row.wa||'',
      tags: Array.isArray(row.tags) ? row.tags.slice(0,3) : (row.tags||'').split(',').map(t=>t.trim()).filter(Boolean).slice(0,3),
      icon: row.icon||'🏢', hours: row.hours||{},
      lastUpdated: today, submittedAt: today,
      status: autoApprove ? 'approved' : 'pending',
      addedBy: 'admin'
    });
    count++;
  });
  result.innerHTML = `<span style="color:var(--green-t)"><i class="fa-solid fa-circle-check"></i> ${count} listings imported${autoApprove?' and approved':' as pending'}.</span>`;
  document.getElementById('json-paste').value = '';
  if (typeof SheetListings !== 'undefined' && SheetListings.isShared()) {
    const newOnes = DB.slice(-count);
    SheetListings.bulkUpsert(newOnes).then(()=>{}).catch(()=>{});
  }
  renderAdminDash();
}

// ─── Reviews admin panel ─────────────────────────────────────────
function renderReviews() {
  const el = document.getElementById('admin-pane-reviews');
  if (!el || typeof Reviews === 'undefined') return;

  const all = Reviews.getAll();
  const pending  = all.filter(r => r.status === 'pending');
  const approved = all.filter(r => r.status === 'approved');
  const reported = all.filter(r => r.reported && r.status === 'approved');
  const removed  = all.filter(r => r.status === 'removed');
  const autoOn   = Reviews.getAutoApprove();

  // Update pending badge
  const badge = document.getElementById('atab-reviews');
  if (badge) { badge.textContent = pending.length; badge.style.display = pending.length ? 'inline-flex' : 'none'; }

  el.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
    <div>
      <h2 style="font-size:18px;font-weight:600;margin-bottom:4px">Reviews moderation</h2>
      <p style="font-size:13px;color:var(--text-3)">${all.length} total · ${pending.length} pending · ${approved.length} approved · ${reported.length} flagged</p>
    </div>
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <label class="toggle-row" style="gap:8px">
        <input type="checkbox" id="review-auto-approve" ${autoOn ? 'checked' : ''} onchange="Reviews.setAutoApprove(this.checked);showToast(this.checked?'Auto-approve ON':'Auto-approve OFF')">
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-lbl" style="font-size:13px">Auto-approve new reviews</span>
      </label>
      <button class="btn btn-ghost btn-sm" onclick="Reviews.exportCSV()"><i class="fa-solid fa-download"></i> Export CSV</button>
      <button class="btn btn-ghost btn-sm" style="color:var(--red-t)" onclick="if(confirm('Delete ALL reviews permanently?')){Reviews.clearAll();renderAdminDash();}"><i class="fa-solid fa-trash"></i> Clear all</button>
    </div>
  </div>

  ${pending.length ? `
    <h3 style="font-size:14px;font-weight:600;color:var(--amber-t);margin-bottom:.75rem;display:flex;align-items:center;gap:6px">
      <i class="fa-solid fa-clock"></i> Pending approval (${pending.length})
    </h3>
    <div class="list-table" style="margin-bottom:1.5rem">
      ${pending.map(r => reviewAdminCard(r, true)).join('')}
    </div>` : ''}

  ${reported.length ? `
    <h3 style="font-size:14px;font-weight:600;color:var(--red-t);margin-bottom:.75rem;display:flex;align-items:center;gap:6px">
      <i class="fa-solid fa-flag"></i> Flagged by users (${reported.length})
    </h3>
    <div class="list-table" style="margin-bottom:1.5rem">
      ${reported.map(r => reviewAdminCard(r, false)).join('')}
    </div>` : ''}

  ${approved.filter(r => !r.reported).length ? `
    <h3 style="font-size:14px;font-weight:600;color:var(--green-t);margin-bottom:.75rem;display:flex;align-items:center;gap:6px">
      <i class="fa-solid fa-circle-check"></i> Live reviews (${approved.filter(r=>!r.reported).length})
    </h3>
    <div class="list-table" style="margin-bottom:1.5rem">
      ${approved.filter(r => !r.reported).map(r => reviewAdminCard(r, false)).join('')}
    </div>` : `<div class="no-results" style="padding:2rem"><i class="fa-regular fa-star"></i><h3>No reviews yet</h3><p>Reviews will appear here as visitors submit them.</p></div>`}

  ${removed.length ? `
    <details style="margin-top:1rem">
      <summary style="font-size:13px;color:var(--text-3);cursor:pointer;padding:.5rem 0">Removed reviews (${removed.length})</summary>
      <div class="list-table" style="margin-top:.5rem">
        ${removed.map(r => reviewAdminCard(r, false)).join('')}
      </div>
    </details>` : ''}`;
}

function reviewAdminCard(r, isPending) {
  const stars = typeof Reviews !== 'undefined' ? Reviews.starsHTML(r.rating, 'sm') : '';
  const date  = r.ts ? new Date(r.ts).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) : '';
  return `<div class="list-row" style="flex-direction:column;align-items:flex-start;gap:8px;padding:1rem">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;width:100%;gap:1rem;flex-wrap:wrap">
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          ${stars}
          <span style="font-size:13px;font-weight:600">${escHtml(r.title || '(no title)')}</span>
          ${r.reported ? '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--red-bg);color:var(--red-t)">Flagged</span>' : ''}
        </div>
        <div style="font-size:12px;color:var(--text-3)">${escHtml(r.reviewer)} · ${escHtml(r.suburb||'')} · ${date} · <strong>${escHtml(r.listingName||r.listingId)}</strong> (${escHtml(r.listingType)})</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0">
        ${isPending || r.status === 'removed' ? `<button class="btn-approve" onclick="Reviews.approve('${r.id}');renderAdminDash()"><i class="fa-solid fa-check"></i> Approve</button>` : ''}
        ${r.status === 'approved' ? `<button class="btn-preview-sm" onclick="Reviews.remove('${r.id}');renderAdminDash()"><i class="fa-solid fa-eye-slash"></i> Remove</button>` : ''}
        <button class="btn-reject-act" onclick="if(confirm('Permanently delete this review?')){Reviews.purge('${r.id}');renderAdminDash()}"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    </div>
    ${r.body ? `<p style="font-size:13px;color:var(--text-2);line-height:1.6;margin:0">${escHtml(r.body)}</p>` : ''}
    <div style="font-size:11px;color:var(--text-3)">👍 ${r.helpful||0} helpful · Status: <strong>${r.status}</strong></div>
  </div>`;
}

// ─── Listing edits admin panel ──────────────────────────────────
function renderListingEdits() {
  const el = document.getElementById('admin-pane-edits');
  if (!el || typeof ListingEdits === 'undefined') return;

  const all = ListingEdits.getAll();
  const pending  = all.filter(e => e.status === 'pending');
  const approved = all.filter(e => e.status === 'approved' || e.status === 'applied');
  const rejected = all.filter(e => e.status === 'rejected');

  // Update tab badge
  const badge = document.getElementById('atab-edits');
  if (badge) { badge.textContent = pending.length; badge.style.display = pending.length ? 'inline-flex' : 'none'; }

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
      <div>
        <h2 style="font-size:18px;font-weight:600;margin-bottom:4px">Listing edit submissions</h2>
        <p style="font-size:13px;color:var(--text-3)">${all.length} total · ${pending.length} pending · ${approved.length} applied · ${rejected.length} rejected</p>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="ListingEdits.exportCSV()"><i class="fa-solid fa-download"></i> Export CSV</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--red-t)" onclick="if(confirm('Delete ALL edit submissions permanently?')){ListingEdits.clearAll();renderAdminDash();}"><i class="fa-solid fa-trash"></i> Clear all</button>
      </div>
    </div>

    ${pending.length ? `
      <h3 style="font-size:14px;font-weight:600;color:var(--amber-t);margin-bottom:.75rem;display:flex;align-items:center;gap:6px">
        <i class="fa-solid fa-clock"></i> Pending review (${pending.length})
      </h3>
      <div class="list-table" style="margin-bottom:1.5rem">
        ${pending.map(editAdminCard).join('')}
      </div>` : ''}

    ${approved.length ? `
      <h3 style="font-size:14px;font-weight:600;color:var(--green-t);margin-bottom:.75rem;display:flex;align-items:center;gap:6px">
        <i class="fa-solid fa-circle-check"></i> Approved / applied (${approved.length})
      </h3>
      <div class="list-table" style="margin-bottom:1.5rem">
        ${approved.map(editAdminCard).join('')}
      </div>` : ''}

    ${rejected.length ? `
      <details style="margin-top:1rem">
        <summary style="font-size:13px;color:var(--text-3);cursor:pointer;padding:.5rem 0">Rejected (${rejected.length})</summary>
        <div class="list-table" style="margin-top:.5rem">
          ${rejected.map(editAdminCard).join('')}
        </div>
      </details>` : ''}

    ${!all.length ? `
      <div class="no-results" style="padding:3rem"><i class="fa-solid fa-pen-to-square"></i>
        <h3>No edit submissions yet</h3>
        <p style="font-size:13px;color:var(--text-3)">Edit suggestions from listing pages will appear here for your review.</p>
      </div>` : ''}
  `;
}

function editAdminCard(e) {
  const date = e.ts ? new Date(e.ts).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
  const fields = Object.entries(e.changes || {});
  const isPending = e.status === 'pending';
  const isApplied = e.status === 'applied' || e.status === 'approved';
  const isRejected = e.status === 'rejected';

  const roleBadge = e.submitterRole === 'owner'
    ? '<span class="status-badge" style="background:var(--green-bg);color:var(--green-t)">Owner</span>'
    : e.submitterRole === 'staff'
    ? '<span class="status-badge" style="background:var(--blue-bg);color:var(--blue-t)">Staff</span>'
    : '<span class="status-badge sb-pending">Public</span>';

  return `<div class="list-row" style="flex-direction:column;align-items:flex-start;gap:8px;padding:1rem">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;width:100%;gap:1rem;flex-wrap:wrap">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:600">${escHtml(e.listingName || e.listingId)}</span>
          <span class="status-badge" style="background:var(--bg-tint);color:var(--text-3);text-transform:capitalize">${escHtml(e.listingType)}</span>
          ${roleBadge}
          ${isApplied ? '<span class="status-badge sb-approved">✓ Applied</span>' : ''}
          ${isRejected ? '<span class="status-badge sb-rejected">Rejected</span>' : ''}
        </div>
        <div style="font-size:12px;color:var(--text-3)">
          From <strong>${escHtml(e.submitterName)}</strong> · <a href="mailto:${escHtml(e.submitterEmail)}">${escHtml(e.submitterEmail)}</a> · ${date}
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0">
        ${isPending ? `
          <button class="btn-approve" onclick="approveAndApplyEdit('${e.id}')" title="Apply the changes to the live listing"><i class="fa-solid fa-check"></i> Apply</button>
          <button class="btn-preview-sm" onclick="ListingEdits.approve('${e.id}',false);renderAdminDash()" title="Mark approved but don't auto-apply"><i class="fa-solid fa-eye"></i> Mark approved</button>
          <button class="btn-reject-act" onclick="rejectEditPrompt('${e.id}')" title="Reject"><i class="fa-solid fa-xmark"></i> Reject</button>
        ` : ''}
        <button class="btn-reject-act" onclick="if(confirm('Permanently delete this edit submission?')){ListingEdits.purge('${e.id}');renderAdminDash();}" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>

    ${fields.length ? `
      <div style="width:100%;background:var(--bg-tint);border-radius:var(--r-md);padding:.625rem .875rem;margin-top:6px">
        <div style="font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:6px">Suggested changes</div>
        ${fields.map(([k,v]) => `<div style="font-size:13px;margin-bottom:3px;line-height:1.5"><strong style="color:var(--text-2);text-transform:capitalize">${escHtml(k)}:</strong> <span style="color:var(--text)">${escHtml(typeof v === 'string' ? v : JSON.stringify(v))}</span></div>`).join('')}
      </div>` : ''}

    ${e.reason ? `<div style="font-size:12px;color:var(--text-2);font-style:italic;padding:6px 10px;border-left:3px solid var(--border-2);margin-top:4px">"${escHtml(e.reason)}"</div>` : ''}
    ${e.adminNotes ? `<div style="font-size:11px;color:var(--red-t);margin-top:4px"><strong>Admin note:</strong> ${escHtml(e.adminNotes)}</div>` : ''}
  </div>`;
}

// Apply the suggested changes directly to the live listing
function approveAndApplyEdit(editId) {
  const e = ListingEdits.getAll().find(x => x.id === editId);
  if (!e) return;
  if (!confirm(`Apply ${Object.keys(e.changes).length} change(s) to "${e.listingName}"?\n\nThis will update the live listing immediately.`)) return;

  // Find the target
  let target = null;
  let arr = null;
  if (e.listingType === 'business') {
    target = DB.find(b => String(b.id) === String(e.listingId));
    arr = DB;
  } else if (e.listingType === 'mentor' && typeof MENTORS !== 'undefined') {
    target = MENTORS.find(m => String(m.id) === String(e.listingId));
    arr = MENTORS;
  } else if (e.listingType === 'opportunity') {
    target = OPPORTUNITIES.find(o => String(o.id) === String(e.listingId));
    arr = OPPORTUNITIES;
  }
  if (!target) { showToast('Listing not found.', 'var(--red-t)'); return; }

  // Apply changes
  Object.entries(e.changes).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) {
      target[k] = v;
    }
  });
  target.lastUpdated = new Date().toISOString().slice(0,10);

  // Persist as an "override" so other visitors also see the change
  if (typeof ListingOverrides !== 'undefined') {
    ListingOverrides.save({
      listingId: e.listingId,
      listingType: e.listingType,
      changes: e.changes,
      appliedBy: 'admin',
      ts: new Date().toISOString(),
    });
  }

  // Push the updated listing to the sheet too (so all visitors see it)
  if (typeof SheetListings !== 'undefined' && SheetListings.isShared() && e.listingType === 'business') {
    SheetListings.upsert(target).catch(()=>{});
  }

  ListingEdits.approve(editId, true);
  showToast('✓ Edit applied to listing');
  renderAdminDash();
}

function rejectEditPrompt(editId) {
  const notes = prompt('Reason for rejection (optional, visible only to admin):');
  if (notes === null) return;  // cancelled
  ListingEdits.reject(editId, notes);
  renderAdminDash();
}

// ─── Backend config panel ───────────────────────────────────────
function renderBackendConfig() {
  const el = document.getElementById('admin-pane-backend');
  if (!el) return;

  let cfg = {};
  try { cfg = JSON.parse(localStorage.getItem('_listily_backend_cfg') || '{}'); } catch(e) {}
  const sheetsUrl = cfg.sheets || '';
  const isLive = !!sheetsUrl;

  const APPS_SCRIPT_CODE = `const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getReviews')   return jsonReply(readSheet('Reviews'));
  if (action === 'getEdits')     return jsonReply(readSheet('Edits'));
  if (action === 'getOverrides') return jsonReply(readSheet('Overrides'));
  if (action === 'getListings')  return jsonReply(readSheet('Listings'));
  return jsonReply({ ok: true, ts: new Date().toISOString() });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  let tab;
  if (body.action.includes('Listing'))  tab = 'Listings';
  else if (body.action.includes('Override')) tab = 'Overrides';
  else if (body.action.includes('Edit'))     tab = 'Edits';
  else tab = 'Reviews';
  const sheet = SS.getSheetByName(tab);
  if (!sheet) return jsonReply({ error: 'Sheet not found: ' + tab });

  if (body.action === 'add' || body.action === 'addEdit' || body.action === 'addOverride') {
    appendRow(sheet, body.review || body.edit || body.override);
  } else if (body.action === 'update' || body.action === 'updateEdit') {
    updateRow(sheet, body.id, body.patch);
  } else if (body.action === 'remove' || body.action === 'removeEdit') {
    removeRow(sheet, body.id);
  } else if (body.action === 'upsertListing') {
    upsertListing(sheet, body.listing);
  } else if (body.action === 'deleteListing') {
    removeRow(sheet, body.id);
  } else if (body.action === 'bulkUpsertListings') {
    (body.listings || []).forEach(l => upsertListing(sheet, l));
  }
  return jsonReply({ ok: true });
}

function appendRow(sheet, row) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = headers.map(h => {
    const v = row[h];
    return (typeof v === 'object' && v !== null) ? JSON.stringify(v) : (v || '');
  });
  sheet.appendRow(values);
}

function upsertListing(sheet, listing) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(listing.id)) {
      headers.forEach((h, j) => {
        if (listing[h] !== undefined) {
          const v = listing[h];
          sheet.getRange(i+1, j+1).setValue(typeof v === 'object' && v !== null ? JSON.stringify(v) : v);
        }
      });
      return;
    }
  }
  appendRow(sheet, listing);
}

function readSheet(name) {
  const sheet = SS.getSheetByName(name);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).filter(r => r[0]).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let v = row[i];
      if (typeof v === 'string' && (v.startsWith('{') || v.startsWith('['))) {
        try { v = JSON.parse(v); } catch (e) {}
      }
      obj[h] = v;
    });
    return obj;
  });
}

function updateRow(sheet, id, patch) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      Object.keys(patch).forEach(k => {
        const col = headers.indexOf(k);
        if (col > -1) {
          const v = patch[k];
          sheet.getRange(i+1, col+1).setValue(typeof v === 'object' && v !== null ? JSON.stringify(v) : v);
        }
      });
      return;
    }
  }
}

function removeRow(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) { sheet.deleteRow(i+1); return; }
  }
}

function jsonReply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}`;

  el.innerHTML = `
  <h2 style="font-size:18px;font-weight:600;margin-bottom:.5rem">Shared backend (data across all browsers)</h2>
  <p style="font-size:13px;color:var(--text-3);margin-bottom:1.5rem">By default, reviews and edits are saved only in each visitor's browser. Connect a Google Sheet here to share data across all visitors and devices.</p>

  <!-- Status banner -->
  <div style="background:${isLive?'var(--green-bg)':'var(--amber-bg)'};border:1px solid ${isLive?'var(--green-b)':'var(--amber-b)'};border-radius:var(--r-lg);padding:1rem 1.25rem;margin-bottom:1.5rem">
    <div style="font-size:14px;font-weight:600;color:${isLive?'var(--green-t)':'var(--amber-t)'};margin-bottom:4px">
      <i class="fa-solid ${isLive?'fa-circle-check':'fa-triangle-exclamation'}"></i>
      ${isLive ? 'Shared backend ACTIVE — Google Sheets connected' : 'Demo mode — single-device only'}
    </div>
    <div style="font-size:12px;color:${isLive?'var(--green-t)':'var(--amber-t)'};opacity:.85">
      ${isLive ? 'All reviews, edits and listings sync to your Google Sheet. Visible to every visitor.' : 'Data saved only in this browser. Configure below to enable sharing.'}
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr;gap:20px;max-width:780px">

    <!-- URL + sync controls -->
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:1.5rem">
      <h3 style="font-size:15px;font-weight:600;margin-bottom:.5rem"><i class="fa-solid fa-link" style="color:var(--brand)"></i> Google Sheets webhook URL</h3>
      <p style="font-size:13px;color:var(--text-2);margin-bottom:1rem;line-height:1.6">Paste the Web App URL from your deployed Google Apps Script.</p>
      <input type="url" id="bk-sheets-url" value="${escHtml(sheetsUrl)}" placeholder="https://script.google.com/macros/s/.../exec" style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--r-md);font-size:13px;background:#fff;color:#111827;font-family:monospace;margin-bottom:1rem">

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
        <button class="btn btn-primary" onclick="saveBackendConfig()"><i class="fa-solid fa-check"></i> Save &amp; activate</button>
        <button class="btn btn-ghost" onclick="testBackendConnection()"><i class="fa-solid fa-plug"></i> Test connection</button>
        <button class="btn btn-ghost" style="color:var(--red-t)" onclick="if(confirm('Disconnect backend?')){clearBackendConfig()}"><i class="fa-solid fa-link-slash"></i> Disconnect</button>
      </div>

      <div id="bk-test-result" style="font-size:12px;margin-top:8px"></div>

      ${isLive ? `
      <div style="border-top:1px solid var(--border);padding-top:1rem;margin-top:1rem">
        <h4 style="font-size:14px;font-weight:600;margin-bottom:.5rem"><i class="fa-solid fa-arrows-rotate" style="color:var(--brand)"></i> Sync with sheet</h4>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="seedSheetWithLocalDB()"><i class="fa-solid fa-cloud-arrow-up"></i> Push all listings to sheet</button>
          <button class="btn btn-ghost btn-sm" onclick="refreshFromSheet()"><i class="fa-solid fa-cloud-arrow-down"></i> Pull from sheet</button>
        </div>
        <div id="seed-result" style="font-size:12px;margin-top:8px"></div>
      </div>` : ''}
    </div>

    <!-- CSV import/export -->
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:1.5rem">
      <h3 style="font-size:15px;font-weight:600;margin-bottom:.5rem"><i class="fa-solid fa-file-csv" style="color:var(--brand)"></i> CSV import / export</h3>
      <p style="font-size:13px;color:var(--text-2);margin-bottom:1rem;line-height:1.6">Download all listings as CSV, edit in Excel or Google Sheets, then upload back. Rows with matching <code>id</code> update existing listings; new <code>id</code> values create new ones.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem">
        <button class="btn btn-primary" onclick="downloadDBAsCSV()"><i class="fa-solid fa-download"></i> Download CSV</button>
        <label class="btn btn-ghost" style="cursor:pointer;margin:0">
          <i class="fa-solid fa-upload"></i> Upload edited CSV
          <input type="file" id="listings-csv-file" accept=".csv" onchange="previewListingsCSV(this)" style="display:none">
        </label>
      </div>
      <div id="listings-csv-preview"></div>
    </div>

    <!-- Setup guide -->
    <details style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:1.5rem">
      <summary style="font-size:15px;font-weight:600;cursor:pointer;list-style:none"><i class="fa-solid fa-circle-info" style="color:var(--brand);margin-right:6px"></i> Setup guide — Google Sheets backend (step-by-step)</summary>
      <div style="margin-top:1.25rem;font-size:13px;line-height:1.7;color:var(--text-2)">
        <p><strong>Step 1.</strong> Create a sheet at <a href="https://sheets.new" target="_blank" rel="noopener" style="color:var(--brand-dark)">sheets.new</a></p>
        <p><strong>Step 2.</strong> Create four tabs: <code>Listings</code>, <code>Reviews</code>, <code>Edits</code>, <code>Overrides</code></p>
        <p><strong>Step 3.</strong> Listings tab headers (row 1):</p>
        <div style="background:var(--bg-tint);padding:.5rem;border-radius:var(--r-md);font-family:monospace;font-size:11px;margin:.5rem 0;overflow-x:auto">id | name | industry | cat | suburb | state | desc | icon | tags | phone | mobile | email | web | address | hours | contact | status | featured | addedBy | lastUpdated | submittedAt | notes</div>
        <p><strong>Step 4.</strong> Reviews tab headers:</p>
        <div style="background:var(--bg-tint);padding:.5rem;border-radius:var(--r-md);font-family:monospace;font-size:11px;margin:.5rem 0;overflow-x:auto">id | listingId | listingType | listingName | reviewer | rating | title | body | suburb | ts | status | helpful | reported</div>
        <p><strong>Step 5.</strong> Edits tab headers:</p>
        <div style="background:var(--bg-tint);padding:.5rem;border-radius:var(--r-md);font-family:monospace;font-size:11px;margin:.5rem 0;overflow-x:auto">id | listingId | listingType | listingName | submitterName | submitterEmail | submitterRole | changes | reason | ts | status | adminNotes</div>
        <p><strong>Step 6.</strong> Overrides tab headers:</p>
        <div style="background:var(--bg-tint);padding:.5rem;border-radius:var(--r-md);font-family:monospace;font-size:11px;margin:.5rem 0;overflow-x:auto">listingId | listingType | changes | appliedBy | ts</div>
        <p><strong>Step 7.</strong> Extensions → Apps Script. Delete default code, paste this:</p>
        <div style="position:relative;margin:.5rem 0">
          <button onclick="copyAppsScript(this)" style="position:absolute;top:8px;right:8px;background:var(--brand);color:#fff;border:none;padding:4px 12px;border-radius:6px;font-size:11px;cursor:pointer;z-index:1"><i class="fa-solid fa-copy"></i> Copy</button>
          <pre id="apps-script-code" style="background:#1a1a1a;color:#f0f0f0;padding:1rem;border-radius:6px;font-size:11px;overflow-x:auto;line-height:1.5;margin:0;max-height:300px;overflow-y:auto"></pre>
        </div>
        <p><strong>Step 8.</strong> Deploy → New deployment → Web app → Execute as: <strong>Me</strong> → Who has access: <strong>Anyone</strong> → Deploy → authorise.</p>
        <p><strong>Step 9.</strong> Copy the Web app URL, paste above, click <strong>Save &amp; activate</strong>, then click <strong>Push all listings to sheet</strong> to seed your sheet.</p>
        <p style="padding:.625rem;background:var(--green-bg);border-radius:6px;color:var(--green-t)"><i class="fa-solid fa-circle-check"></i> Once done, edit listings directly in the sheet — changes appear on the site within 60 seconds.</p>
      </div>
    </details>
  </div>`;

  // Insert apps script code into the pre block (safer than putting it inline in the template)
  const codeEl = document.getElementById('apps-script-code');
  if (codeEl) codeEl.textContent = APPS_SCRIPT_CODE;
}

function saveBackendConfig() {
  const url = document.getElementById('bk-sheets-url')?.value.trim();
  if (url && !url.match(/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec/)) {
    if (!confirm('That URL doesn\'t look like a typical Google Apps Script Web App URL. Save anyway?')) return;
  }
  const cfg = { sheets: url, adapter: 'auto' };
  localStorage.setItem('_listily_backend_cfg', JSON.stringify(cfg));
  showToast(url ? '✓ Backend saved — reloading…' : 'Cleared backend URL');
  document.getElementById('bk-test-result').innerHTML =
    '<div style="padding:.75rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-md);color:var(--green-t)"><i class="fa-solid fa-circle-check"></i> Saved! Reloading page in 1 second to activate the new backend…</div>';
  // Auto-reload after a short delay so changes take effect everywhere
  setTimeout(() => { location.reload(); }, 1200);
}

function clearBackendConfig() {
  localStorage.removeItem('_listily_backend_cfg');
  showToast('Backend disconnected — reload page');
  renderBackendConfig();
}

async function testBackendConnection() {
  const url = document.getElementById('bk-sheets-url')?.value.trim();
  const out = document.getElementById('bk-test-result');
  if (!url) { out.innerHTML = '<span style="color:var(--red-t)">Please enter a URL first.</span>'; return; }
  out.innerHTML = '<span style="color:var(--text-3)"><i class="fa-solid fa-spinner fa-spin"></i> Testing connection…</span>';

  // Run multiple checks
  const checks = [];

  // Check 1: URL pattern
  if (!url.startsWith('https://script.google.com/macros/s/')) {
    checks.push({ ok: false, msg: 'URL doesn\'t look like an Apps Script Web App URL. It should start with https://script.google.com/macros/s/...' });
  } else {
    checks.push({ ok: true, msg: 'URL format looks correct' });
  }

  // Check 2: Reach the endpoint
  try {
    const res = await fetch(url + '?action=ping');
    if (!res.ok) {
      checks.push({ ok: false, msg: `Server returned HTTP ${res.status}. Check that the script is deployed as Web app with "Anyone" access.` });
    } else {
      const data = await res.json();
      if (data && (data.ok || data.ts || Array.isArray(data))) {
        checks.push({ ok: true, msg: 'Server responded successfully' });
      } else {
        checks.push({ ok: false, msg: 'Server responded but with unexpected format. Check that you pasted the Apps Script code correctly.' });
      }
    }
  } catch (e) {
    checks.push({ ok: false, msg: `Could not reach server: ${e.message}. Common causes: (a) wrong URL, (b) deployment not set to "Anyone" access, (c) script not deployed as Web app.` });
  }

  // Check 3: Listings tab accessible
  try {
    const res = await fetch(url + '?action=getListings');
    const data = await res.json();
    if (Array.isArray(data)) {
      checks.push({ ok: true, msg: `Listings tab readable — ${data.length} rows found` });
    } else if (data && data.error) {
      checks.push({ ok: false, msg: `Listings tab error: ${data.error}. Make sure your sheet has a tab called "Listings".` });
    }
  } catch (e) {
    checks.push({ ok: false, msg: 'Could not fetch Listings tab — may not exist yet' });
  }

  // Render results
  const allOk = checks.every(c => c.ok);
  out.innerHTML = `
    <div style="padding:.875rem;background:${allOk ? 'var(--green-bg)' : 'var(--amber-bg)'};border:1px solid ${allOk ? 'var(--green-b)' : 'var(--amber-b)'};border-radius:var(--r-md)">
      <div style="font-weight:600;color:${allOk ? 'var(--green-t)' : 'var(--amber-t)'};margin-bottom:8px">
        ${allOk ? '<i class="fa-solid fa-circle-check"></i> All checks passed' : '<i class="fa-solid fa-triangle-exclamation"></i> Some issues found'}
      </div>
      <ul style="margin:0;padding-left:1.5rem;font-size:12.5px;line-height:1.7">
        ${checks.map(c => `<li style="color:${c.ok ? 'var(--green-t)' : 'var(--red-t)'}">${c.ok ? '✓' : '✗'} ${escHtml(c.msg)}</li>`).join('')}
      </ul>
    </div>`;
}

function copyAppsScript(btn) {
  const code = document.getElementById('apps-script-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => { btn.innerHTML = orig; }, 1500);
  });
}


// ─── Sheet sync helpers ──────────────────────────────────────────
async function seedSheetWithLocalDB() {
  if (typeof SheetListings === 'undefined' || !SheetListings.isShared()) {
    showToast('Configure and save a sheet URL first.', 'var(--red-t)'); return;
  }
  if (!confirm(`Push all ${DB.length} local listings to the Google Sheet?\n\nThis will create or update rows in the Listings tab. Existing rows with matching IDs will be updated.`)) return;
  const out = document.getElementById('seed-result');
  if (out) out.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pushing ' + DB.length + ' listings…';
  const ok = await SheetListings.bulkUpsert(DB);
  if (ok) {
    if (out) out.innerHTML = '<div style="padding:.625rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-md);color:var(--green-t)"><i class="fa-solid fa-circle-check"></i> Pushed ' + DB.length + ' listings to sheet. Refresh the sheet to verify.</div>';
    showToast('✓ All listings pushed to sheet');
  } else {
    if (out) out.innerHTML = '<div style="padding:.625rem;background:var(--red-bg);border:1px solid var(--red-b);border-radius:var(--r-md);color:var(--red-t)"><i class="fa-solid fa-xmark"></i> Push failed. Check your Apps Script deployment.</div>';
  }
}

async function refreshFromSheet() {
  if (typeof SheetListings === 'undefined') { showToast('SheetListings not loaded', 'var(--red-t)'); return; }
  const out = document.getElementById('seed-result');
  if (out) out.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pulling from sheet…';
  const result = await SheetListings.refresh();
  if (result) {
    if (out) out.innerHTML = `<div style="padding:.625rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-md);color:var(--green-t)"><i class="fa-solid fa-circle-check"></i> Pulled — ${result.added} added, ${result.updated} updated</div>`;
    renderAdminDash();
  } else {
    if (out) out.innerHTML = '<div style="padding:.625rem;background:var(--red-bg);border:1px solid var(--red-b);border-radius:var(--r-md);color:var(--red-t)"><i class="fa-solid fa-xmark"></i> Pull failed.</div>';
  }
}


// ─── CSV import/export of the FULL listings database ──────────────
function downloadDBAsCSV() {
  if (typeof DB === 'undefined') { showToast('DB not loaded', 'var(--red-t)'); return; }
  const fields = ['id','name','industry','cat','suburb','state','desc','icon','tags','phone','mobile','wa','email','web','address','status','featured','addedBy','contact','lastUpdated','submittedAt','notes'];
  const rows = [fields];
  DB.forEach(b => {
    rows.push(fields.map(f => {
      let v = b[f];
      if (Array.isArray(v)) v = v.join(',');
      if (typeof v === 'object' && v !== null) v = JSON.stringify(v);
      return v === undefined || v === null ? '' : String(v);
    }));
  });
  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'listily-listings-' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
  showToast('✓ Listings CSV downloaded (' + DB.length + ' rows)');
}

let _listingsCsvParsed = null;

function previewListingsCSV(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
    function parseCSV(str) {
      const rows=[]; let row=[], field='', inQuotes=false;
      for (let i=0;i<str.length;i++) {
        const ch=str[i], next=str[i+1];
        if (inQuotes) {
          if (ch==='"' && next==='"') { field+='"'; i++; }
          else if (ch==='"') inQuotes=false;
          else field+=ch;
        } else {
          if (ch==='"') inQuotes=true;
          else if (ch===',') { row.push(field); field=''; }
          else if (ch==='\n') { row.push(field); rows.push(row); row=[]; field=''; }
          else field+=ch;
        }
      }
      if (field !== '' || row.length>0) { row.push(field); rows.push(row); }
      return rows.filter(r => r.some(c => c.trim() !== ''));
    }
    const rows = parseCSV(text);
    if (rows.length < 2) {
      document.getElementById('listings-csv-preview').innerHTML = '<p style="color:var(--red-t);font-size:13px">No data rows found.</p>';
      return;
    }
    const headers = rows[0].map(h => h.trim());
    _listingsCsvParsed = rows.slice(1).map(vals => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    }).filter(o => o.id && o.name);

    const valid = _listingsCsvParsed.length;
    document.getElementById('listings-csv-preview').innerHTML = `
      <div style="padding:.875rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-md);margin-bottom:.875rem">
        <strong style="color:var(--green-t)">${valid} valid listings ready to import.</strong>
        <div style="font-size:11px;color:var(--text-3);margin-top:4px">Each row's <code>id</code> determines whether it's a new listing (new id) or an update to an existing one (matching id).</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="commitListingsCSV()">Import / update ${valid} listings</button>
        <button class="btn btn-ghost btn-sm" onclick="_listingsCsvParsed=null;document.getElementById('listings-csv-preview').innerHTML='';document.getElementById('listings-csv-file').value=''">Cancel</button>
      </div>`;
  };
  reader.readAsText(file);
}

function commitListingsCSV() {
  if (!_listingsCsvParsed || !_listingsCsvParsed.length) return;
  let added=0, updated=0;
  _listingsCsvParsed.forEach(row => {
    const id = parseInt(row.id, 10);
    if (!id) return;
    const listing = {
      id, name: row.name, industry: row.industry||'Community & Culture',
      cat: row.cat || '',
      suburb: row.suburb||'', state: row.state||'VIC',
      desc: row.desc||'', icon: row.icon||'🏢',
      tags: (row.tags||'').split(',').map(t=>t.trim()).filter(Boolean),
      hours: tryParse(row.hours) || { Mon:'9am–5pm',Tue:'9am–5pm',Wed:'9am–5pm',Thu:'9am–5pm',Fri:'9am–5pm',Sat:'Closed',Sun:'Closed',PH:'Closed' },
      status: row.status || 'approved',
      addedBy: row.addedBy || 'csv',
      contact: row.contact||'',
      lastUpdated: row.lastUpdated || new Date().toISOString().slice(0,10),
      submittedAt: row.submittedAt || new Date().toISOString().slice(0,10),
    };
    ['phone','mobile','wa','email','web','address','notes'].forEach(k => { if (row[k]) listing[k] = row[k]; });
    if (row.featured === 'true' || row.featured === 'TRUE' || row.featured === '1') listing.featured = true;
    const existing = DB.findIndex(b => String(b.id) === String(id));
    if (existing > -1) { DB[existing] = { ...DB[existing], ...listing }; updated++; }
    else { DB.push(listing); added++; }
  });

  // Push to sheet too if configured
  if (typeof SheetListings !== 'undefined' && SheetListings.isShared()) {
    SheetListings.bulkUpsert(_listingsCsvParsed.map(r => ({...r, id: parseInt(r.id, 10)}))).catch(()=>{});
  }

  _listingsCsvParsed = null;
  document.getElementById('listings-csv-preview').innerHTML = `<div style="padding:.875rem;background:var(--green-bg);border:1px solid var(--green-b);border-radius:var(--r-md);color:var(--green-t)"><strong>✓ Imported.</strong> ${added} new · ${updated} updated.</div>`;
  document.getElementById('listings-csv-file').value = '';
  showToast(`✓ ${added} new + ${updated} updated`);
  renderAdminDash();
}

function tryParse(s) { try { return JSON.parse(s); } catch (e) { return null; } }
