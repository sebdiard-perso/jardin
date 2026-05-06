let mesPlanches = JSON.parse(localStorage.getItem("jardin-planches") || "[]");
let editIndex = -1;
const MOIS_COURTS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];
const COULEURS = ["#4caf50","#f44336","#2196f3","#ff9800","#9c27b0","#009688","#e91e63","#795548","#607d8b","#cddc39"];

// Dessine les dots d'un rang étalés sur toute la longueur
function renderDots(nbPlants, color, longueurCm, entrePlantsCm) {
  // On affiche au max 30 dots, le reste en "+N"
  const maxDots = 30;
  const nb = Math.min(nbPlants, maxDots);
  const dots = Array.from({length: nb}, () =>
    `<span class="plan-dot" style="background:${color}"></span>`
  ).join("");
  const more = nbPlants > maxDots ? `<span class="plan-more">+${nbPlants - maxDots}</span>` : "";
  return dots + more;
}

// selectedPlantes = [{nom, rangs}]
let selectedPlantes = [];

function savePlanches() { localStorage.setItem("jardin-planches", JSON.stringify(mesPlanches)); }

// Compat : anciennes planches avec plantes = ["nom"] → convertir en [{nom, rangs}]
function normalizePlantes(pl) {
  if (!pl.plantes.length) return [];
  if (typeof pl.plantes[0] === "string") {
    return pl.plantes.map(nom => {
      const p = findPlante(nom);
      const maxRangs = p ? Math.max(1, Math.floor((pl.largeur * 100) / p.entreRangs)) : 1;
      return { nom, rangs: maxRangs };
    });
  }
  return pl.plantes;
}

function plantesNoms(pl) { return normalizePlantes(pl).map(p => p.nom); }

function calcEspacements(plante, longueur, rangs) {
  const lCm = longueur * 100;
  const nbParRang = Math.max(1, Math.floor(lCm / plante.entrePlants));
  return { rangs, nbParRang, total: rangs * nbParRang, entreRangs: plante.entreRangs, entrePlants: plante.entrePlants };
}

