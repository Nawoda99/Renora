import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Seo } from "../components/Seo";
import { useCms } from "../content/ContentContext";
import { iconFromKey } from "../content/iconMap";
import { Sparkles } from "lucide-react";
import { SectionBadge } from "../components/SectionBadge";

const getServiceSlug = (service) => {
  if (typeof service?.slug === "string" && service.slug.trim()) {
    return service.slug.trim();
  }
  if (typeof service?.id === "string" && service.id.trim()) {
    return service.id.trim();
  }
  if (typeof service?.title === "string" && service.title.trim()) {
    return service.title.trim();
  }
  return "";
};

export function ServicesPage() {
  const { content } = useCms();
  const visibleServices = content.services.filter((service) => !service.hidden);

  const seoTitle = "Tjänster | Renora";
  const seoDescription =
    "Utforska Renoras städtjänster och se vad som ingår i varje alternativ.";
  const seoPath = "/services";

  return (
    <div className="pt-20">
      <Seo title={seoTitle} description={seoDescription} path={seoPath} />
      <section className="py-20 bg-gradient-to-b from-[var(--background)] to-[var(--muted)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionBadge>Våra tjänster</SectionBadge>

            <h2 className="text-4xl md:text-5xl text-[var(--primary)] mb-4">
              Städtjänster som passar ditt utrymme
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Välj en tjänst för att se bild, översikt och vad som ingår.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleServices.map((service) => {
              const Icon = iconFromKey(service.iconKey, Sparkles);
              const serviceSlug = getServiceSlug(service);
              const servicePath = `/services/${encodeURIComponent(serviceSlug)}`;
              const serviceKey = serviceSlug || service.id || service.title;

              return (
                <Card
                  key={serviceKey}
                  className="group overflow-hidden border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-all duration-300 hover:shadow-xl"
                >
                  <Link to={servicePath} className="block">
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
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
