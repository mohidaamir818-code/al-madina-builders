"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import type { PropertyDetail } from "@/data/propertyDetails";
import { PropertyGallery } from "@/components/property-detail/PropertyGallery";
import { PropertyVideos } from "@/components/property-detail/PropertyVideos";
import { PropertyTitleBlock } from "@/components/property-detail/PropertyTitleBlock";
import { PropertyStats } from "@/components/property-detail/PropertyStats";
import { PropertyDetailsCard } from "@/components/property-detail/PropertyDetailsCard";
import { PropertyDescription } from "@/components/property-detail/PropertyDescription";
import { KeyFeaturesCard } from "@/components/property-detail/KeyFeaturesCard";
import { PropertyMapSection } from "@/components/property-detail/PropertyMapSection";
import { ChatWithAgentCard } from "@/components/property-detail/ChatWithAgentCard";
import { BottomActionBar } from "@/components/property-detail/BottomActionBar";
import { ScheduleVisitModal } from "@/components/property-detail/ScheduleVisitModal";
import { SendMessageModal } from "@/components/property-detail/SendMessageModal";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type PropertyDetailViewProps = {
  property: PropertyDetail;
};

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);
  const [toast, setToast] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  }, []);

  const onShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const payload = {
      title: property.title,
      text: `${property.title} – ${property.subtitle}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch {
      /* user cancelled */
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast("Unable to copy link");
    }
  }, [property.subtitle, property.title, showToast]);

  const onBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/properties");
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-brand-deep bg-brand text-white lg:hidden">
        <div className="flex h-14 items-center justify-between gap-2 px-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/10"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link href="/" className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <Image
              src="/logo-al-madina.png"
              alt="Al Madina Builders"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
            />
            <span className="truncate text-[10px] font-semibold tracking-wide uppercase sm:text-xs">
              Al Madina Builders & Property Advisor
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFavorite((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/10"
              aria-label={favorite ? "Remove favorite" : "Save favorite"}
            >
              <Heart className={cn("h-5 w-5", favorite && "fill-red-500 text-red-500")} />
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/10"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="bg-[#F3F6F4] pb-24 lg:pb-28">
        <Container className="py-4 lg:py-8">
          {/* Desktop favorite / share tools */}
          <div className="mb-4 hidden items-center justify-end gap-2 lg:flex">
            <button
              type="button"
              onClick={() => setFavorite((v) => !v)}
              className="inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-semibold text-ink hover:border-primary"
            >
              <Heart className={cn("h-4 w-4", favorite && "fill-red-500 text-red-500")} />
              {favorite ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-semibold text-ink hover:border-primary"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)] lg:gap-6">
            <div className="space-y-4">
              <PropertyGallery images={property.images} title={property.title} status={property.status} />
              <PropertyVideos videos={property.videos} title={property.title} />
              <PropertyTitleBlock
                title={property.title}
                subtitle={property.subtitle}
                price={property.price}
                negotiable={property.negotiable}
                fullAddress={property.fullAddress}
              />
              <div className="lg:hidden">
                <PropertyStats stats={property.stats} />
              </div>
              <div className="lg:hidden">
                <PropertyDetailsCard details={property.details} />
              </div>
              <PropertyDescription text={property.description} />
              <KeyFeaturesCard features={property.keyFeatures} />
              <PropertyMapSection
                title={property.title}
                address={property.fullAddress}
                lat={property.mapCoordinates.lat}
                lng={property.mapCoordinates.lng}
                mapsLink={property.mapsLink}
              />
              <div className="lg:hidden">
                <ChatWithAgentCard
                  title={property.title}
                  whatsappNumber={property.whatsappNumber}
                  onSendMessage={() => setMessageOpen(true)}
                />
              </div>
            </div>

            <aside className="hidden space-y-4 lg:block">
              <div className="sticky top-24 space-y-4">
                <PropertyStats stats={property.stats} />
                <PropertyDetailsCard details={property.details} />
                <ChatWithAgentCard
                  title={property.title}
                  whatsappNumber={property.whatsappNumber}
                  onSendMessage={() => setMessageOpen(true)}
                />
              </div>
            </aside>
          </div>
        </Container>
      </main>

      <BottomActionBar
        callNumber={property.callNumber}
        callDisplay={property.callDisplay}
        onSchedule={() => setScheduleOpen(true)}
      />

      <ScheduleVisitModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        propertyTitle={property.title}
      />
      <SendMessageModal
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        propertyTitle={property.title}
      />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}
