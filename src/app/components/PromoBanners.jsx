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
    <section className="py-14 bg-gradient-to-b from-[#FFF8E7] to-white">
      <div className="container mx-auto px-4">
        <Carousel className="mx-12" opts={{ loop: true }}>
          <CarouselContent>
            {active.map((banner) => (
              <CarouselItem key={banner.id}>
                <PromoBanner
                  wrap={false}
                  badge={banner.badge}
                  title={banner.title}
                  description={banner.description}
                  ctaLabel={banner.ctaLabel}
                  ctaHref={banner.ctaHref}
                  image={banner.image}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-[rgb(var(--cios-accent-rgb)/0.3)] bg-white/80 hover:bg-white" />
          <CarouselNext className="border-[rgb(var(--cios-accent-rgb)/0.3)] bg-white/80 hover:bg-white" />
        </Carousel>
      </div>
    </section>
  );
}
