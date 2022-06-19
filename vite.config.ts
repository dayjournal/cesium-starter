import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium'; //  Introducing plug-ins
export default defineConfig({
  plugins: [cesium()],
  base: '/cesium-starter/'
});