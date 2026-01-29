// app.js
/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-09-14T21:30:00-03:00";

const INVITADA = "ALMA";
const FECHA_TEXTO = "Sábado 14 de Septiembre 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Jardines”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

const FRASE = "Una tarde noche entre verde suave, luz y amor.";
const DRESSCODE = "Elegante";
const ALIAS = "alma.15.mp";
const FOOTER_FRASE = "Gracias por compartir esta noche conmigo 💚";

/* GALERÍA (assets) */
const GALLERY = [
  { src: "./assets/foto1.jpg", cap: "Sage moment", date: "2026" },
  { src: "./assets/foto2.jpg", cap: "Brillos suaves", date: "2026" },
  { src: "./assets/foto3.jpg", cap: "Sonrisas", date: "2026" },
  { src: "./assets/foto4.jpg", cap: "Familia", date: "2026" },
    { src: "./assets/foto5.jpg", cap: "Familia", date: "2026" },
  { src: "./assets/foto6.jpg", cap: "Familia", date: "2026" },

];

/* MAPS */
const ADDRESS_Q = encodeURIComponent(`${DIRECCION_TEXTO} ${LUGAR_TEXTO}`);
const MAPS_OPEN = `https://www.google.com/maps?q=${ADDRESS_Q}&z=16`;
// Embed simple (no API key)
const MAPS_EMBED = `https://www.google.com/maps?output=embed&q=${ADDRESS_Q}&z=16`;

/* HELPERS */
const $ = (s) => document.querySelector(s);
const pad2 = (n) => String(n).padStart(2, "0");

/* FILL */
function fill() {
  $("#nombre") && ($("#nombre").textContent = INVITADA);
  $("#nombreBadge") && ($("#nombreBadge").textContent = INVITADA);

  $("#fraseTxt") && ($("#fraseTxt").textContent = FRASE);

  $("#fechaTxt") && ($("#fechaTxt").textContent = FECHA_TEXTO);
  $("#horaTxt") && ($("#horaTxt").textContent = HORA_TEXTO);
  $("#lugarTxt") && ($("#lugarTxt").textContent = LUGAR_TEXTO);
  $("#dirTxt") && ($("#dirTxt").textContent = DIRECCION_TEXTO);

  $("#dressTxt") && ($("#dressTxt").textContent = DRESSCODE);

  $("#aliasTxt") && ($("#aliasTxt").textContent = ALIAS);
  $("#footerTxt") && ($("#footerTxt").textContent = FOOTER_FRASE);

  const map = $("#mapFrame");
  if (map) map.src = MAPS_EMBED;
}

/* GALLERY (polaroids) */
function renderGallery() {
  const gallery = $("#gallery");
  if (!gallery) return;

  const rots = ["-2.4deg", "1.8deg", "-1.2deg", "2.2deg", "-1.8deg", "1.1deg"];

  gallery.innerHTML = GALLERY.map((img, i) => `
    <article class="pItem reveal" style="--rot:${rots[i % rots.length]}">
      <div class="pImg">
        <img src="${img.src}" alt="">
      </div>
      <div class="pCap">
        <span>${img.cap || "Foto"}</span>
        <small>${img.date || ""}</small>
      </div>
    </article>
  `).join("");
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

/* MUSIC */
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

/* MAPS + CALENDAR */
function mapsSetup() {
  $("#btnComoLlegar")?.addEventListener("click", () => {
    window.open(MAPS_OPEN, "_blank", "noreferrer");
  });

  $("#btnAddCal")?.addEventListener("click", () => {
    // Google Calendar quick-add link
    const start = EVENT_DATE_ISO.replace(/[-:]/g, "").replace(".000", "");
    // End 4 hours later:
    const endDate = new Date(new Date(EVENT_DATE_ISO).getTime() + 4 * 60 * 60 * 1000).toISOString();
    const end = endDate.replace(/[-:]/g, "").replace(".000", "");
    const text = encodeURIComponent(`Mis XV • ${INVITADA}`);
    const details = encodeURIComponent(`${LUGAR_TEXTO} — ${DIRECCION_TEXTO}`);
    const location = encodeURIComponent(`${LUGAR_TEXTO} ${DIRECCION_TEXTO}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, "_blank", "noreferrer");
  });
}

/* ALIAS */
function aliasSetup() {
  const btn = $("#btnAlias");
  const box = $("#aliasBox");
  if (!btn || !box) return;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ALIAS);
      btn.textContent = "¡COPIADO! ✅";
      setTimeout(() => (btn.textContent = "Ver / Copiar alias"), 1400);
    } catch {
      prompt("Copiá el alias:", ALIAS);
    }
  };

  btn.addEventListener("click", async () => {
    box.hidden = !box.hidden;
    await copy();
  });
}

/* RSVP segmented + WhatsApp */
function rsvpSetup() {
  const form = $("#rsvpForm");
  if (!form) return;

  document.querySelectorAll(".segBtn").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".segBtn").forEach((x) => x.classList.remove("is-on"));
      b.classList.add("is-on");
      $("#fAsiste").value = b.dataset.attend === "no" ? "No" : "Sí";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = $("#fNombre").value.trim();
    const asiste = $("#fAsiste").value;
    const comida = $("#fComida").value;
    const mensaje = ($("#fMensaje").value || "").trim();

    const msg =
`Confirmación XV 🌿✨

Nombre y apellido: ${nombre}
Asiste: ${asiste}
Comida: ${comida}
Mensaje: ${mensaje || "(sin mensaje)"}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* Song shortcut */
function songShortcut() {
  $("#btnGoSong")?.addEventListener("click", () => {
    const msg =
`Tema para la fiesta 🎶🌿

Hola! Me gustaría que suene:
(Escribo el tema acá)`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/* Reveal */
function revealSetup() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach((el) => io.observe(el));
}

/* Parallax tilt (super suave) */
function parallaxTilt() {
  const card = $("#parallaxCard");
  if (!card) return;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const onMove = (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = clamp((0.5 - y) * 6, -6, 6);
    const ry = clamp((x - 0.5) * 8, -8, 8);
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const reset = () => (card.style.transform = "rotateX(0deg) rotateY(0deg)");

  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", reset);

  // mobile: subtle by scroll
  window.addEventListener("scroll", () => {
    if (window.matchMedia("(max-width: 980px)").matches) reset();
  }, { passive: true });
}

/* Dots canvas */
function dotsFX() {
  const c = $("#dots");
  if (!c) return;
  const ctx = c.getContext("2d");

  const resize = () => {
    c.width = window.innerWidth * devicePixelRatio;
    c.height = window.innerHeight * devicePixelRatio;
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
  };
  resize();
  window.addEventListener("resize", resize);

  const dots = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.6 + Math.random() * 1.6,
    a: 0.06 + Math.random() * 0.10,
    vx: (Math.random() - 0.5) * 0.00025,
    vy: (Math.random() - 0.5) * 0.00022,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);

    dots.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -0.05;
      if (p.y < -0.05) p.y = 1.05;
      if (p.y > 1.05) p.y = -0.05;

      const x = p.x * window.innerWidth;
      const y = p.y * window.innerHeight;

      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,213,200,${p.a})`;
      ctx.fill();
    });

    ctx.restore();
    requestAnimationFrame(draw);
  };
  draw();
}

/* INIT */
fill();
renderGallery();
countdown();
musicSetup();
mapsSetup();
aliasSetup();
rsvpSetup();
songShortcut();
revealSetup();
parallaxTilt();
dotsFX();
