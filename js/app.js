/* PAMBALA — aplicação inicial. Sem servidor: dados e perfil ficam no navegador. */
const STORAGE_KEY = "pambala_state_v1";
const HISTORY_KEY = "pambala_history_v1";
const DEFAULT_POINT = { name: "Talatona, Luanda (ponto inicial)", lat: -8.918, lon: 13.19 };

let state = loadState();
let crops = [];
let map = null;
let marker = null;
let climateData = null;
let chart = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { location: null, soil: null, climate: null }; }
  catch { return { location: null, soil: null, climate: null }; }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function setView(view) {
  $$(".view").forEach(el => el.classList.toggle("active", el.id === `view-${view}`));
  $$(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  const labels = { inicio:"Visão geral", localizacao:"Localização", clima:"Dados ambientais", solo:"Perfil do terreno", culturas:"Culturas agrícolas", recomendacoes:"Recomendações", historico:"Histórico" };
  $("#pageTitle").textContent = labels[view] || "Pambala";
  $("#sidebar").classList.remove("open");
  if (view === "localizacao") setTimeout(initMap, 80);
  if (view === "culturas") renderCrops();
  if (view === "historico") renderHistory();
  if (view === "recomendacoes") refreshDecisionHeader();
}
$$("[data-view]").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
$$("[data-go]").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.go)));
$("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

function initDates() {
  const end = new Date(); end.setDate(end.getDate() - 5);
  const start = new Date(end); start.setDate(start.getDate() - 29);
  $("#endDate").value = dateInput(end); $("#startDate").value = dateInput(start);
}
function dateInput(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function updateLocationUI() {
  const loc = state.location;
  $("#homeLocation").textContent = loc?.name || "Localização por definir";
  $("#homeCoords").textContent = loc ? `${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}` : "Sem coordenadas";
  $("#homeLocationHint").textContent = loc ? "Localização guardada e pronta para consulta ambiental." : "Escolhe um ponto no mapa ou introduz as coordenadas para começar.";
  $("#climatePlace").textContent = loc?.name || "Nenhuma localização definida";
  $("#climateCoords").textContent = loc ? `${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}` : "Escolhe primeiro um terreno.";
  $("#decisionLocation").textContent = loc?.name || "Localização por definir";
  $("#latitude").value = loc?.lat ?? "";
  $("#longitude").value = loc?.lon ?? "";
  $("#placeName").value = loc?.name || "";
  $("#savedLocation").innerHTML = loc ? `<span class="pin">⌖</span><span><strong>${escapeHtml(loc.name)}</strong><small>${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}</small></span>` : `<span class="pin">⌖</span><span><strong>Nenhum terreno selecionado</strong><small>As coordenadas guardadas aparecerão aqui.</small></span>`;
  $("#readyClimate").textContent = state.climate ? "Consultado" : "Por consultar";
  $("#readySoil").textContent = state.soil ? "Preenchido" : "Por preencher";
  $("#readyDecision").textContent = state.climate && state.soil ? "Pronto para análise" : "A aguardar dados";
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

function initMap() {
  if (map || !window.L) return;
  const initial = state.location || DEFAULT_POINT;
  map = L.map("map").setView([initial.lat, initial.lon], state.location ? 11 : 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  map.on("click", e => {
    $("#latitude").value = e.latlng.lat.toFixed(5);
    $("#longitude").value = e.latlng.lng.toFixed(5);
    $("#mapCoords").textContent = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    setMarker(e.latlng.lat, e.latlng.lng);
  });
  if (state.location) setMarker(initial.lat, initial.lon);
  setTimeout(() => map.invalidateSize(), 150);
}
function setMarker(lat, lon) {
  if (!map) return;
  if (marker) marker.setLatLng([lat, lon]);
  else marker = L.marker([lat, lon]).addTo(map);
  map.setView([lat, lon], Math.max(map.getZoom(), 10));
  $("#mapCoords").textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}
$("#saveLocation").addEventListener("click", () => {
  const lat = Number($("#latitude").value), lon = Number($("#longitude").value);
  if (!$("#latitude").value || !$("#longitude").value || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    showToast("Introduz latitude e longitude válidas."); return;
  }
  state.location = { name: $("#placeName").value.trim() || "Terreno selecionado", lat, lon };
  state.climate = null; climateData = null; saveState(); updateLocationUI();
  if (map) setMarker(lat, lon);
  showToast("Localização guardada. Consulta novamente os dados ambientais.");
});
$("#useLocation").addEventListener("click", () => {
  if (!navigator.geolocation) { showToast("Este navegador não disponibiliza geolocalização."); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    $("#latitude").value = pos.coords.latitude.toFixed(5);
    $("#longitude").value = pos.coords.longitude.toFixed(5);
    if (!$("#placeName").value.trim()) $("#placeName").value = "Localização do dispositivo";
    setMarker(pos.coords.latitude, pos.coords.longitude);
    showToast("Coordenadas obtidas. Confirma e guarda a localização.");
  }, () => showToast("Não foi possível obter a localização. Verifica a permissão do navegador."), { enableHighAccuracy: true, timeout: 12000 });
});

function validateDateRange(start, end) {
  if (!start || !end || start > end) return "Confirma as datas: a data inicial deve ser anterior à data final.";
  const days = (new Date(end) - new Date(start)) / 86400000;
  if (days > 365) return "Para esta versão, consulta no máximo 366 dias de cada vez.";
  const today = dateInput(new Date());
  if (end > today) return "A data final não pode estar no futuro.";
  return null;
}
$("#fetchClimate").addEventListener("click", fetchClimate);
async function fetchClimate() {
  if (!state.location) { showToast("Seleciona e guarda primeiro a localização."); setView("localizacao"); return; }
  const start = $("#startDate").value, end = $("#endDate").value;
  const error = validateDateRange(start, end);
  if (error) { showToast(error); return; }
  const btn = $("#fetchClimate"); btn.disabled = true; btn.textContent = "A consultar...";
  $("#climateNotice").className = "notice notice-info";
  $("#climateNotice").textContent = "A consultar a NASA POWER. Isto pode demorar alguns segundos.";
  try {
    const params = new URLSearchParams({
      parameters: "T2M,PRECTOTCORR,RH2M",
      community: "AG",
      longitude: state.location.lon,
      latitude: state.location.lat,
      start: start.replaceAll("-",""),
      end: end.replaceAll("-",""),
      format: "JSON",
      "time-standard": "UTC"
    });
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?${params}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`A NASA POWER respondeu com HTTP ${response.status}.`);
    const json = await response.json();
    const p = json.properties?.parameter;
    if (!p?.T2M || !p?.PRECTOTCORR) throw new Error("A resposta não contém os parâmetros esperados.");
    const dates = Object.keys(p.T2M).filter(d => !["-999","-999.0"].includes(String(p.T2M[d]))).sort();
    const rows = dates.map(date => ({
      date: `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`,
      temp: validValue(p.T2M[date]),
      rain: validValue(p.PRECTOTCORR?.[date]),
      humidity: validValue(p.RH2M?.[date])
    })).filter(r => r.temp !== null);
    if (!rows.length) throw new Error("Não foram devolvidos valores válidos para este período e ponto.");
    climateData = { rows, start, end, source: "NASA POWER", units: json.parameters || {}, fetchedAt: new Date().toISOString() };
    state.climate = climateData; saveState();
    renderClimate(climateData);
    updateLocationUI();
    $("#climateNotice").className = "notice notice-info";
    $("#climateNotice").innerHTML = `<strong>Consulta concluída.</strong> Dados diários NASA POWER para ${escapeHtml(state.location.name)}. São estimativas/modelos em grelha e podem não representar microcondições da parcela.`;
    showToast("Dados ambientais recebidos da NASA POWER.");
  } catch (err) {
    $("#climateNotice").className = "notice notice-warn";
    $("#climateNotice").innerHTML = `<strong>Não foi possível consultar os dados.</strong> ${escapeHtml(err.message)} Verifica a ligação à Internet e tenta novamente.`;
    showToast("Falha na consulta NASA POWER.");
  } finally { btn.disabled = false; btn.textContent = "Consultar NASA POWER"; }
}
function validValue(v) { if (v === undefined || v === null || !Number.isFinite(Number(v)) || Number(v) <= -900) return null; return Number(v); }
function mean(arr) { const a = arr.filter(Number.isFinite); return a.length ? a.reduce((x,y)=>x+y,0)/a.length : null; }
function fmt(v, digits=1) { return v === null || !Number.isFinite(v) ? "—" : v.toFixed(digits); }
function renderClimate(data) {
  const rows = data.rows;
  const t = mean(rows.map(r=>r.temp)), rain = rows.reduce((s,r)=>s+(r.rain ?? 0),0), h = mean(rows.map(r=>r.humidity));
  $("#metricTemp").innerHTML = `${fmt(t)} <small>°C</small>`;
  $("#metricRain").innerHTML = `${fmt(rain)} <small>mm</small>`;
  $("#metricHumidity").innerHTML = `${fmt(h)} <small>%</small>`;
  $("#metricRainDays").innerHTML = `${rows.filter(r=>(r.rain ?? 0)>=1).length} <small>dias</small>`;
  $("#metricTempDate").textContent = `${rows.length} dias válidos`;
  $("#metricRainDate").textContent = `${data.start} a ${data.end}`;
  $("#metricHumidityDate").textContent = "Média do período";
  $("#metricRainDaysDate").textContent = "Dias com pelo menos 1 mm";
  $("#chartSubtitle").textContent = `${state.location.name} · ${data.start} a ${data.end}`;
  $("#chartEmpty").style.display = "none";
  $("#climateRows").innerHTML = rows.slice().reverse().map(r=>`<tr><td>${r.date}</td><td>${fmt(r.temp)} °C</td><td>${fmt(r.rain)} mm</td><td>${fmt(r.humidity)} %</td></tr>`).join("");
  drawChart(rows);
}
function drawChart(rows) {
  const canvas = $("#climateChart"), ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width*dpr; canvas.height = rect.height*dpr; ctx.scale(dpr,dpr);
  const w=rect.width,h=rect.height,pad={l:38,r:38,t:15,b:28}, innerW=w-pad.l-pad.r, innerH=h-pad.t-pad.b;
  ctx.clearRect(0,0,w,h);
  const temps=rows.map(r=>r.temp).filter(Number.isFinite), rains=rows.map(r=>r.rain??0);
  if(!temps.length)return;
  let minT=Math.floor(Math.min(...temps)-2),maxT=Math.ceil(Math.max(...temps)+2); if(maxT===minT)maxT++;
  const maxR=Math.max(5,...rains);
  ctx.font="9px DM Sans";ctx.fillStyle="#89958c";ctx.strokeStyle="#edf0ec";ctx.lineWidth=1;
  for(let i=0;i<=4;i++){let y=pad.t+innerH*i/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText((maxT-(maxT-minT)*i/4).toFixed(0)+"°",3,y+3);}
  const step=innerW/Math.max(1,rows.length-1);
  rows.forEach((r,i)=>{let bh=(r.rain??0)/maxR*innerH*.55;let x=pad.l+i*step-2;ctx.fillStyle="#d7e8d9";ctx.fillRect(x,pad.t+innerH-bh,Math.max(3,step*.55),bh);});
  ctx.beginPath();rows.forEach((r,i)=>{let x=pad.l+i*step,y=pad.t+(maxT-r.temp)/(maxT-minT)*innerH;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle="#236746";ctx.lineWidth=2.2;ctx.stroke();
  rows.forEach((r,i)=>{let x=pad.l+i*step,y=pad.t+(maxT-r.temp)/(maxT-minT)*innerH;ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fillStyle="#236746";ctx.fill();});
  ctx.fillStyle="#89958c";ctx.fillText(rows[0].date.slice(5),pad.l,h-7);ctx.fillText(rows[rows.length-1].date.slice(5),w-pad.r-35,h-7);
}
window.addEventListener("resize",()=>{if(state.climate?.rows)drawChart(state.climate.rows);});

$("#soilForm").addEventListener("submit", e => {
  e.preventDefault();
  const phRaw=$("#soilPh").value;
  if(phRaw && (Number(phRaw)<0 || Number(phRaw)>14)){showToast("O pH deve estar entre 0 e 14.");return;}
  state.soil={
    moisture:$("#soilMoisture").value, texture:$("#soilTexture").value, drainage:$("#soilDrainage").value,
    fertility:$("#soilFertility").value, ph:phRaw===""?null:Number(phRaw), phMethod:$("#soilPhMethod").value,
    previousCrop:$("#previousCrop").value, priority:$("#priority").value, notes:$("#soilNotes").value.trim()
  };
  saveState();updateLocationUI();$("#soilSaveStatus").textContent="Perfil guardado com sucesso neste navegador.";
  showToast("Perfil do terreno guardado.");
});
function hydrateSoil() {
  const s=state.soil;if(!s)return;
  $("#soilMoisture").value=s.moisture||"";$("#soilTexture").value=s.texture||"";$("#soilDrainage").value=s.drainage||"";
  $("#soilFertility").value=s.fertility||"";$("#soilPh").value=s.ph??"";$("#soilPhMethod").value=s.phMethod||"";
  $("#previousCrop").value=s.previousCrop||"";$("#priority").value=s.priority||"balanced";$("#soilNotes").value=s.notes||"";
}

async function loadCrops() {
  try { const res=await fetch("data/crops.json"); if(!res.ok)throw Error("Não foi possível ler crops.json"); crops=await res.json(); }
  catch { crops=[]; showToast("Não foi possível carregar a base de culturas."); }
}
function renderCrops(filter="") {
  const filtered=crops.filter(c=>`${c.name} ${c.scientific}`.toLowerCase().includes(filter.toLowerCase()));
  $("#cropCount").textContent=`${filtered.length} culturas`;
  $("#cropGrid").innerHTML=filtered.map(c=>`<article class="crop-card"><div class="crop-top"><span class="crop-emoji">${c.emoji}</span><span class="crop-cycle">${c.cycle[0]}–${c.cycle[1]} ${c.id === "cassava" ? "meses" : "dias"}</span></div><h3>${c.name}</h3><span class="crop-latin">${c.scientific}</span><p>${c.note}</p><div class="crop-facts"><span>Temperatura<strong>${c.temp[0]}–${c.temp[1]} °C</strong></span><span>Chuva no ciclo<strong>${c.rain[0]}–${c.rain[1]} mm</strong></span><span>Água<strong>${c.water}</strong></span><span>pH de referência<strong>${c.ph[0]}–${c.ph[1]}</strong></span></div><p><b>Solo:</b> ${c.texture.map(t=>({sandy:"arenoso",loamy:"franco",clayey:"argiloso"}[t])).join(", ")}.</p><p><b>Nutrição:</b> ${c.nutrients}</p><p><b>Rotação:</b> ${c.soilContribution}</p></article>`).join("") || `<div class="empty-state">Nenhuma cultura encontrada.</div>`;
}
$("#cropSearch").addEventListener("input",e=>renderCrops(e.target.value));

function refreshDecisionHeader() {
  $("#decisionLocation").textContent=state.location?.name||"Localização por definir";
  const parts=[];
  parts.push(state.climate?"dados climáticos consultados":"dados climáticos em falta");
  parts.push(state.soil?"perfil do solo preenchido":"perfil do solo em falta");
  $("#decisionSummaryText").textContent=parts.join(" · ")+".";
}
const moistureLabel={dry:"Solo observado seco",normal:"Humidade observada normal",wet:"Solo observado muito húmido"};
function calculateRecommendations() {
  if(!state.location||!state.soil||!state.climate?.rows?.length) {
    $("#decisionWarnings").innerHTML="<strong>Dados insuficientes:</strong> define a localização, consulta NASA POWER e guarda o perfil do solo. Sem estes dados, não apresentamos uma classificação como se fosse fundamentada.";
    $("#decisionWarnings").className="notice notice-warn";showToast("Completa localização, clima e perfil do solo.");return;
  }
  const s=state.soil, rows=state.climate.rows;
  const avgTemp=mean(rows.map(r=>r.temp)), totalRain=rows.reduce((sum,r)=>sum+(r.rain||0),0);
  const days=Math.max(1,(new Date(state.climate.end)-new Date(state.climate.start))/86400000+1);
  const monthlyRain=totalRain/days*30.4;
  const missing=[];
  if(!s.moisture)missing.push("humidade observada");
  if(!s.texture)missing.push("textura");
  if(!s.drainage)missing.push("drenagem");
  if(s.ph===null)missing.push("pH medido");
  const results=crops.map(c=>{
    let score=50, reasons=[], cautions=[];
    // Temperature: only a recent-period screening comparison, not a forecast of the full crop cycle.
    if(avgTemp!==null){const mid=(c.temp[0]+c.temp[1])/2;const delta=Math.abs(avgTemp-mid);const pts=Math.max(0,20-delta*2);score+=pts-10;reasons.push(`Temperatura recente: ${avgTemp.toFixed(1)} °C; referência ${c.temp[0]}–${c.temp[1]} °C`);if(avgTemp<c.temp[0]||avgTemp>c.temp[1])cautions.push("Temperatura recente fora do intervalo de referência");}
    // Monthly rainfall rate is not directly comparable to crop-cycle total; deliberately low weight.
    if(monthlyRain>0){let rainScore=monthlyRain>=c.rain[0]/4 && monthlyRain<=c.rain[1]/2?10:4;score+=rainScore-7;reasons.push(`Chuva recente anualizada: ${monthlyRain.toFixed(0)} mm/mês (não equivale à chuva do ciclo)`);}
    if(s.texture){if(c.texture.includes(s.texture)){score+=12;reasons.push("Textura informada compatível com a referência");}else{score-=8;cautions.push("Textura informada não coincide com as preferências da ficha");}}
    if(s.drainage){if(c.drainage.includes(s.drainage)){score+=8;reasons.push("Drenagem informada compatível");}else{score-=10;cautions.push("Drenagem pode aumentar o risco para esta cultura");}}
    if(s.moisture){if(s.moisture==="wet"&&c.id!=="rice"){score-=7;cautions.push("Humidade muito elevada pode aumentar risco de encharcamento");}else if(s.moisture==="dry"&&["cassava","sorghum"].includes(c.id)){score+=5;reasons.push("Maior tolerância relativa a períodos secos");}else if(s.moisture==="dry"){score-=4;cautions.push("Solo observado seco: avaliar disponibilidade de água");}}
    if(s.ph!==null){if(s.ph>=c.ph[0]&&s.ph<=c.ph[1]){score+=10;reasons.push("pH medido dentro do intervalo de referência");}else{score-=10;cautions.push("pH medido fora do intervalo de referência");}}
    if(s.previousCrop&&s.previousCrop!=="fallow"){if(c.rotation.includes(s.previousCrop)){score+=8;reasons.push("A sequência aparece como opção de rotação na ficha");}else if(s.previousCrop===c.id){score-=10;cautions.push("Repetição da mesma cultura: avaliar rotação, pragas e nutrientes");}}
    if(s.priority==="water"&&["cassava","sorghum"].includes(c.id)){score+=5;reasons.push("Prioridade de menor necessidade relativa de água");}
    if(s.priority==="soil"&&["bean","groundnut"].includes(c.id)){score+=5;reasons.push("Leguminosa: potencial de contribuição de azoto se houver nodulação eficaz");}
    if(s.priority==="short"){if(c.cycle[1]<=100)score+=5;else score-=3;}
    if(s.priority==="food")reasons.push("Avaliar também preferência alimentar, mercado e disponibilidade de semente");
    score=Math.max(0,Math.min(100,Math.round(score)));
    return {...c,score,reasons,cautions,missing};
  }).sort((a,b)=>b.score-a.score);
  const severeMissing=missing.length>=3;
  $("#decisionWarnings").className=severeMissing?"notice notice-warn":"notice notice-info";
  $("#decisionWarnings").innerHTML=`<strong>${severeMissing?"Confiança limitada:":"Limitações da análise:"}</strong> ${missing.length?`Faltam: ${missing.join(", ")}. `:"Os principais campos do solo foram preenchidos. "}O clima consultado cobre apenas ${days} dias; não representa a previsão nem a chuva acumulada de todo o ciclo. SMAP e NDVI ainda não entram nesta pontuação.`;
  $("#recommendationResults").innerHTML=results.map((r,i)=>`<article class="recommendation-card"><div class="recommendation-head"><div class="recommendation-name"><span class="crop-emoji">${r.emoji}</span><div><h3>${i+1}. ${r.name}</h3><small>${r.scientific} · ciclo indicativo ${r.cycle[0]}–${r.cycle[1]} ${r.id === "cassava" ? "meses" : "dias"}</small></div></div><div class="score">${r.score}<small>índice comparativo / 100</small></div></div><div class="score-track"><div class="score-fill" style="width:${r.score}%"></div></div><div class="reason-list">${r.reasons.slice(0,4).map(x=>`<span class="reason-chip">${escapeHtml(x)}</span>`).join("")}${r.cautions.slice(0,3).map(x=>`<span class="reason-chip caution">${escapeHtml(x)}</span>`).join("")}</div><p class="confidence-note">${r.cautions.length?"Atenção: "+r.cautions.join("; ")+". ":""}Pontuação experimental baseada em regras simples e pesos provisórios; não é um modelo agronómico validado.</p></article>`).join("");
  saveHistory(results[0],avgTemp,totalRain,days);
  showToast("Comparação concluída com as limitações identificadas.");
}
$("#runDecision").addEventListener("click",calculateRecommendations);

function saveHistory(best,avgTemp,totalRain,days) {
  let history=[];try{history=JSON.parse(localStorage.getItem(HISTORY_KEY))||[]}catch{}
  history.unshift({date:new Date().toISOString(),location:state.location.name,score:best.score,crop:best.name,avgTemp,totalRain,days});
  localStorage.setItem(HISTORY_KEY,JSON.stringify(history.slice(0,30)));
  renderHistory();
}
function renderHistory() {
  let history=[];try{history=JSON.parse(localStorage.getItem(HISTORY_KEY))||[]}catch{}
  $("#historyList").innerHTML=history.length?history.map(h=>`<div class="history-item"><div><strong>${escapeHtml(h.crop)} · ${escapeHtml(h.location)}</strong><small>${new Date(h.date).toLocaleString("pt-PT")} · ${h.days} dias de dados climáticos</small></div><span class="history-score">${h.score}/100</span></div>`).join(""):`<div class="empty-state"><span>◷</span><strong>Sem análises guardadas</strong><p>As análises calculadas aparecerão aqui.</p></div>`;
}
$("#clearHistory").addEventListener("click",()=>{if(confirm("Queres limpar o histórico guardado neste navegador?")){localStorage.removeItem(HISTORY_KEY);renderHistory();showToast("Histórico limpo.");}});

async function boot() {
  initDates(); await loadCrops(); hydrateSoil(); updateLocationUI(); renderHistory();
  if(state.climate?.rows?.length){climateData=state.climate;renderClimate(climateData);}
  if(!state.location){ // Coordenada de referência para facilitar o primeiro teste; só é gravada após confirmação.
    $("#latitude").value=DEFAULT_POINT.lat;$("#longitude").value=DEFAULT_POINT.lon;$("#placeName").value=DEFAULT_POINT.name;
  }
}
boot();
