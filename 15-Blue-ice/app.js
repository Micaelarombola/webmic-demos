/* ===== CONFIG BLUE ICE (ORIGINAL) ===== */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

const INVITADA = "Evelin";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

const FRASE = "Una noche para brillar en azul ❄️✨";
const DRESS_TOP = "Elegante • Azul/Plata";
const DRESSCODE = "Elegante";
const ALIAS = "evelin.15.mp";

const NOTA = "Tip: sumá detalles azul hielo o plateado ✨";
const FOOTER_FRASE = "Gracias por ser parte de mi noche Blue Ice ❄️💙";

/* GALERÍA (minúsculas recomendado) */
const GALLERY = [
  { src: "./assets/foto1.jpg" },
  { src: "./assets/foto2.jpg" },
  { src: "./assets/foto3.jpg" },
  { src: "./assets/foto4.jpg" },
  { src: "./assets/foto5.jpg" },
  { src: "./assets/foto6.jpg" },
];

/* MAPS */
const ADDRESS_Q = encodeURIComponent(DIRECCION_TEXTO);
const MAPS_OPEN = `https://www.google.com/maps?q=${ADDRESS_Q}&z=16`;
const MAPS_EMBED = `https://www.google.com/maps?q=${ADDRESS_Q}&output=embed&z=16`;

/* HELPERS */
const $ = (s) => document.querySelector(s);
const pad2 = (n) => String(n).padStart(2, "0");

/* FILL TEXT */
function fill() {
  $("#nombre") && ($("#nombre").textContent = INVITADA);
  $("#fraseTxt") && ($("#fraseTxt").textContent = FRASE);

  $("#fechaTop") && ($("#fechaTop").textContent = FECHA_TEXTO);
  $("#fechaTxt") && ($("#fechaTxt").textContent = FECHA_TEXTO);

  $("#horaTop") && ($("#horaTop").textContent = HORA_TEXTO);
  $("#horaTxt") && ($("#horaTxt").textContent = HORA_TEXTO);

  $("#lugarTop") && ($("#lugarTop").textContent = LUGAR_TEXTO);
  $("#lugarTxt") && ($("#lugarTxt").textContent = LUGAR_TEXTO);

  $("#dirTop") && ($("#dirTop").textContent = DIRECCION_TEXTO);
  $("#dirTxt") && ($("#dirTxt").textContent = DIRECCION_TEXTO);

  $("#dressTop") && ($("#dressTop").textContent = DRESS_TOP);
  $("#dressTxt") && ($("#dressTxt").textContent = DRESSCODE);

  $("#aliasTxt") && ($("#aliasTxt").textContent = ALIAS);
  $("#notaTxt") && ($("#notaTxt").textContent = NOTA);
  $("#footerTxt") && ($("#footerTxt").textContent = FOOTER_FRASE);

  $("#modalAddr") && ($("#modalAddr").textContent = DIRECCION_TEXTO);
}

/* MUSIC */
function musicSetup() {
  const audio = $("#bgMusic");
  const btn = $("#musicBtn");
  const icon = $("#musicIcon");
  if (!audio || !btn || !icon) return;

  let playing = false;

  const play = async () => {
    try {
      await audio.play();
      playing = true;
      icon.textContent = "❚❚";
    } catch {
      icon.textContent = "▶";
    }
  };

  const pause = () => {
    audio.pause();
    playing = false;
    icon.textContent = "▶";
  };

  btn.addEventListener("click", () => (playing ? pause() : play()));
  window.addEventListener("pointerdown", play, { once: true });
}

/* MAP BUTTONS */
function mapsSetup() {
  $("#btnComoLlegar")?.addEventListener("click", () => window.open(MAPS_OPEN, "_blank", "noreferrer"));
  $("#openMaps2")?.addEventListener("click", () => window.open(MAPS_OPEN, "_blank", "noreferrer"));
}

/* MAP MODAL */
function mapModalSetup() {
  const modal = $("#mapModal");
  const frame = $("#mapFrame");
  const open = $("#openMap");
  const close = $("#closeMap");
  if (!modal || !frame || !open) return;

  const show = () => {
    modal.classList.add("is-on");
    modal.setAttribute("aria-hidden", "false");
    frame.src = MAPS_EMBED;
    document.body.style.overflow = "hidden";
  };

  const hide = () => {
    modal.classList.remove("is-on");
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
    document.body.style.overflow = "";
  };

  open.addEventListener("click", show);
  close?.addEventListener("click", hide);
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) hide();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-on")) hide();
  });
}

