const BASILICS = [
  {
    nom: "Basilic grand vert", emoji: "🌿", groupe: "Basilic", famille: "Lamiacées",
    variete: "Grand vert, Genovese",
    entreRangs: 30, entrePlants: 25,
    soleil: { matin: 3, apresMidi: 4, tolereChaleur: true },
    sol: ["limoneux", "humifère"], solEviter: ["argileux"],
    semisInterieur: [2, 3], semisExterieur: [4, 5], plantation: [4, 5], recolte: [5, 6, 7, 8, 9],
    dureeJours: 70,
    conseil: "Le classique pour le pesto. Pincer les fleurs.",
    entretiens: [
      { mois: [5, 6, 7, 8], tache: "Pincer les fleurs" },
      { mois: [5, 6, 7, 8], tache: "Arroser sans mouiller le feuillage" }
    ],
    bonsVoisins: ["Tomate classique", "Poivron doux", "Aubergine", "Courgette classique"],
    mauvaisVoisins: []
  },
  {
    nom: "Basilic pourpre", emoji: "🌿", groupe: "Basilic", famille: "Lamiacées",
    variete: "Purple Ruffles, Dark Opal",
    entreRangs: 30, entrePlants: 25,
    soleil: { matin: 3, apresMidi: 4, tolereChaleur: true },
    sol: ["limoneux", "humifère"], solEviter: ["argileux"],
    semisInterieur: [2, 3], semisExterieur: [4, 5], plantation: [4, 5], recolte: [5, 6, 7, 8, 9],
    dureeJours: 75,
    conseil: "Décoratif et aromatique. Saveur plus épicée.",
    entretiens: [
      { mois: [5, 6, 7, 8], tache: "Pincer les fleurs" },
      { mois: [5, 6, 7, 8], tache: "Arroser sans mouiller le feuillage" }
    ],
    bonsVoisins: ["Tomate classique", "Poivron doux", "Aubergine", "Courgette classique"],
    mauvaisVoisins: []
  }
];

const PERSILS = [
  {
    nom: "Persil plat", emoji: "🌿", groupe: "Persil", famille: "Apiacées",
    variete: "Géant d'Italie, Commun",
    entreRangs: 25, entrePlants: 10,
    soleil: { matin: 3, apresMidi: 0, tolereChaleur: false },
    sol: ["humifère", "limoneux"], solEviter: [],
    semisInterieur: [1, 2], semisExterieur: [3, 4, 5, 6], plantation: [], recolte: [4, 5, 6, 7, 8, 9, 10],
    dureeJours: 80,
    conseil: "Plus parfumé que le frisé. Tremper les graines 24h avant semis.",
    entretiens: [
      { mois: [4, 5, 6, 7], tache: "Arroser régulièrement" },
      { mois: [4, 5], tache: "Désherber entre les rangs" }
    ],
    bonsVoisins: ["Tomate classique", "Radis rond"],
    mauvaisVoisins: ["Laitue pommée", "Carotte de saison"]
  },
  {
    nom: "Persil frisé", emoji: "🌿", groupe: "Persil", famille: "Apiacées",
    variete: "Frisé vert foncé, Moss Curled",
    entreRangs: 25, entrePlants: 10,
    soleil: { matin: 3, apresMidi: 0, tolereChaleur: false },
    sol: ["humifère", "limoneux"], solEviter: [],
    semisInterieur: [1, 2], semisExterieur: [3, 4, 5, 6], plantation: [], recolte: [4, 5, 6, 7, 8, 9, 10],
    dureeJours: 85,
    conseil: "Décoratif. Idéal en bordure de planche.",
    entretiens: [
      { mois: [4, 5, 6, 7], tache: "Arroser régulièrement" },
      { mois: [4, 5], tache: "Désherber entre les rangs" }
    ],
    bonsVoisins: ["Tomate classique", "Radis rond"],
    mauvaisVoisins: ["Laitue pommée", "Carotte de saison"]
  }
];

