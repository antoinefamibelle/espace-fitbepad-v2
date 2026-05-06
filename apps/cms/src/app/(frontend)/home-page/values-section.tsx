'use client';

const commitments = [
  {
    number: '01',
    title: 'Ouvert 7 jours sur 7',
    description: "L'Espace s'adapte à votre emploi du temps, pas l'inverse.",
  },
  {
    number: '02',
    title: 'Équipements premium',
    description: 'Technogym, machines de dernière génération et terrains aux normes internationales.',
  },
  {
    number: '03',
    title: 'Accompagnement personnalisé',
    description: 'Coachs certifiés et professionnels de santé dédiés à vos objectifs.',
  },
  {
    number: '04',
    title: 'Axé performance & bien-être',
    description: 'Un espace où la performance sportive et la récupération cohabitent.',
  },
  {
    number: '05',
    title: 'Accessible à tous',
    description: 'Du débutant au confirmé, dans une atmosphère stimulante et conviviale.',
  },
  {
    number: '06',
    title: 'En amélioration continue',
    description: 'Nouvelles disciplines, équipements actualisés, méthodes modernes.',
  },
];

export function ValuesSection() {
  return (
    <section className="bg-white py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-4">
            Nos engagements
          </p>
          <h2 className="text-section text-[#1d1d1b]">
            Ce que vous méritez,<br />sans compromis.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
          {commitments.map((item) => (
            <div
              key={item.number}
              className="bg-white p-10 group hover:bg-[#1d1d1b] transition-colors duration-300"
            >
              <span className="block text-black/15 text-5xl font-bold mb-8 group-hover:text-white/10 transition-colors tabular-nums">
                {item.number}
              </span>
              <h3 className="text-[#1d1d1b] font-bold text-lg mb-4 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