/* ALIAS: show + copy */
function aliasSetup() {
  const btn = $("#btnAlias");
  const box = $("#aliasBox");
  if (!btn || !box) return;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ALIAS);
      btn.textContent = "¡COPIADO! ✅";
      setTimeout(() => (btn.textContent = "VER / COPIAR ALIAS"), 1400);
    } catch {
      prompt("Copiá el alias:", ALIAS);
    }
  };

  btn.addEventListener("click", async () => {
    box.hidden = !box.hidden;
    await copy();
  });
}

/* PLAYLIST */
function songSetup() {
  const btn = $("#btnSong");
  const input = $("#songInput");
  if (!btn || !input) return;

  btn.addEventListener("click", () => {
    const song = input.value.trim();
    const msg =
`Tema para la fiesta 🎶❄️

Hola! Me gustaría que suene:
${song || "(no escribió tema)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* RSVP stepper */
function stepperSetup() {
  const steps = document.querySelectorAll(".step");
  const panels = document.querySelectorAll(".stepPanel");
  const next = $("#nextStep");
  const prev = $("#prevStep");

  const go = (n) => {
    steps.forEach((s) => s.classList.toggle("is-on", s.dataset.step === String(n)));
    panels.forEach((p) => p.classList.toggle("is-on", p.dataset.panel === String(n)));
  };

  steps.forEach((s) => s.addEventListener("click", () => go(Number(s.dataset.step))));
  next?.addEventListener("click", () => go(2));
  prev?.addEventListener("click", () => go(1));
}

/* RSVP -> WhatsApp */
function rsvpSetup() {
  const form = $("#rsvpForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = $("#fNombre").value.trim();
    const comida = $("#fComida").value;
    const mensaje = ($("#fMensaje").value || "").trim();

    const msg =
`Confirmación XV ❄️💙

Nombre y apellido: ${nombre}
Tipo de comida: ${comida}
Mensaje: ${mensaje || "(sin mensaje)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* GALLERY masonry + lightbox */
function gallerySetup() {
  const wrap = $("#gallery");
  if (!wrap) return;

  wrap.innerHTML = GALLERY.map((img) => `
    <div class="tile" data-src="${img.src}">
      <img src="${img.src}" alt="">
    </div>
  `).join("");

  const lb = $("#lightbox");
  const lbImg = $("#lightImg");
  if (!lb || !lbImg) return;

  const open = (src) => {
    lb.classList.add("is-on");
    lb.setAttribute("aria-hidden", "false");
    lbImg.src = src;
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lb.classList.remove("is-on");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  };

  wrap.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    open(tile.dataset.src);
  });

  lb.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("is-on")) close();
  });
}

/* Circular countdown rings */
function setRing(el, pct) {
  // circle circumference = 2*pi*r = 2*pi*48 ≈ 301.59 -> we use 302
  const circ = 302;
  const clamped = Math.max(0, Math.min(1, pct));
  const offset = circ * (1 - clamped);
  el.style.strokeDashoffset = String(offset);
}

function countdown() {
  const target = new Date(EVENT_DATE_ISO).getTime();

  const dEl = $("#d"), hEl = $("#h"), mEl = $("#m"), sEl = $("#s");
  const rings = {
    days: document.querySelector('[data-ring="days"] .fg'),
    hours: document.querySelector('[data-ring="hours"] .fg'),
    mins: document.querySelector('[data-ring="mins"] .fg'),
    secs: document.querySelector('[data-ring="secs"] .fg'),
  };

  const tick = () => {
    let diff = Math.max(0, target - Date.now());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);

    dEl && (dEl.textContent = days);
    hEl && (hEl.textContent = pad2(hours));
    mEl && (mEl.textContent = pad2(mins));
    sEl && (sEl.textContent = pad2(secs));

    // ring fills (simple but cute)
    rings.secs && setRing(rings.secs, secs / 60);
    rings.mins && setRing(rings.mins, mins / 60);
    rings.hours && setRing(rings.hours, hours / 24);
    // days ring: fill based on proximity within 365 days (feel free to change)
    rings.days && setRing(rings.days, Math.max(0, 1 - (days / 365)));
  };

  tick();
  setInterval(tick, 1000);
}

/* INIT */
fill();
musicSetup();
mapsSetup();
mapModalSetup();
aliasSetup();
songSetup();
stepperSetup();
rsvpSetup();
gallerySetup();
countdown();
