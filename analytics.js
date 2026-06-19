let regStep=1;

function goStep(n){
  if(n>regStep&&!validateStep(regStep))return;
  if(n===5)buildReview();
  document.getElementById(`step-${regStep}`).classList.remove("active");
  document.querySelectorAll(".reg-step").forEach(el=>{
    const s=parseInt(el.dataset.step);el.classList.remove("active","done");
    if(s===n)el.classList.add("active");else if(s<n)el.classList.add("done");
  });
  document.getElementById(`step-${n}`).classList.add("active");
  regStep=n;window.scrollTo({top:0,behavior:"smooth"});
}

function validateStep(s){
  if(s===1){
    const name2=document.getElementById("r-name")?.value.trim();
    const ind2=document.getElementById("r-industry")?.value;
    const cat2=getCatValue();
    const state2=document.getElementById("r-state")?.value;
    const sub2=document.getElementById("r-suburb")?.value.trim();
    const desc2=document.getElementById("r-desc")?.value.trim();
    if(!name2||!ind2||!cat2||!state2||!sub2||!desc2){alert("Please fill in all required fields.");return false;}
    return true;/*skip*/
    const fields=["r-name","r-industry","r-cat","r-state","r-suburb","r-desc"];
    if(fields.some(id=>!document.getElementById(id)?.value.trim())){alert("Please fill in all required fields.");return false;}
  }
  if(s===2&&!document.getElementById("r-contact")?.value.trim()){alert("Please enter contact name.");return false;}
  if(s===3){
    const em=document.getElementById("r-email")?.value.trim();
    if(!em){alert("Email is required.");return false;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){alert("Please enter a valid email.");return false;}
  }
  return true;
}

function populateCatDropdown(){
  const ind = document.getElementById("r-industry").value;
  const sel = document.getElementById("r-cat");
  const freeInput = document.getElementById("r-cat-free");
  const isEmergency = ind === "Emergency & Support";

  if (isEmergency) {
    // Show free-text input, hide dropdown
    sel.style.display = "none";
    if (freeInput) {
      freeInput.style.display = "block";
      freeInput.placeholder = "e.g. Crisis Line, Mental Health Helpline, Domestic Violence Support, After-Hours GP…";
      freeInput.required = true;
    }
  } else {
    // Show dropdown, hide free-text
    sel.style.display = "block";
    if (freeInput) { freeInput.style.display = "none"; freeInput.required = false; }
    sel.innerHTML = `<option value="">Select category…</option>`;
    (INDUSTRY_CATS[ind] || []).forEach(c => {
      const o = document.createElement("option");
      o.value = c; o.textContent = c; sel.appendChild(o);
    });
  }
}

function getCatValue() {
  const ind = document.getElementById("r-industry").value;
  if (ind === "Emergency & Support") {
    return document.getElementById("r-cat-free")?.value.trim() || "";
  }
  return document.getElementById("r-cat")?.value || "";
}

function populateSuburbList(){
  const state=document.getElementById("r-state").value,dl=document.getElementById("suburb-list");
  dl.innerHTML="";
  (STATE_SUBURBS[state]||[]).sort().forEach(s=>{const o=document.createElement("option");o.value=s;dl.appendChild(o);});
}

function getHoursFromForm(){
  const h={};document.querySelectorAll(".hi[data-day]").forEach(el=>{h[el.dataset.day]=el.value.trim()||"Closed";});return h;
}

function buildReview(){
  const rows=[
    ["Business name",document.getElementById("r-name")?.value],
    ["Industry",document.getElementById("r-industry")?.value],
    ["Category",getCatValue()],
    ["State",document.getElementById("r-state")?.value],
    ["Suburb",document.getElementById("r-suburb")?.value],
    ["ABN",document.getElementById("r-abn")?.value],
    ["Contact",document.getElementById("r-contact")?.value],
    ["Role",document.getElementById("r-role")?.value],
    ["Mobile",document.getElementById("r-mobile")?.value],
    ["Email",document.getElementById("r-email")?.value],
    ["WhatsApp",document.getElementById("r-wa")?.value],
    ["Website",document.getElementById("r-web")?.value],
  ].filter(([,v])=>v);
  document.getElementById("review-box").innerHTML=rows.map(([l,v])=>`<div class="review-row"><span class="review-lbl">${escHtml(l)}</span><span class="review-val">${escHtml(v)}</span></div>`).join("");
}

function submitReg(){
  if(!validateStep(3))return;
  const today=new Date().toISOString().slice(0,10);
  const ind=document.getElementById("r-industry").value;
  const name=document.getElementById("r-name").value.trim();
  DB.push({
    id:Date.now(),name,industry:ind,cat:getCatValue(),
    suburb:document.getElementById("r-suburb").value.trim(),state:document.getElementById("r-state").value,
    abn:document.getElementById("r-abn")?.value,
    desc:document.getElementById("r-desc").value.trim(),
    icon:industryIcon(ind),
    tags:(document.getElementById("r-keywords")?.value||"").split(",").map(s=>s.trim()).filter(Boolean).slice(0,3),
    contact:document.getElementById("r-contact").value.trim(),
    role:document.getElementById("r-role")?.value,
    mobile:document.getElementById("r-mobile")?.value.trim(),
    phone:document.getElementById("r-phone")?.value.trim(),
    email:document.getElementById("r-email").value.trim(),
    wa:document.getElementById("r-wa")?.value.trim(),
    web:document.getElementById("r-web")?.value.trim(),
    fb:document.getElementById("r-fb")?.value.trim(),
    hours:getHoursFromForm(),lastUpdated:today,submittedAt:today,status:"pending"
  });
  document.getElementById("success-msg").textContent=`"${name}" has been submitted for review and will go live within 24 hours.`;
  document.getElementById("reg-form-wrapper").style.display="none";
  document.getElementById("success-panel").style.display="block";
}

