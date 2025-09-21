/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',// <- escanea todos tus componentes/páginas
  ],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '2rem' },
    extend: {
      // ejemplos útiles para shadcn/ui y animaciones
      keyframes: {
        'accordion-down': { from: { height: 0 }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: 0 } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // opcional si usás shadcn/ui
  ],
}