// --- Dessin vue du dessus : placement intelligent, écartements respectés, intercalé ---
function renderPlanDessin(pl) {
  const items = normalizePlantes(pl);
  const wCm = pl.largeur * 100, lCm = pl.longueur * 100;
  if (!items.length) return "";

  // 1. Trier les plantes par écartement décroissant (la plus grosse d'abord)
  const sorted = [...items].map((item, ci) => {
    const p = findPlante(item.nom);
    if (!p) return null;
    return { ...item, p, ci, nbPlants: Math.max(1, Math.floor(lCm / p.entrePlants)) };
  }).filter(Boolean).sort((a, b) => b.p.entreRangs - a.p.entreRangs);

  // 2. Placer la plante principale (plus gros écartement) d'abord
  const placed = [];
  const premiere = sorted[0];
  const startY = Math.round(premiere.p.entreRangs / 2);
  for (let r = 0; r < premiere.rangs; r++) {
    placed.push({
      yCm: startY + r * premiere.p.entreRangs,
      nom: premiere.p.nom, emoji: premiere.p.emoji,
      color: COULEURS[premiere.ci % COULEURS.length],
      nbPlants: premiere.nbPlants, entrePlants: premiere.p.entrePlants,
      entreRangs: premiere.p.entreRangs
    });
  }

  // 3. Pour chaque plante suivante, insérer dans les espaces libres
  for (let s = 1; s < sorted.length; s++) {
    const sp = sorted[s];
    let reste = sp.rangs;
    // Recalculer les slots à partir des rangs déjà placés
    const all = [...placed].sort((a, b) => a.yCm - b.yCm);

    // Collecter tous les espaces : bord gauche, entre rangs, bord droit
    const gaps = [];
    // Bord gauche : de 5cm (marge mini du bord) au premier rang - marge
    gaps.push({ from: 5, to: all[0].yCm - 5 });
    // Entre chaque paire de rangs
    for (let i = 0; i < all.length - 1; i++) {
      gaps.push({ from: all[i].yCm + 5, to: all[i + 1].yCm - 5 });
    }
    // Bord droit
    gaps.push({ from: all[all.length - 1].yCm + 5, to: wCm - 5 });

    // Dans chaque gap, combien de rangs de sp tiennent ?
    for (const gap of gaps) {
      if (reste <= 0) break;
      const espace = gap.to - gap.from;
      if (espace < sp.p.entreRangs * 0.5) continue; // trop petit

      const nbFit = Math.max(1, Math.floor(espace / sp.p.entreRangs) + 1);
      const nb = Math.min(nbFit, reste);

      if (nb === 1) {
        // Centrer dans le gap
        placed.push({
          yCm: Math.round((gap.from + gap.to) / 2),
          nom: sp.p.nom, emoji: sp.p.emoji,
          color: COULEURS[sp.ci % COULEURS.length],
          nbPlants: sp.nbPlants, entrePlants: sp.p.entrePlants,
          entreRangs: sp.p.entreRangs
        });
        reste--;
      } else {
        const step = espace / (nb + 1);
        for (let r = 0; r < nb; r++) {
          placed.push({
            yCm: Math.round(gap.from + step * (r + 1)),
            nom: sp.p.nom, emoji: sp.p.emoji,
            color: COULEURS[sp.ci % COULEURS.length],
            nbPlants: sp.nbPlants, entrePlants: sp.p.entrePlants,
            entreRangs: sp.p.entreRangs
          });
          reste--;
        }
      }
    }

    // S'il reste des rangs non placés, les ajouter après le dernier
    if (reste > 0) {
      const lastY = Math.max(...placed.map(r => r.yCm));
      for (let r = 0; r < reste; r++) {
        placed.push({
          yCm: lastY + sp.p.entreRangs * (r + 1),
          nom: sp.p.nom, emoji: sp.p.emoji,
          color: COULEURS[sp.ci % COULEURS.length],
          nbPlants: sp.nbPlants, entrePlants: sp.p.entrePlants,
          entreRangs: sp.p.entreRangs
        });
      }
    }
  }

  // Trier par position finale
  placed.sort((a, b) => a.yCm - b.yCm);

  // Alertes écartements trop serrés
  const alertes = [];
  for (let i = 1; i < placed.length; i++) {
    const dist = placed[i].yCm - placed[i - 1].yCm;
    const minReq = Math.round(Math.min(placed[i].entreRangs, placed[i - 1].entreRangs) * 0.4);
    if (dist < minReq) alertes.push(`${placed[i-1].emoji}↔${placed[i].emoji} : ${dist}cm (min ~${minReq}cm)`);
  }

  // Rendu
  const maxYcm = Math.max(...placed.map(r => r.yCm));
  const depasse = maxYcm > wCm;
  const hauteurCm = depasse ? maxYcm + 10 : wCm;
  const rangH = 32;
  const totalPx = Math.max(placed.length * (rangH + 6) + 10, Math.round(hauteurCm * 2.5));
  const pxParCm = totalPx / hauteurCm;

  return `
    <div class="plan-visuel">
      ${depasse ? `<p class="plan-warn">⚠️ Dépasse la planche (${maxYcm}cm > ${wCm}cm)</p>` : ''}
      ${alertes.length ? `<p class="plan-warn">⚠️ ${alertes.join(' · ')}</p>` : ''}
      <div class="plan-planche" style="height:${totalPx}px">
        <div class="plan-largeur-label">↕ ${wCm} cm</div>
        ${placed.map(r => {
          const topPx = Math.round(r.yCm * pxParCm - rangH / 2);
          return `<div class="plan-row" style="top:${topPx}px;height:${rangH}px">
            <div class="plan-row-label">${r.emoji} ${r.nom}<br><span class="plan-row-pos">${r.yCm} cm</span></div>
            <div class="plan-row-dots">${renderDots(r.nbPlants, r.color, lCm, r.entrePlants)}</div>
          </div>`;
        }).join("")}
      </div>
      <div class="plan-legend">
        ${[...new Map(placed.map(r => [r.nom, r])).values()].map(r =>
          `<span class="plan-legend-item"><span class="plan-legend-dot" style="background:${r.color}"></span>${r.emoji} ${r.nom} (${r.entreRangs}cm) ×${placed.filter(p => p.nom === r.nom).length}r</span>`
        ).join("")}
      </div>
    </div>`;
}

