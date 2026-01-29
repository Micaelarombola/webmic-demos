// ===========================
// CONFIGURACIÓN RÁPIDA
// ===========================
// Cambiá fecha real (zona AR -03:00)
const EVENT_ISO = "2026-11-14T20:30:00-03:00"; // <-- CAMBIAR

const CONFIG = {
  names: "Camila & Tomás",
  footerNames: "Camila & Tomás",
  eventDateText: "Sábado 14 de Noviembre • 20:30 hs",

  venueName: "Palacio Aurora",
  cityName: "Buenos Aires",
  dressCode: "Black Tie",

  quoteText: "“Te elegiría en mil vidas más.”",
  quoteAuthor: "Anónimo",

  ceremonyText: "20:30 hs • Capilla Santa Clara",
  partyText: "22:00 hs • Palacio Aurora",
  addressText: "Av. Siempre Viva 1234, CABA",

  mapsUrl: "https://www.google.com/maps?q=Av.+Siempre+Viva+1234,+CABA",

  whatsappNumber: "5491123456789",
  whatsappMsg:
`Hola! Confirmo mi asistencia a la boda 🖤✨

Nombre y apellido:
Cantidad de personas:
Restricción alimentaria (si aplica):`
};

// ===========================
// Helpers
// ===========================
const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2, "0");

function setText(sel, val){
  const el = $(sel);
  if (el) el.textContent = val;
}

// ===========================
// Inyectar contenido
// ===========================
setText("#names", CONFIG.names);
setText("#footerNames", CONFIG.footerNames);
setText("#eventDateText", CONFIG.eventDateText);

setText("#venueName", CONFIG.venueName);
setText("#cityName", CONFIG.cityName);
setText("#dressCode", CONFIG.dressCode);

setText("#quoteText", CONFIG.quoteText);
setText("#quoteAuthor", CONFIG.quoteAuthor);

setText("#ceremonyText", CONFIG.ceremonyText);
setText("#partyText", CONFIG.partyText);
setText("#addressText", CONFIG.addressText);

const mapsLink = $("#mapsLink");
if (mapsLink) mapsLink.href = CONFIG.mapsUrl;

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
    if (note) note.textContent = "¡Hoy es el gran día! ✨";
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
// Música (con interacción)
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
    // si el navegador bloquea
    alert("Tu navegador bloqueó la reproducción. Tocá el botón de música otra vez.");
  }
}
musicBtn?.addEventListener("click", toggleMusic);

// Auto-intento al primer toque
let firstTap = true;
window.addEventListener("pointerdown", () => {
  if (!firstTap) return;
  firstTap = false;
  if (!playing) toggleMusic();
}, { passive:true });

// ===========================
// FX CANVAS: partículas + destellos
// ===========================
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d", { alpha:true });

let W=0,H=0, DPR=1;

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
window.addEventListener("resize", resize);
resize();

const rnd = (a,b)=>a+Math.random()*(b-a);

const sparks = Array.from({length: 90}, () => ({
  x: rnd(0,W),
  y: rnd(0,H),
  r: rnd(0.7, 2.2),
  a: rnd(0.06, 0.28),
  s: rnd(0.15, 0.55),
  dx: rnd(-0.12, 0.12),
  dy: rnd(-0.28, -0.05),
  tw: rnd(0.008, 0.02),
  ph: rnd(0, Math.PI*2)
}));

function draw(){
  ctx.clearRect(0,0,W,H);

  // glow layer
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const p of sparks){
    p.x += p.dx;
    p.y += p.dy;
    p.ph += p.tw;

    if (p.y < -30){ p.y = H + 30; p.x = rnd(0,W); }
    if (p.x < -30) p.x = W + 30;
    if (p.x > W + 30) p.x = -30;

    const alpha = p.a + (Math.sin(p.ph)*0.06);
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
    grd.addColorStop(0, `rgba(201,178,125,${Math.max(0,alpha)})`);
    grd.addColorStop(1, "rgba(201,178,125,0)");

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 14, 0, Math.PI*2);
    ctx.fill();

    // tiny core
    ctx.fillStyle = `rgba(245,245,245,${Math.max(0,alpha*0.55)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  requestAnimationFrame(draw);
}
draw();
