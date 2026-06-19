let currentView="grid",currentPage=1,activePillCat="";
const PER_PAGE=12;

document.addEventListener("DOMContentLoaded",()=>{
  const p=new URLSearchParams(window.location.search);
  if(p.get("state")){document.getElementById("f-state").value=p.get("state");onStateChange(false);}
  if(p.get("suburb")){document.getElementById("f-suburb").value=p.get("suburb");}
  if(p.get("industry")){document.getElementById("f-industry").value=p.get("industry");populateCatFilter();}
  if(p.get("cat")){document.getElementById("f-cat").value=p.get("cat");activePillCat=p.get("cat");}
  if(p.get("q")){document.getElementById("f-keyword").value=p.get("q");}
  if(p.get("sort")){document.getElementById("f-sort").value=p.get("sort");}
  populateCatFilter();applyFilters();
});

function onStateChange(run=true){
  const state=document.getElementById("f-state").value,sel=document.getElementById("f-suburb");
  sel.innerHTML=`<option value="">All suburbs</option>`;
  (STATE_SUBURBS[state]||[]).sort().forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=s;sel.appendChild(o);});
  if(run)applyFilters();
}

function populateCatFilter(){
  const ind=document.getElementById("f-industry").value,sel=document.getElementById("f-cat");
  sel.innerHTML=`<option value="">All categories</option>`;
  const cats=ind?(INDUSTRY_CATS[ind]||[]):[...new Set(DB.map(b=>b.cat))].sort();
  cats.forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;sel.appendChild(o);});
  const row=document.getElementById("cat-pills-row");
  if(!ind){row.innerHTML="";return;}
  row.innerHTML=`<button class="cat-pill${!activePillCat?" active":""}" onclick="setPillCat('')">All</button>`
    +(INDUSTRY_CATS[ind]||[]).map(c=>`<button class="cat-pill${activePillCat===c?" active":""}" onclick="setPillCat('${escHtml(c)}')">${escHtml(c)}</button>`).join("");
}

function setPillCat(cat){
  activePillCat=cat;document.getElementById("f-cat").value=cat;
  document.querySelectorAll(".cat-pill").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".cat-pill").forEach(p=>{if((!cat&&p.textContent==="All")||p.textContent===cat)p.classList.add("active");});
  applyFilters();
}

function applyFilters(){
  const kw=document.getElementById("f-keyword").value.toLowerCase();
  const state=document.getElementById("f-state").value;
  const suburb=document.getElementById("f-suburb").value;
  const ind=document.getElementById("f-industry").value;
  const cat=document.getElementById("f-cat").value||activePillCat;
  const openOnly=document.getElementById("f-open").checked;
  const sort=document.getElementById("f-sort").value;

  let list=DB.filter(b=>b.status==="approved");
  if(kw) list=list.filter(b=>(b.name+" "+b.desc+" "+(b.tags||[]).join(" ")+" "+b.cat+" "+b.industry).toLowerCase().includes(kw));
  if(state) list=list.filter(b=>b.state===state);
  if(suburb) list=list.filter(b=>b.suburb===suburb);
  if(ind) list=list.filter(b=>b.industry===ind);
  if(cat) list=list.filter(b=>b.cat===cat);
  if(openOnly) list=list.filter(b=>getOpenStatus(b).cls==="open");

  if(sort==="newest") list.sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));
  else if(sort==="updated") list.sort((a,b)=>new Date(b.lastUpdated)-new Date(a.lastUpdated));
  else list.sort((a,b)=>a.name.localeCompare(b.name));

  const parts=[];
  if(ind)parts.push(ind);if(cat&&cat!==ind)parts.push(cat);
  if(suburb)parts.push(suburb);else if(state)parts.push(state);
  document.getElementById("dir-title").textContent=parts.length?parts.join(" · "):"All businesses";
  document.getElementById("dir-count").textContent=`${list.length} listing${list.length!==1?"s":""} found`;

  const fc=[kw,state,suburb,ind,cat,openOnly&&"open"].filter(Boolean).length;
  const badge=document.getElementById("active-filter-count");
  badge.textContent=fc;badge.style.display=fc>0?"inline-flex":"none";

  currentPage=1;window._filteredList=list;
  renderResults(list);renderPagination(list);
}

function renderResults(list){
  const c=document.getElementById("results-container");
  const page=list.slice((currentPage-1)*PER_PAGE,currentPage*PER_PAGE);
  if(!page.length){c.innerHTML=`<div class="no-results"><i class="fa-solid fa-magnifying-glass"></i><h3>No businesses found</h3><p>Try adjusting your search or filters.</p></div>`;return;}
  if(currentView==="list"){
    c.innerHTML=`<div class="results-list" role="list">${page.map(b=>{
      const s=getOpenStatus(b);
      return`<article class="biz-card" style="flex-direction:row;gap:14px" tabindex="0" onclick="openBizModal(${b.id})" role="listitem">
        <div class="biz-emoji" aria-hidden="true">${b.icon}</div>
        <div style="flex:1;min-width:0">
          <div class="biz-name">${escHtml(b.name)}</div>
          <div class="biz-loc" style="margin-bottom:4px"><i class="fa-solid fa-location-dot" style="font-size:10px"></i>${escHtml(b.suburb)}, ${escHtml(b.state)} · ${escHtml(b.cat)}</div>
          <p class="biz-desc">${escHtml(b.desc)}</p>
          <div class="biz-tags">${renderTags(b.tags)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
          <span class="open-badge ${s.cls}">${s.label}</span>
          <div class="biz-contacts">${renderContacts(b)}</div>
          <div class="biz-updated"><i class="fa-regular fa-clock"></i>${relDate(b.lastUpdated)}</div>
        </div>
      </article>`;
    }).join("")}</div>`;
  } else {
    c.innerHTML=`<div class="results-grid" role="list">${page.map(renderBizCard).join("")}</div>`;
  }
}

function renderPagination(list){
  const total=Math.ceil(list.length/PER_PAGE),pg=document.getElementById("pagination");
  if(total<=1){pg.innerHTML="";return;}
  let html=`<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?"disabled":""} aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>`;
  for(let i=1;i<=total;i++){
    if(i===1||i===total||Math.abs(i-currentPage)<=1) html+=`<button class="page-btn${i===currentPage?" active":""}" onclick="goPage(${i})">${i}</button>`;
    else if(Math.abs(i-currentPage)===2) html+=`<span style="padding:0 4px;color:var(--text-3)">…</span>`;
  }
  html+=`<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===total?"disabled":""} aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>`;
  pg.innerHTML=html;
}

function goPage(n){currentPage=n;renderResults(window._filteredList||[]);renderPagination(window._filteredList||[]);window.scrollTo({top:0,behavior:"smooth"});}
function setView(v){currentView=v;document.getElementById("vbtn-grid").classList.toggle("active",v==="grid");document.getElementById("vbtn-list").classList.toggle("active",v==="list");renderResults(window._filteredList||[]);}
function clearFilters(){["f-keyword","f-suburb"].forEach(id=>{const e=document.getElementById(id);if(e)e.value="";});["f-state","f-industry","f-cat","f-sort"].forEach(id=>{const e=document.getElementById(id);if(e)e.value="";});document.getElementById("f-open").checked=false;activePillCat="";onStateChange(false);populateCatFilter();applyFilters();}
function toggleSidebar(open){document.getElementById("dir-sidebar").classList.toggle("open",open);document.getElementById("sidebar-overlay").classList.toggle("open",open);}
