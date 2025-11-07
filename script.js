// ============================
// 0) AYARLAR
const WHATSAPP_NUMBER = "905060310303"; // + işareti YOK

// ÖRNEK portföy (bana ilanlarını yolladığında burayı doldururum)
const PORTFOLIO = [
  {
    title: "Mareşal Fevzi Çakmak — 500 m² Arsa",
    location: "Afyonkarahisar Merkez",
    size: "500 m²",
    price: "2.000.000 TL",
    status: "available", // "available" (Satılık) | "sold" (Satıldı)
    image: "https://via.placeholder.com/800x500?text=Arsa+1",
    link: "",
    description: "İmarlı, ana yola yakın, yatırım için uygun."
  },
  {
    title: "Bayraktepe — 350 m²",
    location: "Afyonkarahisar Bayraktepe",
    size: "350 m²",
    price: "1.400.000 TL",
    status: "sold",
    image: "https://via.placeholder.com/800x500?text=Arsa+2",
    link: "",
    description: "Yeni yerleşim bölgesi, önü açık manzara."
  },
  {
    title: "Çevreyolu — 800 m² Arsa",
    location: "Afyonkarahisar Çevreyolu",
    size: "800 m²",
    price: "1.050.000 TL",
    status: "available",
    image: "https://via.placeholder.com/800x500?text=Arsa+3",
    link: "",
    description: "Ana yola 50 m, ticari kullanım için uygun."
  }
];

// ============================
// 1) DOM
const grid         = document.getElementById("grid");
const statusFilter = document.getElementById("statusFilter");
const searchInput  = document.getElementById("searchInput");
const yearSpan     = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ============================
// 2) Yardımcılar
const normalize = (s) => (s || "").toString().trim();
const lower     = (s) => normalize(s).toLowerCase();

// Türkçe karakterleri aramada esnetmek için: çğışöü → cgisou
function trToLatin(str){
  return lower(str)
    .replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i")
    .replace(/ş/g,"s").replace(/ö/g,"o").replace(/ü/g,"u");
}

function waLinkFor(item){
  const text = encodeURIComponent(`Merhaba Onur Bey, "${item.title}" ilanı hakkında bilgi almak istiyorum.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Debounce: yazarken performanslı arama
function debounce(fn, delay=200){
  let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), delay); };
}

// ============================
// 3) Render
function renderGrid(items){
  grid.innerHTML = "";
  if (!items || items.length === 0){
    grid.innerHTML = `<p>Şu an listelenecek ilan bulunamadı.</p>`;
    return;
  }

  items.forEach(item => {
    const soldBadge = item.status === "sold" ? `<span class="badge-sold">SATILDI</span>` : "";
    const waBtn = `<a class="btn btn-wa" href="${waLinkFor(item)}" target="_blank" rel="noopener">WhatsApp’tan Bilgi Al</a>`;
    const sbBtn = item.link ? `<a class="btn btn-outline" href="${item.link}" target="_blank" rel="noopener">Sahibinden’de Gör</a>` : "";

    const card = document.createElement("div");
    card.className = "portfoy";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title} görseli" loading="lazy">
      <h3>${item.title} ${soldBadge}</h3>
      <p>${item.location} • ${item.size}</p>
      <p class="price">Fiyat: ${item.price}</p>
      <p>${item.description || ""}</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px">
        ${waBtn}
        ${sbBtn}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ============================
// 4) Filtre + Arama
function applyFilters(){
  const statusVal = (statusFilter && statusFilter.value) || "all";
  const q = trToLatin(searchInput && searchInput.value);

  let items = PORTFOLIO.slice();

  if (statusVal !== "all"){
    items = items.filter(it => it.status === statusVal);
  }
  if (q){
    items = items.filter(it => {
      const hay = trToLatin(`${it.title} ${it.location} ${it.description} ${it.price} ${it.size}`);
      return hay.includes(q);
    });
  }
  renderGrid(items);
}

const debouncedApply = debounce(applyFilters, 220);
if (statusFilter) statusFilter.addEventListener("change", applyFilters);
if (searchInput)  searchInput.addEventListener("input", debouncedApply);

// İlk yükleme
applyFilters();
