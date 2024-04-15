// colors.ts
const COLORS = {
  primary: "#3498db",
  secondary: "#2ecc71",
  background: "#ecf0f1",
  text: "#2c3e50",
  accent: "#e74c3c",
} as const;

export type ColorScheme = typeof COLORS;
export default COLORS;