function resetForm(){
  document.querySelectorAll("#reg-form-wrapper input,#reg-form-wrapper select,#reg-form-wrapper textarea").forEach(el=>el.value="");
  document.getElementById("reg-form-wrapper").style.display="block";
  document.getElementById("success-panel").style.display="none";
  goStep(1);
}

function submitOpp(){
  const title=document.getElementById("ro-title")?.value.trim();
  const type=document.getElementById("ro-type")?.value;
  const email=document.getElementById("ro-email")?.value.trim();
  if(!title||!type||!email){alert("Please fill in all required opportunity fields.");return;}
  const today=new Date().toISOString().slice(0,10);
  OPPORTUNITIES.push({
    id:Date.now(),title,type,
    org:document.getElementById("ro-org")?.value.trim()||"",
    suburb:document.getElementById("ro-suburb")?.value.trim()||"",
    state:document.getElementById("ro-state")?.value||"",
    industry:document.getElementById("ro-industry")?.value||"",
    arrangement:document.getElementById("ro-arrange")?.value||"",
    salary:document.getElementById("ro-salary")?.value.trim()||"",
    duration:document.getElementById("ro-duration")?.value.trim()||"",
    icon:"💼",
    desc:document.getElementById("ro-desc")?.value.trim()||"",
    responsibilities:(document.getElementById("ro-responsibilities")?.value||"").split("\n").map(s=>s.trim()).filter(Boolean),
    requirements:(document.getElementById("ro-requirements")?.value||"").split("\n").map(s=>s.trim()).filter(Boolean),
    closingDate:document.getElementById("ro-closing")?.value||null,
    email,contact:document.getElementById("ro-contact")?.value.trim()||"",
    phone:document.getElementById("ro-phone")?.value.trim()||"",
    postedAt:today,lastUpdated:today,status:"pending"
  });
  document.getElementById("opp-success-msg").textContent=`"${title}" has been submitted and will appear after admin review.`;
  document.getElementById("opp-form").style.display="none";
  document.getElementById("opp-success").style.display="block";
}

function industryIcon(ind){
  const m={"Hospitality & Food":"🍽️","Home & Trade Services":"🔧","Health & Medical":"🏥","Real Estate & Property":"🏡","Education & Childcare":"📚","Professional Services":"💼","Retail & Shopping":"🛍️","Beauty & Personal Care":"✂️","Automotive":"🚗","Community & Culture":"🎭","Technology & IT":"💻","Finance & Insurance":"📊","Fitness & Sport":"💪","Events & Entertainment":"🎉","Home Business":"🏠"};
  return m[ind]||"🏢";
}

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("r-industry")?.addEventListener("change",populateCatDropdown);
  document.getElementById("r-state")?.addEventListener("change",populateSuburbList);
  // Handle #opportunity anchor
  if(window.location.hash==="#opportunity"){
    document.getElementById("tab-biz")?.classList.remove("active");
    document.getElementById("tab-opp")?.classList.add("active");
    document.getElementById("biz-form-section")?.style.setProperty("display","none");
    document.getElementById("opp-form-section")?.style.setProperty("display","block");
  }
});

function submitMentor() {
  const name    = document.getElementById('rm-name')?.value.trim();
  const state   = document.getElementById('rm-state')?.value;
  const suburb  = document.getElementById('rm-suburb')?.value.trim();
  const exp     = document.getElementById('rm-exp')?.value;
  const spec    = document.getElementById('rm-specialty')?.value.trim();
  const areas   = document.getElementById('rm-areas')?.value.trim();
  const bio     = document.getElementById('rm-bio')?.value.trim();
  const email   = document.getElementById('rm-email')?.value.trim();
  const avail   = document.getElementById('rm-avail')?.value;

  if (!name||!state||!suburb||!exp||!spec||!areas||!bio||!email||!avail) {
    alert('Please fill in all required fields marked with *.'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.'); return;
  }

  const phone     = document.getElementById('rm-phone')?.value.trim();
  const wa        = document.getElementById('rm-wa')?.value.trim();
  const whitelist = document.getElementById('rm-whitelist')?.checked || false;
  const modes     = [...document.querySelectorAll('.rm-mode:checked')].map(el => el.value);
  const notes     = document.getElementById('rm-notes')?.value.trim();
  const today     = new Date().toISOString().slice(0,10);
  const areaList  = areas.split(',').map(s => s.trim()).filter(Boolean);

  if (typeof MENTORS !== 'undefined') {
    MENTORS.push({
      id: Date.now(),
      name, state, suburb,
      specialty: spec,
      areas: areaList,
      bio,
      avatar: name.charAt(0).toUpperCase(),
      experience: exp,
      email, phone, wa,
      whitelistPhone: whitelist,
      mode: modes.length ? modes : ['Video call'],
      available: avail,
      notes,
      tags: areaList.slice(0,4),
      lastUpdated: today,
      submittedAt: today,
      status: 'pending'
    });
  }

  document.getElementById('mentor-success-msg').textContent =
    `"${name}" has been submitted for review and will appear on the mentors page within 24 hours.`;
  document.getElementById('mentor-form').style.display = 'none';
  document.getElementById('mentor-success').style.display = 'block';
}
