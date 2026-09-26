"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Home,
  HousePlus,
  ImagePlus,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { cn } from "@/lib/cn";

type AdminShellProps = {
  children: React.ReactNode;
  messageCount?: number;
};

export function AdminShell({ children, messageCount = 3 }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const logout = async () => {
    await fetch("/api/admin/session", { method: "POST" });
    router.replace(ADMIN_BASE);
  };

  const nav = [
    { href: `${ADMIN_BASE}/dashboard`, label: "Home", icon: Home },
    { href: `${ADMIN_BASE}/dashboard`, label: "Properties", icon: HousePlus, match: "properties" },
    { href: `${ADMIN_BASE}/add-property`, label: "Add Property", icon: Plus, center: true },
    { href: `${ADMIN_BASE}/dashboard/messages`, label: "Messages", icon: MessageCircle, badge: messageCount },
    { href: `${ADMIN_BASE}/dashboard/profile`, label: "Profile", icon: UserRound },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6F4] pb-24">
      <header className="sticky top-0 z-40 bg-brand text-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/logo-al-madina.png"
              alt="Al Madina Builders"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold tracking-wide uppercase sm:text-xs">
                Al Madina Builders & Property Advisor
              </p>
              <p className="font-script text-sm text-white/90 italic">Your Trusted Partner in Real Estate</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute top-0 right-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-bold text-ink">Menu</p>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-3">
              <Link
                href={`${ADMIN_BASE}/dashboard/reviews`}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2.5 text-sm font-medium text-ink hover:bg-mint"
              >
                Approve Reviews
              </Link>
              <Link
                href={`${ADMIN_BASE}/dashboard/deal-alerts`}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2.5 text-sm font-medium text-ink hover:bg-mint"
              >
                Deal Alert Subscribers
              </Link>
              <Link
                href={`${ADMIN_BASE}/dashboard/banners`}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2.5 text-sm font-medium text-ink hover:bg-mint"
              >
                Manage Banners
              </Link>
              <Link
                href={`${ADMIN_BASE}/dashboard/profile`}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2.5 text-sm font-medium text-ink hover:bg-mint"
              >
                Profile & password
              </Link>
              <Link
                href={`${ADMIN_BASE}/dashboard/messages`}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2.5 text-sm font-medium text-ink hover:bg-mint"
              >
                Messages
              </Link>
              <button
                type="button"
                onClick={logout}
                className="mt-auto inline-flex items-center gap-2 rounded px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <ul className="mx-auto flex max-w-5xl items-end justify-between px-2 py-1.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              item.label === "Properties" || item.label === "Home"
                ? pathname === `${ADMIN_BASE}/dashboard`
                : pathname.startsWith(item.href);
            if (item.center) {
              return (
                <li key={item.label} className="-mt-5">
                  <Link
                    href={item.href}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-md"
                    aria-label={item.label}
                  >
                    <Icon className="h-6 w-6" />
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.label} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "relative mx-auto flex w-full max-w-[72px] flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] font-medium",
                    active ? "bg-[#EAF7EE] text-brand" : "text-muted",
                  )}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                    {item.badge ? (
                      <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
