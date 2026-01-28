/* =========================
   CONFIG • 15 Black & Gold (Art Deco)
========================= */

const BASE_PATH = ".";

/* MAPA */
const ADDRESS_Q = encodeURIComponent("Av. Siempre Viva 742, Buenos Aires");
const MAPS_URL = `https://www.google.com/maps?q=${ADDRESS_Q}&z=16&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS_Q}`;

/* EVENTO */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

const INVITADA = "SOFÍA";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janeos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

const DRESSCODE = "Elegante.";
const ALIAS = "sofi.15.mp";
const FRASE = "Una noche dorada, un recuerdo eterno ✨";

const MENSAJE_ESPECIAL =
  "Tu presencia es parte de mi noche dorada. Gracias por acompañarme en este momento tan especial 🖤✨";

/* GALERÍA */
const GALLERY = [
  { src: `${BASE_PATH}/assets/Foto1.jpg`, portrait: true },
  { src: `${BASE_PATH}/assets/Foto2.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/Foto3.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/Foto4.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/Foto5.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/Foto6.jpg`, portrait: false },
];

/* HELPERS */
const $ = (s) => document.querySelector(s);
const pad2 = (n) => String(n).padStart(2, "0");

/* WHATSAPP */
function waLink() {
  const msg = `Hola! Quiero confirmar mi asistencia a los XV 🖤✨

Nombre:
Cantidad de invitados:
Restricción alimentaria (si aplica):`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* DATA */
function fill() {
  $("#nombre") && ($("#nombre").textContent = INVITADA);
  $("#fechaTxt") && ($("#fechaTxt").textContent = FECHA_TEXTO);
  $("#horaTxt") && ($("#horaTxt").textContent = HORA_TEXTO);
  $("#lugarTxt") && ($("#lugarTxt").textContent = LUGAR_TEXTO);

  $("#mensajeEspecial") && ($("#mensajeEspecial").textContent = MENSAJE_ESPECIAL);
  $("#firmaNombre") && ($("#firmaNombre").textContent = INVITADA);
  $("#dresscodeTxt") && ($("#dresscodeTxt").textContent = DRESSCODE);
  $("#aliasTxt") && ($("#aliasTxt").textContent = ALIAS);
  $("#fraseTxt") && ($("#fraseTxt").textContent = FRASE);

  // ✅ MAPA
  $("#mapFrame") && ($("#mapFrame").src = MAPS_URL);

  // ✅ WhatsApp links
  const wa = waLink();
  $("#btnConfirm") && ($("#btnConfirm").href = wa);
  $("#btnConfirm2") && ($("#btnConfirm2").href = wa);
  $("#fabConfirm") && ($("#fabConfirm").href = wa);

  // ✅ Modal info (sin romper si faltan)
  $("#mFecha") && ($("#mFecha").textContent = FECHA_TEXTO);
  $("#mHora") && ($("#mHora").textContent = HORA_TEXTO);
  $("#mLugar") && ($("#mLugar").textContent = LUGAR_TEXTO);
  $("#mDir") && ($("#mDir").textContent = DIRECCION_TEXTO);

  // ✅ Map titles + routes
  $("#mapTitle") && ($("#mapTitle").textContent = LUGAR_TEXTO);
  $("#mapSub") && ($("#mapSub").textContent = DIRECCION_TEXTO);

  $("#btnRoute") && ($("#btnRoute").href = DIRECTIONS_URL);
  $("#btnRoute2") && ($("#btnRoute2").href = DIRECTIONS_URL);
}

/* GALERÍA */
function renderGallery() {
  const gallery = $("#gallery");
  if (!gallery) return;

  gallery.innerHTML = GALLERY.map(
    (img) => `
      <div class="gitem ${img.portrait ? "is-portrait" : ""}">
        <img src="${img.src}" alt="">
      </div>
    `
  ).join("");
}

/* COUNTDOWN */
function countdown() {
  const target = new Date(EVENT_DATE_ISO).getTime();

  const dEl = $("#d"), hEl = $("#h"), mEl = $("#m"), sEl = $("#s");
  if (!dEl || !hEl || !mEl || !sEl) return;

  const tick = () => {
    let diff = Math.max(0, target - Date.now());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);

    dEl.textContent = String(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(mins);
    sEl.textContent = pad2(secs);
  };

  tick();
  setInterval(tick, 1000);
}

/* MODAL */
function modalSetup() {
  const modal = $("#modal");
  if (!modal) return;

  const open = () => modal.classList.add("is-open");
  const close = () => modal.classList.remove("is-open");

  $("#btnInfo")?.addEventListener("click", open);
  $("#modalClose")?.addEventListener("click", close);
  $("#modalBack")?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
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

/* COPIAR ALIAS */
function copyAliasSetup() {
  const btn = $("#copyAlias");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ALIAS);
      btn.textContent = "¡COPIADO! ✅";
      setTimeout(() => (btn.textContent = "COPIAR ALIAS"), 1400);
    } catch {
      prompt("Copiá el alias:", ALIAS);
    }
  });
}

/* INIT */
fill();
renderGallery();
countdown();
modalSetup();
musicSetup();
copyAliasSetup();
