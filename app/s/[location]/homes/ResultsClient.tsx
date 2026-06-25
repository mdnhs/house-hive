"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryStates, parseAsString } from "nuqs";
import { useTheme } from "@/features/theme/hooks/useTheme";
import { useHeaderScroll } from "@/features/navigation/hooks/useHeaderScroll";
import { Header } from "@/features/navigation/components/Header";
import { Footer } from "@/features/navigation/components/Footer";
import { ResultsGallery } from "@/features/properties/components/ResultsGallery";
import { FLATS_DATA, INTERIORS_DATA } from "@/lib/mockData";

const searchSchema = {
  type: parseAsString.withDefault("Flat"),
  budget: parseAsString.withDefault(""),
  bedrooms: parseAsString.withDefault(""),
  size: parseAsString.withDefault(""),
  spaceType: parseAsString.withDefault(""),
  designStyle: parseAsString.withDefault(""),
};

interface ResultsClientProps {
  initialLocation: string;
}

export function ResultsClient({ initialLocation }: ResultsClientProps) {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();

  // Parse and manage query params reactively with nuqs
  const [queryState, setQueryState] = useQueryStates(searchSchema, {
    shallow: true,
  });

  const {
    isOverlaySearchOpen,
    setIsOverlaySearchOpen,
    activeCell,
    setActiveCell,
  } = useHeaderScroll();

  // On search result page, we want the search bar collapsed by default
  const isScrolled = true;

  // Filter flats data
  const filteredFlats = React.useMemo(() => {
    let results = [...FLATS_DATA];

    if (initialLocation && initialLocation !== "Anywhere") {
      const query = initialLocation.toLowerCase();
      results = results.filter(
        (item) =>
          item.location.toLowerCase().includes(query) ||
          item.zone.toLowerCase().includes(query)
      );
    }

    if (queryState.budget && queryState.budget !== "Any Budget") {
      if (queryState.budget === "Under 50 Lakh") {
        results = results.filter((item) => item.priceLakh < 50);
      } else if (queryState.budget === "50L - 1Cr") {
        results = results.filter(
          (item) => item.priceLakh >= 50 && item.priceLakh <= 100
        );
      } else if (queryState.budget === "1Cr - 2Cr") {
        results = results.filter(
          (item) => item.priceLakh >= 100 && item.priceLakh <= 200
        );
      } else if (queryState.budget === "2Cr+") {
        results = results.filter((item) => item.priceLakh > 200);
      }
    }

    if (queryState.bedrooms) {
      if (queryState.bedrooms === "1 Bed") {
        results = results.filter((item) => item.bedrooms === 1);
      } else if (queryState.bedrooms === "2 Bed") {
        results = results.filter((item) => item.bedrooms === 2);
      } else if (queryState.bedrooms === "3 Bed") {
        results = results.filter((item) => item.bedrooms === 3);
      } else if (queryState.bedrooms === "4+ Bed") {
        results = results.filter((item) => item.bedrooms >= 4);
      }
    }

    if (queryState.size && queryState.size !== "Any") {
      const minSize = parseInt(queryState.size.replace("+", ""), 10);
      if (!isNaN(minSize)) {
        results = results.filter((item) => item.sizeSqft >= minSize);
      }
    }

    return results;
  }, [initialLocation, queryState.budget, queryState.bedrooms, queryState.size]);

  // Filter interiors data
  const filteredInteriors = React.useMemo(() => {
    let results = [...INTERIORS_DATA];

    if (initialLocation && initialLocation !== "Anywhere") {
      const query = initialLocation.toLowerCase();
      results = results.filter(
        (item) =>
          item.location.toLowerCase().includes(query) ||
          item.zone.toLowerCase().includes(query)
      );
    }

    if (queryState.spaceType) {
      results = results.filter((item) => item.spaceType === queryState.spaceType);
    }

    if (queryState.designStyle) {
      results = results.filter((item) => item.designStyle === queryState.designStyle);
    }

    return results;
  }, [initialLocation, queryState.spaceType, queryState.designStyle]);

  // When a new search is submitted, we route to the appropriate dynamic route with params
  const handleSearch = (params: {
    type: "Flat" | "Interior";
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  }) => {
    const loc = params.location.trim() || "Anywhere";
    const slug = encodeURIComponent(loc.replace(/\s+/g, "-"));

    const nextParams = new URLSearchParams();
    nextParams.set("type", params.type);
    if (params.budget && params.budget !== "Any Budget") nextParams.set("budget", params.budget);
    if (params.bedrooms) nextParams.set("bedrooms", params.bedrooms);
    if (params.size) nextParams.set("size", params.size);
    if (params.spaceType) nextParams.set("spaceType", params.spaceType);
    if (params.designStyle) nextParams.set("designStyle", params.designStyle);

    router.push(`/s/${slug}/homes?${nextParams.toString()}`);
  };

  const handleTabChange = (tab: "Flat" | "Interior") => {
    setQueryState({
      type: tab,
      budget: null,
      bedrooms: null,
      size: null,
      spaceType: null,
      designStyle: null,
    });
  };

  const handleClearFilters = () => {
    setQueryState({
      budget: null,
      bedrooms: null,
      size: null,
      spaceType: null,
      designStyle: null,
    });
  };

  const headerSearchParams = {
    location: initialLocation === "Anywhere" ? "" : initialLocation,
    budget: queryState.budget || undefined,
    bedrooms: queryState.bedrooms || undefined,
    size: queryState.size || undefined,
    spaceType: queryState.spaceType || undefined,
    designStyle: queryState.designStyle || undefined,
  };

  const activeTab = queryState.type as "Flat" | "Interior";

  return (
    <div className="flex-1 bg-linear-to-b from-white via-white to-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen transition-colors duration-300 font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchParams={headerSearchParams}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isScrolled={isScrolled}
        isOverlaySearchOpen={isOverlaySearchOpen}
        setIsOverlaySearchOpen={setIsOverlaySearchOpen}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
        onTabChange={handleTabChange}
      />

      {isOverlaySearchOpen && (
        <div
          onClick={() => {
            setIsOverlaySearchOpen(false);
            setActiveCell(null);
          }}
          className="fixed inset-0 bg-black/25 z-40 backdrop-blur-[2px] animate-in fade-in duration-200"
        />
      )}

      <main className={isOverlaySearchOpen ? "pt-50" : "pt-20"}>
        <section className="bg-white dark:bg-[#0b0b0d] min-h-[50vh]">
          <ResultsGallery
            flats={filteredFlats}
            interiors={filteredInteriors}
            searchType={activeTab}
            onClearFilters={handleClearFilters}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
