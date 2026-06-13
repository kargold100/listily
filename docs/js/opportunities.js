const OPP_TYPES=["Job","Apprenticeship","Traineeship","Internship","Volunteering","Work Experience"];
const OPP_TYPE_ICONS={Job:"fa-briefcase",Apprenticeship:"fa-hammer",Traineeship:"fa-graduation-cap",Internship:"fa-laptop",Volunteering:"fa-hands-helping","Work Experience":"fa-seedling"};
const OPP_COLORS={Job:"otb-job",Apprenticeship:"otb-apprenticeship",Traineeship:"otb-traineeship",Internship:"otb-internship",Volunteering:"otb-volunteering","Work Experience":"otb-workexperience"};
const OPP_HERO_COLORS={Job:["#E8F2FD","#1350A0"],Apprenticeship:["#FEF3DC","#92560A"],Traineeship:["#F0ECFE","#4830B0"],Internship:["#E1F5EE","#085041"],Volunteering:["#FEE9E9","#A01818"],"Work Experience":["#F0F0EC","#4A4A52"]};

let oppPage=1;
const OPP_PER_PAGE=10;
let checkedTypes=[];
let currentOppId=null;

document.addEventListener("DOMContentLoaded",()=>{
  renderTypeChecks();
  renderStatPills();

  const p=new URLSearchParams(window.location.search);
  if(p.get("state"))    {document.getElementById("of-state").value=p.get("state");onOppStateChange(false);}
  if(p.get("type"))     {checkedTypes=[p.get("type")];syncTypeChecks();}
  if(p.get("q"))        {document.getElementById("of-keyword").value=p.get("q");}
  if(p.get("industry")) {document.getElementById("of-industry").value=p.get("industry");}

  applyOppFilters();

  if(p.get("id")){
    const id=parseInt(p.get("id"));
    setTimeout(()=>openOppDetail(id),200);
  }
});

function renderTypeChecks(){
  const c=document.getElementById("type-checks");if(!c)return;
  c.innerHTML=OPP_TYPES.map(t=>`
    <label class="check-item">
      <input type="checkbox" value="${escHtml(t)}" onchange="onTypeCheck(this)">
      <i class="fa-solid ${OPP_TYPE_ICONS[t]}" style="color:var(--brand);font-size:13px"></i>
      ${escHtml(t)}
    </label>`).join("");
}

function syncTypeChecks(){
  document.querySelectorAll("#type-checks input").forEach(cb=>{
    cb.checked=checkedTypes.includes(cb.value);
  });
}

function onTypeCheck(cb){
  if(cb.checked){if(!checkedTypes.includes(cb.value))checkedTypes.push(cb.value);}
  else{checkedTypes=checkedTypes.filter(t=>t!==cb.value);}
  applyOppFilters();
}

function renderStatPills(){
  const el=document.getElementById("opp-stat-pills");if(!el)return;
  const approved=OPPORTUNITIES.filter(o=>o.status==="approved");
  const total=approved.length;
  const cols=OPP_HERO_COLORS;
  el.innerHTML=`<a href="#" class="osp" onclick="clearOppFilters();return false" style="background:rgba(255,255,255,.15);color:#fff">${total} total</a>`
    +OPP_TYPES.map(t=>{
      const n=approved.filter(o=>o.type===t).length;
      const [bg,tc]=cols[t]||["#eee","#333"];
      return`<a href="#" class="osp" onclick="checkedTypes=['${t}'];syncTypeChecks();applyOppFilters();return false" style="background:${bg};color:${tc}"><i class="fa-solid ${OPP_TYPE_ICONS[t]}"></i>${t} <strong>${n}</strong></a>`;
    }).join("");
}

function onOppStateChange(run=true){
  const state=document.getElementById("of-state").value;
  const sel=document.getElementById("of-suburb");
  sel.innerHTML=`<option value="">All suburbs</option>`;
  (STATE_SUBURBS[state]||[]).sort().forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=s;sel.appendChild(o);});
  if(run)applyOppFilters();
}

function applyOppFilters(){
  const kw=(document.getElementById("of-keyword").value||"").toLowerCase();
  const state=document.getElementById("of-state").value;
  const suburb=document.getElementById("of-suburb").value;
  const industry=document.getElementById("of-industry").value;
  const arrange=document.getElementById("of-arrange").value;
  const sort=document.getElementById("of-sort").value;

  let list=OPPORTUNITIES.filter(o=>o.status==="approved");
  if(kw)        list=list.filter(o=>(o.title+" "+o.org+" "+o.desc+" "+(o.requirements||[]).join(" ")).toLowerCase().includes(kw));
  if(state)     list=list.filter(o=>o.state===state);
  if(suburb)    list=list.filter(o=>o.suburb===suburb);
  if(industry)  list=list.filter(o=>o.industry===industry);
  if(arrange)   list=list.filter(o=>o.arrangement===arrange);
  if(checkedTypes.length) list=list.filter(o=>checkedTypes.includes(o.type));

  if(sort==="closing")  list.sort((a,b)=>{if(!a.closingDate)return 1;if(!b.closingDate)return -1;return new Date(a.closingDate)-new Date(b.closingDate);});
  else if(sort==="alpha") list.sort((a,b)=>a.title.localeCompare(b.title));
  else list.sort((a,b)=>new Date(b.postedAt)-new Date(a.postedAt));

  const title=document.getElementById("opp-title");
  const titleParts=[];
  if(checkedTypes.length===1)titleParts.push(checkedTypes[0]+"s");
  if(suburb)titleParts.push(suburb);else if(state)titleParts.push(state);
  if(title)title.textContent=titleParts.length?titleParts.join(" in "):"All opportunities";
  document.getElementById("opp-count").textContent=`${list.length} opportunit${list.length===1?"y":"ies"} found`;

  let fc=[kw,state,suburb,industry,arrange,...checkedTypes].filter(Boolean).length;
  const badge=document.getElementById("opp-filter-badge");
  if(badge){badge.textContent=fc;badge.style.display=fc>0?"inline-flex":"none";}

  oppPage=1;
  window._oppList=list;
  renderOppList(list);
  renderOppPagination(list);
  renderStatPills();
}

