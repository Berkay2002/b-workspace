// tailwind.config.ts
import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#1f1f1f", // Main dark canvas
        foreground: "#f5f5f5", // Primary text

        sidebar: "#1a1a1a", // Sidebar color
        panel: "#1a1a1a", // Dropdowns/Inputs
        modal: "#1f1f1f", // Modals

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "#f5f5f5",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "#f5f5f5",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "#f5f5f5",
        },
        muted: {
          DEFAULT: "#2a2a2a",
          foreground: "#a3a3a3",
        },
        accent: {
          DEFAULT: "#2e2e2e",
          foreground: "#f5f5f5",
        },
        popover: {
          DEFAULT: "#2a2a2a",
          foreground: "#e5e5e5",
        },
        card: {
          DEFAULT: "#1f1f1f",
          foreground: "#f5f5f5",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
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
        "slide-in": {
          "0%": {
            transform: "translateX(-300px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        "slide-out": {
          "0%": {
            transform: "translateX(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-300px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-out": "slide-out 200ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;