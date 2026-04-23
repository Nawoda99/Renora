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
      .min(2, "Ange ditt namn.")
      .max(200)
      .required("Namn är obligatoriskt."),
    email: yup
      .string()
      .trim()
      .email("Ange en giltig e-postadress.")
      .max(320)
      .required("E-post är obligatoriskt."),
    phone: yup
      .string()
      .trim()
      .min(6, "Ange ett giltigt telefonnummer.")
      .max(50)
      .required("Telefonnummer är obligatoriskt."),
    squareMeters: yup
      .string()
      .trim()
      .matches(/^\d+$/, "Vänligen använd endast siffror.")
      .max(10)
      .required("Antal kvadratmeter är obligatoriskt."),
    message: yup
      .string()
      .trim()
      .min(5, "Berätta gärna lite mer om vad du behöver.")
      .max(5000)
      .required("Meddelande är obligatoriskt."),
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
    squareMeters: "",
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
          text: "Rätta de markerade fälten.",
        });
        return;
      }

      setSubmitResult({
        kind: "error",
        text: "Kontrollera dina uppgifter och försök igen.",
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
        text: "Tack! Din offertförfrågan har skickats. Vi återkommer snart.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        squareMeters: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      setSubmitResult({
        kind: "error",
        text:
          err instanceof Error
            ? err.message
            : "Det gick inte att skicka förfrågan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      content: contact.phone,
      link: contact.phoneTel,
    },
    {
      icon: Mail,
      title: "E-post",
      content: contact.email,
      link: contact.emailMailto,
    },
    {
      icon: MapPin,
      title: "Adress",
      content: contact.address,
      link: "#",
    },
    {
      icon: Clock,
      title: "Öppettider",
      content: contact.hours,
      link: "#",
    },
  ];

  return (
    <section
      id="contact"
      className="py-32 bg-gradient-to-b from-[var(--background)] to-[var(--muted)]"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-xl border border-[var(--card-border)]">
            <h3 className="text-2xl text-[var(--primary)] mb-6">
              Skicka ett meddelande
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {submitResult ? (
                <div
                  className={
                    "rounded-lg border p-3 text-sm " +
                    (submitResult.kind === "error"
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-[rgb(var(--renora-accent-rgb)/0.3)] bg-[rgb(var(--renora-accent-rgb)/0.08)] text-[var(--primary)]")
                  }
                >
                  {submitResult.text}
                </div>
              ) : null}
              <div>
                <label
                  htmlFor="name"
                  className="block text-[var(--form-label-text)] mb-2"
                >
                  Namn
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
                  placeholder="Ditt namn"
                  aria-invalid={Boolean(errors.name)}
                  className="text-[var(--form-input-text)] border-[var(--form-input-border)] focus:border-[var(--form-input-focus-border)] focus-visible:border-[var(--form-input-focus-border)]"
                />
                {errors.name ? (
                  <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-[var(--form-label-text)] mb-2"
                >
                  E-post
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
                  placeholder="din@email.com"
                  aria-invalid={Boolean(errors.email)}
                  className="text-[var(--form-input-text)] border-[var(--form-input-border)] focus:border-[var(--form-input-focus-border)] focus-visible:border-[var(--form-input-focus-border)]"
                />
                {errors.email ? (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-[var(--form-label-text)] mb-2"
                >
                  Telefon
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
                  className="text-[var(--form-input-text)] border-[var(--form-input-border)] focus:border-[var(--form-input-focus-border)] focus-visible:border-[var(--form-input-focus-border)]"
                />
                {errors.phone ? (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="squareMeters"
                  className="block text-[var(--form-label-text)] mb-2"
                >
                  Antal kvadratmeter *
                </label>
                <p className="mb-2 text-sm text-[var(--muted-foreground)]">
                  Vänligen använd endast siffror
                </p>
                <Input
                  id="squareMeters"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.squareMeters}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      squareMeters: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  onInput={() => {
                    if (!errors.squareMeters) return;
                    setErrors((prev) => ({
                      ...prev,
                      squareMeters: undefined,
                    }));
                  }}
                  placeholder="t.ex. 120"
                  aria-invalid={Boolean(errors.squareMeters)}
                  className="text-[var(--form-input-text)] border-[var(--form-input-border)] focus:border-[var(--form-input-focus-border)] focus-visible:border-[var(--form-input-focus-border)]"
                />
                {errors.squareMeters ? (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.squareMeters}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-[var(--form-label-text)] mb-2"
                >
                  Meddelande
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
                  placeholder="Berätta om dina städbehov..."
                  rows={4}
                  aria-invalid={Boolean(errors.message)}
                  className="text-[var(--form-input-text)] border-[var(--form-input-border)] focus:border-[var(--form-input-focus-border)] focus-visible:border-[var(--form-input-focus-border)]"
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
                className="w-full mb-1 mt-6 bg-[var(--cta-button-bg)] hover:bg-[var(--cta-button-hover-bg)] text-[var(--cta-button-text)]"
              >
                {isSubmitting ? "Skickar..." : "Begär offert"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex items-center">
            <div className="w-full max-w-xl space-y-8 my-6 mx-auto">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-[var(--surface-elevated-soft)] backdrop-blur-sm p-6 rounded-xl border border-[var(--card-border)] shadow-sm"
                >
                  <div className="w-12 h-12 bg-[rgb(var(--renora-accent-rgb))] rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-[var(--icon-on-accent)] bg-rgb(var(--renora-accent-rgb))" />
                  </div>
                  <div>
                    <h4 className="text-[var(--primary)] mb-1">{item.title}</h4>
                    {item.link !== "#" ? (
                      <a
                        href={item.link}
                        className="text-[var(--muted-foreground)] hover:text-[rgb(var(--renora-accent-hover-rgb))] transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-[var(--muted-foreground)]">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--foreground)] rounded-2xl p-8 text-white">
              <h3 className="text-2xl mb-4">{contact.whyChooseTitle}</h3>
              <ul className="space-y-3">
                {contact.whyChooseBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[rgb(var(--renora-accent-rgb))] rounded-full mt-2" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
