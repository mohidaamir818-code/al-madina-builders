import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/data/site";
import { Topbar } from "@/components/Topbar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyDetailView } from "@/components/property-detail/PropertyDetailView";
import {
  getPublishedPropertyBySlug,
  getPublishedPropertySlugs,
} from "@/lib/publicProperties";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedPropertySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug);
  if (!property) {
    return { title: `Property Not Found | ${site.shortName}` };
  }
  return {
    title: `${property.title} – ${property.subtitle} | ${site.shortName}`,
    description: property.description,
  };
}

export default async function PropertySlugPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <>
      <header className="hidden lg:block">
        <Topbar />
        <Navbar />
      </header>
      <PropertyDetailView property={property} />
      <div className="hidden lg:block">
        <Footer />
      </div>
      <div className="lg:hidden pb-16">
        <Footer />
      </div>
    </>
  );
}
