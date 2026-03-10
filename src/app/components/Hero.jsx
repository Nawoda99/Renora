import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useCms } from "../content/ContentContext";

export function Hero() {
  const { content } = useCms();
  const hero = content.settings.hero;

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
          backgroundImage: `linear-gradient(rgba(62, 39, 35, 0.7), rgba(62, 39, 35, 0.7)), url('${hero.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[rgb(var(--cios-accent-rgb)/0.2)] backdrop-blur-sm px-4 py-2 rounded-full mb-4 sm:mb-6 border border-[rgb(var(--cios-accent-rgb)/0.3)]">
            <Star className="w-4 h-4 text-[rgb(var(--cios-accent-rgb))] fill-[rgb(var(--cios-accent-rgb))]" />
            <span className="text-[rgb(var(--cios-accent-rgb))]">
              {hero.badge}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl mb-5 sm:mb-6 text-white">
            {hero.headline}
            <br />
            <span className="text-[rgb(var(--cios-accent-rgb))]">
              {hero.highlight}
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-[rgb(var(--cios-accent-rgb))] hover:bg-[rgb(var(--cios-accent-hover-rgb))] text-[#3E2723] gap-2"
            >
              Get Free Quote
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[rgb(var(--cios-accent-rgb))] bg-transparent text-white hover:bg-[rgb(var(--cios-accent-rgb)/0.2)] hover:text-white"
            >
              <Link to="/services">Our Services</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-16 max-w-2xl mx-auto">
            {hero.stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl text-[rgb(var(--cios-accent-rgb))] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
