const CONFIG = {
  couple: { name1: "Camila", name2: "Nicolás" },

  event: {
    iso: "2026-11-14T19:30:00",
    datePretty: "14/11/2026",
    timePretty: "19:30 hs",
    city: "CABA",
    rsvpDeadline: "01/11/2026",
  },

  quote: "“Elegimos para siempre, y nos encantaría que seas parte de este día tan especial.”",
  dress: "Elegante • Olivo & Lino",

  ceremony: {
    name: "Iglesia San Juan",
    time: "18:30 hs",
    address: "Av. Ejemplo 123, CABA",
    mapsUrl: "https://www.google.com/maps?q=Av.+Ejemplo+123,+CABA",
  },

  party: {
    name: "Salón Magnolia",
    time: "20:00 hs",
    address: "Av. Siempre Viva 742, CABA",
    mapsUrl: "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+CABA",
  },

  rsvp: { whatsappTo: "5491112345678" },

  gifts: {
    alias: "BODA.CAMI.NICO",
    cbu: "0000000000000000000000",
    holder: "Camila Apellido",
  },

  songs: {
    storageKey: "boda_olivo_lino_editorial_songs",
    playlistUrl: "https://open.spotify.com/",
  },

  finalText: "Nos vemos muy pronto 🤍",
};

const $ = (id) => document.getElementById(id);
const setText = (id, t) => { const el = $(id); if (el) el.textContent = t; };
const pad2 = (n) => String(n).padStart(2, "0");

