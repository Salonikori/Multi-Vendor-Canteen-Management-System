/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F3EE',
        ink:   '#1C1917',
        warm:  '#E8E0D5',
        muted: '#78716C',
        accent:'#C84B31',
        amber: '#D97706',
        sage:  '#4A7C59',
        chalk: '#FAFAF8',
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        hard:  '3px 3px 0 #1C1917',
        harder:'5px 5px 0 #1C1917',
        inset: 'inset 2px 2px 0 rgba(0,0,0,0.08)',
      },
      borderRadius: { none:'0', sm:'2px', DEFAULT:'4px', md:'6px', lg:'8px', xl:'12px', full:'9999px' },
      keyframes: {
        ticker: { '0%':{ transform:'translateX(100%)' }, '100%':{ transform:'translateX(-100%)' } },
        pop:    { '0%':{ transform:'scale(.92)', opacity:0 }, '100%':{ transform:'scale(1)', opacity:1 } },
        slide:  { '0%':{ transform:'translateX(60px)', opacity:0 }, '100%':{ transform:'translateX(0)', opacity:1 } },
      },
      animation: {
        ticker: 'ticker 28s linear infinite',
        pop:    'pop .2s ease',
        slide:  'slide .25s ease',
      },
    },
  },
  plugins: [],
}
