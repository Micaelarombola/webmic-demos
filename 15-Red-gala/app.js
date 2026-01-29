/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

const INVITADA = "ZOE";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

const FRASE = "Una noche de gala, brillo y emoción ✨";
const MENSAJE_INVITADOS =
  "Quiero que esta noche sea un recuerdo para siempre. Gracias por acompañarme ✨";

const DRESSCODE = "Gala";
const ALIAS = "zoe.15.mp";
const NOTA = "Tip: un detalle dorado queda increíble ✨";
const FOOTER_FRASE = "Gracias por compartir esta noche conmigo ✨❤️";

/* GALERÍA (masonry) */
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

/* INTRO */
function introSetup(){
  const intro = $("#intro");
  if(!intro) return;

  // fill intro name
  $("#introName").textContent = INVITADA;

  const closeIntro = () => {
    intro.classList.add("open");
    setTimeout(() => intro.classList.add("is-off"), 980);
  };

  intro.addEventListener("click", closeIntro, { once:true });
}

/* Fill */
function fill() {
  $("#nombre") && ($("#nombre").textContent = INVITADA);
  $("#firmaNombre") && ($("#firmaNombre").textContent = INVITADA);

  $("#fraseTxt") && ($("#fraseTxt").textContent = FRASE);
  $("#mensajeInvitados") && ($("#mensajeInvitados").textContent = MENSAJE_INVITADOS);

  $("#fechaTop") && ($("#fechaTop").textContent = FECHA_TEXTO);
  $("#horaTop") && ($("#horaTop").textContent = HORA_TEXTO);

  $("#fechaTxt") && ($("#fechaTxt").textContent = FECHA_TEXTO);
  $("#horaTxt") && ($("#horaTxt").textContent = HORA_TEXTO);
  $("#lugarTxt") && ($("#lugarTxt").textContent = LUGAR_TEXTO);
  $("#dirTxt") && ($("#dirTxt").textContent = DIRECCION_TEXTO);

  $("#lugarTop") && ($("#lugarTop").textContent = LUGAR_TEXTO);
  $("#dirTop") && ($("#dirTop").textContent = DIRECCION_TEXTO);

  $("#dressTxt") && ($("#dressTxt").textContent = DRESSCODE);

  $("#aliasTxt") && ($("#aliasTxt").textContent = ALIAS);
  $("#notaTxt") && ($("#notaTxt").textContent = NOTA);
  $("#footerTxt") && ($("#footerTxt").textContent = FOOTER_FRASE);

  $("#modalAddr") && ($("#modalAddr").textContent = DIRECCION_TEXTO);
}

/* Gallery + lightbox */
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

/* Countdown */
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

/* Music */
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

/* Maps */
function mapsSetup() {
  $("#btnComoLlegar")?.addEventListener("click", () => window.open(MAPS_OPEN, "_blank", "noreferrer"));
}

/* Map modal */
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

  $("#openMaps2")?.addEventListener("click", () => window.open(MAPS_OPEN, "_blank", "noreferrer"));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-on")) hide();
  });
}

/* Alias */
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

/* RSVP */
function rsvpSetup() {
  const form = $("#rsvpForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = $("#fNombre").value.trim();
    const comida = $("#fComida").value;
    const mensaje = ($("#fMensaje").value || "").trim();
    const mesa = ($("#fMesa").value || "").trim();
    const asiento = ($("#fAsiento").value || "").trim();

    // muestra mesa/asiento en el ticket (si lo completan)
    if (mesa) $("#mesaTxt").textContent = mesa;
    if (asiento) $("#mesaTxt").textContent = mesa ? `${mesa} • ${asiento}` : asiento;

    const msg =
`Confirmación XV ❤️✨

Nombre y apellido: ${nombre}
Tipo de comida: ${comida}
Mesa: ${mesa || "-"}
Asiento: ${asiento || "-"}
Mensaje: ${mensaje || "(sin mensaje)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* Playlist */
function songSetup() {
  const btn = $("#btnSong");
  const input = $("#songInput");
  if (!btn || !input) return;

  btn.addEventListener("click", () => {
    const song = input.value.trim();
    const msg =
`Tema para la fiesta 🎶❤️

Hola! Me gustaría que suene:
${song || "(no escribió tema)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* Reveal */
function revealSetup(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window) || !els.length){
    els.forEach(el => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  els.forEach(el => io.observe(el));
}

/* INIT */
introSetup();
fill();
gallerySetup();
countdown();
musicSetup();
mapsSetup();
mapModalSetup();
aliasSetup();
rsvpSetup();
songSetup();
revealSetup();
