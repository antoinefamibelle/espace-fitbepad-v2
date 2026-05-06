import {
  CalendarCheck,
  Sun,
  Scissors,
  Check,
  Droplets,
  Clock,
  Heart,
  DollarSign,
  Shield,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  AlertCircle,
  ArrowRight,
  Calendar,
  HelpCircle,
  MessageCircle,
  Phone,
} from 'lucide-react';

export const iconMap = {
  CalendarCheck,
  Sun,
  Scissors,
  Check,
  Droplets,
  Clock,
  Heart,
  DollarSign,
  Shield,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  AlertCircle,
  ArrowRight,
  Calendar,
  HelpCircle,
  MessageCircle,
  Phone,
} as const;

export type IconName = keyof typeof iconMap;

export const getIconComponent = (iconName: string) => {
  return iconMap[iconName as IconName] || AlertCircle;
};
