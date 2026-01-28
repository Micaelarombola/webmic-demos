/* =========================
   15 • FLORAL PASTEL
   GitHub Pages friendly (rutas relativas)
========================= */

const BASE_PATH = ".";

/* Datos del evento */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_TEXT = "Sábado 24 de Agosto 2026";
const EVENT_TIME_TEXT = "21:30 hs";
const EVENT_NAME = "ALMA";
const EVENT_PHRASE = "Una noche especial para recordar para siempre ✨";

const PLACE_NAME = "Salón Janos";
const PLACE_ADDRESS = "Av. Siempre Viva 742, Buenos Aires";

const DRESSCODE = "Elegante";

/* Regalo */
const ALIAS = "Alma.15.mp";

/* IG / Hashtag */
const IG_USER = "Alma.15";       // sin @
const IG_HASHTAG = "AlmaXV";     // sin #

/* Maps */
const ADDRESS_Q = encodeURIComponent(PLACE_ADDRESS);
const MAPS_OPEN_URL = `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS_Q}`;

/* Galería */
const GALLERY = [
  { src: `${BASE_PATH}/assets/foto1.jpg`, portrait: true },
  { src: `${BASE_PATH}/assets/foto2.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/foto3.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/foto4.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/foto5.jpg`, portrait: false },
  { src: `${BASE_PATH}/assets/foto6.jpg`, portrait: false },
];

const $ = (s) => document.querySelector(s);

function waLink() {
  const msg =
`Hola! Quiero confirmar mi asistencia a los XV ✨

Nombre:
Cantidad de invitados:
Restricción alimentaria (si aplica):`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* Fill content */
function fill() {
  $("#nombre").textContent = EVENT_NAME;
  $("#fraseTxt").textContent = EVENT_PHRASE;

  $("#fechaTxt").textContent = EVENT_DATE_TEXT;
  $("#horaTxt").textContent = EVENT_TIME_TEXT;
  $("#lugarTxt").textContent = PLACE_NAME;
  $("#direccionTxt").textContent = PLACE_ADDRESS;

  $("#fechaTxtChip").textContent = EVENT_DATE_TEXT;
  $("#horaTxtChip").textContent = EVENT_TIME_TEXT;
  $("#lugarTxtChip").textContent = PLACE_NAME;

  $("#dresscodeTxt").textContent = DRESSCODE;
  $("#dresscodeMini").textContent = DRESSCODE;

  $("#aliasTxt").textContent = ALIAS;
  $("#aliasBig").textContent = ALIAS;

  $("#nombreFooter").textContent = EVENT_NAME;

  const wa = waLink();
  $("#btnConfirm").href = wa;
  $("#btnConfirm2").href = wa;
  $("#btnConfirmTop").href = wa;
  $("#fabConfirm").href = wa;

  $("#btnRoute").href = MAPS_OPEN_URL;

  const igLink = `https://www.instagram.com/${IG_USER}/`;
  $("#igUser").textContent = `@${IG_USER}`;
  $("#igUser").href = igLink;

  $("#igTag").textContent = `#${IG_HASHTAG}`;

  $("#year").textContent = new Date().getFullYear();
}

/* Gallery render */
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

/* Regalo modal */
function giftModalSetup() {
  const modal = $("#giftModal");
  if (!modal) return;

  const open = () => modal.classList.add("is-open");
  const close = () => modal.classList.remove("is-open");

  $("#btnGift")?.addEventListener("click", open);
  $("#openAlias")?.addEventListener("click", open);

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  $("#modalAlias").textContent = ALIAS;

  const copy = async (btn) => {
    try {
      await navigator.clipboard.writeText(ALIAS);
      const old = btn.textContent;
      btn.textContent = "¡Copiado! ✅";
      setTimeout(() => (btn.textContent = old), 1200);
    } catch {
      prompt("Copiá el alias:", ALIAS);
    }
  };

  $("#copyAlias")?.addEventListener("click", () => copy($("#copyAlias")));
  $("#copyAlias2")?.addEventListener("click", () => copy($("#copyAlias2")));

  // Si querés abrir una app bancaria, lo dejamos como fallback a Google (igual sirve)
  $("#openWallet").href = `https://www.google.com/search?q=alias+${encodeURIComponent(ALIAS)}`;
}

/* Botón ubicación (abre Google Maps) */
function locationBtnSetup() {
  $("#btnLocation")?.addEventListener("click", () => {
    window.open(MAPS_OPEN_URL, "_blank", "noopener,noreferrer");
  });
}

/* Init */
fill();
renderGallery();
giftModalSetup();
locationBtnSetup();
