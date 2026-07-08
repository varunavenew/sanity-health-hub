import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { useTranslation } from 'react-i18next';
import { treatmentContent } from '@/data/treatmentContent';

// Returns true if a service item path resolves to a real treatment page.
// Sub-treatment routes look like /behandlinger/{categoryId}/{subId}.
const hasTreatmentPage = (path: string): boolean => {
  const match = path.match(/^\/behandlinger\/([^/]+)\/([^/?#]+)/);
  if (!match) return true; // non-sub-treatment paths are assumed valid
  const [, categoryId, subId] = match;
  return Boolean(treatmentContent[`${categoryId}/${subId}`]);
};

type ScrollableMenuColumnProps = {
  children: ReactNode;
  className: string;
  scrollbarClassName?: string;
  scrollKey: string;
  showCustomScrollbar?: boolean;
};

const ScrollableMenuColumn = ({ children, className, scrollbarClassName = '', scrollKey, showCustomScrollbar = true }: ScrollableMenuColumnProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollbar, setScrollbar] = useState({ visible: false, height: 0, top: 0 });

  const updateScrollbar = () => {
    const element = scrollRef.current;
    if (!element) return;

    const { clientHeight, scrollHeight, scrollTop } = element;
    const visible = scrollHeight > clientHeight + 1;
    if (!visible) {
      setScrollbar({ visible: false, height: 0, top: 0 });
      return;
    }

    const trackHeight = clientHeight - 16;
    const height = Math.max(48, (clientHeight / scrollHeight) * trackHeight);
    const maxTop = trackHeight - height;
    const top = 8 + (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    setScrollbar({ visible: true, height, top });
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollTop = 0;
    const frame = requestAnimationFrame(updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [scrollKey]);

  return (
    <div className={`relative ${scrollbarClassName}`}>
      <div
        ref={scrollRef}
        onScroll={updateScrollbar}
        className={`${className} ${showCustomScrollbar ? '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : ''}`}
      >

        {children}
      </div>
      {showCustomScrollbar && scrollbar.visible && (
        <div className="pointer-events-none absolute right-1 top-0 bottom-0 w-2.5 py-2">
          <div className="relative h-full w-full rounded-2xl md:rounded-full bg-white/[0.15]">
            <div
              className="absolute left-0.5 right-0.5 rounded-2xl md:rounded-full bg-white/70"
              style={{ height: `${scrollbar.height}px`, transform: `translateY(${scrollbar.top - 8}px)` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const ServicesDropdown = () => {
 const { categories: serviceCategories } = useServiceCategories();
 const { t } = useTranslation();
 const location = useLocation();
 const [isOpen, setIsOpen] = useState(false);
 const [activeCategory, setActiveCategory] = useState<string | null>(null);
 const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
 const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const navigate = useNavigate();

 // Find the category that matches the current route (longest matching path wins)
 const currentCategory = serviceCategories
 .filter((c) => c.path && (location.pathname === c.path || location.pathname.startsWith(c.path + '/')))
 .sort((a, b) => b.path.length - a.path.length)[0];

 const handleMouseEnter = () => {
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 if (!activeCategory && serviceCategories.length > 0) {
 setActiveCategory(currentCategory?.id ?? serviceCategories[0].id);
 }
 setIsOpen(true);
 };

 const handleMouseLeave = () => {
 timeoutRef.current = setTimeout(() => {
 setIsOpen(false);
 setActiveCategory(null);
 setActiveSubcategory(null);
 }, 150);
 };

 const handleNavigate = (path: string) => {
 navigate(path);
 setIsOpen(false);
 setActiveCategory(null);
 setActiveSubcategory(null);
 };

 const handleNavigateServices = () => {
 navigate('/tjenester');
 setIsOpen(false);
 setActiveCategory(null);
 setActiveSubcategory(null);
 };

 const activeCategoryData = serviceCategories.find(c => c.id === activeCategory) || serviceCategories[0];
 const activeSubcategoryData = activeCategoryData && activeSubcategory 
 ? activeCategoryData.subcategories.find(s => s.label === activeSubcategory)
 : null;

 return (
 <div 
 className="relative"
 onMouseEnter={handleMouseEnter}
 onMouseLeave={handleMouseLeave}
 >
 <button 
 onClick={handleNavigateServices}
 onFocus={handleMouseEnter}
 onBlur={() => {
 timeoutRef.current = setTimeout(() => {
 setIsOpen(false);
 }, 200);
 }}
 className="px-2 lg:px-3 py-1.5 text-sm font-light rounded-2xl md:rounded-full transition-all hover:bg-white/10 text-white flex items-center gap-1"
 aria-expanded={isOpen}
 aria-haspopup="true"
 >
 {t("nav.services")}
 <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
 </button>

 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 transition={{ duration: 0.15 }}
 className="absolute left-0 top-full pt-2 z-50"
 >
 <div className="bg-brand-dark rounded-2xl shadow-2xl overflow-hidden border border-white/10">
 <div className="flex">
 {/* Column 1 - Main Categories */}
 <div className="w-[180px] p-4 border-r border-white/10">
 <h3 className="text-white/50 text-sm mb-2 font-light px-2">
 {t("nav.services")}
 </h3>
 <nav className="space-y-0">
 {serviceCategories.map((category) => (
 <button 
 key={category.id}
 onMouseEnter={() => {
 setActiveCategory(category.id);
 setActiveSubcategory(null);
 }}
 onClick={() => handleNavigate(category.path)} 
 className={`w-full flex items-center justify-between py-2 px-2 rounded-md text-left text-[13px] font-light transition-all ${
 activeCategory === category.id 
 ? 'bg-white/10 text-white' 
 : 'text-white/70 hover:text-white hover:bg-white/5'
 }`}
 >
 {category.label}
 <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeCategory === category.id ? 'translate-x-1' : ''}`} />
 </button>
 ))}
 </nav>
 </div>

  {/* Column 2 - Subcategories */}
          <ScrollableMenuColumn
            scrollKey={activeCategoryData.id}
            showCustomScrollbar={activeCategoryData.id === 'gynekologi'}
            scrollbarClassName="border-r border-white/10"
            className="w-[220px] p-4 pr-6 bg-white/5 max-h-[calc(100vh-140px)] overflow-y-scroll [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.70)_rgba(255,255,255,0.15)] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:[-webkit-appearance:none] [&::-webkit-scrollbar]:bg-white/[0.15] [&::-webkit-scrollbar-track]:bg-white/[0.15] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding"
          >
 <h3 className="text-white/50 text-sm mb-2 font-light px-2">
 {activeCategoryData.label}
 </h3>
 <AnimatePresence mode="wait">
 <motion.div
 key={activeCategoryData.id}
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ duration: 0.12 }}
 >
 <nav className="grid grid-cols-1 gap-0">
 {activeCategoryData.subcategories.map((sub) => (
 <button 
 key={sub.label}
 onMouseEnter={() => setActiveSubcategory(sub.label)}
 onClick={() => handleNavigate(sub.path)} 
 className={`w-full flex items-center justify-between text-left py-2 px-2 text-[13px] font-light transition-colors rounded group ${
 activeSubcategory === sub.label
 ? 'bg-white/10 text-white'
 : 'text-white/70 hover:text-white hover:bg-white/10'
 }`}
 >
 <span>{sub.label}</span>
 {sub.items && sub.items.length > 0 && (
 <ChevronRight className={`h-3.5 w-3.5 transition-all ${
 activeSubcategory === sub.label ? 'opacity-100 translate-x-1' : 'opacity-50'
 }`} />
 )}
 </button>
 ))}
 </nav>
 </motion.div>
 </AnimatePresence>
 </ScrollableMenuColumn>

 {/* Column 3 - Sub-items */}
 <AnimatePresence>
 {activeSubcategoryData && activeSubcategoryData.items && activeSubcategoryData.items.length > 0 && (
 <motion.div
 key="third-column"
 initial={{ opacity: 0, width: 0 }}
 animate={{ opacity: 1, width: 200 }}
 exit={{ opacity: 0, width: 0 }}
 transition={{ duration: 0.15 }}
 className="overflow-hidden"
 >
 <ScrollableMenuColumn
 scrollKey={activeSubcategoryData.label}
 className="w-[200px] p-4 pr-6 bg-white/[0.03] max-h-[calc(100vh-140px)] overflow-y-scroll [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.70)_rgba(255,255,255,0.15)] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:[-webkit-appearance:none] [&::-webkit-scrollbar]:bg-white/[0.15] [&::-webkit-scrollbar-track]:bg-white/[0.15] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding"
 >
 <h3 className="text-white/50 text-sm mb-2 font-light px-2">
 {activeSubcategoryData.label}
 </h3>
 <nav className="grid grid-cols-1 gap-0">
 {activeSubcategoryData.items.map((item) => (
 <button 
 key={item.label}
                                  onClick={() => {
                                    // Fall back to the parent subcategory page when the item
                                    // either has no own path or its path doesn't resolve to a
                                    // real treatment page (e.g. "Akne" -> /hudlege).
                                    if (item.path && hasTreatmentPage(item.path)) {
                                      handleNavigate(item.path);
                                    } else {
                                      handleNavigate(activeSubcategoryData.path);
                                    }
                                  }}
 className="w-full text-left py-1.5 px-2 text-[12px] font-light transition-colors rounded text-white/60 hover:text-white hover:bg-white/10"
 >
 {item.label}
 </button>
 ))}
 </nav>
 </ScrollableMenuColumn>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};
