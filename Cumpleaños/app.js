/* =========================
   Cumple • Disco Night • app.js
   - Menú + progress
   - Reveal
   - Hero typing letras (AgendaLaFecha vibe)
   - Countdown
   - Copy helpers + toast
   - Gallery (no crop)
   - RSVP modal + WhatsApp + confetti
   - ICS
========================= */

const CONFIG = {
  age: "21",
  name: "Juli",
  heroMini: "¡Estás invitado/a!",
  heroLine2: "Let’s party • Noche de boliche y brillos ✨",

  dateISO: "2026-05-16T21:30:00",
  placeShort: "Disco • Palermo",
  placeName: "Disco Skyline",
  addressText: "Av. Example 1234, CABA",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Av.+Example+1234,+CABA",

  whatsappTo: "54911XXXXXXXX",
  hashtag: "#Juli21Night",

  instagramUser: "juli",
  instagramLink: "https://www.instagram.com/",

  playlistLink: "https://open.spotify.com/",

  giftAlias: "juli.night.21",
  giftCbu: "1234567890123456789012",

  gallery: [
    { src:"assets/foto1.jpg", wide:true },
    { src:"assets/foto2.jpg", wide:false },
    { src:"assets/foto3.jpg", wide:false }
  ]
};

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
const pad2 = (n) => String(n).padStart(2,"0");

/* ===== Menu ===== */
(() => {
  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => mobileNav.classList.toggle("show"));
  $$("#mobileNav a").forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("show")));
})();

/* ===== Progress ===== */
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

/* ===== Set Text ===== */
(() => {
  $("#heroMini").textContent = CONFIG.heroMini;
  $("#giftAlias").textContent = CONFIG.giftAlias;
  $("#giftCbu").textContent = CONFIG.giftCbu;

  $("#hashtagText").textContent = CONFIG.hashtag;

  $("#igUser").textContent = CONFIG.instagramUser;
  $("#igBtn").href = CONFIG.instagramLink;

  $("#playlistBtn").href = CONFIG.playlistLink;

  $("#placeShort").textContent = CONFIG.placeShort;
  $("#placeName").textContent = CONFIG.placeName;
  $("#addrText").textContent = CONFIG.addressText;
  $("#mapsBtn").href = CONFIG.mapsLink;

  // Fecha humana + pass
  const d = new Date(CONFIG.dateISO);
  const human = d.toLocaleString("es-AR", { weekday:"long", day:"2-digit", month:"long", hour:"2-digit", minute:"2-digit" }).replace(",", " •");
  $("#dateHuman").textContent = human;

  $("#eventDay").textContent = d.toLocaleDateString("es-AR", { weekday:"long", day:"2-digit", month:"long" });
  $("#eventTime").textContent = "21:30 a 03:30";

  $("#passName").textContent = CONFIG.name;
  $("#passMeta").textContent = d.toLocaleString("es-AR", { weekday:"short", hour:"2-digit", minute:"2-digit" }).replace(",", " • ");
  $("#passCode").textContent = `${CONFIG.name.slice(0,2).toUpperCase()}-${CONFIG.age}`;

  // Countdown deadline
  const cd = $(".countdown");
  if (cd) cd.dataset.deadline = CONFIG.dateISO;
})();

/* ===== HERO typing (letras que aparecen) ===== */
function typeInto(el, text, { speed=28, startDelay=0 } = {}){
  if (!el) return Promise.resolve();
  el.textContent = "";
  return new Promise((resolve) => {
    let i = 0;
    const start = () => {
      const tick = () => {
        el.textContent += text.charAt(i);
        i++;
        if (i < text.length) setTimeout(tick, speed);
        else resolve();
      };
      tick();
    };
    setTimeout(start, startDelay);
  });
}

(() => {
  const ageEl = $("#ageText");
  const line1 = $("#typeLine1");
  const line2 = $("#typeLine2");

  const age = ageEl?.dataset.text || CONFIG.age;
  const t1  = line1?.dataset.text || CONFIG.name;
  const t2  = line2?.dataset.text || CONFIG.heroLine2;

  // Age: aparece “rápido” como conteo
  if (ageEl){
    ageEl.textContent = "";
    let n = 0;
    const target = parseInt(age, 10) || 21;
    const step = Math.max(1, Math.floor(target / 20));
    const run = () => {
      n += step;
      if (n >= target){ ageEl.textContent = String(target); return; }
      ageEl.textContent = String(n);
      requestAnimationFrame(run);
    };
    setTimeout(()=> requestAnimationFrame(run), 150);
  }

  // Letras
  (async () => {
    await typeInto(line1, t1, { speed: 38, startDelay: 220 });
    // sacamos cursor del primer renglón cuando termina
    line1?.classList.add("done");
    await typeInto(line2, t2, { speed: 22, startDelay: 160 });
    line2?.classList.add("done");
  })();
})();

