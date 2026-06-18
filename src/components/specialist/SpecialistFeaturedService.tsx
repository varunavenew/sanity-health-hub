import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Specialist } from "@/data/specialists";

import fertilityHero from "@/assets/hero/fertility-hero.jpg";
import gynecologyHero from "@/assets/hero/gynecology-hero.jpg";
import clinicHero from "@/assets/hero/cmedical-clinic.jpg";

type CategoryConfig = {
  label: string;
  href: string;
  image: string;
  description: string;
  bullets: string[];
};

const CONFIG: Record<string, CategoryConfig> = {
  fertilitet: {
    label: "Fertilitetsutredning og behandling",
    href: "/behandlinger/fertilitet",
    image: fertilityHero,
    description:
      "Et helhetlig forløp med utredning, behandling og oppfølging hos egen spesialist. Ingen henvisning nødvendig — typisk 1–3 uker fra første time til oppstart.",
    bullets: [
      "Pris fra 2 900 kr for førstegangskonsultasjon",
      "Dekkes av de fleste helseforsikringer",
      "Konsultasjon innen 1–3 dager",
    ],
  },
  gynekologi: {
    label: "Gynekologisk utredning",
    href: "/behandlinger/gynekologi",
    image: gynecologyHero,
    description:
      "Grundig samtale og undersøkelse hos erfaren gynekolog. Ingen henvisning nødvendig — du får ofte time innen få dager.",
    bullets: [
      "Pris fra 2 500 kr",
      "Dekkes av de fleste helseforsikringer",
      "Konsultasjon innen 1–3 dager",
    ],
  },
  urologi: {
    label: "Urologisk utredning",
    href: "/behandlinger/urologi",
    image: clinicHero,
    description:
      "Et komplett forløp med konsultasjon, utredning og behandling hos urolog. Ingen henvisning nødvendig.",
    bullets: [
      "Pris fra 2 500 kr",
      "Dekkes av de fleste helseforsikringer",
      "Konsultasjon innen 1–3 dager",
    ],
  },
  ortopedi: {
    label: "Ortopedisk vurdering",
    href: "/behandlinger/ortopedi",
    image: clinicHero,
    description:
      "Et komplett forløp med konsultasjon, operasjon og oppfølging hos fysioterapeut. Ingen henvisning nødvendig — typisk 3–6 uker fra første time til inngrep.",
    bullets: [
      "Pris fra 2 500 kr",
      "Dekkes av de fleste helseforsikringer",
      "Konsultasjon innen 10 dager",
    ],
  },
  annet: {
    label: "Konsultasjon og utredning",
    href: "/tjenester",
    image: clinicHero,
    description:
      "Et trygt forløp hos erfaren spesialist. Ingen henvisning nødvendig — kort ventetid og personlig oppfølging.",
    bullets: [
      "Dekkes av de fleste helseforsikringer",
      "Kort ventetid",
      "Personlig oppfølging",
    ],
  },
};

interface Props {
  specialist: Specialist;
}

/**
 * "Tjenesten i denne saken" — featured-service teaser shown below the bio.
 * Image right, text left, editorial two-column.
 */
export const SpecialistFeaturedService = ({ specialist }: Props) => {
  const cfg = CONFIG[specialist.category] || CONFIG.annet;

  return (
    <section className="bg-brand-light py-16 md:py-24 border-t border-foreground/10">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] mb-5">
              {cfg.label}
            </h2>
            <p className="text-base font-light text-foreground/80 leading-relaxed max-w-md mb-7">
              {cfg.description}
            </p>
            <ul className="space-y-2 mb-8">
              {cfg.bullets.map((b) => (
                <li key={b} className="text-sm font-light text-foreground/75">
                  · {b}
                </li>
              ))}
            </ul>
            <Link
              to={cfg.href}
              className="inline-flex items-center gap-2 text-sm font-normal text-foreground border-b border-foreground pb-1 hover:gap-3 transition-all"
            >
              Se hele tjenesten
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] overflow-hidden rounded-sm"
          >
            <img
              src={cfg.image}
              alt={cfg.label}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
