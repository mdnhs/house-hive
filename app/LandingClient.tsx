"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, Heart, Star, Info } from "lucide-react";
import { useTheme } from "@/features/theme/hooks/useTheme";
import { useHeaderScroll } from "@/features/navigation/hooks/useHeaderScroll";
import { Header } from "@/features/navigation/components/Header";
import { Footer } from "@/features/navigation/components/Footer";
import { ListingCard } from "@/features/properties/components/ListingCard";
import { FLATS_DATA, INTERIORS_DATA, FlatItem, InteriorItem } from "@/lib/mockData";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const GETAWAY_TABS = [
  "Popular Zones",
  "Residential Flats",
  "Interior Design Studios",
  "Commercial Hubs",
];

const GETAWAY_LINKS: Record<string, { city: string; category: string; slug: string }[]> = {
  "Popular Zones": [
    { city: "Gulshan", category: "Luxury Apartments", slug: "Gulshan" },
    { city: "Banani", category: "Modern Flats", slug: "Banani" },
    { city: "Dhanmondi", category: "Heritage Homes", slug: "Dhanmondi" },
    { city: "Uttara", category: "Family Properties", slug: "Uttara" },
    { city: "Mirpur", category: "Budget Apartments", slug: "Mirpur" },
    { city: "Bashundhara", category: "Quiet Residences", slug: "Bashundhara" },
  ],
  "Residential Flats": [
    { city: "Gulshan 2", category: "3-Bed Lake View", slug: "Gulshan-2" },
    { city: "Banani Road 11", category: "Cozy 2-Bed Flats", slug: "Banani-Road-11" },
    { city: "Bashundhara Block B", category: "Family Apartments", slug: "Bashundhara-Block-B" },
    { city: "Uttara Sector 11", category: "Compact 1-Bed Flats", slug: "Uttara-Sector-11" },
    { city: "Mirpur DOHS", category: "Secure 3-Bed Flats", slug: "Mirpur-DOHS" },
    { city: "Dhanmondi Road 27", category: "Luxury 4-Bed Suites", slug: "Dhanmondi-Road-27" },
  ],
  "Interior Design Studios": [
    { city: "Banani Block H", category: "Studio Hive Design", slug: "Banani" },
    { city: "Gulshan Avenue", category: "Aura Interiors BD", slug: "Gulshan" },
    { city: "Bashundhara R/A", category: "Vanguard Studio", slug: "Bashundhara" },
    { city: "Dhanmondi R/A", category: "Heritage Interiors", slug: "Dhanmondi" },
    { city: "Uttara Sector 7", category: "Deco Crafts BD", slug: "Uttara" },
    { city: "Mirpur DOHS", category: "Crafted Spaces", slug: "Mirpur" },
  ],
  "Commercial Hubs": [
    { city: "Gulshan 1", category: "Commercial Offices", slug: "Gulshan-1" },
    { city: "Banani Block A", category: "Corporate Spaces", slug: "Banani" },
    { city: "Dhanmondi Road 15", category: "Retail Buildings", slug: "Dhanmondi" },
    { city: "Uttara Sector 3", category: "Mixed-use Spaces", slug: "Uttara" },
  ],
};

interface ScrollRowProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function ScrollRow({ title, subtitle, children }: ScrollRowProps) {
  const rowRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Row Header with Navigation (Top Right) */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex items-center justify-center size-9 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="size-4.5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex items-center justify-center size-9 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="size-4.5" />
          </button>
        </div>
      </div>

      {/* Row Content */}
      <div className="relative w-full">
        <div
          ref={rowRef}
          className="w-full flex gap-5 overflow-x-auto snap-x scrollbar-none pb-4 scroll-smooth"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function LandingClient() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();
  const [activeTab, setActiveTab] = React.useState<"Flat" | "Interior">("Flat");
  const [searchParams, setSearchParams] = React.useState({ location: "" });
  const [activeGetawayTab, setActiveGetawayTab] = React.useState("Popular Zones");

