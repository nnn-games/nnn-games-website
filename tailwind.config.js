const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./docs/**/*.{md,html}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563EB",       // Roblox 버튼 느낌의 블루
          primaryDark: "#1D4ED8",
          secondary: "#1F242B",     // 상단 네비 다크톤
          accent: "#38BDF8",        // 포커스/링크 하이라이트
          bg: "#111318",            // 다크 배경
          text: "#E5E7EB",          // 밝은 본문 텍스트
          muted: "#9CA3AF",         // 서브 텍스트
        },
        metric: {
          play: "#22C55E",
          ugc: "#8B5CF6",
          media: "#38BDF8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Poppins",
          "Noto Sans KR",
          "Noto Sans JP",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
};

