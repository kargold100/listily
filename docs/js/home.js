const INDUSTRIES=[
  {name:"Hospitality & Food",icon:"fa-utensils",col:"green"},
  {name:"Home & Trade Services",icon:"fa-screwdriver-wrench",col:"amber"},
  {name:"Health & Medical",icon:"fa-heart-pulse",col:"red"},
  {name:"Real Estate & Property",icon:"fa-house",col:"blue"},
  {name:"Education & Childcare",icon:"fa-graduation-cap",col:"purple"},
  {name:"Professional Services",icon:"fa-briefcase",col:"blue"},
  {name:"Retail & Shopping",icon:"fa-bag-shopping",col:"amber"},
  {name:"Beauty & Personal Care",icon:"fa-spa",col:"purple"},
  {name:"Automotive",icon:"fa-car",col:"green"},
  {name:"Community & Culture",icon:"fa-people-group",col:"amber"},
  {name:"Technology & IT",icon:"fa-laptop-code",col:"blue"},
  {name:"Finance & Insurance",icon:"fa-chart-line",col:"green"},
  {name:"Fitness & Sport",icon:"fa-dumbbell",col:"red"},
  {name:"Events & Entertainment",icon:"fa-star",col:"purple"},
  {name:"Home Business",icon:"fa-house-laptop",col:"amber"},
  {name:"Emergency & Support",icon:"fa-phone-volume",col:"red"},
];

const COL={green:"background:var(--green-bg);color:var(--green-t)",blue:"background:var(--blue-bg);color:var(--blue-t)",amber:"background:var(--amber-bg);color:var(--amber-t)",red:"background:var(--red-bg);color:var(--red-t)",purple:"background:var(--purple-bg);color:var(--purple-t)"};

function renderIndustries(){
  const g=document.getElementById("industry-grid");if(!g)return;
  const approved=DB.filter(b=>b.status==="approved");
  g.innerHTML=INDUSTRIES.map(ind=>{
    const n=approved.filter(b=>b.industry===ind.name).length;
    const oc=approved.filter(b=>b.industry===ind.name).reduce((a,b)=>{return a+(OPPORTUNITIES.filter(o=>o.bizId===b.id&&o.status==="approved").length);},0);
    return`<a href="directory.html?industry=${encodeURIComponent(ind.name)}" class="ind-card">
      <div class="ind-icon" style="${COL[ind.col]}"><i class="fa-solid ${ind.icon}"></i></div>
      <div class="ind-name">${ind.name}</div>
      <div class="ind-count">${n} listing${n!==1?"s":""}${oc>0?` · ${oc} opp${oc!==1?"s":""}`:""}</div>
    </a>`;
  }).join("");
}

let oppStripFilter="";
function filterOppStrip(type,btn){
  oppStripFilter=type;
  document.querySelectorAll(".otp").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderOppStrip();
}

function renderOppStrip(){
  const g=document.getElementById("opp-strip");if(!g)return;
  const list=OPPORTUNITIES.filter(o=>o.status==="approved"&&(!oppStripFilter||o.type===oppStripFilter)).slice(0,6);
  if(!list.length){g.innerHTML=`<p style="color:rgba(255,255,255,.5);font-size:14px;padding:1rem 0">No ${oppStripFilter||""} opportunities listed yet.</p>`;return;}
  g.innerHTML=list.map(o=>{
    const closing=daysUntil(o.closingDate);
    return`<div class="opp-card-dark" onclick="location.href='opportunities.html?id=${o.id}'" tabindex="0" onkeydown="if(event.key==='Enter')location.href='opportunities.html?id=${o.id}'">
      <div class="ocd-header">
        <div>
          <div class="ocd-title">${escHtml(o.title)}</div>
          <div class="ocd-org"><i class="fa-solid fa-building" style="font-size:10px"></i>${escHtml(o.org)}</div>
          <div class="ocd-loc"><i class="fa-solid fa-location-dot" style="font-size:10px"></i>${escHtml(o.suburb)}, ${escHtml(o.state)}</div>
        </div>
        <span style="font-size:22px" aria-hidden="true">${o.icon}</span>
      </div>
      <div class="ocd-meta">
        ${oppTypeBadge(o.type)}
        <span class="ocd-tag">${escHtml(o.arrangement)}</span>
        ${o.salary?`<span class="ocd-tag">${escHtml(o.salary)}</span>`:""}
      </div>
      <div class="ocd-posted">${relPosted(o.postedAt)}${closing?` · ${escHtml(closing)}`:""}</div>
    </div>`;
  }).join("");
}

function renderFeatured(){
  const g=document.getElementById("featured-grid");if(!g)return;
  const list=DB.filter(b=>b.status==="approved"&&b.featured).slice(0,6);
  g.innerHTML=list.map(renderBizCard).join("")||"<p style='color:var(--text-3)'>No featured listings yet.</p>";
}

function renderRecent(){
  const el=document.getElementById("recent-list");if(!el)return;
  const list=DB.filter(b=>b.status==="approved").sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt)).slice(0,5);
  el.innerHTML=list.map(b=>{
    const s=getOpenStatus(b);
    return`<div class="recent-item" onclick="openBizModal(${b.id})" tabindex="0">
      <div class="recent-emoji">${b.icon}</div>
      <div class="recent-body">
        <div class="recent-name">${escHtml(b.name)}</div>
        <div class="recent-meta"><i class="fa-solid fa-location-dot" style="font-size:10px"></i> ${escHtml(b.suburb)}, ${escHtml(b.state)} · ${escHtml(b.cat)}</div>
      </div>
      <div class="recent-right">
        <span class="open-badge ${s.cls}" style="font-size:10px">${s.label}</span>
        <span style="font-size:11px;color:var(--text-3)">${relDate(b.submittedAt)}</span>
      </div>
    </div>`;
  }).join("");
}

