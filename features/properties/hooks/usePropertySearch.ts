import * as React from "react";
import { FLATS_DATA, INTERIORS_DATA } from "@/lib/mockData";

export function usePropertySearch() {
  const [activeTab, setActiveTab] = React.useState<"Flat" | "Interior">("Flat");

  const [searchParams, setSearchParams] = React.useState<{
    location: string;
    budget?: string;
    bedrooms?: string;
    size?: string;
    spaceType?: string;
    designStyle?: string;
  }>({ location: "" });

  // Derive filtered results from source data + filters
  const filteredFlats = React.useMemo(() => {
    let results = [...FLATS_DATA];

    if (searchParams.location) {
      const query = searchParams.location.toLowerCase();
      results = results.filter(
        (item) =>
          item.location.toLowerCase().includes(query) ||
          item.zone.toLowerCase().includes(query),
      );
    }

    if (searchParams.budget && searchParams.budget !== "Any Budget") {
      if (searchParams.budget === "Under 50 Lakh") {
        results = results.filter((item) => item.priceLakh < 50);
      } else if (searchParams.budget === "50L - 1Cr") {
        results = results.filter(
          (item) => item.priceLakh >= 50 && item.priceLakh <= 100,
        );
      } else if (searchParams.budget === "1Cr - 2Cr") {
        results = results.filter(
          (item) => item.priceLakh >= 100 && item.priceLakh <= 200,
        );
      } else if (searchParams.budget === "2Cr+") {
        results = results.filter((item) => item.priceLakh > 200);
      }
    }

    if (searchParams.bedrooms) {
      if (searchParams.bedrooms === "1 Bed") {
        results = results.filter((item) => item.bedrooms === 1);
      } else if (searchParams.bedrooms === "2 Bed") {
        results = results.filter((item) => item.bedrooms === 2);
      } else if (searchParams.bedrooms === "3 Bed") {
        results = results.filter((item) => item.bedrooms === 3);
      } else if (searchParams.bedrooms === "4+ Bed") {
        results = results.filter((item) => item.bedrooms >= 4);
      }
    }

    if (searchParams.size && searchParams.size !== "Any") {
      const minSize = parseInt(searchParams.size.replace("+", ""), 10);
      if (!isNaN(minSize)) {
        results = results.filter((item) => item.sizeSqft >= minSize);
      }
    }

    return results;
  }, [searchParams]);

  const filteredInteriors = React.useMemo(() => {
    let results = [...INTERIORS_DATA];

    if (searchParams.location) {
      const query = searchParams.location.toLowerCase();
      results = results.filter(
        (item) =>
          item.location.toLowerCase().includes(query) ||
          item.zone.toLowerCase().includes(query),
      );
    }

    if (searchParams.spaceType) {
      results = results.filter(
        (item) => item.spaceType === searchParams.spaceType,
      );
    }

    if (searchParams.designStyle) {
      results = results.filter(
        (item) => item.designStyle === searchParams.designStyle,
      );
    }

    return results;
  }, [searchParams]);

  // Reset search params on tab switch
  const handleTabChange = (tab: "Flat" | "Interior") => {
    setActiveTab(tab);
    setSearchParams({ location: "" });
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
    setSearchParams({
      location: params.location,
      budget: params.budget,
      bedrooms: params.bedrooms,
      size: params.size,
      spaceType: params.spaceType,
      designStyle: params.designStyle,
    });
  };

  const handleClearFilters = () => {
    setSearchParams({ location: "" });
  };

  return {
    activeTab,
    setActiveTab,
    searchParams,
    setSearchParams,
    filteredFlats,
    filteredInteriors,
    handleTabChange,
    handleSearch,
    handleClearFilters,
  };
}
