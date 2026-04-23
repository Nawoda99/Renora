import { Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function PromoBanner({
  badge = "Tidsbegränsat erbjudande",
  title = "Få 20 % rabatt på din första storstädning",
  description = "Boka den här veckan och få en professionell storstädning till ett extra förmånligt pris.",
  ctaLabel = "Ta del av erbjudandet",
  ctaHref = "/#contact",
  image = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
  wrap = true,
}) {
  const content = (
    <Card className="relative border-[var(--card-border)] overflow-hidden shadow-2xl ring-2 ring-[var(--card-border)] animate-in fade-in slide-in-from-bottom-3 duration-700">
      <style>
        {`@media (prefers-reduced-motion: no-preference) {
  @keyframes promo-shine { 0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; } 15% { opacity: .9; } 55% { opacity: .9; } 100% { transform: translateX(140%) skewX(-18deg); opacity: 0; } }
  @keyframes promo-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
}
@media (prefers-reduced-motion: reduce) {
  .promo-shine { display: none; }
  .promo-float { animation: none !important; }
}`}
      </style>

      <div className="relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--promo-overlay), var(--promo-overlay)), url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div
          className="promo-shine pointer-events-none absolute inset-y-0 -left-1/2 w-[60%]"
          style={{
            animation: "promo-shine 2.8s ease-in-out infinite",
            backgroundImage:
              "linear-gradient(to right, transparent, var(--promo-shine), transparent)",
          }}
        />

        <div className="relative p-6 sm:p-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[var(--badge-bg)] border border-[rgb(var(--cta-button-bg-rgb)/0.1)] backdrop-blur-sm px-4 py-2 rounded-full mb-4 sm:mb-6">
              <span className="text-[var(--background)]">{badge}</span>
            </div>
            <h3 className="text-3xl sm:text-4xl text-[var(--image-overlay-text)] mb-3">
              {title}
            </h3>
            <p className="text-[var(--image-overlay-muted-text)] text-lg mb-6">
              {description}
            </p>

            <Button
              asChild
              className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
            >
              <Link to={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  if (!wrap) return content;

  return (
    <section className="py-14 bg-gradient-to-b from-[var(--muted)] to-[var(--background)]">
      <div className="container mx-auto px-4">{content}</div>
    </section>
  );
}
