/* app.js — Boda Minimal Chic (final sin duplicados) */

const CONFIG = {
  couple: { name1: "Camila", name2: "Nicolás", monogram: "C ♥ N" },

  event: {
    iso: "2026-11-14T19:30:00",
    datePretty: "14/11/2026",
    timePretty: "19:30 hs",
  },

  quote: "Elegimos amarnos cada día, y queremos celebrarlo junto a vos.",

  ceremony: {
    time: "18:00 hs",
    address: "Iglesia San Benito, CABA",
    mapsUrl: "https://www.google.com/maps?q=Iglesia+San+Benito,+CABA",
  },

  party: {
    time: "19:30 hs",
    address: "Salón Magnolia, CABA",
    mapsUrl: "https://www.google.com/maps?q=Sal%C3%B3n+Magnolia,+CABA",
  },

  rsvp: {
    whatsappTo: "5491112345678",
  },

  gifts: {
    alias: "BODA.CAMI.NICO",
    cbu: "0000000000000000000000",
    holder: "Camila & Nicolás",
  },

  playlistUrl: "https://open.spotify.com/", // pegá tu link real
};

const SONGS_KEY = "boda_songs_v1";

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function openWhatsapp(phoneIntl, message) {
  const url = `https://wa.me/${phoneIntl}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function formatCountdown(ms) {
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return { days, hours, mins, secs };
}

// ---------- Hydrate ----------
function hydrate() {
  setText("monogram", CONFIG.couple.monogram);
  setText("name1", CONFIG.couple.name1);
  setText("name2", CONFIG.couple.name2);
  setText("signNames", `${CONFIG.couple.name1} & ${CONFIG.couple.name2}`);
  setText("finalNames", `${CONFIG.couple.name1} & ${CONFIG.couple.name2}`);

  setText("quoteText", CONFIG.quote);

  setText("datePretty", CONFIG.event.datePretty);
  setText("timePretty", CONFIG.event.timePretty);

  setText("ceremonyTime", CONFIG.ceremony.time);
  setText("ceremonyAddress", CONFIG.ceremony.address);

  setText("partyTime", CONFIG.party.time);
  setText("partyAddress", CONFIG.party.address);

  const cMap = $("btnCeremonyMap");
  if (cMap) cMap.href = CONFIG.ceremony.mapsUrl;

  const pMap = $("btnPartyMap");
  if (pMap) pMap.href = CONFIG.party.mapsUrl;

  // Gifts
  setText("giftAlias", CONFIG.gifts.alias);
  setText("giftCBU", CONFIG.gifts.cbu);
  setText("giftHolder", CONFIG.gifts.holder);

  const playlist = $("btnPlaylist");
  if (playlist) playlist.href = CONFIG.playlistUrl;
}

// ---------- Countdown ----------
function startCountdown() {
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

// ---------- RSVP ----------
function setupRSVP() {
  const btn = $("btnWhatsapp");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const name = ($("guestName")?.value || "").trim() || "____";
    const attend = $("guestAttend")?.value || "si";
    const msg = ($("guestMsg")?.value || "").trim();

    const attendText = attend === "si" ? "✅ Sí, asisto" : "❌ No podré asistir";

    const lines = [
      `Hola! Soy ${name}.`,
      `Confirmación: ${attendText}`,
      `Evento: Boda ${CONFIG.couple.name1} & ${CONFIG.couple.name2}`,
      `Fecha: ${CONFIG.event.datePretty} - ${CONFIG.event.timePretty}`,
    ];

    if (msg) lines.push(`Mensaje: ${msg}`);

    openWhatsapp(CONFIG.rsvp.whatsappTo, lines.join("\n"));
  });

  const btnSuggest = $("btnSuggestSong");
  if (btnSuggest) {
    btnSuggest.addEventListener("click", () => {
      openWhatsapp(CONFIG.rsvp.whatsappTo, "Hola! Quiero sugerir una canción para la boda 🎶");
    });
  }
}

// ---------- Copy to clipboard ----------
function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

function flashButton(btn, okText = "Copiado ✓") {
  const prev = btn.textContent;
  btn.textContent = okText;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = prev;
    btn.disabled = false;
  }, 1400);
}

function setupGiftsCopy() {
  const btnCopyAlias = $("btnCopyAlias");
  const btnCopyCBU = $("btnCopyCBU");
  const aliasEl = $("giftAlias");
  const cbuEl = $("giftCBU");

  if (btnCopyAlias && aliasEl) {
    btnCopyAlias.addEventListener("click", async () => {
      try {
        await copyToClipboard(aliasEl.textContent.trim());
        flashButton(btnCopyAlias, "Alias copiado ✓");
      } catch {
        alert("No pude copiar. Mantené apretado el texto y copiá manual.");
      }
    });
  }

  if (btnCopyCBU && cbuEl) {
    btnCopyCBU.addEventListener("click", async () => {
      try {
        await copyToClipboard(cbuEl.textContent.trim());
        flashButton(btnCopyCBU, "CBU copiado ✓");
      } catch {
        alert("No pude copiar. Mantené apretado el texto y copiá manual.");
      }
    });
  }
}

// ---------- Songs (localStorage) ----------
function loadSongs() {
  try {
    const raw = localStorage.getItem(SONGS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveSongs(arr) {
  localStorage.setItem(SONGS_KEY, JSON.stringify(arr));
}

function renderSongs() {
  const list = $("songList");
  if (!list) return;

  const songs = loadSongs();
  list.innerHTML = "";

  if (!songs.length) {
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

function setupSongs() {
  const btn = $("songsBtn");
  const input = $("songInput");
  if (!btn || !input) return;

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
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addSong();
  });

  renderSongs();
}

// ---------- Reveal ----------
function startReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

// ---------- Boot ----------
hydrate();
startCountdown();
setupRSVP();
setupGiftsCopy();
setupSongs();
startReveal();
