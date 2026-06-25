"use client";

import * as React from "react";
import { MapPin, Heart, Sparkles, User, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlatItem, InteriorItem } from "@/lib/mockData";
import { ListingCard } from "./ListingCard";
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

      {/* Grid of Results */}
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
                isPriceBadge={true}
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
