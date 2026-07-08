import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEditable } from "@/lib/editable/EditableContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Eye, LogOut } from "lucide-react";

/**
 * /rediger — internal editor entry point.
 *
 * - Not linked from the public site (hidden route).
 * - Not-logged-in visitors get a minimal sign-in card (email + password).
 * - Logged-in team members see a dashboard that toggles inline edit mode
 *   and links to the pilot pages so they can start editing.
 *
 * All look-and-feel uses existing brand tokens (brand-light / brand-dark)
 * — no Lovable branding anywhere.
 */
const Rediger = () => {
  const { user, canEdit, editMode, setEditMode, loading } = useEditable();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Rediger innhold — CMedical";
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Innlogget");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setEditMode(false);
  };

  // Not-logged-in view: clean login card.
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-light px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-light text-brand-dark mb-2">Rediger innhold</h1>
            <p className="text-sm text-brand-dark/70 font-light">
              Intern innlogging for CMedical-teamet.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-brand-dark/70">E-post</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-brand-dark/70">Passord</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
              />
            </div>
            <Button
              type="submit"
              variant="cta"
              className="w-full"
              disabled={busy}
            >
              {busy ? "Logger inn…" : "Logg inn"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  // Logged-in but not permitted.
  if (!loading && !canEdit) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-light px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-light text-brand-dark mb-3">Ingen redigeringstilgang</h1>
          <p className="text-sm text-brand-dark/70 font-light mb-6">
            Kontoen din er logget inn, men har ikke rollen{" "}
            <code className="text-xs">admin</code> eller{" "}
            <code className="text-xs">editor</code>. Kontakt administrator.
          </p>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Logg ut
          </Button>
        </div>
      </main>
    );
  }

  const pilotPages = [
    { path: "/gynekologi", label: "Gynekologi" },
    { path: "/fertilitet", label: "Fertilitet" },
    { path: "/urologi", label: "Urologi" },
    { path: "/ortopedi", label: "Ortopedi" },
    { path: "/graviditet", label: "Graviditet" },
    { path: "/flere-fagomrader", label: "Flere tjenester" },
  ];

  return (
    <main className="min-h-screen bg-brand-light px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-light text-brand-dark mb-2">Rediger innhold</h1>
            <p className="text-sm text-brand-dark/70 font-light">
              Innlogget som <span className="text-brand-dark">{user.email}</span>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Logg ut
          </Button>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-brand-dark">Redigeringsmodus</p>
              <p className="text-xs text-brand-dark/60 font-light">
                Når PÅ vises tynne rammer rundt redigerbar tekst. Klikk for å endre.
              </p>
            </div>
            <Button
              variant={editMode ? "cta" : "outline"}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? <Pencil className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {editMode ? "PÅ" : "AV"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <p className="text-sm text-brand-dark mb-4">Pilot-sider</p>
          <ul className="divide-y divide-brand-dark/10">
            {pilotPages.map((p) => (
              <li key={p.path}>
                <Link
                  to={p.path}
                  className="flex items-center justify-between py-3 text-sm hover:text-brand-dark/70"
                >
                  <span className="text-brand-dark font-light">{p.label}</span>
                  <span className="text-xs text-brand-dark/50">{p.path}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-brand-dark/50 font-light mt-6">
            Flere sider kan enkelt legges til ved å pakke tekst i{" "}
            <code>&lt;Editable field="…" /&gt;</code>.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Rediger;
