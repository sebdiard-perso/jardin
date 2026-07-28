let currentMonth = new Date().getMonth();
let currentFilter = "all";
let currentRegion = localStorage.getItem("jardin-region") || "oceanique";
let currentDepartement = localStorage.getItem("jardin-departement") || "";

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
  const cultureResults = plantes
    .map(p => ({ plante: p, activities: getActivities(p, currentMonth) }))
    .filter(({ activities }) => activities.length > 0)
    .filter(({ activities }) => currentFilter === "all" || activities.includes(currentFilter));
  const d = REGIONS[currentRegion].decalage;
  const solResults = TACHES_SOL_VIVANT
    .filter(tache => shiftMonths(tache.mois, d).includes(currentMonth))
    .filter(tache => currentFilter === "all" || tache.categorie === currentFilter);

  if (!solResults.length && !cultureResults.length) {
    list.innerHTML = '<div class="empty-state">🌙 Rien à faire ce mois-ci pour ce filtre</div>';
    return;
  }

  const tachesSol = solResults.length ? `
    <section class="calendar-section">
      <h2 class="calendar-title">🌱 Gestes pour un sol vivant</h2>
      ${currentFilter === "all" || currentFilter === "matiere-organique" ? `<aside class="soil-fact"><strong>💧 Repère MSV</strong><span>+1 % de matière organique = jusqu'à 273 L d'eau stockés par hectare.</span></aside>` : ""}
      <div class="sol-task-list">
        ${solResults.map(tache => `
          <article class="sol-task-card ${tache.categorie}">
            <div class="sol-task-icon">${tache.emoji}</div>
            <div><h3>${tache.titre}</h3><span class="sol-category">${CATEGORIES_SOL_VIVANT[tache.categorie].label}</span><p>${tache.conseil}</p></div>
          </article>
        `).join("")}
      </div>
    </section>` : "";

  if (currentFilter !== "all") {
    list.innerHTML = tachesSol || '<div class="empty-state">🌙 Rien à faire ce mois-ci pour ce filtre</div>';
    return;
  }

  // Grouper par famille
  const parFamille = {};
  for (const r of cultureResults) {
    const f = r.plante.famille;
    if (!parFamille[f]) parFamille[f] = [];
    parFamille[f].push(r);
  }

  const cultures = cultureResults.length ? `
    <section class="calendar-section">
      <h2 class="calendar-title">🥕 Repères de culture</h2>
      ${Object.entries(parFamille).map(([famille, items]) => `
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
  `).join("")}
    </section>` : "";
  list.innerHTML = tachesSol + cultures;
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

  const departementSelect = document.getElementById("departement");
  departementSelect.innerHTML = '<option value="">— Choisir —</option>' +
    DEPARTEMENTS.map(d => `<option value="${d.code}">${d.code} · ${d.nom}</option>`).join("");
  departementSelect.value = currentDepartement;
  departementSelect.addEventListener("change", e => {
    currentDepartement = e.target.value;
    localStorage.setItem("jardin-departement", currentDepartement);
    const region = regionDuDepartement(currentDepartement);
    if (region) {
      currentRegion = region;
      localStorage.setItem("jardin-region", currentRegion);
      regionSelect.value = currentRegion;
    }
    renderCalendrier();
  });

  document.querySelector(`.month-btn[data-month="${currentMonth}"]`).click();
}
