import { Appearance, useColorScheme } from "react-native";

export const useThemeColor = () => {
  const colors = {
    light: {
      primary: "#124076",
      secondary: "#6c757d",
      background: "#f8f9fa",
      bgColor: "rgba(97,175,254,.15)",
      text: "#343a40",
      textTheme: "#343a40",
      white: "#fff",
      star: "#f0ca02",
      placeholderText: "#A0A0A0",
      inputText: "#000",
      success: "#198754",
      danger: "#dc3545",
      icon: "#124076",
    },
    dark: {
      primary: "#345678", // Example dark mode color
      secondary: "#789abc", // Example dark mode color
      background: "#121212", // Example dark mode color
      bgColor: "rgba(254,175,97,.15)", // Example dark mode color
      text: "#989a9c", // Example dark mode color
      textTheme: "#fff",
      white: "#fff",
      star: "#f0ca02",
      placeholderText: "#707070",
      inputText: "#fff",
      success: "#198754",
      danger: "#dc3545",
      icon: "#fff",
    },
  };

  return Appearance.getColorScheme() === "dark" ? colors.dark : colors.light;
};
