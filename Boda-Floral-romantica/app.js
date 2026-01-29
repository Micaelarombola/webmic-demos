/* ========= CONFIGURÁ ESTO ========= */
const CONFIG = {
  // Cambiá por tus datos reales:
  couple: "María & Juan",
  dateISO: "2026-11-15T20:30:00",
  addressText: "Av. Ejemplo 1234, Ciudad",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Av.+Ejemplo+1234,+Ciudad",
  whatsappTo: "54911XXXXXXXX", // <-- tu número con código país, sin +, sin espacios (Ej: 5491122334455)
};

/* ========= MENU MOBILE ========= */
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
  });
}
document.querySelectorAll(".mobileNav a").forEach(a => {
  a.addEventListener("click", () => mobileNav.classList.remove("show"));
});

/* ========= REVEAL ON SCROLL ========= */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ========= COUNTDOWN ========= */
const rootCountdown = document.querySelector(".countdown");
const dd = document.getElementById("dd");
const hh = document.getElementById("hh");
const mm = document.getElementById("mm");
const ss = document.getElementById("ss");

function pad(n){ return String(n).padStart(2,"0"); }

function tickCountdown(){
  const deadline = new Date(rootCountdown?.dataset.deadline || CONFIG.dateISO).getTime();
  const now = Date.now();
  let diff = Math.max(0, deadline - now);

  const d = Math.floor(diff / (1000*60*60*24));
  diff -= d * (1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60));
  diff -= h * (1000*60*60);
  const m = Math.floor(diff / (1000*60));
  diff -= m * (1000*60);
  const s = Math.floor(diff / 1000);

  if (dd) dd.textContent = pad(d);
  if (hh) hh.textContent = pad(h);
  if (mm) mm.textContent = pad(m);
  if (ss) ss.textContent = pad(s);
}
if (rootCountdown) {
  tickCountdown();
  setInterval(tickCountdown, 1000);
}

/* ========= MAPS + COPY ADDRESS ========= */
const mapsBtn = document.getElementById("mapsBtn");
const addrText = document.getElementById("addrText");
const copyAddrBtn = document.getElementById("copyAddrBtn");

if (addrText) addrText.textContent = CONFIG.addressText;
if (mapsBtn) mapsBtn.href = CONFIG.mapsLink;

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(e){
    // fallback
    const t = document.createElement("textarea");
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    document.body.removeChild(t);
    return true;
  }
}

if (copyAddrBtn) {
  copyAddrBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await copyText(CONFIG.addressText);
    copyAddrBtn.textContent = "¡Copiado!";
    setTimeout(()=> copyAddrBtn.textContent = "Copiar dirección", 1400);
  });
}

/* ========= ADD TO CALENDAR (ICS simple) ========= */
const addCalendarBtn = document.getElementById("addCalendarBtn");

function downloadICS(){
  const start = new Date(CONFIG.dateISO);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4h
  const toICS = (d) => {
    const z = (n) => String(n).padStart(2,"0");
    return `${d.getUTCFullYear()}${z(d.getUTCMonth()+1)}${z(d.getUTCDate())}T${z(d.getUTCHours())}${z(d.getUTCMinutes())}${z(d.getUTCSeconds())}Z`;
  };

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WebMic//Boda Floral Romántica//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${toICS(start)}
DTEND:${toICS(end)}
SUMMARY:${CONFIG.couple} - Boda
LOCATION:${CONFIG.addressText}
DESCRIPTION:¡Te esperamos! Confirmá asistencia por WhatsApp.
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "boda.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

if (addCalendarBtn) {
  addCalendarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    downloadICS();
  });
}

/* ========= LIGHTBOX ========= */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");

document.querySelectorAll(".photo").forEach(btn => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-full");
    if (!src) return;
    lbImg.src = src;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden","false");
  });
});

function closeLB(){
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden","true");
  lbImg.src = "";
}
if (lbClose) lbClose.addEventListener("click", closeLB);
if (lightbox) lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLB();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLB();
});

/* ========= RSVP WHATSAPP ========= */
const rsvpForm = document.getElementById("rsvpForm");
const copyRsvpBtn = document.getElementById("copyRsvpBtn");

