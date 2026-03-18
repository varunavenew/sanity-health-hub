import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSanity";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const title = settings?.notFoundTitle || "Siden ble ikke funnet";
  const text = settings?.notFoundText || "Beklager, vi finner ikke siden du leter etter. Den kan ha blitt flyttet eller slettet.";
  const image = settings?.notFoundImage || null;
  const ctaLabel = settings?.notFoundCtaLabel || "Tilbake til forsiden";
  const ctaPath = settings?.notFoundCtaPath || "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-lg px-6">
        {image && (
          <img
            src={image}
            alt=""
            className="w-64 h-48 object-cover rounded-2xl mx-auto mb-8 opacity-80"
          />
        )}
        <p className="text-8xl font-black text-primary/20 mb-4 font-display">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">{text}</p>
        <Button asChild className="rounded-full px-8">
          <Link to={ctaPath}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
