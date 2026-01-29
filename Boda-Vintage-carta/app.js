/* =========================
   BODA • Vintage Carta • app.js
========================= */

/* ========= CONFIG (inventado) ========= */
const CONFIG = {
  couple: "Emilia & Federico",
  letterDate: "Buenos Aires, 12 de Abril de 2026",

  dateISO: "2026-04-25T19:30:00",
  placeName: "Estancia Santa Aurelia",
  addressText: "Km 58, Ruta 8 • Pilar, Buenos Aires",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Km+58+Ruta+8+Pilar+Buenos+Aires",

  hashtag: "#EmiYFedeParaSiempre",
  playlistLink: "https://open.spotify.com/",
  whatsappTo: "54911XXXXXXXX"
};

/* ========= HELPERS ========= */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
const pad2 = (n) => String(n).padStart(2, "0");

/* ========= SET TEXT ========= */
(() => {
  $("#coupleTitle").textContent = CONFIG.couple;
  $("#coupleSign").textContent = CONFIG.couple;
  $("#footerCouple").textContent = CONFIG.couple;

  $("#letterDate").textContent = CONFIG.letterDate;
  $("#hashtagText").textContent = CONFIG.hashtag;

  $("#playlistBtn").href = CONFIG.playlistLink;
  $("#placeName").textContent = CONFIG.placeName;
  $("#addrText").textContent = CONFIG.addressText;
  $("#mapsBtn").href = CONFIG.mapsLink;

  const dateHuman = $("#dateHuman");
  if (dateHuman){
    const d = new Date(CONFIG.dateISO);
    const opts = { weekday:"long", day:"2-digit", month:"long", hour:"2-digit", minute:"2-digit" };
    dateHuman.textContent = d.toLocaleString("es-AR", opts).replace(",", " •");
  }

  const cd = $(".countdown");
  if (cd) cd.dataset.deadline = CONFIG.dateISO;
})();

/* ========= MENU ========= */
(() => {
  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => mobileNav.classList.toggle("show"));
  $$(".mobileNav a", mobileNav).forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("show")));
})();

/* ========= SCROLL PROGRESS ========= */
(() => {
  const bar = $("#progressBar");
  if (!bar) return;

  const onScroll = () => {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    bar.style.width = `${(h.scrollTop / max) * 100}%`;
  };

  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
})();