// --- Suggestions, associations, etc (inchangés mais utilisent plantesNoms) ---
function getSuggestions(pl) {
  const noms = plantesNoms(pl);
  const hMatin = pl.hMatin ?? 4, hApresMidi = pl.hApresMidi ?? 3, typeSol = pl.typeSol || "limoneux";
  const suggestions = [];
  for (const item of normalizePlantes(pl)) {
    const p = findPlante(item.nom);
    if (!p) continue;
    const espaceLibre = p.entreRangs - 10;
    if (espaceLibre < 12) continue;
    const compagnons = p.bonsVoisins.map(n => findPlante(n))
      .filter(c => c && !noms.includes(c.nom) && c.entreRangs <= espaceLibre && planteCompatibleSoleil(c, hMatin, hApresMidi).ok && !c.solEviter.includes(typeSol))
      .map(c => ({ ...c, nbRangsInter: Math.max(1, Math.floor(espaceLibre / c.entreRangs)) }))
      .slice(0, 4);
    if (compagnons.length) suggestions.push({ plante: p, espaceLibre, rangs: item.rangs, compagnons });
  }
  return suggestions;
}

function getAssociations(noms) {
  const bonnes = [], mauvaises = [];
  if (noms.length === 1) {
    const p = findPlante(noms[0]);
    if (p) {
      p.bonsVoisins.forEach(n => { const v = findPlante(n); if (v) bonnes.push(`${p.emoji} ${p.nom} + ${v.emoji} ${v.nom}`); });
      p.mauvaisVoisins.forEach(n => { const v = findPlante(n); if (v) mauvaises.push(`${p.emoji} ${p.nom} ✗ ${v.emoji} ${v.nom}`); });
    }
    return { bonnes, mauvaises, single: true };
  }
  for (let i = 0; i < noms.length; i++) {
    const p = findPlante(noms[i]);
    if (!p) continue;
    for (let j = i + 1; j < noms.length; j++) {
      const autre = noms[j], pa = findPlante(autre);
      if (p.bonsVoisins.includes(autre)) bonnes.push(`${p.emoji} ${p.nom} + ${pa?.emoji} ${autre}`);
      if (p.mauvaisVoisins.includes(autre)) mauvaises.push(`${p.emoji} ${p.nom} ✗ ${pa?.emoji} ${autre}`);
    }
  }
  return { bonnes, mauvaises, single: false };
}

function getRotationAdvice(noms) {
  const familles = [...new Set(noms.map(n => findPlante(n)?.famille).filter(Boolean))];
  return familles.map(f => {
    const rot = ROTATIONS[f]; if (!rot) return null;
    return `<b>${f}</b> (${rot.plantes}) → ${rot.delai} ans. Suivant : <b>${rot.apres.map(fa => ROTATIONS[fa]?.plantes || fa).join(" ou ")}</b>.`;
  }).filter(Boolean);
}

function getSoleilAlerts(noms, hM, hA) {
  return noms.map(nom => { const p = findPlante(nom); if (!p) return null; const c = planteCompatibleSoleil(p, hM, hA); return c.ok ? null : { plante: p, alertes: c.alertes }; }).filter(Boolean);
}
function getSolAlerts(noms, sol) {
  return noms.map(nom => { const p = findPlante(nom); if (!p) return null; if (p.solEviter.includes(sol)) return { plante: p, msg: `Sol ${sol} déconseillé` }; if (!p.sol.includes(sol)) return { plante: p, msg: `Sol ${sol} pas idéal (préfère ${p.sol.join(", ")})` }; return null; }).filter(Boolean);
}

