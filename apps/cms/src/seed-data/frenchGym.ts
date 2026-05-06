export type SeedCoach = {
  displayName: string
  slug: string
  title: string
  category: 'fitness' | 'padel' | 'wellness'
  email: string
  phone?: string
  marketingBio?: string
  experience?: string
  quote?: string
  cardGradient?: 'violet_rose' | 'vert_emeraude' | 'bleu_cyan'
  timezone: string
  specialties: Array<{ value: string }>
  certifications: Array<{ name: string; issuer?: string; year?: number }>
  availability: Array<{ dayOfWeek: '0' | '1' | '2' | '3' | '4' | '5' | '6'; startTime: string; endTime: string }>
  sortOrder: number
}

export type SeedCourse = {
  slug: string
  title: string
  category: 'fitness' | 'bien_etre' | 'padel' | 'force'
  description: string
  duration: string
  difficulty: 'debutant' | 'intermediaire' | 'avance'
  maxParticipants: number
  benefits: Array<{ value: string }>
  equipment: Array<{ value: string }>
  price: number
  gradient:
    | 'from-orange-400 to-red-500'
    | 'from-blue-400 to-purple-500'
    | 'from-green-400 to-emerald-500'
    | 'from-red-400 to-pink-500'
    | 'from-purple-400 to-indigo-500'
    | 'from-yellow-400 to-orange-500'
  sortOrder: number
}

export type SeedSpace = {
  slug: string
  name: string
  category: 'musculation_cardio' | 'sport_raquette' | 'relaxation_recovery' | 'training_specialise' | 'relaxation'
  description: string
  features: Array<{ value: string }>
  equipment: Array<{ value: string }>
  capacity: string
  hours: string
  amenities: Array<{ value: string }>
  specifications: {
    surface: string
    temperature: string
    ventilation: string
    sound: string
  }
  gradient:
    | 'from-blue-500 to-purple-600'
    | 'from-green-500 to-emerald-600'
    | 'from-pink-500 to-rose-600'
    | 'from-orange-500 to-red-600'
    | 'from-cyan-500 to-blue-600'
  sortOrder: number
}

export type SeedSubscription = {
  slug: string
  title: string
  subtitle: string
  offerLevel: 'fitness' | 'dynamique' | 'premium' | 'espace'
  price: number
  period: 'mois' | 'an'
  registrationFee: number
  isPopular?: boolean
  isPremium?: boolean
  benefits: Array<{ value: string }>
  description: string
  gradient:
    | 'from-luxury-black to-luxury-black'
    | 'from-luxury-black to-luxury-purple'
    | 'from-luxury-black to-luxury-green'
    | 'from-luxury-black via-luxury-green to-luxury-purple'
  icon: '💪' | '🧘' | '⭐' | '🏆'
  ctaText: string
  restrictions?: Array<{ value: string }>
  sortOrder: number
}

export type SeedService = {
  name: string
  slug: string
  shortDescription: string
  priceCents: number
  currency: 'eur'
  durationMinutes: number
  bufferBeforeMinutes: number
  bufferAfterMinutes: number
  maxAdvanceBookingDays: number
  minAdvanceBookingHours: number
  cancellationPolicyHours: number
  eligibleCoachSlugs: string[]
  sortOrder: number
}

export type SeedUser = {
  email: string
  firstName: string
  lastName: string
  phone: string
  city: string
  zipCode: string
  locale: 'fr'
  timezone: string
  marketingOptIn: boolean
}

export type SeedCoupon = {
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxRedemptions?: number
  maxRedemptionsPerUser: number
  minOrderCents: number
  applicableServiceSlugs: string[]
  startsAt: string
  expiresAt: string
  isActive: boolean
}

export type SeedPaymentLink = {
  name: string
  description: string
  amountCents: number
  currency: 'eur'
  serviceSlug?: string
  coachSlug?: string
  maxUses?: number
  expiresAt: string
  isActive: boolean
}

export type SeedBooking = {
  userEmail: string
  coachSlug: string
  serviceSlug: string
  couponCode?: string
  startTime: string
  timezone: string
  status: 'pending_payment' | 'confirmed' | 'completed'
  paymentStatus: 'unpaid' | 'paid'
  customerNotes?: string
}

