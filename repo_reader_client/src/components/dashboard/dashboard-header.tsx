import { RefreshCw, Search } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { IndexStatus } from "@/lib/api";

type FilterStatus = "ALL" | IndexStatus;

type DashboardHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  visibility: "all" | "public" | "private";
  onVisibilityChange: (value: "all" | "public" | "private") => void;
  status: FilterStatus;
  onStatusChange: (value: FilterStatus) => void;
  totalCount?: number;
  readyCount?: number;
  onSync: () => void;
  isSyncing?: boolean;
};

const visibilityFilters = [
  { value: "all" as const, label: "All" },
  { value: "public" as const, label: "Public" },
  { value: "private" as const, label: "Private" },
];

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "READY", label: "Ready" },
  { value: "INDEXING", label: "Indexing" },
  { value: "PENDING", label: "New" },
  { value: "FAILED", label: "Failed" },
];

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-foreground/20 bg-foreground text-background shadow-sm"
          : "border-dashed border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function DashboardHeader({
  search,
  onSearchChange,
  visibility,
  onVisibilityChange,
  status,
  onStatusChange,
  totalCount,
  readyCount,
  onSync,
  isSyncing,
}: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 border-b border-border/60 px-3 sm:px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-5" />
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate font-heading text-sm font-semibold sm:text-base">
              Repositories
            </h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {totalCount != null
                ? `${totalCount} connected · ${readyCount ?? 0} ready`
                : "Sync and index a repo to start chatting"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-dashed shadow-sm"
              onClick={onSync}
              disabled={isSyncing}
            >
              <RefreshCw
                data-icon="inline-start"
                className={isSyncing ? "animate-spin" : undefined}
              />
              <span className="hidden sm:inline">Sync</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-3 py-3 sm:px-4 md:px-6 md:py-4">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repositories…"
            className="border-dashed bg-background pl-9 shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-muted-foreground">
              Visibility
            </span>
            {visibilityFilters.map((filter) => (
              <FilterPill
                key={filter.value}
                active={visibility === filter.value}
                onClick={() => onVisibilityChange(filter.value)}
              >
                {filter.label}
              </FilterPill>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-muted-foreground">
              Status
            </span>
            {statusFilters.map((filter) => (
              <FilterPill
                key={filter.value}
                active={status === filter.value}
                onClick={() => onStatusChange(filter.value)}
              >
                {filter.label}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
