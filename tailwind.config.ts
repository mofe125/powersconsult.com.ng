import type { Config } from "tailwindcss";

// Tailwind v4 is configured via CSS (src/styles.css). This minimal config exists
// so tooling that expects a config file can resolve it.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
} satisfies Config;
