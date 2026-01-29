const invitation = document.getElementById("invitation");
const openBtn = document.getElementById("openInvite");

/* Abrir invitación */
openBtn.addEventListener("click", () => {
  // pequeño “flash” dorado al abrir
  document.body.classList.add("opened");
  invitation.classList.add("active");
  document.getElementById("invitation").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* Partículas: polvo dorado */
const dustLayer = document.querySelector(".gold-dust");
const DUST = 90;

for (let i = 0; i < DUST; i++) {
  const dot = document.createElement("div");
  dot.className = "gold-dot";
  dot.style.left = Math.random() * 100 + "%";
  dot.style.width = (3 + Math.random() * 6) + "px";
  dot.style.height = dot.style.width;
  dot.style.animationDuration = (14 + Math.random() * 22) + "s";
  dot.style.animationDelay = (Math.random() * 18) + "s";
  dustLayer.appendChild(dot);
}

/* Destellos */
const sparkLayer = document.querySelector(".sparkles");
const SPARKS = 55;

for (let i = 0; i < SPARKS; i++) {
  const s = document.createElement("div");
  s.className = "spark";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.animationDuration = (2.2 + Math.random() * 3.8) + "s";
  s.style.animationDelay = (Math.random() * 5) + "s";
  sparkLayer.appendChild(s);
}

/* Símbolos flotantes */
const symbolsLayer = document.querySelector(".symbols-layer");
const icons = ["🕊️", "✝️", "✨", "☩", "✧"];
const SYMBOLS = 75;

for (let i = 0; i < SYMBOLS; i++) {
  const el = document.createElement("div");
  el.className = "symbol";
  el.innerText = icons[Math.floor(Math.random() * icons.length)];
  el.style.left = Math.random() * 100 + "%";
  el.style.fontSize = (16 + Math.random() * 26) + "px";
  el.style.opacity = (0.08 + Math.random() * 0.18).toFixed(2);
  el.style.animationDuration = (18 + Math.random() * 30) + "s";
  el.style.animationDelay = (Math.random() * 16) + "s";
  symbolsLayer.appendChild(el);
}

/* Countdown */
const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");

/* Fecha inventada */
const target = new Date("2026-05-10T10:30:00").getTime();

setInterval(() => {
  const diff = target - Date.now();
  if (diff <= 0) return;

  dEl.textContent = Math.floor(diff / 86400000);
  hEl.textContent = Math.floor(diff / 3600000) % 24;
  mEl.textContent = Math.floor(diff / 60000) % 60;
  sEl.textContent = Math.floor(diff / 1000) % 60;
}, 1000);

/* Copiar alias */
const copyBtn = document.getElementById("copyAlias");
const aliasText = document.getElementById("aliasText");

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(aliasText.textContent.trim());
    copyBtn.textContent = "Copiado ✓";
    setTimeout(() => (copyBtn.textContent = "Copiar"), 1200);
  } catch (e) {
    alert("No pude copiar automáticamente. Copialo manual: " + aliasText.textContent);
  }
});
/* ===== RSVP -> WHATSAPP ===== */
const rsvpForm = document.getElementById("rsvpForm");
const prefillNo = document.getElementById("prefillNo");

// Cambiá este número al de la persona que recibe confirmaciones:
const RSVP_PHONE = "5491112345678"; // formato: 54911xxxxxxxx

function buildMessage(data){
  const name = (data.get("name") || "").trim();
  const phone = (data.get("phone") || "").trim();
  const attending = data.get("attending");
  const adults = data.get("adults");
  const kids = data.get("kids");
  const notes = (data.get("notes") || "").trim();

  return [
    "✨ Confirmación Primera Comunión ✨",
    `Nombre: ${name}`,
    phone ? `Teléfono: ${phone}` : null,
    `Asistencia: ${attending}`,
    `Adultos: ${adults}`,
    `Niños: ${kids}`,
    notes ? `Observaciones: ${notes}` : null,
    "",
    "Gracias 🤍"
  ].filter(Boolean).join("\n");
}

function openWhatsApp(message){
  const url = `https://wa.me/${RSVP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

if (rsvpForm){
  rsvpForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = new FormData(rsvpForm);
    const msg = buildMessage(data);
    openWhatsApp(msg);
  });
}

if (prefillNo && rsvpForm){
  prefillNo.addEventListener("click", ()=>{
    rsvpForm.querySelector('select[name="attending"]').value = "No puedo asistir";
    rsvpForm.scrollIntoView({behavior:"smooth", block:"center"});
  });
}
