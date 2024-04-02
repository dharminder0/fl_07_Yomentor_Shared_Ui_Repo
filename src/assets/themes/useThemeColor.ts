import { useColorScheme } from "react-native";

export const useThemeColor = () => {
  const colors = {
    light: {
      primary: "#124076",
      secondary: "#6c757d",
      background: "#f8f9fa",
      bgColor: "rgba(97,175,254,.15)",
      text: "#343a40",
      white: "#fff",
      star: "#f0ca02",
    },
    dark: {
      primary: "#345678", // Example dark mode color
      secondary: "#789abc", // Example dark mode color
      background: "#121212", // Example dark mode color
      bgColor: "rgba(254,175,97,.15)", // Example dark mode color
      text: "#f0f0f0", // Example dark mode color
      white: "#fff",
      star: "#f0ca02",
    },
  };

  return useColorScheme() === "dark" ? colors.dark : colors.light;
};
