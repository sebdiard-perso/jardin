const OIGNONS = [
  {
    nom: "Oignon jaune", emoji: "🧅", groupe: "Oignon", famille: "Alliacées",
    variete: "Stuttgarter, Jaune paille des Vertus, Centurion",
    entreRangs: 25, entrePlants: 10,
    soleil: { matin: 3, apresMidi: 4, tolereChaleur: true },
    sol: ["limoneux", "sableux"], solEviter: ["humifère"],
    semisInterieur: [0, 1], semisExterieur: [2, 3], plantation: [2, 3, 9, 10], recolte: [6, 7, 8],
    dureeJours: 150,
    conseil: "Le plus courant. Bonne conservation. Cesser l'arrosage quand le feuillage jaunit.",
    entretiens: [
      { mois: [3, 4, 5], tache: "Désherber entre les rangs" },
      { mois: [6], tache: "Cesser l'arrosage" },
      { mois: [6, 7], tache: "Coucher les fanes pour accélérer le séchage" }
    ],
    bonsVoisins: ["Carotte de saison", "Tomate classique", "Laitue pommée", "Fraisier remontant", "Betterave ronde"],
    mauvaisVoisins: ["Haricot nain", "Petit pois nain"]
  },
  {
    nom: "Oignon rouge", emoji: "🧅", groupe: "Oignon", famille: "Alliacées",
    variete: "Rouge de Florence, Red Baron, Tropea",
    entreRangs: 25, entrePlants: 10,
    soleil: { matin: 3, apresMidi: 4, tolereChaleur: true },
    sol: ["limoneux", "sableux"], solEviter: ["humifère"],
    semisInterieur: [0, 1], semisExterieur: [2, 3], plantation: [2, 3], recolte: [6, 7, 8],
    dureeJours: 140,
    conseil: "Plus doux que le jaune. Se conserve moins longtemps.",
    entretiens: [
      { mois: [3, 4, 5], tache: "Désherber entre les rangs" },
      { mois: [6], tache: "Cesser l'arrosage" },
      { mois: [6, 7], tache: "Coucher les fanes" }
    ],
    bonsVoisins: ["Carotte de saison", "Tomate classique", "Laitue pommée", "Fraisier remontant", "Betterave ronde"],
    mauvaisVoisins: ["Haricot nain", "Petit pois nain"]
  },
  {
    nom: "Oignon blanc", emoji: "🧅", groupe: "Oignon", famille: "Alliacées",
    variete: "Blanc de Paris, Snowball, De Vaugirard",
    entreRangs: 20, entrePlants: 8,
    soleil: { matin: 3, apresMidi: 3, tolereChaleur: true },
    sol: ["limoneux", "sableux"], solEviter: ["humifère"],
    semisInterieur: [], semisExterieur: [8, 9], plantation: [8, 9], recolte: [3, 4, 5],
    dureeJours: 180,
    conseil: "Semé en automne, récolté au printemps. Frais, ne se conserve pas.",
    entretiens: [
      { mois: [9, 10], tache: "Désherber" },
      { mois: [2, 3], tache: "Désherber au redémarrage" },
      { mois: [3, 4], tache: "Récolter en frais" }
    ],
    bonsVoisins: ["Carotte de saison", "Tomate classique", "Laitue pommée", "Fraisier remontant"],
    mauvaisVoisins: ["Haricot nain", "Petit pois nain"]
  }
];

const AULX = [
  {
    nom: "Ail blanc", emoji: "🧄", groupe: "Ail", famille: "Alliacées",
    variete: "Messidrome, Thermidrome, Blanc de Lomagne",
    entreRangs: 25, entrePlants: 12,
    soleil: { matin: 3, apresMidi: 4, tolereChaleur: true },
    sol: ["sableux", "limoneux", "calcaire"], solEviter: ["humifère"],
    semisInterieur: [], semisExterieur: [], plantation: [9, 10, 11], recolte: [5, 6, 7],
    dureeJours: 240,
    conseil: "Planter en automne. Bonne conservation (6-8 mois).",
    entretiens: [
      { mois: [2, 3, 4], tache: "Désherber entre les rangs" },
      { mois: [4, 5], tache: "Ne pas arroser" },
      { mois: [4], tache: "Supprimer les hampes florales" }
    ],
    bonsVoisins: ["Carotte de saison", "Tomate classique", "Fraisier remontant", "Betterave ronde"],
    mauvaisVoisins: ["Haricot nain", "Petit pois nain", "Chou pommé"]
  },
  {
    nom: "Ail rose", emoji: "🧄", groupe: "Ail", famille: "Alliacées",
    variete: "Rose de Lautrec, Flavor, Sprint",
    entreRangs: 25, entrePlants: 12,
    soleil: { matin: 3, apresMidi: 4, tolereChaleur: true },
    sol: ["sableux", "limoneux"], solEviter: ["humifère"],
    semisInterieur: [], semisExterieur: [], plantation: [1, 2, 3], recolte: [6, 7],
    dureeJours: 150,
    conseil: "Planter au printemps. Saveur plus douce. Conservation 4-6 mois.",
    entretiens: [
      { mois: [3, 4], tache: "Désherber entre les rangs" },
      { mois: [5, 6], tache: "Ne pas arroser" },
      { mois: [5], tache: "Supprimer les hampes florales" }
    ],
    bonsVoisins: ["Carotte de saison", "Tomate classique", "Fraisier remontant", "Betterave ronde"],
    mauvaisVoisins: ["Haricot nain", "Petit pois nain", "Chou pommé"]
  }
];

const POIREAUX = [
  {
    nom: "Poireau d'été", emoji: "🥬", groupe: "Poireau", famille: "Alliacées",
    variete: "Gros Long d'Été, Electra, Carlton",
    entreRangs: 30, entrePlants: 12,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["limoneux", "humifère", "argileux"], solEviter: [],
    semisInterieur: [0, 1], semisExterieur: [2, 3], plantation: [3, 4, 5], recolte: [6, 7, 8, 9],
    dureeJours: 140,
    conseil: "Fût plus court mais récolte précoce dès l'été.",
    entretiens: [
      { mois: [4, 5, 6], tache: "Butter régulièrement" },
      { mois: [5, 6, 7], tache: "Arroser en cas de sécheresse" },
      { mois: [5, 6], tache: "Désherber entre les rangs" }
    ],
    bonsVoisins: ["Carotte de saison", "Tomate classique", "Laitue pommée", "Fraisier remontant"],
    mauvaisVoisins: ["Haricot nain", "Petit pois nain"]
  },
  {
    nom: "Poireau d'hiver", emoji: "🥬", groupe: "Poireau", famille: "Alliacées",
    variete: "Bleu de Solaise, Monstrueux de Carentan, Hannibal",
    entreRangs: 30, entrePlants: 12,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["limoneux", "humifère", "argileux"], solEviter: [],
    semisInterieur: [1, 2], semisExterieur: [2, 3, 4], plantation: [5, 6, 7], recolte: [9, 10, 11, 0, 1, 2],
    dureeJours: 200,
    conseil: "Résiste au gel. Récolte tout l'hiver. Long fût blanc.",
    entretiens: [
      { mois: [6, 7, 8], tache: "Butter régulièrement" },
      { mois: [7, 8], tache: "Arroser en cas de sécheresse" },
      { mois: [7, 8], tache: "Désherber entre les rangs" }
    ],
    bonsVoisins: ["Carotte de saison", "Tomate classique", "Laitue pommée", "Fraisier remontant"],
    mauvaisVoisins: ["Haricot nain", "Petit pois nain"]
  }
];
