export type ThemeColors = {
  background: string;
  surface: string;
  inputBackground: string;
  secondarySurface: string;
  text: string;
  mutedText: string;
  placeholder: string;
  primary: string;
  onPrimary: string;
  border: string;
  danger: string;
  dangerSurface: string;
  overlay: string;
};

export const lightTheme: ThemeColors = {
  background: "#F7F7FB",
  surface: "#FFFFFF",
  inputBackground: "#F7F7FB",
  secondarySurface: "#EEF0F4",
  text: "#19233A",
  mutedText: "#7C8494",
  placeholder: "#9CA3AF",
  primary: "#6F5CE7",
  onPrimary: "#FFFFFF",
  border: "#E5E7EB",
  danger: "#DC4C4C",
  dangerSurface: "#FEECEC",
  overlay: "rgba(0, 0, 0, 0.45)",
};

export const darkTheme: ThemeColors = {
  background: "#0E111B",
  surface: "#191E2D",
  inputBackground: "#121725",
  secondarySurface: "#272D3D",
  text: "#F4F6FC",
  mutedText: "#A7AFC1",
  placeholder: "#777F91",
  primary: "#9385FF",
  onPrimary: "#FFFFFF",
  border: "#30374A",
  danger: "#FF858D",
  dangerSurface: "#3B222A",
  overlay: "rgba(0, 0, 0, 0.68)",
};