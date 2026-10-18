import { logoImage } from "@/lib/images";

const Footer = ({ compact = false }: { compact?: boolean }) => {
  return (
    <footer
      className={`bg-secondary text-secondary-foreground ${compact ? "pt-5 pb-4" : "pt-16 pb-10"}`}
    >
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Sterling Crest Financial Group"
              width={256}
              height={256}
              className="h-10 w-10 object-contain"
            />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-lg tracking-[0.18em] text-white">
                STERLING CREST
              </span>
              <span className="text-[0.6rem] tracking-[0.45em] uppercase text-primary mt-1">
                Financial Group
              </span>
            </span>
          </a>
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8 text-[0.7rem] tracking-[0.25em] uppercase font-sans text-white/60">
            <a
              href="/#services"
              className="hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              href="/resources"
              className="hover:text-primary transition-colors"
            >
              Guides
            </a>
            <a href="/#about" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="/book" className="hover:text-primary transition-colors">
              Book
            </a>
            <a
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </nav>
        </div>

        <div
          className={`${compact ? "mt-4 pt-3" : "mt-12 pt-8"} border-t border-white/10 text-center space-y-2`}
        >
          <p className="text-white/45 text-xs font-sans">
            This website is operated by O'Neill Capital Inc. (DBA Sterling Crest
            Financial).
          </p>
          <p className="text-white/45 text-xs font-sans">
            © {new Date().getFullYear()} O'Neill Capital Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
