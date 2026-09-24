/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    500: '#0129d1',
                    600: '#0020a8',
                    700: '#001880',
                    DEFAULT: '#0129d1',
                },
                dark: {
                    bg: '#030816',
                    card: '#081226',
                    surface: '#0d1d3d',
                    border: '#172e5c',
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '18px',
                '3xl': '26px',
                '4xl': '36px',
            }
        },
    },
    plugins: [],
}
