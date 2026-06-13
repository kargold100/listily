// ─── Admin auth ─────────────────────────────────────────────────
// Credentials are loaded from sessionStorage so they are never
// hard-coded in source. On first visit the operator sets them via
// the setup screen below. Change them in Site Settings before launch.
let adminLoggedIn = false;

function getStoredCreds() {
  try {
    const raw = sessionStorage.getItem('_listily_admin_cfg');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function doLogin() {
  const u = document.getElementById('a-user').value.trim();
  const p = document.getElementById('a-pass').value;
  const err = document.getElementById('login-err');
  if (!u || !p) { err.textContent = 'Please enter both username and password.'; return; }

  const stored = getStoredCreds();
  if (!stored) {
    err.textContent = 'No admin account configured. Use "Set up admin account" below.';
    return;
  }
  if (u === stored.u && p === stored.p) {
    adminLoggedIn = true;
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dash').style.display = 'block';
    document.getElementById('logout-btn').style.display = '';
    renderAdminDash();
  } else {
    err.textContent = 'Incorrect username or password.';
    document.getElementById('a-pass').value = '';
  }
}

function doLogout() {
  adminLoggedIn = false;
  document.getElementById('admin-login-view').style.display = 'block';
  document.getElementById('admin-dash').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'none';
  ['a-user','a-pass'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('login-err').textContent = '';
}

function saveAdminSetup() {
  const u = document.getElementById('setup-user').value.trim();
  const p = document.getElementById('setup-pass').value;
  const p2 = document.getElementById('setup-pass2').value;
  const err = document.getElementById('setup-err');
  if (!u || u.length < 3) { err.textContent = 'Username must be at least 3 characters.'; return; }
  if (!p || p.length < 8) { err.textContent = 'Password must be at least 8 characters.'; return; }
  if (p !== p2) { err.textContent = 'Passwords do not match.'; return; }
  sessionStorage.setItem('_listily_admin_cfg', JSON.stringify({ u, p }));
  document.getElementById('setup-panel').style.display = 'none';
  document.getElementById('login-panel').style.display = 'block';
  document.getElementById('login-success').style.display = 'block';
  setTimeout(() => document.getElementById('login-success').style.display = 'none', 3000);
}

function updateStats() {
  const ab = DB.filter(b => b.status === 'approved').length;
  const pb = DB.filter(b => b.status === 'pending').length;
  const rb = DB.filter(b => b.status === 'rejected').length;
  const ao = OPPORTUNITIES.filter(o => o.status === 'approved').length;
  const po = OPPORTUNITIES.filter(o => o.status === 'pending').length;
  document.getElementById('st-ab').textContent = ab;
  document.getElementById('st-pb').textContent = pb;
  document.getElementById('st-rb').textContent = rb;
  document.getElementById('st-ao').textContent = ao;
  document.getElementById('st-po').textContent = po;
  document.getElementById('st-total').textContent = DB.length + OPPORTUNITIES.length;
  const badge = document.getElementById('atab-pending');
  const tot = pb + po;
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
  const ab = DB.filter(b => b.status === 'approved');
  const ao = OPPORTUNITIES.filter(o => o.status === 'approved');
  const sc={}, ic={}, tc={};
  ab.forEach(b => { sc[b.state]=(sc[b.state]||0)+1; ic[b.industry]=(ic[b.industry]||0)+1; });
  ao.forEach(o => { tc[o.type]=(tc[o.type]||0)+1; });
  const mS=Math.max(...Object.values(sc),1), mI=Math.max(...Object.values(ic),1), mT=Math.max(...Object.values(tc),1);
  el.innerHTML = `<div class="analytics-grid">
    <div class="analytics-card"><h3>Businesses by state</h3>${Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([s,n])=>`<div class="bar-row"><span class="bar-lbl">${escHtml(s)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/mS*100)}%"></div></div><span class="bar-val">${n}</span></div>`).join('')}</div>
    <div class="analytics-card"><h3>Top industries</h3>${Object.entries(ic).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([ind,n])=>`<div class="bar-row"><span class="bar-lbl" title="${escHtml(ind)}">${escHtml(ind)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/mI*100)}%"></div></div><span class="bar-val">${n}</span></div>`).join('')}</div>
    <div class="analytics-card"><h3>Opportunities by type</h3>${Object.entries(tc).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<div class="bar-row"><span class="bar-lbl">${escHtml(t)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(n/mT*100)}%"></div></div><span class="bar-val">${n}</span></div>`).join('')}</div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('a-pass')?.addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('setup-pass2')?.addEventListener('keydown', e => { if(e.key==='Enter') saveAdminSetup(); });
  // Show setup panel if no creds stored yet
  if (!getStoredCreds()) {
    document.getElementById('setup-info').style.display = 'block';
  }
});