/* ===== Reveal ===== */
(() => {
  const els = $$(".reveal");
  if (!els.length) return;

  els.forEach((el, i) => el.style.transitionDelay = `${Math.min(i * 0.07, 0.45)}s`);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add("in"));
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ===== Countdown ===== */
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

/* ===== Gallery ===== */
(() => {
  const host = $("#miniGallery");
  if (!host) return;

  host.innerHTML = CONFIG.gallery.map(it => `
    <div class="gItem ${it.wide ? "wide" : ""}">
      <img src="${it.src}" alt="" loading="lazy" />
    </div>
  `).join("");
})();

/* ===== Copy + Toast ===== */
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

function toast(msg="Listo ✨"){
  let el = $("#toast");
  if (!el){
    el = document.createElement("div");
    el.id = "toast";
    el.style.cssText = `
      position:fixed; left:50%; bottom:18px; transform:translateX(-50%);
      padding:10px 14px; border-radius:999px;
      background:rgba(0,0,0,.55); color:#fff;
      border:1px solid rgba(255,255,255,.22);
      backdrop-filter: blur(10px);
      font: 900 13px/1.1 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
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

$("#copyAddrBtn")?.addEventListener("click", async () => {
  const ok = await copyText(CONFIG.addressText);
  toast(ok ? "Dirección copiada 📍" : "No se pudo copiar 😕");
});
$("#copyHashtagBtn")?.addEventListener("click", async () => {
  const ok = await copyText(CONFIG.hashtag);
  toast(ok ? "Hashtag copiado #️⃣" : "No se pudo copiar 😕");
});
$("#copyAliasBtn")?.addEventListener("click", async () => {
  const ok = await copyText(CONFIG.giftAlias);
  toast(ok ? "Alias copiado ✅" : "No se pudo copiar 😕");
});
$("#copyCbuBtn")?.addEventListener("click", async () => {
  const ok = await copyText(CONFIG.giftCbu);
  toast(ok ? "CBU copiado ✅" : "No se pudo copiar 😕");
});

/* ===== RSVP Modal + WhatsApp + confetti ===== */
(() => {
  const modal = $("#modal");
  const open = $("#openRsvp");
  const openNo = $("#openNo");
  const closeEls = $$("[data-close]");

  if (!modal || !open) return;

  const show = () => { modal.classList.add("show"); modal.setAttribute("aria-hidden","false"); setTimeout(()=> $("#inpName")?.focus(), 120); };
  const hide = () => { modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); stopConfetti(); };

  open.addEventListener("click", show);
  openNo.addEventListener("click", show);
  closeEls.forEach(el => el.addEventListener("click", hide));
  document.addEventListener("keydown", (e) => e.key === "Escape" && modal.classList.contains("show") && hide());

  const qty = $("#inpQty");
  $("#minus")?.addEventListener("click", () => qty.value = Math.max(1, (parseInt(qty.value || "1", 10) - 1)));
  $("#plus")?.addEventListener("click", () => qty.value = Math.min(10, (parseInt(qty.value || "1", 10) + 1)));

  const fmt = (iso) => {
    const d = new Date(iso);
    const opts = { day:"2-digit", month:"long", hour:"2-digit", minute:"2-digit" };
    return d.toLocaleString("es-AR", opts).replace(",", " •");
  };
  const wa = (text) => window.open(`https://wa.me/${CONFIG.whatsappTo}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");

  const msgYes = (name, n) => (
    `Hola! 👋✨\n` +
    `Confirmo asistencia al cumple de ${CONFIG.name} (${CONFIG.age}).\n\n` +
    `👤 Soy: ${name || "____"}\n` +
    `👥 Somos: ${n} persona(s)\n\n` +
    `🗓️ ${fmt(CONFIG.dateISO)}\n` +
    `📍 ${CONFIG.placeName}\n` +
    `${CONFIG.addressText}\n\n` +
    `¡Nos vemos! ${CONFIG.hashtag}`
  );

  const msgNo = (name) => (
    `Hola! 👋\n` +
    `Gracias por la invitación.\n` +
    `No voy a poder asistir al cumple de ${CONFIG.name} (${CONFIG.age}).\n\n` +
    `Soy: ${name || "____"}`
  );

  $("#sendYes")?.addEventListener("click", () => {
    const name = ($("#inpName")?.value || "").trim();
    const n = parseInt($("#inpQty")?.value || "1", 10) || 1;
    startConfetti();
    toast("¡Genial! Abriendo WhatsApp… ✅");
    setTimeout(()=> wa(msgYes(name, n)), 220);
  });

  $("#sendNo")?.addEventListener("click", () => {
    const name = ($("#inpName")?.value || "").trim();
    toast("Abriendo WhatsApp…");
    setTimeout(()=> wa(msgNo(name)), 120);
  });

  /* confetti canvas */
  const canvas = $("#confetti");
  const ctx = canvas?.getContext("2d");
  let raf = null;
  let parts = [];

  function resizeCanvas(){
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * devicePixelRatio);
    canvas.height = Math.floor(rect.height * devicePixelRatio);
    ctx?.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }

  function makeParts(){
    parts = Array.from({ length: 90 }).map(() => ({
      x: Math.random()*canvas.clientWidth,
      y: -20 - Math.random()*200,
      r: 2 + Math.random()*3,
      vx: -0.8 + Math.random()*1.6,
      vy: 1.4 + Math.random()*2.2,
      a: Math.random()*Math.PI*2,
      va: -0.08 + Math.random()*0.16,
      life: 260 + Math.random()*120,
      t: 0
    }));
  }

  function draw(){
    if (!canvas || !ctx) return;
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);

    parts.forEach(p => {
      p.t++;
      p.x += p.vx; p.y += p.vy; p.a += p.va;

      const alpha = Math.max(0, 1 - (p.t / p.life));
      ctx.save();
      ctx.globalAlpha = alpha * 0.9;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.t % 2 ? "rgba(255,255,255,.95)" : "rgba(215,180,90,.95)";
      ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.8);
      ctx.restore();
    });

    parts = parts.filter(p => p.t < p.life && p.y < canvas.clientHeight + 21);
    if (parts.length) raf = requestAnimationFrame(draw);
  }

  function startConfetti(){
    if (!canvas || !ctx) return;
    resizeCanvas();
    makeParts();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  function stopConfetti(){
    cancelAnimationFrame(raf);
    raf = null;
    parts = [];
    if (ctx) ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
  }

  window.addEventListener("resize", () => modal.classList.contains("show") && resizeCanvas());
})();

