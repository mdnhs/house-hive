"use client";

import * as React from "react";
import Image from "next/image";
import { Home, Sun, Moon, Globe, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchPanel } from "@/features/search/components/SearchPanel";
import Link from "next/link";

interface HeaderProps {
  activeTab: "Flat" | "Interior";
  setActiveTab: (tab: "Flat" | "Interior") => void;
  searchParams: {
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  };
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  isScrolled: boolean;
  isOverlaySearchOpen: boolean;
  setIsOverlaySearchOpen: (open: boolean) => void;
  activeCell: "location" | "budget" | "home" | "space" | "style" | null;
  setActiveCell: (cell: "location" | "budget" | "home" | "space" | "style" | null) => void;
  onSearch: (params: {
    type: "Flat" | "Interior";
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  }) => void;
  onClearFilters: () => void;
  onTabChange: (tab: "Flat" | "Interior") => void;
}

export function Header({
  activeTab,
  setActiveTab,
  searchParams,
  darkMode,
  setDarkMode,
  isScrolled,
  isOverlaySearchOpen,
  setIsOverlaySearchOpen,
  activeCell,
  setActiveCell,
  onSearch,
  onClearFilters,
  onTabChange,
}: HeaderProps) {
  const isHeaderExpanded = !isScrolled || isOverlaySearchOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-[#F7F7F7] dark:bg-zinc-900 border-b-3 border-[#EBEBEB] dark:border-zinc-800 transition-all duration-300 ease-in-out flex flex-col",
        isHeaderExpanded ? "h-50 overflow-visible" : "h-20 overflow-hidden",
      )}
    >
      {/* Top Row: Logo and Right Profile menu */}
      <div className="h-20 w-full grid grid-cols-3 items-center px-6 sm:px-12 shrink-0">
        {/* Left: Brand Logo */}
        <Link href="/">
          <div
            className="flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <div className="text-[#FF385C]">
              <Home className="size-8 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#FF385C] hidden md:block">
              househive
            </span>
          </div></Link>

        {/* Center: Flat / Interior tabs */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            "hidden md:flex items-center justify-center gap-8 shrink-0",
            isHeaderExpanded
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none",
          )}
        >
          <button
            onClick={() => onTabChange("Flat")}
            className={cn(
              "font-semibold relative flex items-center gap-1 transition-all duration-300 cursor-pointer group",
              "after:absolute after:content-[''] after:-bottom-0.5 after:left-0 after:right-0 after:rounded-full after:h-0.5 after:bg-zinc-950 dark:after:bg-zinc-55 after:transition-transform after:duration-300 after:ease-out",
              activeTab === "Flat"
                ? "text-zinc-950 dark:text-zinc-50 after:scale-x-100 after:origin-left"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 after:scale-x-0 after:origin-right",
            )}
          >
            <Image
              src="/icons/icon-flat.png"
              alt="Flat"
              width={40}
              height={40}
              className="size-10 object-cover transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
            />
            Flat
          </button>

          <button
            onClick={() => onTabChange("Interior")}
            className={cn(
              "font-semibold relative flex items-center gap-1 transition-all duration-300 cursor-pointer group",
              "after:absolute after:content-[''] after:-bottom-0.5 after:left-0 after:right-0 after:rounded-full after:h-0.5 after:bg-zinc-950 dark:after:bg-zinc-55 after:transition-transform after:duration-300 after:ease-out",
              activeTab === "Interior"
                ? "text-zinc-950 dark:text-zinc-50 after:scale-x-100 after:origin-left"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 after:scale-x-0 after:origin-right",
            )}
          >
            <Image
              src="/icons/icon-interior.png"
              alt="Interior"
              width={40}
              height={40}
              className="size-10 object-cover transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
            />
            Interior
          </button>
        </div>

        {/* Right: List property & Settings */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          <span className="hidden lg:inline-block text-sm font-semibold text-zinc-850 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/85 px-4 py-2.5 rounded-full cursor-pointer transition-colors">
            Share your space
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-full text-zinc-655 dark:text-zinc-355 cursor-pointer"
          >
            {darkMode ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </button>
          <button className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-full text-zinc-655 dark:text-zinc-355 cursor-pointer">
            <Globe className="size-4.5" />
          </button>

          {/* Profile Menu Capsule */}
          <div className="flex items-center gap-3 px-3 py-2 border border-[#DDDDDD] dark:border-zinc-800 rounded-full hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.05)] cursor-pointer transition-all bg-white dark:bg-zinc-900 select-none">
            <Menu className="size-4 text-zinc-550 dark:text-zinc-355" />
            <div className="size-7.5 rounded-full bg-zinc-500 flex items-center justify-center text-white shrink-0">
              <User className="size-4 fill-white" />
            </div>
          </div>
        </div>
      </div>

      {/* SearchPanel */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ease-in-out pointer-events-none w-full",
          isHeaderExpanded
            ? "top-35 -translate-y-1/2 max-w-4xl px-6"
            : "top-10 -translate-y-1/2 max-w-90 sm:max-w-105 px-4 sm:px-0",
        )}
      >
        <SearchPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
          collapsed={!isHeaderExpanded}
          onExpand={(targetCell) => {
            setIsOverlaySearchOpen(true);
            setActiveCell(targetCell || "location");
          }}
          onSearch={(params) => {
            onSearch(params);
            setIsOverlaySearchOpen(false);
            setActiveCell(null);
          }}
        />
      </div>
    </header>
  );
}
