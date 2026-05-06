import { Metadata } from 'next';
import { ContactHero } from './components/contact-hero';
import { ContactForm } from './components/contact-form';
import { ContactInfo } from './components/contact-info';

export const metadata: Metadata = {
  title: 'Contact — L\'Espace Fitbepad',
  description:
    "Contactez-nous pour toute question ou pour démarrer votre parcours fitness, bien-être et padel à Verberie.",
  keywords: ['contact', 'fitbepad', 'bien-être', 'fitness', 'padel', 'Verberie'],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#1d1d1b]">
      <ContactHero />

      {/* Split: dark info | white form */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
}
