// =============================
// 15 • Glitter Lila (WebMic)
// =============================

// ✅ Pegá tu link real de Google Maps acá (maps.app.goo.gl o google.com/maps)
const MAPS_URL = "https://maps.app.goo.gl/w1VExSrx6Fez8tRZ8";

// ✅ Alias (texto)
const ALIAS = "cami.15.mp";

// ✅ WhatsApp (cambiá por el número real con 54911...)
const WHATSAPP_NUMBER = "5491127887082"; // ejemplo: 5491123456789

// ✅ Fecha del evento (para countdown)
// Formato recomendado: "2026-08-24T21:30:00-03:00"
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

// ✅ Galería (poné tus imágenes en /assets con estos nombres exactos)
const GALLERY = [
  { src: "assets/foto1.jpg", portrait: true },   // HERO
  { src: "assets/foto2.jpg", portrait: false },
  { src: "assets/foto3.jpg", portrait: false },
  { src: "assets/foto4.jpg", portrait: false },
];

const gallery = document.getElementById("gallery");

gallery.innerHTML = GALLERY.map(img => `
  <div class="gitem" style="--bg:url('${img.src}')">
    <img src="${img.src}" alt="">
  </div>
`).join("");


// ✅ Música (si no querés música: false)
const ENABLE_MUSIC = true;

// =============================
// HELPERS
// =============================
const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2, "0");

function waLink(text) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
}

// =============================
// MAPA
// =============================
const mapsBtn = $("#mapsBtn");
if (mapsBtn) mapsBtn.href = MAPS_URL;

// =============================
// COPIAR ALIAS
// =============================
const aliasText = $("#aliasText");
if (aliasText) aliasText.textContent = ALIAS;

$("#copyAlias")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(ALIAS);
    const btn = $("#copyAlias");
    btn.textContent = "¡Copiado!";
    setTimeout(() => (btn.textContent = "Copiar alias"), 900);
  } catch {
    alert("No pude copiar. Copialo manualmente: " + ALIAS);
  }
});

// =============================
// GALERÍA
// =============================
const galleryEl = $("#gallery");

function renderGallery() {
  if (!galleryEl) return;

  galleryEl.innerHTML = GALLERY.map((img) => {
    const cap = img.caption ? `<div class="gcap">${img.caption}</div>` : "";
    return `
      <article class="gitem">
        <img src="${img.src}" alt="${img.caption || "Foto"}" loading="lazy" />
        ${cap}
      </article>
    `;
  }).join("");
}
renderGallery();

// =============================
// RSVP -> WhatsApp
// =============================
$("#rsvpForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#guestName")?.value?.trim() || "";
  const qty = $("#guestQty")?.value || "1";
  const msg = $("#guestMsg")?.value?.trim() || "";

  const text =
    `Hola! Soy ${name} 😊\n` +
    `Confirmo asistencia a los XV.\n` +
    `Cantidad: ${qty}\n` +
    (msg ? `Mensaje: ${msg}\n` : "");

  window.open(waLink(text), "_blank", "noopener,noreferrer");
});

// =============================
// COUNTDOWN
// =============================
const target = new Date(EVENT_DATE_ISO).getTime();

function tick() {
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  $("#d").textContent = pad(d);
  $("#h").textContent = pad(h);
  $("#m").textContent = pad(m);
  $("#s").textContent = pad(s);
}
tick();
setInterval(tick, 1000);

// =============================
// MÚSICA
// =============================
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");
const musicIcon = $("#musicIcon");

if (!ENABLE_MUSIC) {
  musicBtn?.remove();
} else if (musicBtn && music) {
  musicBtn.addEventListener("click", async () => {
    try {
      if (music.paused) {
        await music.play(); // necesario por bloqueo del navegador
        musicIcon.textContent = "⏸";
      } else {
        music.pause();
        musicIcon.textContent = "▶";
      }
    } catch (e) {
      console.log("Audio error:", e);
      alert("El navegador bloqueó la música. Tocá nuevamente para reproducir.");
    }
  });
}
