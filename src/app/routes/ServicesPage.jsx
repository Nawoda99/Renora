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
    ? `${selectedService.title} | Renora Services`
    : "Services | Renora";

  const seoDescription = selectedService
    ? selectedService.summary
    : "Browse Renora cleaning services and view what's included for each option.";

  const seoPath = selectedSlug ? `/services/${selectedSlug}` : "/services";

  return (
    <div className="pt-20">
      <Seo title={seoTitle} description={seoDescription} path={seoPath} />
      <section className="py-20 bg-gradient-to-b from-white to-[#FFF8E7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionBadge>Our Services</SectionBadge>

            <h2 className="text-4xl md:text-5xl text-[#3E2723] mb-4">
              Cleaning Services That Fit Your Space
            </h2>
            <p className="text-lg text-[#6D4C41] max-w-2xl mx-auto">
              Choose a service to view what's included and who it's best for.
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
                    "group overflow-hidden border-[rgb(var(--cios-accent-rgb)/0.2)] hover:border-[rgb(var(--cios-accent-rgb))] transition-all duration-300 hover:shadow-xl " +
                    (isSelected ? "border-[rgb(var(--cios-accent-rgb))]" : "")
                  }
                >
                  <Link to={`/services/${service.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 bg-[rgb(var(--cios-accent-rgb))] rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#3E2723]" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-[#3E2723] mb-2">{service.title}</h3>
                      <p className="text-[#6D4C41]">{service.summary}</p>
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
              <DrawerContent className="border-[rgb(var(--cios-accent-rgb)/0.2)] h-[85dvh]">
                {!selectedService ? (
                  <div className="flex flex-col h-full min-h-0">
                    <div className="p-4">
                      <DrawerHeader className="p-0">
                        <DrawerTitle className="text-[#3E2723]">
                          Service not found
                        </DrawerTitle>
                        <DrawerDescription className="text-[#6D4C41]">
                          Please choose a service from the list.
                        </DrawerDescription>
                      </DrawerHeader>
                    </div>
                    <DrawerFooter>
                      <Button
                        onClick={closeDetails}
                        className="bg-[rgb(var(--cios-accent-rgb))] hover:bg-[rgb(var(--cios-accent-hover-rgb))] text-[#3E2723]"
                      >
                        Back to Services
                      </Button>
                    </DrawerFooter>
                  </div>
                ) : (
                  <div className="flex flex-col h-full min-h-0">
                    <DrawerHeader className="border-b border-[rgb(var(--cios-accent-rgb)/0.2)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[rgb(var(--cios-accent-rgb))] rounded-lg flex items-center justify-center shrink-0">
                          {(() => {
                            const Icon = iconFromKey(
                              selectedService.iconKey,
                              Sparkles,
                            );
                            return <Icon className="w-5 h-5 text-[#3E2723]" />;
                          })()}
                        </div>
                        <DrawerTitle className="text-[#3E2723] text-lg leading-tight break-words">
                          {selectedService.title}
                        </DrawerTitle>
                      </div>
                    </DrawerHeader>

                    <div
                      ref={mobileScrollRef}
                      className="p-4 overflow-y-auto flex-1 min-h-0"
                    >
                      <div>
                        <h4 className="text-[#3E2723] text-lg mb-2">
                          Overview
                        </h4>
                        <p className="text-[#6D4C41]">
                          {selectedService.overview}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-[#3E2723] text-base mb-2">
                          What's included
                        </h4>
                        <ul className="space-y-2 text-[#6D4C41]">
                          {selectedService.included.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-[rgb(var(--cios-accent-rgb))]">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-[#3E2723] text-base mb-2">
                          Ideal for
                        </h4>
                        <ul className="space-y-2 text-[#6D4C41]">
                          {selectedService.idealFor.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-[rgb(var(--cios-accent-rgb))]">
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
                        className="bg-[rgb(var(--cios-accent-rgb))] hover:bg-[rgb(var(--cios-accent-hover-rgb))] text-[#3E2723]"
                      >
                        <Link to="/#contact">Get a Quote</Link>
                      </Button>
                      <Button
                        onClick={closeDetails}
                        variant="outline"
                        className="border-[rgb(var(--cios-accent-rgb))]"
                      >
                        Back to Services
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
              <DialogContent className="sm:max-w-7xl p-0 overflow-hidden border-[rgb(var(--cios-accent-rgb)/0.2)]">
                {!selectedService ? (
                  <div className="p-6">
                    <DialogHeader>
                      <DialogTitle className="text-[#3E2723]">
                        Service not found
                      </DialogTitle>
                      <DialogDescription className="text-[#6D4C41]">
                        Please choose a service from the list.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={closeDetails}
                        className="bg-[rgb(var(--cios-accent-rgb))] hover:bg-[rgb(var(--cios-accent-hover-rgb))] text-[#3E2723]"
                      >
                        Back to Services
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/90 via-[#3E2723]/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 flex items-center gap-3 pr-6">
                        <div className="w-12 h-12 bg-[rgb(var(--cios-accent-rgb))] rounded-lg flex items-center justify-center">
                          {(() => {
                            const Icon = iconFromKey(
                              selectedService.iconKey,
                              Sparkles,
                            );
                            return <Icon className="w-6 h-6 text-[#3E2723]" />;
                          })()}
                        </div>
                        <div className="bg-[#3E2723]/55 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                          <h3 className="text-white text-2xl">
                            {selectedService.title}
                          </h3>
                          <p className="text-gray-100">
                            {selectedService.summary}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 lg:p-10 bg-white overflow-y-auto max-h-[85vh]">
                      <DialogHeader>
                        <DialogTitle className="text-[#3E2723]">
                          Service Details
                        </DialogTitle>
                        <DialogDescription className="text-[#6D4C41]">
                          What's included and who it's best for.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-6">
                        <h4 className="text-[#3E2723] text-xl mb-2">
                          Overview
                        </h4>
                        <p className="text-[#6D4C41]">
                          {selectedService.overview}
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[#3E2723] text-lg mb-3">
                            What's included
                          </h4>
                          <ul className="space-y-2 text-[#6D4C41]">
                            {selectedService.included.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="text-[rgb(var(--cios-accent-rgb))]">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-[#3E2723] text-lg mb-3">
                            Ideal for
                          </h4>
                          <ul className="space-y-2 text-[#6D4C41]">
                            {selectedService.idealFor.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="text-[rgb(var(--cios-accent-rgb))]">
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
                          className="bg-[rgb(var(--cios-accent-rgb))] hover:bg-[rgb(var(--cios-accent-hover-rgb))] text-[#3E2723]"
                        >
                          <Link to="/#contact">Get a Quote</Link>
                        </Button>
                        <Button
                          onClick={closeDetails}
                          variant="outline"
                          className="border-[rgb(var(--cios-accent-rgb))]"
                        >
                          Back to Services
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
