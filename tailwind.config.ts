import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "lg-frame": "url('/image/large_frame.png')",
        "btn-frame": "url('/image/button/btn_frame.png')",
        "top-menu-frame": "url('/image/top-menu/Top_frame.png')",
        "bag-bg": "url('/image/inventory/inventory_bg.png')",
        "bag-frame": "url('/image/inventory/inventory_frame.png')",
        "ranking-text": "url('/image/ranking/Ranking_text.png')",
      },
    },
  },
  plugins: [],
};
export default config;
