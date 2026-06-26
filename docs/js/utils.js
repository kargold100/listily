// ── Security ────────────────────────────────────────────────────
function escHtml(s){
  return String(s||"")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// ── Open/closed ─────────────────────────────────────────────────
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_FULL=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function getOpenStatus(biz){
  if(!biz.hours||typeof biz.hours!=="object") return{label:"Hours not listed",cls:"unknown"};
  const dayKey=DAYS[new Date().getDay()];
  const val=biz.hours[dayKey]||"Closed";
  if(val==="Closed") return{label:"Closed today",cls:"closed"};
  if(val.includes("24/7")) return{label:"Open 24/7",cls:"open"};
  if(val==="By appointment") return{label:"By appointment",cls:"unknown"};
  const first=val.split(",")[0].trim();
  const m=first.match(/(\d{1,2}(?::\d{2})?(?:am|pm))[–\-](\d{1,2}(?::\d{2})?(?:am|pm))/i);
  if(!m) return{label:val,cls:"unknown"};
  function toM(t){const x=t.match(/(\d{1,2})(?::(\d{2}))?(am|pm)/i);if(!x)return 0;let h=parseInt(x[1]);const mn=parseInt(x[2]||"0"),ap=x[3].toLowerCase();if(ap==="pm"&&h!==12)h+=12;if(ap==="am"&&h===12)h=0;return h*60+mn;}
  const now=new Date().getHours()*60+new Date().getMinutes();
  const op=toM(m[1]),cl=toM(m[2]);
  if(now>=op&&now<cl){const left=cl-now;return left<=30?{label:`Closing in ${left} min`,cls:"open"}:{label:"Open now",cls:"open"};}
  if(now<op) return{label:`Opens at ${m[1]}`,cls:"closed"};
  return{label:"Closed now",cls:"closed"};
}

// ── Dates ───────────────────────────────────────────────────────
function fmtDate(iso){
  if(!iso)return null;
  return new Date(iso+"T00:00:00").toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"});
}
function relDate(iso){
  if(!iso)return"";
  const d=Math.floor((new Date()-new Date(iso+"T00:00:00"))/86400000);
  if(d===0)return"Updated today";if(d===1)return"Updated yesterday";
  if(d<7)return`Updated ${d} days ago`;if(d<30)return`Updated ${Math.floor(d/7)} wk${d>=14?"s":""} ago`;
  if(d<365)return`Updated ${Math.floor(d/30)} mo ago`;return`Updated ${fmtDate(iso)}`;
}
function relPosted(iso){
  if(!iso)return"";
  const d=Math.floor((new Date()-new Date(iso+"T00:00:00"))/86400000);
  if(d===0)return"Posted today";if(d===1)return"Posted yesterday";
  if(d<7)return`Posted ${d} days ago`;if(d<30)return`Posted ${Math.floor(d/7)} wk${d>=14?"s":""} ago`;
  return`Posted ${fmtDate(iso)}`;
}
function daysUntil(iso){
  if(!iso)return null;
  const d=Math.ceil((new Date(iso+"T00:00:00")-new Date())/86400000);
  if(d<0)return"Closed";if(d===0)return"Closes today";if(d===1)return"Closes tomorrow";
  if(d<=7)return`Closes in ${d} days`;return`Closes ${fmtDate(iso)}`;
}

// ── Tags ────────────────────────────────────────────────────────
const TAG_CLS=["tag-green","tag-blue","tag-amber","tag-purple","tag-teal"];
function tagCls(i){return TAG_CLS[i%5];}
function renderTags(tags){return(tags||[]).slice(0,3).map((t,i)=>`<span class="tag ${tagCls(i)}">${escHtml(t)}</span>`).join("");}

// ── Contacts ────────────────────────────────────────────────────
function renderContacts(b){
  const c=[];
  if(b.mobile)c.push(`<span class="chip"><i class="fa-solid fa-mobile-screen"></i>${escHtml(b.mobile)}</span>`);
  if(b.wa)    c.push(`<span class="chip"><i class="fa-brands fa-whatsapp"></i>WhatsApp</span>`);
  if(b.email) c.push(`<span class="chip"><i class="fa-solid fa-envelope"></i>Email</span>`);
  if(b.phone&&!b.mobile)c.push(`<span class="chip"><i class="fa-solid fa-phone"></i>${escHtml(b.phone)}</span>`);
  return c.join("");
}

// ── Opportunity type badge ──────────────────────────────────────
function oppTypeBadge(type){
  const key=(type||"").toLowerCase().replace(/\s+/g,"");
  const map={job:"otb-job",apprenticeship:"otb-apprenticeship",traineeship:"otb-traineeship",internship:"otb-internship",volunteering:"otb-volunteering",workexperience:"otb-workexperience"};
  const icon={job:"fa-briefcase",apprenticeship:"fa-hammer",traineeship:"fa-graduation-cap",internship:"fa-laptop",volunteering:"fa-hands-helping",workexperience:"fa-seedling"};
  const cls=map[key]||"otb-job";
  const ic=icon[key]||"fa-briefcase";
  return`<span class="opp-type-badge ${cls}"><i class="fa-solid ${ic}"></i>${escHtml(type)}</span>`;
}

// ── Business card ───────────────────────────────────────────────
function renderBizCard(b){
  const s=getOpenStatus(b);
  return`<article class="biz-card" tabindex="0" role="listitem"
    onclick="openBizModal(${b.id})" onkeydown="if(event.key==='Enter')openBizModal(${b.id})"
    aria-label="${escHtml(b.name)}">
    <div class="biz-card-header">
      <div class="biz-emoji" aria-hidden="true">${b.icon}</div>
      <div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <div class="biz-name">${escHtml(b.name)}</div>
        ${(typeof Reviews !== 'undefined') ? (() => { const avg=Reviews.avgRating(b.id,'business'); const cnt=Reviews.getFor(b.id,'business').length; return avg ? `<span style="font-size:11px;color:#F59E0B;font-weight:600">${Reviews.starsHTML(avg,'sm')}</span><span style="font-size:11px;color:var(--text-3)">${avg} (${cnt})</span>` : ''; })() : ''}
      </div>
        <div class="biz-loc"><i class="fa-solid fa-location-dot" style="font-size:10px"></i>${escHtml(b.suburb)}<span class="state-pill">${escHtml(b.state)}</span></div>
      </div>
    </div>
    <p class="biz-desc">${escHtml(b.desc)}</p>
    <div class="biz-tags">${renderTags(b.tags)}</div>
    <div class="biz-footer">
      <div class="biz-contacts">${renderContacts(b)}</div>
      <span class="open-badge ${s.cls}">${s.label}</span>
    </div>
    <div class="biz-updated"><i class="fa-regular fa-clock"></i>${relDate(b.lastUpdated)}</div>
  </article>`;
}

// ── Biz modal ───────────────────────────────────────────────────
function openBizModal(id){
  const b=DB.find(x=>x.id===id);if(!b)return;
  const s=getOpenStatus(b);
  const contacts=[
    b.mobile?`<div class="modal-row"><i class="fa-solid fa-mobile-screen modal-row-icon"></i><div><div class="modal-row-lbl">Mobile</div><a href="tel:${escHtml(b.mobile)}">${escHtml(b.mobile)}</a></div></div>`:"",
    b.phone?`<div class="modal-row"><i class="fa-solid fa-phone modal-row-icon"></i><div><div class="modal-row-lbl">Phone</div><a href="tel:${escHtml(b.phone)}">${escHtml(b.phone)}</a></div></div>`:"",
    b.email?`<div class="modal-row"><i class="fa-solid fa-envelope modal-row-icon"></i><div><div class="modal-row-lbl">Email</div><a href="mailto:${escHtml(b.email)}">${escHtml(b.email)}</a></div></div>`:"",
    b.wa?`<div class="modal-row"><i class="fa-brands fa-whatsapp modal-row-icon"></i><div><div class="modal-row-lbl">WhatsApp</div><a href="https://wa.me/61${b.wa.replace(/^0/,"").replace(/\s/g,"")}" target="_blank" rel="noopener noreferrer">${escHtml(b.wa)}</a></div></div>`:"",
    b.web?`<div class="modal-row"><i class="fa-solid fa-globe modal-row-icon"></i><div><div class="modal-row-lbl">Website</div><a href="${escHtml(b.web)}" target="_blank" rel="noopener noreferrer">${escHtml(b.web)}</a></div></div>`:"",
  ].filter(Boolean).join("");

  // Check for linked opportunities
  const opps=OPPORTUNITIES.filter(o=>o.bizId===id&&o.status==="approved");
  const oppBlock=opps.length?`<hr class="modal-divider">
    <div class="modal-sec-lbl">Opportunities from this business</div>
    ${opps.map(o=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;cursor:pointer" onclick="closeModal();setTimeout(()=>openOppDetail(${o.id}),100)" tabindex="0">
      <span style="font-size:18px">${o.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:500">${escHtml(o.title)}</div>
        <div style="font-size:11px;color:var(--text-3)">${escHtml(o.arrangement)} · ${escHtml(o.suburb)}</div>
      </div>
      ${oppTypeBadge(o.type)}
    </div>`).join("")}`:"";

  const reviewsSection = `
    <hr class="modal-divider">
    <div class="modal-sec-lbl">Reviews</div>
    <div id="biz-reviews-${b.id}"></div>
    <div id="biz-review-form-${b.id}"></div>`;

  document.getElementById("modal-body").innerHTML=`
    <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px">
      <span style="font-size:36px" aria-hidden="true">${b.icon}</span>
      <div style="flex:1"><div class="modal-biz-name">${escHtml(b.name)}</div>
      <span class="open-badge ${s.cls}" style="margin-top:5px;display:inline-block">${s.label}</span></div>
    </div>
    <div class="modal-loc-tag"><i class="fa-solid fa-location-dot"></i>${escHtml(b.suburb)}, ${escHtml(b.state)} · ${escHtml(b.industry)} › ${escHtml(b.cat)}</div>
    <p class="modal-desc">${escHtml(b.desc)}</p>
    <div class="biz-tags" style="margin-bottom:1rem">${renderTags(b.tags)}</div>
    <hr class="modal-divider">
    <div class="modal-sec-lbl">Contact</div>
    ${contacts||"<p style='font-size:13px;color:var(--text-3)'>No contact details listed.</p>"}
    <hr class="modal-divider">
    <div class="modal-sec-lbl">Trading hours</div>
    ${renderHoursTable(b.hours)}
    ${oppBlock}
    <div class="modal-updated"><i class="fa-regular fa-calendar-check"></i>Last updated: <strong>${fmtDate(b.lastUpdated)||"Unknown"}</strong>${b.contact?` · Managed by ${escHtml(b.contact)}`:""}</div>
    ${reviewsSection}`;
  // Mount reviews section
  if (typeof Reviews !== 'undefined') {
    Reviews.renderList('biz-reviews-' + b.id, b.id, 'business');
    Reviews.renderForm('biz-review-form-' + b.id, b.id, 'business', b.name);
  }
  // Mount edit trigger
    // Add disclaimer line for verifying contact info
  const disclaimerEl = document.createElement('div');
  disclaimerEl.style.cssText = 'margin-top:1rem;padding:.625rem .875rem;background:var(--amber-bg,#FEF3DC);border-left:3px solid var(--amber-b,#F4BD5E);border-radius:6px;font-size:11.5px;color:var(--amber-t,#7C2D12);line-height:1.6';
  disclaimerEl.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:5px"></i><strong>Please verify:</strong> Contact details and hours are community-submitted and may have changed. Check directly with the business before relying on this information.';
  document.getElementById('modal-body').appendChild(disclaimerEl);
  if (typeof ListingEdits !== 'undefined') {
    const editContainer = document.createElement('div');
    editContainer.id = 'biz-edit-trigger-' + b.id;
    editContainer.style.cssText = 'margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);text-align:center';
    document.getElementById('modal-body').appendChild(editContainer);
    ListingEdits.renderTrigger('biz-edit-trigger-' + b.id, b, 'business');
  }
  openModal();
}

function renderHoursTable(hours){
  if(!hours||typeof hours!=="object")return"<p style='font-size:13px;color:var(--text-3)'>Hours not provided.</p>";
  const todayKey=DAYS[new Date().getDay()];
  return`<table class="hours-table">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun","PH"].map(d=>{
    const val=hours[d]||"Closed",isT=d===todayKey,isCl=val==="Closed";
    return`<tr class="${isT?"today":""}"><td>${d==="PH"?"Public hols":DAY_FULL[DAYS.indexOf(d)]||d}</td><td class="${isCl?"hours-closed":""}">${isT?`<strong>${escHtml(val)}</strong>`:escHtml(val)}</td></tr>`;
  }).join("")}</table>`;
}

// ── Opp detail (right-panel or modal) ──────────────────────────
function openOppDetail(id){
  const o=OPPORTUNITIES.find(x=>x.id===id);if(!o)return;
  const biz=DB.find(x=>x.id===o.bizId);
  const closing=daysUntil(o.closingDate);
  const html=`
    <div class="odd-top">
      <div class="odd-icon" aria-hidden="true">${o.icon}</div>
      <div>
        <div class="odd-title">${escHtml(o.title)}</div>
        <div class="odd-org">${escHtml(o.org)}</div>
        <div class="odd-loc"><i class="fa-solid fa-location-dot" style="font-size:10px"></i>${escHtml(o.suburb)}, ${escHtml(o.state)}</div>
      </div>
    </div>
    <div class="odd-meta-row">
      ${oppTypeBadge(o.type)}
      <span class="tag tag-blue"><i class="fa-solid fa-briefcase"></i>${escHtml(o.arrangement)}</span>
      ${o.salary?`<span class="tag tag-green"><i class="fa-solid fa-dollar-sign"></i>${escHtml(o.salary)}</span>`:""}
      ${o.duration?`<span class="tag tag-amber"><i class="fa-regular fa-clock"></i>${escHtml(o.duration)}</span>`:""}
    </div>
    ${closing?`<div style="font-size:12px;font-weight:500;color:${closing==="Closed"?"var(--red-t)":closing.includes("today")||closing.includes("tomorrow")?"var(--amber-t)":"var(--text-2)"}"><i class="fa-regular fa-calendar-xmark"></i> ${escHtml(closing)}</div>`:""}
    <div class="modal-divider" style="margin:1rem 0"></div>
    <div class="odd-desc">${escHtml(o.desc)}</div>
    ${o.responsibilities&&o.responsibilities.length?`
    <div class="odd-section-title">Responsibilities</div>
    <ul class="odd-list">${o.responsibilities.map(r=>`<li>${escHtml(r)}</li>`).join("")}</ul>`:""}
    ${o.requirements&&o.requirements.length?`
    <div class="odd-section-title">Requirements</div>
    <ul class="odd-list">${o.requirements.map(r=>`<li>${escHtml(r)}</li>`).join("")}</ul>`:""}
    ${biz?`<div class="odd-section-title">About ${escHtml(biz.name)}</div>
    <p style="font-size:13px;color:var(--text-2);line-height:1.6">${escHtml(biz.desc)}</p>`:""}
    <div class="odd-actions">
      ${o.email?`<a href="mailto:${escHtml(o.email)}?subject=${encodeURIComponent("Application: "+o.title)}" class="btn-apply"><i class="fa-solid fa-paper-plane"></i> Apply via email</a>`:""}
      ${o.phone?`<a href="tel:${escHtml(o.phone)}" class="btn-save"><i class="fa-solid fa-phone"></i> ${escHtml(o.phone)}</a>`:""}
    </div>
    <div class="odd-posted"><i class="fa-regular fa-clock"></i>${relPosted(o.postedAt)}${o.contact?` · Contact: ${escHtml(o.contact)}`:""}</div>
    <div id="opp-reviews-${o.id}"></div>
    <div id="opp-review-form-${o.id}"></div>`;

  // Mount reviews
  setTimeout(() => {
    if (typeof Reviews !== 'undefined') {
      Reviews.renderList('opp-reviews-' + o.id, o.id, 'opportunity');
      Reviews.renderForm('opp-review-form-' + o.id, o.id, 'opportunity', o.title);
    }
    // Mount edit trigger
    if (typeof ListingEdits !== 'undefined') {
      const host = document.querySelector('.opp-detail-content') || document.getElementById('modal-body');
      if (host && !document.getElementById('opp-edit-trigger-' + o.id)) {
        const ec = document.createElement('div');
        ec.id = 'opp-edit-trigger-' + o.id;
        ec.style.cssText = 'margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);text-align:center';
        host.appendChild(ec);
        ListingEdits.renderTrigger('opp-edit-trigger-' + o.id, o, 'opportunity');
      }
    }
  }, 50);

  // Use side panel if available, else modal
  const panel=document.getElementById("opp-detail-panel");
  if(panel){
    panel.innerHTML=html;
    document.querySelectorAll(".opp-list-card").forEach(el=>el.classList.remove("selected"));
    const card=document.querySelector(`[data-opp-id="${id}"]`);
    if(card)card.classList.add("selected");
  } else {
    document.getElementById("modal-body").innerHTML=html;
    openModal();
  }
}

// ── Modal open/close ────────────────────────────────────────────
function openModal(){
  const ov=document.getElementById("modal-overlay");
  if(ov){ov.classList.add("open");ov.setAttribute("aria-hidden","false");}
}
function closeModal(){
  const ov=document.getElementById("modal-overlay");
  if(ov){ov.classList.remove("open");ov.setAttribute("aria-hidden","true");}
}

// ── Toast ───────────────────────────────────────────────────────
function showToast(msg,bg){
  let t=document.getElementById("toast");
  if(!t){t=document.createElement("div");t.className="toast";t.id="toast";document.body.appendChild(t);}
  t.textContent=msg;t.style.background=bg||"var(--brand)";t.style.color="#fff";
  t.classList.add("show");clearTimeout(t._tid);t._tid=setTimeout(()=>t.classList.remove("show"),2800);
}

// ── Init ────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded",()=>{
  // Modal close
  const ov=document.getElementById("modal-overlay");
  if(ov){
    ov.addEventListener("click",e=>{if(e.target===ov)closeModal();});
  }
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
  // Burger
  const burger=document.getElementById("nav-burger"),links=document.getElementById("nav-links");
  if(burger&&links){
    burger.addEventListener("click",()=>{const open=links.classList.toggle("open");burger.setAttribute("aria-expanded",open);document.body.style.overflow=open?"hidden":"";});
    // Close drawer when a link is clicked
    links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{links.classList.remove("open");burger.setAttribute("aria-expanded","false");document.body.style.overflow="";}));
    // Inject Admin + Add Business into the drawer for mobile (only added once, only visible on mobile via CSS)
    if(!document.getElementById("nav-mobile-cta")){
      const wrap=document.createElement("div");
      wrap.id="nav-mobile-cta";
      wrap.className="nav-mobile-cta";
      wrap.innerHTML='<a href="admin.html" class="nav-link" style="background:var(--bg-tint);font-weight:600;display:flex;align-items:center;gap:8px;margin-top:.5rem"><i class="fa-solid fa-shield-halved" style="color:var(--brand-dark)"></i> Admin</a><a href="register.html" class="nav-link" style="background:var(--brand);color:#fff;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:.5rem"><i class="fa-solid fa-plus"></i> Add your business</a>';
      links.appendChild(wrap);
    }
  }
  // Sticky nav shadow
  const nav=document.getElementById("navbar");
  if(nav)window.addEventListener("scroll",()=>{nav.style.boxShadow=window.scrollY>10?"0 2px 12px rgba(0,0,0,.08)":"";},{passive:true});
});
