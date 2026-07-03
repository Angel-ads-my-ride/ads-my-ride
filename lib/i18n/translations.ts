export type Locale = "fr" | "en" | "es";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export const DEFAULT_LOCALE: Locale = "fr";

export interface Dict {
  nav: {
    accueil: string;
    decouvrir: string;
    annonces: string;
    connexion: string;
    sinscrire: string;
    monDashboard: string;
    dashboardAnnonceur: string;
    deconnexion: string;
  };
  hero: {
    subtitle: string;
    selectVehicle: string;
    selectVehicleSub: string;
    brand: string;
    model: string;
    chooseBrand: string;
    chooseModel: string;
    brandFirst: string;
    selectBrandThenModel: string;
    adsCountSingular: string;
    adsCountPlural: string;
    adsCountFor: string;
    see: string;
    notRegistered: string;
    createAccount: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: { title: string; desc: string }[];
  };
  ads: {
    allAds: string;
    adsFor: string;
    selectVehicleToFilter: string;
    campaignSingular: string;
    campaignPlural: string;
    compatibleSingular: string;
    compatiblePlural: string;
    selectMyVehicle: string;
    noAdsAvailable: string;
    comeBackSoon: string;
    noCompatiblePrefix: string;
    noCompatibleSoon: string;
  };
  adCard: {
    photoComing: string;
    notCompatible: string;
    modelSingular: string;
    modelPlural: string;
    viewAd: string;
    notAvailable: string;
    perDay: string;
    perMonth: string;
  };
  footer: {
    rights: string;
    legalMentions: string;
  };
}

