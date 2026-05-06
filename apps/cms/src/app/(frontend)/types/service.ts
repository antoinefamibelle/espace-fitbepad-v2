import { LucideIcon } from 'lucide-react';
import { StaticImageData } from 'next/image';

export interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: StaticImageData;
  icon: LucideIcon;
  type: string;
}

export interface ServiceCardProps {
  service: Service;
  index: number;
}
