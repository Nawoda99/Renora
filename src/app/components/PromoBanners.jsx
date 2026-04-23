import { PromoBanner } from "./PromoBanner";
import { useCms } from "../content/ContentContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export function PromoBanners() {
  const { content } = useCms();
  const active = content.banners.filter((b) => b.active);

  if (active.length === 0) return null;

  if (active.length === 1) {
    const banner = active[0];
    return (
      <PromoBanner
        badge={banner.badge}
        title={banner.title}
        description={banner.description}
        ctaLabel={banner.ctaLabel}
        ctaHref={banner.ctaHref}
        image={banner.image}
      />
    );
  }

  return (
    <section className="py-14 bg-gradient-to-b from-[var(--muted)] to-[var(--background)]">
      <div className="container mx-auto px-4">
        <Carousel className="mx-12" opts={{ loop: true }}>
          <CarouselContent>
            {active.map((banner) => (
              <CarouselItem key={banner.id}>
                <PromoBanner
                  wrap={false}
                  //badge={banner.badge}
                  title={banner.title}
                  description={banner.description}
                  ctaLabel={banner.ctaLabel}
                  ctaHref={banner.ctaHref}
                  image={banner.image}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-[rgb(var(--renora-accent-rgb)/0.3)] bg-[var(--surface-elevated-soft)] hover:bg-[var(--surface-elevated-hover)]" />
          <CarouselNext className="border-[rgb(var(--renora-accent-rgb)/0.3)] bg-[var(--surface-elevated-soft)] hover:bg-[var(--surface-elevated-hover)]" />
        </Carousel>
      </div>
    </section>
  );
}
