import { About } from "../components/About";
import { BeforeAfter } from "../components/BeforeAfter";
import { Contact } from "../components/Contact";
import { Hero } from "../components/Hero";
import { PromoBanners } from "../components/PromoBanners";
import { Services } from "../components/Services";
import { Testimonials } from "../components/Testimonials";
import { Seo } from "../components/Seo";
import { useCms } from "../content/ContentContext";

export function HomePage() {
  const { content } = useCms();
  const hideAbout = Boolean(content.settings.about.hidden);
  const hideBeforeAfter = Boolean(content.settings.sections.beforeAfter.hidden);
  const hideTestimonials = Boolean(
    content.settings.sections.testimonials.hidden,
  );

  return (
    <>
      <Seo
        title="Renora | Premium Cleaning Services"
        description="Renora provides premium residential and commercial cleaning services. Explore our services and request a quote."
        path="/"
      />
      <Hero />
      <PromoBanners />
      <Services />
      {hideBeforeAfter ? null : <BeforeAfter />}
      {hideAbout ? null : <About />}
      {hideTestimonials ? null : <Testimonials />}
      <Contact />
    </>
  );
}
