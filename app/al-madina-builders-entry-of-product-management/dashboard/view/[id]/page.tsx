import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_STATUS_COLORS } from "@/data/adminProperties";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { getAdminProperty } from "@/lib/admin/propertyStore";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ id: string }> };

export default async function AdminViewPropertyRoute({ params }: Props) {
  const { id } = await params;
  const property = await getAdminProperty(id);
  if (!property) notFound();
  const colors = ADMIN_STATUS_COLORS[property.status];

  return (
    <AdminShell>
      <div className="space-y-4 px-4 py-4">
        <Link href={`${ADMIN_BASE}/dashboard`} className="text-sm font-semibold text-primary">
          ← Back to list
        </Link>
        <div className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
          <div className="relative aspect-[16/10]">
            <Image src={property.image} alt={property.title} fill className="object-cover" sizes="100vw" />
            <span
              className={cn(
                "absolute top-3 left-3 rounded px-2 py-1 text-[11px] font-semibold text-white",
                colors.badge,
              )}
            >
              {property.status}
            </span>
          </div>
          <div className="p-4">
            <h1 className="text-xl font-bold text-ink">{property.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <MapPin className="h-4 w-4 text-primary" />
              {property.location}
            </p>
            <p className="mt-3 text-2xl font-bold text-primary">{property.price}</p>
            <p className="mt-2 text-sm text-muted">
              {property.beds} Beds · {property.baths} Baths · {property.area}
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">{property.description}</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
