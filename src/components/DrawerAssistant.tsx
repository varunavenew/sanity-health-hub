import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DrawerAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="gradient-primary hover:opacity-90 transition-opacity rounded-full w-12 h-12 shadow-lg glow-primary"
          size="icon"
        >
          <Sparkles className="w-5 h-5" />
        </Button>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="glass backdrop-blur-xl border-b border-primary/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Assistant</h3>
                  <p className="text-xs text-muted-foreground">
                    Alltid tilgjengelig for hjelp
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Rask tilgang til assistenten din. Spør om hva som helst!
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 hover:bg-primary/10"
                >
                  🛍️ Produkter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 hover:bg-primary/10"
                >
                  📋 Tjenester
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 hover:bg-primary/10"
                >
                  📚 Informasjon
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 hover:bg-primary/10"
                >
                  🎧 Podcaster
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
