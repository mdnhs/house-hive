"use client";

import * as React from "react";
import { MapPin, Heart, Sparkles, User, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlatItem, InteriorItem } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResultsGalleryProps {
  flats: FlatItem[];
  interiors: InteriorItem[];
  searchType: "Flat" | "Interior";
  onClearFilters: () => void;
}

export function ResultsGallery({
  flats,
  interiors,
  searchType,
  onClearFilters,
}: ResultsGalleryProps) {
  const [selectedFlat, setSelectedFlat] = React.useState<FlatItem | null>(null);
  const [selectedInterior, setSelectedInterior] = React.useState<InteriorItem | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);

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

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8">
      {/* Title / Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {searchType === "Flat" ? "Explore Premium Flats" : "Explore Curated Interiors"}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {searchType === "Flat" ? flats.length : interiors.length} listings match your selection
          </p>
        </div>
        {(searchType === "Flat" ? flats.length === 0 : interiors.length === 0) && (
          <button
            onClick={onClearFilters}
            className="text-xs font-bold text-zinc-900 dark:text-zinc-100 underline underline-offset-4 cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid of Results - styled exactly like Airbnb high-density listings grid */}
      {searchType === "Flat" ? (
        flats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-x-5 gap-y-10">
            {flats.map((flat) => (
              <ListingCard
                key={flat.id}
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
            ))}
          </div>
        ) : (
          <EmptyState onReset={onClearFilters} />
        )
      ) : (
        /* Interior Designs Grid */
        interiors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-x-5 gap-y-10">
            {interiors.map((interior) => (
              <ListingCard
                key={interior.id}
                images={interior.images}
                title={interior.title}
                location={interior.location}
                rating={(4.75 + (parseInt(interior.id.replace(/\D/g, "")) || 0) * 0.04).toFixed(2)}
                subTitle={`${interior.spaceType} Space`}
                thirdLine={interior.designer}
                priceText={interior.designStyle}
                isPriceBadge={true} // displays style tag differently
                isFavorite={favorites.includes(interior.id)}
                onToggleFavorite={(e) => toggleFavorite(interior.id, e)}
                onClick={() => setSelectedInterior(interior)}
              />
            ))}
          </div>
        ) : (
          <EmptyState onReset={onClearFilters} />
        )
      )}

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

                <p className="text-sm leading-relaxed text-zinc-550 dark:text-zinc-400">
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
    </div>
  );
}

/* Individual Listing Card with Carousel image sliders, navigation arrows and indicator dots */
interface ListingCardProps {
  images: string[];
  title: string;
  location: string;
  rating: string;
  subTitle: string;
  thirdLine: string;
  priceText: string;
  isPriceBadge?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}

function ListingCard({
  images,
  title,
  location,
  rating,
  subTitle,
  thirdLine,
  priceText,
  isPriceBadge = false,
  isFavorite,
  onToggleFavorite,
  onClick,
}: ListingCardProps) {
  const [activeImgIndex, setActiveImgIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col cursor-pointer select-none"
    >
      {/* Carousel Image container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(activeImgIndex * 100) / images.length}%)`,
          }}
        >
          {images.map((img, index) => (
            <div key={index} className="w-full h-full shrink-0">
              <img
                src={img}
                alt={`${title} view ${index + 1}`}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 flex items-center justify-center size-8 z-10 transition-transform active:scale-90"
        >
          <Heart
            className={cn(
              "size-5.5 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-200",
              isFavorite ? "fill-[#FF385C] text-[#FF385C]" : "fill-black/30 text-white"
            )}
          />
        </button>

        {/* Left/Right Slider Navigation Buttons (Visible on Hover like Airbnb) */}
        {isHovered && images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-7 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md hover:scale-[1.05] transition-all z-10"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-7 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md hover:scale-[1.05] transition-all z-10"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}

        {/* Slideshow Indicator Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-full transition-all duration-200",
                  index === activeImgIndex
                    ? "w-1.5 h-1.5 bg-white scale-110"
                    : "w-1.25 h-1.25 bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Aligned listing texts */}
      <div className="flex flex-col mt-3 gap-0.5 text-[15px]">
        <div className="flex items-start justify-between">
          <span className="font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[80%]">
            {location}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-zinc-850 dark:text-zinc-200">
            <Star className="size-3.5 fill-black text-black dark:fill-white dark:text-white shrink-0" />
            {rating}
          </span>
        </div>
        <span className="text-zinc-500 dark:text-zinc-400 text-sm truncate">
          {subTitle}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 text-xs truncate">
          {thirdLine}
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          {isPriceBadge ? (
            <span className="font-bold text-[#FF385C] text-xs uppercase tracking-wide">
              {priceText} Style
            </span>
          ) : (
            <>
              <span className="font-bold text-zinc-950 dark:text-zinc-50">
                {priceText}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm font-normal">
                total
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-zinc-50 dark:bg-zinc-900/10 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/80">
      <Info className="size-10 text-zinc-400 mb-3" />
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-200">
        No listings matched your filters
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-xs mt-1">
        Try adjusting your selection criteria, or click below to reset the filters.
      </p>
      <button
        onClick={onReset}
        className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
}
