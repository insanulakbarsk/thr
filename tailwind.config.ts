import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#f59e0b', dark: '#d97706' },
      }
    },
  },
  plugins: [],
}
export default config
