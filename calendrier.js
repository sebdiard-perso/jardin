let currentMonth = new Date().getMonth();
let currentFilter = "all";
let currentRegion = localStorage.getItem("jardin-region") || "oceanique";

function getActivities(plante, month) {
  const d = REGIONS[currentRegion].decalage;
  const acts = [];
  if (shiftMonths(plante.semisInterieur, d).includes(month)) acts.push("semis-interieur");
  if (shiftMonths(plante.semisExterieur, d).includes(month)) acts.push("semis-exterieur");
  if (shiftMonths(plante.plantation, d).includes(month)) acts.push("plantation");
  if (shiftMonths(plante.recolte, d).includes(month)) acts.push("recolte");
  return acts;
}

function renderCalendrier() {
  const list = document.getElementById("plant-list");
  const results = plantes
    .map(p => ({ plante: p, activities: getActivities(p, currentMonth) }))
    .filter(({ activities }) => activities.length > 0)
    .filter(({ activities }) => currentFilter === "all" || activities.includes(currentFilter));

  if (!results.length) {
    list.innerHTML = '<div class="empty-state">🌙 Rien à faire ce mois-ci pour ce filtre</div>';
    return;
  }

  // Grouper par famille
  const parFamille = {};
  for (const r of results) {
    const f = r.plante.famille;
    if (!parFamille[f]) parFamille[f] = [];
    parFamille[f].push(r);
  }

  list.innerHTML = Object.entries(parFamille).map(([famille, items]) => `
    <div class="famille-group">
      <div class="famille-header">${famille}</div>
      ${items.map(({ plante, activities }) => `
        <article class="plant-card">
          <h3><span class="emoji">${plante.emoji}</span>${plante.nom}</h3>
          ${plante.variete ? `<p class="variete">${plante.variete}</p>` : ''}
          <div class="tags">
            ${activities.map(a => `<span class="tag ${a}">${TAGS[a].label}</span>`).join("")}
            <span class="tag soleil">${soleilLabel(plante.soleil)}${plante.soleil.tolereChaleur ? '' : ' 🛡️'}</span>
          </div>
          <p class="conseil">${plante.conseil}</p>
        </article>
      `).join("")}
    </div>
  `).join("");
}

function initCalendrier() {
  document.getElementById("month-nav").addEventListener("click", e => {
    if (!e.target.classList.contains("month-btn")) return;
    document.querySelector(".month-btn.active").classList.remove("active");
    e.target.classList.add("active");
    currentMonth = parseInt(e.target.dataset.month);
    renderCalendrier();
  });

  document.getElementById("filters").addEventListener("click", e => {
    if (!e.target.classList.contains("filter-btn")) return;
    document.querySelector(".filter-btn.active").classList.remove("active");
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    renderCalendrier();
  });

  const regionSelect = document.getElementById("region");
  regionSelect.value = currentRegion;
  regionSelect.addEventListener("change", e => {
    currentRegion = e.target.value;
    localStorage.setItem("jardin-region", currentRegion);
    renderCalendrier();
  });

  document.querySelector(`.month-btn[data-month="${currentMonth}"]`).click();
}
