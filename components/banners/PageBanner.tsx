import type { SiteBanner } from "@/lib/admin/bannerStore";
import { BannerImages, resolveBannerImages } from "@/components/banners/BannerImages";
import { cn } from "@/lib/cn";

type PageBannerProps = {
  banner?: SiteBanner | null;
  fallbackImage: string;
  alt: string;
  priority?: boolean;
  /** hero = top of page; section = mid-page promo strip */
  size?: "hero" | "section";
  className?: string;
};

/**
 * Admin-uploaded banner only — mobile vertical, laptop landscape.
 * No hardcoded text / buttons / dark overlays.
 */
export function PageBanner({
  banner,
  fallbackImage,
  alt,
  priority = false,
  size = "hero",
  className,
}: PageBannerProps) {
  const { desktop, mobile } = resolveBannerImages(banner, fallbackImage);
  const isHero = size === "hero";

  return (
    <section className={cn("bg-[#06180e]", className)}>
      {/* Mobile / tablet — vertical */}
      <div className="relative isolate overflow-hidden lg:hidden">
        <div
          className={cn(
            "relative w-full overflow-hidden",
            isHero
              ? "aspect-[3/4] max-h-[82svh] min-h-[440px] sm:aspect-[4/5] sm:max-h-[75svh]"
              : "aspect-[3/4] max-h-[70svh] min-h-[360px] sm:aspect-[4/5] sm:max-h-[65svh]",
          )}
        >
          <BannerImages
            desktopSrc={desktop}
            mobileSrc={mobile}
            alt={alt}
            priority={priority}
            desktopSizes="100vw"
            mobileSizes="100vw"
            mobileClassName="object-cover object-center"
            desktopClassName="object-cover object-center"
          />
        </div>
      </div>

      {/* Laptop / desktop — wide */}
      <div
        className={cn(
          "relative isolate hidden w-full overflow-hidden lg:block",
          isHero
            ? "aspect-[21/9] min-h-[420px] max-h-[720px]"
            : "aspect-[21/8] min-h-[280px] max-h-[480px]",
        )}
      >
        <BannerImages
          desktopSrc={desktop}
          mobileSrc={mobile}
          alt={alt}
          priority={priority}
          desktopSizes="100vw"
          mobileSizes="100vw"
          mobileClassName="object-cover object-center"
          desktopClassName="object-cover object-center"
        />
      </div>
    </section>
  );
}
