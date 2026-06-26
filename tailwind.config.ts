import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: '#07080F',
        card: '#0C1220',
        panel: '#111827',
        primary: '#E8EDF5',
        secondary: '#AAB8CC',
        muted: '#6B7A96',
        cyan: {
          DEFAULT: '#00E5FF',
          blue: '#005BFF',
        },
        lotto: {
          yellow: '#FBC400',
          sky: '#69C8F2',
          red: '#FF7272',
          gray: '#AAB8CC',
          green: '#58D68D',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
