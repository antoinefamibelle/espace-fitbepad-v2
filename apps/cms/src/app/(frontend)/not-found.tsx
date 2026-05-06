import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const hostname = (await headers()).get('host') || '';

  let title = 'Espace Sports | Fitness, Bien-Être et Padel';
  let description =
    "Espace Sports vous accompagne dans votre parcours fitness, bien-être et padel";
  let canonical = 'https://espacesports.com/';


  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Espace Sports',
      images: '/favicon.ico',
    },
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

const ErrorPage = () => {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-4 text-center h-[85vh]">
      <div className="max-w-2xl mx-auto">
        <div className="text-3xl md:text-4xl font-medium text-gray-800 mb-4 flex items-center justify-center">
          <span>Page non trouvée</span>
          <span className="mx-2 text-4xl">😕</span>
          <span className="mx-2 text-4xl">🔍</span>
        </div>
        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg mx-auto">
          Désolé, la page que vous recherchez semble avoir disparu. Peut-être
          est-elle partie pour une séance de bien-être ?
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/80 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
