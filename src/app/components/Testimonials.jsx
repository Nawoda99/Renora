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
      className="py-38 bg-gradient-to-b from-[var(--muted)] to-[var(--background)]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <SectionBadge>{headings.badge}</SectionBadge>
          <h2 className="text-4xl md:text-5xl text-[var(--primary)] mb-4">
            {headings.title}
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {headings.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-[var(--icon-accent-soft)] mb-4" />
                <p className="text-[var(--muted-foreground)] font-bold mb-6">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(Math.max(0, Math.min(5, testimonial.rating)))].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[var(--icon-accent)] fill-[var(--icon-accent)]"
                      />
                    ),
                  )}
                </div>
                <div className="border-t border-[var(--card-border)] pt-4">
                  <h4 className="text-[var(--primary)]">{testimonial.name}</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
