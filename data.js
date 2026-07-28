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

const TACHES_SOL_VIVANT = [
  { categorie: "couverture", emoji: "🍂", titre: "Maintenir le sol couvert", mois: [0, 1, 10, 11], conseil: "Compléter le paillage là où la terre est visible. Garder les collets des plantes dégagés pour éviter l'humidité stagnante." },
  { categorie: "matiere-organique", emoji: "♻️", titre: "Épandre du compost mûr", mois: [1, 2, 9, 10], conseil: "Déposer 1 à 3 cm de compost mûr en surface, sans l'enfouir. Cet apport régulier nourrit la vie du sol et contribue à faire progresser le taux de matière organique." },
  { categorie: "matiere-organique", emoji: "🍁", titre: "Constituer une réserve de matières organiques", mois: [8, 9, 10, 11], conseil: "Récupérer feuilles mortes, broyat, paille et résidus sains. Alterner matières riches en carbone et matières vertes au compost ou les utiliser en paillage." },
  { categorie: "matiere-organique", emoji: "🪵", titre: "Épandre du BRF en surface", mois: [9, 10, 11, 0, 1], conseil: "Répartir 2 à 5 cm de bois raméal fragmenté, idéalement issu de jeunes rameaux feuillus, sur une planche libre ou entre les cultures. Le laisser en surface, sans l'enfouir." },
  { categorie: "matiere-organique", emoji: "🪵", titre: "Préparer une planche avec du BRF en couche épaisse", mois: [8, 9, 10, 11], conseil: "Pour une planche en création ou au repos, déposer 15 à 20 cm, voire plus, de BRF en surface. Humidifier si nécessaire puis couvrir temporairement avec une bâche opaque bien lestée ; retirer la bâche avant l'implantation de la culture." },
  { categorie: "matiere-organique", emoji: "🌿", titre: "Nourrir le sol entre deux cultures", mois: [3, 4, 5, 8, 9], conseil: "Associer compost de surface, paillage et engrais vert sur chaque planche libérée. La diversité des apports favorise une matière organique durable." },
  { categorie: "matiere-organique", emoji: "💩", titre: "Apporter du fumier composté", mois: [9, 10, 11, 1, 2], conseil: "Épandre un fumier bien composté (bovin, cheval, volaille selon disponibilité) en couche fine de surface, sur une planche au repos. Éviter le fumier frais au contact des cultures et sous les racines." },
  { categorie: "matiere-organique", emoji: "🌱", titre: "Garder des racines vivantes toute l'année", mois: [0, 1, 2, 3, 6, 7, 8, 9, 10, 11], conseil: "Ne jamais laisser une planche nue longtemps : culture, engrais vert ou repousses. Les racines vivantes nourrissent en continu les champignons et la vie du sol, moteur de la matière organique stable." },
  { categorie: "matiere-organique", emoji: "⚖️", titre: "Équilibrer carbone et azote des apports", mois: [2, 3, 9, 10], conseil: "Combiner matières carbonées (paille, feuilles, BRF) et azotées (tontes, compost, fumier). Un apport trop carboné seul et enfoui peut bloquer l'azote : le garder en surface." },
  { categorie: "observation", emoji: "📊", titre: "Suivre le taux de matière organique", mois: [0, 11], conseil: "Noter les apports de l'année et, si possible, faire analyser le taux de matière organique du sol. Viser une progression régulière au fil des saisons plutôt qu'un apport massif ponctuel." },
  { categorie: "engrais-verts", emoji: "🌾", titre: "Semer un engrais vert", mois: [2, 3, 7, 8], conseil: "Couvrir une planche libre avec un mélange adapté à la saison. Éviter de laisser le sol nu entre deux cultures." },
  { categorie: "eau", emoji: "💧", titre: "Installer une irrigation économe", mois: [3, 4, 5], conseil: "Privilégier le goutte-à-goutte ou l'arrosage au pied, sous paillage. Arroser moins souvent mais en profondeur." },
  { categorie: "observation", emoji: "🔎", titre: "Observer l'humidité du sol", mois: [3, 4, 5, 6, 7, 8], conseil: "Soulever le paillage et vérifier l'humidité à quelques centimètres. Arroser seulement si la terre y est sèche." },
  { categorie: "couverture", emoji: "✂️", titre: "Renouveler le paillage", mois: [4, 5, 6, 7], conseil: "Ajouter tontes sèches, feuilles ou BRF par couches fines. Le paillage limite l'évaporation et nourrit le sol en se décomposant." },
  { categorie: "observation", emoji: "🪱", titre: "Préserver la vie du sol", mois: [2, 3, 8, 9], conseil: "Éviter de retourner la terre et de circuler sur les planches. Observer vers de terre, racines et structure avant toute intervention." },
  { categorie: "engrais-verts", emoji: "🌱", titre: "Faucher et coucher l'engrais vert", mois: [4, 5, 9, 10], conseil: "Couper avant la montée à graines et laisser les résidus en couverture. Planter ensuite sans travailler profondément le sol." },
  { categorie: "bachage", emoji: "🟤", titre: "Occulter une planche enherbée", mois: [1, 2, 6, 7, 8], conseil: "Sur une planche libre, poser une bâche opaque réutilisable et bien lestée sur un sol humide. Retirer cette bâche d'occultation avant tout semis direct ou plantation." },
  { categorie: "bachage", emoji: "🧺", titre: "Choisir la bâche selon la culture", mois: [2, 3, 4, 8, 9, 10], conseil: "Semis direct : retirer ou écarter toute bâche sur le rang. Plants repiqués : une bâche de paillage peut rester, avec des ouvertures de plantation. Une bâche tissée laisse passer l'eau ; une bâche opaque d'occultation doit être retirée." },
  { categorie: "bachage", emoji: "🟤", titre: "Couvrir un apport de BRF", mois: [8, 9, 10, 11, 0, 1], conseil: "Une bâche opaque sur une forte couche de BRF aide à préparer une planche sans travail du sol. Retirer la bâche d'occultation avant de semer ; pour des plants repiqués, préférer un paillage tissé ou organique avec des ouvertures adaptées." },
  { categorie: "matiere-organique", emoji: "🍁", titre: "Valoriser les résidus de culture", mois: [8, 9, 10], conseil: "Laisser les racines en place et couvrir les planches libérées avec les résidus sains, des feuilles ou du compost." },
  { categorie: "eau", emoji: "🌧️", titre: "Préparer la réserve d'eau", mois: [8, 9, 10], conseil: "Nettoyer les gouttières, vérifier la cuve et pailler avant les pluies d'automne pour favoriser l'infiltration." }
];

