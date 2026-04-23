import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useCms } from "../content/ContentContext";

const FONT_FAMILIES = {
  sans: "inherit",
  serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

function textStyleFromConfig(styleConfig) {
  if (!styleConfig || typeof styleConfig !== "object") return undefined;

  const style = {};
  if (styleConfig.font && FONT_FAMILIES[styleConfig.font]) {
    style.fontFamily = FONT_FAMILIES[styleConfig.font];
  }
  if (styleConfig.bold === true) {
    style.fontWeight = 700;
  }
  if (styleConfig.italic === true) {
    style.fontStyle = "italic";
  }
  if (typeof styleConfig.color === "string" && styleConfig.color.trim()) {
    style.color = styleConfig.color.trim();
  }

  return Object.keys(style).length ? style : undefined;
}

export function Hero() {
  const { content } = useCms();
  const hero = content.settings.hero;
  const badgeStyle = textStyleFromConfig(hero.badgeStyle);
  const headlineStyle = textStyleFromConfig(hero.headlineStyle);
  const highlightStyle = textStyleFromConfig(hero.highlightStyle);
  const subheadlineStyle = textStyleFromConfig(hero.subheadlineStyle);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden pt-20 min-h-[calc(100svh)]"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('${hero.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[var(--badge-bg)] border border-[rgb(var(--cta-button-bg-rgb)/0.1)] backdrop-blur-sm px-4 py-2 rounded-full mb-4 sm:mb-6">
            <Star className="w-4 h-4 text-[var(--icon-accent)] fill-[var(--icon-accent)]" />
            <span className="text-[var(--badge-text)]" style={badgeStyle}>
              {hero.badge}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl mb-5 sm:mb-6 text-[var(--image-overlay-text)]"
            style={headlineStyle}
          >
            {hero.headline}
            <br />
            <span
              className="text-[rgb(var(--renora-accent-rgb))]"
              style={highlightStyle}
            >
              {hero.highlight}
            </span>
          </h1>

          <p
            className="text-base sm:text-xl md:text-2xl text-[var(--image-overlay-muted-text)] mb-6 sm:mb-8 max-w-2xl mx-auto"
            style={subheadlineStyle}
          >
            {hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)] gap-2"
            >
              Get Free Quote
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[rgba(255,249,242,0.45)] bg-transparent text-[var(--image-overlay-text)] hover:bg-[rgba(255,249,242,0.12)] hover:text-[var(--image-overlay-text)]"
            >
              <Link to="/services">Our Services</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-16 max-w-2xl mx-auto">
            {hero.stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl text-[var(--icon-accent)] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--image-overlay-muted-text)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
