export type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number;
};

/** Fake reviews removed — use getPublishedFeedbacks() from lib/feedbackStore */
export const testimonials: Testimonial[] = [];
