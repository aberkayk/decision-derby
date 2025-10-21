import { ColorPreset } from "./types";

export const HORSE_COLORS: readonly ColorPreset[] = [
  { label: "Deep Red", hex: "#D62828" },
  { label: "Royal Blue", hex: "#0077B6" },
  { label: "Emerald", hex: "#2D6A4F" },
  { label: "Mustard", hex: "#E9C46A" },
  { label: "Violet", hex: "#8338EC" },
  { label: "Midnight Navy", hex: "#14213D" },
  { label: "Turf Green", hex: "#2EC4B6" },
  { label: "Golden Yellow", hex: "#FCA311" },
] as const;

export const BOTTLE_COLORS: readonly ColorPreset[] = [
  { label: "Berry Punch", hex: "#9B5DE5" },
  { label: "Citrus Fizz", hex: "#F15BB5" },
  { label: "Lime Twist", hex: "#00BB72" },
  { label: "Ocean Mist", hex: "#00BBF9" },
  { label: "Peach Bellini", hex: "#FF9F1C" },
  { label: "Cranberry Splash", hex: "#EF476F" },
  { label: "Mint Cooler", hex: "#06D6A0" },
  { label: "Grape Soda", hex: "#7F2CCB" },
] as const;

export const HORSE_EMOJIS = [
  "🏇",
  "🐎",
  "🦄",
  "🐴",
  "🎠",
  "⚡",
  "🌟",
  "💫",
] as const;
export const BOTTLE_EMOJIS = [
  "🍹",
  "🥂",
  "🍸",
  "🍻",
  "🍷",
  "🍾",
  "🎯",
  "🎉",
] as const;
