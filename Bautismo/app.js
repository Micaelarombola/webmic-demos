const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const btn = document.getElementById("openInvite");

/* ===== ABRIR INVITACIÓN ===== */
btn.addEventListener("click",()=>{
  cover.style.opacity = 0;
  setTimeout(()=>{
    cover.style.display = "none";
    invitation.classList.add("active");
  },700);
});

/* ===== PALOMAS GLOBALES (SIEMPRE ACTIVAS) ===== */
const dovesGlobal = document.querySelector(".doves-global");

const types = ["fly-diag","fly-up","fly-side"];
const TOTAL_DOVES = 70; // 👈 cantidad (subí o bajá acá)

for(let i=0;i<TOTAL_DOVES;i++){
  const d = document.createElement("div");
  d.className = "dove " + types[Math.floor(Math.random()*types.length)];
  d.innerText = "🕊️";

  d.style.left = Math.random()*100 + "%";
  d.style.top  = Math.random()*100 + "%";
  d.style.fontSize = (18 + Math.random()*18) + "px";
  d.style.animationDuration = (18 + Math.random()*30) + "s";
  d.style.animationDelay = Math.random()*20 + "s";

  dovesGlobal.appendChild(d);
}


/* ===== COUNTDOWN (ARREGLADO) ===== */
const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");

const target = new Date("2026-04-20T11:30:00").getTime();

setInterval(()=>{
  const now = Date.now();
  const diff = target - now;
  if(diff <= 0) return;

  dEl.innerText = Math.floor(diff / 86400000);
  hEl.innerText = Math.floor(diff / 3600000) % 24;
  mEl.innerText = Math.floor(diff / 60000) % 60;
  sEl.innerText = Math.floor(diff / 1000) % 60;
},1000);

/* ===== PARTÍCULAS DE LUZ ===== */
for(let i=0;i<24;i++){
  const l = document.createElement("div");
  l.className = "light-dot";
  l.style.left = Math.random()*100 + "%";
  l.style.animationDuration = (20 + Math.random()*25) + "s";
  l.style.animationDelay = Math.random()*12 + "s";
  document.body.appendChild(l);
}
btn.addEventListener("click",()=>{
  cover.style.opacity = 0;
  setTimeout(()=>{
    cover.style.display = "none";
    requestAnimationFrame(()=>{
      invitation.classList.add("active");
    });
  },600);
});
for(let i=0;i<12;i++){
  const f = document.createElement("div");
  f.innerText = "✝️";
  f.style.position="fixed";
  f.style.left=Math.random()*100+"%";
  f.style.top=Math.random()*100+"%";
  f.style.opacity=".12";
  f.style.animation="flyUp 40s linear infinite";
  document.body.appendChild(f);
}
/* ===== REVEAL GALERÍA ===== */
/* ===== REVEAL GALERÍA GRANDE ===== */
const gallery = document.querySelector(".gallery");

if(gallery){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        gallery.classList.add("visible");
        io.disconnect();
      }
    });
  },{threshold:0.2});

  io.observe(gallery);
}
