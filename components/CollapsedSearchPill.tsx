"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsedSearchPillProps {
  searchType: "Flat" | "Interior";
  onClick: () => void;
  // Selected values to show dynamically
  location?: string;
  budget?: string;
  bedrooms?: string;
  size?: string;
  spaceType?: string;
  designStyle?: string;
}

export function CollapsedSearchPill({
  searchType,
  onClick,
  location = "",
  budget = "Any Budget",
  bedrooms = "",
  size = "",
  spaceType = "",
  designStyle = "",
}: CollapsedSearchPillProps) {
  
  // Format location label
  const locationLabel = React.useMemo(() => {
    if (!location) return "Anywhere";
    return location.split(" ")[0] || "Anywhere"; // Show short area name
  }, [location]);

  // Format second label
  const secondLabel = React.useMemo(() => {
    if (searchType === "Flat") {
      return budget && budget !== "Any Budget" ? budget : "Any budget";
    } else {
      return spaceType ? spaceType : "Space type";
    }
  }, [searchType, budget, spaceType]);

  // Format third label
  const thirdLabel = React.useMemo(() => {
    if (searchType === "Flat") {
      const bedPart = bedrooms ? bedrooms : "";
      const sizePart = size && size !== "Any" ? size : "";
      if (bedPart && sizePart) return `${bedPart}, ${sizePart}`;
      if (bedPart) return bedPart;
      if (sizePart) return sizePart;
      return "Add details";
    } else {
      return designStyle ? designStyle : "Style type";
    }
  }, [searchType, bedrooms, size, designStyle]);

  return (
    <button
      onClick={onClick}
      className="flex items-center h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.06)] hover:scale-[1.01] transition-all duration-200 pl-6 pr-2 cursor-pointer select-none max-w-md w-full sm:w-auto"
    >
      <div className="flex items-center text-xs font-bold text-zinc-900 dark:text-zinc-50 shrink-0">
        <span className="truncate max-w-[80px]">{locationLabel}</span>
      </div>

      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-4 shrink-0" />

      <div className="flex items-center text-xs font-bold text-zinc-900 dark:text-zinc-50 shrink-0">
        <span className={cn("truncate max-w-[90px]", (!budget || budget === "Any Budget") && searchType === "Flat" && "text-zinc-500 font-medium")}>
          {secondLabel}
        </span>
      </div>

      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-4 shrink-0" />

      <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
        <span className="truncate max-w-[100px]">{thirdLabel}</span>
      </div>

      {/* Small Red/Rose Search Circle Icon */}
      <div className="ml-4 flex items-center justify-center size-8 rounded-full bg-[#FF385C] text-white shrink-0">
        <Search className="size-4 stroke-[2.5]" />
      </div>
    </button>
  );
}
