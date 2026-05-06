export interface Space {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  equipment: string[];
  capacity: string;
  hours: string;
  image: string;
  gallery: string[];
  amenities: string[];
  specifications: {
    surface: string;
    temperature: string;
    ventilation: string;
    sound: string;
  };
  gradient: string;
}

export const spaces: Space[] = [
  {
    id: "salle-fitness",
    name: "Salle Fitness Premium",
    category: "Musculation & Cardio",
    description: "Espace de 400m² entièrement équipé avec les dernières technologies fitness. Vue panoramique et ambiance premium pour des entraînements d'exception.",
    features: ["Équipements Technogym", "Vue panoramique", "Climatisation premium", "Zone cardio dédiée", "Espace stretching"],
    equipment: ["Machines guidées", "Poids libres", "Cardio dernière génération", "Fonctionnel training", "Accessoires fitness"],
    capacity: "80 personnes simultanément",
    hours: "06h00 - 22h00",
    image: "/images/spaces/fitness-room.jpg",
    gallery: ["/images/spaces/fitness-1.jpg", "/images/spaces/fitness-2.jpg", "/images/spaces/fitness-3.jpg"],
    amenities: ["Vestiaires premium", "Casiers sécurisés", "Douches privatives", "Serviettes fournies"],
    specifications: {
      surface: "400m²",
      temperature: "20-22°C",
      ventilation: "Renouvellement d'air optimal",
      sound: "Système audio premium"
    },
    gradient: "from-blue-500 to-purple-600"
  },
  {
    id: "terrains-padel",
    name: "Terrains de Padel",
    category: "Sport de raquette",
    description: "Deux terrains aux normes internationales avec un design unique. Éclairage LED professionnel pour jouer dans des conditions optimales jour et nuit.",
    features: ["2 terrains aux normes FIP", "Éclairage LED", "Sol en résine premium", "Gradins spectateurs", "Réservation en ligne"],
    equipment: ["Raquettes premium disponibles", "Balles de compétition", "Tableau d'affichage", "Bancs joueurs"],
    capacity: "8 joueurs par terrain",
    hours: "07h00 - 23h00",
    image: "/images/spaces/padel-court.jpg",
    gallery: ["/images/spaces/padel-1.jpg", "/images/spaces/padel-2.jpg", "/images/spaces/padel-3.jpg"],
    amenities: ["Boutique raquettes", "Vestiaires dédiés", "Espace convivialité", "Parking gratuit"],
    specifications: {
      surface: "2 x 200m²",
      temperature: "Extérieur couvert",
      ventilation: "Circulation naturelle",
      sound: "Isolation acoustique"
    },
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: "studio-bienetre",
    name: "Studio Bien-être",
    category: "Relaxation & Recovery",
    description: "Sanctuaire de 150m² dédié à la détente et à la récupération. Ambiance zen avec équipements de dernière génération pour votre bien-être.",
    features: ["Ambiance zen", "Sol chauffant", "Éclairage tamisé", "Musique d'ambiance", "Murs végétaux"],
    equipment: ["Tapis premium", "Accessoires yoga/pilates", "Machines Reformer", "Équipement fascia", "Outils de récupération"],
    capacity: "20 personnes maximum",
    hours: "08h00 - 21h00",
    image: "/images/spaces/wellness-studio.jpg",
    gallery: ["/images/spaces/wellness-1.jpg", "/images/spaces/wellness-2.jpg", "/images/spaces/wellness-3.jpg"],
    amenities: ["Tisanerie", "Vestiaires spa", "Douches sensorielles", "Espace méditation"],
    specifications: {
      surface: "150m²",
      temperature: "22-24°C",
      ventilation: "Purification d'air",
      sound: "Insonorisation totale"
    },
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: "zone-fonctionnel",
    name: "Zone Fonctionnel",
    category: "Training spécialisé",
    description: "Espace dédié à l'entraînement fonctionnel avec un sol technique et tous les équipements pour des WODs d'exception.",
    features: ["Sol technique anti-choc", "Système de suspension", "Mur d'escalade", "Zone battle rope", "Espace pliométrie"],
    equipment: ["Kettlebells pro", "Battle ropes", "Box jump variables", "Barres de traction", "Accessoires fonctionnels"],
    capacity: "25 personnes",
    hours: "06h30 - 21h30",
    image: "/images/spaces/functional-zone.jpg",
    gallery: ["/images/spaces/functional-1.jpg", "/images/spaces/functional-2.jpg", "/images/spaces/functional-3.jpg"],
    amenities: ["Chronomètres muraux", "Tableaux WOD", "Station hydratation", "Matériel de récupération"],
    specifications: {
      surface: "200m²",
      temperature: "18-20°C",
      ventilation: "Ventilation renforcée",
      sound: "Système audio crossfit"
    },
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: "espace-detente",
    name: "Espace Détente",
    category: "Relaxation",
    description: "Zone de récupération avec sauna, hammam et jacuzzi pour une récupération optimale après l'effort. Le luxe au service de votre bien-être.",
    features: ["Sauna traditionnel", "Hammam premium", "Jacuzzi 8 places", "Douches sensorielles", "Espace repos"],
    equipment: ["Transats premium", "Serviettes chaudes", "Produits bien-être", "Fontaine à eau", "Magazines"],
    capacity: "15 personnes",
    hours: "10h00 - 20h00",
    image: "/images/spaces/spa-area.jpg",
    gallery: ["/images/spaces/spa-1.jpg", "/images/spaces/spa-2.jpg", "/images/spaces/spa-3.jpg"],
    amenities: ["Peignoirs fournis", "Chaussons jetables", "Boissons détox", "Espace lecture"],
    specifications: {
      surface: "100m²",
      temperature: "Variable selon zone",
      ventilation: "Extraction spécialisée",
      sound: "Ambiance relaxante"
    },
    gradient: "from-cyan-500 to-blue-600"
  }
];