export const frenchGymSeed = {
  coaches: [
    {
      displayName: 'Sarah Martinez',
      slug: 'sarah-martinez',
      title: 'Coach Fitness Premium',
      category: 'fitness',
      email: 'sarah.martinez@fitbepad.local',
      phone: '+33 6 12 34 56 01',
      marketingBio:
        "Diplomee d Etat, Sarah accompagne depuis 8 ans les sportifs de tous niveaux vers leurs objectifs. Sa passion pour la performance et son approche bienveillante font d elle une coach d exception.",
      experience: "8 ans d experience",
      quote: 'Chaque seance est une opportunite de se depasser',
      cardGradient: 'violet_rose',
      timezone: 'Europe/Paris',
      specialties: [{ value: 'Preparation physique' }, { value: 'Cross Training' }, { value: 'Coaching personnel' }],
      certifications: [
        { name: 'BPJEPS AGFF', issuer: 'Ministere des Sports', year: 2018 },
        { name: 'Cross Training Level 2', issuer: 'Cross Training France', year: 2021 },
        { name: 'Nutrition sportive', issuer: 'Institut de nutrition sportive', year: 2022 },
      ],
      availability: [
        { dayOfWeek: '1', startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: '3', startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: '5', startTime: '08:00', endTime: '14:00' },
      ],
      sortOrder: 1,
    },
    {
      displayName: 'Maxime Dubois',
      slug: 'maxime-dubois',
      title: 'Coach Padel Expert',
      category: 'padel',
      email: 'maxime.dubois@fitbepad.local',
      phone: '+33 6 12 34 56 02',
      marketingBio:
        'Ex-joueur professionnel, Maxime met son expertise au service de votre progression. Technique, tactique et mental n ont plus de secrets pour lui.',
      experience: '12 ans dont 5 en pro',
      quote: 'Le padel, c est 70% de technique et 30% de passion',
      cardGradient: 'vert_emeraude',
      timezone: 'Europe/Paris',
      specialties: [{ value: 'Padel technique' }, { value: 'Strategie de jeu' }, { value: 'Competition' }],
      certifications: [
        { name: 'Moniteur Padel FEP', issuer: 'FEP', year: 2016 },
        { name: 'Ex-top 50 France', issuer: 'Federation Francaise de Tennis', year: 2019 },
        { name: 'Formation mentale', issuer: 'Mental Sport Academy', year: 2021 },
      ],
      availability: [
        { dayOfWeek: '2', startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: '4', startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: '6', startTime: '10:00', endTime: '15:00' },
      ],
      sortOrder: 2,
    },
    {
      displayName: 'Elena Rousseau',
      slug: 'elena-rousseau',
      title: 'Coach Bien-etre & Recovery',
      category: 'wellness',
      email: 'elena.rousseau@fitbepad.local',
      phone: '+33 6 12 34 56 03',
      marketingBio:
        'Formee aux techniques ancestrales et modernes, Elena vous guide vers un equilibre parfait entre corps et esprit pour une recuperation optimale.',
      experience: '10 ans en bien-etre',
      quote: 'Le corps sait guerir, il suffit de l ecouter',
      cardGradient: 'bleu_cyan',
      timezone: 'Europe/Paris',
      specialties: [{ value: 'Yoga therapeutique' }, { value: 'Pilates' }, { value: 'Recuperation active' }],
      certifications: [
        { name: 'Yoga Alliance 500h', issuer: 'Yoga Alliance', year: 2017 },
        { name: 'Pilates Romana', issuer: 'Romana Pilates', year: 2019 },
        { name: 'Fasciatherapie', issuer: 'Institut de therapie manuelle', year: 2020 },
      ],
      availability: [
        { dayOfWeek: '1', startTime: '11:00', endTime: '19:00' },
        { dayOfWeek: '4', startTime: '11:00', endTime: '19:00' },
        { dayOfWeek: '0', startTime: '09:00', endTime: '14:00' },
      ],
      sortOrder: 3,
    },
  ] satisfies SeedCoach[],
  services: [
    {
      name: 'Coaching Individuel Fitness',
      slug: 'coaching-individuel-fitness',
      shortDescription: 'Seance personnalisee pour force, posture et progression hebdomadaire.',
      priceCents: 6900,
      currency: 'eur',
      durationMinutes: 60,
      bufferBeforeMinutes: 10,
      bufferAfterMinutes: 10,
      maxAdvanceBookingDays: 45,
      minAdvanceBookingHours: 12,
      cancellationPolicyHours: 24,
      eligibleCoachSlugs: ['sarah-martinez'],
      sortOrder: 1,
    },
    {
      name: 'Cours Padel Debutant',
      slug: 'cours-padel-debutant',
      shortDescription: 'Fondamentaux techniques, placement et premiers schemas tactiques.',
      priceCents: 5500,
      currency: 'eur',
      durationMinutes: 75,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      maxAdvanceBookingDays: 30,
      minAdvanceBookingHours: 24,
      cancellationPolicyHours: 24,
      eligibleCoachSlugs: ['maxime-dubois'],
      sortOrder: 2,
    },
    {
      name: 'Clinic Strategie Match Padel',
      slug: 'clinic-strategie-match-padel',
      shortDescription: 'Session avancee autour des transitions, lobs et decisions en point.',
      priceCents: 8500,
      currency: 'eur',
      durationMinutes: 90,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      maxAdvanceBookingDays: 30,
      minAdvanceBookingHours: 24,
      cancellationPolicyHours: 24,
      eligibleCoachSlugs: ['maxime-dubois'],
      sortOrder: 3,
    },
    {
      name: 'Massage Recuperation Sportive',
      slug: 'massage-recuperation-sportive',
      shortDescription: 'Massage cible post-effort pour detendre les chaines musculaires sollicitees.',
      priceCents: 7900,
      currency: 'eur',
      durationMinutes: 60,
      bufferBeforeMinutes: 10,
      bufferAfterMinutes: 20,
      maxAdvanceBookingDays: 20,
      minAdvanceBookingHours: 24,
      cancellationPolicyHours: 12,
      eligibleCoachSlugs: ['elena-rousseau'],
      sortOrder: 4,
    },
    {
      name: 'Rituel Spa Post-Effort',
      slug: 'rituel-spa-post-effort',
      shortDescription: 'Sauna doux, respiration guidee et relaxation profonde de 45 minutes.',
      priceCents: 4900,
      currency: 'eur',
      durationMinutes: 45,
      bufferBeforeMinutes: 10,
      bufferAfterMinutes: 15,
      maxAdvanceBookingDays: 20,
      minAdvanceBookingHours: 12,
      cancellationPolicyHours: 12,
      eligibleCoachSlugs: ['elena-rousseau'],
      sortOrder: 5,
    },
  ] satisfies SeedService[],
  courses: [
    {
      slug: 'hiit-premium',
      title: 'HIIT Premium',
      category: 'fitness',
      description:
        "Entrainement haute intensite pour bruler un maximum de calories et sculpter votre silhouette. Seances dynamiques et variees.",
      duration: '45 min',
      difficulty: 'intermediaire',
      maxParticipants: 12,
      benefits: [
        { value: 'Brulage de calories intense' },
        { value: 'Amelioration cardiovasculaire' },
        { value: 'Tonification musculaire' },
        { value: 'Effet afterburn' },
      ],
      equipment: [{ value: 'Kettlebells' }, { value: 'Battle ropes' }, { value: 'Box de saut' }, { value: 'Halteres' }],
      price: 25,
      gradient: 'from-orange-400 to-red-500',
      sortOrder: 1,
    },
    {
      slug: 'yoga-flow',
      title: 'Yoga Flow Therapeutique',
      category: 'bien_etre',
      description:
        "Enchainements fluides pour liberer les tensions, ameliorer la flexibilite et retrouver un equilibre interieur.",
      duration: '60 min',
      difficulty: 'debutant',
      maxParticipants: 15,
      benefits: [
        { value: 'Flexibilite accrue' },
        { value: 'Reduction du stress' },
        { value: 'Meilleure posture' },
        { value: 'Equilibre mental' },
      ],
      equipment: [{ value: 'Tapis yoga' }, { value: 'Blocs' }, { value: 'Sangles' }, { value: 'Bolsters' }],
      price: 20,
      gradient: 'from-blue-400 to-purple-500',
      sortOrder: 2,
    },
    {
      slug: 'padel-initiation',
      title: 'Padel Initiation',
      category: 'padel',
      description: 'Decouvrez les bases du padel dans une ambiance conviviale.',
      duration: '90 min',
      difficulty: 'debutant',
      maxParticipants: 8,
      benefits: [
        { value: 'Apprentissage technique' },
        { value: 'Regles du jeu' },
        { value: 'Tactiques de base' },
        { value: "Jeu d equipe" },
      ],
      equipment: [
        { value: 'Raquettes fournies' },
        { value: 'Balles' },
        { value: 'Terrains premium' },
        { value: 'Vestiaires' },
      ],
      price: 35,
      gradient: 'from-green-400 to-emerald-500',
      sortOrder: 3,
    },
    {
      slug: 'force-athletique',
      title: 'Force Athletique',
      category: 'force',
      description:
        'Developpez votre force maximale avec les mouvements fondamentaux : squat, developpe couche, souleve de terre.',
      duration: '75 min',
      difficulty: 'avance',
      maxParticipants: 8,
      benefits: [
        { value: 'Force maximale' },
        { value: 'Technique parfaite' },
        { value: 'Progression mesuree' },
        { value: 'Confiance en soi' },
      ],
      equipment: [
        { value: 'Barres olympiques' },
        { value: 'Disques professionnels' },
        { value: 'Racks de squat' },
        { value: 'Bancs ajustables' },
      ],
      price: 30,
      gradient: 'from-red-400 to-pink-500',
      sortOrder: 4,
    },
    {
      slug: 'pilates-reformer',
      title: 'Pilates Reformer',
      category: 'bien_etre',
      description: 'Travail en profondeur avec les machines Reformer pour un renforcement complet et une posture optimale.',
      duration: '55 min',
      difficulty: 'intermediaire',
      maxParticipants: 6,
      benefits: [
        { value: 'Renforcement profond' },
        { value: 'Posture amelioree' },
        { value: 'Flexibilite' },
        { value: 'Controle du mouvement' },
      ],
      equipment: [
        { value: 'Reformer premium' },
        { value: 'Accessoires Pilates' },
        { value: 'Miroirs' },
        { value: 'Tapis specialises' },
      ],
      price: 40,
      gradient: 'from-purple-400 to-indigo-500',
      sortOrder: 5,
    },
    {
      slug: 'cross-training',
      title: 'Cross Training Elite',
      category: 'fitness',
      description: 'Entrainement fonctionnel complet combinant force, cardio et agilite.',
      duration: '60 min',
      difficulty: 'avance',
      maxParticipants: 10,
      benefits: [
        { value: 'Condition physique globale' },
        { value: 'Force fonctionnelle' },
        { value: 'Endurance' },
        { value: "Esprit d equipe" },
      ],
      equipment: [{ value: 'Barres' }, { value: 'Kettlebells' }, { value: 'Box jump' }, { value: 'Cordes' }, { value: 'Anneaux' }],
      price: 35,
      gradient: 'from-yellow-400 to-orange-500',
      sortOrder: 6,
    },
  ] satisfies SeedCourse[],
  spaces: [
    {
      slug: 'salle-fitness',
      name: 'Salle Fitness Premium',
      category: 'musculation_cardio',
      description:
        "Espace de 400m2 entierement equipe avec les dernieres technologies fitness pour des entrainements d exception.",
      features: [
        { value: 'Equipements Technogym' },
        { value: 'Vue panoramique' },
        { value: 'Climatisation premium' },
        { value: 'Zone cardio dediee' },
        { value: 'Espace stretching' },
      ],
      equipment: [
        { value: 'Machines guidees' },
        { value: 'Poids libres' },
        { value: 'Cardio derniere generation' },
        { value: 'Fonctionnel training' },
        { value: 'Accessoires fitness' },
      ],
      capacity: '80 personnes simultanement',
      hours: '06h00 - 22h00',
      amenities: [
        { value: 'Vestiaires premium' },
        { value: 'Casiers securises' },
        { value: 'Douches privatives' },
        { value: 'Serviettes fournies' },
      ],
      specifications: {
        surface: '400m2',
        temperature: '20-22C',
        ventilation: "Renouvellement d air optimal",
        sound: 'Systeme audio premium',
      },
      gradient: 'from-blue-500 to-purple-600',
      sortOrder: 1,
    },
    {
      slug: 'terrains-padel',
      name: 'Terrains de Padel',
      category: 'sport_raquette',
      description: 'Deux terrains aux normes internationales avec eclairage LED professionnel.',
      features: [
        { value: '2 terrains aux normes FIP' },
        { value: 'Eclairage LED' },
        { value: 'Sol en resine premium' },
        { value: 'Gradins spectateurs' },
        { value: 'Reservation en ligne' },
      ],
      equipment: [
        { value: 'Raquettes premium disponibles' },
        { value: 'Balles de competition' },
        { value: "Tableau d affichage" },
        { value: 'Bancs joueurs' },
      ],
      capacity: '8 joueurs par terrain',
      hours: '07h00 - 23h00',
      amenities: [
        { value: 'Boutique raquettes' },
        { value: 'Vestiaires dedies' },
        { value: 'Espace convivialite' },
        { value: 'Parking gratuit' },
      ],
      specifications: {
        surface: '2 x 200m2',
        temperature: 'Exterieur couvert',
        ventilation: 'Circulation naturelle',
        sound: 'Isolation acoustique',
      },
      gradient: 'from-green-500 to-emerald-600',
      sortOrder: 2,
    },
    {
      slug: 'studio-bienetre',
      name: 'Studio Bien-etre',
      category: 'relaxation_recovery',
      description: 'Sanctuaire dedie a la detente et a la recuperation avec ambiance zen.',
      features: [
        { value: 'Ambiance zen' },
        { value: 'Sol chauffant' },
        { value: 'Eclairage tamise' },
        { value: "Musique d ambiance" },
        { value: 'Murs vegetaux' },
      ],
      equipment: [
        { value: 'Tapis premium' },
        { value: 'Accessoires yoga/pilates' },
        { value: 'Machines Reformer' },
        { value: 'Equipement fascia' },
        { value: 'Outils de recuperation' },
      ],
      capacity: '20 personnes maximum',
      hours: '08h00 - 21h00',
      amenities: [
        { value: 'Tisanerie' },
        { value: 'Vestiaires spa' },
        { value: 'Douches sensorielles' },
        { value: 'Espace meditation' },
      ],
      specifications: {
        surface: '150m2',
        temperature: '22-24C',
        ventilation: "Purification d air",
        sound: 'Insonorisation totale',
      },
      gradient: 'from-pink-500 to-rose-600',
      sortOrder: 3,
    },
    {
      slug: 'zone-fonctionnel',
      name: 'Zone Fonctionnel',
      category: 'training_specialise',
      description: "Espace dedie a l entrainement fonctionnel avec tous les equipements pour des WODs d exception.",
      features: [
        { value: 'Sol technique anti-choc' },
        { value: 'Systeme de suspension' },
        { value: "Mur d escalade" },
        { value: 'Zone battle rope' },
        { value: 'Espace pliometrie' },
      ],
      equipment: [
        { value: 'Kettlebells pro' },
        { value: 'Battle ropes' },
        { value: 'Box jump variables' },
        { value: 'Barres de traction' },
        { value: 'Accessoires fonctionnels' },
      ],
      capacity: '25 personnes',
      hours: '06h30 - 21h30',
      amenities: [
        { value: 'Chronometres muraux' },
        { value: 'Tableaux WOD' },
        { value: 'Station hydratation' },
        { value: 'Materiel de recuperation' },
      ],
      specifications: {
        surface: '200m2',
        temperature: '18-20C',
        ventilation: 'Ventilation renforcee',
        sound: 'Systeme audio crossfit',
      },
      gradient: 'from-orange-500 to-red-600',
      sortOrder: 4,
    },
    {
      slug: 'espace-detente',
      name: 'Espace Detente',
      category: 'relaxation',
      description: "Zone de recuperation avec sauna, hammam et jacuzzi pour une recuperation optimale apres l effort.",
      features: [
        { value: 'Sauna traditionnel' },
        { value: 'Hammam premium' },
        { value: 'Jacuzzi 8 places' },
        { value: 'Douches sensorielles' },
        { value: 'Espace repos' },
      ],
      equipment: [
        { value: 'Transats premium' },
        { value: 'Serviettes chaudes' },
        { value: 'Produits bien-etre' },
        { value: 'Fontaine a eau' },
        { value: 'Magazines' },
      ],
      capacity: '15 personnes',
      hours: '10h00 - 20h00',
      amenities: [
        { value: 'Peignoirs fournis' },
        { value: 'Chaussons jetables' },
        { value: 'Boissons detox' },
        { value: 'Espace lecture' },
      ],
      specifications: {
        surface: '100m2',
        temperature: 'Variable selon zone',
        ventilation: 'Extraction specialisee',
        sound: 'Ambiance relaxante',
      },
      gradient: 'from-cyan-500 to-blue-600',
      sortOrder: 5,
    },
  ] satisfies SeedSpace[],
  subscriptions: [
    {
      slug: 'fitness',
      title: 'Abonnement FITNESS',
      subtitle: 'Engagement de 12 mois',
      offerLevel: 'fitness',
      price: 39.9,
      period: 'mois',
      registrationFee: 50,
      benefits: [
        { value: "Acces libre a l espace fitness" },
        { value: "Acces a l ensemble des cours collectifs" },
        { value: "Pesee Fit Quest offerte a l inscription" },
        { value: "Echanges avec un coach pendant 20 minutes au moment de l inscription" },
      ],
      description:
        "L abonnement parfait pour developper votre force et votre condition physique dans notre salle premium.",
      gradient: 'from-luxury-black to-luxury-black',
      icon: '💪',
      ctaText: 'Souscrire FITNESS',
      restrictions: [],
      sortOrder: 1,
    },
    {
      slug: 'dynamique',
      title: 'Abonnement DYNAMIQUE',
      subtitle: 'Engagement de 12 mois',
      offerLevel: 'dynamique',
      price: 59.9,
      period: 'mois',
      registrationFee: 40,
      benefits: [
        { value: "Acces libre a l espace fitness" },
        { value: "Acces a l ensemble des cours collectifs" },
        { value: "Pesee Fit Quest offerte a l inscription" },
        { value: "Echanges avec un coach pendant 20 minutes au moment de l inscription" },
        { value: "2H de padel offert par mois pour l adherent" },
        { value: "20% offert sur l ensemble des creneaux padel reserves" },
        { value: "10% de reduction sur les participations aux tournois de padel" },
        { value: "10% offert sur l ensemble des coachings prives padel" },
        { value: 'Locations de raquettes et de balles offertes sur les creneaux reserves' },
      ],
      description: 'Retrouvez votre equilibre avec nos programmes de bien-etre et de recuperation.',
      gradient: 'from-luxury-black to-luxury-purple',
      icon: '🧘',
      ctaText: 'Souscrire DYNAMIQUE',
      sortOrder: 2,
    },
    {
      slug: 'premium',
      title: 'Abonnement PREMIUM',
      subtitle: 'Engagement de 12 mois',
      offerLevel: 'premium',
      price: 69.9,
      period: 'mois',
      registrationFee: 30,
      isPopular: true,
      isPremium: true,
      benefits: [
        { value: "Acces libre a l espace fitness" },
        { value: "Acces a l ensemble des cours collectifs" },
        { value: "Pesee Fit Quest offerte a l inscription" },
        { value: "Echanges avec un coach pendant 20 minutes au moment de l inscription" },
        { value: 'Rdv avec une nutritionniste competente dans le mois suivant l inscription' },
        { value: 'Suivi avec la nutritionniste 1 fois par trimestre' },
        { value: '2 seances de massages offertes par an' },
      ],
      description: "L experience complete pour atteindre tous vos objectifs forme et bien-etre.",
      gradient: 'from-luxury-black to-luxury-green',
      icon: '⭐',
      ctaText: 'Souscrire PREMIUM',
      sortOrder: 3,
    },
    {
      slug: 'espace',
      title: 'Abonnement ESPACE',
      subtitle: 'Engagement de 12 mois',
      offerLevel: 'espace',
      price: 89.9,
      period: 'mois',
      registrationFee: 0,
      isPremium: true,
      benefits: [
        { value: "Acces libre a l espace fitness" },
        { value: "Acces a l ensemble des cours collectifs" },
        { value: "Pesee Fit Quest offerte a l inscription" },
        { value: "Echanges avec un coach pendant 20 minutes au moment de l inscription" },
        { value: 'Rdv avec une nutritionniste competente dans le mois suivant l inscription' },
        { value: 'Suivi avec la nutritionniste 1 fois par trimestre' },
        { value: '2 seances de massages offertes par an' },
        { value: "2H de padel offert par mois pour l adherent" },
        { value: "20% offert sur l ensemble des creneaux padel reserves" },
        { value: "10% de reduction sur les participations aux tournois de padel de l ESPACE" },
        { value: "10% offert sur l ensemble des coachings prives padel" },
        { value: 'Locations de raquettes et de balles offertes sur les creneaux reserves' },
      ],
      description: "L abonnement ultime pour les passionnes qui veulent tout, y compris le Padel.",
      gradient: 'from-luxury-black via-luxury-green to-luxury-purple',
      icon: '🏆',
      ctaText: 'Souscrire ESPACE',
      sortOrder: 4,
    },
  ] satisfies SeedSubscription[],
  users: [
    {
      email: 'lea.bernard@example.fr',
      firstName: 'Lea',
      lastName: 'Bernard',
      phone: '+33 6 44 23 89 01',
      city: 'Lyon',
      zipCode: '69006',
      locale: 'fr',
      timezone: 'Europe/Paris',
      marketingOptIn: true,
    },
    {
      email: 'nicolas.girard@example.fr',
      firstName: 'Nicolas',
      lastName: 'Girard',
      phone: '+33 6 44 23 89 02',
      city: 'Lyon',
      zipCode: '69003',
      locale: 'fr',
      timezone: 'Europe/Paris',
      marketingOptIn: false,
    },
    {
      email: 'sarah.dupont@example.fr',
      firstName: 'Sarah',
      lastName: 'Dupont',
      phone: '+33 6 44 23 89 03',
      city: 'Villeurbanne',
      zipCode: '69100',
      locale: 'fr',
      timezone: 'Europe/Paris',
      marketingOptIn: true,
    },
  ] satisfies SeedUser[],
  coupons: [
    {
      code: 'BIENVENUE10',
      description: '10% de reduction sur la premiere seance fitness ou padel.',
      discountType: 'percentage',
      discountValue: 10,
      maxRedemptions: 250,
      maxRedemptionsPerUser: 1,
      minOrderCents: 5000,
      applicableServiceSlugs: ['coaching-individuel-fitness', 'cours-padel-debutant'],
      startsAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-12-31T23:59:59.000Z',
      isActive: true,
    },
    {
      code: 'SPA15EUR',
      description: '15 EUR de reduction sur les soins spa de recuperation.',
      discountType: 'fixed',
      discountValue: 1500,
      maxRedemptions: 120,
      maxRedemptionsPerUser: 2,
      minOrderCents: 4500,
      applicableServiceSlugs: ['massage-recuperation-sportive', 'rituel-spa-post-effort'],
      startsAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-10-31T23:59:59.000Z',
      isActive: true,
    },
  ] satisfies SeedCoupon[],
  paymentLinks: [
    {
      name: 'Pack Decouverte Gym + Spa',
      description: 'Acces a une seance fitness individuelle puis un rituel spa post-effort.',
      amountCents: 10900,
      currency: 'eur',
      serviceSlug: 'coaching-individuel-fitness',
      coachSlug: 'sarah-martinez',
      maxUses: 60,
      expiresAt: '2026-12-15T23:59:59.000Z',
      isActive: true,
    },
    {
      name: 'Duo Padel Weekend',
      description: 'Session padel technique pour deux joueurs le weekend.',
      amountCents: 9900,
      currency: 'eur',
      serviceSlug: 'cours-padel-debutant',
      coachSlug: 'maxime-dubois',
      maxUses: 80,
      expiresAt: '2026-12-20T23:59:59.000Z',
      isActive: true,
    },
  ] satisfies SeedPaymentLink[],
  bookings: [
    {
      userEmail: 'lea.bernard@example.fr',
      coachSlug: 'sarah-martinez',
      serviceSlug: 'coaching-individuel-fitness',
      couponCode: 'BIENVENUE10',
      startTime: '2026-07-06T07:00:00.000Z',
      timezone: 'Europe/Paris',
      status: 'confirmed',
      paymentStatus: 'paid',
      customerNotes: 'Objectif: reprise cardio apres blessure.',
    },
    {
      userEmail: 'nicolas.girard@example.fr',
      coachSlug: 'maxime-dubois',
      serviceSlug: 'cours-padel-debutant',
      startTime: '2026-07-07T09:30:00.000Z',
      timezone: 'Europe/Paris',
      status: 'pending_payment',
      paymentStatus: 'unpaid',
      customerNotes: 'Premiere seance padel en duo.',
    },
    {
      userEmail: 'sarah.dupont@example.fr',
      coachSlug: 'elena-rousseau',
      serviceSlug: 'massage-recuperation-sportive',
      couponCode: 'SPA15EUR',
      startTime: '2026-07-08T13:00:00.000Z',
      timezone: 'Europe/Paris',
      status: 'completed',
      paymentStatus: 'paid',
      customerNotes: 'Recuperation apres tournoi amateur.',
    },
  ] satisfies SeedBooking[],
}
