const RADIS = [
  {
    nom: "Radis rond", emoji: "🔴", groupe: "Radis", famille: "Brassicacées",
    variete: "Cherry Belle, Gaudry, National, Flamboyant",
    entreRangs: 15, entrePlants: 3,
    soleil: { matin: 3, apresMidi: 1, tolereChaleur: false },
    sol: ["sableux", "limoneux", "humifère"], solEviter: [],
    semisInterieur: [], semisExterieur: [2, 3, 4, 5, 6, 7, 8], plantation: [], recolte: [3, 4, 5, 6, 7, 8, 9],
    dureeJours: 25,
    conseil: "Le plus rapide du potager. Semer peu profond.",
    entretiens: [
      { mois: [2, 3, 4, 5, 6, 7], tache: "Ressemer toutes les 2 semaines" },
      { mois: [3, 4, 5], tache: "Éclaircir à 3 cm" },
      { mois: [5, 6, 7], tache: "Arroser pour éviter le goût piquant" }
    ],
    bonsVoisins: ["Carotte de saison", "Laitue pommée", "Tomate classique", "Haricot nain", "Petit pois nain"],
    mauvaisVoisins: ["Chou pommé"]
  },
  {
    nom: "Radis long", emoji: "🔴", groupe: "Radis", famille: "Brassicacées",
    variete: "18 jours, French Breakfast, Chandelle de feu",
    entreRangs: 15, entrePlants: 4,
    soleil: { matin: 3, apresMidi: 1, tolereChaleur: false },
    sol: ["sableux", "limoneux"], solEviter: ["argileux"],
    semisInterieur: [], semisExterieur: [2, 3, 4, 5, 6, 7], plantation: [], recolte: [3, 4, 5, 6, 7, 8],
    dureeJours: 30,
    conseil: "Forme allongée. Sol meuble nécessaire pour un bon développement.",
    entretiens: [
      { mois: [2, 3, 4, 5, 6], tache: "Ressemer toutes les 2 semaines" },
      { mois: [3, 4, 5], tache: "Éclaircir à 4 cm" },
      { mois: [5, 6, 7], tache: "Arroser régulièrement" }
    ],
    bonsVoisins: ["Carotte de saison", "Laitue pommée", "Tomate classique", "Haricot nain", "Petit pois nain"],
    mauvaisVoisins: ["Chou pommé"]
  },
  {
    nom: "Radis d'hiver", emoji: "🔴", groupe: "Radis", famille: "Brassicacées",
    variete: "Noir long, Rose de Chine, Violet de Gournay",
    entreRangs: 25, entrePlants: 10,
    soleil: { matin: 3, apresMidi: 2, tolereChaleur: false },
    sol: ["limoneux", "humifère"], solEviter: [],
    semisInterieur: [], semisExterieur: [6, 7, 8], plantation: [], recolte: [9, 10, 11],
    dureeJours: 80,
    conseil: "Gros radis de conservation. Semer en été pour récolte d'automne.",
    entretiens: [
      { mois: [7, 8], tache: "Éclaircir à 10 cm" },
      { mois: [8, 9], tache: "Arroser régulièrement" },
      { mois: [10, 11], tache: "Récolter avant les fortes gelées" }
    ],
    bonsVoisins: ["Carotte de saison", "Laitue pommée", "Tomate classique"],
    mauvaisVoisins: ["Chou pommé"]
  }
];
