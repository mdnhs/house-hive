"use client";

import * as React from "react";
import { SearchPanel } from "@/components/SearchPanel";
import { ResultsGallery } from "@/components/ResultsGallery";
import {
  FLATS_DATA,
  INTERIORS_DATA,
  FlatItem,
  InteriorItem,
} from "@/lib/mockData";
import {
  Globe,
  Menu,
  User,
  Home,
  Sun,
  Moon,
  Building2,
  Sofa,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState<"Flat" | "Interior">("Flat");

  const [searchParams, setSearchParams] = React.useState<{
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  }>({ location: "" });

  const [darkMode, setDarkMode] = React.useState(false);

  // States to handle scroll transitions and header overlay searches
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOverlaySearchOpen, setIsOverlaySearchOpen] = React.useState(false);
  const [activeCell, setActiveCell] = React.useState<
    "location" | "budget" | "home" | "space" | "style" | null
  >(null);

  // Apply dark class to html element
  React.useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  // Listen to window scroll position to toggle sticky states
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Derive filtered results from source data + filters
  const filteredFlats = React.useMemo(() => {
    let results = [...FLATS_DATA];

    if (searchParams.location) {
      const query = searchParams.location.toLowerCase();
      results = results.filter(
        (item) =>
          item.location.toLowerCase().includes(query) ||
          item.zone.toLowerCase().includes(query),
      );
    }

    if (searchParams.budget && searchParams.budget !== "Any Budget") {
      if (searchParams.budget === "Under 50 Lakh") {
        results = results.filter((item) => item.priceLakh < 50);
      } else if (searchParams.budget === "50L - 1Cr") {
        results = results.filter(
          (item) => item.priceLakh >= 50 && item.priceLakh <= 100,
        );
      } else if (searchParams.budget === "1Cr - 2Cr") {
        results = results.filter(
          (item) => item.priceLakh >= 100 && item.priceLakh <= 200,
        );
      } else if (searchParams.budget === "2Cr+") {
        results = results.filter((item) => item.priceLakh > 200);
      }
    }

    if (searchParams.bedrooms) {
      if (searchParams.bedrooms === "1 Bed") {
        results = results.filter((item) => item.bedrooms === 1);
      } else if (searchParams.bedrooms === "2 Bed") {
        results = results.filter((item) => item.bedrooms === 2);
      } else if (searchParams.bedrooms === "3 Bed") {
        results = results.filter((item) => item.bedrooms === 3);
      } else if (searchParams.bedrooms === "4+ Bed") {
        results = results.filter((item) => item.bedrooms >= 4);
      }
    }

    if (searchParams.size && searchParams.size !== "Any") {
      const minSize = parseInt(searchParams.size.replace("+", ""), 10);
      if (!isNaN(minSize)) {
        results = results.filter((item) => item.sizeSqft >= minSize);
      }
    }

    return results;
  }, [searchParams]);

  const filteredInteriors = React.useMemo(() => {
    let results = [...INTERIORS_DATA];

    if (searchParams.location) {
      const query = searchParams.location.toLowerCase();
      results = results.filter(
        (item) =>
          item.location.toLowerCase().includes(query) ||
          item.zone.toLowerCase().includes(query),
      );
    }

    if (searchParams.spaceType) {
      results = results.filter(
        (item) => item.spaceType === searchParams.spaceType,
      );
    }

    if (searchParams.designStyle) {
      results = results.filter(
        (item) => item.designStyle === searchParams.designStyle,
      );
    }

    return results;
  }, [searchParams]);

  // Reset search params on tab switch
  const handleTabChange = (tab: "Flat" | "Interior") => {
    setActiveTab(tab);
    setSearchParams({ location: "" });
  };

  const handleSearch = (params: {
    type: "Flat" | "Interior";
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  }) => {
    setSearchParams({
      location: params.location,
      budget: params.budget,
      bedrooms: params.bedrooms,
      size: params.size,
      spaceType: params.spaceType,
      designStyle: params.designStyle,
    });
  };

  const handleClearFilters = () => {
    setSearchParams({ location: "" });
  };

  // Determine if the header should show the expanded tall view
  const isHeaderExpanded = !isScrolled || isOverlaySearchOpen;

  return (
    <div
      className="flex-1 bg-linear-to-b
    from-white
    via-white
    to-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen transition-colors duration-300 font-sans"
    >
      {/* Tall/Sticky Morphing Header (Airbnb Style) */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-[#F7F7F7] dark:bg-zinc-900 border-b-3 border-[#EBEBEB]  dark:border-zinc-800 transition-all duration-300 ease-in-out flex flex-col",
          isHeaderExpanded ? "h-50 overflow-visible" : "h-20 overflow-hidden",
        )}
      >
        {/* Top Row: Logo and Right Profile menu */}
        <div className="h-20 w-full grid grid-cols-3 items-center px-6 sm:px-12 shrink-0">
          {/* Left: Brand Logo */}
          <div
            onClick={() => handleClearFilters()}
            className="flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <div className="text-[#FF385C]">
              <Home className="size-8 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#FF385C] hidden md:block">
              househive
            </span>
          </div>

          {/* Center: Flat / Interior tabs */}
          <div className="hidden md:flex items-center justify-center gap-8 shrink-0">
            <button
              onClick={() => handleTabChange("Flat")}
              className={cn(
                "text-lg font-semibold relative flex items-center gap-1.5 transition-all cursor-pointer",
                activeTab === "Flat"
                  ? "text-zinc-950 dark:text-zinc-50 after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:rounded-full after:h-0.5 after:bg-zinc-950 dark:after:bg-zinc-50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              <Building2 className="size-5" />
              Flat
            </button>
            <button
              onClick={() => handleTabChange("Interior")}
              className={cn(
                "text-lg font-semibold relative flex items-center gap-1.5 transition-all cursor-pointer",
                activeTab === "Interior"
                  ? "text-zinc-950 dark:text-zinc-50 after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:rounded-full after:h-0.5 after:bg-zinc-950 dark:after:bg-zinc-50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              <Sofa className="size-5" />
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

        {/* SearchPanel (morphs between collapsed pill in top row and full capsule below) */}
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
              handleSearch(params);
              setIsOverlaySearchOpen(false);
              setActiveCell(null);
            }}
          />
        </div>
      </header>

      {/* Floating Dim Backdrop Overlay when search panel is expanded via scrolled header trigger */}
      {isScrolled && isOverlaySearchOpen && (
        <div
          onClick={() => {
            setIsOverlaySearchOpen(false);
            setActiveCell(null);
          }}
          className="fixed inset-0 bg-black/25 z-40 backdrop-blur-[2px] animate-in fade-in duration-200"
        />
      )}

      {/* Main Content Body */}
      <main
        className={cn(
          "transition-all duration-300",
          isHeaderExpanded ? "pt-50" : "pt-20",
        )}
      >
        {/* Results Gallery Section - sits directly below header */}
        <section className="bg-white dark:bg-[#0b0b0d] min-h-[50vh]">
          <ResultsGallery
            flats={filteredFlats}
            interiors={filteredInteriors}
            searchType={activeTab}
            onClearFilters={handleClearFilters}
          />
        </section>
      </main>

      {/* Airbnb style footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-900 py-10 px-6 sm:px-12 bg-[#F7F7F7] dark:bg-zinc-900/50 text-[13px] text-zinc-650 dark:text-zinc-400">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span>© 2026 HouseHive, Inc.</span>
            <span>•</span>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:underline">
              Sitemap
            </a>
            <span>•</span>
            <a href="#" className="hover:underline">
              UK Modern Slavery Act
            </a>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <span className="flex items-center gap-1 cursor-pointer hover:underline">
              <Globe className="size-4" /> English (US)
            </span>
            <span className="cursor-pointer hover:underline">৳ BDT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
