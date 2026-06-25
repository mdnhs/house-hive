"use client";

import * as React from "react";
import {
  Search,
  MapPin,
  Compass,
  Utensils,
  Building2,
  Plane,
  Trees,
  ShoppingBag,
} from "lucide-react";
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

const SUGGESTED_DESTINATIONS = [
  {
    name: "Gulshan",
    description: "For its lakeside views and premium dining",
    icon: Compass,
    bgClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    name: "Banani",
    description: "For vibrant nightlife and trendy cafes",
    icon: Utensils,
    bgClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    name: "Bashundhara",
    description: "Quiet residential zone and mega malls",
    icon: Building2,
    bgClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  {
    name: "Uttara",
    description: "Close to airport with parks and cafes",
    icon: Plane,
    bgClass:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
  },
  {
    name: "Dhanmondi",
    description: "Rich culture, lakes, and educational hubs",
    icon: Trees,
    bgClass: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
  },
  {
    name: "Mirpur",
    description: "For Cricket Stadium and National Zoo",
    icon: ShoppingBag,
    bgClass: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
  },
];

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
  onExpand?: (
    cell?: "location" | "budget" | "home" | "space" | "style",
  ) => void;
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
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties>({
    left: 0,
  });
  const prevCollapsedRef = React.useRef(collapsed);

  // Measure capsule width
  const [capsuleWidth, setCapsuleWidth] = React.useState(0);

  React.useEffect(() => {
    if (!capsuleRef.current) return;
    const element = capsuleRef.current;

    // Use ResizeObserver to continuously track size changes during CSS transitions
    const observer = new ResizeObserver(() => {
      setCapsuleWidth(element.offsetWidth);
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
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

      // On small screens/searchbar widths, make all popups take full searchbar width
      const useFullWidth = barWidth < 640;
      const currentPopupW =
        isCenter || useFullWidth ? barWidth : barWidth * 0.5;
      let left = el.offsetLeft;

      if (isCenter || useFullWidth) {
        left = 0;
      } else if (isRight) {
        left = barWidth - currentPopupW;
      }

      setPopupStyle({ left: Math.max(0, left), width: currentPopupW });
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

      // If the clicked element is detached from the DOM during render, ignore
      if (!document.body.contains(target)) {
        return;
      }

      if (!target.closest(".search-capsule-container")) {
        setActiveCell(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActiveCell]);

  // Popup show/hide effect (delays mounting when expanding from collapsed state to match layout transitions)
  React.useEffect(() => {
    const justExpanded = prevCollapsedRef.current && !collapsed;
    prevCollapsedRef.current = collapsed;

    if (activeCell) {
      if (justExpanded) {
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 350);
        return () => clearTimeout(timer);
      } else {
        setShowPopup(true);
      }
    } else {
      const timer = setTimeout(() => setShowPopup(false), 200);
      return () => clearTimeout(timer);
    }
  }, [activeCell, collapsed]);

  // Measured popup width logic removed in favor of exact 50% / 100% searchbar constraints

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
          <div className="flex flex-col gap-2.5 w-full">
            {locInputValue.trim() ? (
              filteredSuggestions.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider px-2 mb-1.5">
                    Matching Locations
                  </span>
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationSelect(suggestion);
                      }}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-center size-8.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
                        <MapPin className="size-4" />
                      </div>
                      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
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
              <div className="flex flex-col gap-2 text-left">
                <span className="text-[12px] font-bold text-zinc-550 dark:text-zinc-400 px-1">
                  Suggested destinations
                </span>
                <div className="flex flex-col gap-1 mt-0.5">
                  {SUGGESTED_DESTINATIONS.map((dest) => {
                    const IconComponent = dest.icon;
                    return (
                      <button
                        key={dest.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          const defaults = ZONE_SUGGESTIONS[dest.name] || [];
                          const defaultLoc = defaults[0] || dest.name;
                          handleLocationSelect(defaultLoc);
                        }}
                        className="flex items-center gap-3 w-full text-left p-1.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer"
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center size-10 rounded-xl shrink-0",
                            dest.bgClass,
                          )}
                        >
                          <IconComponent className="size-5 stroke-[1.8]" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                            {dest.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium leading-normal truncate">
                            {dest.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case "budget":
        return (
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-extrabold text-[#FF385C] uppercase tracking-widest text-left">
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
                        ? "bg-[#FF385C] text-white border-transparent shadow-lg shadow-[#FF385C]/30 scale-[1.02]"
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
          <div className="flex flex-col gap-5 text-left w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-extrabold text-[#FF385C] uppercase tracking-widest">
                Configuration
              </span>
              <h3 className="text-base font-extrabold text-zinc-850 dark:text-zinc-100">
                🏠 What kind of home?
              </h3>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">
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
                        "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border",
                        isSelected
                          ? "bg-[#FF385C] text-white border-transparent shadow-lg shadow-[#FF385C]/30 scale-[1.02]"
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
              <span className="text-[11px] font-extrabold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">
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
                        "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border",
                        isSelected
                          ? "bg-[#FF385C] text-white border-transparent shadow-lg shadow-[#FF385C]/30 scale-[1.02]"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-750",
                      )}
                    >
                      {opt === "Any" ? "Any" : `${opt} sqft`}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-150/60 dark:border-zinc-800/80 pt-4 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlatBedrooms("");
                  setFlatSize("");
                }}
                className="text-xs font-extrabold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-4 cursor-pointer transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCell(null);
                }}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-full text-xs font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        );

      case "space":
        return (
          <div className="flex flex-col gap-5 text-left w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-extrabold text-[#FF385C] uppercase tracking-widest">
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
                        ? "bg-[#FF385C] text-white border-transparent shadow-md shadow-[#FF385C]/20"
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
          <div className="flex flex-col gap-5 text-left w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-extrabold text-[#FF385C] uppercase tracking-widest">
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
                        ? "bg-[#FF385C] text-white border-transparent shadow-lg shadow-[#FF385C]/30 scale-[1.02]"
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

  const location = activeTab === "Flat" ? flatLocation : interiorLocation;
  const locationLabel = location ? location.split(" ")[0] : "Anywhere";
  const secondLabel =
    activeTab === "Flat"
      ? flatBudget && flatBudget !== "Any Budget"
        ? flatBudget
        : "Any budget"
      : interiorSpaceType || "Space type";
  const thirdLabel =
    activeTab === "Flat"
      ? flatBedrooms ||
        (flatSize && flatSize !== "Any" ? flatSize : "Add details")
      : interiorDesignStyle || "Style type";

  return (
    <div className="w-full search-capsule-container relative">
      {/* Morphing Capsule Wrapper */}
      <div
        ref={capsuleRef}
        onClick={() => {
          if (collapsed) {
            onExpand?.();
          }
        }}
        className={cn(
          "w-full rounded-full border transition-all duration-300 ease-in-out relative select-none flex items-center overflow-hidden pointer-events-auto",
          collapsed
            ? "h-12 border border-[#DDDDDD] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 ease-[cubic-bezier(.2,0,0,1)] hover:border-[#CFCFCF] hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_20px_rgba(0,0,0,0.12)] cursor-pointer"
            : cn(
                "h-16 bg-white dark:bg-zinc-900 border border-[#DDDDDD] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_28px_rgba(0,0,0,0.06)] ",
                activeCell
                  ? "bg-[#EBEBEB] shadow-none dark:bg-zinc-950"
                  : "hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)]",
              ),
        )}
      >
        {/* Collapsed read-only view */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-between pl-6 pr-14 transition-all duration-300 ease-in-out w-full h-full",
            collapsed
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-90 pointer-events-none",
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand?.("location");
            }}
            className="flex items-center text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate hover:text-[#FF385C] dark:hover:text-[#FF385C] transition-colors cursor-pointer"
          >
            <span className="truncate max-w-[80px]">{locationLabel}</span>
          </button>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand?.(activeTab === "Flat" ? "budget" : "space");
            }}
            className="flex items-center text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate hover:text-[#FF385C] dark:hover:text-[#FF385C] transition-colors cursor-pointer"
          >
            <span
              className={cn(
                "truncate max-w-[90px]",
                (!flatBudget || flatBudget === "Any Budget") &&
                  activeTab === "Flat" &&
                  "text-zinc-550 dark:text-zinc-400 font-medium",
              )}
            >
              {secondLabel}
            </span>
          </button>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand?.(activeTab === "Flat" ? "home" : "style");
            }}
            className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate hover:text-[#FF385C] dark:hover:text-[#FF385C] transition-colors cursor-pointer"
          >
            <span className="truncate max-w-[100px]">{thirdLabel}</span>
          </button>
        </div>

        {/* Expanded interactive view */}
        <div
          className={cn(
            "w-full h-full flex items-center transition-all duration-300 ease-in-out",
            collapsed
              ? "opacity-0 scale-90 pointer-events-none absolute inset-0"
              : "opacity-100 scale-100 pointer-events-auto",
          )}
        >
          {/* Sliding Active Cell Highlight Bubble (Airbnb-style background pill slider) */}
          <div
            className="absolute top-0 bottom-0 bg-white dark:bg-zinc-800 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-350 ease-out z-10 pointer-events-none"
            style={highlightStyle}
          />

          {activeTab === "Flat" ? (
            /* Flat search layouts */
            <div className="flex flex-col md:flex-row md:items-center relative w-full h-full">
              {/* Location Selector */}
              <div ref={locationCellRef} className="flex-1 flex h-full z-20">
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
              <div ref={budgetCellRef} className="flex-1 flex h-full z-20">
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
              <div ref={homeCellRef} className="flex-1 flex h-full z-20">
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
          ) : (
            <div className="flex flex-col md:flex-row md:items-center relative w-full h-full">
              {/* Location Selector */}
              <div ref={locationCellRef} className="flex-1 flex h-full z-20">
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
              <div ref={spaceCellRef} className="flex-1 flex h-full z-20">
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
              <div ref={styleCellRef} className="flex-1 flex h-full z-20">
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
          )}
        </div>

        {/* Shared Absolute Search Button */}
        <div
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-in-out",
            collapsed
              ? "right-2 pointer-events-auto"
              : "right-3 hidden md:flex pointer-events-auto",
          )}
        >
          <button
            onClick={(e) => {
              if (collapsed) {
                e.stopPropagation();
                onExpand?.();
              } else {
                handleSearch(e);
              }
            }}
            className={cn(
              "rounded-full bg-[#FF385C] hover:bg-[#E61E4D] text-white flex items-center justify-center transition-all duration-300 ease-out active:scale-[0.97] overflow-hidden cursor-pointer",
              collapsed
                ? "size-8 shadow-sm shadow-red-500/20"
                : cn(
                    "shadow-md shadow-red-500/30 hover:shadow-lg",
                    activeCell
                      ? "w-[118px] h-12 px-5 justify-between"
                      : "size-12",
                  ),
            )}
          >
            <Search
              className={cn(
                "shrink-0 transition-all duration-300",
                collapsed ? "size-3.5 stroke-[2.5]" : "size-5",
              )}
            />
            {!collapsed && activeCell && (
              <span className="text-sm font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both">
                Search
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search button - visible only when expanded */}
      {!collapsed && (
        <div className="p-2 flex md:hidden items-center justify-center z-30">
          <Button
            onClick={handleSearch}
            className="w-full h-12 rounded-full bg-[#FF385C] hover:bg-[#E61E4D] text-white flex items-center justify-center shadow-md shadow-red-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.97]"
          >
            <Search className="size-5 shrink-0" />
            <span className="text-sm font-bold ml-2">Search</span>
          </Button>
        </div>
      )}

      {/* Shared Popup - Single popup for all fields with width + position animation */}
      {showPopup && activeCell && (
        <div
          className="absolute top-full mt-3 z-50 origin-top animate-in zoom-in-75 duration-500 pointer-events-auto"
          style={{
            left: popupStyle.left,
            transition: "left 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-[0_8px_28px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.5)] border border-zinc-100/80 dark:border-zinc-800/80 overflow-hidden max-w-[calc(100vw-32px)]"
            style={{
              width: popupStyle.width,
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