function renderCalendrierRecolte(pl) {
  const d = REGIONS[localStorage.getItem("jardin-region") || "oceanique"].decalage;
  return `<div class="cal-scroll"><table class="cal-table"><tr><th></th>${MOIS_COURTS.map(m => `<th>${m}</th>`).join("")}</tr>
    ${plantesNoms(pl).map(nom => { const p = findPlante(nom); if (!p) return ""; const mr = shiftMonths(p.recolte, d);
      return `<tr><td class="cal-plante">${p.emoji} ${p.nom}</td>${MOIS_COURTS.map((_,i) => `<td class="cal-cell${mr.includes(i) ? ' cal-recolte' : ''}">${mr.includes(i) ? '🧺' : ''}</td>`).join("")}</tr>`;
    }).join("")}</table></div>`;
}

function renderEntretiens(pl) {
  const d = REGIONS[localStorage.getItem("jardin-region") || "oceanique"].decalage;
  const maintenant = new Date().getMonth();
  // Afficher mois en cours + 2 suivants
  const moisAffiches = [maintenant, (maintenant + 1) % 12, (maintenant + 2) % 12];

  const parMois = {};
  for (const nom of plantesNoms(pl)) {
    const p = findPlante(nom); if (!p || !p.entretiens) continue;
    for (const e of p.entretiens) {
      for (const m of shiftMonths(e.mois, d)) {
        if (!moisAffiches.includes(m)) continue;
        if (!parMois[m]) parMois[m] = [];
        parMois[m].push({ emoji: p.emoji, nom: p.nom, tache: e.tache });
      }
    }
  }

  // Trier dans l'ordre : mois en cours, +1, +2
  const moisTries = moisAffiches.filter(m => parMois[m]);
  if (!moisTries.length) return `<p style="padding:0.5rem;color:#999">Rien à faire en ${MOIS_COURTS[maintenant]}-${MOIS_COURTS[(maintenant + 2) % 12]}</p>`;

  return `<div class="entretiens-list">
    ${moisTries.map(m => {
      const estCeMois = m === maintenant;
      return `<div class="entretien-mois${estCeMois ? ' entretien-actuel' : ''}">
        <div class="entretien-mois-label">${MOIS_COURTS[m]}${estCeMois ? ' 👈' : ''}</div>
        <div class="entretien-taches">${parMois[m].map(e => `<div class="entretien-tache">${e.emoji} ${e.nom} : ${e.tache}</div>`).join("")}</div>
      </div>`;
    }).join("")}
  </div>`;
}

function toggleSuivantes(idx) {
  const el = document.getElementById(`suivantes-${idx}`);
  if (el.classList.contains("hidden")) {
    el.classList.remove("hidden");
    const props = getPropositionsSuivantes(mesPlanches[idx]);
    if (!props.length) { el.innerHTML = '<p style="padding:0.5rem;color:#999">Aucune plante compatible</p>'; return; }
    el.innerHTML = `<table class="espacement-table"><tr><th>Plante</th><th>Début</th><th>Durée</th></tr>
      ${props.map(p => `<tr><td>${p.plante.emoji} ${p.plante.nom}</td><td>${p.debutMois}</td><td>${p.plante.dureeJours}j</td></tr>`).join("")}</table>`;
  } else el.classList.add("hidden");
}

function renderAmendements(pl, noms, sol) {
  const conseils = getAmendementsPersonnalises(sol, noms, pl.culturePrecedente);
  return conseils.map(c => `
    <div class="amendement-bloc">
      <h4>${c.titre}</h4>
      <ul class="amendements-list">${c.items.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>
  `).join("");
}

function switchSubTab(idx, tab) {
  const card = document.getElementById(`planche-${idx}`);
  card.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.sub === tab));
  card.querySelectorAll(".sub-panel").forEach(p => p.classList.toggle("hidden", p.dataset.sub !== tab));
}

