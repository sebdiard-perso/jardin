const POMMES_DE_TERRE = [
  {
    nom: "PDT précoce", emoji: "🥔", groupe: "Pomme de terre", famille: "Solanacées",
    variete: "Amandine, Belle de Fontenay, Rosabelle",
    entreRangs: 60, entrePlants: 30,
    soleil: { matin: 4, apresMidi: 3, tolereChaleur: false },
    sol: ["sableux", "limoneux", "humifère"], solEviter: ["calcaire"],
    semisInterieur: [], semisExterieur: [], plantation: [1, 2, 3], recolte: [4, 5, 6],
    dureeJours: 70,
    conseil: "Récolte 70-90 jours. Chair ferme, idéale en salade.",
    entretiens: [
      { mois: [2, 3], tache: "Butter quand les tiges atteignent 15 cm" },
      { mois: [3, 4], tache: "Butter une 2e fois" },
      { mois: [3, 4, 5], tache: "Arroser modérément au pied" },
      { mois: [4, 5], tache: "Récolter quand les fleurs fanent" }
    ],
    bonsVoisins: ["Haricot nain", "Petit pois nain", "Épinard de printemps", "Laitue pommée", "Radis rond"],
    mauvaisVoisins: ["Tomate classique", "Aubergine", "Courgette classique", "Concombre", "Oignon"]
  },
  {
    nom: "PDT demi-précoce", emoji: "🥔", groupe: "Pomme de terre", famille: "Solanacées",
    variete: "Charlotte, Bintje, Monalisa, Nicola",
    entreRangs: 65, entrePlants: 35,
    soleil: { matin: 4, apresMidi: 3, tolereChaleur: false },
    sol: ["sableux", "limoneux", "humifère"], solEviter: ["calcaire"],
    semisInterieur: [], semisExterieur: [], plantation: [2, 3, 4], recolte: [6, 7, 8],
    dureeJours: 100,
    conseil: "Polyvalente en cuisine. Bon rendement.",
    entretiens: [
      { mois: [3, 4], tache: "Butter quand les tiges atteignent 20 cm" },
      { mois: [4, 5], tache: "Butter une 2e fois" },
      { mois: [5, 6], tache: "Surveiller le mildiou" },
      { mois: [5, 6, 7], tache: "Arroser modérément au pied" },
      { mois: [6, 7], tache: "Défaner 2 semaines avant récolte" }
    ],
    bonsVoisins: ["Haricot nain", "Petit pois nain", "Épinard de printemps", "Laitue pommée", "Radis rond"],
    mauvaisVoisins: ["Tomate classique", "Aubergine", "Courgette classique", "Concombre", "Oignon"]
  },
  {
    nom: "PDT tardive", emoji: "🥔", groupe: "Pomme de terre", famille: "Solanacées",
    variete: "Vitelotte, Désirée, Sarpo Mira, Corne de gatte",
    entreRangs: 70, entrePlants: 40,
    soleil: { matin: 4, apresMidi: 3, tolereChaleur: false },
    sol: ["sableux", "limoneux", "humifère"], solEviter: ["calcaire"],
    semisInterieur: [], semisExterieur: [], plantation: [3, 4, 5], recolte: [8, 9, 10],
    dureeJours: 150,
    conseil: "Se conserve tout l'hiver. Planter plus espacé.",
    entretiens: [
      { mois: [4, 5], tache: "Butter quand les tiges atteignent 20 cm" },
      { mois: [5, 6], tache: "Butter une 2e fois" },
      { mois: [6, 7, 8], tache: "Surveiller le mildiou" },
      { mois: [6, 7, 8], tache: "Arroser modérément au pied" },
      { mois: [8, 9], tache: "Défaner 2-3 semaines avant récolte" },
      { mois: [9, 10], tache: "Récolter par temps sec" }
    ],
    bonsVoisins: ["Haricot nain", "Petit pois nain", "Épinard de printemps", "Laitue pommée", "Radis rond"],
    mauvaisVoisins: ["Tomate classique", "Aubergine", "Courgette classique", "Concombre", "Oignon"]
  }
];
