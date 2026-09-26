import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
};

export function Pagination({ page, totalPages, onPage }: PaginationProps) {
  const buttons = [1, 2, 3, 4, 5];

  return (
    <nav className="flex items-center gap-1.5" aria-label="Property pages">
      <button
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded border border-line bg-white text-ink disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {buttons.map((item) => {
        const enabled = item <= Math.max(totalPages, 1);
        return (
          <button
            key={item}
            type="button"
            disabled={!enabled}
            onClick={() => enabled && onPage(item)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded text-sm font-semibold transition-all duration-200",
              page === item ? "bg-primary text-white" : "border border-line bg-white text-ink hover:border-primary",
              !enabled && "opacity-40",
            )}
            aria-current={page === item ? "page" : undefined}
          >
            {item}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="flex h-8 w-8 items-center justify-center rounded border border-line bg-white text-ink disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
