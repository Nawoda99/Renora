import { Shield } from "lucide-react";
import { useCms } from "../content/ContentContext";
import { iconFromKey } from "../content/iconMap";
import { SectionBadge } from "./SectionBadge";

export function About() {
  const { content } = useCms();
  const about = content.settings.about;

  const images = Array.isArray(about.images) ? about.images : [];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <SectionBadge>{about.badge}</SectionBadge>
            <h2 className="text-4xl md:text-5xl text-[#3E2723] mb-6">
              {about.title}
            </h2>
            {about.paragraphs.slice(0, 2).map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg text-[#6D4C41] mb-6 last:mb-8"
              >
                {paragraph}
              </p>
            ))}

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {about.features.map((feature, index) => {
                const Icon = iconFromKey(feature.iconKey, Shield);
                return (
                  <div key={feature.title || index} className="flex gap-4">
                    <div className="w-12 h-12 bg-[rgb(var(--cios-accent-rgb)/0.1)] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[rgb(var(--cios-accent-rgb))]" />
                    </div>
                    <div>
                      <h4 className="text-[#3E2723] mb-1">{feature.title}</h4>
                      <p className="text-sm text-[#6D4C41]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 rounded-lg overflow-hidden">
                <img
                  src={images[0]}
                  alt="Cleaning service"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-48 rounded-lg overflow-hidden">
                <img
                  src={images[1]}
                  alt="Commercial cleaning"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-48 rounded-lg overflow-hidden">
                <img
                  src={images[2]}
                  alt="Deep cleaning"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img
                  src={images[3]}
                  alt="Window cleaning"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
