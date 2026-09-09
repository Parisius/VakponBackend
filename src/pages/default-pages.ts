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
        icon: '🛂',
        titleFr: "Formalités d'entrée",
        titleEn: 'Entry requirements',
        bodyFr: "Les ressortissants de la plupart des pays doivent obtenir un visa avant leur arrivée ou un e-visa via le site officiel du gouvernement béninois. Un passeport valide au moins 6 mois après la date de retour est requis, ainsi qu'une preuve de réservation et un billet retour. Notre équipe vous accompagne dans les démarches.",
        bodyEn: "Most nationalities need a visa before arrival, or an e-visa via Benin's official government portal. Your passport must remain valid for at least 6 months after your return date, along with proof of accommodation and a return ticket. Our team can guide you through the process.",
      },
      {
        icon: '💉',
        titleFr: 'Conseils santé',
        titleEn: 'Health advice',
        bodyFr: "La vaccination contre la fièvre jaune est obligatoire pour entrer au Bénin — munissez-vous de votre carnet de vaccination international. Il est également recommandé d'être à jour sur la typhoïde, l'hépatite A/B et de prendre un traitement antipaludéen. Consultez un médecin avant le départ.",
        bodyEn: 'Yellow fever vaccination is mandatory to enter Benin — bring your international vaccination certificate. Being up to date on typhoid and hepatitis A/B, and taking anti-malaria medication, is also recommended. See a doctor before departing.',
      },
      {
        icon: '💰',
        titleFr: 'Monnaie et paiement',
        titleEn: 'Currency & payment',
        bodyFr: "La monnaie locale est le franc CFA (XOF). Les espèces restent le moyen de paiement le plus utilisé, notamment en dehors de Cotonou ; le mobile money (MTN, Moov) est très répandu. Les cartes bancaires sont acceptées dans certains hôtels et grandes enseignes.",
        bodyEn: 'The local currency is the CFA franc (XOF). Cash remains the most widely used means of payment, especially outside Cotonou; mobile money (MTN, Moov) is very common. Bank cards are accepted at some hotels and larger businesses.',
      },
      {
        icon: '🚐',
        titleFr: 'Transport sur place',
        titleEn: 'Getting around',
        bodyFr: 'Pendant votre séjour, vos déplacements sont pris en charge par notre équipe : véhicule climatisé avec chauffeur pour les excursions organisées. Sur place, les taxis et zémidjans (taxis-motos) sont courants pour de courts trajets — négociez toujours le prix avant de monter.',
        bodyEn: 'During your stay, transportation is handled by our team: an air-conditioned vehicle with driver for organized excursions. Locally, taxis and zémidjans (motorbike taxis) are common for short trips — always agree on the fare before getting on.',
      },
      {
        icon: '☀️',
        titleFr: 'Météo et meilleure période',
        titleEn: 'Weather & best time to visit',
        bodyFr: 'Le Bénin connaît un climat tropical avec deux saisons : la saison sèche (novembre à mars, idéale pour voyager) et la saison des pluies (avril à octobre). Les températures oscillent entre 24°C et 32°C toute l\'année.',
        bodyEn: 'Benin has a tropical climate with two main seasons: the dry season (November to March, ideal for traveling) and the rainy season (April to October). Temperatures range between 24°C and 32°C year-round.',
      },
      {
        icon: '🛡️',
        titleFr: 'Sécurité et conseils pratiques',
        titleEn: 'Safety & practical tips',
        bodyFr: "Le Bénin est globalement un pays sûr et accueillant. Comme partout, restez vigilant avec vos effets personnels dans les lieux très fréquentés et suivez les recommandations de votre guide local. Notre équipe reste joignable tout au long de votre séjour.",
        bodyEn: "Benin is generally a safe and welcoming country. As anywhere, stay mindful of your belongings in crowded places and follow your local guide's recommendations. Our team remains reachable throughout your stay.",
      },
      {
        icon: '📍',
        titleFr: 'Lieux incontournables',
        titleEn: 'Must-see places',
        bodyFr: 'Ouidah et sa Route des Esclaves, la cité lacustre de Ganvié, les palais royaux d\'Abomey (patrimoine UNESCO), les plages de Grand-Popo, la réserve de la Pendjari et le marché animé de Dantokpa à Cotonou figurent parmi les incontournables.',
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
        icon: '🎯',
        titleFr: 'Notre mission',
        titleEn: 'Our mission',
        bodyFr: "Vakpon Tours est née d'une conviction simple : le Bénin mérite d'être découvert par le plus grand nombre, dans les meilleures conditions. Nous connectons la diaspora africaine et les voyageurs du monde entier à des séjours tout-inclus, pensés pour être simples, sécurisés et mémorables — de la première réservation jusqu'au retour.",
        bodyEn: 'Vakpon Tours was born from a simple conviction: Benin deserves to be discovered by as many people as possible, under the best conditions. We connect the African diaspora and travelers from around the world with all-inclusive stays designed to be simple, safe, and memorable — from the first booking to the journey home.',
      },
      {
        icon: '🌍',
        titleFr: 'Authenticité',
        titleEn: 'Authenticity',
        bodyFr: 'Nous faisons découvrir le vrai Bénin : ses traditions, son artisanat, sa gastronomie et son histoire, à travers des guides locaux passionnés plutôt que des circuits impersonnels.',
        bodyEn: 'We share the real Benin: its traditions, craftsmanship, cuisine, and history, through passionate local guides rather than impersonal tour circuits.',
      },
      {
        icon: '🔒',
        titleFr: 'Sécurité',
        titleEn: 'Security',
        bodyFr: 'Chaque étape de votre séjour est organisée et suivie par notre équipe, du premier contact jusqu\'à votre retour, pour que vous voyagiez l\'esprit tranquille.',
        bodyEn: 'Every step of your stay is organized and monitored by our team, from first contact until your return, so you can travel with complete peace of mind.',
      },
      {
        icon: '🤝',
        titleFr: 'Accompagnement personnalisé',
        titleEn: 'Personalized support',
        bodyFr: 'Chaque client bénéficie d\'un accompagnement dédié : un agent vous contacte pour affiner votre séjour, répondre à vos questions et rester joignable tout au long de votre voyage.',
        bodyEn: 'Every client gets dedicated support: an agent contacts you to fine-tune your stay, answer your questions, and stay reachable throughout your trip.',
      },
    ],
  },
};
