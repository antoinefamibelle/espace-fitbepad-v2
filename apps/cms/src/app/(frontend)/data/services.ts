import { Dumbbell, Heart, Zap } from 'lucide-react';
import fitnessHero from '@frontend/public/images/fitness-hero.jpg';
import wellnessHero from '@frontend/public/images/wellness-hero.jpg';
import padelHero from '@frontend/public/images/padel-hero.jpg';
import { Service } from '@frontend/types/service';

export const services: Service[] = [
  {
    title: "FITNESS",
    subtitle: "Salle de sport premium",
    description: "Un lieu ideal pour progresser, depasser vos limites et atteindre vos objectifs de forme et de performance",
    image: fitnessHero,
    icon: Dumbbell,
    type: "fitness"
  },
  {
    title: "BIEN-ÊTRE",
    subtitle: "Sante et équilibre",
    description: "Des experts vous aident à récupérer, libérer vos tensions et retrouver un véritable équilibre au quotidien.",
    image: wellnessHero,
    icon: Heart,
    type: "wellness"
  },
  {
    title: "PADEL",
    subtitle: "Sport et passion",
    description: "Deux terrains premium au design unique avec cours collectifs, tournois et événements exclusifs.",
    image: padelHero,
    icon: Zap,
    type: "padel"
  }
];
