import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    scrolled || !isHome ? "bg-background/95 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
  }`;

  return (
    <header className={navClass}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-[0.2em] text-primary uppercase z-50 relative">
          Blackline
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/#services" className="text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/#portfolio" className="text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <Link href="/quote" className="text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors">
            Quote
          </Link>
          
          <div className="flex items-center gap-6 ml-4">
            <Link href="/booking" className="bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium tracking-wider hover:bg-primary/90 transition-colors">
              BOOK NOW
            </Link>
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-foreground z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 pt-20"
          >
            <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/#portfolio" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif text-foreground hover:text-primary transition-colors">
              Portfolio
            </Link>
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif text-foreground hover:text-primary transition-colors">
              Quote
            </Link>
            <Link href="/booking" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif text-primary hover:text-primary/80 transition-colors mt-4">
              Book Now
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground mt-10">
              Admin Access
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
