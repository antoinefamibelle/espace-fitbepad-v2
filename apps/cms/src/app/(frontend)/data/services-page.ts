import { Dumbbell, Heart, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
// ---- Coaches ----
export interface Coach {
    name: string;
    specialty: string;
    bio: string;
    imageUrl: string;
  }
  
export const coaches: Coach[] = [
  {
    name: "Sophie Martin",
    specialty: "Fitness & Cardio",
    bio: "Coach passionnée par la remise en forme et le bien-être, Sophie vous aide à atteindre vos objectifs grâce à des entraînements personnalisés et motivants.",
    imageUrl: "/images/coach/coach-1.jpg",
  },
  {
    name: "Julien Dupont",
    specialty: "Biking & Endurance",
    bio: "Spécialiste du biking et de l’endurance, Julien vous accompagne pour améliorer vos performances et dépasser vos limites dans une ambiance dynamique.",
    imageUrl: "/images/coach/coach-2.jpg",
  },
  {
    name: "Claire Dubois",
    specialty: "Bien-être & Yoga",
    bio: "Experte en yoga et techniques de relaxation, Claire met l’accent sur l’équilibre entre corps et esprit pour un bien-être durable.",
    imageUrl: "/images/coach/coach-3.jpg",
  },
];

// ---- Activities ----
export interface Activity {
  title: string;
  description: string;
  iconUrl: LucideIcon
}

export const activities: Activity[] = [
  {
    title: "Padel",
    description: "Un sport de raquette fun et accessible à tous, à pratiquer en simple ou en double sur nos terrains modernes.",
    iconUrl: Dumbbell,
  },
  {
    title: "Wellness & Fitness",
    description: "Des cours collectifs et des programmes personnalisés pour rester en forme et booster votre énergie au quotidien.",
    iconUrl: Heart,
  },
  {
    title: "Biking",
    description: "Des sessions intenses de biking pour brûler des calories, améliorer votre endurance et vous défouler en musique.",
    iconUrl: Zap,
  },
];

// ---- Spaces ----
export interface Space {
  title: string;
  description: string;
  imageUrl: string;
}

export const spaces: Space[] = [
  {
    title: "Salle de Biking",
    description: "Un espace entièrement équipé avec des vélos modernes et une ambiance immersive.",
    imageUrl: "/images/spaces/biking.jpg",
  },
  {
    title: "Salle de Bien-être",
    description: "Une salle spacieuse et lumineuse dédiée aux bien-être, pour des séances variées et dynamiques.",
    imageUrl: "/images/spaces/wellness.jpg",
  },
  {
    title: "Salle de Musculation",
    description: "Un espace complet avec machines et poids libres pour vos entraînements de force et de musculation.",
    imageUrl: "/images/spaces/fitness.webp",
  },
  {
    title: "Terrain de Padel",
    description: "Un terrain moderne de padel pour pratiquer entre amis ou progresser avec nos coachs.",
    imageUrl: "/images/spaces/padel.jpg",
  },
];