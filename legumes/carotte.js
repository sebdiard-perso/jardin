const CAROTTES = [
  {
    nom: "Carotte précoce", emoji: "🥕", groupe: "Carotte", famille: "Apiacées",
    variete: "Nantaise améliorée, Presto, Amsterdam",
    entreRangs: 25, entrePlants: 4,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["sableux", "limoneux"], solEviter: ["argileux", "calcaire"],
    semisInterieur: [], semisExterieur: [2, 3, 4], plantation: [], recolte: [5, 6, 7],
    dureeJours: 80,
    conseil: "Petite racine, récolte rapide. Idéale en primeur.",
    entretiens: [
      { mois: [3, 4], tache: "Éclaircir à 4 cm" },
      { mois: [4, 5, 6], tache: "Désherber et biner" },
      { mois: [5, 6], tache: "Arroser régulièrement" }
    ],
    bonsVoisins: ["Tomate classique", "Oignon", "Poireau d'hiver", "Radis rond", "Laitue pommée", "Petit pois nain"],
    mauvaisVoisins: ["Betterave ronde", "Persil plat"]
  },
  {
    nom: "Carotte de saison", emoji: "🥕", groupe: "Carotte", famille: "Apiacées",
    variete: "Nantaise, Touchon, Chantenay",
    entreRangs: 25, entrePlants: 5,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["sableux", "limoneux"], solEviter: ["argileux", "calcaire"],
    semisInterieur: [], semisExterieur: [3, 4, 5, 6], plantation: [], recolte: [6, 7, 8, 9, 10],
    dureeJours: 120,
    conseil: "La plus courante. Sol meuble et sans cailloux impératif.",
    entretiens: [
      { mois: [4, 5], tache: "Éclaircir à 5 cm" },
      { mois: [5, 6, 7], tache: "Désherber et biner" },
      { mois: [6, 7, 8], tache: "Arroser régulièrement" }
    ],
    bonsVoisins: ["Tomate classique", "Oignon", "Poireau d'hiver", "Radis rond", "Laitue pommée", "Petit pois nain"],
    mauvaisVoisins: ["Betterave ronde", "Persil plat"]
  },
  {
    nom: "Carotte de conservation", emoji: "🥕", groupe: "Carotte", famille: "Apiacées",
    variete: "Colmar, Flakkee, Autumn King",
    entreRangs: 30, entrePlants: 6,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["sableux", "limoneux"], solEviter: ["argileux", "calcaire"],
    semisInterieur: [], semisExterieur: [4, 5, 6], plantation: [], recolte: [8, 9, 10, 11],
    dureeJours: 160,
    conseil: "Grosse racine, se conserve tout l'hiver en silo ou cave.",
    entretiens: [
      { mois: [5, 6], tache: "Éclaircir à 6 cm" },
      { mois: [6, 7, 8], tache: "Désherber et biner" },
      { mois: [7, 8, 9], tache: "Arroser régulièrement" },
      { mois: [10, 11], tache: "Récolter avant les fortes gelées" }
    ],
    bonsVoisins: ["Tomate classique", "Oignon", "Poireau d'hiver", "Radis rond", "Laitue pommée", "Petit pois nain"],
    mauvaisVoisins: ["Betterave ronde", "Persil plat"]
  }
];
