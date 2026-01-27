/* =========================
   CONFIG • 15 Black & Gold (Art Deco)
========================= */

const MAPS_URL = "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+Buenos+Aires&output=embed";
const MAPS_LINK = "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+Buenos+Aires";

const WHATSAPP_NUMBER = "5491123456789";
const EVENT_DATE_ISO = "2026-08-24T21:30:00-03:00";

const INVITADA = "SOFÍA";
const FECHA_TEXTO = "Sábado 24 de Agosto 2026";
const HORA_TEXTO = "21:30 hs";
const LUGAR_TEXTO = "Salón “Janeos”";
const DIRECCION_TEXTO = "Av. Siempre Viva 742, Buenos Aires";

const DRESSCODE = "Elegante.";
const ALIAS = "sofi.15.mp";
const FRASE = "Una noche dorada, un recuerdo eterno ✨";

const GALLERY = [
    { src: "assets/foto1.jpg", portrait: true },
    { src: "assets/foto2.jpg", portrait: false },
    { src: "assets/foto3.jpg", portrait: false },
    { src: "assets/foto4.jpg", portrait: false },
    { src: "assets/foto5.jpg", portrait: false },
    { src: "assets/foto6.jpg", portrait: false },

];

const $ = (s) => document.querySelector(s);
const pad2 = (n) => String(n).padStart(2, "0");

function waLink() {
    const msg = `Hola! Quiero confirmar mi asistencia a los XV 🖤✨

Nombre:
Cantidad de invitados:
Restricción alimentaria (si aplica):`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function fill() {
    $("#nombre").textContent = INVITADA;
    $("#fechaTxt").textContent = FECHA_TEXTO;
    $("#horaTxt").textContent = HORA_TEXTO;
    $("#lugarTxt").textContent = LUGAR_TEXTO;

    const dressEl = $("#dresscodeTxt");
    if (dressEl) dressEl.textContent = DRESSCODE;

    const aliasEl = $("#aliasTxt");
    if (aliasEl) aliasEl.textContent = ALIAS;

    const fraseEl = $("#fraseTxt");
    if (fraseEl) fraseEl.textContent = FRASE;

    $("#mapFrame").src = MAPS_URL;

    const wa = waLink();
    $("#btnConfirm").href = wa;
    $("#btnConfirm2").href = wa;
    $("#fabConfirm").href = wa;

    $("#btnMaps").href = MAPS_LINK;

    $("#mFecha").textContent = FECHA_TEXTO;
    $("#mHora").textContent = HORA_TEXTO;
    $("#mLugar").textContent = LUGAR_TEXTO;
    $("#mDir").textContent = DIRECCION_TEXTO;
    // título y dirección del map card
const mapTitle = document.querySelector("#mapTitle");
const mapSub = document.querySelector("#mapSub");
if(mapTitle) mapTitle.textContent = LUGAR_TEXTO;
if(mapSub) mapSub.textContent = DIRECCION_TEXTO;

// botones del mapa
const btnMaps2 = document.querySelector("#btnMaps2");
const btnRoute = document.querySelector("#btnRoute");
if(btnMaps2) btnMaps2.href = MAPS_LINK;

// "Cómo llegar" usa Google Maps Directions
if(btnRoute){
  btnRoute.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DIRECCION_TEXTO)}`;
}

}

function renderGallery() {
    const gallery = $("#gallery");
    gallery.innerHTML = GALLERY.map(img => `
    <div class="gitem ${img.portrait ? "is-portrait" : ""}">
      <img src="${img.src}" alt="">
    </div>
  `).join("");
}

function countdown() {
    const target = new Date(EVENT_DATE_ISO).getTime();

    const tick = () => {
        const now = Date.now();
        let diff = Math.max(0, target - now);

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

function modalSetup() {
    const modal = $("#modal");
    const open = () => modal.classList.add("is-open");
    const close = () => modal.classList.remove("is-open");

    $("#btnInfo").addEventListener("click", open);
    $("#modalClose").addEventListener("click", close);
    $("#modalBack").addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}

function musicSetup() {
    const audio = $("#bgMusic");
    const btn = $("#musicBtn");
    const icon = $("#musicIcon");
    let playing = false;

    const play = async () => {
        try {
            await audio.play();
            playing = true;
            icon.textContent = "❚❚";
        } catch {
            playing = false;
            icon.textContent = "▶";
        }
    };

    const pause = () => {
        audio.pause();
        playing = false;
        icon.textContent = "▶";
    };

    btn.addEventListener("click", () => {
        if (playing) pause();
        else play();
    });

    window.addEventListener("pointerdown", () => {
        if (!playing) play();
    }, { once: true });
}

function copyAliasSetup() {
    const btn = $("#copyAlias");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(ALIAS);
            btn.textContent = "¡COPIADO! ✅";
            setTimeout(() => btn.textContent = "COPIAR ALIAS", 1400);
        } catch {
            prompt("Copiá el alias:", ALIAS);
        }
    });
}

/* Init */
fill();
renderGallery();
countdown();
modalSetup();
musicSetup();
copyAliasSetup();