/* ========= REVEAL (stagger) ========= */
(() => {
  const els = $$(".reveal");
  if (!els.length) return;

  els.forEach((el, i) => el.style.transitionDelay = `${Math.min(i * 0.06, 0.5)}s`);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add("in"));
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ========= ENVELOPE OPEN/CLOSE ========= */
(() => {
  const envelope = $("#envelope");
  const wax = envelope?.querySelector(".wax");
  const openBtn = $("#openLetterBtn");
  const sealNote = $("#sealNote");
  if (!envelope) return;

  const open = () => {
    envelope.classList.add("is-open");
    document.body.classList.add("is-opened"); // corta animaciones
    if (sealNote) sealNote.textContent = "Carta abierta ✨";
  };

  const close = () => {
    envelope.classList.remove("is-open");
    if (sealNote) sealNote.textContent = "Tocá el sello para abrir ✨";
  };

  const toggle = () => {
    const isOpen = envelope.classList.contains("is-open");
    if (isOpen) close();
    else {
      open();
      burstSparklesAt(wax || openBtn);
      toast("Carta abierta ✉✨");
    }
  };

  wax?.addEventListener("click", toggle);
  openBtn?.addEventListener("click", () => {
    open();
    burstSparklesAt(openBtn);
    toast("Carta abierta ✉✨");
  });
})();

/* ========= COUNTDOWN ========= */
(() => {
  const root = $(".countdown");
  if (!root) return;

  const dd = $("#dd"), hh = $("#hh"), mm = $("#mm"), ss = $("#ss");

  function tick(){
    const deadline = new Date(root.dataset.deadline || CONFIG.dateISO).getTime();
    const now = Date.now();
    let diff = Math.max(0, deadline - now);

    const d = Math.floor(diff / (1000*60*60*24));
    diff -= d * (1000*60*60*24);
    const h = Math.floor(diff / (1000*60*60));
    diff -= h * (1000*60*60);
    const m = Math.floor(diff / (1000*60));
    diff -= m * (1000*60);
    const s = Math.floor(diff / 1000);

    dd.textContent = pad2(d);
    hh.textContent = pad2(h);
    mm.textContent = pad2(m);
    ss.textContent = pad2(s);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ========= COPY HELPERS ========= */
async function copyText(text){
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    try{
      const t = document.createElement("textarea");
      t.value = text;
      t.style.position = "fixed";
      t.style.left = "-9999px";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
      return true;
    } catch { return false; }
  }
}

/* ========= TOAST ========= */
function toast(msg="Listo ✨"){
  let el = $("#toast");
  if (!el){
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role","status");
    el.style.cssText = `
      position:fixed; left:50%; bottom:18px; transform:translateX(-50%);
      padding:10px 14px; border-radius:999px;
      background:rgba(0,0,0,.55); color:#fff;
      border:1px solid rgba(255,255,255,.22);
      backdrop-filter: blur(10px);
      font: 700 13px/1.1 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
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
  $("#copyAddrBtn")?.addEventListener("click", async () => {
    const ok = await copyText(CONFIG.addressText);
    toast(ok ? "Dirección copiada 📍" : "No se pudo copiar 😕");
  });

  $("#copyHashtagBtn")?.addEventListener("click", async () => {
    const ok = await copyText(CONFIG.hashtag);
    toast(ok ? "Hashtag copiado #️⃣" : "No se pudo copiar 😕");
  });
})();

/* ========= .ICS CALENDAR ========= */
(() => {
  function toICSDate(dt){
    const z = (n)=> String(n).padStart(2,"0");
    return `${dt.getUTCFullYear()}${z(dt.getUTCMonth()+1)}${z(dt.getUTCDate())}T${z(dt.getUTCHours())}${z(dt.getUTCMinutes())}${z(dt.getUTCSeconds())}Z`;
  }

  function buildICS(){
    const startLocal = new Date(CONFIG.dateISO);
    const endLocal = new Date(startLocal.getTime() + 6*60*60*1000);

    const uid = `wedding-${Date.now()}@webmic`;
    const dtstamp = toICSDate(new Date());
    const dtstart = toICSDate(new Date(startLocal.toISOString()));
    const dtend   = toICSDate(new Date(endLocal.toISOString()));

    const title = `Boda • ${CONFIG.couple}`;
    const desc =
      `¡Nos casamos! ✉✨\n\n` +
      `Lugar: ${CONFIG.placeName}\n` +
      `Dirección: ${CONFIG.addressText}\n` +
      `Maps: ${CONFIG.mapsLink}\n` +
      `Hashtag: ${CONFIG.hashtag}`;

    return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//WebMic//VintageCarta//ES\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
BEGIN:VEVENT\r
UID:${uid}\r
DTSTAMP:${dtstamp}\r
DTSTART:${dtstart}\r
DTEND:${dtend}\r
SUMMARY:${title}\r
DESCRIPTION:${desc.replace(/\n/g,"\\n")}\r
LOCATION:${CONFIG.addressText}\r
URL:${CONFIG.mapsLink}\r
END:VEVENT\r
END:VCALENDAR\r`;
  }

  function downloadICS(){
    const data = buildICS();
    const blob = new Blob([data], { type:"text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Boda-${CONFIG.couple.replace(/\s+/g,"")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(()=> URL.revokeObjectURL(url), 800);
  }

  $("#icsBtn")?.addEventListener("click", () => {
    downloadICS();
    toast("Evento agendado 📅");
    burstSparklesAt($("#icsBtn"));
  });
})();

/* ========= RSVP WHATSAPP ========= */
(() => {
  const fmt = (iso) => {
    const d = new Date(iso);
    const opts = { day:"2-digit", month:"long", hour:"2-digit", minute:"2-digit" };
    return d.toLocaleString("es-AR", opts).replace(",", " •");
  };

  function msgYes(){
    return (
      `Hola! 👋✨\n` +
      `Confirmo asistencia a la boda de ${CONFIG.couple}.\n\n` +
      `🗓️ ${fmt(CONFIG.dateISO)}\n` +
      `📍 ${CONFIG.placeName}\n` +
      `${CONFIG.addressText}\n\n` +
      `#️⃣ ${CONFIG.hashtag}\n\n` +
      `Mi nombre es:\n` +
      `Somos ___ personas.\n` +
      `Aclaración (alergias / veggie / etc): `
    );
  }

  function msgNo(){
    return (
      `Hola! 👋\n` +
      `Gracias por la invitación.\n` +
      `Lamentablemente no voy a poder asistir a la boda de ${CONFIG.couple}.\n\n` +
      `Mi nombre es: `
    );
  }

  function openWA(text, anchorEl){
    const link = `https://wa.me/${CONFIG.whatsappTo}?text=${encodeURIComponent(text)}`;
    window.open(link, "_blank", "noopener,noreferrer");
    burstSparklesAt(anchorEl);
  }

  $("#rsvpBtn")?.addEventListener("click", () => openWA(msgYes(), $("#rsvpBtn")));
  $("#rsvpNoBtn")?.addEventListener("click", () => openWA(msgNo(), $("#rsvpNoBtn")));
})();

/* ========= Dust particles canvas ========= */
(function dustFX(){
  const c = $("#dustFx");
  if (!c) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const ctx = c.getContext("2d", { alpha:true });
  let w=0, h=0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize(){
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener("resize", resize, { passive:true });
  resize();

  const rand = (a,b)=> a + Math.random()*(b-a);

  const parts = Array.from({length: 70}, ()=>({
    x: rand(0,w),
    y: rand(0,h),
    r: rand(0.6, 2.2),
    a: rand(0.04, 0.16),
    vx: rand(-0.03, 0.03),
    vy: rand(-0.02, 0.05),
    tw: rand(0.007, 0.02),
  }));

  let t=0;
  function frame(){
    t += 1;
    ctx.clearRect(0,0,w,h);

    for (const p of parts){
      p.x += p.vx;
      p.y += p.vy;
      p.a += Math.sin(t * p.tw) * 0.0015;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -30) p.y = h + 30;
      if (p.y > h + 30) p.y = -30;

      p.a = Math.max(0.02, Math.min(0.18, p.a));

      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = "rgba(246,239,227,1)";
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ========= burst sparkles helper ========= */
function burstSparklesAt(targetEl){
  if (!targetEl) return;

  const rect = targetEl.getBoundingClientRect();
  const x = rect.left + rect.width/2;
  const y = rect.top + rect.height/2;

  const n = 16;
  for (let i=0;i<n;i++){
    const p = document.createElement("i");
    p.style.cssText = `
      position: fixed;
      left:${x}px; top:${y}px;
      width:6px; height:6px;
      border-radius:999px;
      background: rgba(246,239,227,.95);
      box-shadow: 0 0 14px rgba(123,30,35,.45);
      transform: translate(-50%,-50%);
      pointer-events:none;
      z-index:9998;
    `;
    document.body.appendChild(p);

    const ang = (Math.PI*2*i)/n + Math.random()*0.2;
    const dist = 30 + Math.random()*18;
    const dx = Math.cos(ang)*dist;
    const dy = Math.sin(ang)*dist;

    p.animate(
      [
        { transform:"translate(-50%,-50%) scale(1)", opacity:1 },
        { transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.2)`, opacity:0 }
      ],
      { duration: 650 + Math.random()*220, easing:"cubic-bezier(.2,.8,.2,1)", fill:"forwards" }
    );

    setTimeout(()=> p.remove(), 950);
  }

  toast("Listo ✨");
}
