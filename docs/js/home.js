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
