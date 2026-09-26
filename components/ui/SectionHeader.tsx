import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {label ? (
        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase sm:text-sm">
          {label}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("mt-3 text-sm leading-6 sm:text-base", light ? "text-white/70" : "text-muted")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
