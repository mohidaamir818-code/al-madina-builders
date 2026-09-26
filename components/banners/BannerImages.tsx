import Image from "next/image";
import { cn } from "@/lib/cn";

type BannerImagesProps = {
  desktopSrc: string;
  mobileSrc?: string | null;
  alt: string;
  /** Classes for the desktop image element */
  desktopClassName?: string;
  /** Classes for the mobile image element */
  mobileClassName?: string;
  /** Wrapper for desktop (e.g. absolute fill). Pass null to render images only. */
  fill?: boolean;
  priority?: boolean;
  desktopSizes?: string;
  mobileSizes?: string;
  className?: string;
};

function isRemote(src: string) {
  return src.includes("supabase") || src.startsWith("data:") || src.startsWith("http");
}

/**
 * Renders separate mobile + desktop banner images.
 * Mobile shows below `lg` by default; desktop from `lg` up.
 * Falls back to desktop image on mobile if no mobile upload.
 */
export function BannerImages({
  desktopSrc,
  mobileSrc,
  alt,
  desktopClassName,
  mobileClassName,
  fill = true,
  priority,
  desktopSizes = "100vw",
  mobileSizes = "100vw",
  className,
}: BannerImagesProps) {
  const mobile = (mobileSrc || "").trim() || desktopSrc;
  const dual = Boolean(mobileSrc?.trim() && mobileSrc.trim() !== desktopSrc);

  if (fill) {
    return (
      <>
        <Image
          src={mobile}
          alt={alt}
          fill
          priority={priority}
          sizes={mobileSizes}
          className={cn(dual ? "object-cover lg:hidden" : "object-cover", mobileClassName, !dual && className)}
          unoptimized={isRemote(mobile)}
        />
        {dual ? (
          <Image
            src={desktopSrc}
            alt={alt}
            fill
            priority={priority}
            sizes={desktopSizes}
            className={cn("hidden object-cover lg:block", desktopClassName, className)}
            unoptimized={isRemote(desktopSrc)}
          />
        ) : null}
      </>
    );
  }

  return (
    <div className={className}>
      <Image
        src={mobile}
        alt={alt}
        width={1200}
        height={900}
        priority={priority}
        sizes={mobileSizes}
        className={cn(dual ? "h-full w-full object-cover lg:hidden" : "h-full w-full object-cover", mobileClassName)}
        unoptimized={isRemote(mobile)}
      />
      {dual ? (
        <Image
          src={desktopSrc}
          alt={alt}
          width={1920}
          height={900}
          priority={priority}
          sizes={desktopSizes}
          className={cn("hidden h-full w-full object-cover lg:block", desktopClassName)}
          unoptimized={isRemote(desktopSrc)}
        />
      ) : null}
    </div>
  );
}

export function resolveBannerImages(
  banner: { imageUrl?: string; mobileImageUrl?: string } | null | undefined,
  fallbackDesktop: string,
  fallbackMobile?: string,
) {
  const desktop = banner?.imageUrl?.trim() || fallbackDesktop;
  const mobile = banner?.mobileImageUrl?.trim() || fallbackMobile || desktop;
  return { desktop, mobile };
}
