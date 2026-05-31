import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-[#070707]/97 backdrop-blur-sm border-b border-[#1A1A1A]"
            : "bg-transparent"
        }`}
        style={{ height: "72px" }}
      >
        <div className="h-full max-w-[1200px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <Link
            href="/"
            data-testid="link-home"
            className="font-serif text-xl tracking-[0.25em] text-[#C9A86A] uppercase select-none"
          >
            BLACKLINE
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <a
              href="/#services"
              className="text-[13px] tracking-[0.1em] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors duration-200 uppercase"
            >
              Services
            </a>
            <a
              href="/#portfolio"
              className="text-[13px] tracking-[0.1em] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors duration-200 uppercase"
            >
              Portfolio
            </a>
            <Link
              href="/quote"
              className="text-[13px] tracking-[0.1em] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors duration-200 uppercase"
            >
              Quote
            </Link>
            <Link
              href="/booking"
              data-testid="button-book-now-nav"
              className="ml-2 bg-[#C9A86A] text-[#070707] px-6 py-2.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-[#b8974f] transition-colors duration-200"
            >
              Book Now
            </Link>
          </nav>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#F5F5F5] z-50"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#070707] flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-10">
              {[
                { label: "Services", href: "/#services" },
                { label: "Portfolio", href: "/#portfolio" },
                { label: "Quote", href: "/quote" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl text-[#F5F5F5] hover:text-[#C9A86A] transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-[#C9A86A] text-[#070707] px-10 py-4 text-[11px] font-medium tracking-[0.2em] uppercase"
              >
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
