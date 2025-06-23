import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Add this 'base' property to specify the subdirectory
  plugins: [react()],
  base: 'https://adenneal.com/ClinicalTrial/'
})
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// // We change this to a function to access the 'command' variable
// export default defineConfig(({ command }) => {
//   return {
//     // If we are running the dev server ('serve'), use root path '/'
//     // If we are building for production ('build'), use the '/ClinicalTrial/' path
//     base: command === 'serve' ? '/' : '/ClinicalTrial/',
//     plugins: [react()],
//   };
// });