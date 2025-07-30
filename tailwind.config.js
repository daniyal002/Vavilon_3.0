/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-0': 'rotateY(0deg)',
        'y-180': 'rotateY(180deg)',
        '-y-180': 'rotateY(-180deg)',
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },
      screens:{
        'xs':'350px'
      },
      animation: {
        gradient: 'gradient 3s linear infinite',
        neonBlink: 'neonBlink 12s infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        slideFromRight: 'slideFromRight 0.3s ease-out',
      },
      keyframes: {
        slideFromRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
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
  variants: {
    extend: {
      rotate: ['group-hover'],
      backfaceVisibility: ['group-hover'],
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.transform-style-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-0': {
          transform: 'rotateY(0deg)',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.-rotate-y-180': {
          transform: 'rotateY(-180deg)',
        }
      }
      addUtilities(newUtilities)
    },
     require('tailwind-scrollbar'),
  ]
};
