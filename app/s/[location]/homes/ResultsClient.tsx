"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryStates, parseAsString } from "nuqs";
import { useTheme } from "@/features/theme/hooks/useTheme";
import { useHeaderScroll } from "@/features/navigation/hooks/useHeaderScroll";
import { Header } from "@/features/navigation/components/Header";
import { Footer } from "@/features/navigation/components/Footer";
import { ResultsGallery } from "@/features/properties/components/ResultsGallery";
import { FLATS_DATA, INTERIORS_DATA, getCoordinates } from "@/lib/mockData";
import type { FlatItem, InteriorItem } from "@/lib/mockData";
import type { StyleSpecification } from "maplibre-gl";
import { Map, MapControls, MapMarker, MarkerContent, type MapRef } from "@/components/ui/map";
import { fetchModifiedStyle, LIGHT_STYLE_URL, DARK_STYLE_URL } from "@/lib/mapStyles";
import { MapIcon, List } from "lucide-react";
import { cn } from "@/lib/utils";

const searchSchema = {
  type: parseAsString.withDefault("Flat"),
  budget: parseAsString.withDefault(""),
  bedrooms: parseAsString.withDefault(""),
  size: parseAsString.withDefault(""),
  spaceType: parseAsString.withDefault(""),
  designStyle: parseAsString.withDefault(""),
  propertyType: parseAsString.withDefault("Flat"),
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

  const [hoveredPropertyId, setHoveredPropertyId] = React.useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = React.useState(false);

  const [mapStyles, setMapStyles] = React.useState<{
    light: StyleSpecification | string;
    dark: StyleSpecification | string;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchModifiedStyle(LIGHT_STYLE_URL),
      fetchModifiedStyle(DARK_STYLE_URL),
    ])
      .then(([light, dark]) => {
        if (!cancelled) setMapStyles({ light, dark });
      })
      .catch(() => {
        if (!cancelled) setMapStyles({ light: LIGHT_STYLE_URL, dark: DARK_STYLE_URL });
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

    if (queryState.propertyType) {
      results = results.filter(
        (item) => (item.propertyType || "Flat") === queryState.propertyType
      );
    }

    return results;
  }, [initialLocation, queryState.budget, queryState.bedrooms, queryState.size, queryState.propertyType]);

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

  const activeTab = queryState.type as "Flat" | "Interior";

  // Compute map center from filtered items
  const mapCenter = React.useMemo(() => {
    const items = activeTab === "Flat" ? filteredFlats : filteredInteriors;
    if (items.length === 0) return getCoordinates(initialLocation);
    const lngs: number[] = [];
    const lats: number[] = [];
    items.forEach((item) => {
      const [lng, lat] = getCoordinates(item.location, item.zone);
      lngs.push(lng);
      lats.push(lat);
    });
    return [
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
      lats.reduce((a, b) => a + b, 0) / lats.length,
    ] as [number, number];
  }, [filteredFlats, filteredInteriors, activeTab, initialLocation]);

  const formatPrice = (priceLakh: number) => {
    if (priceLakh >= 100) {
      const cr = priceLakh / 100;
      return `৳${cr.toFixed(2).replace(/\.?0+$/, "")} Cr`;
    }
    return `৳${priceLakh} Lakh`;
  };

  const renderMapMarkers = () => {
    const items = activeTab === "Flat" ? filteredFlats : filteredInteriors;
    const sorted = [...items].sort((a, b) => {
      if (a.id === hoveredPropertyId) return 1;
      if (b.id === hoveredPropertyId) return -1;
      return 0;
    });
    return sorted.map((item) => {
      const [lng, lat] = getCoordinates(item.location, item.zone);
      const isHovered = item.id === hoveredPropertyId;
      const priceText = activeTab === "Flat"
        ? formatPrice((item as FlatItem).priceLakh)
        : (item as InteriorItem).designStyle;
      return (
        <MapMarker
              key={item.id}
              longitude={lng}
              latitude={lat}
              hovered={isHovered}
              onClick={() => setSelectedPropertyId(item.id)}
              onMouseEnter={() => setHoveredPropertyId(item.id)}
              onMouseLeave={() => setHoveredPropertyId(null)}
            >
          <MarkerContent>
            <div
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-bold shadow-md border transition-all duration-200 cursor-pointer font-hind",
                isHovered
                  ? "bg-black text-white border-black scale-110"
                  : "bg-white text-black border-zinc-300 hover:scale-105"
              )}
            >
              {priceText}
            </div>
          </MarkerContent>
        </MapMarker>
      );
    });
  };

  // When a new search is submitted, we route to the appropriate dynamic route with params
  const handleSearch = (params: {
    type: "Flat" | "Interior";
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
    propertyType?: string;
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
    if (params.propertyType) nextParams.set("propertyType", params.propertyType);

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
      propertyType: null,
    });
  };

  const headerSearchParams = {
    location: initialLocation === "Anywhere" ? "" : initialLocation,
    budget: queryState.budget || undefined,
    bedrooms: queryState.bedrooms || undefined,
    size: queryState.size || undefined,
    spaceType: queryState.spaceType || undefined,
    designStyle: queryState.designStyle || undefined,
    propertyType: queryState.propertyType || undefined,
  };

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
        {/* Desktop: 57/43 split pane */}
        <div className="hidden lg:flex h-[calc(100vh-80px)]">
          <div className="w-[57%] overflow-y-auto h-full bg-white dark:bg-[#0b0b0d]">
            <ResultsGallery
              flats={filteredFlats}
              interiors={filteredInteriors}
              searchType={activeTab}
              onClearFilters={handleClearFilters}
              onHoverCard={setHoveredPropertyId}
              selectedCardId={selectedPropertyId}
              onCardSelect={setSelectedPropertyId}
            />
          </div>
          <div className="w-[43%] h-full sticky top-20">
            {mapStyles ? (
              <Map
                center={mapCenter}
                zoom={12}
                className="w-full h-full"
                styles={{ light: mapStyles.light, dark: mapStyles.dark }}
              >
                <MapControls showFullscreen showLocate />
                {renderMapMarkers()}
              </Map>
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center">
                <span className="text-xs text-zinc-400">Loading map…</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: toggle between list and map */}
        <div className="lg:hidden">
          {!showMobileMap ? (
            <section className="bg-white dark:bg-[#0b0b0d] min-h-[50vh]">
              <ResultsGallery
                flats={filteredFlats}
                interiors={filteredInteriors}
                searchType={activeTab}
                onClearFilters={handleClearFilters}
                onHoverCard={setHoveredPropertyId}
                selectedCardId={selectedPropertyId}
                onCardSelect={setSelectedPropertyId}
              />
            </section>
          ) : (
            <div className="fixed inset-0 top-20 bottom-0 z-30">
              {mapStyles ? (
                <Map
                  center={mapCenter}
                  zoom={12}
                  className="w-full h-full"
                  styles={{ light: mapStyles.light, dark: mapStyles.dark }}
                >
                  <MapControls showFullscreen showLocate />
                  {renderMapMarkers()}
                </Map>
              ) : (
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center">
                  <span className="text-xs text-zinc-400">Loading map…</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile floating toggle button */}
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setShowMobileMap(!showMobileMap)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full shadow-2xl border border-zinc-200 dark:border-zinc-700 font-semibold text-sm transition-transform active:scale-95 hover:scale-105"
          >
            {showMobileMap ? (
              <><List className="size-4" /> List</>
            ) : (
              <><MapIcon className="size-4" /> Map</>
            )}
          </button>
        </div>
      </main>

      {!showMobileMap && (
        <Footer />
      )}
    </div>
  );
}
