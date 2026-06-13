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
  const badge = document.getElementById('atab-pending');
  const tot = pb + po + pm;
  if (badge) { badge.textContent = tot; badge.style.display = tot > 0 ? 'inline-flex' : 'none'; }
}

function renderAdminDash() { updateStats(); renderPending(); renderApproved(); renderRejected(); renderOppPending(); renderOppApproved(); renderAnalytics(); }

function switchAdminTab(t, btn) {
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active')); btn.classList.add('active');
  ['pending','approved','rejected','opp-pending','opp-approved','analytics'].forEach(tab => {
    document.getElementById('admin-pane-' + tab).style.display = tab === t ? 'block' : 'none';
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
