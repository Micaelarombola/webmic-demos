/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

const INVITADA = "JAZMIN";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";
const FRASE = "Noche neón, recuerdos eternos ✨";

const ALIAS = "jaz.15.mp";

/* MAPS */
const ADDRESS_Q = encodeURIComponent(DIRECCION_TEXTO);
const MAPS_OPEN = `https://www.google.com/maps?q=${ADDRESS_Q}&z=16`;

/* HELPERS */
const $ = (s) => document.querySelector(s);
const pad2 = (n) => String(n).padStart(2, "0");

/* FILL */
function fill() {
  $("#nombre").textContent = INVITADA;
  $("#fraseTxt").textContent = FRASE;

  $("#fechaTxt").textContent = FECHA_TEXTO;
  $("#horaTxt").textContent = HORA_TEXTO;
  $("#lugarTxt").textContent = LUGAR_TEXTO;

  $("#aliasTxt").textContent = ALIAS;
}

/* COUNTDOWN */
function countdown() {
  const target = new Date(EVENT_DATE_ISO).getTime();

  const tick = () => {
    let diff = Math.max(0, target - Date.now());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);
bumpOnChange("d", days);
bumpOnChange("h", pad2(hours));
bumpOnChange("m", pad2(mins));
bumpOnChange("s", pad2(secs));

  };

  tick();
  setInterval(tick, 1000);
}

/* MÚSICA */
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

/* UBICACIÓN */
function mapsSetup() {
  $("#btnUbicacion")?.addEventListener("click", () => {
    window.open(MAPS_OPEN, "_blank", "noreferrer");
  });
}

/* ALIAS: mostrar + copiar */
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

/* RSVP (mini formulario) */
function rsvpSetup() {
  const form = $("#rsvpForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = $("#fNombre").value.trim();
    const cant = $("#fCant").value.trim();
    const comida = $("#fComida").value;

    const msg =
`Confirmación XV 💜 (Neon Night)

Nombre y apellido: ${nombre}
Cantidad de invitados: ${cant}
Tipo de comida: ${comida}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });

  // fab te baja a confirmar
  $("#fabConfirm")?.addEventListener("click", (e) => {
    // deja el anchor funcionar
  });
}

/* TEMA MUSICAL */
function songSetup() {
  const btn = $("#btnSong");
  const input = $("#songInput");
  if (!btn || !input) return;

  btn.addEventListener("click", () => {
    const song = input.value.trim();
    const msg =
`Tema para la fiesta 🎶 (Neon Night)

Hola! Me gustaría que suene:
${song || "(no escribió tema)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}
/* SCROLL REVEAL */
function revealSetup(){
  const els = document.querySelectorAll(".section, .footer, .grid2 .card, .card.formCard, .card");
  els.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

/* BUMP en cuenta regresiva cuando cambian */
function bumpOnChange(id, value){
  const el = document.getElementById(id);
  if (!el) return;
  if (el.textContent !== String(value)){
    el.textContent = value;
    el.classList.remove("bump");
    // reinicia animación
    void el.offsetWidth;
    el.classList.add("bump");
  }
}

/* INIT */
fill();
countdown();
musicSetup();
mapsSetup();
aliasSetup();
rsvpSetup();
songSetup();
revealSetup();
