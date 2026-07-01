import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSanity';
import { useTranslation } from 'react-i18next';
import { serviceCategories } from '@/data/serviceCategories';

const BurgerMenu = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { data: siteSettings } = useSiteSettings();

 // Allow external triggers (e.g. mobile bottom-nav) to open the menu.
 useEffect(() => {
   const open = () => setIsMenuOpen(true);
   window.addEventListener('cm:openMenu', open);
   return () => window.removeEventListener('cm:openMenu', open);
 }, []);

 // Lock body scroll while mobile drawer is open.
 useEffect(() => {
   if (!isMenuOpen) return;
   if (typeof window === 'undefined') return;
   if (window.matchMedia('(min-width: 768px)').matches) return;
   const prev = document.body.style.overflow;
   document.body.style.overflow = 'hidden';
   return () => { document.body.style.overflow = prev; };
 }, [isMenuOpen]);

 const staticMenuItems = [
 { label: t('nav.services'), path: '/tjenester' },
 { label: t('nav.pricing'), path: '/priser' },
 { label: t('nav.clinics'), path: '/klinikker' },
 { label: t('nav.about'), path: '/om-oss' },
 { label: t('nav.insurance'), path: '/forsikring' },
 { label: t('nav.news'), path: '/aktuelt' },
 { label: t('nav.contact'), path: '/kontakt' },
 { label: t('nav.specialists'), path: '/spesialister' },
 ];

 const menuItems = siteSettings?.mainNavigation?.length
 ? siteSettings.mainNavigation.map((item: any) => ({ label: item.label, path: item.path }))
 : staticMenuItems;

 const ctaButton = siteSettings?.ctaButton || { label: t('nav.bookAppointment'), path: '/booking' };
 const phone = siteSettings?.phone || '22 00 12 34';
 const address = siteSettings?.address || 'Oslo, Bergen, Trondheim';

 useEffect(() => {
 if (!isMenuOpen) return;

 const close = () => setIsMenuOpen(false);

 const onPointerDown = (e: PointerEvent) => {
 const target = e.target as Node | null;
 if (!target) return;

 const clickedInsideMenu = !!menuRef.current?.contains(target) || !!mobileMenuRef.current?.contains(target);
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
        className="inline-flex p-2.5 bg-white rounded-2xl md:rounded-full shadow-md hover:shadow-lg hover:bg-white/90 transition-all border border-border/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
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

 {/* Quick contact */}
 <div className="mt-5 pt-5 border-t border-border">
 <div className="space-y-2">
 <a 
 href={`tel:${phone.replace(/\s/g, '')}`}
 className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
 >
 <Phone className="h-4 w-4" />
 {phone}
 </a>
 <button 
 onClick={() => handleNavigate('/kontakt')}
 className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
 >
 <Mail className="h-4 w-4" />
 {t("nav.contactForm")}
 </button>
 <div className="flex items-center gap-2 text-sm text-foreground/70">
 <MapPin className="h-4 w-4" />
 {address}
 </div>
 </div>
 </div>
 </div>

 {/* CTA Button */}
 <div className="px-5 pb-5">
 <button 
 onClick={() => handleNavigate(ctaButton.path)}
 className="w-full py-3 text-sm font-normal bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl transition-colors"
 >
 {ctaButton.label}
 </button>
 </div>
 </motion.div>

 {/* Mobile Menu — portaled to body to escape transformed ancestors (fixed positioning) */}
 {createPortal(
  <motion.div 
  ref={mobileMenuRef}
  initial={{ opacity: 0, x: '100%' }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: '100%' }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
   className="md:hidden fixed inset-0 bg-background z-[100] overflow-y-auto flex flex-col"
   role="dialog"
   aria-modal="true"
   aria-label={t("nav.navigationMenu")}
   >
   {/* Mobile Header — beige stripe */}
   <div className="flex items-center justify-between px-5 py-4 border-b border-brand-mid/20 bg-brand-warm">
     <span className="text-xs uppercase text-foreground/50">Meny</span>
     <button
       onClick={() => setIsMenuOpen(false)}
       className="p-2 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
       aria-label={t("nav.closeMenu")}
     >
       <X className="h-6 w-6" aria-hidden="true" />
     </button>
   </div>

   {/* Mobile Content */}
   <div className="p-5 pb-6 flex-1">

    {/* Tjenester – accordion (Priser pill style) */}
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs uppercase text-foreground/50">Tjenester</h3>
        <button
          onClick={() => handleNavigate('/tjenester')}
          className="inline-flex items-center gap-1 text-xs text-brand-dark/80 hover:text-brand-dark"
        >
          Alle tjenester
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Alle tjenester" className="space-y-2">
        {serviceCategories.map((cat) => {
          const isOpen = openCategory === cat.id;
          return (
            <div key={cat.id} className="rounded-2xl border border-brand-mid/30 bg-white overflow-hidden">
              <div className="flex items-stretch">
                <button
                  onClick={() => handleNavigate(cat.path)}
                  className="flex-1 text-left px-4 py-3 text-[15px] font-normal text-brand-dark min-h-[48px]"
                >
                  {cat.label}
                </button>
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className={`px-4 flex items-center justify-center min-h-[48px] border-l border-brand-dark/10 transition-colors ${
                    isOpen ? 'bg-brand-dark text-brand-warm' : 'bg-transparent text-brand-dark/60 hover:bg-brand-dark/5'
                  }`}
                  aria-expanded={isOpen}
                  aria-label={isOpen ? `Lukk ${cat.label}` : `Vis ${cat.label}`}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden border-t border-brand-dark/10 bg-brand-warm/40"
                  >
                    {cat.subcategories.map((sub) => (
                      <li key={sub.path} className="border-b border-brand-dark/5 last:border-b-0">
                        <button
                          onClick={() => handleNavigate(sub.path)}
                          className="w-full text-left px-5 py-3 text-sm text-brand-dark/85 hover:text-brand-dark hover:bg-brand-dark/5 transition-colors min-h-[44px] flex items-center justify-between"
                        >
                          <span>{sub.label}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-brand-dark/40" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>


 {/* Øvrige sider */}
 <div className="mt-10 pt-6 border-t border-brand-mid/20">
 <h3 className="text-xs uppercase tracking-normal text-foreground/50 mb-2">Mer</h3>
 <nav className="space-y-0.5">
 {menuItems.filter((m) => m.path !== '/tjenester').map((item) => (
 <button
 key={item.path + item.label}
 onClick={() => handleNavigate(item.path)}
 className="w-full text-left py-3 text-base text-foreground/80 hover:text-foreground transition-colors min-h-[44px]"
 >
 {item.label}
 </button>
 ))}
 </nav>
 </div>

 {/* Quick contact */}
 <div className="mt-8 pt-6 border-t border-brand-mid/20">
 <div className="space-y-3">
 <a 
 href={`tel:${phone.replace(/\s/g, '')}`}
 className="flex items-center gap-3 text-base text-foreground/70 hover:text-foreground transition-colors"
 >
 <Phone className="h-5 w-5" />
 {phone}
 </a>
 <button 
 onClick={() => handleNavigate('/kontakt')}
 className="flex items-center gap-3 text-base text-foreground/70 hover:text-foreground transition-colors"
 >
 <Mail className="h-5 w-5" />
 {t("nav.contactForm")}
 </button>
 <div className="flex items-center gap-3 text-base text-foreground/70">
 <MapPin className="h-5 w-5" />
 {address}
 </div>
 </div>
 </div>

 {/* CTA */}
 <div className="mt-8">
 <button 
 onClick={() => handleNavigate(ctaButton.path)}
 className="w-full py-4 text-base font-normal bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl transition-colors"
 >
 {ctaButton.label}
 </button>
 </div>
 </div>
 </motion.div>,
 document.body
 )}
 </>
 )}
 </AnimatePresence>
 </div>
 );
};

export default BurgerMenu;
