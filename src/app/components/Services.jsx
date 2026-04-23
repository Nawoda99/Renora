import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useCms } from "../content/ContentContext";
import { iconFromKey } from "../content/iconMap";
import { SectionBadge } from "./SectionBadge";
import { Sparkles } from "lucide-react";

export function Services() {
  const { content } = useCms();
  const visibleServices = content.services.filter((s) => !s.hidden);
  const headings = content.settings.sections.services;

  const orderedByHome = [...visibleServices]
    .filter(
      (s) =>
        typeof s.homeOrder === "number" && s.homeOrder >= 1 && s.homeOrder <= 3,
    )
    .sort((a, b) => (a.homeOrder ?? 999) - (b.homeOrder ?? 999))
    .slice(0, 3);

  const legacyFeatured = visibleServices
    .filter(
      (s) => Boolean(s.showOnHome) && !orderedByHome.some((o) => o.id === s.id),
    )
    .slice(0, Math.max(0, 3 - orderedByHome.length));

  const servicesToShow =
    orderedByHome.length > 0
      ? [...orderedByHome, ...legacyFeatured]
      : visibleServices.slice(0, 3);

  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-b from-[var(--background)] to-[var(--muted)]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <SectionBadge>{headings.badge}</SectionBadge>
          <h2 className="text-4xl md:text-5xl text-[var(--primary)] mb-4">
            {headings.title}
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {headings.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesToShow.map((service) => {
            const Icon = iconFromKey(service.iconKey, Sparkles);
            return (
              <Card
                key={service.slug}
                className="group overflow-hidden border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--renora-primary-rgb)/0.8)] to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-[rgb(var(--renora-accent-rgb))] rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[var(--icon-on-accent)]" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-[var(--primary)] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    {service.summary}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
          >
            <Link to="/services">More Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
