import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Takk for din påmelding!",
        description: "Du vil nå motta eksklusive tilbud og hudpleietips.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-3 inline-flex items-center gap-3">
            <Mail className="w-6 h-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            Meld deg på vårt nyhetsbrev
          </h2>
          <p className="text-muted-foreground mb-8">
            Få eksklusive tilbud, hudpleietips fra Ida, og vær først til å høre om nye produkter
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Din e-postadresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="sm:w-auto">
              Meld deg på
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4">
            Vi respekterer ditt personvern. Avmeld når som helst.
          </p>
        </div>
      </div>
    </section>
  );
};
