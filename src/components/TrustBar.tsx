import { ShieldCheck, Users, MapPin, UserRound } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Independent Brokerage", label: "Objective Guidance" },
  { icon: Users, title: "Family Owned", label: "Built on Trust" },
  {
    icon: MapPin,
    title: "Final Expense Service Area",
    states: ["Florida", "Georgia", "Michigan", "North Carolina", "Ohio", "South Carolina", "Tennessee", "Texas"],
  },
  { icon: UserRound, title: "Client-First", label: "Your Needs First" },
];

const TrustBar = () => {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 py-8 md:py-10 md:px-8 justify-center md:justify-start"
            >
              <item.icon className="w-7 h-7 text-primary shrink-0" strokeWidth={1.3} />
              <div>
                <p className="font-serif text-lg md:text-xl text-white leading-tight">
                  {item.title}
                </p>
                {item.states ? (
                  <p className="mt-1 font-sans text-xs leading-relaxed text-white/75">
                    {item.states.join(", ")}
                  </p>
                ) : (
                  <p className="text-[0.65rem] tracking-[0.25em] uppercase font-sans text-white/55 mt-1">
                    {item.label}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
