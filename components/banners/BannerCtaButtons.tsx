import type { BannerButton } from "@/data/banners";
import { cn } from "@/lib/cn";

type BannerCtaButtonsProps = {
  buttons: BannerButton[];
  className?: string;
};

export function BannerCtaButtons({ buttons, className }: BannerCtaButtonsProps) {
  if (!buttons.length) return null;

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      {buttons.map((btn, index) => {
        const external = /^https?:\/\//i.test(btn.href) || btn.href.startsWith("mailto:") || btn.href.startsWith("tel:");
        const classes =
          btn.style === "outline"
            ? "inline-flex w-full items-center justify-center gap-2 rounded-md border border-white bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white hover:text-brand sm:w-auto"
            : "inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover sm:w-auto";

        if (external) {
          return (
            <a
              key={`${btn.label}-${index}`}
              href={btn.href}
              target={btn.href.startsWith("http") ? "_blank" : undefined}
              rel={btn.href.startsWith("http") ? "noreferrer" : undefined}
              className={classes}
            >
              {btn.label}
            </a>
          );
        }

        return (
          <a key={`${btn.label}-${index}`} href={btn.href} className={classes}>
            {btn.label}
          </a>
        );
      })}
    </div>
  );
}
