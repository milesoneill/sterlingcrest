import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { logoImage } from "@/lib/images";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Guides", href: "/resources" },
  { label: "About", href: "/#about" },
  { label: "Book", href: "/book" },
];

const Header = ({ variant = "default" }: { variant?: "default" | "guides" }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const useLightStyle = scrolled || !isHome;
  const isGuidesHeader = variant === "guides";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useLightStyle
          ? "bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container max-w-7xl mx-auto pl-6 pr-0">
        <div className="flex items-center justify-between h-24">
          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={logoImage}
              width={256}
              height={256}
              alt="Sterling Crest Financial Group"
              className="h-14 w-14 md:h-16 md:w-16 object-contain"
            />
            <span className="flex flex-col leading-none">
              <span
                className={`font-serif text-lg md:text-2xl tracking-[0.18em] transition-colors ${
                  useLightStyle ? "text-foreground" : "text-white"
                }`}
              >
                STERLING CREST
              </span>
              <span className="text-[0.6rem] md:text-[0.7rem] tracking-[0.45em] uppercase text-primary mt-1.5">
                Financial Group
              </span>
            </span>
          </Link>

          {/* Right cluster: desktop nav + menu square */}
          <div className="flex items-stretch gap-0">
            <nav aria-label="Main navigation" className={`hidden md:flex items-center gap-10 ${isGuidesHeader ? "pr-10" : "pr-8"}`}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isGuidesHeader && link.href === "/resources" ? "page" : undefined}
                  className={`relative py-3 text-xs tracking-[0.25em] uppercase font-sans hover:text-primary transition-colors duration-200 ${
                    isGuidesHeader && link.href === "/resources"
                      ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : useLightStyle ? "text-foreground/70" : "text-white/80"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex items-center justify-center w-16 h-24 bg-secondary text-secondary-foreground hover:bg-navy-light transition-colors ${isGuidesHeader ? "md:hidden" : ""}`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-down panel (all breakpoints) */}
      <div
        aria-hidden={!menuOpen}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out backdrop-blur-md ${
          menuOpen ? "max-h-[32rem]" : "max-h-0"
        } ${
          useLightStyle
            ? "bg-background/97 border-b border-border/60"
            : "bg-secondary/97"
        }`}
      >
        <nav className="container max-w-7xl mx-auto px-6 py-6 flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              tabIndex={menuOpen ? undefined : -1}
              onClick={() => setMenuOpen(false)}
              className={`py-3 text-sm tracking-[0.3em] uppercase font-sans hover:text-primary border-b last:border-b-0 transition-colors ${
                useLightStyle
                  ? "text-foreground border-border/60"
                  : "text-white/80 border-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
