import * as React from "react";

export function useHeaderScroll() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOverlaySearchOpen, setIsOverlaySearchOpen] = React.useState(false);
  const [activeCell, setActiveCell] = React.useState<
    "location" | "budget" | "home" | "space" | "style" | null
  >(null);

  // Listen to window scroll position to toggle sticky states
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    isScrolled,
    isOverlaySearchOpen,
    setIsOverlaySearchOpen,
    activeCell,
    setActiveCell,
  };
}
