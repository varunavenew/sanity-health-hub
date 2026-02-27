import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Star, Check, Search, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { allProducts } from "@/data/mockData";

interface ProductDetailProps {
  isChatOpen: boolean;
}

export default function ProductDetail({ isChatOpen }: ProductDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = allProducts.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produktet finnes ikke</h1>
          <Button onClick={() => navigate("/")}>Tilbake til forsiden</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background transition-all duration-300 flex flex-col"
      style={{ 
        marginLeft: isChatOpen ? '400px' : '0',
      }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-foreground">GlowUp</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Hjem
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Om Oss
              </Link>
              <Link to="/guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Hudpleie Guide
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md border bg-muted/30 max-w-xs">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <Input 
                placeholder="Søk..." 
                className="border-0 bg-transparent p-0 h-5 text-sm focus-visible:ring-0"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ShoppingBag className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Back button */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tilbake
        </Button>
      </div>

      {/* Product detail */}
      <div className="container mx-auto max-w-7xl px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product image */}
          <div className="relative">
            <Card className="overflow-hidden border border-primary/10">
              <div className="aspect-square bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.category.replace('_', ' ')}
              </p>
              <h1 className="text-4xl font-serif font-bold mb-4 text-foreground">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {product.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <Card className="p-6 mb-6 border border-primary/10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Fordeler for din hud
                </h2>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary text-xl mt-0.5">✓</span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Results */}
            {product.results && (
              <Card className="p-6 mb-6 bg-accent/10 border-accent/20">
                <h2 className="text-lg font-semibold mb-3 text-accent">
                  📊 Dokumenterte Resultater
                </h2>
                <p className="text-muted-foreground">{product.results}</p>
              </Card>
            )}

            {/* How it works */}
            {product.howItWorks && (
              <Card className="p-6 mb-8 border border-primary/10">
                <h2 className="text-lg font-semibold mb-3">
                  💡 Hvordan det virker
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.howItWorks}
                </p>
              </Card>
            )}

            {/* Price and CTA */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-foreground">{product.price}</span>
                <span className="text-muted-foreground">inkl. mva</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gradient-primary hover:opacity-90 transition-all hover:scale-105 text-lg py-6"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Kjøp nå
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
