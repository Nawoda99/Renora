import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[rgb(var(--renora-accent-rgb)/0.2)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/#home" className="flex items-center gap-2">
            {/* <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src="/renora.png"
                alt="Renora logo"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div> */}
            <div>
              <h1 className="text-[var(--primary)] tracking-wider  text-4xl">
                Renora
              </h1>
              <p className="text-md text-[var(--muted-foreground)]">
                Cleaning Services
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/#home"
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors"
            >
              Services
            </Link>
            <Link
              to="/#about"
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors"
            >
              About
            </Link>
            <Link
              to="/#testimonials"
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors"
            >
              Testimonials
            </Link>
            <Button
              asChild
              className="bg-[var(--nav-button-bg)] hover:bg-[var(--nav-button-hover-bg)] text-[var(--nav-button-text)]"
            >
              <Link to="/#contact">Get Quote</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[var(--icon-primary)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <Link
              to="/#home"
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors text-left"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors text-left"
            >
              Services
            </Link>
            <Link
              to="/#about"
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors text-left"
            >
              About
            </Link>
            <Link
              to="/#testimonials"
              onClick={() => setIsMenuOpen(false)}
              className="text-[var(--nav-link-text)] hover:text-[var(--nav-link-hover)] transition-colors text-left"
            >
              Testimonials
            </Link>
            <Button
              asChild
              className="bg-[var(--nav-button-bg)] hover:bg-[var(--nav-button-hover-bg)] text-[var(--nav-button-text)] w-full"
            >
              <Link to="/#contact" onClick={() => setIsMenuOpen(false)}>
                Get Quote
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
