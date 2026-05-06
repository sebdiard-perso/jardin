const CHOUX = [
  {
    nom: "Chou pommé", emoji: "🥬", groupe: "Chou", famille: "Brassicacées",
    variete: "Cœur de bœuf, Brunswick, Quintal d'Alsace",
    entreRangs: 60, entrePlants: 50,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["argileux", "limoneux", "calcaire"], solEviter: ["sableux"],
    semisInterieur: [1, 2, 3], semisExterieur: [3, 4, 5], plantation: [3, 4, 5, 6], recolte: [6, 7, 8, 9, 10, 11],
    dureeJours: 120,
    conseil: "Gourmand en compost. Surveiller les piérides.",
    entretiens: [
      { mois: [4, 5, 6], tache: "Surveiller les chenilles de piérides" },
      { mois: [5, 6, 7], tache: "Arroser régulièrement" },
      { mois: [4, 5], tache: "Pailler le pied" },
      { mois: [6], tache: "Apport de purin d'ortie" }
    ],
    bonsVoisins: ["Laitue pommée", "Épinard de printemps", "Betterave ronde", "Oignon jaune"],
    mauvaisVoisins: ["Tomate classique", "Fraisier remontant", "Radis rond", "Ail blanc"]
  },
  {
    nom: "Chou-fleur", emoji: "🥦", groupe: "Chou", famille: "Brassicacées",
    variete: "Merveille de toutes saisons, Snowball, Romanesco",
    entreRangs: 70, entrePlants: 60,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["argileux", "limoneux"], solEviter: ["sableux"],
    semisInterieur: [1, 2], semisExterieur: [3, 4], plantation: [3, 4, 5], recolte: [6, 7, 8, 9, 10],
    dureeJours: 150,
    conseil: "Protéger la pomme du soleil en rabattant les feuilles dessus.",
    entretiens: [
      { mois: [5, 6, 7], tache: "Arroser abondamment" },
      { mois: [6, 7], tache: "Rabattre les feuilles sur la pomme" },
      { mois: [5, 6], tache: "Surveiller les piérides" }
    ],
    bonsVoisins: ["Laitue pommée", "Épinard de printemps", "Betterave ronde", "Oignon jaune"],
    mauvaisVoisins: ["Tomate classique", "Fraisier remontant", "Radis rond"]
  },
  {
    nom: "Brocoli", emoji: "🥦", groupe: "Chou", famille: "Brassicacées",
    variete: "Calabrais, Marathon, Waltham",
    entreRangs: 60, entrePlants: 50,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["argileux", "limoneux"], solEviter: ["sableux"],
    semisInterieur: [2, 3], semisExterieur: [4, 5], plantation: [4, 5, 6], recolte: [7, 8, 9, 10],
    dureeJours: 100,
    conseil: "Couper la pomme centrale, les pousses latérales continuent à produire.",
    entretiens: [
      { mois: [5, 6, 7], tache: "Arroser régulièrement" },
      { mois: [5, 6], tache: "Surveiller les piérides" },
      { mois: [7, 8, 9], tache: "Récolter les pousses latérales" }
    ],
    bonsVoisins: ["Laitue pommée", "Épinard de printemps", "Betterave ronde", "Oignon jaune"],
    mauvaisVoisins: ["Tomate classique", "Fraisier remontant", "Radis rond"]
  },
  {
    nom: "Chou kale", emoji: "🥬", groupe: "Chou", famille: "Brassicacées",
    variete: "Westlandse Winter, Red Russian, Nero di Toscana",
    entreRangs: 50, entrePlants: 40,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["argileux", "limoneux", "humifère"], solEviter: ["sableux"],
    semisInterieur: [2, 3], semisExterieur: [4, 5], plantation: [4, 5, 6], recolte: [8, 9, 10, 11, 0, 1],
    dureeJours: 90,
    conseil: "Très rustique, résiste au gel. Meilleur après les premières gelées.",
    entretiens: [
      { mois: [5, 6, 7], tache: "Arroser régulièrement" },
      { mois: [5, 6], tache: "Surveiller les piérides" },
      { mois: [8, 9, 10, 11], tache: "Récolter les feuilles du bas" }
    ],
    bonsVoisins: ["Laitue pommée", "Épinard d'automne", "Betterave ronde", "Oignon jaune"],
    mauvaisVoisins: ["Tomate classique", "Fraisier remontant", "Radis rond"]
  }
];
