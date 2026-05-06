// Assemblage de toutes les plantes
const plantes = [
  ...TOMATES, ...CAROTTES, ...LAITUES, ...COURGETTES, ...RADIS,
  ...HARICOTS, ...POIVRONS, ...AUBERGINES, ...EPINARDS, ...PETITS_POIS,
  ...OIGNONS, ...AULX, ...POIREAUX, ...CHOUX,
  ...CONCOMBRES, ...POTIRONS,
  ...BASILICS, ...PERSILS, ...FRAISIERS, ...BETTERAVES,
  ...POMMES_DE_TERRE
];

const ROTATIONS = {
  "Solanacées":     { apres: ["Fabacées", "Alliacées"], delai: 4, plantes: "Tomate, Poivron, Aubergine, PDT" },
  "Cucurbitacées":  { apres: ["Fabacées", "Alliacées"], delai: 3, plantes: "Courgette, Concombre, Courge" },
  "Fabacées":       { apres: ["Brassicacées", "Solanacées"], delai: 2, plantes: "Haricot, Petit pois" },
  "Brassicacées":   { apres: ["Fabacées", "Solanacées"], delai: 3, plantes: "Chou, Radis" },
  "Apiacées":       { apres: ["Fabacées", "Alliacées"], delai: 3, plantes: "Carotte, Persil" },
  "Alliacées":      { apres: ["Cucurbitacées", "Solanacées"], delai: 3, plantes: "Oignon, Ail, Poireau" },
  "Astéracées":     { apres: ["Fabacées", "Alliacées"], delai: 2, plantes: "Laitue" },
  "Chénopodiacées": { apres: ["Fabacées", "Alliacées"], delai: 3, plantes: "Épinard, Betterave" },
  "Rosacées":       { apres: ["Alliacées", "Fabacées"], delai: 4, plantes: "Fraisier" },
  "Lamiacées":      { apres: ["Solanacées", "Cucurbitacées"], delai: 2, plantes: "Basilic" }
};

const TYPES_SOL = {
  argileux:  { label: "🧱 Argileux" },
  limoneux:  { label: "🌾 Limoneux" },
  sableux:   { label: "🏖️ Sableux" },
  calcaire:  { label: "⚪ Calcaire" },
  humifère:  { label: "🍂 Humifère" }
};

const AMENDEMENTS = {
  argileux: ["Sable grossier + compost pour alléger", "Pailler en permanence", "Ne pas travailler mouillé", "Chaux si pH acide"],
  limoneux: ["Compost annuel", "Paillage anti-battance"],
  sableux:  ["Compost et fumier massifs", "Paillage épais", "Arrosage fréquent", "Engrais verts en interculture"],
  calcaire: ["Compost acide (aiguilles de pin)", "Soufre si pH trop haut", "Fumier décomposé", "Attention chlorose (fer)"],
  humifère: ["Limiter les apports azotés", "Chauler si pH acide", "Drainer si trop humide"]
};

// Besoins nutritifs par famille
const BESOINS_FAMILLE = {
  "Solanacées":     { niveau: "gourmande", N: 3, P: 2, K: 3, apport: "Compost mûr + corne broyée au printemps" },
  "Cucurbitacées":  { niveau: "gourmande", N: 3, P: 2, K: 2, apport: "Fumier frais à l'automne ou compost abondant" },
  "Fabacées":       { niveau: "frugale",   N: 0, P: 1, K: 1, apport: "Aucun azote (fixe l'azote). Un peu de potasse" },
  "Brassicacées":   { niveau: "gourmande", N: 3, P: 2, K: 2, apport: "Compost + purin d'ortie en végétation" },
  "Apiacées":       { niveau: "moyenne",   N: 2, P: 2, K: 2, apport: "Compost bien décomposé (pas de fumier frais)" },
  "Alliacées":      { niveau: "frugale",   N: 1, P: 2, K: 2, apport: "Pas de fumier frais. Cendre de bois pour la potasse" },
  "Astéracées":     { niveau: "moyenne",   N: 2, P: 1, K: 1, apport: "Compost léger" },
  "Chénopodiacées": { niveau: "moyenne",   N: 2, P: 1, K: 2, apport: "Compost mûr" },
  "Rosacées":       { niveau: "moyenne",   N: 2, P: 2, K: 3, apport: "Compost + paillage permanent" },
  "Lamiacées":      { niveau: "frugale",   N: 1, P: 1, K: 1, apport: "Sol pauvre suffit, pas d'excès d'azote" }
};

