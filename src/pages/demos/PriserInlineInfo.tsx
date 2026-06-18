import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Info } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { priceCategories } from "@/data/priceList";

interface PageProps {
  isChatOpen: boolean;
}

const PriserInlineInfo = ({ isChatOpen }: PageProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("fertilitet");
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>("Assistert befruktning");

  const toggleCategory = (id: string) => {
    const newId = expandedCategory === id ? null : id;
    setExpandedCategory(newId);
    const cat = priceCategories.find((c) => c.id === newId);
    setExpandedSubcategory(cat?.subcategories[0]?.label ?? null);
  };

  const toggleSubcategory = (label: string) => {
    setExpandedSubcategory(expandedSubcategory === label ? null : label);
  };

  const prioritized = ["gynekologi", "urologi", "fertilitet", "ortopedi"];
  const ordered = [
    ...priceCategories
      .filter((c) => prioritized.includes(c.id))
      .sort((a, b) => prioritized.indexOf(a.id) - prioritized.indexOf(b.id)),
    ...priceCategories
      .filter((c) => !prioritized.includes(c.id))
      .sort((a, b) => a.label.localeCompare(b.label, "nb")),
  ];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-light text-brand-dark mb-2">
            Prisliste — info under tjenesten
          </h1>
          <p className="text-sm text-muted-foreground font-light mb-8">
            Demo: informasjonstekst vises direkte under hver tjeneste i stedet for i tooltip.
          </p>

          <div className="space-y-3">
            {ordered.map((category) => {
              const isOpen = expandedCategory === category.id;
              const totalItems = category.subcategories.reduce(
                (s, sc) => s + sc.items.length,
                0
              );
              return (
                <div
                  key={category.id}
                  className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isOpen
                      ? "bg-brand-warm border border-brand-dark/20 border-l-[6px] border-l-brand-dark shadow-[0_4px_24px_rgba(66,51,42,0.08)]"
                      : "bg-brand-beige/40 border-brand-dark/10 hover:bg-brand-beige/60"
                  }`}
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-5 md:p-6 gap-4 text-left group transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-xl md:text-2xl font-light truncate transition-colors ${
                          isOpen ? "text-brand-dark" : "text-foreground group-hover:text-foreground/90"
                        }`}
                      >
                        {category.label}
                      </span>
                      <span
                        className={`text-xs font-light mt-1 ${
                          isOpen ? "text-brand-dark/60" : "text-muted-foreground"
                        }`}
                      >
                        {totalItems} tjenester
                      </span>
                    </div>
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all border ${
                        isOpen
                          ? "bg-white text-brand-dark border-brand-dark/10 shadow-sm"
                          : "bg-background text-foreground/80 border-foreground/20 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground"
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-6 md:pb-8">
                          <div className="space-y-2">
                            {category.subcategories.map((sub) => {
                              const subOpen = expandedSubcategory === sub.label;
                              return (
                                <div
                                  key={sub.label}
                                  className={`rounded-xl border transition-all ${
                                    subOpen
                                      ? "bg-brand-beige/30 border-brand-dark/15"
                                      : "bg-white border-brand-dark/20 hover:border-brand-mid/60"
                                  }`}
                                >
                                  <button
                                    onClick={() => toggleSubcategory(sub.label)}
                                    className="w-full flex items-center justify-between py-3 px-3 cursor-pointer text-left"
                                  >
                                    <span
                                      className={`text-[15px] font-light transition-colors ${
                                        subOpen ? "text-foreground" : "text-foreground/80"
                                      }`}
                                    >
                                      {sub.label}
                                    </span>
                                    <div className="flex items-center gap-3">
                                      <span className="text-brand-dark/40 text-sm font-light">
                                        {sub.items.length}
                                      </span>
                                      <ChevronRight
                                        className={`w-4 h-4 text-brand-mid transition-all ${
                                          subOpen ? "rotate-90 text-foreground/80" : ""
                                        }`}
                                      />
                                    </div>
                                  </button>

                                  <AnimatePresence initial={false}>
                                    {subOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="p-3 pt-1 space-y-2">
                                          {sub.items.map((item, idx) => (
                                            <div
                                              key={idx}
                                              className="w-full p-4 rounded-xl border bg-white border-brand-dark/20 shadow-[0_1px_4px_rgba(66,51,42,0.06)] text-left"
                                            >
                                              {/* Top row: name + price + arrow */}
                                              <div className="flex items-center justify-between">
                                                <div className="flex-1 pr-4 min-w-0">
                                                  <span className="block font-normal text-brand-dark">
                                                    {item.name}
                                                  </span>
                                                  <div className="flex items-center gap-3 mt-1 text-sm text-brand-dark/70 font-light flex-wrap">
                                                    <span className="text-brand-dark/85 tabular-nums">
                                                      {item.price === "0,-"
                                                        ? "Gratis"
                                                        : item.price}
                                                    </span>
                                                    {item.duration && (
                                                      <>
                                                        <span className="text-brand-dark/30">
                                                          ·
                                                        </span>
                                                        <span>{item.duration}</span>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                                <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-dark text-brand-warm">
                                                  <ArrowRight className="w-4 h-4" />
                                                </span>
                                              </div>

                                              {/* Inline info text — shown directly under the item */}
                                              {item.info && (
                                                <div className="mt-3 pt-3 border-t border-brand-dark/10">
                                                  <div className="flex items-start gap-2">
                                                    <Info
                                                      className="w-4 h-4 text-brand-dark/50 mt-0.5 shrink-0"
                                                      strokeWidth={1.5}
                                                    />
                                                    <p className="text-xs font-light text-brand-dark/70 leading-relaxed">
                                                      {item.info}
                                                    </p>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-6 pt-5 border-t border-brand-dark/10">
                            <Link
                              to={category.path}
                              className="inline-flex items-center gap-2 text-sm font-light text-brand-dark hover:gap-3 transition-all"
                            >
                              Les mer om {category.label.toLowerCase()}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PriserInlineInfo;
