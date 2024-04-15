// ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";
import { ColorScheme } from "./colors";
import { useThemeColor } from "./useThemeColor";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  colors: ColorScheme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: any) => {
  const COLORS: any = useThemeColor();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