// Ce que laisse la culture précédente dans le sol
const APPORT_PRECEDENT = {
  "Fabacées":       { desc: "Enrichit en azote (fixation)", N: 2, P: 0, K: 0 },
  "Solanacées":     { desc: "Épuise le sol (gourmande)", N: -2, P: -1, K: -2 },
  "Cucurbitacées":  { desc: "Épuise le sol (gourmande)", N: -2, P: -1, K: -1 },
  "Brassicacées":   { desc: "Épuise l'azote", N: -2, P: -1, K: -1 },
  "Alliacées":      { desc: "Sol peu épuisé", N: 0, P: 0, K: -1 },
  "Apiacées":       { desc: "Sol moyennement épuisé", N: -1, P: -1, K: -1 },
  "Astéracées":     { desc: "Sol peu épuisé", N: -1, P: 0, K: 0 },
  "Chénopodiacées": { desc: "Sol moyennement épuisé", N: -1, P: 0, K: -1 },
  "Rosacées":       { desc: "Sol épuisé après plusieurs années", N: -1, P: -1, K: -2 },
  "Lamiacées":      { desc: "Sol peu épuisé", N: 0, P: 0, K: 0 },
  "engrais-vert":   { desc: "Engrais vert (moutarde, phacélie...)", N: 2, P: 1, K: 1 },
  "rien":           { desc: "Repos / jachère", N: 0, P: 0, K: 0 }
};

// Génère les conseils d'amendement personnalisés
function getAmendementsPersonnalises(typeSol, plantesNoms, culturePrecedente) {
  const conseils = [];

  // 1. Amendements de base pour le sol
  const baseSol = AMENDEMENTS[typeSol] || [];
  conseils.push({ titre: `🪨 Sol ${typeSol}`, items: baseSol });

  // 2. Besoins des plantes actuelles
  const familles = [...new Set(plantesNoms.map(n => findPlante(n)?.famille).filter(Boolean))];
  const besoinsPlantes = [];
  for (const f of familles) {
    const b = BESOINS_FAMILLE[f];
    if (b) besoinsPlantes.push({ famille: f, ...b });
  }
  if (besoinsPlantes.length) {
    const items = besoinsPlantes.map(b => `${b.famille} (${b.niveau}) : ${b.apport}`);
    conseils.push({ titre: "🌱 Besoins des plantes", items });
  }

  // 3. Compensation de la culture précédente
  if (culturePrecedente && APPORT_PRECEDENT[culturePrecedente]) {
    const prev = APPORT_PRECEDENT[culturePrecedente];
    const items = [`Précédent : ${prev.desc}`];

    // Calculer le déficit à compenser
    const maxBesoinN = Math.max(...besoinsPlantes.map(b => b.N), 0);
    const maxBesoinK = Math.max(...besoinsPlantes.map(b => b.K), 0);
    const deficitN = maxBesoinN + Math.abs(Math.min(prev.N, 0));
    const deficitK = maxBesoinK + Math.abs(Math.min(prev.K, 0));

    if (deficitN >= 3) items.push("→ Apport azoté fort : fumier, sang séché, corne broyée");
    else if (deficitN >= 2) items.push("→ Apport azoté modéré : compost mûr, purin d'ortie");
    if (deficitK >= 3) items.push("→ Apport potasse : cendre de bois, vinasse de betterave");
    else if (deficitK >= 2) items.push("→ Potasse : consoude, cendre légère");
    if (prev.N >= 1) items.push("→ Azote déjà disponible grâce au précédent, réduire les apports");

    conseils.push({ titre: "🔄 Compensation culture précédente", items });
  }

  return conseils;
}

const TAGS = {
  "semis-interieur": { label: "🏠 Semis intérieur" },
  "semis-exterieur": { label: "🌤️ Semis extérieur" },
  "plantation":      { label: "🌿 Plantation" },
  "recolte":         { label: "🧺 Récolte" }
};

