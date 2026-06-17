import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

interface PageProps { isChatOpen?: boolean }

const groups = [
 {
 title: "Gynekologi",
 items: [
 { to: "/gynekologi-design/editorial", name: "Gynekologi — Editorial" },
 { to: "/gynekologi-design/journey", name: "Gynekologi — Reisen" },
 { to: "/gynekologi-design/atelier", name: "Gynekologi — Atelier" },
 { to: "/gynekologi-design/index", name: "Gynekologi — Index" },
 { to: "/gynekologi-design/klassisk-plus", name: "Gynekologi — Klassisk+" },
 ],
 },
 {
 title: "Fertilitet",
 items: [
 { to: "/fertilitet-design/fertilitet/editorial", name: "Fertilitet — Editorial" },
 { to: "/fertilitet-design/fertilitet/journey", name: "Fertilitet — Reisen" },
 { to: "/fertilitet-design/fertilitet/atelier", name: "Fertilitet — Atelier" },
 { to: "/fertilitet-design/fertilitet/dialog", name: "Fertilitet — Dialog" },
 { to: "/fertilitet-design/fertilitet/magasin", name: "Fertilitet — Magasin" },
 { to: "/fertilitet-design/fertilitet/klinikk", name: "Fertilitet — Klinikk" },
 ],
 },
 {
 title: "Fertilitetssjekk",
 items: [
 { to: "/fertilitet-design/fertilitetssjekk/editorial", name: "Fertilitetssjekk — Editorial" },
 { to: "/fertilitet-design/fertilitetssjekk/journey", name: "Fertilitetssjekk — Reisen" },
 { to: "/fertilitet-design/fertilitetssjekk/atelier", name: "Fertilitetssjekk — Atelier" },
 { to: "/fertilitet-design/fertilitetssjekk/dialog", name: "Fertilitetssjekk — Dialog" },
 { to: "/fertilitet-design/fertilitetssjekk/magasin", name: "Fertilitetssjekk — Magasin" },
 { to: "/fertilitet-design/fertilitetssjekk/klinikk", name: "Fertilitetssjekk — Klinikk" },
 ],
 },
 {
 title: "Spesialistprofil",
 items: [
 { to: "/spesialist-design/editorial", name: "Spesialist — Forslag 1" },
 { to: "/spesialist-design/klinisk", name: "Spesialist — Forslag 2" },
 { to: "/spesialist-design/atelier", name: "Spesialist — Forslag 3" },
 ],
 },
 {
 title: "Hjemmeside",
 items: [
 { to: "/hjem-demo/blend", name: "Hjem — Mørk tonal blend" },
 { to: "/hjem-demo/overlap", name: "Hjem — Overlappende kortgrid" },
 { to: "/hjem-demo/kutt", name: "Hjem — Asymmetrisk kutt" },
 ],
 },
];

const DemoOversikt = ({ isChatOpen = false }: PageProps) => {
 useEffect(() => {
 document.title = "Designdemoer · CMedical";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <section className="bg-brand-warm pt-32 md:pt-40 pb-16 md:pb-20">
 <div className="container mx-auto px-6 md:px-16 max-w-5xl">
 <h1 className="text-4xl md:text-6xl font-light text-foreground leading-[1.05] tracking-tight mb-6">
 Alle demoer på ett sted
 </h1>
 <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
 En kuratert oversikt over alle designforslag for fagområde- og underområdesider.
 Klikk på en variant for å se den i full visning.
 </p>
 </div>
 </section>

 <section className="bg-background pb-24 md:pb-32">
 <div className="container mx-auto px-6 md:px-16 max-w-5xl">
 <div className="space-y-16 md:space-y-20">
 {groups.map((g) => (
 <div key={g.title}>
  <div className="border-b border-border/60 pb-4 mb-6">
 <h2 className="text-2xl md:text-3xl font-light text-foreground">{g.title}</h2>
 </div>
 <ul className="divide-y divide-border/60">
 {g.items.map((it) => (
 <li key={it.to}>
 <Link
 to={it.to}
 className="group flex items-center justify-between py-5 hover:px-2 transition-all duration-300"
 >
 <span className="text-base md:text-lg font-light text-foreground">
 {it.name}
 </span>
 <ArrowUpRight
 className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
 strokeWidth={1.5}
 />
 </Link>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </div>
 </section>
 </PageLayout>
 );
};

export default DemoOversikt;
