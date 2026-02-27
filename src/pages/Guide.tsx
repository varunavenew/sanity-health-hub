import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import cmedicalLogo from "@/assets/cmedical-logo-updated.png";
import BurgerMenu from "@/components/BurgerMenu";

interface GuideProps {
  isChatOpen: boolean;
}

const Guide = ({ isChatOpen }: GuideProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div 
        className="flex-1 transition-all duration-300"
        style={{ 
          marginLeft: isChatOpen ? '400px' : '0',
        }}
      >
        {/* Navigation */}
        <nav className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={cmedicalLogo} alt="CMedical" className="h-8" />
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-light">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Hjem
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                Om Oss
              </Link>
              <Link to="/guide" className="text-foreground hover:text-foreground/80 transition-colors">
                Behandlinger
              </Link>
              <Link to="/gynecology" className="text-muted-foreground hover:text-foreground transition-colors">Gynekologi</Link>
              <Link to="/fertility" className="text-muted-foreground hover:text-foreground transition-colors">Fertilitet</Link>
              <Link to="/urology" className="text-muted-foreground hover:text-foreground transition-colors">Urologi</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
              <Button 
                size="sm" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-6"
                onClick={() => navigate('/booking')}
              >
                Book time
              </Button>
              <BurgerMenu />
            </div>

            <div className="md:hidden">
              <BurgerMenu />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-light mb-6 text-foreground">Våre Behandlinger</h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                Spesialiserte behandlinger for kvinnen og mannens underliv
              </p>
            </div>
          </div>
        </section>

        {/* Gynekologi Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                <div>
                  <h2 className="text-4xl font-light mb-8 text-foreground">Gynekologi</h2>
                  <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                    Våre gynekologer tilbyr omfattende undersøkelser og behandlinger for kvinnehelse. Vi har ekspertise innen alt fra forebyggende helsesjekker til spesialiserte behandlinger.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Generell gynekologisk undersøkelse</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Celleprøve og HPV-test</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Ultralyd og billeddiagnostikk</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Hormonelle forstyrrelser</span>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=1000&fit=crop" 
                    alt="Gynekologi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fertilitet Section */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                <div className="order-2 md:order-1 relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=1000&fit=crop" 
                    alt="Fertilitet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-4xl font-light mb-8 text-foreground">Fertilitet</h2>
                  <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                    Vi tilbyr omfattende fertilitetsbehandling med moderne metoder og personlig oppfølging. Vårt team av spesialister jobber tverrfaglig for å gi deg best mulig hjelp.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Fertilitetsutredning</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">IVF og IUI behandling</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Eggfrysing</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Sædanalyse og behandling</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urologi Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-light mb-8 text-foreground">Urologi</h2>
                  <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                    Våre urologer har spesialkompetanse innen mannens helse og urinveissystemet. Vi tilbyr diskré og profesjonell behandling i moderne lokaler.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Prostataundersøkelse</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Erektil dysfunksjon</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Urinveisinfeksjoner</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-light">Kirurgiske inngrep</span>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=1000&fit=crop" 
                    alt="Urologi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-light mb-6 text-foreground">Klar til å starte?</h2>
              <p className="text-lg text-muted-foreground font-light mb-8 leading-relaxed">
                Book en time hos våre spesialister i dag. Ingen henvisning nødvendig.
              </p>
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-12 py-6 text-lg"
                onClick={() => navigate('/booking')}
              >
                Book time nå
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 border-t bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                <img src={cmedicalLogo} alt="CMedical" className="h-8 mb-6" />
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Nordens ledende klinikk for kvinnen og mannens underliv
                </p>
              </div>
              <div>
                <h4 className="font-light text-foreground mb-4">Sider</h4>
                <ul className="space-y-3 text-sm text-muted-foreground font-light">
                  <li><Link to="/" className="hover:text-foreground transition-colors">Hjem</Link></li>
                  <li><Link to="/about" className="hover:text-foreground transition-colors">Om Oss</Link></li>
                  <li><Link to="/guide" className="hover:text-foreground transition-colors">Behandlinger</Link></li>
                  <li><Link to="/contact" className="hover:text-foreground transition-colors">Kontakt</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-light text-foreground mb-4">Behandlinger</h4>
                <ul className="space-y-3 text-sm text-muted-foreground font-light">
                  <li><a href="#" className="hover:text-foreground transition-colors">Gynekologi</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Fertilitet</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Urologi</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-light text-foreground mb-4">Kontakt</h4>
                <ul className="space-y-3 text-sm text-muted-foreground font-light">
                  <li><a href="#" className="hover:text-foreground transition-colors">Book time</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Klinikker</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Spesialister</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t text-center text-sm text-muted-foreground font-light">
              <p>© 2024 CMedical. Alle rettigheter reservert.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Guide;
