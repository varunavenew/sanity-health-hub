import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// ---- REDIGER INNHOLD HER ----
const POPUP_CONFIG = {
  triggerLabel: "Book gratis konsultasjon",
  title: "Book gratis fertilitets­konsultasjon",
  ingress:
    "Ønsker du å vite mer om dine muligheter? Fyll inn kontaktinfo så tar en av våre spesialister kontakt med deg.",
  inputLabel: "E-post eller telefon",
  inputPlaceholder: "din@epost.no eller 900 00 000",
  buttonLabel: "Send forespørsel",
  successMessage: "Takk! Vi tar kontakt med deg snart. 💛",
  // Mottaker-epost (brukes kun som referanse – send via edge function i fremtiden)
  recipientEmail: "post@cmedical.no",
};
// ------------------------------

interface LeadPopupProps {
  /** Kontrollerer om popup-knappen vises nede til høyre */
  show?: boolean;
}

export const LeadPopup = ({ show = true }: LeadPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  if (!show) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSending(true);
    // Simulerer sending – koble til edge function / e-post-tjeneste ved behov
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    setSent(true);
    toast({
      title: "Forespørsel sendt!",
      description: POPUP_CONFIG.successMessage,
    });
    setTimeout(() => {
      setIsOpen(false);
      setSent(false);
      setContact("");
    }, 2500);
  };

  return (
    <>
      {/* Trigger-knapp */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full shadow-2xl px-5 py-3 h-auto text-sm font-light bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
          >
            {POPUP_CONFIG.triggerLabel}
          </Button>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-8 sm:items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Popup-kort */}
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-3">
              <h2 className="text-base font-medium text-foreground leading-snug pr-4">
                {POPUP_CONFIG.title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 flex-shrink-0"
                aria-label="Lukk"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Ingress */}
            <p className="px-5 pb-4 text-sm text-muted-foreground font-light leading-relaxed">
              {POPUP_CONFIG.ingress}
            </p>

            {/* Skjema */}
            {!sent ? (
              <form onSubmit={handleSend} className="px-5 pb-5 space-y-3">
                <div>
                  <label
                    htmlFor="lead-contact"
                    className="text-xs text-muted-foreground mb-1.5 block font-light"
                  >
                    {POPUP_CONFIG.inputLabel}
                  </label>
                  <Input
                    id="lead-contact"
                    type="text"
                    placeholder={POPUP_CONFIG.inputPlaceholder}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full text-sm"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSending || !contact.trim()}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full"
                >
                  {isSending ? "Sender..." : POPUP_CONFIG.buttonLabel}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Vi behandler dine personopplysninger i samsvar med GDPR.
                </p>
              </form>
            ) : (
              <div className="px-5 pb-6 text-center">
                <p className="text-sm text-foreground font-light">
                  {POPUP_CONFIG.successMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
