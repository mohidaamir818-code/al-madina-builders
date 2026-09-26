import { MessageCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

const PLACEHOLDER = [
  { id: 1, name: "Ali Raza", preview: "Is the DHA house still available?", time: "2h ago" },
  { id: 2, name: "Sara Khan", preview: "Need visit for Bahria Town plot.", time: "Yesterday" },
  { id: 3, name: "Usman", preview: "Installment options for 7 Marla?", time: "2 days ago" },
];

export default function AdminMessagesPage() {
  return (
    <AdminShell messageCount={PLACEHOLDER.length}>
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-ink">Messages</h1>
        <p className="mt-1 text-sm text-muted">Placeholder inbox — wire to a real mailbox later.</p>
        <ul className="mt-4 space-y-2">
          {PLACEHOLDER.map((msg) => (
            <li
              key={msg.id}
              className="flex items-start gap-3 rounded-md border border-line bg-white p-3 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-primary">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-ink">{msg.name}</p>
                  <span className="text-[11px] text-muted">{msg.time}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{msg.preview}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
