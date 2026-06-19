// ─── Mentors page ──────────────────────────────────────────────
const MENTOR_PER_PAGE = 12;
let mentorPage = 1;
let activeMentorSpecialty = '';

const SPECIALTIES = [
  'Business & Finance', 'Trades & Construction', 'Arts & Culture',
  'Education & Careers', 'Technology & IT', 'Health & Wellness',
  'Community & Social Impact', 'Sport & Coaching'
];

const SPECIALTY_MAP = {
  'Business & Finance': ['Finance','Mortgage','Banking','Accounting','Tax','Investment','Insurance'],
  'Trades & Construction': ['Trades','Plumbing','Electrical','Solar','Construction','Handyman'],
  'Arts & Culture': ['Arts','Culture','Tamil','Dance','Music','Creative'],
  'Education & Careers': ['Education','Selective','Academic','Career','Students'],
  'Technology & IT': ['IT','Tech','Software','Cyber','Digital'],
  'Health & Wellness': ['Wellness','Yoga','Pilates','Health','Mindfulness'],
  'Community & Social Impact': ['Community','Leadership','Organisation','Volunteer'],
  'Sport & Coaching': ['Sport','Coaching','Youth','Surfing','Fitness']
};

function availClass(a) {
  if (a === 'Open to new mentees') return 'open';
  if (a === 'Limited availability') return 'limited';
  return 'full';
}

function availIcon(a) {
  if (a === 'Open to new mentees') return '<i class="fa-solid fa-circle-check"></i>';
  if (a === 'Limited availability') return '<i class="fa-solid fa-clock"></i>';
  return '<i class="fa-solid fa-circle-xmark"></i>';
}

function renderMentorCard(m) {
  const avCls = availClass(m.available);
  const initials = m.avatar || m.name.charAt(0);
  const areas = (m.areas || []).slice(0, 4);
  const modes = (m.mode || []).join(' · ');

  return `<div class="mcard" onclick="openMentorModal(${m.id})" tabindex="0" onkeydown="if(event.key==='Enter')openMentorModal(${m.id})" role="listitem" aria-label="${escHtml(m.name)}">
    <div class="mcard-header">
      <div class="mavatar">${escHtml(initials)}</div>
      <div>
        <div class="mname">${escHtml(m.name)}</div>
      ${(typeof Reviews!=='undefined') ? (()=>{const avg=Reviews.avgRating(m.id,'mentor');const cnt=Reviews.getFor(m.id,'mentor').length;return avg?`<span style="font-size:11px;color:#F59E0B">${Reviews.starsHTML(avg,'sm')}</span><span style="font-size:10px;color:var(--text-3)"> ${avg} (${cnt})</span>`:''})():''}
        <div class="mspecialty"><i class="fa-solid fa-star" style="font-size:10px"></i> ${escHtml(m.specialty)}</div>
        <div class="mloc"><i class="fa-solid fa-location-dot" style="font-size:10px"></i> ${escHtml(m.suburb)}, ${escHtml(m.state)}</div>
      </div>
    </div>
    <p class="mbio">${escHtml(m.bio)}</p>
    <div class="mareas">${areas.map(a => `<span class="marea">${escHtml(a)}</span>`).join('')}</div>
    <div class="mfooter">
      <span class="mavail ${avCls}">${availIcon(m.available)} ${escHtml(m.available)}</span>
      <div class="mcontact">
        ${m.email ? `<span class="chip"><i class="fa-solid fa-envelope"></i>Email</span>` : ''}
        ${m.whitelistPhone && m.phone ? `<span class="chip"><i class="fa-solid fa-phone"></i>${escHtml(m.phone)}</span>` : ''}
        ${m.wa ? `<span class="chip"><i class="fa-brands fa-whatsapp"></i>WA</span>` : ''}
      </div>
    </div>
    <div class="mmode"><i class="fa-solid fa-video" style="font-size:10px"></i> ${escHtml(modes)} · ${escHtml(m.experience)} experience</div>
  </div>`;
}

