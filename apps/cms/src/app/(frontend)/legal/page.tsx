import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales | Espace Sports',
  description:
    "Consultez les mentions légales de Espace Sports, votre centre de bien-être et padel. Informations sur la société, les conditions d'utilisation et la protection des données.",
  openGraph: {
    title: 'Mentions Légales | Espace Sports',
    description:
      "Consultez les mentions légales de Espace Sports, votre centre de bien-être et padel. Informations sur la société, les conditions d'utilisation et la protection des données.",
    type: 'website',
  },
  authors: {
    name: 'Espace Sports',
  },
  keywords: [
    'mentions légales',
    "conditions d'utilisation",
    'protection des données',
    'Espace Sports',
    'centre bien-être',
  ],
  alternates: {
    canonical: '/legal',
  },
};

const LegalPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-[2rem]">
      <div className="text-center">
        <h2 className="text-sm uppercase tracking-wider text-gray-600 mb-2">
          Informations légales
        </h2>
        <h1 className="text-4xl md:text-5xl font-serif italic font-normal">
          Mentions <span className="font-medium">légales</span>
        </h1>
        <div className="w-full md:w-2/3 mt-[1rem] mx-auto">
          <span className="text-md text-gray-600">
            Consultez les informations légales concernant Espace Sports, votre centre
            de bien-être et padel.
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto prose prose-lg">
        <div role="section" className="mt-[2rem]">
          <h2 className="text-2xl font-bold mb-4">Présentation du site</h2>
          <p>
            Le site internet fitbepad.fr est un site appartenant à AL&apos;NICIO
            au capital social de 1.000,00 €, immatriculée sous le numéro SIRET
            90503638000012 au RCS de Paris et domiciliée à l&apos;adresse 34
            avenue des champs élysée, 75008 Paris, France.
          </p>
        </div>

        <div role="section" className="mt-[2rem]">
          <h2 className="text-2xl font-bold mb-4">Informations légales</h2>
          <ul className="space-y-4">
            <li>
              <strong>Numéro d&apos;identification fiscal :</strong>{' '}
              FR00905036380
            </li>
            <li>
              <strong>Responsable de la publication :</strong> Antoine F. -
              antoinefamibelle@gmail.com
            </li>
            <li>
              <strong>Hébergeur du site :</strong> Vercel Inc., 340 S Lemon Ave
              #4133, Walnut, CA 91789, États-Unis.
            </li>
          </ul>
        </div>

        <div role="section" className="mt-[2rem]">
          <h2 className="text-2xl font-bold mb-4">
            Protection des données personnelles
          </h2>
          <p>
            Conformément à la loi Informatique et Libertés du 6 janvier 1978
            modifiée, et au Règlement Général sur la Protection des Données
            (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification
            et de suppression des données vous concernant.
          </p>
        </div>

        <div role="section" className="mt-[2rem]">
          <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble de ce site relève de la législation française et
            internationale sur le droit d&apos;auteur et la propriété
            intellectuelle. Tous les droits de reproduction sont réservés, y
            compris pour les documents téléchargeables et les représentations
            iconographiques et photographiques.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
