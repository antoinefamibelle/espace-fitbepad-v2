export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  maxParticipants: number;
  image: string;
  benefits: string[];
  equipment: string[];
  price: number;
  gradient: string;
}

export const courses: Course[] = [
  {
    id: "hiit-premium",
    title: "HIIT Premium",
    category: "Fitness",
    description: "Entraînement haute intensité pour brûler un maximum de calories et sculpter votre silhouette. Séances dynamiques et variées pour ne jamais s'ennuyer.",
    duration: "45 min",
    difficulty: "Intermédiaire",
    maxParticipants: 12,
    image: "/images/courses/hiit.jpg",
    benefits: ["Brûlage de calories intense", "Amélioration cardiovasculaire", "Tonification musculaire", "Effet afterburn"],
    equipment: ["Kettlebells", "Battle ropes", "Box de saut", "Haltères"],
    price: 25,
    gradient: "from-orange-400 to-red-500"
  },
  {
    id: "yoga-flow",
    title: "Yoga Flow Thérapeutique",
    category: "Bien-être",
    description: "Enchaînements fluides pour libérer les tensions, améliorer la flexibilité et retrouver un équilibre intérieur. Accessible à tous les niveaux.",
    duration: "60 min",
    difficulty: "Débutant",
    maxParticipants: 15,
    image: "/images/courses/yoga.jpg",
    benefits: ["Flexibilité accrue", "Réduction du stress", "Meilleure posture", "Équilibre mental"],
    equipment: ["Tapis yoga", "Blocs", "Sangles", "Bolsters"],
    price: 20,
    gradient: "from-blue-400 to-purple-500"
  },
  {
    id: "padel-initiation",
    title: "Padel Initiation",
    category: "Padel",
    description: "Découvrez les bases du padel dans une ambiance conviviale. Technique, règles et tactiques de base pour commencer à jouer rapidement.",
    duration: "90 min",
    difficulty: "Débutant",
    maxParticipants: 8,
    image: "/images/courses/padel-init.jpg",
    benefits: ["Apprentissage technique", "Règles du jeu", "Tactiques de base", "Jeu en équipe"],
    equipment: ["Raquettes fournies", "Balles", "Terrains premium", "Vestiaires"],
    price: 35,
    gradient: "from-green-400 to-emerald-500"
  },
  {
    id: "force-athletique",
    title: "Force Athlétique",
    category: "Force",
    description: "Développez votre force maximale avec les mouvements fondamentaux : squat, développé couché, soulevé de terre. Progression garantie.",
    duration: "75 min",
    difficulty: "Avancé",
    maxParticipants: 8,
    image: "/images/courses/powerlifting.jpg",
    benefits: ["Force maximale", "Technique parfaite", "Progression mesurée", "Confiance en soi"],
    equipment: ["Barres olympiques", "Disques professionnels", "Racks de squat", "Bancs ajustables"],
    price: 30,
    gradient: "from-red-400 to-pink-500"
  },
  {
    id: "pilates-reformer",
    title: "Pilates Reformer",
    category: "Bien-être",
    description: "Travail en profondeur avec les machines Reformer pour un renforcement complet et une posture parfaite. Excellence et précision.",
    duration: "55 min",
    difficulty: "Intermédiaire",
    maxParticipants: 6,
    image: "/images/courses/pilates.jpg",
    benefits: ["Renforcement profond", "Posture améliorée", "Flexibilité", "Contrôle du mouvement"],
    equipment: ["Reformer premium", "Accessoires Pilates", "Miroirs", "Tapis spécialisés"],
    price: 40,
    gradient: "from-purple-400 to-indigo-500"
  },
  {
    id: "cross-training",
    title: "Cross Training Elite",
    category: "Fitness",
    description: "Entraînement fonctionnel complet combinant force, cardio et agilité. Devenez plus fort, plus rapide, plus résistant.",
    duration: "60 min",
    difficulty: "Avancé",
    maxParticipants: 10,
    image: "/images/courses/crossfit.jpg",
    benefits: ["Condition physique globale", "Force fonctionnelle", "Endurance", "Esprit d'équipe"],
    equipment: ["Barres", "Kettlebells", "Box jump", "Cordes", "Anneaux"],
    price: 35,
    gradient: "from-yellow-400 to-orange-500"
  }
];