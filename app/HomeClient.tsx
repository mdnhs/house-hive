"use client";

import * as React from "react";
import { useTheme } from "@/features/theme/hooks/useTheme";
import { usePropertySearch } from "@/features/properties/hooks/usePropertySearch";
import { useHeaderScroll } from "@/features/navigation/hooks/useHeaderScroll";
import { Header } from "@/features/navigation/components/Header";
import { Footer } from "@/features/navigation/components/Footer";
import { ResultsGallery } from "@/features/properties/components/ResultsGallery";

export function HomeClient() {
  const { darkMode, setDarkMode } = useTheme();

  const {
    activeTab,
    setActiveTab,
    searchParams,
    filteredFlats,
    filteredInteriors,
    handleTabChange,
    handleSearch,
    handleClearFilters,
  } = usePropertySearch();

  const {
    isScrolled,
    isOverlaySearchOpen,
    setIsOverlaySearchOpen,
    activeCell,
    setActiveCell,
  } = useHeaderScroll();

  return (
    <div className="flex-1 bg-linear-to-b from-white via-white to-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen transition-colors duration-300 font-sans">
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
        onClearFilters={handleClearFilters}
        onTabChange={handleTabChange}
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
        <section className="bg-white dark:bg-[#0b0b0d] min-h-[50vh]">
          <ResultsGallery
            flats={filteredFlats}
            interiors={filteredInteriors}
            searchType={activeTab}
            onClearFilters={handleClearFilters}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