function renderPlanches() {
  const list = document.getElementById("planches-list");
  if (!mesPlanches.length) { list.innerHTML = '<div class="empty-state">🌾 Aucune planche créée</div>'; return; }

  list.innerHTML = mesPlanches.map((pl, idx) => {
    const noms = plantesNoms(pl);
    const hM = pl.hMatin ?? 4, hA = pl.hApresMidi ?? 3, sol = pl.typeSol || "limoneux";
    const assoc = getAssociations(noms), rots = getRotationAdvice(noms), sugg = getSuggestions(pl);
    const aSoleil = getSoleilAlerts(noms, hM, hA), aSol = getSolAlerts(noms, sol);
    const nbAl = aSoleil.length + aSol.length;
    const items = normalizePlantes(pl);

    return `
    <article class="planche-card" id="planche-${idx}">
      <h3>📐 ${pl.nom}</h3>
      <p class="planche-dims">${pl.longueur}m × ${pl.largeur}m · ☀️ ${hM}h+${hA}h · ${TYPES_SOL[sol]?.label || sol}</p>

      <nav class="sub-tabs">
        <button class="sub-tab-btn active" data-sub="plan" onclick="switchSubTab(${idx},'plan')">🗺️ Plan</button>
        <button class="sub-tab-btn" data-sub="entretien" onclick="switchSubTab(${idx},'entretien')">🛠️ Entretien</button>
        <button class="sub-tab-btn" data-sub="recolte" onclick="switchSubTab(${idx},'recolte')">🧺 Récolte</button>
        <button class="sub-tab-btn" data-sub="assoc" onclick="switchSubTab(${idx},'assoc')">🤝 Assoc.</button>
        <button class="sub-tab-btn" data-sub="sol" onclick="switchSubTab(${idx},'sol')">🧪 Sol</button>
        <button class="sub-tab-btn${nbAl ? ' has-alert' : ''}" data-sub="alertes" onclick="switchSubTab(${idx},'alertes')">${nbAl ? '⚠️'+nbAl : '✅'}</button>
      </nav>

      <div class="sub-panel" data-sub="plan">
        <table class="espacement-table">
          <tr><th>Plante</th><th>Rangs</th><th>Plants/rang</th><th>Total</th></tr>
          ${items.map(item => { const p = findPlante(item.nom); if (!p) return ""; const e = calcEspacements(p, pl.longueur, item.rangs);
            return `<tr><td>${p.emoji} ${p.nom}</td><td>${e.rangs}</td><td>${e.nbParRang} (${e.entrePlants}cm)</td><td><b>${e.total}</b></td></tr>`;
          }).join("")}
        </table>
        ${renderPlanDessin(pl)}
        ${sugg.length ? `<h4 style="margin-top:0.6rem">💡 À intercaler</h4><div class="suggestions-list">${sugg.map(s => `
          <div class="suggestion-item"><div class="suggestion-label">Entre rangs de ${s.plante.emoji} ${s.plante.nom} <span class="suggestion-space">(${s.espaceLibre}cm)</span></div>
          <div class="suggestion-chips">${s.compagnons.map(c => `<span class="suggestion-chip">${c.emoji} ${c.nom}</span>`).join("")}</div></div>`).join("")}</div>` : ""}
      </div>

      <div class="sub-panel hidden" data-sub="entretien">${renderEntretiens(pl)}</div>
      <div class="sub-panel hidden" data-sub="recolte">${renderCalendrierRecolte(pl)}
        <button class="btn-suivantes" onclick="toggleSuivantes(${idx})" style="margin-top:0.6rem">🔮 Plantes suivantes</button>
        <div id="suivantes-${idx}" class="suivantes-panel hidden"></div></div>
      <div class="sub-panel hidden" data-sub="assoc">
        ${(assoc.bonnes.length || assoc.mauvaises.length) ? `<div class="assoc-list">${assoc.bonnes.map(a => `<div class="assoc-good">✅ ${a}</div>`).join("")}${assoc.mauvaises.map(a => `<div class="assoc-bad">⚠️ ${a}</div>`).join("")}</div>` : '<p style="color:#999">Aucune</p>'}
        ${rots.length ? `<div class="rotation-info" style="margin-top:0.5rem">${rots.join("<br>")}</div>` : ""}</div>
      <div class="sub-panel hidden" data-sub="sol">${renderAmendements(pl, noms, sol)}</div>
      <div class="sub-panel hidden" data-sub="alertes">
        ${nbAl ? `<div class="soleil-alerts">${aSoleil.map(a => a.alertes.map(m => `<div class="soleil-alert">${a.plante.emoji} ${a.plante.nom}: ${m}</div>`).join("")).join("")}${aSol.map(a => `<div class="soleil-alert">${a.plante.emoji} ${a.msg}</div>`).join("")}</div>` : '<p style="color:#2e7d32;font-weight:600">✅ Tout est compatible</p>'}
      </div>

      <div class="planche-actions">
        <button class="btn-edit" onclick="startEditPlanche(${idx})">✏️ Modifier</button>
        <button class="btn-delete" onclick="deletePlanche(${idx})">🗑️ Supprimer</button>
      </div>
    </article>`;
  }).join("");
}

