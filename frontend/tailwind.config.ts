// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        wordle: {
          correct: '#22c55e',
          present: '#eab308',
          absent : '#3f3f46'
        }
      },
      animation: {
        flip: 'flip 0.6s ease-in-out',
        'bounce-once': 'bounce-once 0.3s ease'
      },
      keyframes: {
        flip: {
          '0%,100%': { transform: 'rotateX(0)' },
          '50%'    : { transform: 'rotateX(90deg)' }
        },
        'bounce-once': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%'    : { transform: 'translateY(-15%)' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
