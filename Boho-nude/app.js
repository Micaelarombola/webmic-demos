/* =========================
   15 • Boho Nude (Cover + Sections)
========================= */

const INVITADA = "CARLA";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

const FECHA_LIMITE_CONFIRMACION = "10/08";
const DRESSCODE = "Elegante";
const ALIAS = "carli.mp";

/* Instagram */
const IG_USER = "carla.xv";                 // sin @
const IG_CUMPLE = `https://www.instagram.com/${IG_USER}/`;
const HASHTAG = "#XVdeCarla";

/* WhatsApp */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

/* Ubicación (sin iframe) */
const ADDRESS_Q = encodeURIComponent(DIRECCION_TEXTO);
const MAPS_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${ADDRESS_Q}`;

/* Galería */
const GALLERY = [
  { src: "./assets/foto1.jpg" },
  { src: "./assets/foto2.jpg" },
  { src: "./assets/foto3.jpg" },
  { src: "./assets/foto4.jpg" },
  { src: "./assets/foto5.jpg" },
  { src: "./assets/foto6.jpg" },
];

const $ = (s) => document.querySelector(s);

function waLink() {
  const msg =
`Hola! Quiero confirmar mi asistencia a los XV 🤍

Nombre:
Cantidad de invitados:
Restricción alimentaria (si aplica):`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function fill() {
  $("#nombre").textContent = INVITADA;

  $("#fechaTxt").textContent = FECHA_TEXTO;
  $("#horaTxt").textContent = HORA_TEXTO;
  $("#lugarTxt").textContent = LUGAR_TEXTO;

  $("#dirTxt").textContent = DIRECCION_TEXTO;
  $("#dirTxt2").textContent = DIRECCION_TEXTO;

  $("#dresscodeTxt").textContent = DRESSCODE;
  $("#aliasTxt").textContent = ALIAS;

  $("#fechaLimite").textContent = FECHA_LIMITE_CONFIRMACION;

  const wa = waLink();
  $("#btnConfirm").href = wa;
  $("#fabConfirm").href = wa;

  $("#btnUbicacion").href = MAPS_OPEN_URL;

  $("#igLink").textContent = `@${IG_USER}`;
  $("#igLink").href = IG_CUMPLE;
  $("#btnIg").href = IG_CUMPLE;
  $("#hashtagTxt").textContent = HASHTAG;

  $("#footerName").textContent = INVITADA;
  $("#year").textContent = new Date().getFullYear();
}

function renderGallery() {
  const gallery = $("#gallery");
  if (!gallery) return;

  gallery.innerHTML = GALLERY.map(img => `
    <div class="gitem">
      <img src="${img.src}" alt="">
    </div>
  `).join("");
}

/* Modal regalos */
function modalSetup() {
  const modal = $("#modal");
  if (!modal) return;

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  $("#btnRegalos")?.addEventListener("click", open);

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  $("#copyAlias")?.addEventListener("click", async () => {
    const btn = $("#copyAlias");
    try {
      await navigator.clipboard.writeText(ALIAS);
      btn.textContent = "¡Copiado! ✅";
      setTimeout(() => (btn.textContent = "Copiar alias"), 1200);
    } catch {
      prompt("Copiá el alias:", ALIAS);
    }
  });
}

/* init */
fill();
renderGallery();
modalSetup();
