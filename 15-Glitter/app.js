// =======================
// CONFIG (EDITÁ ESTO)
// =======================

// Fecha del evento (AAAA-MM-DDTHH:MM:SS)
const EVENT_DATE = "2026-08-24T21:30:00";

// Google Maps (pegá tu link real)
const MAPS_URL = "https://maps.app.goo.gl/w1VExSrx6Fez8tRZ8";

// Alias (texto)
const ALIAS = " cami.15.mp";

// WhatsApp (cambiá por el número real con 54 9)
const WHATSAPP_NUMBER = "5491127887082"; // ej: 5491123456789

// Galería (poné imágenes en /assets y cambiá nombres)
const GALLERY = [
  { src: "assets/Foto1.jpg" },
  { src: "assets/Foto2.jpg" },
  { src: "assets/Foto3.jpg" },
  { src: "assets/Foto4.jpg" },
  { src: "assets/Foto5.jpg" },
  { src: "assets/Foto6.jpg" },
];


// Música (si no querés música, poné ENABLE_MUSIC = false)
const ENABLE_MUSIC = true;


// =======================
// HELPERS
// =======================
const $ = (s) => document.querySelector(s);

function pad(n){ return String(n).padStart(2, "0"); }

function waLink(text){
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
}

// =======================
// COUNTDOWN
// =======================
function startCountdown(){
  const target = new Date(EVENT_DATE).getTime();

  const tick = () => {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000*60*60*24));
    const hrs  = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    $("#d").textContent = pad(days);
    $("#h").textContent = pad(hrs);
    $("#m").textContent = pad(mins);
    $("#s").textContent = pad(secs);
  };

  tick();
  setInterval(tick, 1000);
}

// =======================
// GALLERY
// =======================
function renderGallery(){
  const wrap = document.querySelector("#gallery");
  wrap.innerHTML = GALLERY.map(item => `
    <figure class="gal">
      <div class="gal__frame" style="--img:url('${item.src}')">
        <img src="${item.src}" alt="">
      </div>
    </figure>
  `).join("");
}

// =======================
// MAPS + ALIAS
// =======================
function initInfo(){
  $("#mapsBtn").href = MAPS_URL;
  $("#aliasText").textContent = ALIAS;

  $("#copyAlias").addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(ALIAS);
      $("#copyAlias").textContent = "¡Copiado!";
      setTimeout(()=> $("#copyAlias").textContent = "Copiar alias", 900);
    } catch {
      alert("No pude copiar. Copialo manualmente: " + ALIAS);
    }
  });
}

// =======================
// RSVP -> WhatsApp
// =======================
function initRSVP(){
  $("#rsvpForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#guestName").value.trim();
    const qty = $("#guestQty").value;
    const msg = $("#guestMsg").value.trim();

    const text =
      `Hola! Confirmo asistencia a los XV.\n` +
      `Nombre: ${name}\n` +
      `Asistimos: ${qty}\n` +
      (msg ? `Mensaje: ${msg}` : "");

    window.open(waLink(text), "_blank", "noopener,noreferrer");
  });
}

// =======================
// MUSIC
// =======================
function initMusic(){
  const audio = $("#bgMusic");
  const btn = $("#musicBtn");
  const icon = $("#musicIcon");

  if (!ENABLE_MUSIC){
    btn.style.display = "none";
    return;
  }

  let playing = false;

  btn.addEventListener("click", async () => {
    try{
      if (!playing){
        await audio.play();
        playing = true;
        icon.textContent = "❚❚";
      } else {
        audio.pause();
        playing = false;
        icon.textContent = "▶";
      }
    } catch {
      // Algunos navegadores bloquean autoplay si no hay interacción
      alert("Tocá de nuevo para activar la música.");
    }
  });
}

// =======================
// INIT
// =======================
startCountdown();
renderGallery();
initInfo();
initRSVP();
initMusic();
