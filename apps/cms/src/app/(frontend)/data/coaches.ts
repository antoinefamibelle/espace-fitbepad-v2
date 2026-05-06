export interface Coach {
  id: string;
  name: string;
  title: string;
  category: 'fitness' | 'padel' | 'wellness';
  specialties: string[];
  bio: string;
  image: string;
  certifications: string[];
  experience: string;
  quote: string;
  gradient: string;
}

export const coaches: Coach[] = [
  {
    id: "sarah-martinez",
    name: "Sarah Martinez",
    title: "Coach Fitness Premium",
    category: "fitness",
    specialties: ["Préparation physique", "Cross Training", "Coaching personnel"],
    bio: "Diplômée d'État, Sarah accompagne depuis 8 ans les sportifs de tous niveaux vers leurs objectifs. Sa passion pour la performance et son approche bienveillante font d'elle une coach d'exception.",
    image: "/images/coach/coach-1.jpg",
    certifications: ["BPJEPS AGFF", "Cross Training Level 2", "Nutrition sportive"],
    experience: "8 ans d'expérience",
    quote: "Chaque séance est une opportunité de se dépasser",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "maxime-dubois",
    name: "Maxime Dubois",
    title: "Coach Padel Expert",
    category: "padel",
    specialties: ["Padel technique", "Stratégie de jeu", "Compétition"],
    bio: "Ex-joueur professionnel, Maxime met son expertise au service de votre progression. Technique, tactique et mental n'ont plus de secrets pour lui.",
    image: "/images/coach/coach-2.jpg",
    certifications: ["Moniteur Padel FEP", "Ex-top 50 France", "Formation mentale"],
    experience: "12 ans dont 5 en pro",
    quote: "Le padel, c'est 70% de technique et 30% de passion",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "elena-rousseau",
    name: "Elena Rousseau",
    title: "Coach Bien-être & Recovery",
    category: "wellness",
    specialties: ["Yoga thérapeutique", "Pilates", "Récupération active"],
    bio: "Formée aux techniques ancestrales et modernes, Elena vous guide vers un équilibre parfait entre corps et esprit pour une récupération optimale.",
    image: "/images/coach/coach-3.jpg",
    certifications: ["Yoga Alliance 500h", "Pilates Romana", "Fasciathérapie"],
    experience: "10 ans en bien-être",
    quote: "Le corps sait guérir, il suffit de l'écouter",
    gradient: "from-blue-500 to-cyan-500"
  },
];