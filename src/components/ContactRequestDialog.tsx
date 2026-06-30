import { useMemo, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useClinics, useContactRequestDialogCopy } from "@/hooks/useSanity";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import type { ContactRequestDialogCopy } from "@/lib/sanity/contact-request-dialog-copy";

interface ContactRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function buildFormSchema(copy: ContactRequestDialogCopy) {
  return z.object({
    name: z.string().trim().min(1, copy.validationNameRequired).max(100),
    phone: z.string().trim().min(4, copy.validationPhoneRequired).max(30),
    clinic: z.string().min(1, copy.validationClinicRequired),
    category: z.string().min(1, copy.validationCategoryRequired),
    timing: z.enum(["snarest", "specific"]),
    day: z.string().max(50).optional(),
    timeOfDay: z.enum(["formiddag", "ettermiddag", "kveld"]).optional(),
    details: z.string().trim().max(1000).optional(),
  });
}

export const ContactRequestDialog = ({ open, onOpenChange }: ContactRequestDialogProps) => {
  const { data: clinics = [] } = useClinics();
  const { categories: serviceCategories } = useServiceCategories();
  const { copy, isLoading } = useContactRequestDialogCopy();
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

  const timeOptions = useMemo(() => {
    if (!copy) return [];
    return [
      { value: "formiddag" as const, label: copy.timeMorningLabel },
      { value: "ettermiddag" as const, label: copy.timeAfternoonLabel },
      { value: "kveld" as const, label: copy.timeEveningLabel },
    ];
  }, [copy]);

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
    if (!copy) return;

    const parsed = buildFormSchema(copy).safeParse({
      ...form,
      timeOfDay: form.timeOfDay || undefined,
      day: form.day || undefined,
    });
    if (!parsed.success) {
      toast({
        title: copy.toastValidationTitle,
        description: parsed.error.issues[0]?.message ?? copy.toastValidationDescription,
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSending(false);

    toast({
      title: copy.toastSuccessTitle,
      description: copy.toastSuccessDescription,
    });
    reset();
    onOpenChange(false);
  };

  if (!copy && !isLoading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background">
        {copy ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-foreground">
                {copy.dialogTitle}
              </DialogTitle>
              <DialogDescription className="font-light">
                {copy.dialogDescription}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cr-name" className="text-sm font-light">{copy.nameLabel}</Label>
                  <Input
                    id="cr-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={copy.namePlaceholder}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cr-phone" className="text-sm font-light">{copy.phoneLabel}</Label>
                  <Input
                    id="cr-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={copy.phonePlaceholder}
                    required
                    maxLength={30}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-light">{copy.clinicLabel}</Label>
                  <Select value={form.clinic} onValueChange={(v) => setForm({ ...form, clinic: v })}>
                    <SelectTrigger><SelectValue placeholder={copy.clinicPlaceholder} /></SelectTrigger>
                    <SelectContent>
                      {clinics.map((c: { slug?: string; id?: string; label: string }) => (
                        <SelectItem key={c.id} value={c.id}>CMedical {c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-light">{copy.categoryLabel}</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder={copy.categoryPlaceholder} /></SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((cat: { id: string; label: string }) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                      <SelectItem value="annet">{copy.categoryOtherLabel}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-light">{copy.timingLabel}</Label>
                <RadioGroup
                  value={form.timing}
                  onValueChange={(v) => setForm({ ...form, timing: v as "snarest" | "specific" })}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex items-center space-x-2 border border-border rounded-md px-3 py-2 flex-1">
                    <RadioGroupItem value="snarest" id="cr-snarest" />
                    <Label htmlFor="cr-snarest" className="font-light cursor-pointer flex-1">
                      {copy.timingAsapLabel}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border rounded-md px-3 py-2 flex-1">
                    <RadioGroupItem value="specific" id="cr-specific" />
                    <Label htmlFor="cr-specific" className="font-light cursor-pointer flex-1">
                      {copy.timingSpecificLabel}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {form.timing === "specific" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label htmlFor="cr-day" className="text-sm font-light">{copy.dayLabel}</Label>
                    <Input
                      id="cr-day"
                      type="date"
                      value={form.day}
                      onChange={(e) => setForm({ ...form, day: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-light">{copy.timeOfDayLabel}</Label>
                    <Select
                      value={form.timeOfDay}
                      onValueChange={(v) => setForm({ ...form, timeOfDay: v as typeof form.timeOfDay })}
                    >
                      <SelectTrigger><SelectValue placeholder={copy.timeOfDayPlaceholder} /></SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="cr-details" className="text-sm font-light">
                  {copy.detailsLabel}{" "}
                  <span className="text-muted-foreground">{copy.detailsOptionalSuffix}</span>
                </Label>
                <Textarea
                  id="cr-details"
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder={copy.detailsPlaceholder}
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
                  {copy.cancelButton}
                </Button>
                <Button
                  type="submit"
                  disabled={isSending}
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 font-light rounded-sm"
                >
                  {isSending ? copy.submittingButton : copy.submitButton}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center font-light">
                {copy.privacyNote}
              </p>
            </form>
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground font-light">…</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
