"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle,
  X,
  Palette,
  Maximize2,
  Calendar,
  Layers,
  PhoneCall,
  Clock,
  Briefcase,
  Grid3X3,
} from "lucide-react";
import { useQueryStates, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";
import { InteriorItem, INTERIORS_DATA } from "@/lib/mockData";
import { useTheme } from "@/features/theme/hooks/useTheme";
import { useHeaderScroll } from "@/features/navigation/hooks/useHeaderScroll";
import { Header } from "@/features/navigation/components/Header";
import { Footer } from "@/features/navigation/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";

interface InteriorDetailsClientProps {
  interior: InteriorItem;
}

const detailsSchema = {
  inquiry: parseAsString.withDefault(""),
  step: parseAsString.withDefault("1"),
};

export function InteriorDetailsClient({ interior }: InteriorDetailsClientProps) {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();
  
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [showShareTooltip, setShowShareTooltip] = React.useState(false);

  // Sync inquiry modal overlay & step count via nuqs
  const [queryState, setQueryState] = useQueryStates(detailsSchema, {
    shallow: true,
  });

  // Local state for inquiry data collection
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [projectType, setProjectType] = React.useState("");
  const [estimatedBudget, setEstimatedBudget] = React.useState("");
  const [projectTimeline, setProjectTimeline] = React.useState("");
  const [additionalMessage, setAdditionalMessage] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const {
    isOverlaySearchOpen,
    setIsOverlaySearchOpen,
    activeCell,
    setActiveCell,
  } = useHeaderScroll();

  const isScrolled = true; // Keep search bar collapsed in details page

  const isFavorite = favorites.includes(interior.id);
  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(interior.id)
        ? prev.filter((id) => id !== interior.id)
        : [...prev, interior.id]
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  // Interior design details fallbacks
  const areaSqft = 1200;
  const completionTime = interior.completionTime ?? "8 Weeks";
  const designStyle = interior.designStyle ?? "Contemporary";
  const materialsUsed = interior.materialsUsed ?? ["HPL Board", "MDF Board", "Duco Paint", "Profile Spotlights", "Gorilla Glass"];
  const estimatedBudgetRange = interior.estimatedBudgetRange ?? "৳8L - ৳12L";

  // Company info fallbacks
  const companyLogo = "/icons/icon-interior.png";
  const companyName = interior.designer;
  const companyVerified = true;
  const companyTotalProjects = 34;
  const companyExperienceYears = 6;

  // Photo grid preparation (Airbnb 5-image style)
  const defaultPortfolioImages = [
    "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
  ];
  const gridImages = [...interior.images, ...defaultPortfolioImages].slice(0, 5);

  // Progressive inquiry wizard submission
  const handleSubmitInquiry = () => {
    // Validate mobile number
    if (!mobileNumber.trim() || mobileNumber.length < 11) {
      setFormError("Please enter a valid 11-digit mobile number.");
      return;
    }
    setFormError("");

    const newLead = {
      leadId: `lead-int-${Date.now()}`,
      projectId: interior.id,
      projectTitle: interior.title,
      type: "Interior",
      mobileNumber,
      projectType: projectType || "Entire Apartment",
      budget: estimatedBudget || "Under 3 Lakh",
      timeline: projectTimeline || "Just Planning",
      message: additionalMessage || "I'm looking for a modern minimalist interior design.",
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
    setProjectType("");
    setEstimatedBudget("");
    setProjectTimeline("");
    setAdditionalMessage("");
    setFormError("");
  };

  // Similar & Related project recommendations
  const similarProjects = React.useMemo(() => {
    return INTERIORS_DATA.filter((item) => item.id !== interior.id && item.spaceType === interior.spaceType).slice(0, 3);
  }, [interior]);

  const localAreaProjects = React.useMemo(() => {
    return INTERIORS_DATA.filter((item) => item.id !== interior.id && item.zone === interior.zone).slice(0, 3);
  }, [interior]);

  const featuredProjects = React.useMemo(() => {
    return INTERIORS_DATA.filter((item) => item.id !== interior.id && item.category === "Luxury").slice(0, 3);
  }, [interior]);

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
        activeTab="Interior"
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
            {interior.category === "Luxury" && (
              <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/50">
                💎 Premium Design
              </span>
            )}
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
              Project Portfolio ID: {interior.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-[28px] font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
            {interior.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 font-black text-zinc-900 dark:text-zinc-100">
                <Star className="size-4 fill-[#FF385C] text-[#FF385C] shrink-0" />
                {(
                  4.75 +
                  (parseInt(interior.id.replace(/\D/g, "")) || 0) * 0.03
                ).toFixed(2)}
              </span>
              <span>•</span>
              <span className="underline cursor-pointer">18 project inquiries</span>
              <span>•</span>
              <span className="underline cursor-pointer">{interior.location}, Dhaka</span>
            </div>

            <div className="flex items-center gap-4 relative">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                <Share2 className="size-4" />
                <span className="underline">Share Portfolio</span>
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

        {/* 1. Project Gallery (Airbnb 5-image style) */}
        <div className="relative mb-8 rounded-2xl overflow-hidden hidden md:grid grid-cols-4 grid-rows-2 gap-2 aspect-[16/9] w-full border border-zinc-200 dark:border-zinc-800">
          <div className="col-span-2 row-span-2 relative overflow-hidden group">
            <img
              src={gridImages[0]}
              alt="Listing main"
              className="size-full object-cover group-hover:scale-[1.01] transition-transform duration-500 cursor-pointer"
              onClick={() => setIsGalleryOpen(true)}
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
                onClick={() => setIsGalleryOpen(true)}
              />
            </div>
          ))}
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="absolute bottom-5 right-5 bg-white hover:bg-zinc-50 text-zinc-955 font-extrabold text-xs px-4.5 py-3 rounded-xl border border-zinc-200 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
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
            onClick={() => setIsGalleryOpen(true)}
          />
          <button
            onClick={() => setIsGalleryOpen(true)}
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
            {/* Project Overview */}
            <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {interior.designStyle} Portfolio curated by {interior.designer}
                </h2>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {interior.spaceType} • Design Consultation • Vetted Materials • {interior.location}
                </span>
              </div>
              <div className="size-12 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
                <Image
                  src={companyLogo}
                  alt={companyName}
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              </div>
            </div>

            {/* 3. Project Information Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Space Type
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {interior.spaceType}
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Area Size
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {areaSqft} Sqft
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Completion
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {completionTime}
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">
                  Design Style
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-250 mt-1">
                  {designStyle}
                </span>
              </div>
            </div>

            {/* 4. Project Description */}
            <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-150 mb-3">
                Project Portfolio Description
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed font-semibold">
                This project represents a beautiful custom makeover designed for premium flats in Dhaka. Leveraging {designStyle} design theories, our design agency, {companyName}, crafted a space that balances visual aesthetics with day-to-day utility. Features smart space-saving custom carpentry, premium textures, modern false ceilings, and integrated spotlight fitments.
              </p>
            </div>

            {/* Optional Materials Used */}
            {materialsUsed.length > 0 && (
              <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-150 mb-4">
                  Materials Vetted & Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {materialsUsed.map((mat) => (
                    <span
                      key={mat}
                      className="px-3.5 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-850 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300"
                    >
                      🛠️ {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Company Information Block (No contact details) */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-[28px] border border-zinc-150/40 dark:border-zinc-850 flex items-center justify-between gap-6 text-left">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl overflow-hidden bg-white border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-sm p-1.5">
                  <Image
                    src={companyLogo}
                    alt={companyName}
                    width={56}
                    height={56}
                    className="size-full object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-extrabold text-zinc-850 dark:text-zinc-100 text-base leading-tight">
                      {companyName}
                    </h5>
                    {companyVerified && (
                      <CheckCircle className="size-4 text-emerald-500 fill-emerald-50 dark:fill-zinc-950 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-zinc-450 dark:text-zinc-500 mt-1 uppercase tracking-wider">
                    📐 Interior Design Studio • {companyTotalProjects} Projects • {companyExperienceYears} Years Exp
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-center justify-center px-4.5 py-3 border border-zinc-200 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900 shadow-xs shrink-0">
                <Award className="size-5 text-amber-500 mb-0.5" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Experience
                </span>
                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                  Top Agency
                </span>
              </div>
            </div>
          </div>

          {/* 6. Right Sticky Consultation Card */}
          <div className="lg:sticky lg:top-28 z-20">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150/80 dark:border-zinc-800 rounded-[32px] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] text-left flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                  {estimatedBudgetRange}
                </span>
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
                  Estimated Project Cost Range
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-1">
                {/* Primary CTA */}
                <button
                  onClick={() => setQueryState({ inquiry: "true", step: "1" })}
                  className="w-full py-4 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] hover:opacity-95 active:scale-[0.98] text-white font-extrabold rounded-2xl text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md shadow-red-500/10 cursor-pointer transition-all text-center animate-pulse"
                >
                  <Palette className="size-4 shrink-0" />
                  Request Consultation
                </button>
              </div>

              {/* Consultation detail pointers */}
              <div className="flex flex-col gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4 text-xs font-semibold text-zinc-500 dark:text-zinc-450 leading-relaxed pl-1">
                <div className="flex items-start gap-2.5">
                  <Clock className="size-4 text-[#FF385C] shrink-0 mt-0.5" />
                  <span>Kickoff layout consult meeting scheduled within 48 hours.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Briefcase className="size-4 text-[#FF385C] shrink-0 mt-0.5" />
                  <span>Includes dynamic 3D layouts and accurate material catalogues.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PROJECTS SECTIONS */}
        <div className="mt-16 pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-10 text-left">
          {/* Similar Projects */}
          {similarProjects.length > 0 && (
            <div className="flex flex-col">
              <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-150 mb-1">
                Similar Projects
              </h4>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
                Design portfolios matching the same space type focus.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {similarProjects.map((item) => (
                  <RelatedProjectCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* More Projects in Same Area */}
          {localAreaProjects.length > 0 && (
            <div className="flex flex-col mt-4">
              <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-150 mb-1">
                More Projects in the Same Area
              </h4>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
                Design company portfolio items executed in the {interior.zone} sector.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {localAreaProjects.map((item) => (
                  <RelatedProjectCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Featured Premium Projects */}
          {featuredProjects.length > 0 && (
            <div className="flex flex-col mt-4">
              <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-150 mb-1">
                Featured Luxury Portfolio Items
              </h4>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
                High-end custom interior designs vetted for absolute visual wow factor.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {featuredProjects.map((item) => (
                  <RelatedProjectCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Gallery Modal Fullscreen Grid */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl h-[90vh] bg-white dark:bg-zinc-950 p-6 overflow-y-auto rounded-[32px] border border-zinc-150/40 dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                All Portfolio Photos
              </h2>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gridImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery view ${idx + 1}`}
                  className="w-full aspect-[4/3] object-cover rounded-2xl border border-zinc-150/40 dark:border-zinc-800 shadow-sm"
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    Step 1 of 5 • Contact Details
                  </span>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-1">
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
                    Step 2 of 5 • Project Type
                  </span>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-1">
                    What project type are you planning?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Entire Apartment", "Living Room", "Bedroom", "Kitchen", "Dining Room", "Office"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setProjectType(option);
                        setQueryState({ step: "3" });
                      }}
                      className={cn(
                        "p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-xs cursor-pointer hover:border-zinc-900 dark:hover:border-zinc-400 text-left transition-all",
                        projectType === option && "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 text-[#FF385C]"
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
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-1">
                    What is your design budget?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Under 3 Lakh", "3 – 5 Lakh", "5 – 10 Lakh", "10 – 20 Lakh", "20 Lakh+"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setEstimatedBudget(option);
                        setQueryState({ step: "4" });
                      }}
                      className={cn(
                        "p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-xs cursor-pointer hover:border-zinc-900 dark:hover:border-zinc-400 text-left transition-all",
                        estimatedBudget === option && "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 text-[#FF385C]"
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
                    Step 4 of 5 • Timeline
                  </span>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-1">
                    When would you like to start?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Immediately", "Within 1 Month", "Within 3 Months", "Just Planning"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setProjectTimeline(option);
                        setQueryState({ step: "5" });
                      }}
                      className={cn(
                        "p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-xs cursor-pointer hover:border-zinc-900 dark:hover:border-zinc-400 text-left transition-all",
                        projectTimeline === option && "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10 text-[#FF385C]"
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
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-1">
                    Additional notes for the designer
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Message (Optional)
                  </label>
                  <textarea
                    value={additionalMessage}
                    onChange={(e) => setAdditionalMessage(e.target.value)}
                    placeholder="I'm looking for a modern minimalist interior design."
                    className="w-full h-24 p-3.5 border border-zinc-250 dark:border-zinc-700 bg-transparent rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#FF385C] resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleSubmitInquiry}
                    className="w-full py-4 bg-gradient-to-r from-[#FF385C] to-[#BD1E59] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-500/10"
                  >
                    <PhoneCall className="size-4" />
                    Request Consultation
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
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-4 leading-tight">
                  Consultation Booked!
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-2 max-w-[280px]">
                  Thank you! Our design team has been notified and will call you
                  back shortly to discuss details.
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

// Sub-component related project card
function RelatedProjectCard({ item }: { item: InteriorItem }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/interior/${item.id}`)}
      className="group bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <img
          src={item.images[0]}
          alt={item.title}
          className="size-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">
          {item.designStyle}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <span className="text-[10px] font-black text-zinc-450 uppercase tracking-widest truncate">
          {item.location}
        </span>
        <h5 className="font-extrabold text-sm text-zinc-850 dark:text-zinc-200 truncate group-hover:text-[#FF385C] transition-colors leading-tight">
          {item.title}
        </h5>
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-450 mt-1">
          {item.spaceType} • {item.designer}
        </span>
      </div>
    </div>
  );
}
