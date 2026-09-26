import { BadgeCheck, Clock, FileText, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";

const items = [
  { title: "Trusted Developers", icon: BadgeCheck },
  { title: "Transparent Process", icon: FileText },
  { title: "On-Time Delivery", icon: Clock },
  { title: "Customer Satisfaction", icon: Star },
];

export function TrustStrip() {
  return (
    <section className="bg-white py-8 lg:py-10">
      <Container>
        <div className="grid grid-cols-2 gap-4 rounded border border-line bg-white p-4 shadow-sm sm:gap-0 lg:grid-cols-4">
          {items.map(({ title, icon: Icon }, index) => (
            <div
              key={title}
              className={`flex flex-col items-center gap-2 px-3 py-3 text-center sm:flex-row sm:justify-center sm:text-left lg:py-2 ${
                index < items.length - 1 ? "lg:border-r lg:border-line" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-xs font-semibold text-ink sm:text-sm">{title}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