const CATEGORIES_SOL_VIVANT = {
  couverture: { label: "🍂 Couverture du sol" },
  "matiere-organique": { label: "♻️ Matière organique" },
  "engrais-verts": { label: "🌾 Engrais verts" },
  bachage: { label: "🟤 Bâchage / occultation" },
  eau: { label: "💧 Eau" },
  observation: { label: "🔎 Observation" }
};

const SOURCES_SCIENTIFIQUES = [
  {
    pratique: "Matière organique et eau",
    titre: "Soil organic matter and available water capacity",
    auteurs: "Hudson, B.D.",
    annee: 1994,
    revue: "Journal of Soil and Water Conservation, 49(2), 189-194",
    doi: "https://doi.org/10.1080/00224561.1994.12456850",
    resultat: "La capacité de stockage d'eau augmente avec la matière organique, mais l'ampleur dépend fortement de la texture et de la profondeur de sol considérée.",
    limite: "Données nord-américaines agrégées : ne pas appliquer un coefficient unique à tous les sols."
  },
  {
    pratique: "Compost et carbone du sol",
    titre: "Winter cover crops increase readily decomposable soil carbon, but compost drives total soil carbon during eight years of intensive, organic vegetable production in California",
    auteurs: "White, K.E., Brennan, E.B., Cavigelli, M.A. & Smith, R.F.",
    annee: 2020,
    revue: "PLoS ONE, 15(2), e0228677",
    doi: "https://doi.org/10.1371/journal.pone.0228677",
    resultat: "Après huit ans de maraîchage biologique, le compost a surtout augmenté le carbone organique total, tandis que les couverts ont alimenté les fractions plus rapidement décomposables.",
    limite: "Essai irrigué en Californie : les doses et rythmes d'apport sont à adapter au potager et au climat local."
  },
  {
    pratique: "Compost et vie du sol",
    titre: "Soil microbial biomass, functional microbial diversity, and nematode community structure as affected by cover crops and compost in an organic vegetable production system",
    auteurs: "Nair, A. & Ngouajio, M.",
    annee: 2012,
    revue: "Applied Soil Ecology, 58, 45-55",
    doi: "https://doi.org/10.1016/j.apsoil.2012.03.008",
    resultat: "Compost et couverts végétaux ont amélioré des indicateurs de biomasse et de diversité microbiennes dans un système maraîcher biologique.",
    limite: "Essai de deux ans aux États-Unis : les effets évoluent avec le sol et la durée de pratique."
  },
  {
    pratique: "BRF",
    titre: "Effects of ramial chipped wood amendments on weed control, soil properties and tomato crop yield",
    auteurs: "Robert, N., Tanguy, M., Riss, J. & Gallois, R.",
    annee: 2014,
    revue: "Acta Horticulturae, 1018, 383-389",
    doi: "https://doi.org/10.17660/actahortic.2014.1018.41",
    resultat: "En maraîchage de tomate, le BRF en surface a réduit les adventices et amélioré certaines propriétés du sol sans effet négatif signalé sur le rendement.",
    limite: "Publication de congrès à faible volume de littérature comparable : utiliser le BRF frais en surface et observer la réaction des cultures."
  },
  {
    pratique: "Engrais verts",
    titre: "Nitrogen Release from Grass and Legume Cover Crop Monocultures and Bicultures",
    auteurs: "Ranells, N.N. & Wagger, M.G.",
    annee: 1996,
    revue: "Agronomy Journal, 88(5), 777-882",
    doi: "https://doi.org/10.2134/agronj1996.00021962008800050015x",
    resultat: "Les mélanges graminées-légumineuses permettent d'équilibrer production de biomasse et libération d'azote après fauchage.",
    limite: "La libération d'azote varie avec l'espèce, le stade de destruction, l'humidité et la température."
  },
  {
    pratique: "Bâchage d'occultation",
    titre: "Black Plastic Tarps Advance Organic Reduced Tillage I: Impact on Soils, Weed Seed Survival, and Crop Residue",
    auteurs: "Rylander, H. et al.",
    annee: 2020,
    revue: "HortScience, 55(6)",
    doi: "https://doi.org/10.21273/hortsci14792-19",
    resultat: "Trois semaines ou plus d'occultation ont fortement réduit les adventices levées, sans travail du sol, dans des fermes biologiques.",
    limite: "La bâche ne détruit pas nécessairement le stock de graines ; elle est à retirer avant un semis direct ou une culture non adaptée."
  },
  {
    pratique: "Non-labour et structure",
    titre: "Influence of reduced tillage systems on organic matter, microbial biomass, macro-aggregate distribution and structural stability of the surface soil in a humid climate",
    auteurs: "Carter, M.R.",
    annee: 1992,
    revue: "Soil and Tillage Research, 23(4), 361-372",
    doi: "https://doi.org/10.1016/0167-1987(92)90081-L",
    resultat: "La réduction du travail du sol a augmenté la matière organique de surface, la biomasse microbienne et la stabilité des agrégats.",
    limite: "Le non-labour demande une gestion attentive des adventices, notamment par couverture et occultation."
  }
];

