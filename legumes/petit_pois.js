const PETITS_POIS = [
  {
    nom: "Petit pois nain", emoji: "🟢", groupe: "Petit pois", famille: "Fabacées",
    variete: "Petit Provençal, Merveille de Kelvedon, Douce Provence",
    entreRangs: 40, entrePlants: 5,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["limoneux", "humifère", "argileux"], solEviter: ["sableux"],
    semisInterieur: [], semisExterieur: [1, 2, 3, 9, 10], plantation: [], recolte: [4, 5, 6],
    dureeJours: 75,
    conseil: "40-60 cm de haut. Pas besoin de rames, un petit grillage suffit.",
    entretiens: [
      { mois: [2, 3], tache: "Installer un petit grillage de soutien" },
      { mois: [3, 4], tache: "Butter les pieds" },
      { mois: [4, 5], tache: "Arroser modérément" },
      { mois: [4, 5, 6], tache: "Récolter régulièrement" }
    ],
    bonsVoisins: ["Carotte de saison", "Radis rond", "Laitue pommée", "Courgette classique", "PDT demi-précoce"],
    mauvaisVoisins: ["Oignon", "Ail", "Poireau d'hiver"]
  },
  {
    nom: "Petit pois grimpant", emoji: "🟢", groupe: "Petit pois", famille: "Fabacées",
    variete: "Téléphone, Serpette d'Auvergne, Alderman",
    entreRangs: 60, entrePlants: 5,
    soleil: { matin: 4, apresMidi: 2, tolereChaleur: false },
    sol: ["limoneux", "humifère", "argileux"], solEviter: ["sableux"],
    semisInterieur: [], semisExterieur: [1, 2, 3, 9, 10], plantation: [], recolte: [5, 6, 7],
    dureeJours: 95,
    conseil: "1,5-2m de haut. Rames indispensables. Production plus longue.",
    entretiens: [
      { mois: [2, 3], tache: "Installer les rames (1,5-2m)" },
      { mois: [3, 4, 5], tache: "Butter les pieds" },
      { mois: [4, 5, 6], tache: "Arroser modérément" },
      { mois: [5, 6, 7], tache: "Récolter régulièrement" }
    ],
    bonsVoisins: ["Carotte de saison", "Radis rond", "Laitue pommée", "Courgette classique", "PDT demi-précoce"],
    mauvaisVoisins: ["Oignon", "Ail", "Poireau d'hiver"]
  }
];
