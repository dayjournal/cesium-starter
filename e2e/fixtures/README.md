# Tile fixtures

The tests answer every request to `https://tile.mierune.co.jp/` with
`fallback.png`, a 256×256 gray grid, so they do not depend on the network and
the globe looks the same in every run. Each requested URL is checked before the
fixture response: `{z}/{x}/{y}` must be non-negative safe integers, with
`x < 2 ** z` and `y < 2 ** z` for the Web Mercator tile grid.

Both smoke and visual tests wait for the initial camera flight to finish and
for `globe.tilesLoaded` to remain true for two rendered frames. The tests also
check imagery-provider errors while waiting and at teardown.

CI runs one test at a time to avoid competing for CPU during software WebGL
rendering, with a 90-second map-readiness budget and a 150-second overall test
timeout. Local runs retain the 20-second readiness budget and 60-second test
timeout. A readiness failure logs the camera-flight state, rendered frame count,
tile queue length and imagery errors.

Playwright installs these observers from `e2e/_helpers.ts`; the app source has no
test hooks. When the built page loads `cesium/Cesium.js`, the test wraps
`Camera.flyTo` to observe its completion/cancellation and `Scene.render` to
subscribe to the initial imagery providers' `errorEvent`, the globe's
`tileLoadProgressEvent` and the scene's `postRender`. The original methods and any
existing flight callbacks still run. The observer uses public Cesium APIs only.
Request counts and zoom levels alone do not prove that tiles loaded.

This setup targets the current single Viewer, its initial synchronous imagery
layer, and continuous rendering. It depends on the global `Cesium` script loaded
by `vite-plugin-cesium` in the production build; run tests against `vite preview`,
as configured in Playwright. If the bundling strategy, layers, render mode, or
camera interactions change, update the observer and readiness checks accordingly.
Normal visits do not install these wrappers or create `window.__CESIUM_E2E__`.

Real map tiles are not stored here: the camera flies from the whole-earth view
down to 100 km, so one run requests about 150 tiles across levels 1–10. A
passing test therefore says nothing about the MIERUNE tile server itself; check
that by eye with `pnpm run preview`.

## Create the fallback tile

`fallback.png` is a 256×256 PNG with a `#eeeeee` background, 1 px `#e0e0e0`
grid lines every 64 px, and a 1 px `#c8c8c8` border along the top and left edges.
To recreate it with ImageMagick, run this from the repository root:

```sh
magick -size 256x256 xc:'#eeeeee' -fill '#e0e0e0' \
  -draw 'line 64,0 64,255 line 128,0 128,255 line 192,0 192,255 line 0,64 255,64 line 0,128 255,128 line 0,192 255,192' \
  -fill '#c8c8c8' -draw 'line 0,0 255,0 line 0,0 0,255' \
  e2e/fixtures/fallback.png
```