/* ===== ICS ===== */
(() => {
  function toICSDate(dt){
    const z = (n)=> String(n).padStart(2,"0");
    return `${dt.getUTCFullYear()}${z(dt.getUTCMonth()+1)}${z(dt.getUTCDate())}T${z(dt.getUTCHours())}${z(dt.getUTCMinutes())}${z(dt.getUTCSeconds())}Z`;
  }

  function buildICS(){
    const startLocal = new Date(CONFIG.dateISO);
    const endLocal = new Date(startLocal.getTime() + 5*60*60*1000);

    const uid = `cumple-${Date.now()}@webmic`;
    const dtstamp = toICSDate(new Date());
    const dtstart = toICSDate(new Date(startLocal.toISOString()));
    const dtend   = toICSDate(new Date(endLocal.toISOString()));

    const title = `Cumple • ${CONFIG.name} (${CONFIG.age})`;
    const desc =
      `¡Cumple! ✨\n\n` +
      `Lugar: ${CONFIG.placeName}\n` +
      `Dirección: ${CONFIG.addressText}\n` +
      `Maps: ${CONFIG.mapsLink}\n` +
      `Hashtag: ${CONFIG.hashtag}`;

    return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//WebMic//CumpleDiscoNight//ES\r
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
    const blob = new Blob([buildICS()], { type:"text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cumple-${CONFIG.name}-${CONFIG.age}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 800);
  }

  $("#icsBtn")?.addEventListener("click", () => {
    downloadICS();
    toast("Agendado 📅");
  });
})();
