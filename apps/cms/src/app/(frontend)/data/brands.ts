export interface Brand {
  name: string;
  logo: string;
  alt: string;
  website?: string;
}

export const brands: Brand[] = [
  {
    name: "Figaro",
    logo: "/images/brands/figaro.webp",
    alt: "Figaro Magazine logo",
    website: "https://figaro.fr"
  },
  {
    name: "La Gazette",
    logo: "/images/brands/gazette.png", 
    alt: "La Gazette Magazine logo",
    website: "https://gazette.fr"
  },
  {
    name: "Le Parisien",
    logo: "/images/brands/parisien.png",
    alt: "Le Parisien Magazine logo", 
    website: "https://parisien.fr"
  },
  {
    name: "TF1",
    logo: "/images/brands/tf1.png",
    alt: "TF1 Magazine logo",
    website: "https://tf1.fr"
  },
];
