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
      badge: "Limited Time Offer",
      title: "Get 20% Off Your First Deep Clean",
      description:
        "Book this week and enjoy a premium deep clean at a special rate.",
      ctaLabel: "Claim Offer",
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
      role: "Homeowner",
      content:
        "Renora has been cleaning my home for over two years now. Their attention to detail is incredible, and I always come home to a sparkling clean house. Highly recommend!",
      rating: 5,
      hidden: false,
    },
    {
      id: "michael",
      name: "Michael Chen",
      role: "Business Owner",
      content:
        "We've been using Renora for our office cleaning, and the difference is remarkable. Professional, reliable, and always on time. Our workspace has never looked better.",
      rating: 5,
      hidden: false,
    },
    {
      id: "emily",
      name: "Emily Rodriguez",
      role: "Property Manager",
      content:
        "Managing multiple properties, I need a cleaning service I can trust. Renora delivers consistently excellent results across all our locations. True professionals!",
      rating: 5,
      hidden: false,
    },
  ],
  settings: {
    hero: {
      badge: "Premium Cleaning Services",
      headline: "Spotless Spaces,",
      highlight: "Every Time",
      subheadline:
        "Experience the gold standard in professional cleaning. Renora delivers exceptional results for your home and business.",
      backgroundImage:
        "https://images.unsplash.com/photo-1771491237225-01931a752f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNjk1ODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      stats: [
        { value: "500+", label: "Happy Clients" },
        { value: "10+", label: "Years Experience" },
        { value: "100%", label: "Satisfaction" },
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
        badge: "Our Services",
        title: "Professional Cleaning Solutions",
        subtitle:
          "We offer a comprehensive range of cleaning services to meet all your needs",
      },
      beforeAfter: {
        hidden: false,
        badge: "Dirty to Dazzling",
        title: "See the Before & After",
        subtitle: "Drag the slider to compare results.",
      },
      testimonials: {
        hidden: false,
        badge: "Testimonials",
        title: "What Our Clients Say",
        subtitle:
          "Don't just take our word for it - hear from our satisfied clients",
      },
      contact: {
        badge: "Get In Touch",
        title: "Request Your Free Quote",
        subtitle:
          "Ready to experience the Renora difference? Contact us today for a free, no-obligation quote",
      },
    },
    beforeAfter: {
      beforeImage:
        "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80",
      afterImage:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
      beforeAlt: "Before cleaning",
      afterAlt: "After cleaning",
      beforeLabel: "Before",
      afterLabel: "After",
    },
    about: {
      hidden: false,
      badge: "About Renora",
      title: "Your Trusted Cleaning Partner",
      paragraphs: [
        "With over a decade of experience, Renora has been setting the gold standard in cleaning services. Our commitment to excellence and attention to detail has made us the preferred choice for hundreds of satisfied clients.",
        "We use eco-friendly products and the latest cleaning techniques to ensure your space is not only clean but also safe for your family, employees, and the environment.",
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
          title: "Insured & Bonded",
          description: "Fully insured for your peace of mind and protection",
        },
        {
          iconKey: "Award",
          title: "Certified Professionals",
          description: "Trained and certified cleaning experts",
        },
        {
          iconKey: "Users",
          title: "Trusted Team",
          description: "Background-checked, reliable staff",
        },
        {
          iconKey: "Clock",
          title: "Flexible Scheduling",
          description: "Available when you need us most",
        },
      ],
    },
    contact: {
      phone: "(555) 123-4567",
      phoneTel: "tel:5551234567",
      email: "info@renora-cleaning.com",
      emailMailto: "mailto:info@renora-cleaning.com",
      address: "123 Clean Street, Suite 100, Your City, ST 12345",
      hours: "Mon-Sat: 8AM - 6PM",
      whyChooseTitle: "Why Choose Renora?",
      whyChooseBullets: [
        "Same-day service available",
        "Eco-friendly cleaning products",
        "100% satisfaction guarantee",
        "Customized cleaning plans",
      ],
    },
  },
};
