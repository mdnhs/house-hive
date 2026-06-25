"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Heart, Sparkles, User, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlatItem, InteriorItem } from "@/lib/mockData";
import { ListingCard } from "./ListingCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const router = useRouter();
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
                onClick={() => router.push(`/flat/${flat.id}`)}
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
                onClick={() => router.push(`/interior/${interior.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState onReset={onClearFilters} />
        )
      )}

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
