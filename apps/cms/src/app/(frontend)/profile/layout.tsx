import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Profil | Espace Personnel Espace Sports',
  description: 'Gérez votre profil Espace Sports : consultez vos informations personnelles, historique des réservations et préférences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}