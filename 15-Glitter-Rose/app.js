/* =========================
   CONFIG • 15 Glitter Rose
========================= */

/* ✅ Pegá tu link real de Google Maps (embed) acá */
const MAPS_URL = "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+Buenos+Aires&output=embed";
const MAPS_LINK = "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+Buenos+Aires";
const DRESSCODE = "Elegante / Elegante sport.";
const CONFIRM_TEXTO = "Confirmá tu asistencia por WhatsApp.";
// Ya tenés ALIAS, lo vamos a mostrar acá

/* ✅ Alias (texto) */
const ALIAS = "Flor15.mp";

/* ✅ WhatsApp (cambiá por tu número real con 549...) */
const WHATSAPP_NUMBER = "5491123456789";

/* ✅ Fecha del evento (para countdown) */
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

/* ✅ Datos principales */
const INVITADA = "FLORENCIA";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janeos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

/* ✅ Galería (IMPORTANTE: nombres EXACTOS como en assets/) */
const GALLERY = [
    { src: "assets/foto1.jpg", portrait: true },
    { src: "assets/foto2.jpg", portrait: false },
    { src: "assets/foto3.jpg", portrait: false },
    { src: "assets/foto4.jpg", portrait: false },
    { src: "assets/foto5.jpg", portrait: false },
    { src: "assets/foto7.jpg", portrait: false },

    // { src: "assets/foto5.jpg", portrait: true }, // si tenés foto5.jpg
];

/* =========================
   Helpers
========================= */
const $ = (s) => document.querySelector(s);
const pad2 = (n) => String(n).padStart(2, "0");

function waLink() {
    const msg = `Hola! Quiero confirmar mi asistencia a los XV 💗

Nombre:
Cantidad de invitados:
Restricción alimentaria (si aplica):`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* =========================
   Fill content
========================= */

function fill() {
    $("#nombre").textContent = INVITADA;
    $("#fechaTxt").textContent = FECHA_TEXTO;
    $("#horaTxt").textContent = HORA_TEXTO;
    $("#lugarTxt").textContent = LUGAR_TEXTO;

    $("#mFecha").textContent = FECHA_TEXTO;
    $("#mHora").textContent = HORA_TEXTO;
    $("#mLugar").textContent = LUGAR_TEXTO;
    $("#mDir").textContent = DIRECCION_TEXTO;

    $("#mapFrame").src = MAPS_URL;

    const wa = waLink();
    $("#btnConfirm").href = wa;
    $("#btnConfirm2").href = wa;
    $("#btnConfirmTop").href = wa;

    $("#btnMaps").href = MAPS_LINK;
    // Detalles
const dressEl = $("#dresscodeTxt");
if (dressEl) dressEl.textContent = DRESSCODE;

const confirmEl = $("#confirmTxt");
if (confirmEl) confirmEl.textContent = CONFIRM_TEXTO;

const aliasEl = $("#aliasTxt");
if (aliasEl) aliasEl.textContent = ALIAS;

}

/* =========================
   Gallery render (✅ SOLO IMG)
========================= */
function renderGallery() {
    const gallery = $("#gallery");

    gallery.innerHTML = GALLERY.map(img => `
    <div class="gitem ${img.portrait ? "is-portrait" : ""}">
      <img src="${img.src}" alt="">
    </div>
  `).join("");
}

/* =========================
   Countdown
========================= */
function countdown() {
    const target = new Date(EVENT_DATE_ISO).getTime();

    const tick = () => {
        const now = Date.now();
        let diff = Math.max(0, target - now);

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

/* =========================
   Modal
========================= */
function modalSetup() {
    const modal = $("#modal");
    const open = () => modal.classList.add("is-open");
    const close = () => modal.classList.remove("is-open");

    $("#btnInfo").addEventListener("click", open);
    $("#modalClose").addEventListener("click", close);
    $("#modalBack").addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}

/* =========================
   Music
========================= */
function musicSetup() {
    const audio = $("#bgMusic");
    const btn = $("#musicBtn");
    const icon = $("#musicIcon");

    let playing = false;

    const play = async () => {
        try {
            await audio.play();
            playing = true;
            icon.textContent = "❚❚";
        } catch {
            playing = false;
            icon.textContent = "▶";
        }
    };

    const pause = () => {
        audio.pause();
        playing = false;
        icon.textContent = "▶";
    };

    btn.addEventListener("click", () => {
        if (playing) pause();
        else play();
    });

    // primer toque habilita autoplay
    window.addEventListener("pointerdown", () => {
        if (!playing) play();
    }, { once: true });
}
function copyAliasSetup(){
  const btn = $("#copyAlias");
  if(!btn) return;

  btn.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(ALIAS);
      btn.textContent = "¡Copiado! ✅";
      setTimeout(() => btn.textContent = "Copiar alias", 1400);
    }catch{
      // fallback si clipboard no funciona
      prompt("Copiá el alias:", ALIAS);
    }
  });
}

/* =========================
   Init
========================= */
fill();
renderGallery();
countdown();
modalSetup();
musicSetup();
copyAliasSetup();