// --- Formulaire ---
function showPlancheForm() {
  document.getElementById("planche-form").classList.remove("hidden");
  document.getElementById("btn-show-form").classList.add("hidden");
}
function hidePlancheForm() {
  document.getElementById("planche-form").classList.add("hidden");
  document.getElementById("btn-show-form").classList.remove("hidden");
  resetForm();
}

function renderSelectedPlantes() {
  const el = document.getElementById("plantes-selectionnees");
  if (!selectedPlantes.length) { el.innerHTML = '<p class="empty-selection">Aucune plante sélectionnée</p>'; return; }
  el.innerHTML = selectedPlantes.map(sp => {
    const p = findPlante(sp.nom);
    return `<span class="selected-plante">${p?.emoji} ${sp.nom} × ${sp.rangs} rang${sp.rangs > 1 ? 's' : ''} <button onclick="removePlante('${sp.nom}')">✕</button></span>`;
  }).join("");
}

function removePlante(nom) {
  selectedPlantes = selectedPlantes.filter(sp => sp.nom !== nom);
  renderSelectedPlantes();
}

function showRangPicker(nomPlante) {
  const p = findPlante(nomPlante);
  if (!p) return;
  const largeur = parseFloat(document.getElementById("planche-largeur").value) || 1.2;
  const wCm = largeur * 100;

  // Simuler le placement des rangs déjà sélectionnés pour trouver les gaps
  // Trier par écartement décroissant, placer comme dans renderPlanDessin
  const existing = [];
  const sortedExisting = [...selectedPlantes].map(sp => {
    const pp = findPlante(sp.nom);
    return pp ? { ...sp, entreRangs: pp.entreRangs } : null;
  }).filter(Boolean).sort((a, b) => b.entreRangs - a.entreRangs);

  // Placer la plus grosse d'abord
  if (sortedExisting.length) {
    const first = sortedExisting[0];
    for (let r = 0; r < first.rangs; r++) {
      existing.push(Math.round(first.entreRangs / 2 + r * first.entreRangs));
    }
    // Insérer les suivantes dans les gaps (même algo que renderPlanDessin)
    for (let s = 1; s < sortedExisting.length; s++) {
      const sp = sortedExisting[s];
      const all = [...existing].sort((a, b) => a - b);
      const gaps = [];
      gaps.push({ from: 5, to: all[0] - 5 });
      for (let i = 0; i < all.length - 1; i++) gaps.push({ from: all[i] + 5, to: all[i + 1] - 5 });
      gaps.push({ from: all[all.length - 1] + 5, to: wCm - 5 });
      let reste = sp.rangs;
      for (const gap of gaps) {
        if (reste <= 0) break;
        const espace = gap.to - gap.from;
        if (espace < sp.entreRangs * 0.5) continue;
        const nbFit = Math.max(1, Math.floor(espace / sp.entreRangs) + 1);
        const nb = Math.min(nbFit, reste);
        const step = nb > 1 ? espace / (nb + 1) : 0;
        for (let r = 0; r < nb; r++) {
          existing.push(Math.round(nb === 1 ? (gap.from + gap.to) / 2 : gap.from + step * (r + 1)));
          reste--;
        }
      }
    }
  }

  // Calculer les gaps disponibles pour la nouvelle plante
  const allPositions = [...existing].sort((a, b) => a - b);
  let maxRangs = 0;
  if (!allPositions.length) {
    // Planche vide
    maxRangs = Math.max(1, Math.floor(wCm / p.entreRangs));
  } else {
    // Compter combien de rangs tiennent dans chaque gap
    const gaps = [];
    gaps.push({ from: 5, to: allPositions[0] - 5 });
    for (let i = 0; i < allPositions.length - 1; i++) gaps.push({ from: allPositions[i] + 5, to: allPositions[i + 1] - 5 });
    gaps.push({ from: allPositions[allPositions.length - 1] + 5, to: wCm - 5 });
    for (const gap of gaps) {
      const espace = gap.to - gap.from;
      if (espace >= p.entreRangs * 0.5) {
        maxRangs += Math.max(1, Math.floor(espace / p.entreRangs) + 1);
      }
    }
  }
  maxRangs = Math.max(0, maxRangs);

  const picker = document.getElementById("rang-picker");
  picker.classList.remove("hidden");
  picker.innerHTML = `
    <div class="rang-picker-inner">
      <p class="variete-title">${p.emoji} ${p.nom} — combien de rangs ?</p>
      <p style="font-size:0.75rem;color:#777">Écart entre rangs : ${p.entreRangs}cm · ${allPositions.length ? allPositions.length + ' rang(s) déjà placé(s)' : 'Planche vide'} → max ${maxRangs}</p>
      <div class="rang-buttons">
        ${maxRangs > 0 ? Array.from({length: maxRangs}, (_, i) => `<button class="rang-btn" onclick="addPlanteWithRangs('${nomPlante}', ${i + 1})">${i + 1}</button>`).join("") : '<p style="color:#c62828;font-size:0.8rem">Plus de place entre les rangs existants !</p>'}
      </div>
      <button class="variete-close" onclick="document.getElementById('rang-picker').classList.add('hidden')">Annuler</button>
    </div>`;
}

