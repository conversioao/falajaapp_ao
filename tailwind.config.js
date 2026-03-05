/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                neon: '#ccff00',
                'neon-hover': '#b3e600',
                dark: '#050505',
                'card-dark': '#121212',
                'input-dark': '#1a1a1a',
            },
            boxShadow: {
                'neon': '0 0 20px rgba(204, 255, 0, 0.4)',
                'neon-sm': '0 0 10px rgba(204, 255, 0, 0.3)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'spin-slow': 'spin 8s linear infinite',
                'spin-reverse': 'spin 12s linear infinite reverse',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                glow: {
                    'from': { boxShadow: '0 0 10px -5px rgba(204, 255, 0, 0.1)' },
                    'to': { boxShadow: '0 0 20px 0px rgba(204, 255, 0, 0.4)' },
                }
            }
        }
    },
    plugins: [],
}