let currentSearchTab="biz";
function setSearchTab(t){
  currentSearchTab=t;
  document.getElementById("stab-biz").classList.toggle("active",t==="biz");
  document.getElementById("stab-opp").classList.toggle("active",t==="opp");
  document.getElementById("hsb-biz").style.display=t==="biz"?"block":"none";
  document.getElementById("hsb-opp").style.display=t==="opp"?"block":"none";
}

function heroSearch(tab){
  if(tab==="biz"){
    const kw=document.getElementById("hs-kw-biz").value.trim();
    const loc=document.getElementById("hs-loc-biz").value.trim();
    const state=document.getElementById("hs-state-biz").value;
    const p=new URLSearchParams();
    if(kw)p.set("q",kw);if(loc)p.set("suburb",loc);if(state)p.set("state",state);
    window.location.href="directory.html?"+p.toString();
  } else {
    const kw=document.getElementById("hs-kw-opp").value.trim();
    const loc=document.getElementById("hs-loc-opp").value.trim();
    const type=document.getElementById("hs-type-opp").value;
    const p=new URLSearchParams();
    if(kw)p.set("q",kw);if(loc)p.set("suburb",loc);if(type)p.set("type",type);
    window.location.href="opportunities.html?"+p.toString();
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  renderIndustries();
  renderOppStrip();
  renderFeatured();
  renderRecent();
  renderHomeMentors();

  const sb=document.getElementById("stat-biz"),so=document.getElementById("stat-opp");
  if(sb)sb.textContent=DB.filter(b=>b.status==="approved").length+"+";
  if(so)so.textContent=OPPORTUNITIES.filter(o=>o.status==="approved").length+"+";

  // Keyword autocomplete
  const inp=document.getElementById("hs-kw-biz"),ac=document.getElementById("ac-biz");
  if(inp&&ac){
    inp.addEventListener("input",()=>{
      const q=inp.value.toLowerCase().trim();
      if(!q){ac.classList.remove("open");return;}
      const m=[...new Set(DB.filter(b=>b.status==="approved").flatMap(b=>[b.name,b.cat,...(b.tags||[])]).filter(s=>s.toLowerCase().includes(q)))].slice(0,8);
      ac.innerHTML=m.map(x=>`<div class="ac-item" onclick="document.getElementById('hs-kw-biz').value='${escHtml(x)}';document.getElementById('ac-biz').classList.remove('open')">${escHtml(x)}</div>`).join("");
      ac.classList.toggle("open",m.length>0);
    });
    document.addEventListener("click",e=>{if(!inp.contains(e.target))ac.classList.remove("open");});
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")heroSearch("biz");});
  }

  // Populate biz suburb datalist
  const dl=document.getElementById("suburb-ac-biz");
  if(dl){
    const subs=[...new Set(Object.values(STATE_SUBURBS).flat())].sort();
    subs.forEach(s=>{const o=document.createElement("option");o.value=s;dl.appendChild(o);});
  }

  document.getElementById("hs-kw-opp")?.addEventListener("keydown",e=>{if(e.key==="Enter")heroSearch("opp");});
});

// ── Mentor strip on homepage ─────────────────────────────────────
function renderHomeMentors() {
  const grid = document.getElementById('home-mentor-grid');
  if (!grid || typeof MENTORS === 'undefined') return;
  const featured = MENTORS.filter(m => m.status === 'approved' && m.featured).slice(0, 3);
  grid.innerHTML = featured.map(m => `
    <div class="mentor-card" onclick="location.href='mentors.html'" tabindex="0" style="cursor:pointer">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
        <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#A89CFF,#5B4CF5);display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-weight:700;font-size:19px;color:#fff;flex-shrink:0">${escHtml(m.avatar||m.name.charAt(0))}</div>
        <div>
          <div style="font-weight:600;font-size:14px;color:#fff">${escHtml(m.name)}</div>
          <div style="font-size:12px;color:#A89CFF;margin-top:2px"><i class="fa-solid fa-star" style="font-size:10px"></i> ${escHtml(m.specialty)}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.45);margin-top:2px"><i class="fa-solid fa-location-dot" style="font-size:9px"></i> ${escHtml(m.suburb)}, ${escHtml(m.state)}</div>
        </div>
      </div>
      <p style="font-size:13px;color:rgba(255,255,255,.55);line-height:1.55;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${escHtml(m.bio)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${(m.areas||[]).slice(0,3).map(a=>`<span style="font-size:11px;font-weight:500;padding:2px 9px;border-radius:999px;background:rgba(168,156,255,.15);color:#C4BCFF;border:1px solid rgba(168,156,255,.2)">${escHtml(a)}</span>`).join('')}
      </div>
    </div>`).join('') || '<p style="color:rgba(255,255,255,.4);font-size:14px">Mentors coming soon — <a href="register.html#mentor" style="color:#A89CFF">be the first to register</a>.</p>';
}
