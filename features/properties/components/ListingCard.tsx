"use client";

import * as React from "react";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function ListingCard({
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

        {/* Left/Right Slider Navigation Buttons */}
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

      <div className="flex flex-col mt-3 gap-0.5 text-[15px]">
        <div className="flex items-start justify-between">
          <span className="font-bold text-zinc-900 dark:text-zinc-50 truncate max-w-[85%]">
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
        <span className="text-zinc-400 dark:text-zinc-505 text-xs truncate">
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
