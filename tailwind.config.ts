import type { Config } from "tailwindcss";

// Lovable's preview inspector reads this compatibility file. The application
// theme itself remains CSS-first in src/styles.css for Tailwind v4.
export default {
  content: ["./src/**/*.{ts,tsx}"],
} satisfies Config;