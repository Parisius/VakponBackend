// Seed data for the site's static chrome (nav, buttons, sections, forms,
// footer) — everything that isn't offer content. Inserted once per key on
// startup (see TranslationsService.seedMissing); never overwrites a row a
// staff member has already edited from admin/translations.html.
export const DEFAULT_UI_STRINGS: { key: string; fr: string; en: string }[] = [
  // Meta
  { key: 'meta.title', fr: 'Vakpon Tours | Voyage Authentique au Bénin', en: 'Vakpon Tours | Authentic Travel in Benin' },
  { key: 'meta.description', fr: "Découvrez l'Afrique de l'Ouest sous son état le plus pur avec Vakpon Tours.", en: 'Discover West Africa in its purest form with Vakpon Tours.' },

  // Nav (used in both the desktop nav and the hero/header mobile menu)
  { key: 'nav.about', fr: 'À propos', en: 'About' },
  { key: 'nav.offers', fr: 'Nos Offres', en: 'Our Offers' },
  { key: 'nav.heritage', fr: 'Notre Patrimoine', en: 'Our Heritage' },
  { key: 'nav.espaceClient', fr: 'Espace Client', en: 'Client Area' },
  { key: 'nav.contact', fr: 'Contact', en: 'Contact' },
  { key: 'header.contactBtn', fr: 'Nous Contacter', en: 'Contact Us' },
  { key: 'heroMenu.specialOffer', fr: 'Offre Spéciale', en: 'Special Offer' },

  // Accessibility labels
  { key: 'a11y.themeToggle', fr: 'Changer de thème', en: 'Toggle theme' },
  { key: 'a11y.openMenu', fr: 'Ouvrir le menu', en: 'Open menu' },
  { key: 'a11y.closeModal', fr: 'Fermer', en: 'Close' },
  { key: 'a11y.scrollDown', fr: 'Faites défiler vers le bas', en: 'Scroll down' },
  { key: 'a11y.langSwitch', fr: 'Passer en anglais', en: 'Switch to French' },

  // Hero menu label swap
  { key: 'hero.menuOpen', fr: 'MENU', en: 'MENU' },
  { key: 'hero.menuClose', fr: 'FERMER', en: 'CLOSE' },
  { key: 'hero.typewriter', fr: 'Un monde de splendeurs vous attend', en: 'A world of wonders awaits' },
  { key: 'hero.defaultWelcome', fr: 'Avec Vakpon Tours', en: 'With Vakpon Tours' },
  { key: 'hero.defaultHeadline', fr: 'Vivez une nouvelle façon<br>de découvrir le Bénin', en: 'Experience a new way<br>to discover Benin' },

  // Modal (shared static labels — offer-specific content comes from the Offer itself)
  { key: 'modal.includedLabel', fr: "LE FORFAIT COMPREND", en: "WHAT'S INCLUDED" },
  { key: 'modal.itineraryLabel', fr: 'PROGRAMME INDICATIF', en: 'SUGGESTED ITINERARY' },
  { key: 'modal.reserveBtn', fr: 'Réserver cette offre', en: 'Book This Offer' },

  // Vision section
  { key: 'vision.eyebrow', fr: '<span class="accent-word">Notre</span> Vision', en: '<span class="accent-word">Our</span> Vision' },
  { key: 'vision.heading', fr: "L'Afrique de l'Ouest commence ici.", en: 'West Africa starts here.' },
  {
    key: 'vision.paragraph',
    fr: "Plongez au cœur du patrimoine béninois avec nos 5 expériences exclusives. De la « Découverte Essentielle » de 5 jours aux immersions culturelles profondes, Vakpon Tours transforme votre voyage en une véritable révélation. Prêt à voir le Bénin autrement ? Choisissez votre package ou créez votre itinéraire personnalisé avec nos experts.",
    en: "Dive into the heart of Beninese heritage with our 5 exclusive experiences. From the 5-day \"Essential Discovery\" to deep cultural immersions, Vakpon Tours turns your trip into a genuine revelation. Ready to see Benin differently? Choose a package or build your own custom itinerary with our experts.",
  },
  { key: 'vision.cta', fr: 'Explorer nos packages', en: 'Explore Our Packages' },

  // Offres section
  { key: 'offres.eyebrow', fr: '<span class="accent-word">Nos</span> Offres', en: '<span class="accent-word">Our</span> Offers' },
  { key: 'offres.heading', fr: 'Cinq façons de découvrir le Bénin', en: 'Five Ways to Discover Benin' },
  { key: 'offerCard.specialBadge', fr: 'Offre Spéciale : Places Limitées', en: 'Special Offer: Limited Spots' },
  { key: 'offerCard.viewFullOffer', fr: "Voir l'offre complète", en: 'View Full Offer' },
  { key: 'offerCard.reserveBtn', fr: 'Réserver ce package', en: 'Book This Package' },
  { key: 'common.includedLabel', fr: 'CE QUI EST INCLUS', en: "WHAT'S INCLUDED" },

  // Sur-mesure (custom) offer card — the one static card that isn't a database Offer
  { key: 'surMesure.title', fr: 'Sur-Mesure', en: 'Custom-Made' },
  { key: 'surMesure.quote', fr: '« Vous définissez votre aventure, nous la réalisons. »', en: '"You define your adventure, we make it happen."' },
  {
    key: 'surMesure.desc',
    fr: 'Votre aventure au Bénin commence ici. Décrivez-nous votre projet de voyage et notre équipe vous répondra sous 24 heures avec une proposition personnalisée.',
    en: "Your Benin adventure starts here. Tell us about your travel plans and our team will get back to you within 24 hours with a tailored proposal.",
  },
  { key: 'surMesure.cta', fr: 'Créer mon trajet', en: 'Build My Trip' },
  { key: 'surMesure.meta', fr: '<b>Votre Roadmap</b> - itinéraire sur mesure', en: '<b>Your Roadmap</b> - custom itinerary' },
  { key: 'surMesure.reserveName', fr: 'Offre sur-mesure', en: 'Custom-made offer' },

  // Patrimoine section
  { key: 'patrimoine.eyebrow', fr: '<span class="accent-word">Ce</span> que vous découvrirez', en: '<span class="accent-word">What</span> You\'ll Discover' },
  { key: 'patrimoine.heading', fr: 'Le Patrimoine Béninois en Quatre Dimensions', en: 'Beninese Heritage in Four Dimensions' },
  { key: 'heritage.1.title', fr: 'Héritage & Histoire', en: 'Heritage & History' },
  {
    key: 'heritage.1.text',
    fr: "Remontez le temps sur la Route des Esclaves à Ouidah et explorez les majestueux Palais Royaux d'Abomey, classés au patrimoine mondial de l'UNESCO - un voyage poignant au cœur des anciens royaumes.",
    en: 'Travel back in time along the Slave Route in Ouidah and explore the majestic Royal Palaces of Abomey, a UNESCO World Heritage Site — a moving journey into the heart of ancient kingdoms.',
  },
  { key: 'heritage.2.title', fr: 'Spiritualité & Traditions', en: 'Spirituality & Traditions' },
  {
    key: 'heritage.2.text',
    fr: 'Découvrez la richesse spirituelle du Bénin, terre d\'origine du culte Vodoun. Initiez-vous à une philosophie de vie ancestrale à travers des cérémonies authentiques et des danses rituelles.',
    en: 'Discover the spiritual richness of Benin, birthplace of the Vodun faith. Get introduced to an ancestral philosophy of life through authentic ceremonies and ritual dances.',
  },
  { key: 'heritage.3.title', fr: 'Nature & Biodiversité', en: 'Nature & Biodiversity' },
  {
    key: 'heritage.3.text',
    fr: "De la savane du Parc National de la Pendjari aux collines de l'Atacora, le Bénin offre une biodiversité unique : observez lions, éléphants et guépards dans leur habitat naturel.",
    en: 'From the savannah of Pendjari National Park to the hills of the Atacora, Benin offers unique biodiversity: watch lions, elephants and cheetahs in their natural habitat.',
  },
  { key: 'heritage.4.title', fr: 'Vie Lacustre & Artisanat', en: 'Lake Life & Craftsmanship' },
  {
    key: 'heritage.4.text',
    fr: 'Glissez sur les eaux du lac Nokoué pour découvrir Ganvié, la plus grande cité lacustre d\'Afrique, et rencontrez des artisans passionnés au rythme des marchés flottants.',
    en: "Glide across the waters of Lake Nokoué to discover Ganvié, Africa's largest lake village, and meet passionate artisans amid the rhythm of floating markets.",
  },

  // Contact section
  { key: 'contact.eyebrow', fr: '<span class="accent-word">Prêt</span> à voyager ?', en: '<span class="accent-word">Ready</span> to travel?' },
  { key: 'contact.heading', fr: 'Réservez Votre Voyage au Bénin', en: 'Book Your Trip to Benin' },
  {
    key: 'contact.paragraph',
    fr: 'Ce formulaire est une demande de réservation. Remplissez vos préférences et notre équipe vous répondra sous 24 heures avec une confirmation et les modalités de paiement.',
    en: "This form is a reservation request. Fill in your preferences and our team will get back to you within 24 hours with a confirmation and payment details.",
  },
  { key: 'contact.emailLabel', fr: 'EMAIL', en: 'EMAIL' },
  { key: 'contact.phoneFrLabel', fr: 'TÉLÉPHONE (FR)', en: 'PHONE (FR)' },
  { key: 'contact.phoneBjLabel', fr: 'TÉLÉPHONE (BJ)', en: 'PHONE (BJ)' },
  { key: 'contact.locationLabel', fr: 'LOCALISATION', en: 'LOCATION' },

  // Reservation form
  { key: 'form.heading', fr: 'FORMULAIRE DE RÉSERVATION', en: 'RESERVATION FORM' },
  { key: 'form.fullNameLabel', fr: 'Nom complet', en: 'Full Name' },
  { key: 'form.fullNamePlaceholder', fr: 'Votre nom', en: 'Your name' },
  { key: 'form.emailLabel', fr: 'Email', en: 'Email' },
  { key: 'form.emailPlaceholder', fr: 'vous@email.com', en: 'you@email.com' },
  { key: 'form.offerLabel', fr: 'Offre à réserver', en: 'Offer to Book' },
  { key: 'form.travelersLabel', fr: 'Nombre de voyageurs', en: 'Number of Travelers' },
  { key: 'form.startDateLabel', fr: 'Date de début', en: 'Start Date' },
  { key: 'form.endDateLabel', fr: 'Date de fin', en: 'End Date' },
  { key: 'form.messageLabel', fr: 'Votre projet de voyage', en: 'Your Travel Plans' },
  { key: 'form.messagePlaceholder', fr: 'Parlez-nous de votre voyage idéal...', en: 'Tell us about your dream trip...' },
  { key: 'form.submitBtn', fr: 'Envoyer ma demande de réservation', en: 'Send My Reservation Request' },
  { key: 'form.note', fr: 'Réservation sans engagement. Nous répondons généralement sous 24 heures.', en: 'No-obligation request. We usually reply within 24 hours.' },
  { key: 'form.sending', fr: 'Envoi en cours...', en: 'Sending...' },
  {
    key: 'form.successMsg',
    fr: 'Merci ! Votre demande de réservation a bien été enregistrée. Nous vous répondrons sous 24 heures.',
    en: "Thank you! Your reservation request has been received. We'll get back to you within 24 hours.",
  },
  {
    key: 'form.errorMsg',
    fr: 'Erreur : {msg} Merci de réessayer ou de nous contacter directement.',
    en: 'Error: {msg} Please try again or contact us directly.',
  },

  // Footer
  { key: 'footer.tagline', fr: "Votre porte d'entrée authentique vers le Bénin et l'Afrique de l'Ouest.", en: 'Your authentic gateway to Benin and West Africa.' },
  { key: 'footer.navHeading', fr: 'NAVIGATION', en: 'NAVIGATION' },
  { key: 'footer.nav.packages', fr: 'Nos packages', en: 'Our Packages' },
  { key: 'footer.nav.heritage', fr: 'Patrimoine', en: 'Heritage' },
  { key: 'footer.destinationsHeading', fr: 'DESTINATIONS', en: 'DESTINATIONS' },
  { key: 'footer.joinHeading', fr: 'NOUS REJOINDRE', en: 'GET IN TOUCH' },
  { key: 'footer.copyright', fr: '© 2026 Vakpon Tours. Tous droits réservés.', en: '© 2026 Vakpon Tours. All rights reserved.' },
  {
    key: 'footer.madeWith',
    fr: 'Fait avec <span style="color:#e0455f;">❤️</span> par <a href="https://dreamxr.io" target="_blank" rel="noopener" style="text-decoration:underline;">Dreamxr.io</a>',
    en: 'Made with <span style="color:#e0455f;">❤️</span> by <a href="https://dreamxr.io" target="_blank" rel="noopener" style="text-decoration:underline;">Dreamxr.io</a>',
  },
  { key: 'footer.legalMentions', fr: 'Mentions légales', en: 'Legal Notice' },
  { key: 'footer.privacyPolicy', fr: 'Politique de confidentialité', en: 'Privacy Policy' },
  { key: 'footer.terms', fr: 'CGV', en: 'Terms of Sale' },
];
