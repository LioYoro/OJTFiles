module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5faff',
          100: '#e6f0ff',
          500: '#2563eb',
          700: '#1d4ed8'
        },
        accent: {
          50: '#fff5f8',
          500: '#ec4899'
        }
      }
    }
  },
  plugins: [],
};
