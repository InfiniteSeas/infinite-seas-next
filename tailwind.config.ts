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
        "btn-frame": "url('/image/btn/btn_frame.png')",
        "ranking-text": "url('/image/Ranking/Ranking_text.png')",
      },
    },
  },
  plugins: [],
};
export default config;
