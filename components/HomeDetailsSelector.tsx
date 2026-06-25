"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HomeDetailsSelectorProps {
  bedrooms: string;
  setBedrooms: (val: string) => void;
  size: string;
  setSize: (val: string) => void;
  isActive?: boolean;
  onActivate?: () => void;
}

export const BEDROOM_OPTIONS = ["1 Bed", "2 Bed", "3 Bed", "4+ Bed"];
export const SIZE_OPTIONS = ["Any", "800+", "1200+", "1500+", "2000+"];

export function HomeDetailsSelector({
  bedrooms,
  setBedrooms,
  size,
  setSize,
  isActive = false,
  onActivate,
}: HomeDetailsSelectorProps) {
  const label = React.useMemo(() => {
    const bedPart = bedrooms ? bedrooms : "";
    const sizePart = size && size !== "Any" ? `${size} sqft` : "";

    if (bedPart && sizePart) {
      return `${bedPart} • ${sizePart}`;
    }
    if (bedPart) {
      return bedPart;
    }
    if (sizePart) {
      return sizePart;
    }
    return "Add details";
  }, [bedrooms, size]);

  return (
    <div
      className={cn(
        "relative flex flex-col justify-center px-6 py-2.5 cursor-pointer transition-all duration-200 select-none rounded-full flex-1 z-20 h-full",
        isActive
          ? "bg-transparent"
          : "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
      )}
      onClick={() => {
        if (onActivate) onActivate();
      }}
    >
      <span className="text-[11px] font-extrabold tracking-wide text-zinc-900 dark:text-zinc-100">
        Home Details
      </span>
      <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
        {label}
      </span>
    </div>
  );
}
