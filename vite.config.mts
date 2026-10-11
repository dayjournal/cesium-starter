import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';

// base stays relative: vite-plugin-cesium 1.2.23 joins the public base into the
// directory it copies Cesium to, so an absolute base such as /cesium-starter/
// writes dist/cesium-starter/cesium/ while index.html asks for
// /cesium-starter/cesium/Cesium.js. Relative URLs work at the site root and
// under the GitHub Pages project path alike.
export default defineConfig(({ mode }) => ({
    plugins: [cesium()],
    base: './',
    build: {
        // Keep the legacy docs build for local checks; Actions publishes dist/.
        outDir: mode === 'ghpages' ? 'docs' : 'dist',
    },
}));
