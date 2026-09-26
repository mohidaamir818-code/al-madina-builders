"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/nav";
import { cn } from "@/lib/cn";

export function FooterQuickLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/house-maps") return pathname.startsWith("/house-maps");
    if (href === "/interior-design") return pathname.startsWith("/interior-design");
    if (href === "/properties") return pathname.startsWith("/properties");
    if (href === "/construction") return pathname.startsWith("/construction");
    if (href === "/projects") return pathname.startsWith("/projects");
    if (href === "/contact") return pathname.startsWith("/contact");
    if (href === "/about") return pathname.startsWith("/about");
    return false;
  };

  return (
    <ul className="mt-4 space-y-2 text-sm text-white/70">
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={cn(
              "transition-colors duration-200 hover:text-primary-bright",
              isActive(link.href) ? "font-semibold text-primary-bright" : "",
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/house-maps"
          className={cn(
            "transition-colors duration-200 hover:text-primary-bright",
            pathname.startsWith("/house-maps") ? "font-semibold text-primary-bright" : "",
          )}
        >
          House Plans
        </Link>
      </li>
    </ul>
  );
}
