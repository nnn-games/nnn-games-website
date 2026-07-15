const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./docs/**/*.{md,html}",
  ],
  // 상태 배지 클래스는 JS에서 `status-${status}` 로 동적 생성되어 정적 스캔에 잡히지 않으므로
  // purge 방지를 위해 명시적으로 safelist 에 등록한다.
  safelist: [
    "status-active",
    "status-development",
    "status-completed",
    "status-paused",
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

