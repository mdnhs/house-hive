"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Building,
  Maximize2,
  Users,
  Grid3X3,
  X,
  PhoneCall,
  Calendar,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle,
  GraduationCap,
  Activity,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Maximize,
  Minimize,
  Download,
} from "lucide-react";
import { useQueryStates, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";
import { FlatItem, FLATS_DATA, getCoordinates } from "@/lib/mockData";
import type { StyleSpecification } from "maplibre-gl";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { fetchModifiedStyle, LIGHT_STYLE_URL, DARK_STYLE_URL } from "@/lib/mapStyles";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/features/theme/hooks/useTheme";
import { useHeaderScroll } from "@/features/navigation/hooks/useHeaderScroll";
import { Header } from "@/features/navigation/components/Header";
import { Footer } from "@/features/navigation/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { ListingCard } from "@/features/properties/components/ListingCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import DownloadPlugin from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Share from "yet-another-react-lightbox/plugins/share";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface FlatDetailsClientProps {
  flat: FlatItem;
}

const detailsSchema = {
  inquiry: parseAsString.withDefault(""),
  step: parseAsString.withDefault("1"),
};

export function FlatDetailsClient({ flat }: FlatDetailsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { darkMode, setDarkMode } = useTheme();
  
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = React.useState(-1);
  const [showShareTooltip, setShowShareTooltip] = React.useState(false);

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

  // Sync inquiry modal overlay & step count via nuqs
  const [queryState, setQueryState] = useQueryStates(detailsSchema, {
    shallow: true,
  });

  // Local state for inquiry data collection
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [buyingTimeline, setBuyingTimeline] = React.useState("");
  const [inquiryBudget, setInquiryBudget] = React.useState("");
  const [contactTime, setContactTime] = React.useState("");
  const [additionalMessage, setAdditionalMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");

  // Pre-fill budget from search parameters if available
  React.useEffect(() => {
    const searchBudget = searchParams.get("budget");
    if (searchBudget) {
      // Map to closest option
      if (searchBudget.includes("50L - 1Cr")) setInquiryBudget("50 Lakh – 1 Crore");
      else if (searchBudget.includes("1Cr - 2Cr")) setInquiryBudget("1 – 2 Crore");
      else if (searchBudget.includes("2Cr+")) setInquiryBudget("2 Crore+");
      else if (searchBudget.includes("Under 50 Lakh")) setInquiryBudget("Under 50 Lakh");
    }
  }, [searchParams]);

  const {
    isOverlaySearchOpen,
    setIsOverlaySearchOpen,
    activeCell,
    setActiveCell,
  } = useHeaderScroll();

  const isScrolled = true; // Keep search bar collapsed in details page

  const isFavorite = favorites.includes(flat.id);
  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(flat.id)
        ? prev.filter((id) => id !== flat.id)
        : [...prev, flat.id]
    );
  };

  const toggleFavoriteId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const formatPrice = (priceLakh: number) => {
    if (priceLakh >= 100) {
      const cr = priceLakh / 100;
      return `৳${cr.toFixed(2).replace(/\.?0+$/, "")} Cr`;
    }
    return `৳${priceLakh} Lakh`;
  };

  // Vetted Real Estate specs fallbacks
  const bathrooms = flat.bathrooms ?? (flat.bedrooms >= 3 ? 3 : 2);
  const floorLevel = flat.floor ?? "5th";
  const parkingSlot = flat.parking ?? "1 Dedicated Space";
  const balconiesCount = flat.balconies ?? 2;
  const facingDirection = flat.facing ?? "South";
  const furnished = flat.furnishedStatus ?? "Semi-Furnished";

  // Nearby locations fallbacks
  const nearbySchools = flat.nearby?.schools ?? ["Scholastica School", "International School Dhaka", "Sunnydale"];
  const nearbyHospitals = flat.nearby?.hospitals ?? ["United Hospital", "Evercare Hospital Dhaka", "Apollo Health Clinic"];
  const nearbyShopping = flat.nearby?.shopping ?? ["Unimart Supermarket", "Pink City Mall", "Bashundhara City Complex"];

  // Developer Company Info fallbacks
  const developerLogo = flat.company?.logo ?? "/icons/icon-flat.png";
  const developerName = flat.company?.name ?? "Assure Group Properties Ltd.";
  const developerVerified = flat.company?.verified ?? true;
  const developerTotalListings = flat.company?.totalListings ?? 28;



  // Photo grid preparation (Airbnb 5-image style)
  const defaultHouseImages = [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60",
  ];
  const allImages = React.useMemo(() => [...flat.images, ...defaultHouseImages], [flat.images]);
  const gridImages = React.useMemo(() => allImages.slice(0, 5), [allImages]);

  // Progressive inquiry wizard submission
  const handleSubmitInquiry = () => {
    // Validate mobile number
    if (!mobileNumber.trim() || mobileNumber.length < 11) {
      setFormError("Please enter a valid 11-digit mobile number.");
      return;
    }
    setFormError("");

    const newLead = {
      leadId: `lead-prop-${Date.now()}`,
      propertyId: flat.id,
      propertyTitle: flat.title,
      type: "Property",
      mobileNumber,
      timeline: buyingTimeline || "Just Exploring",
      budget: inquiryBudget || "Under 50 Lakh",
      preferredContactTime: contactTime || "Anytime",
      message: additionalMessage || "I'd like to schedule a site visit.",
      status: "Created", // Created, Assigned, Contacted, Follow Up, Closed, Cancelled
      createdAt: new Date().toISOString(),
    };

    // Storing Lead Data in localStorage
    try {
      const existingLeads = JSON.parse(localStorage.getItem("house_hive_leads") || "[]");
      localStorage.setItem("house_hive_leads", JSON.stringify([...existingLeads, newLead]));
    } catch (e) {
      console.error("Failed to save lead:", e);
    }

    // Go to success state
    setQueryState({ step: "6" });
  };

  // Close inquiry modal and reset fields
  const handleCloseInquiry = () => {
    setQueryState({ inquiry: "", step: "1" });
    setMobileNumber("");
    setBuyingTimeline("");
    setContactTime("");
    setAdditionalMessage("");
    setFormError("");
  };

  // Similar & Related listings algorithms
  const similarProperties = React.useMemo(() => {
    return FLATS_DATA.filter((item) => item.id !== flat.id && item.bedrooms === flat.bedrooms).slice(0, 7);
  }, [flat]);

  const localAreaProperties = React.useMemo(() => {
    return FLATS_DATA.filter((item) => item.id !== flat.id && item.zone === flat.zone).slice(0, 7);
  }, [flat]);

  const featuredProperties = React.useMemo(() => {
    return FLATS_DATA.filter((item) => item.id !== flat.id && item.priceLakh > 200).slice(0, 7);
  }, [flat]);

  const headerSearchParams = {
    location: "",
  };

  const handleSearch = (params: {
    type: "Flat" | "Interior";
    location: string;
  }) => {
    const loc = params.location.trim() || "Anywhere";
    const slug = encodeURIComponent(loc.replace(/\s+/g, "-"));
    router.push(`/s/${slug}/homes?type=${params.type}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-sans">
      <Header
        activeTab="Flat"
        setActiveTab={() => {}}
        searchParams={headerSearchParams}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isScrolled={isScrolled}
        isOverlaySearchOpen={isOverlaySearchOpen}
        setIsOverlaySearchOpen={setIsOverlaySearchOpen}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        onSearch={handleSearch}
        onClearFilters={() => {}}
        onTabChange={() => {}}
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

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-12 pt-28 pb-16">
        {/* Title and Rating Row */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            {flat.priceLakh > 200 && (
              <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/50">
                ⭐ Featured Property
              </span>
            )}
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
              Property ID: {flat.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-[28px] font-black font-heading tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
            {flat.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 font-black text-zinc-900 dark:text-zinc-100">
                <Star className="size-4 fill-[#FF385C] text-[#FF385C] shrink-0" />
                {(
                  4.7 +
                  (parseInt(flat.id.replace(/\D/g, "")) || 0) * 0.05
                ).toFixed(2)}
              </span>
              <span>•</span>
              <span className="underline cursor-pointer">12 local inquiries</span>
              <span>•</span>
              <span className="underline cursor-pointer">{flat.location}, Dhaka</span>
            </div>

            <div className="flex items-center gap-4 relative">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                <Share2 className="size-4" />
                <span className="underline">Share</span>
              </button>
              {showShareTooltip && (
                <span className="absolute -top-8 left-0 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs px-2.5 py-1 rounded-md shadow-md font-bold whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 z-20">
                  Link copied to clipboard!
                </span>
              )}

              <button
                onClick={toggleFavorite}
                className="flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                <Heart
                  className={cn(
                    "size-4 transition-colors",
                    isFavorite ? "fill-[#FF385C] text-[#FF385C]" : "text-zinc-650"
                  )}
                />
                <span className="underline">{isFavorite ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Property Gallery (Airbnb 5-image style) */}
        <div className="relative mb-8 rounded-2xl overflow-hidden hidden md:grid grid-cols-4 grid-rows-2 gap-2 aspect-[16/9] w-full border border-zinc-200 dark:border-zinc-800">
          <div className="col-span-2 row-span-2 relative overflow-hidden group">
            <img
              src={gridImages[0]}
              alt="Listing main"
              className="size-full object-cover group-hover:scale-[1.01] transition-transform duration-500 cursor-pointer"
              onClick={() => setLightboxIndex(0)}
            />
          </div>
          {gridImages.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className="col-span-1 row-span-1 relative overflow-hidden group"
            >
              <img
                src={img}
                alt={`Listing flat details ${idx + 1}`}
                className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                onClick={() => setLightboxIndex(idx + 1)}
              />
            </div>
          ))}
          <button
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-5 right-5 bg-white hover:bg-zinc-50 text-zinc-950 font-extrabold text-xs px-4.5 py-3 rounded-xl border border-zinc-200 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Grid3X3 className="size-4" />
            Show all 5 photos
          </button>
        </div>

        {/* Mobile slide layout */}
        <div className="block md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-zinc-150">
          <img
            src={gridImages[0]}
            alt="Listing main view"
            className="size-full object-cover cursor-pointer"
            onClick={() => setLightboxIndex(0)}
          />
          <button
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-3 right-3 bg-white/95 text-zinc-950 text-xs px-3.5 py-2 rounded-xl border border-zinc-200 shadow-sm font-extrabold flex items-center gap-1.5"
          >
            <Grid3X3 className="size-3.5" />
            1 / 5 Photos
          </button>
        </div>

        {/* 2. Column Layout (Left info, Right Sticky Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8 text-left">
            {/* Property Overview */}
            <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-heading text-zinc-900 dark:text-zinc-50">
                  {flat.category} Property offered by verified agency
                </h2>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {flat.propertyType === "Plot" ? "Plot" : flat.propertyType === "Commercial Space" ? "Commercial Space" : (flat.category === "Duplex" ? "Duplex House" : flat.category === "Penthouse" ? "Penthouse" : "Apartment")} • For Sale • Vetted Security • {flat.location}
                </span>
              </div>
              <div className="size-12 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
                <Image
                  src={developerLogo}
                  alt={developerName}
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              </div>
            </div>

            {/* 3. Quick Information Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Bedrooms
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {flat.bedrooms} Bedrooms
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Bathrooms
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {bathrooms} Bathrooms
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Total Size
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {flat.sizeSqft} sqft
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  {flat.category === "Duplex" ? "Structure" : flat.category === "Penthouse" ? "Level" : "Floor Level"}
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {flat.category === "Duplex" ? "2-Level Duplex" : flat.category === "Penthouse" ? "Top Floor Penthouse" : `${floorLevel} Floor`}
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Parking
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1 truncate">
                  {parkingSlot}
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Balcony
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {balconiesCount} Balconies
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Facing
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {facingDirection} Facing
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Furnished Status
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {furnished}
                </span>
              </div>
            </div>

            {/* 4. Description */}
            <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <h4 className="text-base font-extrabold font-heading text-zinc-900 dark:text-zinc-150 mb-3">
                Property Description
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed font-semibold">
                This premium flat located at {flat.location} offers the pinnacle of residential luxury in Dhaka. Architecturally designed with focus on cross-ventilation, abundant natural daylighting, high-ceiling structure, and premium marble-look tiling. Located in a secure building zone with easy reach to supermarkets, recreational lakeside parks, and top-tier educational institutions. Vetted and ready for immediate handover.
              </p>
            </div>

            {/* 5. Amenities Vetted Grid */}
            <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <h4 className="text-base font-extrabold font-heading text-zinc-900 dark:text-zinc-150 mb-4">
                What this property offers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "Lift", active: true },
                  { name: "Generator", active: true },
                  { name: "24/7 Security", active: true },
                  { name: "Gas connection", active: flat.amenities.includes("Gas connection") || flat.id === "f2" },
                  { name: "CCTV Security", active: true },
                  { name: "Children's Play Area", active: flat.priceLakh > 150 },
                  { name: "Community Hall", active: flat.priceLakh > 200 },
                  { name: "Gym", active: flat.priceLakh > 220 },
                  { name: "Swimming Pool", active: flat.amenities.includes("Swimming Pool access") || flat.id === "f4" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-center gap-3 text-sm font-bold transition-opacity",
                      item.active ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-350 dark:text-zinc-650 opacity-40 line-through"
                    )}
                  >
                    <CheckCircle className={cn("size-4 shrink-0", item.active ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-750")} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Location Block (MapCN Mock grid map + lists) */}
            <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col gap-5">
              <h4 className="text-base font-extrabold font-heading text-zinc-900 dark:text-zinc-150">
                Location Details: {flat.location}, Dhaka
              </h4>

              {/* Real MapCN Map */}
              <div className="w-full h-72 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-2xl relative overflow-hidden shadow-inner">
                {mapStyles ? (
                  <Map
                    center={getCoordinates(flat.location, flat.zone)}
                    zoom={14}
                    className="w-full h-full"
                    styles={{ light: mapStyles.light, dark: mapStyles.dark }}
                  >
                    <MapMarker
                      longitude={getCoordinates(flat.location, flat.zone)[0]}
                      latitude={getCoordinates(flat.location, flat.zone)[1]}
                    >
                      <MarkerContent>
                        <div className="bg-[#FF385C] text-white p-2.5 rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                          <MapPin className="size-5 stroke-[2.5]" />
                        </div>
                      </MarkerContent>
                      <MarkerPopup closeButton={true}>
                        <div className="p-2 min-w-[200px]">
                          <div className="mb-1">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                              {flat.propertyType === "Plot" ? "Plot" : flat.propertyType === "Commercial Space" ? "Commercial Space" : `${flat.category} Property`}
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">{flat.title}</h5>
                          <p className="text-xs text-zinc-500 mt-0.5">{flat.location}</p>
                          <p className="text-xs font-semibold text-[#FF385C] mt-1.5">{flat.priceLakh >= 100 ? `৳${(flat.priceLakh / 100).toFixed(2).replace(/\.?0+$/, "")} Cr` : `৳${flat.priceLakh} Lakh`}</p>
                        </div>
                      </MarkerPopup>
                    </MapMarker>
                    <MapControls showZoom={true} showLocate={true} showFullscreen={true} />
                  </Map>
                ) : (
                  <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl animate-pulse flex items-center justify-center">
                    <Loader2 className="size-5 animate-spin text-zinc-400" />
                  </div>
                )}
              </div>

              {/* Nearby Lists */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#FF385C] uppercase tracking-wider">
                    <GraduationCap className="size-4" />
                    Nearby Schools
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-bold pl-1.5">
                    {nearbySchools.map((item) => <span key={item}>• {item}</span>)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#FF385C] uppercase tracking-wider">
                    <Activity className="size-4" />
                    Nearby Hospitals
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-bold pl-1.5">
                    {nearbyHospitals.map((item) => <span key={item}>• {item}</span>)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#FF385C] uppercase tracking-wider">
                    <ShoppingBag className="size-4" />
                    Shopping Hubs
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-bold pl-1.5">
                    {nearbyShopping.map((item) => <span key={item}>• {item}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Housing Company Info Section */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-[28px] border border-zinc-150/40 dark:border-zinc-850 flex items-center justify-between gap-6 text-left">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl overflow-hidden bg-white border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-sm p-1.5">
                  <Image
                    src={developerLogo}
                    alt={developerName}
                    width={56}
                    height={56}
                    className="size-full object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-extrabold text-zinc-850 dark:text-zinc-100 text-base leading-tight">
                      {developerName}
                    </h5>
                    {developerVerified && (
                      <CheckCircle className="size-4 text-emerald-500 fill-emerald-50 dark:fill-zinc-950 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-zinc-450 dark:text-zinc-500 mt-1 uppercase tracking-wider">
                    🏢 Real Estate Developer • {developerTotalListings} Vetted Listings
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-center justify-center px-4.5 py-3 border border-zinc-200 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900 shadow-xs shrink-0">
                <Award className="size-5 text-amber-500 mb-0.5" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Developer
                </span>
                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                  Vetted Partner
                </span>
              </div>
            </div>
          </div>

          {/* 8. Right Sticky Inquiry CTA Card */}
          <div className="lg:sticky lg:top-28 z-20">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150/80 dark:border-zinc-800 rounded-[32px] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] text-left flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                  {formatPrice(flat.priceLakh)}
                </span>
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
                  Property Value
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 mt-1">
                {/* Primary CTA */}
                <button
                  onClick={() => setQueryState({ inquiry: "true", step: "1" })}
                  className="w-full py-4 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] hover:opacity-95 active:scale-[0.98] text-white font-extrabold rounded-2xl text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md shadow-red-500/10 cursor-pointer transition-all text-center"
                >
                  <PhoneCall className="size-4 shrink-0" />
                  Request a Call
                </button>

                {/* Secondary CTA */}
                <button
                  disabled
                  className="w-full py-3.5 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 font-extrabold rounded-2xl text-xs tracking-widest uppercase border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center gap-2 cursor-not-allowed select-none"
                >
                  Schedule a Site Visit (Future)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PROPERTIES SECTIONS */}
        <div className="mt-16 pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-10 text-left">
          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="flex flex-col">
              <Carousel className="w-full" opts={{ align: "start" }}>
                <div className="flex items-end justify-between mb-6">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-150 mb-1">
                      Similar Properties
                    </h4>
                    <p className="text-xs text-zinc-405 dark:text-zinc-505">
                      Vetted property recommendations with matching bedroom counts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CarouselPrevious className="static translate-y-0 size-8 rounded-full" />
                    <CarouselNext className="static translate-y-0 size-8 rounded-full" />
                  </div>
                </div>

                <CarouselContent className="-ml-6">
                  {similarProperties.map((item) => (
                    <CarouselItem key={item.id} className="pl-6 basis-auto snap-start">
                      <div className="w-[187px]">
                        <ListingCard
                          images={item.images}
                          title={item.title}
                          location={item.location}
                          rating={(4.8 + (parseInt(item.id.replace(/\D/g, "")) || 0) * 0.03).toFixed(2)}
                          subTitle={item.propertyType === "Plot" ? "Plot" : item.propertyType === "Commercial Space" ? "Commercial Space" : `${item.bedrooms} Bed • ${item.sizeSqft} sqft`}
                          thirdLine={item.amenities.slice(0, 2).join(" • ")}
                          priceText={formatPrice(item.priceLakh)}
                          isFavorite={favorites.includes(item.id)}
                          onToggleFavorite={(e) => toggleFavoriteId(item.id, e)}
                          onClick={() => router.push(`/flat/${item.id}`)}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {/* Local Area Properties */}
          {localAreaProperties.length > 0 && (
            <div className="flex flex-col mt-6">
              <Carousel className="w-full" opts={{ align: "start" }}>
                <div className="flex items-end justify-between mb-6">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-150 mb-1">
                      More Properties in the Same Area
                    </h4>
                    <p className="text-xs text-zinc-405 dark:text-zinc-505">
                      Properties available in the {flat.zone} sector.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CarouselPrevious className="static translate-y-0 size-8 rounded-full" />
                    <CarouselNext className="static translate-y-0 size-8 rounded-full" />
                  </div>
                </div>

                <CarouselContent className="-ml-6">
                  {localAreaProperties.map((item) => (
                    <CarouselItem key={item.id} className="pl-6 basis-auto snap-start">
                      <div className="w-[187px]">
                        <ListingCard
                          images={item.images}
                          title={item.title}
                          location={item.location}
                          rating={(4.8 + (parseInt(item.id.replace(/\D/g, "")) || 0) * 0.03).toFixed(2)}
                          subTitle={item.propertyType === "Plot" ? "Plot" : item.propertyType === "Commercial Space" ? "Commercial Space" : `${item.bedrooms} Bed • ${item.sizeSqft} sqft`}
                          thirdLine={item.amenities.slice(0, 2).join(" • ")}
                          priceText={formatPrice(item.priceLakh)}
                          isFavorite={favorites.includes(item.id)}
                          onToggleFavorite={(e) => toggleFavoriteId(item.id, e)}
                          onClick={() => router.push(`/flat/${item.id}`)}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {/* Featured Properties */}
          {featuredProperties.length > 0 && (
            <div className="flex flex-col mt-6">
              <Carousel className="w-full" opts={{ align: "start" }}>
                <div className="flex items-end justify-between mb-6">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-150 mb-1">
                      Featured Premium Listings
                    </h4>
                    <p className="text-xs text-zinc-405 dark:text-zinc-505">
                      High-value luxury properties vetted for absolute quality.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CarouselPrevious className="static translate-y-0 size-8 rounded-full" />
                    <CarouselNext className="static translate-y-0 size-8 rounded-full" />
                  </div>
                </div>

                <CarouselContent className="-ml-6">
                  {featuredProperties.map((item) => (
                    <CarouselItem key={item.id} className="pl-6 basis-auto snap-start">
                      <div className="w-[187px]">
                        <ListingCard
                          images={item.images}
                          title={item.title}
                          location={item.location}
                          rating={(4.8 + (parseInt(item.id.replace(/\D/g, "")) || 0) * 0.03).toFixed(2)}
                          subTitle={item.propertyType === "Plot" ? "Plot" : item.propertyType === "Commercial Space" ? "Commercial Space" : `${item.bedrooms} Bed • ${item.sizeSqft} sqft`}
                          thirdLine={item.amenities.slice(0, 2).join(" • ")}
                          priceText={formatPrice(item.priceLakh)}
                          isFavorite={favorites.includes(item.id)}
                          onToggleFavorite={(e) => toggleFavoriteId(item.id, e)}
                          onClick={() => router.push(`/flat/${item.id}`)}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Gallery */}
      <Lightbox
        index={lightboxIndex}
        slides={allImages.map((src, idx) => ({
          src,
          title: flat.title,
          description: `Photo ${idx + 1} of ${allImages.length} • ${flat.location}`,
        }))}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        plugins={[Captions, Counter, DownloadPlugin, Fullscreen, Share, Slideshow, Thumbnails, Video, Zoom]}
        animation={{ zoom: 600 }}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 2,
          scrollToZoom: true,
        }}
        render={{
          iconPrev: () => <ChevronLeft className="size-6 text-white" />,
          iconNext: () => <ChevronRight className="size-6 text-white" />,
          iconClose: () => <X className="size-6 text-white" />,
          iconZoomIn: () => <ZoomIn className="size-5 text-white" />,
          iconZoomOut: () => <ZoomOut className="size-5 text-white" />,
          iconSlideshowPlay: () => <Play className="size-5 text-white" />,
          iconSlideshowPause: () => <Pause className="size-5 text-white" />,
          iconEnterFullscreen: () => <Maximize className="size-5 text-white" />,
          iconExitFullscreen: () => <Minimize className="size-5 text-white" />,
          iconDownload: () => <Download className="size-5 text-white" />,
          iconShare: () => <Share2 className="size-5 text-white" />,
        }}
      />

      {/* Progressive Step-by-Step Inquiry Dialog (Airbnb Style Modal) */}
      <Dialog open={queryState.inquiry === "true"} onOpenChange={(open) => !open && handleCloseInquiry()}>
        <DialogContent className="max-w-[420px] bg-white dark:bg-zinc-950 p-6 rounded-[32px] border border-zinc-150/40 dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.18)] outline-hidden overflow-hidden">
          <AnimatePresence mode="wait">
            {queryState.step === "1" && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4 text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#FF385C] font-black uppercase tracking-widest">
                    Step 1 of 5 • Verification
                  </span>
                  <h3 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-50 mt-1">
                    What is your mobile number?
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Mobile Number (Required)
                  </label>
                  <input
                    type="tel"
                    maxLength={11}
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value.replace(/\D/g, ""));
                      setFormError("");
                    }}
                    placeholder="e.g. 01712345678"
                    className="w-full p-3.5 border border-zinc-250 dark:border-zinc-700 bg-transparent rounded-2xl text-sm font-bold focus:outline-none focus:border-[#FF385C] dark:focus:border-[#FF385C]"
                  />
                  {formError && (
                    <span className="text-red-500 text-xs font-semibold">
                      {formError}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (mobileNumber.length < 11) {
                      setFormError("Please enter a valid 11-digit mobile number.");
                    } else {
                      setQueryState({ step: "2" });
                    }
                  }}
                  className="w-full mt-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-extrabold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              </motion.div>
            )}

            {queryState.step === "2" && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4 text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#FF385C] font-black uppercase tracking-widest">
                    Step 2 of 5 • Planning
                  </span>
                  <h3 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-50 mt-1">
                    When are you planning to buy?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Ready to Buy", "Within 1 Month", "Within 3 Months", "Just Exploring"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setBuyingTimeline(option);
                        setQueryState({ step: "3" });
                      }}
                      className={cn(
                        "p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-xs cursor-pointer hover:border-zinc-900 dark:hover:border-zinc-400 text-left transition-all",
                        buyingTimeline === option && "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 text-[#FF385C]"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={() => setQueryState({ step: "1" })}
                    className="flex-1 py-3 text-xs font-extrabold text-zinc-550 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {queryState.step === "3" && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4 text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#FF385C] font-black uppercase tracking-widest">
                    Step 3 of 5 • Budget
                  </span>
                  <h3 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-50 mt-1">
                    What is your budget limit?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Under 50 Lakh", "50 Lakh – 1 Crore", "1 – 2 Crore", "2 Crore+"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setInquiryBudget(option);
                        setQueryState({ step: "4" });
                      }}
                      className={cn(
                        "p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-xs cursor-pointer hover:border-zinc-900 dark:hover:border-zinc-400 text-left transition-all",
                        inquiryBudget === option && "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 text-[#FF385C]"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={() => setQueryState({ step: "2" })}
                    className="flex-1 py-3 text-xs font-extrabold text-zinc-550 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setQueryState({ step: "4" })}
                    className="flex-1 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-extrabold rounded-2xl"
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            )}

            {queryState.step === "4" && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4 text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#FF385C] font-black uppercase tracking-widest">
                    Step 4 of 5 • Timings
                  </span>
                  <h3 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-50 mt-1">
                    When is your preferred contact time?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Morning", "Afternoon", "Evening", "Anytime"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setContactTime(option);
                        setQueryState({ step: "5" });
                      }}
                      className={cn(
                        "p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-xs cursor-pointer hover:border-zinc-900 dark:hover:border-zinc-400 text-left transition-all",
                        contactTime === option && "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 text-[#FF385C]"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={() => setQueryState({ step: "3" })}
                    className="flex-1 py-3 text-xs font-extrabold text-zinc-550 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {queryState.step === "5" && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4 text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#FF385C] font-black uppercase tracking-widest">
                    Step 5 of 5 • Final Message
                  </span>
                  <h3 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-50 mt-1">
                    Additional notes for the agent
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Message (Optional)
                  </label>
                  <textarea
                    value={additionalMessage}
                    onChange={(e) => setAdditionalMessage(e.target.value)}
                    placeholder="I'd like to schedule a site visit."
                    className="w-full h-24 p-3.5 border border-zinc-250 dark:border-zinc-700 bg-transparent rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#FF385C] resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleSubmitInquiry}
                    className="w-full py-4 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-500/10"
                  >
                    <PhoneCall className="size-4" />
                    Request a Call
                  </button>
                  <button
                    onClick={() => setQueryState({ step: "4" })}
                    className="w-full py-3 text-xs font-extrabold text-zinc-505 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {queryState.step === "6" && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center text-center p-6"
              >
                <div className="size-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 flex items-center justify-center text-emerald-500 shadow-md">
                  <CheckCircle className="size-8 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black font-heading text-zinc-900 dark:text-zinc-50 mt-4 leading-tight">
                  Request Submitted!
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-2 max-w-[280px]">
                  Thank you! Our housing agent has been notified and will call you
                  back shortly.
                </p>
                <button
                  onClick={handleCloseInquiry}
                  className="w-full mt-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-extrabold text-xs tracking-wider uppercase rounded-2xl cursor-pointer"
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}