export const translations: Record<Locale, Dict> = {
  fr: {
    nav: {
      accueil: "Accueil",
      decouvrir: "Découvrir",
      annonces: "Annonces",
      connexion: "Connexion",
      sinscrire: "S'inscrire",
      monDashboard: "Mon dashboard",
      dashboardAnnonceur: "Dashboard annonceur",
      deconnexion: "Déconnexion",
    },
    hero: {
      subtitle:
        "Choisissez une annonce, posez un covering chez un partenaire, et gagnez de l'argent en conduisant normalement.",
      selectVehicle: "Sélectionnez votre véhicule",
      selectVehicleSub: "Pour voir les annonces compatibles",
      brand: "Marque",
      model: "Modèle",
      chooseBrand: "Choisir une marque",
      chooseModel: "Choisir un modèle",
      brandFirst: "Marque d'abord…",
      selectBrandThenModel: "Sélectionnez votre marque puis votre modèle",
      adsCountSingular: "annonce",
      adsCountPlural: "annonces",
      adsCountFor: "pour",
      see: "Voir",
      notRegistered: "Pas encore inscrit ?",
      createAccount: "Créer un compte",
    },
    howItWorks: {
      title: "Comment ça marche ?",
      subtitle: "3 étapes simples pour monétiser votre véhicule.",
      steps: [
        {
          title: "Choisissez une annonce",
          desc: "Sélectionnez votre véhicule et parcourez les campagnes disponibles. Chaque annonceur définit les modèles éligibles.",
        },
        {
          title: "Posez le covering",
          desc: "Prenez rendez-vous chez l'un de nos partenaires. L'installation du covering est prise en charge par l'annonceur.",
        },
        {
          title: "Touchez vos gains",
          desc: "Conduisez normalement et recevez votre rémunération quotidienne directement sur votre compte.",
        },
      ],
    },
    ads: {
      allAds: "Toutes les annonces",
      adsFor: "Annonces pour",
      selectVehicleToFilter: "Sélectionnez votre véhicule ci-dessus pour filtrer",
      campaignSingular: "campagne",
      campaignPlural: "campagnes",
      compatibleSingular: "compatible",
      compatiblePlural: "compatibles",
      selectMyVehicle: "↑ Sélectionner mon véhicule",
      noAdsAvailable: "Aucune annonce disponible pour le moment",
      comeBackSoon: "Revenez bientôt, de nouvelles campagnes arrivent régulièrement.",
      noCompatiblePrefix: "Pas d'annonce compatible avec votre",
      noCompatibleSoon: "De nouvelles campagnes pour votre modèle arrivent bientôt.",
    },
    adCard: {
      photoComing: "Photo à venir",
      notCompatible: "Non compatible",
      modelSingular: "modèle",
      modelPlural: "modèles",
      viewAd: "Voir l'annonce",
      notAvailable: "Non disponible",
      perDay: "/jour",
      perMonth: "/mois",
    },
    footer: {
      rights: "Tous droits réservés.",
      legalMentions: "Mentions légales",
    },
  },
  en: {
    nav: {
      accueil: "Home",
      decouvrir: "Discover",
      annonces: "Listings",
      connexion: "Log in",
      sinscrire: "Sign up",
      monDashboard: "My dashboard",
      dashboardAnnonceur: "Advertiser dashboard",
      deconnexion: "Log out",
    },
    hero: {
      subtitle:
        "Pick a campaign, get the wrap installed at a partner shop, and earn money just by driving normally.",
      selectVehicle: "Select your vehicle",
      selectVehicleSub: "To see matching listings",
      brand: "Make",
      model: "Model",
      chooseBrand: "Choose a make",
      chooseModel: "Choose a model",
      brandFirst: "Make first…",
      selectBrandThenModel: "Select your make then your model",
      adsCountSingular: "listing",
      adsCountPlural: "listings",
      adsCountFor: "for",
      see: "View",
      notRegistered: "Not registered yet?",
      createAccount: "Create an account",
    },
    howItWorks: {
      title: "How it works",
      subtitle: "3 simple steps to monetize your vehicle.",
      steps: [
        {
          title: "Choose a listing",
          desc: "Select your vehicle and browse available campaigns. Each advertiser defines the eligible models.",
        },
        {
          title: "Get the wrap installed",
          desc: "Book an appointment with one of our partners. The wrap installation is covered by the advertiser.",
        },
        {
          title: "Earn your payout",
          desc: "Drive normally and receive your daily payout directly to your account.",
        },
      ],
    },
    ads: {
      allAds: "All listings",
      adsFor: "Listings for",
      selectVehicleToFilter: "Select your vehicle above to filter",
      campaignSingular: "campaign",
      campaignPlural: "campaigns",
      compatibleSingular: "compatible",
      compatiblePlural: "compatible",
      selectMyVehicle: "↑ Select my vehicle",
      noAdsAvailable: "No listings available right now",
      comeBackSoon: "Come back soon, new campaigns arrive regularly.",
      noCompatiblePrefix: "No listing compatible with your",
      noCompatibleSoon: "New campaigns for your model are coming soon.",
    },
    adCard: {
      photoComing: "Photo coming soon",
      notCompatible: "Not compatible",
      modelSingular: "model",
      modelPlural: "models",
      viewAd: "View listing",
      notAvailable: "Not available",
      perDay: "/day",
      perMonth: "/month",
    },
    footer: {
      rights: "All rights reserved.",
      legalMentions: "Legal notice",
    },
  },
  es: {
    nav: {
      accueil: "Inicio",
      decouvrir: "Descubrir",
      annonces: "Anuncios",
      connexion: "Iniciar sesión",
      sinscrire: "Registrarse",
      monDashboard: "Mi panel",
      dashboardAnnonceur: "Panel anunciante",
      deconnexion: "Cerrar sesión",
    },
    hero: {
      subtitle:
        "Elige una campaña, instala el vinilo en un taller asociado y gana dinero conduciendo con normalidad.",
      selectVehicle: "Selecciona tu vehículo",
      selectVehicleSub: "Para ver los anuncios compatibles",
      brand: "Marca",
      model: "Modelo",
      chooseBrand: "Elegir una marca",
      chooseModel: "Elegir un modelo",
      brandFirst: "Marca primero…",
      selectBrandThenModel: "Selecciona tu marca y luego tu modelo",
      adsCountSingular: "anuncio",
      adsCountPlural: "anuncios",
      adsCountFor: "para",
      see: "Ver",
      notRegistered: "¿Aún no tienes cuenta?",
      createAccount: "Crear una cuenta",
    },
    howItWorks: {
      title: "¿Cómo funciona?",
      subtitle: "3 pasos simples para monetizar tu vehículo.",
      steps: [
        {
          title: "Elige un anuncio",
          desc: "Selecciona tu vehículo y explora las campañas disponibles. Cada anunciante define los modelos elegibles.",
        },
        {
          title: "Instala el vinilo",
          desc: "Reserva una cita con uno de nuestros talleres asociados. La instalación corre a cargo del anunciante.",
        },
        {
          title: "Recibe tus ingresos",
          desc: "Conduce con normalidad y recibe tu pago diario directamente en tu cuenta.",
        },
      ],
    },
    ads: {
      allAds: "Todos los anuncios",
      adsFor: "Anuncios para",
      selectVehicleToFilter: "Selecciona tu vehículo arriba para filtrar",
      campaignSingular: "campaña",
      campaignPlural: "campañas",
      compatibleSingular: "compatible",
      compatiblePlural: "compatibles",
      selectMyVehicle: "↑ Seleccionar mi vehículo",
      noAdsAvailable: "No hay anuncios disponibles por ahora",
      comeBackSoon: "Vuelve pronto, llegan nuevas campañas regularmente.",
      noCompatiblePrefix: "No hay anuncios compatibles con tu",
      noCompatibleSoon: "Pronto llegarán nuevas campañas para tu modelo.",
    },
    adCard: {
      photoComing: "Foto próximamente",
      notCompatible: "No compatible",
      modelSingular: "modelo",
      modelPlural: "modelos",
      viewAd: "Ver anuncio",
      notAvailable: "No disponible",
      perDay: "/día",
      perMonth: "/mes",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      legalMentions: "Aviso legal",
    },
  },
};
