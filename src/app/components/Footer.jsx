import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router";
import { useCms } from "../content/ContentContext";

export function Footer() {
  const { content } = useCms();
  const contact = content.settings.contact;
  const footerServices = content.services.filter((s) => !s.hidden);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--footer-bg)] text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/renoradark.svg"
                  alt="Renora logo"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div> */}
              <div>
                <h1 className="justify-items-start tracking-wider  text-3xl">
                  Renora
                </h1>
                <p className="text-md ">Cleaning Services</p>
              </div>
            </div>
            <p className="text-[var(--footer-muted-text)] text-sm">
              Setting the gold standard in professional cleaning services since
              2015.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-1">
            <h4 className="text-[var(--footer-heading)] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/#home"
                  className="text-[var(--footer-muted-text)] hover:text-[var(--footer-link-hover)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-[var(--footer-muted-text)] hover:text-[var(--footer-link-hover)] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="text-[var(--footer-muted-text)] hover:text-[var(--footer-link-hover)] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="text-[var(--footer-muted-text)] hover:text-[var(--footer-link-hover)] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="mt-1">
            <h4 className="text-[var(--footer-heading)] mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-[var(--footer-muted-text)]">
              {footerServices.map((service) => (
                <li key={service.id}>{service.title}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-1">
            <h4 className="text-[var(--footer-heading)] mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-[var(--footer-muted-text)]">
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
              <li>{contact.address}</li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-[rgb(var(--renora-accent-rgb)/0.2)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--footer-muted-text)]">
              © {currentYear} Renora Cleaning Services. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[var(--footer-social-bg)] hover:bg-[var(--footer-social-hover-bg)] rounded-lg flex items-center justify-center transition-colors group"
              >
                <Facebook className="w-5 h-5 text-[var(--footer-social-icon)] group-hover:text-[var(--footer-social-icon-hover)]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--footer-social-bg)] hover:bg-[var(--footer-social-hover-bg)] rounded-lg flex items-center justify-center transition-colors group"
              >
                <Instagram className="w-5 h-5 text-[var(--footer-social-icon)] group-hover:text-[var(--footer-social-icon-hover)]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--footer-social-bg)] hover:bg-[var(--footer-social-hover-bg)] rounded-lg flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-5 h-5 text-[var(--footer-social-icon)] group-hover:text-[var(--footer-social-icon-hover)]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--footer-social-bg)] hover:bg-[var(--footer-social-hover-bg)] rounded-lg flex items-center justify-center transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-[var(--footer-social-icon)] group-hover:text-[var(--footer-social-icon-hover)]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
