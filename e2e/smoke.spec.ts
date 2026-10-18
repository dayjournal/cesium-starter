import {
    test,
    expect,
    stabilizeTileRequests,
    waitForMapReady,
    expectValidTileRequests,
    tileLevel,
    MAP_READY_TIMEOUT_MS,
} from './_helpers';

// One file per directory that vite-plugin-cesium copies next to index.html;
// Cesium.js resolves them relative to its own <script src>. vite preview
// answers a missing file with index.html (HTTP 200), so the type is checked too.
const CESIUM_FILES = [
    ['cesium/Cesium.js', 'text/javascript'],
    ['cesium/Widgets/widgets.css', 'text/css'],
    ['cesium/Assets/approximateTerrainHeights.json', 'application/json'],
    ['cesium/ThirdParty/draco_decoder.wasm', 'application/wasm'],
    ['cesium/Workers/createVerticesFromHeightmap.js', 'text/javascript'],
];

test('smoke: Cesium renders loaded tiles after the camera flight', async ({ page, baseURL }) => {
    const tileUrls = await stabilizeTileRequests(page);

    // './' keeps the project path of the subpath project; '/' would leave it.
    await page.goto('./');
    const map = page.locator('#map');
    await expect(map).toBeVisible();

    // Cesium adds its WebGL canvas to #map when the Viewer is constructed and
    // sizes it to the container; a render error replaces the scene with the
    // error panel.
    const canvas = page.locator('#map canvas');
    await expect(canvas).toBeVisible({ timeout: MAP_READY_TIMEOUT_MS });
    expect(await canvas.boundingBox()).toEqual(await map.boundingBox());
    await waitForMapReady(page);
    await expect(page.locator('.cesium-widget-errorPanel')).toHaveCount(0);
    await expectValidTileRequests(tileUrls);

    for (const [file, contentType] of CESIUM_FILES) {
        const response = await page.request.get(new URL(file, baseURL).href);
        expect(response.status(), file).toBe(200);
        expect(response.headers()['content-type'], file).toContain(contentType);
    }
});

test('smoke: the tile URL check rejects anything but a valid MIERUNE tile', async () => {
    expect(tileLevel('https://tile.mierune.co.jp/mierune_mono/8/227/103.png')).toBe(8);
    for (const url of [
        // Wrong host, wrong path prefix, unexpanded template, out of range.
        'https://example.com/mierune_mono/8/227/103.png',
        'https://tile.mierune.co.jp/other/mierune_mono/8/227/103.png',
        'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
        'https://tile.mierune.co.jp/mierune_mono/8/256/103.png',
        'https://tile.mierune.co.jp/mierune_mono/8/227/256.png',
    ]) {
        expect(tileLevel(url), url).toBe(-1);
    }
});
