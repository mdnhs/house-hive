"use client";

import * as React from "react";
import { Search, MapPin } from "lucide-react";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { BudgetSelector, BUDGET_OPTIONS } from "./BudgetSelector";
import {
  HomeDetailsSelector,
  BEDROOM_OPTIONS,
  SIZE_OPTIONS,
} from "./HomeDetailsSelector";
import { SpaceTypeSelector, SPACE_TYPES } from "./SpaceTypeSelector";
import { DesignStyleSelector, DESIGN_STYLES } from "./DesignStyleSelector";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZONE_SUGGESTIONS, DHAKA_ZONES, ALL_SUGGESTIONS } from "@/lib/mockData";

interface SearchPanelProps {
  activeTab: "Flat" | "Interior";
  setActiveTab: (tab: "Flat" | "Interior") => void;
  activeCell: "location" | "budget" | "home" | "space" | "style" | null;
  setActiveCell: (
    cell: "location" | "budget" | "home" | "space" | "style" | null,
  ) => void;
  onSearch: (params: {
    type: "Flat" | "Interior";
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  }) => void;
  collapsed?: boolean;
  onExpand?: () => void;
}

export function SearchPanel({
  activeTab,
  setActiveTab,
  activeCell,
  setActiveCell,
  onSearch,
  collapsed = false,
  onExpand,
}: SearchPanelProps) {
  // Flat state
  const [flatLocation, setFlatLocation] = React.useState("");
  const [flatBudget, setFlatBudget] = React.useState("Any Budget");
  const [flatBedrooms, setFlatBedrooms] = React.useState("");
  const [flatSize, setFlatSize] = React.useState("");

  // Interior state
  const [interiorLocation, setInteriorLocation] = React.useState("");
  const [interiorSpaceType, setInteriorSpaceType] = React.useState("");
  const [interiorDesignStyle, setInteriorDesignStyle] = React.useState("");

  // Refs for tracking layout offsets to animate the active highlight bubble
  const locationCellRef = React.useRef<HTMLDivElement>(null);
  const budgetCellRef = React.useRef<HTMLDivElement>(null);
  const homeCellRef = React.useRef<HTMLDivElement>(null);
  const spaceCellRef = React.useRef<HTMLDivElement>(null);
  const styleCellRef = React.useRef<HTMLDivElement>(null);

  const [highlightStyle, setHighlightStyle] =
    React.useState<React.CSSProperties>({
      opacity: 0,
      left: 0,
      width: 0,
    });

  // Shared popup refs for width/position animation
  const capsuleRef = React.useRef<HTMLDivElement>(null);
  const popupContentRef = React.useRef<HTMLDivElement>(null);
  const [popupWidth, setPopupWidth] = React.useState<number>(400);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties>({
    left: 0,
  });

  // Measure capsule width
  const [capsuleWidth, setCapsuleWidth] = React.useState(0);

  React.useEffect(() => {
    if (capsuleRef.current) {
      setCapsuleWidth(capsuleRef.current.offsetWidth);
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (capsuleRef.current) {
        setCapsuleWidth(capsuleRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate sliding bubble position + popup anchor position
  React.useEffect(() => {
    let activeRef: React.RefObject<HTMLDivElement | null> | null = null;

    if (activeCell === "location") {
      activeRef = locationCellRef;
    } else if (activeCell === "budget") {
      activeRef = budgetCellRef;
    } else if (activeCell === "home") {
      activeRef = homeCellRef;
    } else if (activeCell === "space") {
      activeRef = spaceCellRef;
    } else if (activeCell === "style") {
      activeRef = styleCellRef;
    }

    if (activeRef && activeRef.current) {
      const el = activeRef.current;
      setHighlightStyle({
        opacity: 1,
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`,
      });

      const barWidth = capsuleWidth || el.offsetParent?.clientWidth || 800;
      const isCenter = activeCell === "budget" || activeCell === "space";
      const isRight = activeCell === "home" || activeCell === "style";
      const popupW = isCenter ? barWidth : barWidth * 0.5;
      let left = el.offsetLeft;

      if (isCenter) {
        left = 0;
      } else if (isRight) {
        left = barWidth - popupW;
      }

      setPopupStyle({ left: Math.max(0, left), width: popupW });
    } else {
      setHighlightStyle({
        opacity: 0,
        left: 0,
        width: 0,
      });
    }
  }, [activeCell, activeTab, capsuleWidth]);

  // Reset active cell on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-capsule-container")) {
        setActiveCell(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActiveCell]);

  // Popup show/hide with delay for exit animation
  React.useEffect(() => {
    if (activeCell) {
      setShowPopup(true);
    } else {
      const timer = setTimeout(() => setShowPopup(false), 200);
      return () => clearTimeout(timer);
    }
  }, [activeCell]);

  // Measure popup content width for smooth width transition
  React.useEffect(() => {
    if (showPopup && popupContentRef.current && activeCell) {
      const width = popupContentRef.current.scrollWidth;
      setPopupWidth(Math.max(width, 300));
    }
  }, [showPopup, activeCell]);

  // Location filter
  const currentLocation =
    activeTab === "Flat" ? flatLocation : interiorLocation;
  const setCurrentLocation =
    activeTab === "Flat" ? setFlatLocation : setInteriorLocation;

  const filteredSuggestions = React.useMemo(() => {
    if (!currentLocation.trim()) return [];
    const query = currentLocation.toLowerCase();
    return ALL_SUGGESTIONS.filter((s) => s.toLowerCase().includes(query));
  }, [currentLocation]);

  const handleLocationSelect = (suggestion: string) => {
    setCurrentLocation(suggestion);
    if (activeTab === "Flat") {
      setActiveCell("budget");
    } else {
      setActiveCell("space");
    }
  };

  // Location popup input
  const [locInputValue, setLocInputValue] = React.useState("");

  React.useEffect(() => {
    setLocInputValue(currentLocation);
  }, [currentLocation, activeCell]);

  const handleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCell(null);

    if (activeTab === "Flat") {
      onSearch({
        type: "Flat",
        location: flatLocation,
        budget: flatBudget,
        bedrooms: flatBedrooms,
        size: flatSize,
      });
    } else {
      onSearch({
        type: "Interior",
        location: interiorLocation,
        spaceType: interiorSpaceType,
        designStyle: interiorDesignStyle,
      });
    }
  };

  const renderPopupContent = () => {
    switch (activeCell) {
      case "location":
        return (
          <div className="flex flex-col gap-3 min-w-[360px] sm:min-w-[420px]">
            {locInputValue.trim() ? (
              filteredSuggestions.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 mb-2">
                    Matching Locations
                  </span>
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationSelect(suggestion);
                      }}
                      className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-center size-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
                        <MapPin className="size-4" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400 text-sm">
                  No matching locations found for "{locInputValue}"
                </div>
              )
            ) : (
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2">
                  {activeTab === "Flat"
                    ? "📍 কোথায় ফ্ল্যাট খুঁজছেন?"
                    : "📍 কোথায় খুঁজছেন?"}
                </span>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {DHAKA_ZONES.map((zone) => (
                    <button
                      key={zone}
                      onClick={(e) => {
                        e.stopPropagation();
                        const defaults = ZONE_SUGGESTIONS[zone] || [];
                        const defaultLoc = defaults[0] || zone;
                        handleLocationSelect(defaultLoc);
                      }}
                      className="flex flex-col items-start gap-1.5 p-4 rounded-[20px] border border-zinc-200/60 dark:border-zinc-850 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50/20 dark:hover:bg-zinc-800/10 text-left transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-center size-9 rounded-full bg-zinc-150/60 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300">
                        <MapPin className="size-4.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                          {zone}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                          {ZONE_SUGGESTIONS[zone]?.length || 0} sub-areas
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "budget":
        return (
          <div className="flex flex-col gap-5 min-w-[320px] sm:min-w-[380px]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-red-500 dark:text-red-400 uppercase tracking-widest text-left">
                Budget Range
              </span>
              <h3 className="text-base font-extrabold text-zinc-850 dark:text-zinc-100 text-left">
                💰 আপনার বাজেট কত?
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-1">
              {BUDGET_OPTIONS.map((option) => {
                const isSelected =
                  flatBudget === option ||
                  (!flatBudget && option === "Any Budget");
                return (
                  <button
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlatBudget(option);
                      setActiveCell("home");
                    }}
                    className={cn(
                      "px-5 py-3 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border",
                      isSelected
                        ? "bg-red-500 text-white border-transparent shadow-lg shadow-red-500/20 scale-[1.02]"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-750",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "home":
        return (
          <div className="flex flex-col gap-6 text-left min-w-[320px] sm:min-w-[400px]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-red-500 dark:text-red-400 uppercase tracking-widest">
                Configuration
              </span>
              <h3 className="text-base font-extrabold text-zinc-850 dark:text-zinc-100">
                🏠 What kind of home?
              </h3>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Bedrooms
              </span>
              <div className="flex flex-wrap gap-2">
                {BEDROOM_OPTIONS.map((opt) => {
                  const isSelected = flatBedrooms === opt;
                  return (
                    <button
                      key={opt}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlatBedrooms(isSelected ? "" : opt);
                      }}
                      className={cn(
                        "px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border",
                        isSelected
                          ? "bg-red-500 text-white border-transparent shadow-lg shadow-red-500/20 scale-[1.02]"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-750",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Minimum Size
              </span>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((opt) => {
                  const isSelected =
                    flatSize === opt || (!flatSize && opt === "Any");
                  return (
                    <button
                      key={opt}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlatSize(opt === "Any" ? "" : opt);
                      }}
                      className={cn(
                        "px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border",
                        isSelected
                          ? "bg-red-500 text-white border-transparent shadow-lg shadow-red-500/20 scale-[1.02]"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-750",
                      )}
                    >
                      {opt === "Any" ? "Any" : `${opt} sqft`}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-150/60 dark:border-zinc-800/80 pt-4 mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlatBedrooms("");
                  setFlatSize("");
                }}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-4 cursor-pointer transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCell(null);
                }}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        );

      case "space":
        return (
          <div className="flex flex-col gap-5 text-left min-w-[320px] sm:min-w-[360px]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-red-500 dark:text-red-400 uppercase tracking-widest">
                Space Selection
              </span>
              <h3 className="text-base font-extrabold text-zinc-850 dark:text-zinc-100">
                🏠 What kind of space?
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-1">
              {SPACE_TYPES.map((type) => {
                const isSelected = interiorSpaceType === type;
                return (
                  <button
                    key={type}
                    onClick={(e) => {
                      e.stopPropagation();
                      setInteriorSpaceType(type);
                      setActiveCell("style");
                    }}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all duration-200 cursor-pointer border",
                      isSelected
                        ? "bg-red-500 text-white border-transparent shadow-md shadow-red-500/20"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-550 hover:bg-zinc-50 dark:hover:bg-zinc-750",
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "style":
        return (
          <div className="flex flex-col gap-5 text-left min-w-[320px] sm:min-w-[360px]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-red-500 dark:text-red-400 uppercase tracking-widest">
                Aesthetic Style
              </span>
              <h3 className="text-base font-extrabold text-zinc-850 dark:text-zinc-100">
                ✨ Design Style?
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-1">
              {DESIGN_STYLES.map((style) => {
                const isSelected = interiorDesignStyle === style;
                return (
                  <button
                    key={style}
                    onClick={(e) => {
                      e.stopPropagation();
                      setInteriorDesignStyle(style);
                      setActiveCell(null);
                    }}
                    className={cn(
                      "px-5 py-3 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border",
                      isSelected
                        ? "bg-red-500 text-white border-transparent shadow-lg shadow-red-500/20 scale-[1.02]"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-750",
                    )}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const location =
    activeTab === "Flat" ? flatLocation : interiorLocation;
  const locationLabel = location
    ? location.split(" ")[0]
    : "Anywhere";
  const secondLabel =
    activeTab === "Flat"
      ? flatBudget && flatBudget !== "Any Budget"
        ? flatBudget
        : "Any budget"
      : interiorSpaceType || "Space type";
  const thirdLabel =
    activeTab === "Flat"
      ? flatBedrooms || (flatSize && flatSize !== "Any" ? flatSize : "Add details")
      : interiorDesignStyle || "Style type";

  return (
    <div className="w-full max-w-4xl mx-auto search-capsule-container relative">
      {/* Collapsed pill - cross-fades with capsule */}
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-500 ease-out",
          collapsed
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-75 pointer-events-none absolute",
        )}
      >
        <button
          onClick={() => onExpand?.()}
          className="flex items-center h-11 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.06)] hover:scale-[1.01] transition-all duration-200 pl-5 pr-1.5 cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[80px]">
            {locationLabel}
          </span>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-3 shrink-0" />
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[90px]">
            {secondLabel}
          </span>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-3 shrink-0" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[100px]">
            {thirdLabel}
          </span>
          <div className="ml-3 flex items-center justify-center size-8 rounded-full bg-[#FF385C] text-white shrink-0">
            <Search className="size-3.5 stroke-[2.5]" />
          </div>
        </button>
      </div>

      {/* Expanded capsule - cross-fades with pill */}
      <div
        className={cn(
          "transition-all duration-500 ease-out relative",
          collapsed
            ? "opacity-0 scale-75 pointer-events-none absolute inset-0"
            : "opacity-100 scale-100 pointer-events-auto",
        )}
      >
        {/* Search Capsule Wrapper (Airbnb Stays/Experiences-style search bar) */}
        <div
          ref={capsuleRef}
          className={cn(
            "w-full rounded-full border border-zinc-200 dark:border-zinc-800 transition-all duration-300 shadow-[0_3px_12px_rgba(0,0,0,0.06)] relative",
          activeCell
            ? "bg-[#F3F3F3] dark:bg-[#1C1C1E] border-transparent shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            : "bg-white dark:bg-zinc-800 hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)]",
        )}
      >
        {/* Sliding Active Cell Highlight Bubble (Airbnb-style background pill slider) */}
        <div
          className="absolute top-0 bottom-0 bg-white dark:bg-zinc-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-350 ease-out z-10 pointer-events-none"
          style={highlightStyle}
        />

        {activeTab === "Flat" ? (
          /* Flat search layouts */
          <>
            <div className="flex flex-col md:flex-row md:items-center relative w-full">
              {/* Location Selector */}
              <div ref={locationCellRef} className="flex-1 flex z-20">
                <LocationAutocomplete
                  value={flatLocation}
                  onChange={(val) => {
                    setFlatLocation(val);
                    if (val && activeCell !== "location")
                      setActiveCell("location");
                  }}
                  placeholder="Search destinations"
                  label="Where"
                  isActive={activeCell === "location"}
                  onActivate={() => setActiveCell("location")}
                />
              </div>

              {/* Vertical Divider */}
              {!activeCell && (
                <div className="hidden md:block w-px h-8 bg-zinc-200 dark:bg-zinc-700 shrink-0 z-20" />
              )}

              {/* Budget Selector */}
              <div ref={budgetCellRef} className="flex-1 flex z-20">
                <BudgetSelector
                  value={flatBudget}
                  onChange={(val) => {
                    setFlatBudget(val);
                    setActiveCell("home");
                  }}
                  isActive={activeCell === "budget"}
                  onActivate={() => setActiveCell("budget")}
                />
              </div>

              {/* Vertical Divider */}
              {!activeCell && (
                <div className="hidden md:block w-px h-8 bg-zinc-200 dark:bg-zinc-700 shrink-0 z-20" />
              )}

              {/* Home Details Selector */}
              <div ref={homeCellRef} className="flex-1 flex z-20">
                <HomeDetailsSelector
                  bedrooms={flatBedrooms}
                  setBedrooms={setFlatBedrooms}
                  size={flatSize}
                  setSize={setFlatSize}
                  isActive={activeCell === "home"}
                  onActivate={() => setActiveCell("home")}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center relative w-full">
              {/* Location Selector */}
              <div ref={locationCellRef} className="flex-1 flex z-20">
                <LocationAutocomplete
                  value={interiorLocation}
                  onChange={(val) => {
                    setInteriorLocation(val);
                    if (val && activeCell !== "location")
                      setActiveCell("location");
                  }}
                  placeholder="Search destinations"
                  label="Where"
                  isActive={activeCell === "location"}
                  onActivate={() => setActiveCell("location")}
                />
              </div>

              {/* Vertical Divider */}
              {!activeCell && (
                <div className="hidden md:block w-px h-8 bg-zinc-200 dark:bg-zinc-700 shrink-0 z-20" />
              )}

              {/* Space Type Selector */}
              <div ref={spaceCellRef} className="flex-1 flex z-20">
                <SpaceTypeSelector
                  value={interiorSpaceType}
                  onChange={(val) => {
                    setInteriorSpaceType(val);
                    setActiveCell("style");
                  }}
                  isActive={activeCell === "space"}
                  onActivate={() => setActiveCell("space")}
                />
              </div>

              {/* Vertical Divider */}
              {!activeCell && (
                <div className="hidden md:block w-px h-8 bg-zinc-200 dark:bg-zinc-700 shrink-0 z-20" />
              )}

              {/* Design Style Selector */}
              <div ref={styleCellRef} className="flex-1 flex z-20">
                <DesignStyleSelector
                  value={interiorDesignStyle}
                  onChange={(val) => {
                    setInteriorDesignStyle(val);
                    setActiveCell(null);
                  }}
                  isActive={activeCell === "style"}
                  onActivate={() => setActiveCell("style")}
                />
              </div>
            </div>
          </>
        )}
        </div>
        {/* Floating search button (Airbnb-style) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 hidden md:flex">
          <Button
            onClick={handleSearch}
            className={cn(
              "rounded-full bg-[#FF385C] hover:bg-[#E61E4D] text-white flex items-center justify-center shadow-md shadow-red-500/30 hover:shadow-lg transition-all duration-500 ease-out active:scale-[0.97] overflow-hidden",
              activeCell ? "w-[118px] h-12 px-5 justify-between" : "size-12",
            )}
          >
            <Search className="size-5 shrink-0" />
            {activeCell && (
              <span className="text-sm font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both">
                Search
              </span>
            )}
          </Button>
        </div>
        {/* Mobile search button */}
        <div className="p-2 flex md:hidden items-center justify-center z-30">
          <Button
            onClick={handleSearch}
            className="w-full h-12 rounded-full bg-[#FF385C] hover:bg-[#E61E4D] text-white flex items-center justify-center shadow-md shadow-red-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.97]"
          >
            <Search className="size-5 shrink-0" />
            <span className="text-sm font-bold ml-2">Search</span>
          </Button>
        </div>
      </div>

      {/* Shared Popup - Single popup for all fields with width + position animation */}
      {showPopup && activeCell && (
        <div
          className="absolute top-full mt-3 z-50 origin-top animate-in zoom-in-75 duration-500"
          style={{
            left: popupStyle.left,
            transition: "left 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-[0_8px_28px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.5)] border border-zinc-100/80 dark:border-zinc-800/80 overflow-hidden max-w-[calc(100vw-32px)]"
            style={{
              width: popupStyle.width || popupWidth,
              transition: "width 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div ref={popupContentRef} key={activeCell} className="p-6">
              {renderPopupContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
