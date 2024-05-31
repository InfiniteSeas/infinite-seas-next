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
        "frame-lg": "url('/image/frame/large-frame.png')",
        "frame-sm": "url('/image/frame/small-frame.png')",
        "frame-normal": "url('/image/frame/normal-frame.png')",
        "frame-width": "url('/image/frame/width-frame.png')",
        "frame-text": "url('/image/frame/text-frame.png')",
        "paper-row": "url('/image/frame/paper-frame-row.png')",
        "paper-col": "url('/image/frame/paper-frame-col.png')",
        "frame-topbar": "url('/image/frame/topbar-frame.png')",
        ranking: "url('/image/ranking/Ranking_text.png')",
      },
    },
  },
  plugins: [],
};
export default config;
