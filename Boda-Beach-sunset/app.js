/* =========================
   BODA BEACH-ROMANCE • app.js (BEACH edition)
   - Beach FX: sparkles + foam (canvas)
   - Reveal con stagger
   - Parallax hero
   - Progress scroll
   - Countdown
   - Copy address + copy hashtag
   - .ICS calendar
   - RSVP WhatsApp + burst sparkles
========================= */

/* ========= CONFIG ========= */
const CONFIG = {
  couple: "Sofía & Tomás",
  dateISO: "2026-02-22T18:30:00",
  addressText: "Av. Ejemplo 1234, Ciudad",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Av.+Ejemplo+1234,+Ciudad",
  whatsappTo: "54911XXXXXXXX", // ej: 5491122334455
  placeShort: "Playa • Atardecer",
  hashtag: "#SofiYTomiAlMar",
  playlistLink: "https://open.spotify.com/" // pegá tu link real
};

/* ========= HELPERS ========= */
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));
const pad2 = (n) => String(n).padStart(2, "0");

/* ========= SET TEXT ========= */
(() => {
  const coupleTitle = $("#coupleTitle");
  if (coupleTitle) coupleTitle.textContent = CONFIG.couple;

  const addrText = $("#addrText");
  if (addrText) addrText.textContent = CONFIG.addressText;

  const mapsBtn = $("#mapsBtn");
  if (mapsBtn) mapsBtn.href = CONFIG.mapsLink;

  const placeShort = $("#placeShort");
  if (placeShort) placeShort.textContent = CONFIG.placeShort;

  const hashtagText = $("#hashtagText");
  if (hashtagText) hashtagText.textContent = CONFIG.hashtag;

  const playlistBtn = $("#playlistBtn");
  if (playlistBtn) playlistBtn.href = CONFIG.playlistLink;

  // Fecha humana + badge
  const dateHuman = $("#dateHuman");
  const badgeDate = $("#badgeDate");
  if (dateHuman || badgeDate) {
    const d = new Date(CONFIG.dateISO);
    const opts = { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" };
    const human = d.toLocaleString("es-AR", opts).replace(",", " •");
    if (dateHuman) dateHuman.textContent = human;

    const z = (n) => String(n).padStart(2, "0");
    const small = `${z(d.getDate())} • ${z(d.getMonth() + 1)} • ${d.getFullYear()}`;
    if (badgeDate) badgeDate.textContent = small;
  }
})();

/* ========= MENU ========= */
(() => {
  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => mobileNav.classList.toggle("show"));
  $$(".mobileNav a", mobileNav).forEach((a) =>
    a.addEventListener("click", () => mobileNav.classList.remove("show"))
  );
})();

