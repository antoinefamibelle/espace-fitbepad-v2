export interface GymClass {
    day: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi";
    time: string;
    duration: string;
    name: string;
    category?: "Morning" | "Midday" | "Evening" | "Seniors";
  }
  
  export const gymClasses: GymClass[] = [
    // LUNDI
    { day: "Lundi", time: "9h30", duration: "60’", name: "Pilates Ball", category: "Morning" },
    { day: "Lundi", time: "12h15", duration: "45’", name: "C. A. F", category: "Midday" },
    { day: "Lundi", time: "18h15", duration: "30’", name: "HIIT", category: "Evening" },
    { day: "Lundi", time: "18h45", duration: "45’", name: "Zumba", category: "Evening" },
    { day: "Lundi", time: "19h30", duration: "45’", name: "Step 2/3", category: "Evening" },
    { day: "Lundi", time: "19h30", duration: "45’", name: "Bike", category: "Evening" },
  
    // MARDI
    { day: "Mardi", time: "10h00", duration: "45’", name: "Body Stretch", category: "Morning" },
    { day: "Mardi", time: "12h15", duration: "45’", name: "HIIT", category: "Midday" },
    { day: "Mardi", time: "14h00", duration: "60’", name: "Séniors", category: "Seniors" },
    { day: "Mardi", time: "18h15", duration: "30’", name: "Jumping", category: "Evening" },
    { day: "Mardi", time: "18h45", duration: "45’", name: "Body barre", category: "Evening" },
    { day: "Mardi", time: "19h30", duration: "30’", name: "Cardio flow", category: "Evening" },
  
    // MERCREDI
    { day: "Mercredi", time: "12h15", duration: "45’", name: "Piloyoga", category: "Midday" },
    { day: "Mercredi", time: "18h30", duration: "45’", name: "Gym douce", category: "Evening" },
    { day: "Mercredi", time: "19h15", duration: "30’", name: "Step 1", category: "Evening" },
    { day: "Mercredi", time: "19h45", duration: "30’", name: "Body Stretch", category: "Evening" },
  
    // JEUDI
    { day: "Jeudi", time: "10h00", duration: "60’", name: "Bungy Pump", category: "Morning" },
    { day: "Jeudi", time: "18h15", duration: "45’", name: "C. A. F", category: "Evening" },
    { day: "Jeudi", time: "19h00", duration: "45’", name: "Bike", category: "Evening" },
    { day: "Jeudi", time: "19h15", duration: "45’", name: "Jumping", category: "Evening" },
    { day: "Jeudi", time: "19h45", duration: "30’", name: "Zumba", category: "Evening" },
  
    // VENDREDI
    { day: "Vendredi", time: "9h30", duration: "60’", name: "Séniors", category: "Seniors" },
    { day: "Vendredi", time: "12h15", duration: "45’", name: "Circuit training", category: "Midday" },
    { day: "Vendredi", time: "18h15", duration: "45’", name: "Strong", category: "Evening" },
    { day: "Vendredi", time: "19h00", duration: "30’", name: "C. A. F", category: "Evening" },
  
    // SAMEDI
    { day: "Samedi", time: "10h00", duration: "60’", name: "Pilates", category: "Morning" },
  ];