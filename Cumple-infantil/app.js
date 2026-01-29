/* ========= CONFIG ========= */
// Fecha del cumple (inventada) - Hora Argentina (Buenos Aires)
const EVENT_DATE = new Date("2026-03-14T15:30:00-03:00");

// WhatsApp (cambiá por el que corresponda)
const WHATSAPP_NUMBER = "5491112345678"; // ejemplo: 54911XXXXXXXX

// Google Maps (inventado - podés cambiar la dirección o pegar link directo)
const MAPS_QUERY = "Av.+Siempre+Viva+123,+Villa+Devoto,+Buenos+Aires";

/* ========= MAP BUTTON ========= */
const mapsBtn = document.getElementById("mapsBtn");
mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/* ========= REVEAL ON SCROLL ========= */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-in");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ========= COUNTDOWN ========= */
const dd = document.getElementById("dd");
const hh = document.getElementById("hh");
const mm = document.getElementById("mm");
const ss = document.getElementById("ss");

function pad(n){ return String(n).padStart(2, "0"); }

function tick(){
  const now = new Date();
  let diff = EVENT_DATE - now;

  if (diff <= 0){
    dd.textContent = "00";
    hh.textContent = "00";
    mm.textContent = "00";
    ss.textContent = "00";
    return;
  }

  const d = Math.floor(diff / (1000*60*60*24));
  diff -= d * (1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60));
  diff -= h * (1000*60*60);
  const m = Math.floor(diff / (1000*60));
  diff -= m * (1000*60);
  const s = Math.floor(diff / 1000);

  dd.textContent = pad(d);
  hh.textContent = pad(h);
  mm.textContent = pad(m);
  ss.textContent = pad(s);

  // mini "pop" en segundos
  ss.parentElement.classList.remove("pop");
  void ss.parentElement.offsetWidth;
  ss.parentElement.classList.add("pop");
}
setInterval(tick, 1000);
tick();

/* ========= RSVP -> WhatsApp ========= */
const form = document.getElementById("rsvpForm");
const guestName = document.getElementById("guestName");
const attendance = document.getElementById("attendance");
const count = document.getElementById("count");
const note = document.getElementById("note");

function buildMessage(){
  const name = (guestName.value || "—").trim();
  const att = attendance.value;
  const qty = count.value;
  const extra = (note.value || "").trim();

  const msg =
`Hola! Soy ${name}.
Confirmo: ${att}
Cantidad: ${qty}

Cumple de Isabella (4 años) 🐾🎉
Sábado 14/03 • 15:30 a 18:30
Salón “Patitas” - Av. Siempre Viva 123 (Devoto)

${extra ? "Nota: " + extra : ""}`.trim();

  return msg;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  burstConfetti(120);
});

/* ========= Copy message ========= */
const copyBtn = document.getElementById("copyBtn");
copyBtn.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(buildMessage());
    burstConfetti(60);
    copyBtn.textContent = "✅ Copiado";
    setTimeout(() => copyBtn.textContent = "📋 Copiar mensaje", 1400);
  }catch{
    alert("No se pudo copiar. Probá manualmente seleccionando el texto.");
  }
});

/* ========= CONFETTI ========= */
const confettiBtn = document.getElementById("confettiBtn");
confettiBtn.addEventListener("click", () => burstConfetti(140));

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resize);
resize();

let particles = [];
function burstConfetti(n = 100){
  const w = window.innerWidth;
  const h = window.innerHeight;

  for(let i=0;i<n;i++){
    particles.push({
      x: w*0.5 + (Math.random()-0.5)*120,
      y: h*0.25 + (Math.random()-0.5)*80,
      vx: (Math.random()-0.5)*7,
      vy: Math.random()*-6 - 3,
      g: 0.16 + Math.random()*0.10,
      r: 3 + Math.random()*5,
      rot: Math.random()*Math.PI,
      vr: (Math.random()-0.5)*0.25,
      life: 140 + Math.random()*60,
      // color: no seteamos colores fijos para que el navegador elija el default? (no aplica)
      // usamos HSL random para que sea bien infantil
      hue: Math.floor(Math.random()*360),
    });
  }
}

function draw(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.life -= 1;
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 0.95)`;
    ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.2);
    ctx.restore();
  });

  requestAnimationFrame(draw);
}
draw();

/* Start with a small burst */
setTimeout(() => burstConfetti(70), 450);
