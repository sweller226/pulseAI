import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Tactical Theme Colors
        tactical: {
          bg: "#000000", // Pure Black
          bgSec: "#0f0f0f", // Deep Charcoal
          panel: "rgba(20, 20, 20, 0.7)", // Glass Panel
          border: "rgba(255, 255, 255, 0.1)",
          cyan: "#00d9ff", // Electric Cyan
          purple: "#a78bfa", // Iridescent Purple
          teal: "#14b8a6", // Secondary Accent
          emerald: "#10b981", // Success
          amber: "#f59e0b", // Warning
          red: "#ff3b3b", // Critical
          pink: "#ec4899", // Critical Gradient End
          text: "#ffffff",
          textSec: "#d1d5db",
          textMuted: "#9ca3af",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 10px currentColor" },
          "50%": { opacity: "0.7", boxShadow: "0 0 20px currentColor" },
        },
        "scan-line": {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        "gradient-rotate": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        "scan-line": "scan-line 4s linear infinite",
        "gradient-rotate": "gradient-rotate 3s ease infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
      },
      backgroundImage: {
        'iridescent-gradient': 'linear-gradient(135deg, #00d9ff 0%, #a78bfa 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
