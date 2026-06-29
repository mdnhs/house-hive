"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DesignStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isActive?: boolean;
  onActivate?: () => void;
}

export const DESIGN_STYLES = [
  "Modern",
  "Luxury",
  "Minimalist",
  "Classic",
  "Contemporary",
];

export function DesignStyleSelector({
  value,
  onChange,
  isActive = false,
  onActivate,
}: DesignStyleSelectorProps) {
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
      <span className="text-[11px] font-extrabold font-heading tracking-wide text-zinc-900 dark:text-zinc-100">
        Design Style
      </span>
      <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
        {value || "Select Style"}
      </span>
    </div>
  );
}
