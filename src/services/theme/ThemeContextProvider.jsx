import { useEffect, useState } from "react";

import { ThemeContext } from "./theme.context.jsx";
import { THEMES } from "../theme/ThemeContextProvider.consts.js";

const themeValue = localStorage.getItem("theme") || THEMES.LIGHT;

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(themeValue);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === THEMES.LIGHT) {
      localStorage.setItem("theme", THEMES.DARK);
      setTheme(THEMES.DARK);
    } else {
      localStorage.setItem("theme", THEMES.LIGHT);
      setTheme(THEMES.LIGHT);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
