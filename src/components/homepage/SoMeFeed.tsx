import { Instagram, Linkedin, ExternalLink } from "lucide-react";

// Mock social media posts – will be replaced with real API integration
const mockPosts = [
  {
    id: "1",
    platform: "instagram" as const,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop",
    caption: "Vårt team er klare for en ny uke med å hjelpe pasienter! 💛 #CMedical #Kvinnehelse",
    date: "2 dager siden",
    likes: 124,
    url: "https://instagram.com/cmedical",
  },
  {
    id: "2",
    platform: "linkedin" as const,
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=400&fit=crop",
    caption: "Vi er stolte av å annonsere vår nye robotassisterte kirurgienhet. Les mer om hvordan dette gjør behandlingen tryggere.",
    date: "4 dager siden",
    likes: 89,
    url: "https://linkedin.com/company/cmedical",
  },
  {
    id: "3",
    platform: "instagram" as const,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
    caption: "Visste du at vi tilbyr uforpliktende telefonsamtaler med sykepleier om fertilitet? Helt gratis 🤍",
    date: "5 dager siden",
    likes: 201,
    url: "https://instagram.com/cmedical",
  },
  {
    id: "4",
    platform: "instagram" as const,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    caption: "Møt vår nye gynekolog som har spesialisering innen endometriose. Velkommen til teamet! 🩺",
    date: "1 uke siden",
    likes: 156,
    url: "https://instagram.com/cmedical",
  },
  {
    id: "5",
    platform: "linkedin" as const,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    caption: "CMedical deltar på Nordens største konferanse for reproduksjonsmedisin. Spennende dager!",
    date: "1 uke siden",
    likes: 67,
    url: "https://linkedin.com/company/cmedical",
  },
  {
    id: "6",
    platform: "instagram" as const,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=400&fit=crop",
    caption: "Trygge omgivelser for deg og din familie. Velkommen til våre nyrenoverte lokaler på Majorstuen ✨",
    date: "2 uker siden",
    likes: 312,
    url: "https://instagram.com/cmedical",
  },
];

const PlatformIcon = ({ platform }: { platform: "instagram" | "linkedin" }) => {
  if (platform === "instagram") return <Instagram className="w-4 h-4" />;
  return <Linkedin className="w-4 h-4" />;
};

export const SoMeFeed = () => {
  return (
    <section className="py-10 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8 max-w-6xl mx-auto">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-light">Følg oss</p>
            <h2 className="text-2xl md:text-3xl font-light text-foreground">
              Fra våre sosiale medier
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/cmedical"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden md:inline">Instagram</span>
            </a>
            <a
              href="https://linkedin.com/company/cmedical"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden md:inline">LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
          {mockPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-sm overflow-hidden bg-secondary"
            >
              <img
                src={post.image}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                  <PlatformIcon platform={post.platform} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs line-clamp-2 font-light">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
