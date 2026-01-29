/* =========================
   BODA • Civil + Fiesta • app.js
   - Elegant romantic animations
   - Reveal + stagger
   - Parallax hero
   - Scroll progress
   - Countdown (fiesta)
   - Copy address + copy hashtag
   - .ICS calendar (civil + fiesta)
   - RSVP WhatsApp (civil/fiesta/ambos) + burst
   - Subtle sparkles canvas
========================= */

/* ========= CONFIG ========= */
const CONFIG = {
  couple: "Valentina & Julián",

  // Civil
  civil: {
    dateISO: "2026-10-17T16:00:00",
    placeShort: "Registro Civil",
    placeName: "Registro Civil de Recoleta",
    addressText: "Av. Las Heras 2045, CABA",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Av.+Las+Heras+2045,+CABA",
  },

  // Fiesta
  fiesta: {
    dateISO: "2026-10-17T20:30:00",
    placeShort: "Fiesta",
    placeName: "Palais Rouge",
    addressText: "Jerónimo Salguero 1441, CABA",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Jer%C3%B3nimo+Salguero+1441,+CABA",
  },

  hashtag: "#ValeYJuli2026",
  playlistLink: "https://open.spotify.com/",
  whatsappTo: "54911XXXXXXXX", // ej: 5491122334455
};

/* ========= HELPERS ========= */
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));
const pad2 = (n) => String(n).padStart(2, "0");

