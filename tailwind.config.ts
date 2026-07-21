import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F4EA",
        card: "#FFFDF8",
        primary: {
          DEFAULT: "#8E2C3A",
          hover: "#74222F",
        },
        accent: "#D9C29C",
        border: "#E8DDC7",
        foreground: "#2F2A26",
        muted: "#7A746E",
        success: "#2E7D32",
        warning: "#D97706",
        danger: "#C62828",
      },
      borderRadius: {
        xl: "14px",
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(47, 42, 38, 0.04), 0 4px 16px rgba(47, 42, 38, 0.06)",
        "soft-lg": "0 2px 8px rgba(47, 42, 38, 0.06), 0 12px 32px rgba(47, 42, 38, 0.08)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.98)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
