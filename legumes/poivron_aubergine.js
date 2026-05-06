const POIVRONS = [
  {
    nom: "Poivron doux", emoji: "🫑", groupe: "Poivron", famille: "Solanacées",
    variete: "California Wonder, Lamuyo, Yolo Wonder",
    entreRangs: 50, entrePlants: 50,
    soleil: { matin: 3, apresMidi: 5, tolereChaleur: true },
    sol: ["limoneux", "humifère"], solEviter: ["calcaire"],
    semisInterieur: [1, 2, 3], semisExterieur: [], plantation: [4, 5], recolte: [7, 8, 9],
    dureeJours: 160,
    conseil: "Gros fruits. Récolter vert ou attendre le rouge pour plus de douceur.",
    entretiens: [
      { mois: [5, 6, 7, 8], tache: "Arroser régulièrement au pied" },
      { mois: [6, 7], tache: "Apport d'engrais riche en potasse" },
      { mois: [5], tache: "Pailler le pied" }
    ],
    bonsVoisins: ["Basilic grand vert", "Carotte de saison", "Oignon"],
    mauvaisVoisins: ["Aubergine", "Tomate classique"]
  },
  {
    nom: "Piment", emoji: "🌶️", groupe: "Poivron", famille: "Solanacées",
    variete: "Cayenne, Espelette, Jalapeño, Habanero",
    entreRangs: 50, entrePlants: 40,
    soleil: { matin: 3, apresMidi: 5, tolereChaleur: true },
    sol: ["limoneux", "sableux"], solEviter: ["calcaire"],
    semisInterieur: [1, 2], semisExterieur: [], plantation: [4, 5], recolte: [7, 8, 9, 10],
    dureeJours: 150,
    conseil: "Très frileux. Semer tôt en intérieur. Sécher les fruits pour conservation.",
    entretiens: [
      { mois: [5, 6, 7, 8], tache: "Arroser modérément (le stress hydrique augmente le piquant)" },
      { mois: [5], tache: "Pailler le pied" },
      { mois: [8, 9], tache: "Récolter et faire sécher" }
    ],
    bonsVoisins: ["Basilic grand vert", "Carotte de saison", "Oignon"],
    mauvaisVoisins: ["Aubergine", "Tomate classique"]
  }
];

const AUBERGINES = [
  {
    nom: "Aubergine", emoji: "🍆", groupe: "Aubergine", famille: "Solanacées",
    variete: "Black Beauty, Barbentane, Violette de Florence",
    entreRangs: 60, entrePlants: 50,
    soleil: { matin: 3, apresMidi: 5, tolereChaleur: true },
    sol: ["limoneux", "humifère"], solEviter: ["argileux", "calcaire"],
    semisInterieur: [1, 2, 3], semisExterieur: [], plantation: [4, 5], recolte: [7, 8, 9],
    dureeJours: 170,
    conseil: "Très frileuse. Sol riche et exposition chaude indispensables.",
    entretiens: [
      { mois: [5, 6, 7, 8], tache: "Arroser régulièrement" },
      { mois: [6, 7], tache: "Apport de compost ou purin de consoude" },
      { mois: [5], tache: "Pailler le pied" }
    ],
    bonsVoisins: ["Basilic grand vert", "Haricot nain", "Laitue pommée"],
    mauvaisVoisins: ["Poivron doux", "Tomate classique"]
  }
];
