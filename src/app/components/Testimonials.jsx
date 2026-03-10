import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useCms } from "../content/ContentContext";
import { SectionBadge } from "./SectionBadge";

export function Testimonials() {
  const { content } = useCms();
  const testimonials = content.testimonials.filter((t) => !t.hidden);
  const headings = content.settings.sections.testimonials;

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-b from-[#FFF8E7] to-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <SectionBadge>{headings.badge}</SectionBadge>
          <h2 className="text-4xl md:text-5xl text-[#3E2723] mb-4">
            {headings.title}
          </h2>
          <p className="text-lg text-[#6D4C41] max-w-2xl mx-auto">
            {headings.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-[rgb(var(--cios-accent-rgb)/0.2)] hover:border-[rgb(var(--cios-accent-rgb))] transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-[rgb(var(--cios-accent-rgb)/0.3)] mb-4" />
                <p className="text-[#6D4C41] font-bold mb-6">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(Math.max(0, Math.min(5, testimonial.rating)))].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[rgb(var(--cios-accent-rgb))] fill-[rgb(var(--cios-accent-rgb))]"
                      />
                    ),
                  )}
                </div>
                <div className="border-t border-[rgb(var(--cios-accent-rgb)/0.2)] pt-4">
                  <h4 className="text-[#3E2723]">{testimonial.name}</h4>
                  <p className="text-sm text-[#6D4C41]">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
