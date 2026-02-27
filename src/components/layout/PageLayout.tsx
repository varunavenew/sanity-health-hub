import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/homepage/Footer";
import { ServicesDropdown } from "@/components/layout/ServicesDropdown";
import { searchSuggestions, SearchItem } from "@/data/searchData";

import BurgerMenu from "@/components/BurgerMenu";
import cmWordmarkNegative from "@/assets/logos/cm-wordmark-negative.png";

interface PageLayoutProps {
  children: React.ReactNode;
  isChatOpen: boolean;
  darkHero?: boolean;
}

export const PageLayout = ({ children, isChatOpen, darkHero = true }: PageLayoutProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsAtTop(currentScrollY < 100);
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Update suggestions when search query changes
  useEffect(() => {
    const results = searchSuggestions(searchQuery);
    setSuggestions(results);
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setSuggestions([]);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleNavigate(suggestions[selectedIndex].path);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleNavigate(suggestions[0].path);
    }
  };

  return (
    <>
      {/* Skip to main content - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm"
      >
        Hopp til hovedinnhold
      </a>

      {/* Combined Header - Banner + Nav that hide/show together */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ marginLeft: isChatOpen ? '360px' : '0' }}
      >
        
        {/* Navigation Bar */}
        <nav className={`transition-colors duration-300 ${isAtTop ? 'bg-gradient-to-b from-black/70 via-black/35 to-transparent' : 'bg-brand-dark/95 backdrop-blur-md'}`} aria-label="Hovednavigasjon">
          <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between relative">
            <Link to="/" className="flex items-center">
              <img 
                src={cmWordmarkNegative} 
                alt="CMedical" 
                className="h-12 md:h-16" 
              />
            </Link>
            
            {/* Main Navigation - Always visible */}
          <div className="hidden md:flex items-center gap-1 text-white">
            <ServicesDropdown />
            <Link 
              to="/priser" 
              className="px-3 py-1.5 text-sm font-light rounded-full transition-all hover:bg-white/10"
            >
              Priser
            </Link>
            <Link 
              to="/forsikring" 
              className="px-3 py-1.5 text-sm font-light rounded-full transition-all hover:bg-white/10"
            >
              Forsikring
            </Link>
            <Link 
              to="/om-oss" 
              className="px-3 py-1.5 text-sm font-light rounded-full transition-all hover:bg-white/10"
            >
              Om oss
            </Link>
            <Link 
              to="/kontakt" 
              className="px-3 py-1.5 text-sm font-light rounded-full transition-all hover:bg-white/10"
            >
              Kontakt
            </Link>
          </div>

          {/* Right side: Search, CTA, Menu */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full transition-all hover:bg-white/10 text-white"
              aria-label="Søk"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Bestill time CTA */}
            <Button 
              size="sm" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-4 md:px-6 text-sm"
              onClick={() => navigate('/booking')}
            >
              Bestill time
            </Button>
            
            {/* Burger Menu */}
            <BurgerMenu />
          </div>
        </div>

        {/* Search Overlay - Inside nav for consistent styling */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="container mx-auto px-4 md:px-8 pb-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 animate-fade-in">
              <form onSubmit={handleSearch} role="search" className="flex items-center gap-3">
                <label htmlFor="site-search" className="sr-only">Søk på nettsiden</label>
                <Search className="h-5 w-5 text-white/70" aria-hidden="true" />
                <input
                  ref={inputRef}
                  id="site-search"
                  type="search"
                  placeholder="Søk etter behandlinger, spesialister, klinikker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  aria-autocomplete="list"
                  aria-controls={suggestions.length > 0 ? "search-suggestions" : undefined}
                  aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  variant="ghost"
                  className="rounded-full hover:bg-white/10 text-white"
                >
                  Søk
                </Button>
              </form>
              
              {/* Autocomplete suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <nav id="search-suggestions" role="listbox" aria-label="Søkeforslag" className="space-y-1">
                    {suggestions.map((item, index) => (
                      <button
                        key={`${item.label}-${item.path}`}
                        id={`suggestion-${index}`}
                        role="option"
                        aria-selected={index === selectedIndex}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-left text-sm transition-all ${
                          index === selectedIndex 
                            ? 'bg-white/20 text-white' 
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs text-white/50">{item.category}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Quick Links - show when no query */}
              {!searchQuery && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/20">
                  <span className="text-xs text-white/60">
                    Populært:
                  </span>
                  {['IVF-behandling', 'Gynekologisk undersøkelse', 'Ultralyd', 'Celleprøve', 'Hormonbehandling'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 text-xs rounded-full transition-all bg-white/10 hover:bg-white/20 text-white"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        </nav>
      </header>

      <div className="flex min-h-screen w-full bg-background">
        <div
          className="flex-1 transition-all duration-300 overflow-x-hidden"
          style={{ 
            marginLeft: isChatOpen ? '360px' : '0',
            maxWidth: isChatOpen ? 'calc(100vw - 360px)' : '100vw',
          }}
        >
          {/* Main Content */}
          <main id="main-content">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};