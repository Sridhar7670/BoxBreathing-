import { Card } from "@/components/ui/cards";
import "./HowItWorks.styles.css";

export default function HowItWorks() {
  const howItWorksCards = [
    {
      title: "Equal phases",
      description:
        "Inhale, hold, exhale, hold – each the same length, so your breath traces a square instead of racing ahead.",
    },
    {
      title: "Slower rhythm",
      description:
        "At four seconds a side you take about 3-4 breaths a minute, which nudges you out of fight-or-flight.",
    },
    {
      title: "Gentle holds",
      description:
        "Brief breath-holds let carbon dioxide rise slightly, slowing your heart rate and spreading a wave of calm.",
    },
  ];

  const benefitCards = [
    {
      title: "Less stress and anxiety",
      description:
        "Measured breathing lowers cortisol and interrupts racing thoughts.",
    },
    {
      title: "Sharper focus",
      description: "Counting the breath works as a short mindfulness exercise.",
    },
    {
      title: "Lower heart rate",
      description:
        "Activates the rest-and-digest side of your nervous system.",
    },
    {
      title: "Deeper relaxation",
      description: "Muscles unclench, often within a few cycles.",
    },
    {
      title: "Better sleep and mood",
      description: "Useful in the evening or during moments of panic.",
    },
    {
      title: "Anywhere, no gear",
      description: "At a desk, before a talk, or whenever you need a reset.",
    },
  ];

  return (
    <div className="HowItWorks">
      {/* How it works section */}
      <section>
        <h2 className="HowItWorksHeading">How it works</h2>
        <p className="HowItWorksIntro">
          Box breathing slows your breath into a steady, rhythmic cycle with equal
          time in each phase. Keeping the phases balanced holds your oxygen and
          carbon dioxide levels steady and prevents over-breathing.
        </p>
        <div className="HowItWorksGrid">
          {howItWorksCards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      {/* Benefits section */}
      <section>
        <h2 className="BenefitsHeading">Benefits</h2>
        <div className="BenefitsGrid">
          {benefitCards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
