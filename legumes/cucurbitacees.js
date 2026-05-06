const CONCOMBRES = [
  {
    nom: "Concombre", emoji: "🥒", groupe: "Concombre", famille: "Cucurbitacées",
    variete: "Marketmore, Long vert, Tanja",
    entreRangs: 80, entrePlants: 60,
    soleil: { matin: 3, apresMidi: 5, tolereChaleur: true },
    sol: ["humifère", "limoneux"], solEviter: ["argileux"],
    semisInterieur: [3, 4], semisExterieur: [4, 5], plantation: [4, 5], recolte: [6, 7, 8, 9],
    dureeJours: 90,
    conseil: "Palisser pour gagner de la place. Arroser au pied.",
    entretiens: [
      { mois: [5], tache: "Installer les supports/palissage" },
      { mois: [5, 6, 7, 8], tache: "Arroser au pied régulièrement" },
      { mois: [6, 7, 8], tache: "Récolter tous les 2 jours" }
    ],
    bonsVoisins: ["Haricot nain", "Laitue pommée", "Oignon jaune", "Petit pois nain"],
    mauvaisVoisins: ["Tomate classique", "Courgette classique", "Potiron"]
  },
  {
    nom: "Cornichon", emoji: "🥒", groupe: "Concombre", famille: "Cucurbitacées",
    variete: "Vert petit de Paris, Fin de Meaux",
    entreRangs: 60, entrePlants: 50,
    soleil: { matin: 3, apresMidi: 5, tolereChaleur: true },
    sol: ["humifère", "limoneux"], solEviter: ["argileux"],
    semisInterieur: [3, 4], semisExterieur: [4, 5], plantation: [4, 5], recolte: [6, 7, 8, 9],
    dureeJours: 70,
    conseil: "Récolter très jeune (5-8 cm) pour les conserves au vinaigre.",
    entretiens: [
      { mois: [5], tache: "Installer un grillage de palissage" },
      { mois: [5, 6, 7, 8], tache: "Arroser au pied" },
      { mois: [6, 7, 8], tache: "Récolter chaque jour" }
    ],
    bonsVoisins: ["Haricot nain", "Laitue pommée", "Oignon jaune"],
    mauvaisVoisins: ["Tomate classique", "Courgette classique", "Potiron"]
  }
];

const POTIRONS = [
  {
    nom: "Potiron", emoji: "🎃", groupe: "Courge", famille: "Cucurbitacées",
    variete: "Rouge vif d'Étampes, Potimarron, Bleu de Hongrie",
    entreRangs: 150, entrePlants: 150,
    soleil: { matin: 3, apresMidi: 5, tolereChaleur: true },
    sol: ["humifère", "limoneux"], solEviter: ["sableux"],
    semisInterieur: [3, 4], semisExterieur: [4, 5], plantation: [5], recolte: [8, 9, 10],
    dureeJours: 140,
    conseil: "Plante coureuse, prévoir 2m². Récolter quand le pédoncule est sec.",
    entretiens: [
      { mois: [5, 6, 7], tache: "Arroser abondamment" },
      { mois: [6], tache: "Pailler le pied" },
      { mois: [6, 7], tache: "Pincer après 2-3 fruits par pied" },
      { mois: [7, 8], tache: "Glisser une tuile sous chaque fruit" }
    ],
    bonsVoisins: ["Haricot nain", "Petit pois nain", "Oignon jaune"],
    mauvaisVoisins: ["Courgette classique", "Concombre"]
  },
  {
    nom: "Butternut", emoji: "🎃", groupe: "Courge", famille: "Cucurbitacées",
    variete: "Butternut, Waltham, Hunter",
    entreRangs: 150, entrePlants: 120,
    soleil: { matin: 3, apresMidi: 5, tolereChaleur: true },
    sol: ["humifère", "limoneux"], solEviter: ["sableux"],
    semisInterieur: [3, 4], semisExterieur: [4, 5], plantation: [5], recolte: [9, 10],
    dureeJours: 160,
    conseil: "Chair douce et fondante. Se conserve 6 mois. Laisser mûrir sur pied.",
    entretiens: [
      { mois: [5, 6, 7, 8], tache: "Arroser abondamment" },
      { mois: [6], tache: "Pailler le pied" },
      { mois: [6, 7], tache: "Pincer après 3-4 fruits" },
      { mois: [8, 9], tache: "Glisser une tuile sous chaque fruit" }
    ],
    bonsVoisins: ["Haricot nain", "Petit pois nain", "Oignon jaune"],
    mauvaisVoisins: ["Courgette classique", "Concombre"]
  }
];
