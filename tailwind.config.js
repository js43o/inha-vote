/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        danger: 'red',
      },
      fontFamily: {
        default: 'Pretendard',
        serif: 'SejonghospitalBold',
        title: 'Bungee',
      },
      backgroundImage: {
        login: "url('/src/assets/images/60th_gaussian.jpg')",
      },
      keyframes: {
        completed: {
          '0%': { transform: 'scale(0)' },
          '75%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'spin-fast': 'spin 0.5s linear infinite',
        completed: 'completed 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
