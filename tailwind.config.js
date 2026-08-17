/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        muwamah: {
          teal: {
            DEFAULT: '#0F6E56',
            hover: '#0C5A46',
            light: '#E6F3EF',
            dark: '#085041',
          },
          coral: {
            DEFAULT: '#D85A30',
            hover: '#BF4C25',
            light: '#FBECE7',
            dark: '#A63E1C',
          },
          dark: '#085041',
          gray: {
            text: '#5F5E5A',
            light: '#F8F7F4',
            border: '#E2DDD4',
            subtle: '#EAE6DC',
          },
          bg: '#F1EFE8',
        },
      },
      fontFamily: {
        arabic: ['var(--font-cairo)', 'Cairo', 'IBM Plex Sans Arabic', 'sans-serif'],
        sans: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(15, 110, 86, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 16px -2px rgba(8, 80, 65, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 25px -5px rgba(8, 80, 65, 0.12), 0 6px 10px -4px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