const REGIONS = {
  oceanique:     { label: "Océanique",     decalage: 0 },
  continental:   { label: "Continental",   decalage: 1 },
  mediterraneen: { label: "Méditerranéen", decalage: -1 },
  montagne:      { label: "Montagne",      decalage: 2 }
};

const DEPARTEMENTS = [
  { code: "01", nom: "Ain", region: "continental" },
  { code: "02", nom: "Aisne", region: "continental" },
  { code: "03", nom: "Allier", region: "continental" },
  { code: "04", nom: "Alpes-de-Haute-Provence", region: "montagne" },
  { code: "05", nom: "Hautes-Alpes", region: "montagne" },
  { code: "06", nom: "Alpes-Maritimes", region: "mediterraneen" },
  { code: "07", nom: "Ardèche", region: "mediterraneen" },
  { code: "08", nom: "Ardennes", region: "continental" },
  { code: "09", nom: "Ariège", region: "montagne" },
  { code: "10", nom: "Aube", region: "continental" },
  { code: "11", nom: "Aude", region: "mediterraneen" },
  { code: "12", nom: "Aveyron", region: "montagne" },
  { code: "13", nom: "Bouches-du-Rhône", region: "mediterraneen" },
  { code: "14", nom: "Calvados", region: "oceanique" },
  { code: "15", nom: "Cantal", region: "montagne" },
  { code: "16", nom: "Charente", region: "oceanique" },
  { code: "17", nom: "Charente-Maritime", region: "oceanique" },
  { code: "18", nom: "Cher", region: "continental" },
  { code: "19", nom: "Corrèze", region: "oceanique" },
  { code: "2A", nom: "Corse-du-Sud", region: "mediterraneen" },
  { code: "2B", nom: "Haute-Corse", region: "mediterraneen" },
  { code: "21", nom: "Côte-d'Or", region: "continental" },
  { code: "22", nom: "Côtes-d'Armor", region: "oceanique" },
  { code: "23", nom: "Creuse", region: "continental" },
  { code: "24", nom: "Dordogne", region: "oceanique" },
  { code: "25", nom: "Doubs", region: "montagne" },
  { code: "26", nom: "Drôme", region: "continental" },
  { code: "27", nom: "Eure", region: "oceanique" },
  { code: "28", nom: "Eure-et-Loir", region: "continental" },
  { code: "29", nom: "Finistère", region: "oceanique" },
  { code: "30", nom: "Gard", region: "mediterraneen" },
  { code: "31", nom: "Haute-Garonne", region: "oceanique" },
  { code: "32", nom: "Gers", region: "oceanique" },
  { code: "33", nom: "Gironde", region: "oceanique" },
  { code: "34", nom: "Hérault", region: "mediterraneen" },
  { code: "35", nom: "Ille-et-Vilaine", region: "oceanique" },
  { code: "36", nom: "Indre", region: "continental" },
  { code: "37", nom: "Indre-et-Loire", region: "oceanique" },
  { code: "38", nom: "Isère", region: "montagne" },
  { code: "39", nom: "Jura", region: "montagne" },
  { code: "40", nom: "Landes", region: "oceanique" },
  { code: "41", nom: "Loir-et-Cher", region: "continental" },
  { code: "42", nom: "Loire", region: "continental" },
  { code: "43", nom: "Haute-Loire", region: "montagne" },
  { code: "44", nom: "Loire-Atlantique", region: "oceanique" },
  { code: "45", nom: "Loiret", region: "continental" },
  { code: "46", nom: "Lot", region: "oceanique" },
  { code: "47", nom: "Lot-et-Garonne", region: "oceanique" },
  { code: "48", nom: "Lozère", region: "montagne" },
  { code: "49", nom: "Maine-et-Loire", region: "oceanique" },
  { code: "50", nom: "Manche", region: "oceanique" },
  { code: "51", nom: "Marne", region: "continental" },
  { code: "52", nom: "Haute-Marne", region: "continental" },
  { code: "53", nom: "Mayenne", region: "oceanique" },
  { code: "54", nom: "Meurthe-et-Moselle", region: "continental" },
  { code: "55", nom: "Meuse", region: "continental" },
  { code: "56", nom: "Morbihan", region: "oceanique" },
  { code: "57", nom: "Moselle", region: "continental" },
  { code: "58", nom: "Nièvre", region: "continental" },
  { code: "59", nom: "Nord", region: "oceanique" },
  { code: "60", nom: "Oise", region: "continental" },
  { code: "61", nom: "Orne", region: "oceanique" },
  { code: "62", nom: "Pas-de-Calais", region: "oceanique" },
  { code: "63", nom: "Puy-de-Dôme", region: "montagne" },
  { code: "64", nom: "Pyrénées-Atlantiques", region: "oceanique" },
  { code: "65", nom: "Hautes-Pyrénées", region: "montagne" },
  { code: "66", nom: "Pyrénées-Orientales", region: "mediterraneen" },
  { code: "67", nom: "Bas-Rhin", region: "continental" },
  { code: "68", nom: "Haut-Rhin", region: "continental" },
  { code: "69", nom: "Rhône", region: "continental" },
  { code: "70", nom: "Haute-Saône", region: "continental" },
  { code: "71", nom: "Saône-et-Loire", region: "continental" },
  { code: "72", nom: "Sarthe", region: "oceanique" },
  { code: "73", nom: "Savoie", region: "montagne" },
  { code: "74", nom: "Haute-Savoie", region: "montagne" },
  { code: "75", nom: "Paris", region: "continental" },
  { code: "76", nom: "Seine-Maritime", region: "oceanique" },
  { code: "77", nom: "Seine-et-Marne", region: "continental" },
  { code: "78", nom: "Yvelines", region: "continental" },
  { code: "79", nom: "Deux-Sèvres", region: "oceanique" },
  { code: "80", nom: "Somme", region: "oceanique" },
  { code: "81", nom: "Tarn", region: "oceanique" },
  { code: "82", nom: "Tarn-et-Garonne", region: "oceanique" },
  { code: "83", nom: "Var", region: "mediterraneen" },
  { code: "84", nom: "Vaucluse", region: "mediterraneen" },
  { code: "85", nom: "Vendée", region: "oceanique" },
  { code: "86", nom: "Vienne", region: "oceanique" },
  { code: "87", nom: "Haute-Vienne", region: "oceanique" },
  { code: "88", nom: "Vosges", region: "montagne" },
  { code: "89", nom: "Yonne", region: "continental" },
  { code: "90", nom: "Territoire de Belfort", region: "continental" },
  { code: "91", nom: "Essonne", region: "continental" },
  { code: "92", nom: "Hauts-de-Seine", region: "continental" },
  { code: "93", nom: "Seine-Saint-Denis", region: "continental" },
  { code: "94", nom: "Val-de-Marne", region: "continental" },
  { code: "95", nom: "Val-d'Oise", region: "continental" }
];

function regionDuDepartement(code) {
  const dep = DEPARTEMENTS.find(d => d.code === code);
  return dep ? dep.region : null;
}

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