/* ========= SCROLL PROGRESS ========= */
(() => {
  const bar = $("#progressBar");
  if (!bar) return;

  const onScroll = () => {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const p = (h.scrollTop / max) * 100;
    bar.style.width = `${p}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ========= REVEAL (stagger) ========= */
(() => {
  const els = $$(".reveal");
  if (!els.length) return;

  els.forEach((el, i) => (el.style.transitionDelay = `${Math.min(i * 0.045, 0.36)}s`));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
})();

/* ========= HERO PARALLAX ========= */
(() => {
  const host = $("#heroParallax");
  if (!host) return;
  const card = host.querySelector(".photoCard");
  if (!card) return;

  let rect = null;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function onMove(clientX, clientY) {
    if (!rect) rect = card.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;

    const rx = clamp((-y) * 5, -6, 6);
    const ry = clamp(x * 7, -8, 8);

    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  }

  host.addEventListener("mouseenter", () => (rect = card.getBoundingClientRect()));
  host.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
  host.addEventListener("mouseleave", () => {
    card.style.transform = "";
    rect = null;
  });

  host.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (!t) return;
      onMove(t.clientX, t.clientY);
    },
    { passive: true }
  );

  host.addEventListener(
    "touchend",
    () => {
      card.style.transform = "";
      rect = null;
    },
    { passive: true }
  );
})();

/* ========= COUNTDOWN ========= */
(() => {
  const rootCountdown = $(".countdown");
  if (!rootCountdown) return;

  const dd = $("#dd"),
    hh = $("#hh"),
    mm = $("#mm"),
    ss = $("#ss");
  if (!rootCountdown.dataset.deadline) rootCountdown.dataset.deadline = CONFIG.dateISO;

  function tickCountdown() {
    const iso = rootCountdown.dataset.deadline || CONFIG.dateISO;
    const deadline = new Date(iso).getTime();
    const now = Date.now();
    let diff = Math.max(0, deadline - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= d * (1000 * 60 * 60 * 24);
    const h = Math.floor(diff / (1000 * 60 * 60));
    diff -= h * (1000 * 60 * 60);
    const m = Math.floor(diff / (1000 * 60));
    diff -= m * (1000 * 60);
    const s = Math.floor(diff / 1000);

    if (dd) dd.textContent = pad2(d);
    if (hh) hh.textContent = pad2(h);
    if (mm) mm.textContent = pad2(m);
    if (ss) ss.textContent = pad2(s);
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);
})();

/* ========= COPY HELPERS ========= */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const t = document.createElement("textarea");
      t.value = text;
      t.style.position = "fixed";
      t.style.left = "-9999px";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
      return true;
    } catch {
      return false;
    }
  }
}

/* ========= TOAST ========= */
function toast(msg = "Listo 🌊✨") {
  let el = $("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role", "status");
    el.style.cssText = `
      position:fixed; left:50%; bottom:18px; transform:translateX(-50%);
      padding:10px 14px; border-radius:999px;
      background:rgba(0,0,0,.55); color:#fff;
      border:1px solid rgba(255,255,255,.22);
      backdrop-filter: blur(10px);
      font: 500 13px/1.1 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      opacity:0; pointer-events:none;
      transition: opacity .25s ease, transform .25s ease;
      z-index:9999;
    `;
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  el.style.transform = "translateX(-50%) translateY(-2px)";
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(0px)";
  }, 1500);
}

/* ========= COPY address + hashtag ========= */
(() => {
  const copyAddrBtn = $("#copyAddrBtn");
  if (copyAddrBtn) {
    copyAddrBtn.addEventListener("click", async () => {
      const ok = await copyText(CONFIG.addressText);
      toast(ok ? "Dirección copiada 📍🌊" : "No se pudo copiar 😕");
    });
  }

  const copyHashtagBtn = $("#copyHashtagBtn");
  if (copyHashtagBtn) {
    copyHashtagBtn.addEventListener("click", async () => {
      const ok = await copyText(CONFIG.hashtag);
      toast(ok ? "Hashtag copiado #️⃣✨" : "No se pudo copiar 😕");
    });
  }
})();

/* ========= .ICS CALENDAR ========= */
(() => {
  function toICSDate(dt) {
    const z = (n) => String(n).padStart(2, "0");
    const y = dt.getUTCFullYear();
    const m = z(dt.getUTCMonth() + 1);
    const d = z(dt.getUTCDate());
    const hh = z(dt.getUTCHours());
    const mm = z(dt.getUTCMinutes());
    const ss = z(dt.getUTCSeconds());
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
  }

  function buildICS() {
    const startLocal = new Date(CONFIG.dateISO);
    const endLocal = new Date(startLocal.getTime() + 5 * 60 * 60 * 1000);

    const uid = `wedding-${Date.now()}@webmic`;
    const dtstamp = toICSDate(new Date());

    // Convertimos a UTC con ISO -> Date -> UTC fields
    const dtstart = toICSDate(new Date(startLocal.toISOString()));
    const dtend = toICSDate(new Date(endLocal.toISOString()));

    const title = `Boda • ${CONFIG.couple}`;
    const desc =
      `¡Nos casamos! 🌊✨\n\n` +
      `Lugar: ${CONFIG.addressText}\n` +
      `Maps: ${CONFIG.mapsLink}\n` +
      `Hashtag: ${CONFIG.hashtag}`;

    const loc = CONFIG.addressText;

    return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//WebMic//Boda Beach-Romance//ES\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
BEGIN:VEVENT\r
UID:${uid}\r
DTSTAMP:${dtstamp}\r
DTSTART:${dtstart}\r
DTEND:${dtend}\r
SUMMARY:${title}\r
DESCRIPTION:${desc.replace(/\n/g, "\\n")}\r
LOCATION:${loc}\r
URL:${CONFIG.mapsLink}\r
END:VEVENT\r
END:VCALENDAR\r`;
  }

  function downloadICS() {
    const data = buildICS();
    const blob = new Blob([data], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Boda-${CONFIG.couple.replace(/\s+/g, "")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  const icsBtn = $("#icsBtn");
  if (icsBtn) {
    icsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadICS();
      toast("Evento agregado al calendario 📅✨");
    });
  }
})();

/* ========= RSVP WHATSAPP + burst ========= */
(() => {
  const rsvpBtn = $("#rsvpBtn");
  if (!rsvpBtn) return;

  function buildMessage() {
    const d = new Date(CONFIG.dateISO);
    const opts = { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" };
    const human = d.toLocaleString("es-AR", opts).replace(",", " •");

    return (
      `Hola! 👋✨\n` +
      `Confirmo asistencia a la boda de ${CONFIG.couple}.\n\n` +
      `🗓️ ${human}\n` +
      `📍 ${CONFIG.addressText}\n` +
      `#️⃣ ${CONFIG.hashtag}\n\n` +
      `Mi nombre es: `
    );
  }

  rsvpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const text = encodeURIComponent(buildMessage());
    const link = `https://wa.me/${CONFIG.whatsappTo}?text=${text}`;
    window.open(link, "_blank", "noopener,noreferrer");

    // burst visual
    burstSparklesAt(rsvpBtn);
  });
})();

