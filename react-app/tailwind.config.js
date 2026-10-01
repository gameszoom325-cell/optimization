export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#08070c",
        ember: "#f97316",
        ultraviolet: "#9b6dff",
        rosewire: "#e34191"
      },
      fontFamily: {
        display: ["Arial", "Segoe UI", "sans-serif"],
        mono: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"]
      },
      maxWidth: {
        portfolio: "1280px"
      }
    }
  },
  plugins: []
};
