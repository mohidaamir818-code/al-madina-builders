"use client";

import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/nav";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const oswald = Oswald({
  subsets: ["latin"],
  weight: "600",
});

function linkIsActive(href: string, pathname: string) {
  if (href === "/properties") return pathname.startsWith("/properties");
  if (href === "/construction") return pathname.startsWith("/construction");
  if (href === "/house-maps") return pathname.startsWith("/house-maps");
  if (href === "/interior-design") return pathname.startsWith("/interior-design");
  if (href === "/projects") return pathname.startsWith("/projects");
  if (href === "/contact") return pathname.startsWith("/contact");
  if (href === "/about") return pathname.startsWith("/about");
  if (href === "/") return pathname === "/";
  return false;
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 bg-white transition-all duration-200",
        scrolled ? "shadow-sm border-b border-line" : "border-b border-transparent",
      )}
      aria-label="Primary"
    >
      <Container className="flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4 md:h-[72px]">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
          <Image
            src="/logo-al-madina.png"
            alt="Al Madina Builders & Property Advisor logo"
            width={64}
            height={64}
            priority
            className="h-10 w-10 shrink-0 rounded-full object-contain sm:h-14 sm:w-14 md:h-16 md:w-16"
          />
          <span
            className={`${oswald.className} flex min-w-0 flex-col text-[11px] leading-[1.1] font-semibold tracking-wide text-[#0B3B1E] uppercase sm:text-[15px] md:text-xl`}
          >
            <span className="truncate border-b-2 border-green-600 sm:whitespace-nowrap">
              AL MADINA BUILDERS &
            </span>
            <span className="truncate border-b-2 border-green-600 sm:whitespace-nowrap">
              PROPERTY ADVISOR
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-3.5 lg:flex xl:gap-6">
          {navLinks.map((link) => {
            const active = linkIsActive(link.href, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative py-1 text-xs font-medium whitespace-nowrap transition-colors duration-200 hover:text-primary xl:text-[13px]",
                    active ? "text-primary" : "text-ink/80",
                  )}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute right-0 -bottom-1 left-0 h-0.5 rounded-md bg-primary" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact" className="px-3 py-2 text-xs whitespace-nowrap xl:px-5 xl:text-sm">
            Free Consultation
          </Button>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-ink transition-colors duration-200 hover:bg-mint lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <div
        className={cn(
          "fixed inset-0 top-14 z-40 bg-black/40 transition-opacity duration-200 sm:top-16 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div
        id="mobile-menu"
        className={cn(
          "absolute right-0 left-0 z-50 border-t border-line bg-white shadow-sm transition-all duration-200 lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => {
            const active = linkIsActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-sm font-medium transition-colors duration-200 hover:bg-mint hover:text-primary",
                  active ? "text-primary" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Button href="/contact" className="mt-2 w-full" onClick={() => setOpen(false)}>
            Free Consultation
          </Button>
        </Container>
      </div>
    </nav>
  );
}
