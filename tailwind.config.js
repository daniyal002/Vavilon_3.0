/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens:{
        'xs':'350px'
      },
      animation: {
        gradient: 'gradient 3s linear infinite',
        neonBlink: 'neonBlink 12s infinite',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        neonBlink: {
          '20%, 24%, 55%': {
            color: '#111',
            textShadow: 'none',
          },
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            color: '#e9d5ff',
            textShadow: `0 0 5px #a855f7,  
                        0 0 15px #a855f7, 
                        0 0 20px #a855f7, 
                        0 0 40px #a855f7, 
                        0 0 60px #7e22ce, 
                        0 0 10px #9333ea, 
                        0 0 98px #7e22ce`,
          },
        },
      },
    },
  },
  plugins: [],
};