const REGIONS = {
  oceanique:     { label: "Océanique",     decalage: 0 },
  continental:   { label: "Continental",   decalage: 1 },
  mediterraneen: { label: "Méditerranéen", decalage: -1 },
  montagne:      { label: "Montagne",      decalage: 2 }
};

function findPlante(nom) { return plantes.find(p => p.nom === nom); }

function getGroupes() {
  const map = {};
  for (const p of plantes) {
    const g = p.groupe;
    if (!map[g]) map[g] = { nom: g, emoji: p.emoji, variantes: [] };
    map[g].variantes.push(p);
  }
  return Object.values(map);
}

function shiftMonths(months, decalage) {
  if (decalage === 0) return months;
  return months.map(m => ((m + decalage) % 12 + 12) % 12);
}

function soleilLabel(s) {
  if (s.apresMidi === 0) return `☀️ ${s.matin}h mat.`;
  if (s.matin === 0) return `☀️ ${s.apresMidi}h ap-m.`;
  return `☀️ ${s.matin}h+${s.apresMidi}h`;
}

function planteCompatibleSoleil(plante, hMatin, hApresMidi) {
  const s = plante.soleil;
  const alertes = [];
  if ((hMatin + hApresMidi) < (s.matin + s.apresMidi))
    alertes.push(`Besoin ${s.matin + s.apresMidi}h, planche ${hMatin + hApresMidi}h`);
  if (hMatin < s.matin)
    alertes.push(`Besoin ${s.matin}h matin, planche ${hMatin}h`);
  if (s.apresMidi > 0 && hApresMidi < s.apresMidi)
    alertes.push(`Besoin ${s.apresMidi}h ap-m., planche ${hApresMidi}h`);
  if (!s.tolereChaleur && hApresMidi > 3)
    alertes.push(`Sensible chaleur, ${hApresMidi}h ap-m. risqué`);
  return { ok: alertes.length === 0, alertes };
}

function getMoisLiberation(plNames) {
  // plNames peut être ["nom"] ou [{nom, rangs}]
  const noms = plNames.map(p => typeof p === 'string' ? p : p.nom);
  const d = REGIONS[localStorage.getItem("jardin-region") || "oceanique"].decalage;
  let dernierMois = -1;
  for (const nom of noms) {
    const p = findPlante(nom);
    if (!p || !p.recolte.length) continue;
    const max = Math.max(...shiftMonths(p.recolte, d));
    if (max > dernierMois) dernierMois = max;
  }
  return dernierMois;
}

function getPropositionsSuivantes(pl) {
  const moisLibre = getMoisLiberation(pl.plantes);
  if (moisLibre < 0) return [];
  const moisSuivant = (moisLibre + 1) % 12;
  const d = REGIONS[localStorage.getItem("jardin-region") || "oceanique"].decalage;
  const noms = pl.plantes.map(p => typeof p === 'string' ? p : p.nom);
  const famillesActuelles = [...new Set(noms.map(n => findPlante(n)?.famille).filter(Boolean))];
  const hMatin = pl.hMatin ?? 4, hApresMidi = pl.hApresMidi ?? 3;
  const typeSol = pl.typeSol || "limoneux";
  const MN = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];

  return plantes.filter(p => {
    if (famillesActuelles.includes(p.famille)) return false;
    if (!planteCompatibleSoleil(p, hMatin, hApresMidi).ok) return false;
    if (p.solEviter.includes(typeSol)) return false;
    const possible = [...shiftMonths([...p.semisExterieur, ...p.semisInterieur], d), ...shiftMonths(p.plantation, d)];
    return possible.some(m => ((m - moisSuivant + 12) % 12) <= 3);
  }).map(p => {
    const possible = [...new Set([...shiftMonths([...p.semisExterieur, ...p.semisInterieur], d), ...shiftMonths(p.plantation, d)])].sort((a,b) => a-b);
    const pm = possible.find(m => ((m - moisSuivant + 12) % 12) <= 3) ?? possible[0];
    return { plante: p, debutMois: MN[pm], solOk: p.sol.includes(typeSol) };
  });
}
