import { Star, UserRound } from "lucide-react";
import type { Feedback } from "@/lib/feedbackStore";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

type TestimonialsProps = {
  reviews: Feedback[];
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function Testimonials({ reviews }: TestimonialsProps) {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <SectionHeader
          label="Testimonials"
          title="What Our Clients Say"
          subtitle="Real feedback from our clients across Multan."
        />

        {reviews.length === 0 ? (
          <div className="mt-10 rounded-[10px] border border-dashed border-line bg-mint px-4 py-12 text-center">
            <UserRound className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 text-sm font-semibold text-ink">Abhi koi review nahi hai</p>
          </div>
        ) : (
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="w-[85%] shrink-0 snap-start rounded-md border border-line bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:w-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-mint text-sm font-bold text-brand">
                    {initials(review.name) || "A"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{review.name}</h3>
                    <p className="flex items-center gap-0.5" aria-label={`${review.rating} star rating`}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-3.5 w-3.5 ${
                            index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-line"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{review.text}</p>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
