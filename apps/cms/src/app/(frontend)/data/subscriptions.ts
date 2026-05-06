export interface Subscription {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  period: string;
  registrationFee: number;
  isPopular?: boolean;
  isPremium?: boolean;
  benefits: string[];
  description: string;
  gradient: string;
  icon: string;
  ctaText: string;
  restrictions?: string[];
}

export const subscriptions: Subscription[] = [
  {
    id: "fitness",
    title: "Abonnement FITNESS",
    subtitle: "Engagement de 12 mois",
    price: 39.90,
    period: "mois",
    registrationFee: 50,
    benefits: [
      "Accès libre à l’espace fitness",
      "Accès à l’ensemble des cours collectifs", 
      "Pesée Fit Quest offerte à l’inscription",
      "Echanges avec un coach pendant 20 minutes au moment de l’inscription (visite des locaux + conseils sportifs)",
    ],
    description: "L'abonnement parfait pour développer votre force et votre condition physique dans notre salle premium.",
    gradient: "from-luxury-black to-luxury-black",
    icon: "💪",
    ctaText: "Souscrire FITNESS",
    restrictions: []
  },
  {
    id: "bienetre",
    title: "Abonnement DYNAMIQUE",
    subtitle: "Engagement de 12 mois",
    price: 59.90,
    period: "mois",
    registrationFee: 40,
    benefits: [
      "Accès libre à l’espace fitness",
      "Accès à l’ensemble des cours collectifs", 
      "Pesée Fit Quest offerte à l’inscription",
      "Echanges avec un coach pendant 20 minutes au moment de l’inscription (visite des locaux + conseils sportifs)",
      "2H de padel offert par mois pour l’adhérent (créneaux sur horaires creuses)",
      "20% offert sur l’ensemble des créneaux padel réservés",
      "10% de réduction sur les participations aux tournois de padel de l’ESPACE",
      "10% offert sur l’ensemble des coachings privés padel",
      "Locations de raquettes et de balles offertes sur les créneaux réservés"
    ],
    description: "Retrouvez votre équilibre avec nos programmes de bien-être et de récupération.",
    gradient: "from-luxury-black to-luxury-purple",
    icon: "🧘",
    ctaText: "Souscrire DYNAMIQUE"
  },
  {
    id: "premium",
    title: "Abonnement PREMIUM",
    subtitle: "Engagement de 12 mois",
    price: 69.90,
    period: "mois",
    registrationFee: 30,
    isPopular: true,
    isPremium: true,
    benefits: [
      "Accès libre à l’espace fitness",
      "Accès à l’ensemble des cours collectifs", 
      "Pesée Fit Quest offerte à l’inscription",
      "Echanges avec un coach pendant 20 minutes au moment de l’inscription (visite des locaux + conseils sportifs)",
      "Rdv avec une nutritionniste compétente dans le mois suivant l’inscription",
      "Suivi avec la nutritionniste 1 fois par trimestre",
      "2 séances de massages offertes par an"
    ],
    description: "L'expérience complète pour atteindre tous vos objectifs forme et bien-être.",
    gradient: "from-luxury-black to-luxury-green",
    icon: "⭐",
    ctaText: "Souscrire PREMIUM"
  },
  {
    id: "espace",
    title: "Abonnement ESPACE",
    subtitle: "Engagement de 12 mois",
    price: 89.90,
    period: "mois",
    registrationFee: 0,
    isPremium: true,
    benefits: [
      "Accès libre à l’espace fitness",
      "Accès à l’ensemble des cours collectifs", 
      "Pesée Fit Quest offerte à l’inscription",
      "Echanges avec un coach pendant 20 minutes au moment de l’inscription (visite des locaux + conseils sportifs)",
      "Rdv avec une nutritionniste compétente dans le mois suivant l’inscription",
      "Suivi avec la nutritionniste 1 fois par trimestre",
      "2 séances de massages offertes par an",
      "2H de padel offert par mois pour l’adhérent (créneaux sur horaires creuses)",
      "20% offert sur l’ensemble des créneaux padel réservés",
      "10% de réduction sur les participations aux tournois de padel de l’ESPACE",
      "10% offert sur l’ensemble des coachings privés padel",
      "Locations de raquettes et de balles offertes sur les créneaux réservés"
    ],
    description: "L'abonnement ultime pour les passionnés qui veulent tout, y compris le Padel.",
    gradient: "from-luxury-black via-luxury-green to-luxury-purple",
    icon: "🏆",
    ctaText: "Souscrire ESPACE"
  }
];