  const [selectedFlat, setSelectedFlat] = React.useState<FlatItem | null>(null);
  const [selectedInterior, setSelectedInterior] = React.useState<InteriorItem | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const {
    isScrolled,
    isOverlaySearchOpen,
    setIsOverlaySearchOpen,
    activeCell,
    setActiveCell,
  } = useHeaderScroll();

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const formatPrice = (priceLakh: number) => {
    if (priceLakh >= 100) {
      const cr = priceLakh / 100;
      return `৳${cr.toFixed(2).replace(/\.?0+$/, "")} Cr`;
    }
    return `৳${priceLakh} Lakh`;
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

  const handleDestinationClick = (name: string) => {
    const slug = encodeURIComponent(name.replace(/\s+/g, "-"));
    router.push(`/s/${slug}/homes?type=Flat`);
  };

  const handleInteriorStyleClick = (style: string) => {
    router.push(`/s/Anywhere/homes?type=Interior&designStyle=${style}`);
  };

  // Filter collections for Landing rows
  const guestFavorites = React.useMemo(() => FLATS_DATA.slice(0, 7), []);
  const gulshanBananiStays = React.useMemo(
    () => FLATS_DATA.filter((f) => f.zone === "Gulshan" || f.zone === "Banani"),
    []
  );
  const bashundharaUttaraStays = React.useMemo(
    () => FLATS_DATA.filter((f) => f.zone === "Bashundhara" || f.zone === "Uttara"),
    []
  );
  const interiorDesigns = React.useMemo(() => INTERIORS_DATA, []);
  const livingBedroomInteriors = React.useMemo(
    () => INTERIORS_DATA.filter((i) => i.spaceType === "Living Room" || i.spaceType === "Bedroom"),
    []
  );
  const kitchenDiningInteriors = React.useMemo(
    () => INTERIORS_DATA.filter((i) => i.spaceType === "Kitchen" || i.spaceType === "Dining"),
    []
  );

  return (
    <div className="flex-1 bg-linear-to-b from-white via-white to-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen transition-colors duration-300 font-sans">
      {/* Hide Scrollbars Utility Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchParams={searchParams}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isScrolled={isScrolled}
        isOverlaySearchOpen={isOverlaySearchOpen}
        setIsOverlaySearchOpen={setIsOverlaySearchOpen}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        onSearch={handleSearch}
        onClearFilters={() => setSearchParams({ location: "" })}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchParams({ location: "" });
        }}
      />

      {isScrolled && isOverlaySearchOpen && (
        <div
          onClick={() => {
            setIsOverlaySearchOpen(false);
            setActiveCell(null);
          }}
          className="fixed inset-0 bg-black/25 z-40 backdrop-blur-[2px] animate-in fade-in duration-200"
        />
      )}

      <main className={!isScrolled || isOverlaySearchOpen ? "pt-50" : "pt-20"}>
        
        {/* Listing Sections (Airbnb Layout Rows) */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 flex flex-col gap-12">
          
          {activeTab === "Flat" ? (
            <>
              {/* Row 1: Guest Favorites */}
              <ScrollRow
                title="Featured properties for sale"
                subtitle="Top-rated houses and apartments vetted by premium real estate sellers."
              >
                {guestFavorites.map((flat) => (
                  <div key={flat.id} className="w-[260px] sm:w-[290px] md:w-[calc((100%-60px)/4)] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/7)] shrink-0 snap-start">
                    <ListingCard
                      images={flat.images}
                      title={flat.title}
                      location={flat.location}
                      rating={(4.8 + (parseInt(flat.id.replace(/\D/g, "")) || 0) * 0.03).toFixed(2)}
                      subTitle={`${flat.bedrooms} Bed • ${flat.sizeSqft} sqft`}
                      thirdLine={flat.amenities.slice(0, 2).join(" • ")}
                      priceText={formatPrice(flat.priceLakh)}
                      isFavorite={favorites.includes(flat.id)}
                      onToggleFavorite={(e) => toggleFavorite(flat.id, e)}
                      onClick={() => setSelectedFlat(flat)}
                    />
                  </div>
                ))}
              </ScrollRow>

              {/* Row 2: Premium apartments in Gulshan & Banani */}
              <ScrollRow
                title="Premium apartments in Gulshan & Banani"
                subtitle="Discover luxury properties for sale located in prime business and residential sectors."
              >
                {gulshanBananiStays.map((flat) => (
                  <div key={flat.id} className="w-[260px] sm:w-[290px] md:w-[calc((100%-60px)/4)] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/7)] shrink-0 snap-start">
                    <ListingCard
                      images={flat.images}
                      title={flat.title}
                      location={flat.location}
                      rating={(4.7 + (parseInt(flat.id.replace(/\D/g, "")) || 0) * 0.05).toFixed(2)}
                      subTitle={`${flat.bedrooms} Bed • ${flat.sizeSqft} sqft`}
                      thirdLine={flat.amenities.slice(0, 2).join(" • ")}
                      priceText={formatPrice(flat.priceLakh)}
                      isFavorite={favorites.includes(flat.id)}
                      onToggleFavorite={(e) => toggleFavorite(flat.id, e)}
                      onClick={() => setSelectedFlat(flat)}
                    />
                  </div>
                ))}
              </ScrollRow>

              {/* Row 3: Apartments in Bashundhara & Uttara */}
              <ScrollRow
                title="Apartments in Bashundhara & Uttara"
                subtitle="Browse secure, comfortable family homes for sale in serene communities."
              >
                {bashundharaUttaraStays.map((flat) => (
                  <div key={flat.id} className="w-[260px] sm:w-[290px] md:w-[calc((100%-60px)/4)] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/7)] shrink-0 snap-start">
                    <ListingCard
                      images={flat.images}
                      title={flat.title}
                      location={flat.location}
                      rating={(4.65 + (parseInt(flat.id.replace(/\D/g, "")) || 0) * 0.04).toFixed(2)}
                      subTitle={`${flat.bedrooms} Bed • ${flat.sizeSqft} sqft`}
                      thirdLine={flat.amenities.slice(0, 2).join(" • ")}
                      priceText={formatPrice(flat.priceLakh)}
                      isFavorite={favorites.includes(flat.id)}
                      onToggleFavorite={(e) => toggleFavorite(flat.id, e)}
                      onClick={() => setSelectedFlat(flat)}
                    />
                  </div>
                ))}
              </ScrollRow>
            </>
          ) : (
            <>
              {/* Row 1: Featured interior projects */}
              <ScrollRow
                title="Featured interior design projects"
                subtitle="Top-rated custom design makeovers created by premium local interior agencies."
              >
                {interiorDesigns.slice(0, 7).map((interior) => (
                  <div key={interior.id} className="w-[260px] sm:w-[290px] md:w-[calc((100%-60px)/4)] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/7)] shrink-0 snap-start">
                    <ListingCard
                      images={interior.images}
                      title={interior.title}
                      location={interior.location}
                      rating={(4.75 + (parseInt(interior.id.replace(/\D/g, "")) || 0) * 0.03).toFixed(2)}
                      subTitle={`${interior.spaceType} Space`}
                      thirdLine={interior.designer}
                      priceText={interior.designStyle}
                      isPriceBadge={true}
                      isFavorite={favorites.includes(interior.id)}
                      onToggleFavorite={(e) => toggleFavorite(interior.id, e)}
                      onClick={() => setSelectedInterior(interior)}
                    />
                  </div>
                ))}
              </ScrollRow>

              {/* Row 2: Living Room & Bedroom projects */}
              <ScrollRow
                title="Living Room & Bedroom designs"
                subtitle="Explore cozy and luxury layouts for private spaces."
              >
                {livingBedroomInteriors.map((interior) => (
                  <div key={interior.id} className="w-[260px] sm:w-[290px] md:w-[calc((100%-60px)/4)] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/7)] shrink-0 snap-start">
                    <ListingCard
                      images={interior.images}
                      title={interior.title}
                      location={interior.location}
                      rating={(4.7 + (parseInt(interior.id.replace(/\D/g, "")) || 0) * 0.04).toFixed(2)}
                      subTitle={`${interior.spaceType} Space`}
                      thirdLine={interior.designer}
                      priceText={interior.designStyle}
                      isPriceBadge={true}
                      isFavorite={favorites.includes(interior.id)}
                      onToggleFavorite={(e) => toggleFavorite(interior.id, e)}
                      onClick={() => setSelectedInterior(interior)}
                    />
                  </div>
                ))}
              </ScrollRow>

              {/* Row 3: Kitchen & Dining solutions */}
              <ScrollRow
                title="Kitchen & Dining designs"
                subtitle="Modern utility, built-in cabinet options, and open dining layouts."
              >
                {kitchenDiningInteriors.map((interior) => (
                  <div key={interior.id} className="w-[260px] sm:w-[290px] md:w-[calc((100%-60px)/4)] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/7)] shrink-0 snap-start">
                    <ListingCard
                      images={interior.images}
                      title={interior.title}
                      location={interior.location}
                      rating={(4.65 + (parseInt(interior.id.replace(/\D/g, "")) || 0) * 0.05).toFixed(2)}
                      subTitle={`${interior.spaceType} Space`}
                      thirdLine={interior.designer}
                      priceText={interior.designStyle}
                      isPriceBadge={true}
                      isFavorite={favorites.includes(interior.id)}
                      onToggleFavorite={(e) => toggleFavorite(interior.id, e)}
                      onClick={() => setSelectedInterior(interior)}
                    />
                  </div>
                ))}
              </ScrollRow>
            </>
          )}

        </div>

        {/* Inspiration for Getaways Section (Airbnb Style) */}
        <section className="bg-[#F7F7F7] dark:bg-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/80 py-14">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-6">
              Browse properties & design companies by region
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-none gap-6 mb-8">
              {GETAWAY_TABS.map((tab) => {
                const isActive = activeGetawayTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveGetawayTab(tab)}
                    className={cn(
                      "pb-4 font-bold text-sm tracking-wide transition-all duration-200 border-b-2 whitespace-nowrap cursor-pointer",
                      isActive
                        ? "text-zinc-900 dark:text-zinc-50 border-zinc-900 dark:border-zinc-50"
                        : "text-zinc-450 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 border-transparent"
                    )}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Link Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-y-6 gap-x-4">
              {GETAWAY_LINKS[activeGetawayTab]?.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => handleDestinationClick(link.city)}
                  className="flex flex-col cursor-pointer group"
                >
                  <span className="text-sm font-bold text-zinc-850 dark:text-zinc-200 group-hover:underline">
                    {link.city}
                  </span>
                  <span className="text-[11px] text-zinc-450 dark:text-zinc-500 mt-0.5">
                    {link.category}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* Flat Details Dialog */}
      <Dialog open={!!selectedFlat} onOpenChange={(open) => !open && setSelectedFlat(null)}>
        <DialogContent className="max-w-xl sm:max-w-2xl bg-white dark:bg-zinc-950 p-0 overflow-hidden rounded-[32px] border border-zinc-150/40 dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          {selectedFlat && (
            <div className="flex flex-col">
              <div className="relative aspect-[16/10] w-full">
                <img
                  src={selectedFlat.images[0]}
                  alt={selectedFlat.title}
                  className="size-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 dark:bg-zinc-900/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-bold tracking-wide">
                  {formatPrice(selectedFlat.priceLakh)} total
                </div>
              </div>
              <div className="p-8 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#FF385C] uppercase tracking-wider">
                    <MapPin className="size-3.5" />
                    {selectedFlat.location}
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {selectedFlat.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800/85">
                  <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-[20px]">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">Bedrooms</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                      {selectedFlat.bedrooms} Bedrooms
                    </span>
                  </div>
                  <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-[20px]">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">Total Area</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                      {selectedFlat.sizeSqft} sqft
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-555 uppercase tracking-wider">Key Amenities</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedFlat.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-3.5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4">
                  <button
                    onClick={() => setSelectedFlat(null)}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Interior Details Dialog */}
      <Dialog open={!!selectedInterior} onOpenChange={(open) => !open && setSelectedInterior(null)}>
        <DialogContent className="max-w-xl sm:max-w-2xl bg-white dark:bg-zinc-950 p-0 overflow-hidden rounded-[32px] border border-zinc-150/40 dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          {selectedInterior && (
            <div className="flex flex-col">
              <div className="relative aspect-[16/10] w-full">
                <img
                  src={selectedInterior.images[0]}
                  alt={selectedInterior.title}
                  className="size-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 dark:bg-zinc-900/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-bold tracking-wide">
                  {selectedInterior.designStyle} Style
                </div>
              </div>
              <div className="p-8 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#FF385C] uppercase tracking-wider">
                    <MapPin className="size-3.5" />
                    {selectedInterior.location}
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {selectedInterior.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800/85">
                  <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-[20px]">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">Space Type</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                      {selectedInterior.spaceType}
                    </span>
                  </div>
                  <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-[20px]">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-extrabold tracking-widest">Designer Studio</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                      {selectedInterior.designer}
                    </span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-zinc-555 dark:text-zinc-400">
                  This custom design showcases high-end finishes, bespoke furniture layouts, and curated light fixtures designed to bring comfort, functionality, and elevated aesthetic appeal to the home space.
                </p>

                <div className="flex items-center justify-end mt-4">
                  <button
                    onClick={() => setSelectedInterior(null)}
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
