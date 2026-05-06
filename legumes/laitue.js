const LAITUES = [
  {
    nom: "Laitue pommée", emoji: "🥬", groupe: "Laitue", famille: "Astéracées",
    variete: "Appia, Reine de Mai, Merveille des 4 saisons",
    entreRangs: 30, entrePlants: 25,
    soleil: { matin: 4, apresMidi: 0, tolereChaleur: false },
    sol: ["limoneux", "humifère"], solEviter: [],
    semisInterieur: [1, 2], semisExterieur: [2, 3, 4, 5, 6, 7], plantation: [2, 3, 4, 5, 6, 7], recolte: [3, 4, 5, 6, 7, 8, 9],
    dureeJours: 60,
    conseil: "Forme une pomme serrée. Récolter entière quand la pomme est ferme.",
    entretiens: [
      { mois: [3, 4, 5, 6], tache: "Ressemer toutes les 3 semaines" },
      { mois: [5, 6, 7], tache: "Arroser pour éviter la montée en graines" },
      { mois: [3, 4, 5], tache: "Protéger des limaces" }
    ],
    bonsVoisins: ["Carotte de saison", "Radis rond", "Fraisier remontant", "Chou pommé", "Oignon"],
    mauvaisVoisins: ["Persil plat"]
  },
  {
    nom: "Laitue batavia", emoji: "🥬", groupe: "Laitue", famille: "Astéracées",
    variete: "Batavia dorée, Kamikaze, Grenobloise",
    entreRangs: 30, entrePlants: 25,
    soleil: { matin: 4, apresMidi: 1, tolereChaleur: false },
    sol: ["limoneux", "humifère"], solEviter: [],
    semisInterieur: [1, 2], semisExterieur: [2, 3, 4, 5, 6, 7, 8], plantation: [2, 3, 4, 5, 6, 7, 8], recolte: [4, 5, 6, 7, 8, 9, 10],
    dureeJours: 55,
    conseil: "Plus résistante à la chaleur que la pommée. Feuilles croquantes.",
    entretiens: [
      { mois: [3, 4, 5, 6, 7], tache: "Ressemer toutes les 3 semaines" },
      { mois: [5, 6, 7], tache: "Arroser régulièrement" },
      { mois: [3, 4, 5], tache: "Protéger des limaces" }
    ],
    bonsVoisins: ["Carotte de saison", "Radis rond", "Fraisier remontant", "Chou pommé", "Oignon"],
    mauvaisVoisins: ["Persil plat"]
  },
  {
    nom: "Laitue feuille de chêne", emoji: "🥬", groupe: "Laitue", famille: "Astéracées",
    variete: "Feuille de chêne rouge, Salad Bowl",
    entreRangs: 25, entrePlants: 20,
    soleil: { matin: 3, apresMidi: 0, tolereChaleur: false },
    sol: ["limoneux", "humifère"], solEviter: [],
    semisInterieur: [1, 2], semisExterieur: [2, 3, 4, 5, 6, 7, 8], plantation: [2, 3, 4, 5, 6, 7, 8], recolte: [3, 4, 5, 6, 7, 8, 9, 10],
    dureeJours: 45,
    conseil: "Récolter feuille par feuille, le pied repousse. Très rapide.",
    entretiens: [
      { mois: [3, 4, 5, 6, 7], tache: "Ressemer toutes les 2 semaines" },
      { mois: [5, 6, 7], tache: "Arroser pour éviter la montée en graines" }
    ],
    bonsVoisins: ["Carotte de saison", "Radis rond", "Fraisier remontant", "Chou pommé", "Oignon"],
    mauvaisVoisins: ["Persil plat"]
  }
];
