import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "outlineLight";
  showArrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
};

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover border border-primary",
  outline:
    "bg-transparent text-ink border border-line hover:border-primary hover:text-primary",
  outlineLight:
    "bg-transparent text-white border border-white hover:bg-white hover:text-brand",
};

export function Button({
  href,
  children,
  variant = "primary",
  showArrow = true,
  className,
  type = "button",
  onClick,
  ariaLabel,
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    variants[variant],
    disabled && "pointer-events-none opacity-60",
    className,
  );

  const content = (
    <>
      {children}
      {showArrow ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} aria-label={ariaLabel} disabled={disabled}>
      {content}
    </button>
  );
}