function renderOppList(list){
  const el=document.getElementById("opp-list");if(!el)return;
  const page=list.slice((oppPage-1)*OPP_PER_PAGE,oppPage*OPP_PER_PAGE);
  if(!page.length){
    el.innerHTML=`<div class="no-results"><i class="fa-solid fa-briefcase"></i><h3>No opportunities found</h3><p>Try different keywords or filters.</p></div>`;
    return;
  }
  el.innerHTML=page.map(o=>{
    const closing=daysUntil(o.closingDate);
    const isNew=Math.floor((new Date()-new Date(o.postedAt+"T00:00:00"))/86400000)<=3;
    return`<div class="opp-list-card" data-opp-id="${o.id}" onclick="openOppDetail(${o.id})" tabindex="0" onkeydown="if(event.key==='Enter')openOppDetail(${o.id})" role="listitem">
      <div class="olc-header">
        <div class="olc-icon" aria-hidden="true">${o.icon}</div>
        <div style="flex:1;min-width:0">
          <div class="olc-title">${escHtml(o.title)} ${isNew?'<span class="olc-new-badge">New</span>':""}</div>
          <div class="olc-org"><i class="fa-solid fa-building" style="font-size:10px"></i>${escHtml(o.org)}</div>
          <div class="olc-loc"><i class="fa-solid fa-location-dot" style="font-size:10px"></i>${escHtml(o.suburb)}, ${escHtml(o.state)}</div>
        </div>
      </div>
      <div class="olc-footer">
        <div class="olc-meta">
          ${oppTypeBadge(o.type)}
          <span class="tag tag-blue" style="font-size:10px">${escHtml(o.arrangement)}</span>
          ${o.salary?`<span class="tag tag-green" style="font-size:10px">${escHtml(o.salary)}</span>`:""}
        </div>
        <div>
          <span class="olc-posted">${relPosted(o.postedAt)}</span>
          ${closing&&closing!=="Closed"?`<span style="font-size:11px;color:var(--amber-t);margin-left:6px">· ${escHtml(closing)}</span>`:""}
        </div>
      </div>
    </div>`;
  }).join("");

  // Auto-select first on desktop
  if(page.length){
    const panel=document.getElementById("opp-detail-panel");
    if(panel&&window.innerWidth>1050)openOppDetail(page[0].id);
  }
}

function renderOppPagination(list){
  const total=Math.ceil(list.length/OPP_PER_PAGE);
  const pg=document.getElementById("opp-pagination");
  if(!pg||total<=1){if(pg)pg.innerHTML="";return;}
  let html=`<button class="page-btn" onclick="goOppPage(${oppPage-1})" ${oppPage===1?"disabled":""} aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>`;
  for(let i=1;i<=total;i++){
    if(i===1||i===total||Math.abs(i-oppPage)<=1)html+=`<button class="page-btn${i===oppPage?" active":""}" onclick="goOppPage(${i})">${i}</button>`;
    else if(Math.abs(i-oppPage)===2)html+=`<span style="padding:0 4px;color:var(--text-3)">…</span>`;
  }
  html+=`<button class="page-btn" onclick="goOppPage(${oppPage+1})" ${oppPage===total?"disabled":""} aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>`;
  pg.innerHTML=html;
}

function goOppPage(n){
  oppPage=n;
  renderOppList(window._oppList||[]);
  renderOppPagination(window._oppList||[]);
  window.scrollTo({top:0,behavior:"smooth"});
}

function clearOppFilters(){
  document.getElementById("of-keyword").value="";
  document.getElementById("of-state").value="";
  document.getElementById("of-suburb").value="";
  document.getElementById("of-industry").value="";
  document.getElementById("of-arrange").value="";
  document.getElementById("of-sort").value="newest";
  checkedTypes=[];
  syncTypeChecks();
  onOppStateChange(false);
  applyOppFilters();
}

function toggleOppSidebar(open){
  document.getElementById("opp-sidebar").classList.toggle("open",open);
  document.getElementById("opp-sidebar-overlay").classList.toggle("open",open);
}
