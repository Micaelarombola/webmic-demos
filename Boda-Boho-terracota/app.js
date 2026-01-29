// ===========================
// CONFIG RÁPIDA
// ===========================
// Cambiá la fecha real (zona AR -03:00)
const EVENT_ISO = "2026-05-10T18:30:00-03:00"; // <-- CAMBIAR

const CONFIG = {
  names: "Luna & Mateo",
  footerNames: "Luna & Mateo",
  eventDateText: "Sábado 10 de Mayo • 18:30 hs",

  dressCode: "Boho / Terracota",
  venueName: "Quinta Los Aromos",
  cityName: "Buenos Aires",

  leadText: "Queremos compartir este día con ustedes, entre risas, abrazos y atardecer.",

  ceremonyText: "18:30 hs • Jardín principal",
  cocktailText: "19:30 hs • Fogón + brindis",
  partyText: "21:00 hs • Salón",

  addressText: "Ruta 8 km 52, Pilar",
  mapsUrl: "https://www.google.com/maps?q=Ruta+8+km+52,+Pilar",

  giftText: "Tu presencia es nuestro mejor regalo. Si deseás, habrá mesa de sobres.",
  tipsText: "Traé abrigo liviano para la noche. Calzado cómodo recomendado.",

  whatsappNumber: "5491123456789",
  whatsappMsg:
`Hola! Confirmo mi asistencia a la boda 🤎✨

Nombre y apellido:
Cantidad de personas:
Restricción alimentaria (si aplica):`
};

// ===========================
// Helpers
// ===========================
const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2, "0");
function setText(sel, val){ const el = $(sel); if (el) el.textContent = val; }

// ===========================
// Inject content
// ===========================
setText("#names", CONFIG.names);
setText("#footerNames", CONFIG.footerNames);
setText("#eventDateText", CONFIG.eventDateText);

setText("#dressCode", CONFIG.dressCode);
setText("#venueName", CONFIG.venueName);
setText("#cityName", CONFIG.cityName);

setText("#leadText", CONFIG.leadText);

setText("#ceremonyText", CONFIG.ceremonyText);
setText("#cocktailText", CONFIG.cocktailText);
setText("#partyText", CONFIG.partyText);

setText("#addressText", CONFIG.addressText);
const mapsLink = $("#mapsLink");
if (mapsLink) mapsLink.href = CONFIG.mapsUrl;

setText("#giftText", CONFIG.giftText);
setText("#tipsText", CONFIG.tipsText);

// ===========================
// Countdown
// ===========================
const target = new Date(EVENT_ISO).getTime();
function tick(){
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const d = Math.floor(diff / (1000*60*60*24));
  diff -= d * (1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60));
  diff -= h * (1000*60*60);
  const m = Math.floor(diff / (1000*60));
  diff -= m * (1000*60);
  const s = Math.floor(diff / 1000);

  setText("#dd", pad(d));
  setText("#hh", pad(h));
  setText("#mm", pad(m));
  setText("#ss", pad(s));

  if (target - now <= 0){
    const note = $("#countdownNote");
    if (note) note.textContent = "¡Hoy es el gran día! 🤎";
  }
}
tick();
setInterval(tick, 1000);

