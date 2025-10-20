const tintColorLight = "#FCA311"; // Golden Yellow (Accent)
const tintColorDark = "#FCA311"; // Turf Green (Accent)

export default {
  light: {
    text: "#1C1C1C", // Charcoal
    textSecondary: "#6C757D", // Cool Gray
    background: "#F5F5F5", // Off White
    backgroundSecondary: "#FFFFFF", // White cards
    button: "#FCA311", // Golden Yellow
    border: "#E0E0E0", // Soft light gray border
    input: "#FFFFFF", // White input background
    tint: tintColorLight,
    tabIconDefault: "#B0B0B0",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#FFFFFF", // White text
    textSecondary: "#e8e9eb", // Muted gray
    background: "#050a1c", // Deep Navy background
    backgroundSecondary: "#14213D", // Slightly lighter navy
    button: "#FCA311", // Turf Green
    border: "#2A2A2A", // Subtle dark border
    input: "#1F2937", // Dark input field
    tint: tintColorDark,
    tabIconDefault: "#808080",
    tabIconSelected: tintColorDark,
  },
};
