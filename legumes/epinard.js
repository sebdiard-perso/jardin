const EPINARDS = [
  {
    nom: "Épinard de printemps", emoji: "🥬", groupe: "Épinard", famille: "Chénopodiacées",
    variete: "Géant d'hiver, Viking, Matador",
    entreRangs: 25, entrePlants: 10,
    soleil: { matin: 3, apresMidi: 0, tolereChaleur: false },
    sol: ["humifère", "limoneux", "argileux"], solEviter: [],
    semisInterieur: [], semisExterieur: [2, 3, 4], plantation: [], recolte: [3, 4, 5, 6],
    dureeJours: 45,
    conseil: "Semer tôt, monte vite en graines dès les chaleurs.",
    entretiens: [
      { mois: [3, 4], tache: "Désherber entre les rangs" },
      { mois: [4, 5], tache: "Arroser si temps sec" }
    ],
    bonsVoisins: ["Fraisier remontant", "Radis rond", "Chou pommé", "Laitue pommée"],
    mauvaisVoisins: ["Betterave ronde"]
  },
  {
    nom: "Épinard d'automne", emoji: "🥬", groupe: "Épinard", famille: "Chénopodiacées",
    variete: "Monstrueux de Viroflay, Butterflay",
    entreRangs: 25, entrePlants: 10,
    soleil: { matin: 3, apresMidi: 0, tolereChaleur: false },
    sol: ["humifère", "limoneux", "argileux"], solEviter: [],
    semisInterieur: [], semisExterieur: [7, 8, 9], plantation: [], recolte: [9, 10, 11, 0],
    dureeJours: 50,
    conseil: "Semer en fin d'été. Résiste au froid, récolte jusqu'en décembre.",
    entretiens: [
      { mois: [8, 9], tache: "Désherber entre les rangs" },
      { mois: [9, 10], tache: "Arroser si temps sec" },
      { mois: [11, 0], tache: "Protéger avec un voile d'hivernage si gel" }
    ],
    bonsVoisins: ["Fraisier remontant", "Radis d'hiver", "Chou pommé", "Laitue pommée"],
    mauvaisVoisins: ["Betterave ronde"]
  }
];
