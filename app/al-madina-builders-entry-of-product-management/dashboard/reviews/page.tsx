import { AdminReviewsPage } from "@/components/admin/AdminReviewsPage";
import { listFeedbacks } from "@/lib/feedbackStore";

export const dynamic = "force-dynamic";

export default async function AdminReviewsRoute() {
  const feedbacks = await listFeedbacks().catch(() => []);
  return <AdminReviewsPage initialFeedbacks={feedbacks} />;
}
