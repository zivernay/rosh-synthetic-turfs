import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
  ],
  build: {
    minify: 'terser', // Terser is better for mangling than esbuild
    terserOptions: {
      mangle: {
        toplevel: true, // Renames top-level variables too
        keep_fnames: false, // Ensures functions don't keep their names
        keep_classnames: false,
      },
      compress: {
        drop_console: true, // Removes console.logs for extra security
        passes: 2, // Number of times to compress the code
      },
    },
  },
});