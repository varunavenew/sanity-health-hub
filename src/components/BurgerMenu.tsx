import { useEffect, useRef, useState } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { label: 'Tjenester', path: '/tjenester' },
  { label: 'Priser', path: '/priser' },
  { label: 'Om oss', path: '/om-oss' },
  { label: 'Forsikring', path: '/forsikring' },
  { label: 'Nyheter og artikler', path: '/aktuelt' },
  { label: 'Kontakt', path: '/kontakt' },
  { label: 'Spesialister', path: '/spesialister' },
];

const BurgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const close = () => setIsMenuOpen(false);

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const clickedInsideMenu = !!menuRef.current?.contains(target);
      const clickedOnButton = !!buttonRef.current?.contains(target);
      if (!clickedInsideMenu && !clickedOnButton) close();
    };

    document.addEventListener('pointerdown', onPointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [isMenuOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="p-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-white/90 transition-all border border-border/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Lukk meny" : "Åpne meny"}
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {isMenuOpen ? <X className="h-5 w-5 text-foreground" aria-hidden="true" /> : <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Desktop Menu */}
            <motion.div 
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute right-0 top-full mt-3 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden min-w-[280px]"
            >
              <div className="p-5">
                <h3 className="text-foreground/50 text-xs uppercase tracking-wider mb-3 font-medium">
                  Meny
                </h3>
                <nav className="space-y-0.5">
                  {menuItems.map((item) => (
                    <button 
                      key={item.path + item.label}
                      onClick={() => handleNavigate(item.path)} 
                      className="w-full text-left py-2 px-3 text-foreground/80 hover:text-foreground hover:bg-muted text-sm font-normal transition-colors rounded-lg"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Hurtig kontakt */}
                <div className="mt-5 pt-5 border-t border-border">
                  <h3 className="text-foreground/50 text-xs uppercase tracking-wider mb-3 font-medium">
                    Hurtig kontakt
                  </h3>
                  <div className="space-y-2">
                    <a 
                      href="tel:+4722001234" 
                      className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      22 00 12 34
                    </a>
                    <a 
                      href="mailto:post@cmedical.no" 
                      className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      post@cmedical.no
                    </a>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <MapPin className="h-4 w-4" />
                      Oslo, Bergen, Trondheim
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="px-5 pb-5">
                <button 
                  onClick={() => handleNavigate('/booking')}
                  className="w-full py-3 text-sm font-normal bg-accent text-accent-foreground hover:bg-accent/90 rounded-full transition-colors"
                >
                  Bestill time
                </button>
              </div>
            </motion.div>

            {/* Mobile Menu */}
            <motion.div 
              ref={menuRef}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="md:hidden fixed inset-0 top-0 bg-white z-50 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigasjonsmeny"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-end p-4 border-b border-border">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
                  aria-label="Lukk meny"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Content */}
              <div className="p-6">
                <h3 className="text-foreground/50 text-xs uppercase tracking-wider mb-4 font-medium">
                  Meny
                </h3>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button 
                      key={item.path + item.label}
                      onClick={() => handleNavigate(item.path)} 
                      className="w-full text-left py-3 text-foreground/80 hover:text-foreground text-base font-normal transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Hurtig kontakt */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-foreground/50 text-xs uppercase tracking-wider mb-4 font-medium">
                    Hurtig kontakt
                  </h3>
                  <div className="space-y-3">
                    <a 
                      href="tel:+4722001234" 
                      className="flex items-center gap-3 text-base text-foreground/70 hover:text-foreground transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      22 00 12 34
                    </a>
                    <a 
                      href="mailto:post@cmedical.no" 
                      className="flex items-center gap-3 text-base text-foreground/70 hover:text-foreground transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      post@cmedical.no
                    </a>
                    <div className="flex items-center gap-3 text-base text-foreground/70">
                      <MapPin className="h-5 w-5" />
                      Oslo, Bergen, Trondheim
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8">
                  <button 
                    onClick={() => handleNavigate('/booking')}
                    className="w-full py-4 text-base font-normal bg-accent text-accent-foreground hover:bg-accent/90 rounded-full transition-colors"
                  >
                    Bestill time
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BurgerMenu;
