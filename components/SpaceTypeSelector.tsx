"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SpaceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isActive?: boolean;
  onActivate?: () => void;
}

export const SPACE_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Dining",
  "Office",
  "Full Home",
];

export function SpaceTypeSelector({
  value,
  onChange,
  isActive = false,
  onActivate,
}: SpaceTypeSelectorProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col px-6 py-3.5 cursor-pointer transition-all duration-200 select-none rounded-full flex-1 z-20",
        isActive
          ? "bg-transparent"
          : "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
      )}
      onClick={() => {
        if (onActivate) onActivate();
      }}
    >
      <span className="text-[11px] font-extrabold tracking-wide text-zinc-900 dark:text-zinc-100">
        Space Type
      </span>
      <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
        {value || "Select Space"}
      </span>
    </div>
  );
}
