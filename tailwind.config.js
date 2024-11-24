const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all your source files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo for primary elements
        secondary: '#10B981', // Emerald for secondary elements
        background: '#F3F4F6', // Light gray background for light mode
        darkBackground: '#1F2937', // Dark gray background for dark mode
        accent: '#FF5F6D', // Reddish accent color for highlights
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        'md-custom': '0 4px 6px rgba(0, 0, 0, 0.1)', // Softer shadow
        'lg-custom': '0 8px 10px rgba(0, 0, 0, 0.2)', // Larger shadow
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // For better styling of input elements
    require('@tailwindcss/typography'), // For better typography control
  ],
};
