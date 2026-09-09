import { PageSlug } from './page-slugs';

// Seeded once per slug the first time the app boots against an empty
// collection (see PagesService.onModuleInit) — real starting content per the
// cahier des charges, not lorem ipsum, but freely editable afterwards from
// the back office. Never re-applied over a value staff has already edited.
export const DEFAULT_PAGES: Record<PageSlug, {
  heroTitleFr: string; heroTitleEn: string; heroSubtitleFr: string; heroSubtitleEn: string;
  sections: { icon: string; titleFr: string; titleEn: string; bodyFr: string; bodyEn: string }[];
}> = {
  'guide-du-voyageur': {
    heroTitleFr: 'Guide du voyageur',
    heroTitleEn: "Traveler's Guide",
    heroSubtitleFr: 'Tout ce qu\'il faut savoir pour préparer et vivre votre séjour au Bénin, en toute sérénité.',
    heroSubtitleEn: 'Everything you need to know to prepare for and enjoy your stay in Benin, with peace of mind.',
    sections: [
      {
        icon: 'passport',
        titleFr: 'Visa et formalités',
        titleEn: 'Visa & formalities',
        bodyFr: "La plupart des voyageurs doivent obtenir un visa avant leur arrivée — l'e-visa officiel se demande en ligne sur evisa.gouv.bj et est généralement traité en une heure à quatre jours. Il permet un séjour de 90 jours avec entrées multiples. Un passeport valide et une preuve d'hébergement sont généralement demandés ; notre équipe vous accompagne dans les démarches.",
        bodyEn: "Most travelers need a visa before arrival — the official e-visa is requested online at evisa.gouv.bj and is typically processed within one hour to four days. It allows a 90-day stay with multiple entries. A valid passport and proof of accommodation are generally required; our team can guide you through the process.",
      },
      {
        icon: 'plane',
        titleFr: 'Accès et transport',
        titleEn: 'Getting there & around',
        bodyFr: "Le Bénin se rejoint principalement par l'aéroport international de Cotonou (COO), desservi par plusieurs compagnies internationales, ou par la route depuis le Nigeria ou le Togo. Une fois sur place, vos déplacements pendant le séjour sont pris en charge par notre équipe — véhicule climatisé avec chauffeur pour toutes les excursions organisées.",
        bodyEn: 'Benin is reached mainly through Cotonou International Airport (COO), served by several international carriers, or overland from Nigeria or Togo. Once there, your transportation throughout the stay is handled by our team — an air-conditioned vehicle with driver for every organized excursion.',
      },
      {
        icon: 'shield',
        titleFr: 'Santé et sécurité',
        titleEn: 'Health & safety',
        bodyFr: "La fièvre jaune n'est pas exigée à l'entrée mais reste recommandée par précaution, tout comme être à jour sur la typhoïde et l'hépatite A/B, et prévoir un traitement antipaludéen. Le Bénin est une destination sûre où les voyageurs peuvent explorer en toute confiance ; comme partout, restez attentif à vos effets personnels dans les lieux très fréquentés. Notre équipe reste joignable tout au long du séjour.",
        bodyEn: "Yellow fever isn't required for entry but is still recommended as a precaution, along with being up to date on typhoid and hepatitis A/B and carrying anti-malaria medication. Benin is a safe destination where travelers can explore with confidence; as anywhere, stay mindful of your belongings in busy places. Our team remains reachable throughout your stay.",
      },
      {
        icon: 'wallet',
        titleFr: 'Monnaie locale',
        titleEn: 'Local currency',
        bodyFr: "La monnaie officielle est le franc CFA (XOF). Espèces, cartes bancaires et mobile money (MTN, Moov) sont tous acceptés, avec des distributeurs disponibles dans les grands centres urbains. Prévoyez des espèces pour les marchés et petits commerces.",
        bodyEn: 'The official currency is the CFA franc (XOF). Cash, bank cards, and mobile money (MTN, Moov) are all accepted, with ATMs available in major urban centers. Carry cash for markets and small shops.',
      },
      {
        icon: 'sun',
        titleFr: 'Météo et meilleure période',
        titleEn: 'Weather & best time to visit',
        bodyFr: "Climat tropical agréable toute l'année, avec une saison sèche (novembre à mars) particulièrement propice aux voyages. Le Bénin est sur le fuseau GMT+1. Les prises électriques sont de types C et E (220V) — pensez à un adaptateur si besoin.",
        bodyEn: 'A pleasant tropical climate year-round, with a dry season (November to March) especially favorable for travel. Benin runs on GMT+1. Power outlets are types C and E (220V) — bring an adapter if needed.',
      },
      {
        icon: 'message-circle',
        titleFr: 'Langues et étiquette',
        titleEn: 'Languages & etiquette',
        bodyFr: "Le français est la langue officielle, utilisée dans l'administration, l'hôtellerie et le tourisme ; de nombreuses langues nationales (fon, yoruba, dendi...) sont aussi parlées selon les régions. Par respect, demandez toujours la permission avant de photographier une personne, une cérémonie ou un lieu de culte.",
        bodyEn: 'French is the official language, used in administration, hospitality, and tourism; many national languages (Fon, Yoruba, Dendi, and others) are also spoken depending on the region. Out of respect, always ask permission before photographing a person, a ceremony, or a place of worship.',
      },
      {
        icon: 'map-pin',
        titleFr: 'Lieux incontournables',
        titleEn: 'Must-see places',
        bodyFr: "Ouidah et sa Route des Esclaves, la cité lacustre de Ganvié, les palais royaux d'Abomey (patrimoine UNESCO), les plages de Grand-Popo, la réserve de la Pendjari et le marché animé de Dantokpa à Cotonou figurent parmi les incontournables.",
        bodyEn: "Ouidah and its Slave Route, the lake city of Ganvié, the Royal Palaces of Abomey (UNESCO heritage site), the beaches of Grand-Popo, Pendjari National Park, and Cotonou's lively Dantokpa market are among the must-see destinations.",
      },
    ],
  },
  'a-propos': {
    heroTitleFr: 'À propos de Vakpon Tours',
    heroTitleEn: 'About Vakpon Tours',
    heroSubtitleFr: "Votre porte d'entrée authentique vers le Bénin et l'Afrique de l'Ouest.",
    heroSubtitleEn: 'Your authentic gateway to Benin and West Africa.',
    sections: [
      {
        icon: 'target',
        titleFr: 'Notre mission',
        titleEn: 'Our mission',
        bodyFr: "Vakpon Tours est né d'une conviction simple : le Bénin mérite d'être découvert par le plus grand nombre, dans les meilleures conditions. Nous révélons le Bénin et donnons vie à chaque voyage — en connectant la diaspora africaine et les voyageurs du monde entier à des séjours tout-inclus pensés pour être simples, sécurisés et mémorables, de la première réservation jusqu'au retour.",
        bodyEn: 'Vakpon Tours was born from a simple conviction: Benin deserves to be discovered by as many people as possible, under the best conditions. We reveal Benin and bring every journey to life — connecting the African diaspora and travelers from around the world with all-inclusive stays designed to be simple, safe, and memorable, from the first booking to the journey home.',
      },
      {
        icon: 'globe',
        titleFr: 'Authenticité',
        titleEn: 'Authenticity',
        bodyFr: 'Nous faisons découvrir le vrai Bénin : ses traditions, son artisanat, sa gastronomie et son histoire, à travers des guides locaux passionnés plutôt que des circuits impersonnels.',
        bodyEn: 'We share the real Benin: its traditions, craftsmanship, cuisine, and history, through passionate local guides rather than impersonal tour circuits.',
      },
      {
        icon: 'shield',
        titleFr: 'Sécurité',
        titleEn: 'Security',
        bodyFr: "Chaque étape de votre séjour est organisée et suivie par notre équipe, du premier contact jusqu'à votre retour, pour que vous voyagiez l'esprit tranquille.",
        bodyEn: 'Every step of your stay is organized and monitored by our team, from first contact until your return, so you can travel with complete peace of mind.',
      },
      {
        icon: 'users',
        titleFr: 'Accompagnement personnalisé',
        titleEn: 'Personalized support',
        bodyFr: "Chaque client bénéficie d'un accompagnement dédié : un agent vous contacte pour affiner votre séjour, répondre à vos questions et rester joignable tout au long de votre voyage.",
        bodyEn: 'Every client gets dedicated support: an agent contacts you to fine-tune your stay, answer your questions, and stay reachable throughout your trip.',
      },
    ],
  },
};
