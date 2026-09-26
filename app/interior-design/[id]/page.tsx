import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedInteriorBySlug } from "@/lib/admin/interiorStore";
import { interiorConsultMessage } from "@/data/interiorDesigns";
import { site } from "@/data/site";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function InteriorDesignDetailPage({ params }: Props) {
  const { id } = await params;
  const design = await getPublishedInteriorBySlug(id);
  if (!design) notFound();

  const photos = design.images.length ? design.images : [design.image];
  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `${interiorConsultMessage} — ${design.title}`,
  )}`;

  return (
    <>
      <header>
        <Topbar />
        <Navbar />
      </header>
      <main className="bg-[#F3F6F4] py-10">
        <Container className="max-w-4xl">
          <div className="overflow-hidden rounded-[10px] border border-line bg-white shadow-sm">
            <div className="relative aspect-[16/10]">
              <Image src={photos[0]} alt={design.title} fill priority sizes="100vw" className="object-cover" />
            </div>
            {photos.length > 1 ? (
              <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                {photos.slice(1).map((src) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-[8px]">
                    <Image src={src} alt="" fill sizes="150px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="space-y-3 p-5 sm:p-6">
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">{design.title}</h1>
              <p className="text-sm leading-6 text-muted">{design.description}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-deep"
                >
                  Contact Designer →
                </a>
                <Link
                  href="/interior-design"
                  className="inline-flex h-11 items-center justify-center rounded-[10px] border border-line px-5 text-sm font-semibold text-ink"
                >
                  Back to designs
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
