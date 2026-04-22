import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { clinics as staticClinics } from "@/data/clinicServices";
import { serviceCategories } from "@/data/serviceCategories";

interface ContactRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Vennligst fyll inn navn").max(100),
  phone: z.string().trim().min(4, "Vennligst fyll inn telefonnummer").max(30),
  clinic: z.string().min(1, "Velg klinikk"),
  category: z.string().min(1, "Velg fagområde"),
  timing: z.enum(["snarest", "specific"]),
  day: z.string().max(50).optional(),
  timeOfDay: z.enum(["formiddag", "ettermiddag", "kveld"]).optional(),
  details: z.string().trim().max(1000).optional(),
});

const TIME_OPTIONS = [
  { value: "formiddag", label: "Formiddag (08–12)" },
  { value: "ettermiddag", label: "Ettermiddag (12–16)" },
  { value: "kveld", label: "Kveld (16–20)" },
];

export const ContactRequestDialog = ({ open, onOpenChange }: ContactRequestDialogProps) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    clinic: "",
    category: "",
    timing: "snarest" as "snarest" | "specific",
    day: "",
    timeOfDay: "" as "" | "formiddag" | "ettermiddag" | "kveld",
    details: "",
  });

  const reset = () => {
    setForm({
      name: "",
      phone: "",
      clinic: "",
      category: "",
      timing: "snarest",
      day: "",
      timeOfDay: "",
      details: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = formSchema.safeParse({
      ...form,
      timeOfDay: form.timeOfDay || undefined,
      day: form.day || undefined,
    });
    if (!parsed.success) {
      toast({
        title: "Sjekk skjemaet",
        description: parsed.error.issues[0]?.message ?? "Vennligst fyll inn alle påkrevde felt",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSending(false);

    toast({
      title: "Forespørsel mottatt",
      description: "Vi tar kontakt med deg så snart som mulig.",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-foreground">
            Vil du at vi skal kontakte deg?
          </DialogTitle>
          <DialogDescription className="font-light">
            Fyll inn skjemaet, så ringer en av våre rådgivere deg tilbake.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cr-name" className="text-sm font-light">Navn</Label>
              <Input
                id="cr-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ditt navn"
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cr-phone" className="text-sm font-light">Telefon</Label>
              <Input
                id="cr-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+47 000 00 000"
                required
                maxLength={30}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-light">Klinikk</Label>
              <Select value={form.clinic} onValueChange={(v) => setForm({ ...form, clinic: v })}>
                <SelectTrigger><SelectValue placeholder="Velg klinikk" /></SelectTrigger>
                <SelectContent>
                  {staticClinics.map((c) => (
                    <SelectItem key={c.id} value={c.id}>CMedical {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-light">Fagområde</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Velg fagområde" /></SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                  <SelectItem value="annet">Annet / vet ikke</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-light">Når ønsker du å bli kontaktet?</Label>
            <RadioGroup
              value={form.timing}
              onValueChange={(v) => setForm({ ...form, timing: v as "snarest" | "specific" })}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex items-center space-x-2 border border-border rounded-md px-3 py-2 flex-1">
                <RadioGroupItem value="snarest" id="cr-snarest" />
                <Label htmlFor="cr-snarest" className="font-light cursor-pointer flex-1">Snarest mulig</Label>
              </div>
              <div className="flex items-center space-x-2 border border-border rounded-md px-3 py-2 flex-1">
                <RadioGroupItem value="specific" id="cr-specific" />
                <Label htmlFor="cr-specific" className="font-light cursor-pointer flex-1">Velg dag og tid</Label>
              </div>
            </RadioGroup>
          </div>

          {form.timing === "specific" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-1.5">
                <Label htmlFor="cr-day" className="text-sm font-light">Dag</Label>
                <Input
                  id="cr-day"
                  type="date"
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-light">Tidspunkt</Label>
                <Select
                  value={form.timeOfDay}
                  onValueChange={(v) => setForm({ ...form, timeOfDay: v as typeof form.timeOfDay })}
                >
                  <SelectTrigger><SelectValue placeholder="Velg tidspunkt" /></SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cr-details" className="text-sm font-light">
              Utdyp gjerne hva det handler om <span className="text-muted-foreground">(valgfritt)</span>
            </Label>
            <Textarea
              id="cr-details"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              placeholder="Kort beskrivelse av hva henvendelsen gjelder..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-light rounded-sm"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              className="bg-brand-dark text-white hover:bg-brand-dark/90 font-light rounded-sm"
            >
              {isSending ? "Sender..." : "Send forespørsel"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center font-light">
            Vi behandler dine personopplysninger i samsvar med GDPR.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