/* ========= SET TEXT ========= */
(() => {
  const coupleTitle = $("#coupleTitle");
  if (coupleTitle) coupleTitle.textContent = CONFIG.couple;

  const coupleSmall = $("#coupleSmall");
  if (coupleSmall) coupleSmall.textContent = CONFIG.couple;

  const hashtagText = $("#hashtagText");
  if (hashtagText) hashtagText.textContent = CONFIG.hashtag;

  const playlistBtn = $("#playlistBtn");
  if (playlistBtn) playlistBtn.href = CONFIG.playlistLink;

  // Fiesta main address + maps
  const addrText = $("#addrText");
  if (addrText) addrText.textContent = CONFIG.fiesta.addressText;

  const mapsBtn = $("#mapsBtn");
  if (mapsBtn) mapsBtn.href = CONFIG.fiesta.mapsLink;

  // Civil address + maps
  const civilAddrText = $("#civilAddrText");
  if (civilAddrText) civilAddrText.textContent = CONFIG.civil.addressText;

  const civilMapsBtn = $("#civilMapsBtn");
  if (civilMapsBtn) civilMapsBtn.href = CONFIG.civil.mapsLink;

  // Places
  const civilPlace = $("#civilPlace");
  if (civilPlace) civilPlace.textContent = CONFIG.civil.placeName;

  const fiestaPlace = $("#fiestaPlace");
  if (fiestaPlace) fiestaPlace.textContent = CONFIG.fiesta.placeName;

  // Human dates
  const opts = { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" };

  const dFiesta = new Date(CONFIG.fiesta.dateISO);
  const dCivil = new Date(CONFIG.civil.dateISO);

  const fiestaHuman = $("#fiestaHuman");
  if (fiestaHuman) fiestaHuman.textContent = dFiesta.toLocaleString("es-AR", opts).replace(",", " •");

  const civilHuman = $("#civilHuman");
  if (civilHuman) civilHuman.textContent = dCivil.toLocaleString("es-AR", opts).replace(",", " •");

  const dateHuman = $("#dateHuman");
  if (dateHuman) dateHuman.textContent = dFiesta.toLocaleString("es-AR", opts).replace(",", " •");

  const badgeDate = $("#badgeDate");
  if (badgeDate) {
    const z = (n) => String(n).padStart(2, "0");
    badgeDate.textContent = `${z(dFiesta.getDate())} • ${z(dFiesta.getMonth() + 1)} • ${dFiesta.getFullYear()}`;
  }

  // Countdown deadline = Fiesta
  const cdRoot = $(".countdown");
  if (cdRoot) cdRoot.dataset.deadline = CONFIG.fiesta.dateISO;
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

  els.forEach((el, i) => (el.style.transitionDelay = `${Math.min(i * 0.05, 0.45)}s`));

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
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
  const root = $(".countdown");
  if (!root) return;

  const dd = $("#dd"),
    hh = $("#hh"),
    mm = $("#mm"),
    ss = $("#ss");

  function tick() {
    const deadline = new Date(root.dataset.deadline || CONFIG.fiesta.dateISO).getTime();
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

  tick();
  setInterval(tick, 1000);
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
function toast(msg = "Listo ✨") {
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
      font: 600 13px/1.1 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
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

/* ========= COPY buttons ========= */
(() => {
  const copyFiesta = $("#copyAddrBtn");
  if (copyFiesta) {
    copyFiesta.addEventListener("click", async () => {
      const ok = await copyText(CONFIG.fiesta.addressText);
      toast(ok ? "Dirección de Fiesta copiada 📍" : "No se pudo copiar 😕");
    });
  }

  const copyCivil = $("#civilCopyAddrBtn");
  if (copyCivil) {
    copyCivil.addEventListener("click", async () => {
      const ok = await copyText(CONFIG.civil.addressText);
      toast(ok ? "Dirección del Civil copiada 📍" : "No se pudo copiar 😕");
    });
  }

  const copyHashtagBtn = $("#copyHashtagBtn");
  if (copyHashtagBtn) {
    copyHashtagBtn.addEventListener("click", async () => {
      const ok = await copyText(CONFIG.hashtag);
      toast(ok ? "Hashtag copiado #️⃣" : "No se pudo copiar 😕");
    });
  }
})();

/* ========= .ICS CALENDAR (Civil + Fiesta) ========= */
(() => {
  const toICSDate = (dt) => {
    const z = (n) => String(n).padStart(2, "0");
    return `${dt.getUTCFullYear()}${z(dt.getUTCMonth() + 1)}${z(dt.getUTCDate())}T${z(dt.getUTCHours())}${z(
      dt.getUTCMinutes()
    )}${z(dt.getUTCSeconds())}Z`;
  };

  function buildICS({ title, startISO, durationHours = 4, location, url, description }) {
    const startLocal = new Date(startISO);
    const endLocal = new Date(startLocal.getTime() + durationHours * 60 * 60 * 1000);

    const uid = `event-${Date.now()}@webmic`;
    const dtstamp = toICSDate(new Date());

    const dtstart = toICSDate(new Date(startLocal.toISOString()));
    const dtend = toICSDate(new Date(endLocal.toISOString()));

    const descSafe = (description || "").replace(/\n/g, "\\n");

    return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//WebMic//Civil+Fiesta//ES\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
BEGIN:VEVENT\r
UID:${uid}\r
DTSTAMP:${dtstamp}\r
DTSTART:${dtstart}\r
DTEND:${dtend}\r
SUMMARY:${title}\r
DESCRIPTION:${descSafe}\r
LOCATION:${location}\r
URL:${url}\r
END:VEVENT\r
END:VCALENDAR\r`;
  }

  function downloadICS(filename, data) {
    const blob = new Blob([data], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  const civilIcsBtn = $("#civilIcsBtn");
  if (civilIcsBtn) {
    civilIcsBtn.addEventListener("click", () => {
      const data = buildICS({
        title: `Civil • ${CONFIG.couple}`,
        startISO: CONFIG.civil.dateISO,
        durationHours: 2,
        location: CONFIG.civil.addressText,
        url: CONFIG.civil.mapsLink,
        description:
          `Civil de ${CONFIG.couple}\n\nLugar: ${CONFIG.civil.placeName}\nDirección: ${CONFIG.civil.addressText}\nMaps: ${CONFIG.civil.mapsLink}\nHashtag: ${CONFIG.hashtag}`,
      });
      downloadICS(`Civil-${CONFIG.couple.replace(/\s+/g, "")}.ics`, data);
      toast("Civil agendado 📅");
    });
  }

  const fiestaIcsBtn = $("#fiestaIcsBtn");
  if (fiestaIcsBtn) {
    fiestaIcsBtn.addEventListener("click", () => {
      const data = buildICS({
        title: `Fiesta • ${CONFIG.couple}`,
        startISO: CONFIG.fiesta.dateISO,
        durationHours: 6,
        location: CONFIG.fiesta.addressText,
        url: CONFIG.fiesta.mapsLink,
        description:
          `Fiesta de ${CONFIG.couple}\n\nLugar: ${CONFIG.fiesta.placeName}\nDirección: ${CONFIG.fiesta.addressText}\nMaps: ${CONFIG.fiesta.mapsLink}\nHashtag: ${CONFIG.hashtag}`,
      });
      downloadICS(`Fiesta-${CONFIG.couple.replace(/\s+/g, "")}.ics`, data);
      toast("Fiesta agendada 📅✨");
    });
  }
})();

/* ========= RSVP WHATSAPP ========= */
(() => {
  const bothBtn = $("#rsvpBothBtn");
  const civilBtn = $("#rsvpCivilBtn");
  const fiestaBtn = $("#rsvpFiestaBtn");

  const fmt = (iso) => {
    const d = new Date(iso);
    const opts = { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" };
    return d.toLocaleString("es-AR", opts).replace(",", " •");
  };

  function buildMessage(which) {
    const civilLine = `💍 Civil: ${fmt(CONFIG.civil.dateISO)}\n📍 ${CONFIG.civil.placeName}\n${CONFIG.civil.addressText}\n`;
    const fiestaLine = `🥂 Fiesta: ${fmt(CONFIG.fiesta.dateISO)}\n📍 ${CONFIG.fiesta.placeName}\n${CONFIG.fiesta.addressText}\n`;

    let chosen = "";
    if (which === "civil") chosen = `✔ Confirmo: CIVIL\n\n${civilLine}`;
    if (which === "fiesta") chosen = `✔ Confirmo: FIESTA\n\n${fiestaLine}`;
    if (which === "ambos") chosen = `✔ Confirmo: CIVIL + FIESTA\n\n${civilLine}\n${fiestaLine}`;

    return (
      `Hola! 👋✨\n` +
      `Confirmo asistencia a la boda de ${CONFIG.couple}.\n\n` +
      `${chosen}\n` +
      `#️⃣ ${CONFIG.hashtag}\n\n` +
      `Mi nombre es:\n` +
      `Somos ___ personas.\n` +
      `Aclaración (si aplica): `
    );
  }

  function goWA(which, anchorEl) {
    const text = encodeURIComponent(buildMessage(which));
    const link = `https://wa.me/${CONFIG.whatsappTo}?text=${text}`;
    window.open(link, "_blank", "noopener,noreferrer");
    burstSparklesAt(anchorEl);
  }

  if (bothBtn) bothBtn.addEventListener("click", () => goWA("ambos", bothBtn));
  if (civilBtn) civilBtn.addEventListener("click", () => goWA("civil", civilBtn));
  if (fiestaBtn) fiestaBtn.addEventListener("click", () => goWA("fiesta", fiestaBtn));
})();

/* ========= Subtle sparkles canvas ========= */
(function sparklesFX() {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const canvas = document.createElement("canvas");
  canvas.id = "sparklesFx";
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: .65;
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

  const parts = Array.from({ length: 60 }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.6, 1.6),
    a: rand(0.06, 0.22),
    tw: rand(0.008, 0.02),
    vx: rand(-0.05, 0.05),
    vy: rand(0.01, 0.07),
  }));

  function drawStar(p) {
    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.translate(p.x, p.y);

    ctx.beginPath();
    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(245,241,235,1)";
    ctx.fill();

    ctx.globalAlpha = p.a * 0.55;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-p.r * 3, 0);
    ctx.lineTo(p.r * 3, 0);
    ctx.moveTo(0, -p.r * 3);
    ctx.lineTo(0, p.r * 3);
    ctx.strokeStyle = "rgba(214,195,163,1)";
    ctx.stroke();

    ctx.restore();
  }

  let t = 0;
  function frame() {
    t += 1;
    ctx.clearRect(0, 0, w, h);

    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.a += Math.sin(t * p.tw) * 0.002;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y > h + 30) p.y = -30;

      p.a = Math.max(0.04, Math.min(0.25, p.a));
      drawStar(p);
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

/* ========= burst sparkles helper ========= */
function burstSparklesAt(targetEl) {
  if (!targetEl) return;

  const rect = targetEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

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
      background: rgba(245,241,235,.95);
      box-shadow: 0 0 14px rgba(214,195,163,.55);
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
