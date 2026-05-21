import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import urologi from "@/assets/categories/urologi-real.jpg";
import fertilitet from "@/assets/categories/fertilitet-real.jpg";
import gynekologi from "@/assets/categories/gynekologi-real.jpg";
import ortopedi from "@/assets/categories/ortopedi-real.jpg";
import flere from "@/assets/categories/flere-fagomrader.jpg";

const items = [
  { label: "Urologi", to: "/behandlinger/urologi", img: urologi },
  { label: "Fertilitet", to: "/behandlinger/fertilitet", img: fertilitet },
  { label: "Gynekologi", to: "/behandlinger/gynekologi", img: gynekologi },
  { label: "Ortopedi", to: "/behandlinger/ortopedi", img: ortopedi },
  { label: "Flere tjenester", to: "/behandlinger/flere-fagomrader", img: flere },
];

export const ServicesStrip = () => {
  return (
    <section className="bg-brand-light pt-10 md:pt-14 pb-0">
      <div className="container mx-auto px-6 md:px-16 mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-light text-brand-dark">
          Våre tjenester
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="group relative block aspect-[4/5] overflow-hidden"
          >
            <img
              src={item.img}
              alt={item.label}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="text-base md:text-lg font-light">{item.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
