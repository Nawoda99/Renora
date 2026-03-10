import {
  Armchair,
  Building2,
  Droplets,
  Hammer,
  Home,
  SparklesIcon,
  Square,
  Truck,
} from "lucide-react";

/** @type {Array<import('./types').CmsService & { icon: any }>} */
export const services = [
  {
    slug: "residential-cleaning",
    icon: Home,
    title: "Residential Cleaning",
    summary:
      "Comprehensive home cleaning services tailored to your needs. From regular maintenance to deep cleaning.",
    image:
      "https://images.unsplash.com/photo-1758273238415-01ec03d9ef27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGhvdXNlJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcyNzE0NDkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Keep your home consistently fresh, tidy, and comfortable. We focus on the details that make a space feel truly clean — from high-touch areas to the corners that are easy to miss.",
    included: [
      "Dusting and wipe-down of surfaces and high-touch points",
      "Kitchen cleaning (counters, exterior appliances, sink, stovetop)",
      "Bathroom cleaning (toilets, showers/tubs, sinks, mirrors)",
      "Vacuuming and mopping floors",
      "Trash removal and light tidying",
    ],
    idealFor: [
      "Weekly, bi-weekly, or monthly cleaning schedules",
      "Busy households needing reliable upkeep",
      "Apartment and single-family homes",
    ],
  },
  {
    slug: "commercial-cleaning",
    icon: Building2,
    title: "Commercial Cleaning",
    summary:
      "Professional office and commercial space cleaning. Maintain a pristine work environment for your team.",
    image:
      "https://images.unsplash.com/photo-1762235634143-6d350fe349e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjb21tZXJjaWFsJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzcyNjgyOTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "A clean workplace supports productivity, professionalism, and healthier teams. We tailor checklists around your space, traffic levels, and operating hours.",
    included: [
      "Common area, lobby, and office cleaning",
      "Restroom sanitization and restocking (by request)",
      "Breakroom/kitchenette cleaning",
      "Trash and recycling removal",
      "Floors: vacuuming, mopping, spot cleaning",
    ],
    idealFor: [
      "Offices, studios, retail spaces, and clinics",
      "After-hours or low-disruption cleaning",
      "Ongoing maintenance plans",
    ],
  },
  {
    slug: "deep-cleaning",
    icon: SparklesIcon,
    title: "Deep Cleaning",
    summary:
      "Intensive cleaning that reaches every corner. Perfect for seasonal refreshes or move-in/move-out.",
    image:
      "https://images.unsplash.com/photo-1763705857707-48bbfb24bbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc3MjY4Mjk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "When your space needs a reset, deep cleaning targets built-up grime and overlooked areas. It's a great starting point before moving into a regular maintenance schedule.",
    included: [
      "Detailed bathroom and kitchen scrubbing",
      "Baseboards, door frames, and light switch wipe-down",
      "Interior spot-cleaning of cabinets (where applicable)",
      "Extra attention to corners, edges, and hard-to-reach areas",
      "Floor detailing (edges and under light furniture when accessible)",
    ],
    idealFor: [
      "Seasonal refresh or spring cleaning",
      "Move-in or move-out cleaning",
      "Before hosting events or guests",
    ],
  },
  {
    slug: "window-cleaning",
    icon: Square,
    title: "Window Cleaning",
    summary:
      "Crystal-clear windows inside and out. We make your windows shine and let the light in.",
    image:
      "https://images.unsplash.com/photo-1761689502577-0013be84f1bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjBjbGVhbmluZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI2Nzk5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Brighten your space with streak-free, professional window cleaning. We focus on clarity, detailing, and leaving frames and sills looking refreshed.",
    included: [
      "Interior glass cleaning",
      "Exterior glass cleaning (accessible areas)",
      "Frame and sill wipe-down",
      "Screen dusting (where applicable)",
    ],
    idealFor: [
      "Homes and storefronts",
      "Seasonal cleaning or before events",
      "Improving natural light and curb appeal",
    ],
  },
  {
    slug: "carpet-upholstery",
    icon: Armchair,
    title: "Carpet & Upholstery",
    summary:
      "Professional carpet and furniture cleaning. Remove stains, dirt, and allergens effectively.",
    image:
      "https://images.unsplash.com/photo-1762501748150-7fd88647fc2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZXQlMjBjbGVhbmluZyUyMHZhY3V1bXxlbnwxfHx8fDE3NzI3MDE2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Extend the life of your carpets and furniture with a thorough clean that lifts embedded dirt and freshens fabrics. We tailor the approach to the material and condition.",
    included: [
      "Pre-vacuum and surface preparation",
      "Targeted spot treatment for common stains (as appropriate)",
      "Deep cleaning for carpets, rugs, and upholstery",
      "Deodorizing options (by request)",
    ],
    idealFor: [
      "High-traffic rooms and family spaces",
      "Pet owners and allergy-conscious households",
      "Refreshing couches, chairs, and area rugs",
    ],
  },
  {
    slug: "disinfection-services",
    icon: Droplets,
    title: "Disinfection Services",
    summary:
      "Advanced sanitization and disinfection. Keep your space safe and hygienic.",
    image:
      "https://images.unsplash.com/photo-1771491237225-01931a752f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNjk1ODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overview:
      "Disinfection focuses on sanitizing high-touch points and shared areas to help reduce the spread of germs. Ideal as a recurring add-on or for specific situations.",
    included: [
      "Disinfection of high-touch surfaces (handles, switches, counters)",
      "Targeted restroom and kitchen sanitization",
      "Focus on shared spaces and frequently used areas",
      "Custom checklist for your space",
    ],
    idealFor: [
      "Offices and shared workspaces",
      "Households during cold/flu season",
      "Post-event cleanup and reset",
    ],
  },
  {
    slug: "move-in-move-out",
    icon: Truck,
    title: "Move-In / Move-Out",
    summary:
      "A detailed reset for empty homes and apartments. Perfect for tenants, landlords, and realtors.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Moving is stressful — cleaning shouldn't be. We focus on inside surfaces, fixtures, and touchpoints to leave the place fresh for the next chapter.",
    included: [
      "Full kitchen and bathroom cleaning",
      "Inside cabinets and drawers (empty only)",
      "Baseboards, doors, and trim wipe-down",
      "Floors vacuumed and mopped",
      "Trash removal and final walkthrough touch-ups",
    ],
    idealFor: [
      "Lease move-out requirements",
      "Move-in sanitation before unpacking",
      "Homes being listed or staged",
    ],
  },
  {
    slug: "post-construction-cleaning",
    icon: Hammer,
    title: "Post-Construction Cleaning",
    summary:
      "Remove dust and debris after renovations. We make your new space ready to enjoy.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Renovations leave behind fine dust that settles everywhere. We detail surfaces and floors so your space looks finished — not like a job site.",
    included: [
      "Dust removal from surfaces, ledges, and fixtures",
      "Vacuuming and mopping floors (with edge detailing)",
      "Wipe-down of doors, frames, and reachable vents",
      "Spot cleaning for paint splatter residue (where safe)",
      "Final polish of high-visibility areas",
    ],
    idealFor: [
      "After remodeling kitchens/bathrooms",
      "New construction move-in preparation",
      "Commercial fit-outs and office renovations",
    ],
  },
];