// ===========================
// Reveal on scroll
// ===========================
const io = new IntersectionObserver((entries) => {
  for (const e of entries){
    if (e.isIntersecting) e.target.classList.add("is-in");
  }
},{ threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ===========================
// Music (requiere interacción)
// ===========================
const audio = $("#bgMusic");
const musicBtn = $("#musicBtn");
const musicTxt = $("#musicTxt");
const musicIco = $("#musicIco");
let playing = false;

async function toggleMusic(){
  if (!audio) return;
  try{
    if (!playing){
      await audio.play();
      playing = true;
      musicBtn?.classList.add("is-playing");
      if (musicTxt) musicTxt.textContent = "Pausar";
      if (musicIco) musicIco.textContent = "❚❚";
    } else {
      audio.pause();
      playing = false;
      musicBtn?.classList.remove("is-playing");
      if (musicTxt) musicTxt.textContent = "Música";
      if (musicIco) musicIco.textContent = "▶";
    }
  }catch{
    alert("El navegador bloqueó la reproducción. Tocá el botón de música nuevamente.");
  }
}
musicBtn?.addEventListener("click", toggleMusic);

// auto intento en primer toque
let firstTap = true;
window.addEventListener("pointerdown", () => {
  if (!firstTap) return;
  firstTap = false;
  if (!playing) toggleMusic();
}, { passive:true });

// ===========================
// WhatsApp + copiar
// ===========================
function waUrl(){
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMsg)}`;
}
const waBtn = $("#waBtn");
if (waBtn) waBtn.href = waUrl();

const copyBtn = $("#copyBtn");
if (copyBtn){
  copyBtn.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(CONFIG.whatsappMsg);
      copyBtn.textContent = "¡Copiado!";
      setTimeout(() => copyBtn.textContent = "Copiar mensaje", 1400);
    }catch{
      alert("No se pudo copiar. Copialo manual:\n\n" + CONFIG.whatsappMsg);
    }
  });
}

// ===========================
// Petals generator
// ===========================
const petalsWrap = document.getElementById("petals");
function spawnPetals(count = 18){
  if (!petalsWrap) return;
  petalsWrap.innerHTML = "";
  for (let i=0;i<count;i++){
    const p = document.createElement("div");
    p.className = "petal";
    const x = Math.random() * 100;
    const dx = (Math.random()*60 - 30).toFixed(2);
    const dur = (10 + Math.random()*10).toFixed(2);
    const delay = (-Math.random()*dur).toFixed(2);
    const scale = (0.7 + Math.random()*1.1).toFixed(2);

    p.style.setProperty("--x", x + "vw");
    p.style.setProperty("--dx", dx + "vw");
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = delay + "s";
    p.style.transform = `translate3d(${x}vw,-10vh,0) scale(${scale})`;

    petalsWrap.appendChild(p);
  }
}
spawnPetals(20);
window.addEventListener("resize", () => spawnPetals(20));

// ===========================
// Dust canvas (partículas suaves boho)
// ===========================
const canvas = document.getElementById("dust");
const ctx = canvas.getContext("2d", { alpha:true });

let W=0,H=0,DPR=1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W*DPR);
  canvas.height = Math.floor(H*DPR);
  canvas.style.width = W+"px";
  canvas.style.height = H+"px";
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
resize();
window.addEventListener("resize", resize);

const rnd = (a,b)=>a+Math.random()*(b-a);
const dust = Array.from({length: 90}, () => ({
  x: rnd(0,W), y: rnd(0,H),
  r: rnd(1, 2.6),
  a: rnd(0.05, 0.18),
  dx: rnd(-0.10, 0.10),
  dy: rnd(-0.25, -0.06),
  ph: rnd(0, Math.PI*2),
  tw: rnd(0.008, 0.02)
}));

function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const p of dust){
    p.x += p.dx;
    p.y += p.dy;
    p.ph += p.tw;

    if (p.y < -30){ p.y = H + 30; p.x = rnd(0,W); }
    if (p.x < -30) p.x = W + 30;
    if (p.x > W + 30) p.x = -30;

    const alpha = p.a + Math.sin(p.ph)*0.04;
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,18);
    g.addColorStop(0, `rgba(195,107,74,${Math.max(0,alpha)})`);
    g.addColorStop(1, "rgba(195,107,74,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x,p.y,18,0,Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
  requestAnimationFrame(draw);
}
draw();

// ===========================
// Mensajes para los novios (localStorage)
// ===========================
const KEY = "bohoTerracota_messages_v1";
const msgForm = document.getElementById("msgForm");
const msgName = document.getElementById("msgName");
const msgEmoji = document.getElementById("msgEmoji");
const msgText = document.getElementById("msgText");
const msgList = document.getElementById("messages");
const clearBtn = document.getElementById("clearMsgs");

function loadMsgs(){
  try{
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  }catch{ return []; }
}
function saveMsgs(arr){
  localStorage.setItem(KEY, JSON.stringify(arr));
}
function renderMsgs(){
  if (!msgList) return;
  const items = loadMsgs().slice().reverse();
  if (!items.length){
    msgList.innerHTML = `<div class="sub" style="grid-column:1/-1">Todavía no hay mensajes guardados ✨</div>`;
    return;
  }
  msgList.innerHTML = items.map(m => {
    const d = new Date(m.ts);
    const date = d.toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit" });
    return `
      <div class="mcard">
        <div class="mcard__top">
          <div class="mcard__name">${escapeHtml(m.name)} <span class="mcard__emoji">${escapeHtml(m.emoji || "🤎")}</span></div>
          <div class="mcard__date">${date}</div>
        </div>
        <p class="mcard__text">${escapeHtml(m.text)}</p>
      </div>
    `;
  }).join("");
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
}
renderMsgs();

msgForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = msgName.value.trim();
  const text = msgText.value.trim();
  const emoji = msgEmoji.value.trim();
  if (!name || !text) return;

  const arr = loadMsgs();
  arr.push({ name, text, emoji, ts: Date.now() });
  saveMsgs(arr);

  msgName.value = "";
  msgEmoji.value = "";
  msgText.value = "";

  // mini confetti vibe: add few petals quickly
  spawnPetals(26);
  setTimeout(() => spawnPetals(20), 900);

  renderMsgs();
});

clearBtn?.addEventListener("click", () => {
  if (!confirm("¿Borrar todos los mensajes guardados en este dispositivo?")) return;
  localStorage.removeItem(KEY);
  renderMsgs();
});
