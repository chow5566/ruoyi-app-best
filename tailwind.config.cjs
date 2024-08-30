/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [],
  presets: [
    require('tailwindcss-rem2px-preset').createPreset({
      // 16 意味着 1rem = 16px
      fontSize: 16,
      // 转化的单位,可以变成 px / rpx
      unit: 'px'
    })
  ]
};
