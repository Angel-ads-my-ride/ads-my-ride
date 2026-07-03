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
  legal: {
    title: string;
    lastUpdated: string;
    part1: string;
    part2: string;
    cguTitle: string;
    privacyTitle: string;
    cguSections: LegalSection[];
    privacySections: LegalSection[];
  };
}

export interface LegalSection {
  title: string;
  intro?: string;
  list?: string[];
  outro?: string;
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
    legal: {
      title: "Mentions légales",
      lastUpdated: "Dernière mise à jour : mars 2026",
      part1: "PARTIE 1",
      part2: "PARTIE 2",
      cguTitle: "Conditions Générales d'Utilisation",
      privacyTitle: "Politique de confidentialité",
      cguSections: [
        {
          title: "1. Objet",
          intro:
            "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Ads My Ride, qui met en relation des conducteurs et des annonceurs pour l'affichage de publicités sur des véhicules. En créant un compte, vous acceptez sans réserve les présentes CGU.",
        },
        {
          title: "2. Accès au service",
          intro:
            "Ads My Ride est accessible à toute personne majeure créant un compte conducteur ou annonceur via le formulaire d'inscription. Vous êtes responsable de la confidentialité de vos identifiants de connexion.",
        },
        {
          title: "3. Utilisation du service",
          intro: "Vous vous engagez à utiliser Ads My Ride dans un cadre légal et loyal. Il est interdit de :",
          list: [
            "Tenter d'accéder à des comptes ou données d'autres utilisateurs",
            "Utiliser le service à des fins illicites ou frauduleuses",
            "Fournir des informations fausses sur votre véhicule ou votre identité",
            "Reproduire, copier ou revendre tout ou partie du service",
          ],
        },
        {
          title: "4. Disponibilité du service",
          intro:
            "Nous nous efforçons d'assurer la disponibilité de la plateforme 24h/24, 7j/7. Des interruptions pour maintenance peuvent survenir et seront communiquées dans la mesure du possible. Aucune garantie de disponibilité absolue ne peut être offerte.",
        },
        {
          title: "5. Propriété intellectuelle",
          intro:
            "L'ensemble des éléments d'Ads My Ride (interface, code, marque, contenus) sont la propriété exclusive d'Ads My Ride et sont protégés par le droit de la propriété intellectuelle. Toute reproduction sans autorisation écrite est interdite.",
        },
        {
          title: "6. Responsabilité",
          intro:
            "Ads My Ride agit en tant qu'intermédiaire entre conducteurs et annonceurs et ne saurait être tenu responsable des dommages directs ou indirects résultant d'une utilisation incorrecte du service, d'une erreur de saisie du véhicule éligible, d'un litige lié à l'installation du covering chez un partenaire tiers, ou d'une interruption de service indépendante de notre volonté.",
        },
        {
          title: "7. Résiliation",
          intro:
            "Vous pouvez cesser d'utiliser le service et supprimer votre compte à tout moment. Nous nous réservons le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU, sans préavis ni remboursement.",
        },
        {
          title: "8. Droit applicable",
          intro:
            "Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux compétents de France.",
        },
      ],
      privacySections: [
        {
          title: "1. Qui sommes-nous ?",
          intro:
            "Ads My Ride est une plateforme mettant en relation des conducteurs et des annonceurs pour l'affichage de publicités sur véhicules (ci-après « nous »). Dans le cadre de votre utilisation de notre application, nous sommes amenés à collecter et traiter des données à caractère personnel vous concernant.",
        },
        {
          title: "2. Données collectées",
          intro: "Nous collectons uniquement les données nécessaires au fonctionnement du service :",
          list: [
            "Adresse e-mail et mot de passe (chiffré)",
            "Nom, marque et modèle de votre véhicule (conducteurs)",
            "Nom d'entreprise et SIRET (annonceurs)",
            "Candidatures, annonces et paiements liés à votre compte",
            "Logs de connexion (date, heure, adresse IP) à des fins de sécurité",
          ],
        },
        {
          title: "3. Finalités du traitement",
          intro: "Vos données sont utilisées pour :",
          list: [
            "Vous fournir l'accès au service et assurer son bon fonctionnement",
            "Gérer votre compte, vos candidatures et vos campagnes publicitaires",
            "Verser vos gains et assurer le suivi des paiements",
            "Assurer la sécurité et la traçabilité des accès",
            "Améliorer la plateforme sur la base d'usages anonymisés",
          ],
        },
        {
          title: "4. Base légale",
          intro:
            "Le traitement de vos données repose sur l'exécution du contrat de service (CGU) que vous avez accepté lors de votre inscription, ainsi que sur notre intérêt légitime à sécuriser notre infrastructure.",
        },
        {
          title: "5. Conservation des données",
          intro:
            "Vos données sont conservées pendant toute la durée de votre compte actif, puis supprimées dans un délai de 90 jours suivant la suppression de votre compte, sauf obligation légale contraire (comptabilité, litiges).",
        },
        {
          title: "6. Partage des données",
          intro:
            "Nous ne vendons ni ne louons vos données à des tiers. Nous faisons appel à des sous-traitants techniques (hébergement, base de données, envoi d'e-mails) qui traitent vos données pour notre compte, dans le strict respect du RGPD.",
        },
        {
          title: "7. Sécurité",
          intro:
            "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou altération (mots de passe chiffrés, communications sécurisées, sessions signées, accès restreints).",
        },
        {
          title: "8. Vos droits",
          intro: "Conformément au RGPD, vous disposez des droits suivants :",
          list: [
            "Droit d'accès à vos données personnelles",
            "Droit de rectification en cas d'inexactitude",
            "Droit à l'effacement (« droit à l'oubli »)",
            "Droit à la portabilité de vos données",
            "Droit d'opposition au traitement",
          ],
          outro: "Pour exercer ces droits, contactez-nous à : contact@adsmyride.com",
        },
        {
          title: "9. Cookies",
          intro:
            "Ads My Ride utilise uniquement un cookie strictement nécessaire au fonctionnement de l'authentification (session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé. La langue choisie est mémorisée localement dans votre navigateur.",
        },
        {
          title: "10. Contact & réclamation",
          intro:
            "Pour toute question relative à cette politique, contactez-nous à contact@adsmyride.com. Vous avez également le droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).",
        },
      ],
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
    legal: {
      title: "Legal notice",
      lastUpdated: "Last updated: March 2026",
      part1: "PART 1",
      part2: "PART 2",
      cguTitle: "Terms of Service",
      privacyTitle: "Privacy Policy",
      cguSections: [
        {
          title: "1. Purpose",
          intro:
            "These Terms of Service govern access to and use of the Ads My Ride platform, which connects drivers and advertisers for the display of ads on vehicles. By creating an account, you accept these Terms without reservation.",
        },
        {
          title: "2. Access to the service",
          intro:
            "Ads My Ride is available to any adult creating a driver or advertiser account through the sign-up form. You are responsible for keeping your login credentials confidential.",
        },
        {
          title: "3. Use of the service",
          intro: "You agree to use Ads My Ride in a lawful and fair manner. It is forbidden to:",
          list: [
            "Attempt to access other users' accounts or data",
            "Use the service for unlawful or fraudulent purposes",
            "Provide false information about your vehicle or identity",
            "Reproduce, copy or resell all or part of the service",
          ],
        },
        {
          title: "4. Service availability",
          intro:
            "We strive to keep the platform available 24/7. Interruptions for maintenance may occur and will be communicated whenever possible. No guarantee of absolute availability can be given.",
        },
        {
          title: "5. Intellectual property",
          intro:
            "All elements of Ads My Ride (interface, code, brand, content) are the exclusive property of Ads My Ride and are protected by intellectual property law. Any reproduction without written authorization is prohibited.",
        },
        {
          title: "6. Liability",
          intro:
            "Ads My Ride acts as an intermediary between drivers and advertisers and cannot be held liable for direct or indirect damages resulting from incorrect use of the service, an error in the eligible vehicle information, a dispute related to the wrap installation at a third-party partner, or a service interruption beyond our control.",
        },
        {
          title: "7. Termination",
          intro:
            "You may stop using the service and delete your account at any time. We reserve the right to suspend or delete an account in case of breach of these Terms, without notice or refund.",
        },
        {
          title: "8. Governing law",
          intro:
            "These Terms are governed by French law. Any dispute will be subject to the exclusive jurisdiction of the competent courts of France.",
        },
      ],
      privacySections: [
        {
          title: "1. Who we are",
          intro:
            "Ads My Ride is a platform connecting drivers and advertisers for the display of ads on vehicles (hereinafter \"we\"). As part of your use of our application, we collect and process personal data about you.",
        },
        {
          title: "2. Data collected",
          intro: "We only collect the data necessary for the service to function:",
          list: [
            "Email address and password (encrypted)",
            "Name, make and model of your vehicle (drivers)",
            "Company name and registration number (advertisers)",
            "Applications, listings and payments linked to your account",
            "Connection logs (date, time, IP address) for security purposes",
          ],
        },
        {
          title: "3. Purpose of processing",
          intro: "Your data is used to:",
          list: [
            "Provide you access to the service and ensure it runs properly",
            "Manage your account, your applications and your ad campaigns",
            "Pay out your earnings and track payments",
            "Ensure the security and traceability of access",
            "Improve the platform based on anonymized usage",
          ],
        },
        {
          title: "4. Legal basis",
          intro:
            "The processing of your data is based on the performance of the service contract (Terms) you accepted when signing up, as well as our legitimate interest in securing our infrastructure.",
        },
        {
          title: "5. Data retention",
          intro:
            "Your data is kept for as long as your account remains active, then deleted within 90 days of your account being deleted, unless otherwise required by law (accounting, disputes).",
        },
        {
          title: "6. Data sharing",
          intro:
            "We do not sell or rent your data to third parties. We use technical subcontractors (hosting, database, email delivery) who process your data on our behalf, in strict compliance with the GDPR.",
        },
        {
          title: "7. Security",
          intro:
            "We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss or alteration (encrypted passwords, secure communications, signed sessions, restricted access).",
        },
        {
          title: "8. Your rights",
          intro: "In accordance with the GDPR, you have the following rights:",
          list: [
            "Right of access to your personal data",
            "Right of rectification in case of inaccuracy",
            "Right to erasure (\"right to be forgotten\")",
            "Right to data portability",
            "Right to object to processing",
          ],
          outro: "To exercise these rights, contact us at: contact@adsmyride.com",
        },
        {
          title: "9. Cookies",
          intro:
            "Ads My Ride only uses a cookie strictly necessary for authentication (session). No advertising or third-party tracking cookies are used. Your chosen language is remembered locally in your browser.",
        },
        {
          title: "10. Contact & complaints",
          intro:
            "For any question about this policy, contact us at contact@adsmyride.com. You also have the right to lodge a complaint with the CNIL (www.cnil.fr), the French data protection authority.",
        },
      ],
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
    legal: {
      title: "Aviso legal",
      lastUpdated: "Última actualización: marzo de 2026",
      part1: "PARTE 1",
      part2: "PARTE 2",
      cguTitle: "Condiciones Generales de Uso",
      privacyTitle: "Política de privacidad",
      cguSections: [
        {
          title: "1. Objeto",
          intro:
            "Las presentes Condiciones Generales de Uso (CGU) regulan el acceso y el uso de la plataforma Ads My Ride, que conecta a conductores y anunciantes para la exhibición de publicidad en vehículos. Al crear una cuenta, aceptas sin reservas estas CGU.",
        },
        {
          title: "2. Acceso al servicio",
          intro:
            "Ads My Ride está disponible para cualquier persona mayor de edad que cree una cuenta de conductor o anunciante a través del formulario de registro. Eres responsable de la confidencialidad de tus credenciales de acceso.",
        },
        {
          title: "3. Uso del servicio",
          intro: "Te comprometes a utilizar Ads My Ride de forma legal y leal. Está prohibido:",
          list: [
            "Intentar acceder a cuentas o datos de otros usuarios",
            "Utilizar el servicio con fines ilícitos o fraudulentos",
            "Proporcionar información falsa sobre tu vehículo o tu identidad",
            "Reproducir, copiar o revender total o parcialmente el servicio",
          ],
        },
        {
          title: "4. Disponibilidad del servicio",
          intro:
            "Nos esforzamos por garantizar la disponibilidad de la plataforma las 24 horas, los 7 días de la semana. Pueden producirse interrupciones por mantenimiento, que se comunicarán en la medida de lo posible. No se puede ofrecer ninguna garantía de disponibilidad absoluta.",
        },
        {
          title: "5. Propiedad intelectual",
          intro:
            "Todos los elementos de Ads My Ride (interfaz, código, marca, contenidos) son propiedad exclusiva de Ads My Ride y están protegidos por el derecho de propiedad intelectual. Queda prohibida toda reproducción sin autorización escrita.",
        },
        {
          title: "6. Responsabilidad",
          intro:
            "Ads My Ride actúa como intermediario entre conductores y anunciantes y no podrá ser considerado responsable de los daños directos o indirectos derivados de un uso incorrecto del servicio, un error en los datos del vehículo elegible, una disputa relacionada con la instalación del vinilo en un taller asociado, o una interrupción del servicio ajena a nuestra voluntad.",
        },
        {
          title: "7. Resolución",
          intro:
            "Puedes dejar de utilizar el servicio y eliminar tu cuenta en cualquier momento. Nos reservamos el derecho de suspender o eliminar una cuenta en caso de incumplimiento de estas CGU, sin previo aviso ni reembolso.",
        },
        {
          title: "8. Legislación aplicable",
          intro:
            "Las presentes CGU están sujetas a la legislación francesa. Cualquier disputa se someterá a la competencia exclusiva de los tribunales competentes de Francia.",
        },
      ],
      privacySections: [
        {
          title: "1. Quiénes somos",
          intro:
            "Ads My Ride es una plataforma que conecta a conductores y anunciantes para la exhibición de publicidad en vehículos (en adelante, «nosotros»). En el marco del uso de nuestra aplicación, recopilamos y tratamos datos de carácter personal que te conciernen.",
        },
        {
          title: "2. Datos recopilados",
          intro: "Solo recopilamos los datos necesarios para el funcionamiento del servicio:",
          list: [
            "Dirección de correo electrónico y contraseña (cifrada)",
            "Nombre, marca y modelo de tu vehículo (conductores)",
            "Nombre de la empresa y número de registro (anunciantes)",
            "Solicitudes, anuncios y pagos vinculados a tu cuenta",
            "Registros de conexión (fecha, hora, dirección IP) con fines de seguridad",
          ],
        },
        {
          title: "3. Finalidades del tratamiento",
          intro: "Tus datos se utilizan para:",
          list: [
            "Proporcionarte acceso al servicio y garantizar su correcto funcionamiento",
            "Gestionar tu cuenta, tus solicitudes y tus campañas publicitarias",
            "Abonar tus ingresos y realizar el seguimiento de los pagos",
            "Garantizar la seguridad y la trazabilidad de los accesos",
            "Mejorar la plataforma a partir de usos anonimizados",
          ],
        },
        {
          title: "4. Base legal",
          intro:
            "El tratamiento de tus datos se basa en la ejecución del contrato de servicio (CGU) que aceptaste al registrarte, así como en nuestro interés legítimo en proteger nuestra infraestructura.",
        },
        {
          title: "5. Conservación de los datos",
          intro:
            "Tus datos se conservan durante todo el tiempo que tu cuenta permanezca activa, y se eliminan en un plazo de 90 días tras la eliminación de tu cuenta, salvo obligación legal en contrario (contabilidad, litigios).",
        },
        {
          title: "6. Cesión de datos",
          intro:
            "No vendemos ni alquilamos tus datos a terceros. Recurrimos a subcontratistas técnicos (alojamiento, base de datos, envío de correos electrónicos) que tratan tus datos por cuenta nuestra, en estricto cumplimiento del RGPD.",
        },
        {
          title: "7. Seguridad",
          intro:
            "Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra cualquier acceso no autorizado, pérdida o alteración (contraseñas cifradas, comunicaciones seguras, sesiones firmadas, acceso restringido).",
        },
        {
          title: "8. Tus derechos",
          intro: "De conformidad con el RGPD, dispones de los siguientes derechos:",
          list: [
            "Derecho de acceso a tus datos personales",
            "Derecho de rectificación en caso de inexactitud",
            "Derecho de supresión («derecho al olvido»)",
            "Derecho a la portabilidad de tus datos",
            "Derecho de oposición al tratamiento",
          ],
          outro: "Para ejercer estos derechos, contáctanos en: contact@adsmyride.com",
        },
        {
          title: "9. Cookies",
          intro:
            "Ads My Ride solo utiliza una cookie estrictamente necesaria para el funcionamiento de la autenticación (sesión). No se utiliza ninguna cookie publicitaria ni de seguimiento de terceros. El idioma elegido se guarda localmente en tu navegador.",
        },
        {
          title: "10. Contacto y reclamaciones",
          intro:
            "Para cualquier pregunta relacionada con esta política, contáctanos en contact@adsmyride.com. También tienes derecho a presentar una reclamación ante la CNIL (www.cnil.fr), la autoridad francesa de protección de datos.",
        },
      ],
    },
  },
};
