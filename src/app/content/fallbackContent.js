import { services } from "../data/services";

function guessIconKeyFromSlug(slug) {
  switch (slug) {
    case "residential-cleaning":
      return "Home";
    case "commercial-cleaning":
      return "Building2";
    case "deep-cleaning":
      return "Sparkles";
    case "window-cleaning":
      return "Square";
    case "carpet-upholstery":
      return "Armchair";
    case "disinfection-services":
      return "Droplets";
    case "move-in-move-out":
      return "Truck";
    case "post-construction-cleaning":
      return "Hammer";
    default:
      return "Sparkles";
  }
}

export const fallbackContent = {
  services: services.map((service, index) => ({
    id: service.slug,
    slug: service.slug,
    iconKey: guessIconKeyFromSlug(service.slug),
    title: service.title,
    summary: service.summary,
    image: service.image,
    overview: service.overview,
    included: service.included,
    idealFor: service.idealFor,
    showOnHome: index < 3,
    homeOrder: index < 3 ? index + 1 : undefined,
    hidden: false,
  })),
  banners: [
    {
      id: "default",
      badge: "Tidsbegränsat erbjudande",
      title: "Få 20 % rabatt på din första storstädning",
      description:
        "Boka den här veckan och få en noggrann storstädning till ett extra bra pris.",
      ctaLabel: "Ta del av erbjudandet",
      ctaHref: "/#contact",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
      active: true,
    },
  ],
  testimonials: [
    {
      id: "sarah",
      name: "Sarah Johnson",
      role: "Villaägare",
      content:
        "Renora har städat mitt hem i över två år nu. Deras känsla för detaljer är fantastisk, och jag kommer alltid hem till ett skinande rent hus. Rekommenderas varmt!",
      rating: 5,
      hidden: false,
    },
    {
      id: "michael",
      name: "Michael Chen",
      role: "Företagare",
      content:
        "Vi har anlitat Renora för kontorsstädning och skillnaden är tydlig. Professionella, pålitliga och alltid punktliga. Vår arbetsplats har aldrig sett bättre ut.",
      rating: 5,
      hidden: false,
    },
    {
      id: "emily",
      name: "Emily Rodriguez",
      role: "Fastighetsförvaltare",
      content:
        "När man ansvarar för flera fastigheter behöver man en städfirma man kan lita på. Renora levererar jämnt hög kvalitet på alla våra adresser. Verkliga proffs!",
      rating: 5,
      hidden: false,
    },
  ],
  settings: {
    hero: {
      badge: "Professionella städtjänster",
      headline: "Skinande rena miljöer,",
      highlight: "varje gång",
      subheadline:
        "Upplev professionell städning på hög nivå. Renora levererar förstklassiga resultat för både hem och företag.",
      backgroundImage:
        "https://images.unsplash.com/photo-1771491237225-01931a752f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNjk1ODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      stats: [
        { value: "500+", label: "Nöjda kunder" },
        { value: "10+", label: "Års erfarenhet" },
        { value: "100%", label: "Nöjdhet" },
      ],
    },
    theme: {
      presetVersion: "2026-04-cleaning-green",
      accent: "#22C55E",
      accentHover: "#16A34A",
      background: "#F4FBF6",
      foreground: "#1A2E22",
      primary: "#163127",
      primaryForeground: "#F7FFF9",
      muted: "#DFF2E3",
      mutedForeground: "#5B7064",
      card: "#FFFFFF",
      cardForeground: "#1A2E22",
      cardBorder: "rgba(22, 49, 39, 0.1)",
      cardBorderHover: "#22C55E",
      iconPrimary: "#163127",
      iconOnAccent: "#F7FFF9",
      iconAccent: "#22C55E",
      iconAccentSoft: "rgba(34, 197, 94, 0.16)",
      formLabelText: "#163127",
      formInputBorder: "rgba(22, 49, 39, 0.14)",
      formInputFocusBorder: "#22C55E",
      inputBackground: "#FBFFFC",
      navLinkText: "#163127",
      navLinkHover: "#22C55E",
      navButtonBg: "#163127",
      navButtonHoverBg: "#204234",
      navButtonText: "#F7FFF9",
      badgeText: "#22C55E",
      badgeBg: "rgba(34, 197, 94, 0.12)",
      formInputText: "#1A2E22",
      buttonDefaultBg: "#22C55E",
      buttonDefaultHoverBg: "#16A34A",
      buttonDefaultText: "#F7FFF9",
      buttonSecondaryBg: "#DFF2E3",
      buttonSecondaryHoverBg: "#CFE9D5",
      buttonSecondaryText: "#163127",
      buttonDestructiveBg: "#dc2626",
      buttonDestructiveHoverBg: "#b91c1c",
      buttonDestructiveText: "#ffffff",
      buttonOutlineBorder: "rgba(22, 49, 39, 0.2)",
      buttonOutlineHoverBorder: "#22C55E",
      buttonOutlineText: "#163127",
      buttonOutlineHoverBg: "rgba(34, 197, 94, 0.08)",
      buttonOutlineHoverText: "#1A2E22",
      buttonGhostText: "#163127",
      buttonGhostHoverBg: "rgba(34, 197, 94, 0.08)",
      ctaButtonBg: "#22C55E",
      ctaButtonHoverBg: "#16A34A",
      ctaButtonText: "#F7FFF9",
      outlineButtonBorder: "rgba(22, 49, 39, 0.2)",
      outlineButtonText: "#163127",
      outlineButtonHoverBg: "rgba(34, 197, 94, 0.08)",
      outlineButtonHoverText: "#1A2E22",
      heroOverlay: "rgba(10, 28, 20, 0.58)",
      promoOverlay: "rgba(22, 49, 39, 0.72)",
      imageOverlayText: "#F7FFF9",
      imageOverlayMutedText: "#D6F3DE",
      imageOverlayPanelBg: "rgba(10, 28, 20, 0.42)",
      imageOverlayPanelBorder: "rgba(247, 255, 249, 0.18)",
      promoShine: "rgba(255, 255, 255, 0.2)",
      surfaceBase: "#F4FBF6",
      surfaceElevated: "#FFFFFF",
      surfaceElevatedSoft: "rgba(255, 255, 255, 0.8)",
      surfaceElevatedHover: "#F6FCF7",
      footerBackground: "#0F241B",
      footerMutedText: "#B6D4BF",
      footerHeading: "#86EFAC",
      footerLinkHover: "#BBF7D0",
      footerSocialBg: "rgba(134, 239, 172, 0.14)",
      footerSocialHoverBg: "#86EFAC",
      footerSocialIcon: "#ECFDF3",
      footerSocialIconHover: "#0F241B",
      beforeAfterHandleBorder: "#F7FFF9",
      beforeAfterHandleIcon: "#163127",
      beforeAfterLabelBg: "rgba(10, 28, 20, 0.72)",
      beforeAfterLabelText: "#F7FFF9",
    },
    sections: {
      services: {
        badge: "Våra tjänster",
        title: "Professionella städlösningar",
        subtitle:
          "Vi erbjuder ett komplett utbud av städtjänster för alla dina behov",
      },
      beforeAfter: {
        hidden: false,
        badge: "Från smutsigt till skinande",
        title: "Se före och efter",
        subtitle: "Dra reglaget för att jämföra resultatet.",
      },
      testimonials: {
        hidden: false,
        badge: "Omdömen",
        title: "Det här säger våra kunder",
        subtitle: "Lita inte bara på oss, hör vad våra nöjda kunder tycker",
      },
      contact: {
        badge: "Kontakta oss",
        title: "Begär din kostnadsfria offert",
        subtitle:
          "Redo att uppleva Renora-skillnaden? Kontakta oss idag för en kostnadsfri offert utan förpliktelser",
      },
    },
    beforeAfter: {
      beforeImage:
        "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80",
      afterImage:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
      beforeAlt: "Före städning",
      afterAlt: "Efter städning",
      beforeLabel: "Före",
      afterLabel: "Efter",
    },
    about: {
      hidden: false,
      badge: "Om Renora",
      title: "Din pålitliga städpartner",
      paragraphs: [
        "Med över tio års erfarenhet har Renora byggt upp ett starkt rykte inom professionell städning. Vårt fokus på kvalitet och detaljer har gjort oss till det självklara valet för hundratals nöjda kunder.",
        "Vi använder miljövänliga produkter och moderna städmetoder för att göra din miljö inte bara ren, utan också trygg för familj, personal och omgivning.",
      ],
      images: [
        "https://images.unsplash.com/photo-1758273238415-01ec03d9ef27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGhvdXNlJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcyNzE0NDkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1762235634143-6d350fe349e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjb21tZXJjaWFsJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcyNjgyOTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1763705857707-48bbfb24bbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3MjY4Mjk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1761689502577-0013be84f1bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjBjbGVhbmluZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI2Nzk5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      ],
      features: [
        {
          iconKey: "Shield",
          title: "Försäkrade och trygga",
          description: "Fullt försäkrade för din trygghet och säkerhet",
        },
        {
          iconKey: "Award",
          title: "Certifierade proffs",
          description: "Utbildade och certifierade städexperter",
        },
        {
          iconKey: "Users",
          title: "Pålitligt team",
          description: "Noggrant kontrollerad och tillförlitlig personal",
        },
        {
          iconKey: "Clock",
          title: "Flexibla tider",
          description: "Tillgängliga när du behöver oss som mest",
        },
      ],
    },
    contact: {
      phone: "0737039373",
      phoneTel: "tel:0737039373",
      email: "support@renora.se",
      emailMailto: "mailto:support@renora.se",
      address: "Exempelgatan 123, Svit 100, Din stad",
      hours: "Mån-Lör: 08:00 - 18:00",
      whyChooseTitle: "Varför välja Renora?",
      whyChooseBullets: [
        "Service samma dag finns tillgänglig",
        "Miljövänliga rengöringsprodukter",
        "100 % nöjdhetsgaranti",
        "Skräddarsydda städplaner",
      ],
    },
  },
};
