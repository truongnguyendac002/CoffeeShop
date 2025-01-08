module.exports = {
  content: [
    "./src/**/*.{html,js}", // Đường dẫn tới tệp HTML hoặc JS của bạn
  ],
  theme: {
    extend: {
      colors: {
        "gray-150": "#EEEEEE",
        "gray-125": "#F6F6F6",
        "blue-123": "#77DAE6"
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
