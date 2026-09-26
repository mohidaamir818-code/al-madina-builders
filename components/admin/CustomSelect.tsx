"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_PREFIX = "amb-admin-select-options:";

type CustomSelectProps = {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  optionsKey: string;
  presetOptions: string[];
  placeholder?: string;
  error?: boolean;
};

function loadCustom(optionsKey: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + optionsKey);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustom(optionsKey: string, options: string[]) {
  localStorage.setItem(STORAGE_PREFIX + optionsKey, JSON.stringify(options));
}

export function CustomSelect({
  label,
  required,
  value,
  onChange,
  optionsKey,
  presetOptions,
  placeholder = "Select",
  error,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustom(loadCustom(optionsKey));
    void fetch("/api/admin/select-options")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { options?: Record<string, string[]> } | null) => {
        const server = data?.options?.[optionsKey];
        if (!server?.length) return;
        setCustom((prev) => {
          const merged = [...prev];
          for (const item of server) {
            if (!merged.some((o) => o.toLowerCase() === item.toLowerCase())) merged.push(item);
          }
          saveCustom(optionsKey, merged);
          return merged;
        });
      })
      .catch(() => undefined);
  }, [optionsKey]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setAdding(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const options = useMemo(() => {
    const merged = [...presetOptions];
    for (const item of custom) {
      if (!merged.some((o) => o.toLowerCase() === item.toLowerCase())) merged.push(item);
    }
    if (value && !merged.some((o) => o.toLowerCase() === value.toLowerCase())) {
      merged.push(value);
    }
    return merged;
  }, [presetOptions, custom, value]);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  const confirmCustom = () => {
    const next = draft.trim();
    if (!next) return;
    const existing = options.find((o) => o.toLowerCase() === next.toLowerCase());
    if (existing) {
      onChange(existing);
    } else {
      const updated = [...custom, next];
      setCustom(updated);
      saveCustom(optionsKey, updated);
      onChange(next);
      // Persist to server (best-effort)
      void fetch("/api/admin/select-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: optionsKey, option: next }),
      });
    }
    setDraft("");
    setAdding(false);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-1 block text-xs font-medium text-ink">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded border bg-white px-3 text-left text-sm",
          error ? "border-red-400" : "border-line",
          !value && "text-muted",
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
      </button>

      {open ? (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded border border-line bg-white shadow-lg">
          <div className="relative border-b border-line p-2">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-9 w-full rounded border border-line pl-8 pr-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setQuery("");
                    setAdding(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-mint",
                    value === opt && "bg-mint font-semibold text-brand",
                  )}
                >
                  {opt}
                  {value === opt ? <Check className="h-4 w-4 text-primary" /> : null}
                </button>
              </li>
            ))}
            {!filtered.length ? (
              <li className="px-3 py-2 text-xs text-muted">No matches</li>
            ) : null}
          </ul>
          <div className="border-t border-line p-2">
            {adding ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      confirmCustom();
                    }
                  }}
                  placeholder="Type custom option"
                  className="h-9 flex-1 rounded border border-line px-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={confirmCustom}
                  className="rounded bg-primary px-3 text-xs font-semibold text-white"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex w-full items-center justify-center gap-1 rounded border border-dashed border-primary px-2 py-2 text-xs font-semibold text-primary hover:bg-mint"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Custom Option
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
