import Link from "next/link";
import { notFound } from "next/navigation";
import { showcaseProjects, projectConsultMessage } from "@/data/showcaseProjects";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = showcaseProjects.find((item) => item.id === id);
  if (!project) notFound();

  const whatsapp = `https://wa.me/923056767965?text=${encodeURIComponent(
    `${projectConsultMessage} — ${project.title}`,
  )}`;

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4] py-12">
        <Container className="max-w-3xl rounded border border-line bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">{project.status}</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{project.title}</h1>
          <p className="mt-2 text-sm text-muted">{project.location}</p>
          <p className="mt-4 text-2xl font-bold text-primary">{project.price}</p>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {project.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-muted">
            Full project details page is coming next. Contact Al Madina Builders on WhatsApp for files, visit and
            booking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              WhatsApp Inquiry
            </a>
            <Link
              href="/projects"
              className="inline-flex items-center rounded border border-line px-5 py-2.5 text-sm font-semibold text-ink"
            >
              Back to projects
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
