export type ProcessStep = {
  num?: string;
  title: string;
  desc: string;
};

interface ProcessStepsSectionProps {
  eyebrow?: string;
  title: string;
  steps: ProcessStep[];
  background?: string;
}

/**
 * ProcessStepsSection – nummererte trinn på rad (samme mønster som
 * "Slik bruker du forsikringen" på /forsikring).
 */
export const ProcessStepsSection = ({
  title,
  steps,
  background = "bg-muted/30",
}: ProcessStepsSectionProps) => {
  return (
    <section className={`py-16 md:py-24 ${background}`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-12 text-center">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.num || index} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-lg font-medium">
                    {step.num || String(index + 1)}
                  </span>
                </div>
                <h3 className="font-normal text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