function openMentorModal(id) {
  const m = MENTORS.find(x => x.id === id);
  if (!m) return;
  const avCls = availClass(m.available);

  const contactRows = [
    m.email ? `<div class="modal-row"><i class="fa-solid fa-envelope modal-row-icon"></i><div><div class="modal-row-lbl">Email</div><a href="mailto:${escHtml(m.email)}">${escHtml(m.email)}</a></div></div>` : '',
    (m.whitelistPhone && m.phone) ? `<div class="modal-row"><i class="fa-solid fa-phone modal-row-icon"></i><div><div class="modal-row-lbl">Phone</div><a href="tel:${escHtml(m.phone)}">${escHtml(m.phone)}</a></div></div>` : '',
    m.wa ? `<div class="modal-row"><i class="fa-brands fa-whatsapp modal-row-icon"></i><div><div class="modal-row-lbl">WhatsApp</div><a href="https://wa.me/61${m.wa.replace(/^0/,'').replace(/\s/g,'')}" target="_blank" rel="noopener noreferrer">${escHtml(m.wa)}</a></div></div>` : '',
    (!m.whitelistPhone && m.phone) ? `<div class="modal-row"><i class="fa-solid fa-shield modal-row-icon" style="color:var(--amber-t)"></i><div><div class="modal-row-lbl">Phone</div><span style="color:var(--text-3)">Number withheld — contact via email</span></div></div>` : '',
  ].filter(Boolean).join('');

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-mentor-header">
      <div class="modal-mavatar">${escHtml(m.avatar || m.name.charAt(0))}</div>
      <div>
        <div class="modal-mname">${escHtml(m.name)}</div>
        <div class="modal-mspec"><i class="fa-solid fa-star" style="font-size:11px"></i> ${escHtml(m.specialty)}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:5px">
          <span class="mavail ${avCls}">${availIcon(m.available)} ${escHtml(m.available)}</span>
          <span style="font-size:11px;color:var(--text-3)"><i class="fa-solid fa-location-dot" style="font-size:10px"></i> ${escHtml(m.suburb)}, ${escHtml(m.state)}</span>
        </div>
      </div>
    </div>

    <p class="modal-desc">${escHtml(m.bio)}</p>

    <div class="modal-sec-lbl">Areas of mentorship</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1rem">
      ${(m.areas||[]).map(a => `<span class="marea">${escHtml(a)}</span>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:1rem">
      <div style="background:var(--bg-tint);border-radius:var(--r-md);padding:.875rem">
        <div style="font-size:11px;color:var(--text-3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Experience</div>
        <div style="font-size:14px;font-weight:600">${escHtml(m.experience)}</div>
      </div>
      <div style="background:var(--bg-tint);border-radius:var(--r-md);padding:.875rem">
        <div style="font-size:11px;color:var(--text-3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Meeting modes</div>
        <div style="font-size:13px;font-weight:500">${(m.mode||[]).join(', ')}</div>
      </div>
    </div>

    <hr class="modal-divider">
    <div class="modal-sec-lbl">How to connect</div>
    ${contactRows}
    ${!m.whitelistPhone && m.phone ? '' : ''}

    <div class="modal-updated" style="margin-top:1rem">
      <i class="fa-regular fa-calendar-check"></i>
      Profile last updated: <strong>${fmtDate(m.lastUpdated) || 'Unknown'}</strong>
    </div>

    <div style="margin-top:1.25rem;padding:1rem;background:var(--mentor-bg);border-radius:var(--r-lg);border:1px solid var(--mentor-border)">
      <p style="font-size:13px;color:var(--mentor-dark);line-height:1.6">
        <i class="fa-solid fa-circle-info" style="margin-right:5px"></i>
        Mentoring on Listily is free and community-driven. Please be respectful of mentors' time — reach out with a clear message about your goals and what you're hoping to get from the connection.
      </p>
    </div>
    <hr class="modal-divider">
    <div class="modal-sec-lbl">Reviews</div>
    <div id="mentor-reviews-${m.id}"></div>
    <div id="mentor-review-form-${m.id}"></div>`;

  openModal();
  // Mount reviews after modal is open
  if (typeof Reviews !== 'undefined') {
    Reviews.renderList('mentor-reviews-' + m.id, m.id, 'mentor');
    Reviews.renderForm('mentor-review-form-' + m.id, m.id, 'mentor', m.name);
  }
  // Mount edit trigger
  if (typeof ListingEdits !== 'undefined') {
    const ec = document.createElement('div');
    ec.id = 'mentor-edit-trigger-' + m.id;
    ec.style.cssText = 'margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);text-align:center';
    document.getElementById('modal-body').appendChild(ec);
    ListingEdits.renderTrigger('mentor-edit-trigger-' + m.id, m, 'mentor');
  }
}

function applyMentorFilters() {
  const kw = (document.getElementById('mf-keyword')?.value || '').toLowerCase();
  const state = document.getElementById('mf-state')?.value || '';
  const suburb = document.getElementById('mf-suburb')?.value || '';
  const checkedAvail = [...document.querySelectorAll('#mentor-sidebar .check-item input[type=checkbox]:checked')]
    .map(el => el.value).filter(v => ['Open to new mentees','Limited availability'].includes(v));
  const checkedModes = [...document.querySelectorAll('#mentor-sidebar .check-item input[type=checkbox]:checked')]
    .map(el => el.value).filter(v => ['In-person','Video call','Phone'].includes(v));

  let list = MENTORS.filter(m => m.status === 'approved');

  if (kw) list = list.filter(m =>
    (m.name + ' ' + m.specialty + ' ' + m.bio + ' ' + (m.areas||[]).join(' ') + ' ' + (m.tags||[]).join(' ')).toLowerCase().includes(kw)
  );
  if (state) list = list.filter(m => m.state === state);
  if (suburb) list = list.filter(m => m.suburb === suburb);
  if (checkedAvail.length) list = list.filter(m => checkedAvail.includes(m.available));
  if (checkedModes.length) list = list.filter(m => (m.mode||[]).some(mo => checkedModes.includes(mo)));
  if (activeMentorSpecialty) {
    const keys = SPECIALTY_MAP[activeMentorSpecialty] || [];
    list = list.filter(m =>
      keys.some(k => (m.specialty + ' ' + (m.tags||[]).join(' ') + ' ' + (m.areas||[]).join(' ')).toLowerCase().includes(k.toLowerCase()))
    );
  }

  const titleEl = document.getElementById('mentor-title');
  const countEl = document.getElementById('mentor-results-count');
  if (titleEl) titleEl.textContent = activeMentorSpecialty ? activeMentorSpecialty + ' mentors' : 'All mentors';
  if (countEl) countEl.textContent = `${list.length} mentor${list.length !== 1 ? 's' : ''} found`;

  mentorPage = 1;
  window._mentorList = list;
  renderMentorGrid(list);
  renderMentorPagination(list);
}

function renderMentorGrid(list) {
  const grid = document.getElementById('mentor-grid');
  const page = list.slice((mentorPage-1)*MENTOR_PER_PAGE, mentorPage*MENTOR_PER_PAGE);
  if (!page.length) {
    grid.innerHTML = `<div class="no-results" style="grid-column:1/-1"><i class="fa-solid fa-star"></i><h3>No mentors found</h3><p>Try different filters or search terms.</p></div>`;
    return;
  }
  grid.innerHTML = page.map(renderMentorCard).join('');
}

function renderMentorPagination(list) {
  const total = Math.ceil(list.length / MENTOR_PER_PAGE);
  const pg = document.getElementById('mentor-pagination');
  if (!pg || total <= 1) { if (pg) pg.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="goMentorPage(${mentorPage-1})" ${mentorPage===1?'disabled':''} aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= total; i++) html += `<button class="page-btn${i===mentorPage?' active':''}" onclick="goMentorPage(${i})">${i}</button>`;
  html += `<button class="page-btn" onclick="goMentorPage(${mentorPage+1})" ${mentorPage===total?'disabled':''} aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>`;
  pg.innerHTML = html;
}

function goMentorPage(n) {
  mentorPage = n;
  renderMentorGrid(window._mentorList || []);
  renderMentorPagination(window._mentorList || []);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderSpecialtyPills() {
  const container = document.getElementById('specialty-pills');
  if (!container) return;
  container.innerHTML = `<button class="tag tag-mentor" style="cursor:pointer;padding:5px 14px;font-size:12px;${!activeMentorSpecialty?'background:var(--mentor);color:#fff':''}" onclick="setMentorSpecialty('',this)">All</button>`
    + SPECIALTIES.map(s => `<button class="tag tag-mentor" style="cursor:pointer;padding:5px 14px;font-size:12px;${activeMentorSpecialty===s?'background:var(--mentor);color:#fff':''}" onclick="setMentorSpecialty('${escHtml(s)}',this)">${escHtml(s)}</button>`).join('');
}

function setMentorSpecialty(sp, btn) {
  activeMentorSpecialty = sp;
  renderSpecialtyPills();
  applyMentorFilters();
}

function onMentorStateChange() {
  const state = document.getElementById('mf-state')?.value || '';
  const sel = document.getElementById('mf-suburb');
  if (!sel) return;
  sel.innerHTML = '<option value="">All suburbs</option>';
  (STATE_SUBURBS[state] || []).sort().forEach(s => {
    const o = document.createElement('option'); o.value = s; o.textContent = s; sel.appendChild(o);
  });
  applyMentorFilters();
}

function clearMentorFilters() {
  document.getElementById('mf-keyword').value = '';
  document.getElementById('mf-state').value = '';
  document.getElementById('mf-suburb').innerHTML = '<option value="">All suburbs</option>';
  document.querySelectorAll('#mentor-sidebar .check-item input[type=checkbox]').forEach(cb => cb.checked = false);
  activeMentorSpecialty = '';
  renderSpecialtyPills();
  applyMentorFilters();
}

function toggleMentorSidebar(open) {
  document.getElementById('mentor-sidebar').classList.toggle('open', open);
  document.getElementById('mentor-sidebar-overlay').classList.toggle('open', open);
}

document.addEventListener('DOMContentLoaded', () => {
  const count = MENTORS.filter(m => m.status === 'approved').length;
  const el = document.getElementById('mentor-count');
  if (el) el.textContent = count;
  renderSpecialtyPills();
  applyMentorFilters();
});