function addPlanteWithRangs(nom, rangs) {
  if (!selectedPlantes.find(sp => sp.nom === nom)) {
    selectedPlantes.push({ nom, rangs });
    renderSelectedPlantes();
  }
  document.getElementById("rang-picker").classList.add("hidden");
}

function initPlantePicker() {
  const groupes = getGroupes();
  const legumePicker = document.getElementById("legume-picker");
  const varietePicker = document.getElementById("variete-picker");

  legumePicker.innerHTML = groupes.map(g =>
    `<button class="legume-chip" data-groupe="${g.nom}">${g.emoji} ${g.nom}${g.variantes.length > 1 ? ' ▾' : ''}</button>`
  ).join("");

  legumePicker.addEventListener("click", e => {
    const btn = e.target.closest(".legume-chip");
    if (!btn) return;
    const groupe = groupes.find(g => g.nom === btn.dataset.groupe);
    if (!groupe) return;
    varietePicker.classList.add("hidden");

    if (groupe.variantes.length === 1) {
      showRangPicker(groupe.variantes[0].nom);
    } else {
      varietePicker.classList.remove("hidden");
      varietePicker.innerHTML = `
        <p class="variete-title">${groupe.emoji} Quelle variété de ${groupe.nom} ?</p>
        ${groupe.variantes.map(v => `
          <button class="variete-chip" data-nom="${v.nom}">
            <span class="variete-nom">${v.nom}</span>
            ${v.variete ? `<span class="variete-detail">${v.variete}</span>` : ''}
            <span class="variete-info">${v.dureeJours}j · récolte ${v.recolte.map(m => MOIS_COURTS[m]).join("-")}</span>
          </button>
        `).join("")}
        <button class="variete-close" onclick="document.getElementById('variete-picker').classList.add('hidden')">Fermer</button>`;
      varietePicker.querySelectorAll(".variete-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          varietePicker.classList.add("hidden");
          showRangPicker(chip.dataset.nom);
        });
      });
    }
  });
}

