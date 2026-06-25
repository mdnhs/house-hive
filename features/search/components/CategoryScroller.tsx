"use client";

import * as React from "react";
import {
  Home,
  Gem,
  Waves,
  Layers,
  Coffee,
  Sparkles,
  LayoutGrid,
  Compass,
  Building,
  Palette,
  PenTool,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryScrollerProps {
  searchType: "Flat" | "Interior";
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

const FLAT_CATEGORIES: CategoryItem[] = [
  { id: "All", name: "All Flats", icon: Home },
  { id: "Lake View", name: "Lake View", icon: Waves },
  { id: "Luxury", name: "Luxury", icon: Gem },
  { id: "Penthouse", name: "Penthouse", icon: Sparkles },
  { id: "Duplex", name: "Duplex", icon: Layers },
  { id: "Cozy", name: "Cozy", icon: Coffee },
];

const INTERIOR_CATEGORIES: CategoryItem[] = [
  { id: "All", name: "All Styles", icon: LayoutGrid },
  { id: "Minimalist", name: "Minimalist", icon: Compass },
  { id: "Luxury", name: "Luxury", icon: Gem },
  { id: "Modern", name: "Modern", icon: Building },
  { id: "Classic", name: "Classic", icon: Palette },
  { id: "Contemporary", name: "Contemporary", icon: PenTool },
];

export function CategoryScroller({
  searchType,
  selectedCategory,
  onSelectCategory,
}: CategoryScrollerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);

  const categories = searchType === "Flat" ? FLAT_CATEGORIES : INTERIOR_CATEGORIES;

  const updateArrows = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollWidth - scrollLeft - clientWidth > 5);
    }
  };

  React.useEffect(() => {
    updateArrows();
    const timer = setTimeout(updateArrows, 100);
    window.addEventListener("resize", updateArrows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateArrows);
    };
  }, [categories]);

  const handleScroll = () => {
    updateArrows();
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 250;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-[1600px] mx-auto px-6 sm:px-12 flex items-center select-none">
      {/* Left Navigation Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-6 sm:left-12 z-20 flex items-center justify-center size-8 rounded-full border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer text-zinc-700 dark:text-zinc-300"
        >
          <ChevronLeft className="size-4.5 stroke-[2.5]" />
        </button>
      )}

      {/* Categories Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex items-center gap-8 overflow-x-auto scrollbar-none py-2 w-full mask-edges scroll-smooth"
      >
        {categories.map((category) => {
          const isActive =
            selectedCategory === category.id ||
            (!selectedCategory && category.id === "All");
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "flex flex-col items-center justify-center pb-2.5 outline-none cursor-pointer group shrink-0 min-w-[64px] text-center relative gap-1.5"
              )}
            >
              <div
                className={cn(
                  "transition-all duration-300 ease-out transform group-hover:scale-108 group-hover:translate-y-[-1px]",
                  isActive
                    ? "text-zinc-950 dark:text-zinc-50 scale-105"
                    : "text-zinc-450 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                )}
              >
                <Icon className={cn("size-6 stroke-[1.75]", isActive ? "stroke-[2]" : "")} />
              </div>

              <span
                className={cn(
                  "text-[12px] leading-none transition-colors duration-300 font-semibold tracking-wide",
                  isActive
                    ? "text-zinc-950 dark:text-zinc-50 font-bold"
                    : "text-zinc-500 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                )}
              >
                {category.name}
              </span>

              <div
                className={cn(
                  "absolute bottom-0 h-0.5 transition-all duration-300 ease-out rounded-full",
                  isActive
                    ? "w-full bg-zinc-950 dark:bg-zinc-50"
                    : "w-0 bg-zinc-250 dark:bg-zinc-700 group-hover:w-1/2"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Right Navigation Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-6 sm:right-12 z-20 flex items-center justify-center size-8 rounded-full border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer text-zinc-700 dark:text-zinc-300"
        >
          <ChevronRight className="size-4.5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
