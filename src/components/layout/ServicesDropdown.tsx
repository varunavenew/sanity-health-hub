import { useState, useRef } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { serviceCategories } from '@/data/serviceCategories';

export const ServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('gynekologi');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory('gynekologi');
      setActiveSubcategory(null);
    }, 150);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setActiveCategory('gynekologi');
    setActiveSubcategory(null);
  };

  const handleNavigateServices = () => {
    navigate('/tjenester');
    setIsOpen(false);
    setActiveCategory('gynekologi');
    setActiveSubcategory(null);
  };

  const activeCategoryData = serviceCategories.find(c => c.id === activeCategory)!;
  const activeSubcategoryData = activeSubcategory 
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
        className="px-3 py-1.5 text-sm font-light rounded-full transition-all hover:bg-white/10 text-white flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Tjenester
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
                  <h3 className="text-white/50 text-[10px] uppercase tracking-wider mb-2 font-light px-2">
                    Fagområder
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
                <div className="w-[220px] p-4 bg-white/5 max-h-[calc(100vh-140px)] overflow-y-auto border-r border-white/10">
                  <h3 className="text-white/50 text-[10px] uppercase tracking-wider mb-2 font-light px-2">
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
                </div>

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
                      <div className="w-[200px] p-4 bg-white/[0.03] max-h-[calc(100vh-140px)] overflow-y-auto">
                        <h3 className="text-white/50 text-[10px] uppercase tracking-wider mb-2 font-light px-2">
                          {activeSubcategoryData.label}
                        </h3>
                        <nav className="grid grid-cols-1 gap-0">
                          {activeSubcategoryData.items.map((item) => (
                            <button 
                              key={item.label}
                              onClick={() => handleNavigate(activeSubcategoryData.path)} 
                              className="w-full text-left py-1.5 px-2 text-[12px] font-light transition-colors rounded text-white/60 hover:text-white hover:bg-white/10"
                            >
                              {item.label}
                            </button>
                          ))}
                        </nav>
                      </div>
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
