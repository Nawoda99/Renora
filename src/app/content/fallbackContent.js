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
      accent: "#D4AF37",
      accentHover: "#C9A961",
      background: "#ffffff",
      foreground: "#2C1810",
      primary: "#3E2723",
      primaryForeground: "#ffffff",
      muted: "#F5F5DC",
      mutedForeground: "#6D4C41",
      card: "#ffffff",
      cardForeground: "#2C1810",
      inputBackground: "#FFF8E7",
      navLinkText: "#3E2723",
      navLinkHover: "#D4AF37",
      navButtonBg: "#D4AF37",
      navButtonHoverBg: "#C9A961",
      navButtonText: "#3E2723",
      badgeText: "#D4AF37",
      badgeBg: "rgba(212, 175, 55, 0.13)",
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