/* ========= BEACH FX CANVAS (sparkles + foam) =========
   - Crea un canvas full-screen fixed.
   - Partículas suaves + burbujas/espuma en la parte inferior.
*/
(function beachFX() {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const canvas = document.createElement("canvas");
  canvas.id = "beachFx";
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: .9;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  let w = 0,
    h = 0,
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const rand = (a, b) => a + Math.random() * (b - a);

  // Sparkles (arriba/medio)
  const sparkles = Array.from({ length: 55 }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.6, 1.7),
    a: rand(0.12, 0.55),
    tw: rand(0.008, 0.02),
    vx: rand(-0.06, 0.06),
    vy: rand(-0.03, 0.08),
  }));

  // Foam / bubbles (abajo)
  const foams = Array.from({ length: 32 }, () => ({
    x: rand(0, w),
    y: rand(h * 0.72, h),
    r: rand(8, 26),
    a: rand(0.05, 0.13),
    vx: rand(-0.08, 0.08),
    vy: rand(-0.06, -0.02),
    wob: rand(0, Math.PI * 2),
  }));

  function drawSparkle(s) {
    // pequeño destello en cruz
    ctx.save();
    ctx.globalAlpha = s.a;
    ctx.translate(s.x, s.y);
    ctx.beginPath();
    ctx.arc(0, 0, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    ctx.globalAlpha = s.a * 0.55;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-s.r * 3, 0);
    ctx.lineTo(s.r * 3, 0);
    ctx.moveTo(0, -s.r * 3);
    ctx.lineTo(0, s.r * 3);
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.stroke();
    ctx.restore();
  }

  function drawFoam(f) {
    ctx.save();
    ctx.globalAlpha = f.a;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();
    ctx.restore();
  }

  let t = 0;
  function frame() {
    t += 1;

    ctx.clearRect(0, 0, w, h);

    // Sparkles
    for (const s of sparkles) {
      s.x += s.vx;
      s.y += s.vy;
      s.a += Math.sin(t * s.tw) * 0.0025;

      if (s.x < -20) s.x = w + 20;
      if (s.x > w + 20) s.x = -20;
      if (s.y < -20) s.y = h + 20;
      if (s.y > h + 20) s.y = -20;

      // clamp alpha
      s.a = Math.max(0.08, Math.min(0.65, s.a));
      drawSparkle(s);
    }

    // Foam line subtle at bottom
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(0, h - 70, w, 70);
    ctx.restore();

    for (const f of foams) {
      f.wob += 0.02;
      f.x += f.vx + Math.sin(f.wob) * 0.08;
      f.y += f.vy;

      if (f.y + f.r < h * 0.66) {
        f.y = rand(h * 0.78, h + 20);
        f.x = rand(-10, w + 10);
        f.r = rand(8, 26);
        f.a = rand(0.05, 0.13);
        f.vy = rand(-0.06, -0.02);
      }

      if (f.x < -40) f.x = w + 40;
      if (f.x > w + 40) f.x = -40;

      drawFoam(f);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ========= burst sparkles helper ========= */
function burstSparklesAt(targetEl) {
  const rect = targetEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // creamos mini partículas DOM rápidas (no depende del canvas)
  const n = 18;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: rgba(255,255,255,.95);
      box-shadow: 0 0 12px rgba(255,255,255,.55);
      transform: translate(-50%,-50%);
      pointer-events: none;
      z-index: 9998;
    `;
    document.body.appendChild(p);

    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.25;
    const dist = 34 + Math.random() * 22;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;

    p.animate(
      [
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`, opacity: 0 },
      ],
      { duration: 650 + Math.random() * 220, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
    );

    setTimeout(() => p.remove(), 950);
  }

  toast("¡Confirmación lista! 💬✨");
}
