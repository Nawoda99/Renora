import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useIsMobile } from "../components/ui/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import { Seo } from "../components/Seo";
import { useCms } from "../content/ContentContext";
import { iconFromKey } from "../content/iconMap";
import { Sparkles } from "lucide-react";
import { SectionBadge } from "../components/SectionBadge";

export function ServicesPage() {
  const { content } = useCms();
  const params = useParams();
  const selectedSlug = params.slug;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const mobileScrollRef = useRef(null);

  const visibleServices = content.services.filter((service) => !service.hidden);

  const selectedService = useMemo(() => {
    if (!selectedSlug) return undefined;
    return visibleServices.find((service) => service.slug === selectedSlug);
  }, [selectedSlug, visibleServices]);

  const isDialogOpen = Boolean(selectedSlug);

  const closeDetails = () => navigate("/services");

  useEffect(() => {
    if (!isMobile) return;
    const scroller = mobileScrollRef.current;
    if (scroller) scroller.scrollTop = 0;
  }, [isMobile, selectedSlug]);

  const seoTitle = selectedService
    ? `${selectedService.title} | Renora Tjänster`
    : "Tjänster | Renora";

  const seoDescription = selectedService
    ? selectedService.summary
    : "Utforska Renoras städtjänster och se vad som ingår i varje alternativ.";

  const seoPath = selectedSlug ? `/services/${selectedSlug}` : "/services";

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
              Välj en tjänst för att se vad som ingår och vem den passar bäst för.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleServices.map((service) => {
              const isSelected = service.slug === selectedSlug;
              const Icon = iconFromKey(service.iconKey, Sparkles);

              return (
                <Card
                  key={service.slug}
                  className={
                    "group overflow-hidden border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-all duration-300 hover:shadow-xl " +
                    (isSelected ? "border-[var(--card-border-hover)]" : "")
                  }
                >
                  <Link to={`/services/${service.slug}`} className="block">
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

          {isMobile ? (
            <Drawer
              open={isDialogOpen}
              onOpenChange={(open) => !open && closeDetails()}
            >
              <DrawerContent className="border-[var(--card-border)] h-[85dvh]">
                {!selectedService ? (
                  <div className="flex flex-col h-full min-h-0">
                    <div className="p-4">
                      <DrawerHeader className="p-0">
                        <DrawerTitle className="text-[var(--primary)]">
                          Tjänsten kunde inte hittas
                        </DrawerTitle>
                        <DrawerDescription className="text-[var(--muted-foreground)]">
                          Välj en tjänst i listan.
                        </DrawerDescription>
                      </DrawerHeader>
                    </div>
                    <DrawerFooter>
                      <Button
                        onClick={closeDetails}
                        className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
                      >
                        Tillbaka till tjänster
                      </Button>
                    </DrawerFooter>
                  </div>
                ) : (
                  <div className="flex flex-col h-full min-h-0">
                    <DrawerHeader className="border-b border-[var(--card-border)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[rgb(var(--renora-accent-rgb))] rounded-lg flex items-center justify-center shrink-0">
                          {(() => {
                            const Icon = iconFromKey(
                              selectedService.iconKey,
                              Sparkles,
                            );
                            return (
                              <Icon className="w-5 h-5 text-[var(--icon-on-accent)]" />
                            );
                          })()}
                        </div>
                        <DrawerTitle className="text-[var(--primary)] text-lg leading-tight break-words">
                          {selectedService.title}
                        </DrawerTitle>
                      </div>
                    </DrawerHeader>

                    <div
                      ref={mobileScrollRef}
                      className="p-4 overflow-y-auto flex-1 min-h-0"
                    >
                      <div>
                        <h4 className="text-[var(--primary)] text-lg mb-2">
                          Översikt
                        </h4>
                        <p className="text-[var(--muted-foreground)]">
                          {selectedService.overview}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-[var(--primary)] text-base mb-2">
                          Det här ingår
                        </h4>
                        <ul className="space-y-2 text-[var(--muted-foreground)]">
                          {selectedService.included.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-[var(--icon-accent)]">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-[var(--primary)] text-base mb-2">
                          Passar för
                        </h4>
                        <ul className="space-y-2 text-[var(--muted-foreground)]">
                          {selectedService.idealFor.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-[var(--icon-accent)]">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <DrawerFooter>
                      <Button
                        asChild
                        className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
                      >
                        <Link to="/#contact">Begär offert</Link>
                      </Button>
                      <Button
                        onClick={closeDetails}
                        variant="outline"
                        className="border-[var(--outline-button-border)] text-[var(--outline-button-text)] hover:bg-[var(--outline-button-hover-bg)] hover:text-[var(--outline-button-hover-text)]"
                      >
                        Tillbaka till tjänster
                      </Button>
                    </DrawerFooter>
                  </div>
                )}
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => !open && closeDetails()}
            >
              <DialogContent className="sm:max-w-7xl p-0 overflow-hidden border-[var(--card-border)]">
                {!selectedService ? (
                  <div className="p-6">
                    <DialogHeader>
                      <DialogTitle className="text-[var(--primary)]">
                        Tjänsten kunde inte hittas
                      </DialogTitle>
                      <DialogDescription className="text-[var(--muted-foreground)]">
                        Välj en tjänst i listan.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={closeDetails}
                        className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
                      >
                        Tillbaka till tjänster
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative min-h-[320px]">
                      <img
                        src={selectedService.image}
                        alt={selectedService.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--renora-primary-rgb)/0.9)] via-[rgb(var(--renora-primary-rgb)/0.4)] to-transparent" />
                      <div className="absolute bottom-6 left-6 flex items-center gap-3 pr-6">
                        <div className="w-12 h-12 bg-[rgb(var(--renora-accent-rgb))] rounded-lg flex items-center justify-center">
                          {(() => {
                            const Icon = iconFromKey(
                              selectedService.iconKey,
                              Sparkles,
                            );
                            return (
                              <Icon className="w-6 h-6 text-[var(--icon-on-accent)]" />
                            );
                          })()}
                        </div>
                        <div className="bg-[var(--image-overlay-panel-bg)] backdrop-blur-sm rounded-lg px-4 py-3 border border-[var(--image-overlay-panel-border)]">
                          <h3 className="text-[var(--image-overlay-text)] text-2xl">
                            {selectedService.title}
                          </h3>
                          <p className="text-[var(--image-overlay-muted-text)]">
                            {selectedService.summary}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 lg:p-10 bg-[var(--surface-elevated)] overflow-y-auto max-h-[85vh]">
                      <DialogHeader>
                        <DialogTitle className="text-[var(--primary)]">
                          Tjänstinformation
                        </DialogTitle>
                        <DialogDescription className="text-[var(--muted-foreground)]">
                          Se vad som ingår och vem tjänsten passar bäst för.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-6">
                        <h4 className="text-[var(--primary)] text-xl mb-2">
                          Översikt
                        </h4>
                        <p className="text-[var(--muted-foreground)]">
                          {selectedService.overview}
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[var(--primary)] text-lg mb-3">
                            Det här ingår
                          </h4>
                          <ul className="space-y-2 text-[var(--muted-foreground)]">
                            {selectedService.included.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="text-[var(--icon-accent)]">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-[var(--primary)] text-lg mb-3">
                            Passar för
                          </h4>
                          <ul className="space-y-2 text-[var(--muted-foreground)]">
                            {selectedService.idealFor.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="text-[var(--icon-accent)]">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Button
                          asChild
                          className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
                        >
                          <Link to="/#contact">Begär offert</Link>
                        </Button>
                        <Button
                          onClick={closeDetails}
                          variant="outline"
                          className="border-[var(--outline-button-border)] text-[var(--outline-button-text)] hover:bg-[var(--outline-button-hover-bg)] hover:text-[var(--outline-button-hover-text)]"
                        >
                          Tillbaka till tjänster
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </section>
    </div>
  );
}
