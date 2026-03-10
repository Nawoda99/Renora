import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { SectionBadge } from "./SectionBadge";
import { useCms } from "../content/ContentContext";
import * as yup from "yup";

const quoteSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(2, "Please enter your name.")
      .max(200)
      .required("Name is required."),
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(320)
      .required("Email is required."),
    phone: yup
      .string()
      .trim()
      .min(6, "Please enter a valid phone number.")
      .max(50)
      .required("Phone is required."),
    message: yup
      .string()
      .trim()
      .min(5, "Please tell us a bit more about what you need.")
      .max(5000)
      .required("Message is required."),
  })
  .required();

export function Contact() {
  const { content } = useCms();
  const contact = content.settings.contact;
  const headings = content.settings.sections.contact;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitResult, setSubmitResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitResult(null);
    setErrors({});

    let validated;
    try {
      validated = await quoteSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const nextErrors = {};
        for (const item of err.inner) {
          const path = item.path;
          if (!path) continue;
          if (nextErrors[path]) continue;
          nextErrors[path] = item.message;
        }
        setErrors(nextErrors);
        setSubmitResult({
          kind: "error",
          text: "Please fix the highlighted fields.",
        });
        return;
      }

      setSubmitResult({
        kind: "error",
        text: "Please check your details and try again.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || `Request failed: ${response.status}`);
        }
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed: ${response.status}`);
      }

      setSubmitResult({
        kind: "success",
        text: "Thank you! Your quote request was sent. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch (err) {
      setSubmitResult({
        kind: "error",
        text: err instanceof Error ? err.message : "Failed to send request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: contact.phone,
      link: contact.phoneTel,
    },
    {
      icon: Mail,
      title: "Email",
      content: contact.email,
      link: contact.emailMailto,
    },
    {
      icon: MapPin,
      title: "Address",
      content: contact.address,
      link: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: contact.hours,
      link: "#",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-background to-primary"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[rgb(var(--cios-accent-rgb)/0.2)]">
            <h3 className="text-2xl text-[#3E2723] mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {submitResult ? (
                <div
                  className={
                    "rounded-lg border p-3 text-sm " +
                    (submitResult.kind === "error"
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-[rgb(var(--cios-accent-rgb)/0.3)] bg-[rgb(var(--cios-accent-rgb)/0.08)] text-[#3E2723]")
                  }
                >
                  {submitResult.text}
                </div>
              ) : null}
              <div>
                <label htmlFor="name" className="block text-[#3E2723] mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  onInput={() => {
                    if (!errors.name) return;
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  className="border-[rgb(var(--cios-accent-rgb)/0.3)] focus:border-[rgb(var(--cios-accent-rgb))]"
                />
                {errors.name ? (
                  <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="email" className="block text-[#3E2723] mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  onInput={() => {
                    if (!errors.email) return;
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="your@email.com"
                  aria-invalid={Boolean(errors.email)}
                  className="border-[rgb(var(--cios-accent-rgb)/0.3)] focus:border-[rgb(var(--cios-accent-rgb))]"
                />
                {errors.email ? (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="phone" className="block text-[#3E2723] mb-2">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  onInput={() => {
                    if (!errors.phone) return;
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="(555) 123-4567"
                  aria-invalid={Boolean(errors.phone)}
                  className="border-[rgb(var(--cios-accent-rgb)/0.3)] focus:border-[rgb(var(--cios-accent-rgb))]"
                />
                {errors.phone ? (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="message" className="block text-[#3E2723] mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  onInput={() => {
                    if (!errors.message) return;
                    setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Tell us about your cleaning needs..."
                  rows={4}
                  aria-invalid={Boolean(errors.message)}
                  className="border-[rgb(var(--cios-accent-rgb)/0.3)] focus:border-[rgb(var(--cios-accent-rgb))]"
                />
                {errors.message ? (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[rgb(var(--cios-accent-rgb))] hover:bg-[rgb(var(--cios-accent-hover-rgb))] text-[#3E2723]"
              >
                {isSubmitting ? "Sending..." : "Request Quote"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[rgb(var(--cios-accent-rgb)/0.3)] shadow-sm"
                >
                  <div className="w-12 h-12 bg-[rgb(var(--cios-accent-rgb))] rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-[#3E2723]" />
                  </div>
                  <div>
                    <h4 className="text-[#3E2723] mb-1">{item.title}</h4>
                    {item.link !== "#" ? (
                      <a
                        href={item.link}
                        className="text-[#6D4C41] hover:text-[rgb(var(--cios-accent-rgb))] transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-[#6D4C41]">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#3E2723] to-[#2C1810] rounded-2xl p-8 text-white">
              <h3 className="text-2xl mb-4">{contact.whyChooseTitle}</h3>
              <ul className="space-y-3">
                {contact.whyChooseBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[rgb(var(--cios-accent-rgb))] rounded-full mt-2" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
