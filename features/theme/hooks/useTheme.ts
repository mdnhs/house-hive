import * as React from "react";

export function useTheme() {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  return {
    darkMode,
    setDarkMode,
  };
}
