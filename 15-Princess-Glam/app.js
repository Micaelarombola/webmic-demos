/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

const INVITADA = "IVANNA";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

const FRASE = "Una noche de cuento, brillo y amor ✨";
const MENSAJE_INVITADOS =
  "Quiero que esta noche sea un recuerdo para siempre. Gracias por acompañarme y celebrar conmigo ✨";

const DRESSCODE = "Elegante";
const ALIAS = "ivanna.15.mp";

const FOOTER_FRASE = "Gracias por compartir esta noche conmigo ✨💛";

/* GALERÍA */
const GALLERY = [
  { src: "./assets/Foto1.jpg" },
  { src: "./assets/Foto2.jpg" },
  { src: "./assets/Foto3.jpg" },
  { src: "./assets/Foto4.jpg" },
];

/* MAPS */
const ADDRESS_Q = encodeURIComponent(DIRECCION_TEXTO);
const MAPS_OPEN = `https://www.google.com/maps?q=${ADDRESS_Q}&z=16`;

/* HELPERS */
const $ = (s) => document.querySelector(s);
const pad2 = (n) => String(n).padStart(2, "0");

/* FILL */
function fill() {
  $("#nombre") && ($("#nombre").textContent = INVITADA);
  $("#nombreTop") && ($("#nombreTop").textContent = INVITADA);
  $("#firmaNombre") && ($("#firmaNombre").textContent = INVITADA);

  $("#fraseTxt") && ($("#fraseTxt").textContent = FRASE);
  $("#mensajeInvitados") && ($("#mensajeInvitados").textContent = MENSAJE_INVITADOS);

  $("#fechaTxt") && ($("#fechaTxt").textContent = FECHA_TEXTO);
  $("#horaTxt") && ($("#horaTxt").textContent = HORA_TEXTO);
  $("#lugarTxt") && ($("#lugarTxt").textContent = LUGAR_TEXTO);
  $("#dirTxt") && ($("#dirTxt").textContent = DIRECCION_TEXTO);

  $("#dressTxt") && ($("#dressTxt").textContent = DRESSCODE);

  $("#aliasTxt") && ($("#aliasTxt").textContent = ALIAS);
  $("#footerTxt") && ($("#footerTxt").textContent = FOOTER_FRASE);
}

/* GALLERY */
function renderGallery() {
  const gallery = $("#gallery");
  if (!gallery) return;

  gallery.innerHTML = GALLERY.map(
    (img) => `
      <div class="gitem">
        <img src="${img.src}" alt="">
      </div>
    `
  ).join("");
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

    $("#d").textContent = days;
    $("#h").textContent = pad2(hours);
    $("#m").textContent = pad2(mins);
    $("#s").textContent = pad2(secs);
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

/* MAPS */
function mapsSetup() {
  $("#btnComoLlegar")?.addEventListener("click", () => {
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
`Confirmación XV 👑✨

Nombre y apellido: ${nombre}
Tipo de comida: ${comida}
Mensaje: ${mensaje || "(sin mensaje)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* PLAYLIST -> WhatsApp */
function songSetup() {
  const btn = $("#btnSong");
  const input = $("#songInput");
  if (!btn || !input) return;

  btn.addEventListener("click", () => {
    const song = input.value.trim();

    const msg =
`Tema para la fiesta 🎶👑

Hola! Me gustaría que suene:
${song || "(no escribió tema)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* REVEAL ANIMATION */
function revealSetup() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

/* INIT */
fill();
renderGallery();
countdown();
musicSetup();
mapsSetup();
aliasSetup();
rsvpSetup();
songSetup();
revealSetup();