const FRAISIERS = [
  {
    nom: "Fraisier non-remontant", emoji: "🍓", groupe: "Fraisier", famille: "Rosacées",
    variete: "Gariguette, Ciflorette, Darselect",
    entreRangs: 40, entrePlants: 30,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["humifère", "limoneux", "sableux"], solEviter: ["calcaire"],
    semisInterieur: [], semisExterieur: [], plantation: [8, 9], recolte: [4, 5, 6],
    dureeJours: 365,
    conseil: "Une seule grosse récolte au printemps. Fruits savoureux.",
    entretiens: [
      { mois: [2, 3], tache: "Nettoyer les feuilles sèches" },
      { mois: [3, 4], tache: "Pailler abondamment" },
      { mois: [4, 5, 6], tache: "Arroser régulièrement" },
      { mois: [6, 7, 8], tache: "Couper les stolons sauf multiplication" }
    ],
    bonsVoisins: ["Laitue pommée", "Oignon jaune", "Épinard de printemps", "Ail blanc"],
    mauvaisVoisins: ["Chou pommé"]
  },
  {
    nom: "Fraisier remontant", emoji: "🍓", groupe: "Fraisier", famille: "Rosacées",
    variete: "Mara des bois, Charlotte, Maestro",
    entreRangs: 40, entrePlants: 30,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["humifère", "limoneux", "sableux"], solEviter: ["calcaire"],
    semisInterieur: [], semisExterieur: [], plantation: [2, 3, 8, 9], recolte: [5, 6, 7, 8, 9, 10],
    dureeJours: 365,
    conseil: "Produit de mai à octobre. Fruits plus petits mais récolte étalée.",
    entretiens: [
      { mois: [2, 3], tache: "Nettoyer les feuilles sèches" },
      { mois: [3, 4], tache: "Pailler abondamment" },
      { mois: [4, 5, 6, 7, 8, 9], tache: "Arroser régulièrement" },
      { mois: [6, 7, 8], tache: "Couper les stolons sauf multiplication" }
    ],
    bonsVoisins: ["Laitue pommée", "Oignon jaune", "Épinard de printemps", "Ail blanc"],
    mauvaisVoisins: ["Chou pommé"]
  }
];

const BETTERAVES = [
  {
    nom: "Betterave ronde", emoji: "🟣", groupe: "Betterave", famille: "Chénopodiacées",
    variete: "Détroit, Chioggia, Bull's Blood",
    entreRangs: 30, entrePlants: 10,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["limoneux", "humifère", "argileux"], solEviter: [],
    semisInterieur: [], semisExterieur: [3, 4, 5, 6], plantation: [], recolte: [6, 7, 8, 9, 10],
    dureeJours: 90,
    conseil: "La plus courante. Éclaircir à 10 cm.",
    entretiens: [
      { mois: [4, 5], tache: "Éclaircir à 10 cm" },
      { mois: [5, 6, 7], tache: "Désherber et biner" },
      { mois: [6, 7, 8], tache: "Arroser régulièrement" }
    ],
    bonsVoisins: ["Oignon jaune", "Chou pommé", "Laitue pommée", "Ail blanc"],
    mauvaisVoisins: ["Tomate classique", "Carotte de saison", "Épinard de printemps"]
  },
  {
    nom: "Betterave longue", emoji: "🟣", groupe: "Betterave", famille: "Chénopodiacées",
    variete: "Crapaudine, Cylindra",
    entreRangs: 30, entrePlants: 12,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["limoneux", "humifère"], solEviter: ["argileux"],
    semisInterieur: [], semisExterieur: [4, 5, 6], plantation: [], recolte: [8, 9, 10, 11],
    dureeJours: 120,
    conseil: "Forme allongée, bonne conservation. Sol profond et meuble.",
    entretiens: [
      { mois: [5, 6], tache: "Éclaircir à 12 cm" },
      { mois: [6, 7, 8], tache: "Désherber et biner" },
      { mois: [7, 8, 9], tache: "Arroser régulièrement" }
    ],
    bonsVoisins: ["Oignon jaune", "Chou pommé", "Laitue pommée", "Ail blanc"],
    mauvaisVoisins: ["Tomate classique", "Carotte de saison", "Épinard de printemps"]
  }
];