function buildRsvpMessage(){
  const name = document.getElementById("guestName")?.value?.trim() || "";
  const ans = document.getElementById("guestAnswer")?.value || "";
  const msg = document.getElementById("guestMsg")?.value?.trim() || "";

  const lines = [
    `Hola! Soy ${name}.`,
    `RSVP: ${ans}.`,
    `Boda: ${CONFIG.couple}`,
    `Fecha: ${new Date(CONFIG.dateISO).toLocaleString("es-AR", { dateStyle:"full", timeStyle:"short" })}`,
    msg ? `Mensaje: ${msg}` : ""
  ].filter(Boolean);

  return lines.join("\n");
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = buildRsvpMessage();
    const url = `https://wa.me/${CONFIG.whatsappTo}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
}

if (copyRsvpBtn) {
  copyRsvpBtn.addEventListener("click", async () => {
    const text = buildRsvpMessage();
    await copyText(text);
    copyRsvpBtn.textContent = "¡Copiado!";
    setTimeout(()=> copyRsvpBtn.textContent = "Copiar texto", 1400);
  });
}

/* ========= PETALS (VISIBLES) ========= */
const canvas = document.getElementById("petalsCanvas");
const ctx = canvas.getContext("2d", { alpha:true });

let W=0, H=0, DPR=1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = Math.floor(window.innerWidth);
  H = Math.floor(window.innerHeight);
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener("resize", resize);
resize();

// Pétalos grandes + visibles (noche)
const PETAL_COUNT = Math.max(32, Math.floor((W*H)/28000)); // visibles según tamaño pantalla
const petals = [];
const colors = [
  "rgba(232,194,194,0.70)", // rose
  "rgba(255,255,255,0.35)",
  "rgba(201,178,124,0.35)"
];

function rand(min,max){ return Math.random()*(max-min)+min; }

function makePetal(){
  const size = rand(10, 24);           // más grandes
  const speed = rand(0.6, 1.4);        // caída suave
  const sway = rand(0.6, 1.6);         // lateral
  return {
    x: rand(-60, W+60),
    y: rand(-H, H),
    r: size,
    vx: rand(-0.2, 0.2),
    vy: speed,
    rot: rand(0, Math.PI*2),
    vr: rand(-0.01, 0.01),
    sway,
    seed: rand(0, 9999),
    c: colors[Math.floor(rand(0, colors.length))]
  };
}

for(let i=0;i<PETAL_COUNT;i++) petals.push(makePetal());

function drawPetal(p){
  // forma de pétalo simple (path)
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  // glow
  ctx.shadowColor = "rgba(232,194,194,0.22)";
  ctx.shadowBlur = 12;

  ctx.fillStyle = p.c;
  ctx.beginPath();
  ctx.moveTo(0, -p.r);
  ctx.bezierCurveTo(p.r*0.9, -p.r*0.2, p.r*0.8, p.r*0.9, 0, p.r);
  ctx.bezierCurveTo(-p.r*0.8, p.r*0.9, -p.r*0.9, -p.r*0.2, 0, -p.r);
  ctx.closePath();
  ctx.fill();

  // vein highlight
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -p.r*0.8);
  ctx.quadraticCurveTo(p.r*0.15, 0, 0, p.r*0.8);
  ctx.stroke();

  ctx.restore();
}

let t=0;
function animate(){
  t += 0.016;

  ctx.clearRect(0,0,W,H);

  // solo si el usuario no pidió reducir movimiento
  petals.forEach(p=>{
    const drift = Math.sin((t + p.seed) * p.sway) * 0.7;

    p.x += p.vx + drift;
    p.y += p.vy;
    p.rot += p.vr;

    // wrap
    if (p.y > H + 60) {
      p.y = -60;
      p.x = rand(-60, W+60);
    }
    if (p.x < -120) p.x = W + 120;
    if (p.x > W + 120) p.x = -120;

    drawPetal(p);
  });

  requestAnimationFrame(animate);
}

const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduce) animate();
else canvas.style.display = "none";