function openWhatsapp(phoneIntl, message){
  const url = `https://wa.me/${phoneIntl}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}
function formatCountdown(ms){
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return { days, hours, mins, secs };
}

function hydrate(){
  setText("name1", CONFIG.couple.name1);
  setText("name2", CONFIG.couple.name2);

  setText("datePretty", CONFIG.event.datePretty);
  setText("timePretty", CONFIG.event.timePretty);
  setText("cityPretty", CONFIG.event.city);
  setText("datePretty2", CONFIG.event.datePretty);
  setText("timePretty2", CONFIG.event.timePretty);

  setText("quoteText", CONFIG.quote);
  setText("signNames", `${CONFIG.couple.name1} & ${CONFIG.couple.name2}`);
  setText("dressText", CONFIG.dress);

  setText("ceremonyName", CONFIG.ceremony.name);
  setText("ceremonyTime", CONFIG.ceremony.time);
  setText("ceremonyAddress", CONFIG.ceremony.address);

  setText("partyName", CONFIG.party.name);
  setText("partyTime", CONFIG.party.time);
  setText("partyAddress", CONFIG.party.address);

  const c = $("btnCeremonyMap"); if (c) c.href = CONFIG.ceremony.mapsUrl;
  const p = $("btnPartyMap"); if (p) p.href = CONFIG.party.mapsUrl;

  setText("rsvpDeadline", CONFIG.event.rsvpDeadline);

  setText("giftAlias", CONFIG.gifts.alias);
  setText("giftCBU", CONFIG.gifts.cbu);
  setText("giftHolder", CONFIG.gifts.holder);

  const pl = $("btnPlaylist"); if (pl) pl.href = CONFIG.songs.playlistUrl;

  setText("finalText", CONFIG.finalText);
  setText("finalNames", `${CONFIG.couple.name1} & ${CONFIG.couple.name2}`);
}

function startCountdown(){
  const target = new Date(CONFIG.event.iso).getTime();
  const tick = () => {
    const diff = target - Date.now();
    const { days, hours, mins, secs } = formatCountdown(diff);
    setText("cdDays", pad2(days));
    setText("cdHours", pad2(hours));
    setText("cdMins", pad2(mins));
    setText("cdSecs", pad2(secs));
  };
  tick();
  setInterval(tick, 1000);
}

function setupRSVP(){
  const btn = $("btnWhatsapp");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const name = ($("guestName")?.value || "").trim();
    const attend = $("guestAttend")?.value || "si";
    const qty = ($("guestQty")?.value || "1").trim();
    const msg = ($("guestMsg")?.value || "").trim();

    const attendText = attend === "si" ? "✅ Sí, asisto" : "❌ No podré asistir";

    const lines = [
      `Hola! Soy ${name || "____"}.`,
      `Confirmación: ${attendText}`,
      `Cantidad: ${qty}`,
      `Boda: ${CONFIG.couple.name1} & ${CONFIG.couple.name2}`,
      `Fecha: ${CONFIG.event.datePretty} • ${CONFIG.event.timePretty}`,
    ];
    if (msg) lines.push(`Mensaje: ${msg}`);

    openWhatsapp(CONFIG.rsvp.whatsappTo, lines.join("\n"));
  });
}

/* Copy */
function copyToClipboard(text){ return navigator.clipboard.writeText(text); }
function flashMini(btn, ok="Copiado ✓"){
  const prev = btn.textContent;
  btn.textContent = ok;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 1300);
}
function setupCopy(){
  const btnA = $("btnCopyAlias");
  const btnC = $("btnCopyCBU");
  const aliasEl = $("giftAlias");
  const cbuEl = $("giftCBU");

  if (btnA && aliasEl){
    btnA.addEventListener("click", async () => {
      try { await copyToClipboard(aliasEl.textContent.trim()); flashMini(btnA, "Alias ✓"); }
      catch { alert("No pude copiar. Copiá manualmente."); }
    });
  }
  if (btnC && cbuEl){
    btnC.addEventListener("click", async () => {
      try { await copyToClipboard(cbuEl.textContent.trim()); flashMini(btnC, "CBU ✓"); }
      catch { alert("No pude copiar. Copiá manualmente."); }
    });
  }
}

/* Songs */
function loadSongs(){
  try{
    const raw = localStorage.getItem(CONFIG.songs.storageKey);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  }catch{ return []; }
}
function saveSongs(arr){ localStorage.setItem(CONFIG.songs.storageKey, JSON.stringify(arr)); }

function renderSongs(){
  const list = $("songList");
  if (!list) return;

  const songs = loadSongs();
  list.innerHTML = "";

  if (!songs.length){
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Sumá una canción que no puede faltar 🎶";
    list.appendChild(li);
    return;
  }

  songs.slice().reverse().forEach((song, idxFromEnd) => {
    const li = document.createElement("li");
    li.className = "songItem";

    const span = document.createElement("span");
    span.textContent = song;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "songDel";
    del.textContent = "Eliminar";

    del.addEventListener("click", () => {
      const current = loadSongs();
      const realIndex = current.length - 1 - idxFromEnd;
      current.splice(realIndex, 1);
      saveSongs(current);
      renderSongs();
    });

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function setupSongs(){
  const input = $("songInput");
  const btn = $("songsBtn");
  const btnWA = $("btnSuggestSong");
  const btnClear = $("btnClearSongs");

  if (input && btn){
    const addSong = () => {
      const val = input.value.trim();
      if (!val) return;
      const songs = loadSongs();
      if (!songs.includes(val)) songs.push(val);
      saveSongs(songs);
      input.value = "";
      renderSongs();
    };
    btn.addEventListener("click", addSong);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") addSong(); });
  }

  if (btnWA){
    btnWA.addEventListener("click", () => {
      const suggested = ($("songInput")?.value || "").trim();
      const base = `Hola! Quiero sugerir una canción para la boda de ${CONFIG.couple.name1} & ${CONFIG.couple.name2} 🎶`;
      const msg = suggested ? `${base}\n\nCanción: ${suggested}` : `${base}\n\nCanción: ____`;
      openWhatsapp(CONFIG.rsvp.whatsappTo, msg);
    });
  }

  if (btnClear){
    btnClear.addEventListener("click", () => { saveSongs([]); renderSongs(); });
  }

  renderSongs();
}

/* Calendar */
function setupCalendar(){
  const btn = $("btnCalendar");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const start = new Date(CONFIG.event.iso);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

    const fmt = (d) => {
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    };

    const title = `Boda ${CONFIG.couple.name1} & ${CONFIG.couple.name2}`;
    const details = `Ceremonia: ${CONFIG.ceremony.name} - ${CONFIG.ceremony.address}\nFiesta: ${CONFIG.party.name} - ${CONFIG.party.address}`;
    const location = CONFIG.party.address;

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(title)}` +
      `&dates=${fmt(start)}/${fmt(end)}` +
      `&details=${encodeURIComponent(details)}` +
      `&location=${encodeURIComponent(location)}`;

    window.open(url, "_blank", "noopener");
  });
}

/* Reveal */
function startReveal(){
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

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

/* Parallax subtle on cards photos */
function setupParallax(){
  const cards = document.querySelectorAll(".parallax");
  if (!cards.length) return;

  const onScroll = () => {
    const y = window.scrollY;
    cards.forEach((c) => {
      const strength = parseFloat(c.dataset.parallax || "0.12");
      const photo = c.querySelector(".spreadCard__photo");
      if (!photo) return;
      const rect = c.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      const offset = (rect.top - window.innerHeight/2) * strength * -0.08;
      photo.style.transform = `translateY(${offset}px)`;
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });
}

/* Boot */
hydrate();
startCountdown();
setupRSVP();
setupCopy();
setupSongs();
setupCalendar();
startReveal();
setupParallax();
