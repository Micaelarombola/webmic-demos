/* =========================
   15 • Minimal White (Premium)
========================= */
const BASE_PATH = ".";

/* EVENTO */
const WHATSAPP_NUMBER = "5491123456789";
const INVITADA = "SOFÍA";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón Janeos";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";
const FRASE = "Una noche especial para compartir ✨";

/* DRESS CODE */
const DRESSCODE = "Elegante";

/* Instagram */
const HASHTAG = "#SofiaXV";
const IG_HANDLE = "sofia.15"; // sin @
const IG_URL = `https://www.instagram.com/${IG_HANDLE}/`;

/* REGALOS */
const ALIAS = "sofi.15.mp";
const MERCADOPAGO_URL = "https://www.mercadopago.com.ar/";

/* UBICACIÓN */
const ADDRESS_Q = encodeURIComponent(DIRECCION_TEXTO);
const MAPS_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${ADDRESS_Q}`;

/* PORTADA FOTO */
const COVER_IMAGE = `${BASE_PATH}/assets/foto1.jpg`;

/* GALERÍA */
const GALLERY = [
  `${BASE_PATH}/assets/foto1.jpg`,
  `${BASE_PATH}/assets/foto2.jpg`,
  `${BASE_PATH}/assets/foto3.jpg`,
  `${BASE_PATH}/assets/foto4.jpg`,
  `${BASE_PATH}/assets/foto5.jpg`,
  `${BASE_PATH}/assets/foto6.jpg`,
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function waLink(customText) {
  const base =
`Hola! Quiero confirmar mi asistencia a los XV ✨

Nombre:
Cantidad de invitados:
Restricción alimentaria (si aplica):`;

  const text = customText || base;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function fill() {
  $("#year").textContent = new Date().getFullYear();

  $("#nombre").textContent = INVITADA;
  $("#fraseTxt").textContent = FRASE;

  $("#fechaTxt").textContent = FECHA_TEXTO;
  $("#horaTxt").textContent = HORA_TEXTO;
  $("#lugarTxt").textContent = LUGAR_TEXTO;
  $("#dirTxt").textContent = DIRECCION_TEXTO;

  const dc = $("#dresscodeTxt");
  if (dc) dc.textContent = DRESSCODE;

  // IG / hashtag en texto
  $("#igHandleTxt").textContent = "@" + IG_HANDLE;
  $("#hashtagTxt").textContent = HASHTAG;

  // links
  $("#btnIG").href = IG_URL;
  $("#btnIG2").href = IG_URL;

  // confirmar (solo 1 botón principal + footer)
  const wa = waLink();
  $("#btnConfirm").href = wa;
  $("#btnConfirm2").href = wa;

  // foto portada
  $("#coverPhoto").style.backgroundImage = `url('${COVER_IMAGE}')`;
}

/* Galería */
function renderGallery() {
  const g = $("#gallery");
  if (!g) return;
  g.innerHTML = GALLERY.map(src => `
    <div class="mitem"><img src="${src}" alt=""></div>
  `).join("");
}

/* Modals */
function modalSetup() {
  const giftModal = $("#giftModal");
  const placeModal = $("#placeModal");

  const openGift = () => giftModal.hidden = false;
  const closeGift = () => giftModal.hidden = true;

  const openPlace = () => placeModal.hidden = false;
  const closePlace = () => placeModal.hidden = true;

  $("#openGifts").addEventListener("click", openGift);
  $("#openPlace").addEventListener("click", openPlace);

  // cierres
  $$("#giftModal [data-close]").forEach(el => el.addEventListener("click", closeGift));
  $$("#placeModal [data-close]").forEach(el => el.addEventListener("click", closePlace));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeGift(); closePlace(); }
  });

  // regalos
  $("#aliasTxt").textContent = ALIAS;
  $("#btnOpenMP").href = MERCADOPAGO_URL;

  $("#btnCopyAlias").addEventListener("click", async () => {
    const btn = $("#btnCopyAlias");
    try{
      await navigator.clipboard.writeText(ALIAS);
      const old = btn.textContent;
      btn.textContent = "¡Copiado! ✅";
      setTimeout(()=> btn.textContent = old, 1200);
    }catch{
      prompt("Copiá el alias:", ALIAS);
    }
  });

  // ubicación
  $("#placeLine").textContent = `${LUGAR_TEXTO} — ${DIRECCION_TEXTO}`;
  $("#btnMaps").href = MAPS_OPEN_URL;
}

/* Música */
function musicSetup() {
  const audio = $("#bgMusic");
  const btn = $("#btnMusic");
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

/* init */
fill();
renderGallery();
modalSetup();
musicSetup();
