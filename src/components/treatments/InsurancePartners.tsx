const insurancePartners = [
  "Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika",
];

export const InsurancePartners = () => {
  return (
    <section className="bg-brand-light text-foreground py-14 md:py-16 border-t border-brand-dark/10">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <h3 className="text-xl md:text-2xl font-light leading-snug text-foreground">
              Vi har avtale med de største forsikringsselskapene i Norge.
            </h3>
          </div>
          <div className="lg:col-span-8">
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-brand-dark/10">
              {insurancePartners.map((name) => (
                <li
                  key={name}
                  className="border-b border-brand-dark/10 [&:not(:nth-child(2n))]:border-r sm:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(4n))]:border-r border-brand-dark/10 py-4 px-4 text-sm font-light text-foreground/85"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsurancePartners;