function resetForm() {
  editIndex = -1;
  document.getElementById("planche-nom").value = "";
  document.getElementById("planche-longueur").value = "3";
  document.getElementById("planche-largeur").value = "1.2";
  document.getElementById("planche-orientation").value = "journee";
  document.getElementById("planche-sol").value = "limoneux";
  document.getElementById("planche-hmatin").value = "4";
  document.getElementById("hmatin-val").textContent = "4h";
  document.getElementById("planche-haprem").value = "3";
  document.getElementById("haprem-val").textContent = "3h";
  document.getElementById("planche-precedent").value = "";
  selectedPlantes = [];
  renderSelectedPlantes();
  document.getElementById("variete-picker").classList.add("hidden");
  document.getElementById("rang-picker").classList.add("hidden");
  document.getElementById("btn-add-planche").textContent = "Créer la planche";
  document.getElementById("form-title").textContent = "➕ Nouvelle planche";
}

function startEditPlanche(idx) {
  const pl = mesPlanches[idx];
  editIndex = idx;
  document.getElementById("planche-nom").value = pl.nom;
  document.getElementById("planche-longueur").value = pl.longueur;
  document.getElementById("planche-largeur").value = pl.largeur;
  document.getElementById("planche-orientation").value = pl.orientation || "journee";
  document.getElementById("planche-sol").value = pl.typeSol || "limoneux";
  document.getElementById("planche-hmatin").value = pl.hMatin ?? 4;
  document.getElementById("hmatin-val").textContent = (pl.hMatin ?? 4) + "h";
  document.getElementById("planche-haprem").value = pl.hApresMidi ?? 3;
  document.getElementById("haprem-val").textContent = (pl.hApresMidi ?? 3) + "h";
  document.getElementById("planche-precedent").value = pl.culturePrecedente || "";
  selectedPlantes = normalizePlantes(pl).map(p => ({...p}));
  renderSelectedPlantes();
  document.getElementById("btn-add-planche").textContent = "💾 Enregistrer";
  document.getElementById("form-title").textContent = "✏️ Modifier la planche";
  showPlancheForm();
}

function deletePlanche(idx) {
  if (!confirm("Supprimer cette planche ?")) return;
  mesPlanches.splice(idx, 1);
  savePlanches();
  if (editIndex === idx) resetForm();
  renderPlanches();
}

function initPlanches() {
  initPlantePicker();
  renderSelectedPlantes();

  document.getElementById("btn-add-planche").addEventListener("click", () => {
    const nom = document.getElementById("planche-nom").value.trim() || `Planche ${mesPlanches.length + 1}`;
    const longueur = parseFloat(document.getElementById("planche-longueur").value) || 3;
    const largeur = parseFloat(document.getElementById("planche-largeur").value) || 1.2;
    const orientation = document.getElementById("planche-orientation").value;
    const typeSol = document.getElementById("planche-sol").value;
    const hMatin = parseInt(document.getElementById("planche-hmatin").value);
    const hApresMidi = parseInt(document.getElementById("planche-haprem").value);
    if (!selectedPlantes.length) return alert("Sélectionne au moins une plante !");
    const data = { nom, longueur, largeur, orientation, typeSol, hMatin, hApresMidi, culturePrecedente: document.getElementById("planche-precedent").value, plantes: [...selectedPlantes] };
    if (editIndex >= 0) mesPlanches[editIndex] = data;
    else mesPlanches.push(data);
    savePlanches();
    renderPlanches();
    hidePlancheForm();
  });

  document.getElementById("btn-cancel-edit").addEventListener("click", hidePlancheForm);
  renderPlanches();
}
