import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
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

export function ServiceDetailPage() {
  const { content } = useCms();
  const { slug } = useParams();
  const visibleServices = content.services.filter((service) => !service.hidden);
  const normalizedSlug = typeof slug === "string" ? slug.trim() : "";

  const selectedService = useMemo(() => {
    if (!normalizedSlug) return undefined;
    return visibleServices.find(
      (service) => getServiceSlug(service) === normalizedSlug,
    );
  }, [normalizedSlug, visibleServices]);

  const seoTitle = selectedService
    ? `${selectedService.title} | Renora Tjanster`
    : "Tjanster | Renora";

  const seoDescription = selectedService
    ? selectedService.summary
    : "Utforska Renoras stadtjanster och se vad som ingar i varje alternativ.";

  const seoPath = normalizedSlug
    ? `/services/${encodeURIComponent(normalizedSlug)}`
    : "/services";

  if (!selectedService) {
    return (
      <div className="pt-20">
        <Seo title={seoTitle} description={seoDescription} path={seoPath} />
        <section className="py-20 bg-gradient-to-b from-[var(--background)] to-[var(--muted)]">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <SectionBadge>Tjanst saknas</SectionBadge>
              <h2 className="text-3xl md:text-4xl text-[var(--primary)] mb-3">
                Tjansten kunde inte hittas
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                Valj en tjanst i listan for att se detaljer.
              </p>
              <Button
                asChild
                className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
              >
                <Link to="/services">Tillbaka till tjanster</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const Icon = iconFromKey(selectedService.iconKey, Sparkles);

  return (
    <div className="pt-20">
      <Seo title={seoTitle} description={seoDescription} path={seoPath} />
      <section className="bg-gradient-to-b from-[var(--background)] to-[var(--muted)]">
        <div className="relative h-[320px] md:h-[420px]">
          <img
            src={selectedService.image}
            alt={selectedService.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--renora-primary-rgb)/0.9)] via-[rgb(var(--renora-primary-rgb)/0.4)] to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-12 h-12 bg-[rgb(var(--renora-accent-rgb))] rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[var(--icon-on-accent)]" />
                </div>
                <div className="bg-[var(--image-overlay-panel-bg)] backdrop-blur-sm rounded-lg px-4 py-3 border border-[var(--image-overlay-panel-border)]">
                  <h1 className="text-[var(--image-overlay-text)] text-2xl md:text-3xl">
                    {selectedService.title}
                  </h1>
                  <p className="text-[var(--image-overlay-muted-text)]">
                    {selectedService.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <SectionBadge>Tjanstinformation</SectionBadge>
            <h2 className="text-3xl md:text-4xl text-[var(--primary)] mb-4">
              Detaljer om tjansten
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8">
              Se bild, oversikt och vad som ingar i tjansten.
            </p>

            <div className="mb-8">
              <h3 className="text-[var(--primary)] text-xl mb-2">Oversikt</h3>
              <p className="text-[var(--muted-foreground)]">
                {selectedService.overview}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-[var(--primary)] text-lg mb-3">
                Det har ingar
              </h3>
              <ul className="space-y-2 text-[var(--muted-foreground)]">
                {selectedService.included.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--icon-accent)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
              >
                <Link to="/#contact">Begar offert</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[var(--outline-button-border)] text-[var(--outline-button-text)] hover:bg-[var(--outline-button-hover-bg)] hover:text-[var(--outline-button-hover-text)]"
              >
                <Link to="/services">Tillbaka till tjanster</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
