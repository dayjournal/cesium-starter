import { expect, test as base, type Page } from '@playwright/test';
import type { Scene, TileProviderError } from 'cesium';
import fs from 'node:fs';
import path from 'node:path';

declare global {
    interface Window {
        __CESIUM_E2E__?: {
            observerInstalled: boolean;
            flightComplete: boolean;
            readyFrames: number;
            errors: string[];
        };
    }
}

// Every tile request is answered with this gray grid, so the tests never reach
// the MIERUNE tile server. See fixtures/README.md.
const TILE_PNG = fs.readFileSync(path.join(__dirname, 'fixtures', 'fallback.png'));

// Validate each request before a fixture can hide an invalid tile URL.
const TILE_URL_PATTERN = /\/mierune_mono\/(\d+)\/(\d+)\/(\d+)\.png$/;
// The camera flies from the whole-earth view (levels 1-3) to the 100 km view
// in src/main.ts, which needs level 8-10 tiles in the 1280x720 viewport. A
// full flight requests about 150 tiles; far fewer, or no deep level, means
// the globe or the flight broke.
const MIN_EXPECTED_TILES = 40;
const MIN_EXPECTED_LEVEL = 8;
// Budget for the flight to end and the tiles to come in. Above the 10s expect
// timeout, well under the 60s test timeout (playwright.config.ts).
export const MAP_READY_TIMEOUT_MS = 20_000;

// Fail any test that produced an uncaught page error (includes unhandled
// rejections) or a console error during its run. The fixture is auto: true,
// so every spec importing `test` from this file gets the check implicitly —
// there is nothing to call from the spec.
const test = base.extend<{ _runtimeErrors: void }>({
    _runtimeErrors: [
        async ({ page }, use) => {
            const errors: string[] = [];
            await page.addInitScript(() => {
                const state = {
                    observerInstalled: false,
                    flightComplete: false,
                    readyFrames: 0,
                    errors: [] as string[],
                };
                window.__CESIUM_E2E__ = state;

                // The build loads Cesium.js before the app module. Install the
                // observers at script load, before the app creates its Viewer.
                document.addEventListener(
                    'load',
                    (event) => {
                        if (
                            !(event.target instanceof HTMLScriptElement) ||
                            !event.target.src.endsWith('/cesium/Cesium.js')
                        )
                            return;
                        const cesium = (window as Window & { Cesium?: typeof import('cesium') })
                            .Cesium;
                        if (!cesium) throw new Error('Cesium script did not expose its global API');
                        const flyTo = cesium.Camera.prototype.flyTo;
                        cesium.Camera.prototype.flyTo = function (options) {
                            state.flightComplete = false;
                            state.readyFrames = 0;
                            return flyTo.call(this, {
                                ...options,
                                complete: () => {
                                    state.flightComplete = true;
                                    options.complete?.();
                                },
                                cancel: () => {
                                    state.errors.push('initial camera flight cancelled');
                                    options.cancel?.();
                                },
                            });
                        };

                        const scenes = new WeakSet<Scene>();
                        const render = cesium.Scene.prototype.render;
                        cesium.Scene.prototype.render = function (time) {
                            if (!scenes.has(this)) {
                                scenes.add(this);
                                for (let i = 0; i < this.imageryLayers.length; i++) {
                                    this.imageryLayers
                                        .get(i)
                                        .imageryProvider.errorEvent.addEventListener(
                                            (error: TileProviderError) => {
                                                state.errors.push(
                                                    `tile load failed: ${error.message}`
                                                );
                                            }
                                        );
                                }
                                this.postRender.addEventListener(() => {
                                    state.readyFrames =
                                        state.flightComplete && this.globe.tilesLoaded
                                            ? state.readyFrames + 1
                                            : 0;
                                });
                            }
                            return render.call(this, time);
                        };
                        state.observerInstalled = true;
                    },
                    true
                );
            });
            page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
            page.on('console', (msg) => {
                // Cesium reports a failed tile load through the provider's
                // errorEvent; with no listener it falls back to console.log.
                if (msg.type() === 'log' && msg.text().startsWith('An error occurred in "')) {
                    errors.push(`tile load failed: ${msg.text()}`);
                    return;
                }
                if (msg.type() !== 'error') return;
                // Safety net for specs that skip stabilizeTileRequests: the browser's
                // automatic favicon request 404s against vite preview. Match on the
                // message's source URL only, so real errors that merely mention
                // "favicon.ico" in their text are still reported.
                if ((msg.location()?.url ?? '').includes('favicon.ico')) return;
                // page.clock (visual.spec.ts) installs its script in every frame.
                // Cesium's InfoBox iframe is sandboxed without allow-scripts, so
                // Chromium reports the blocked install; the app itself runs no
                // script in that frame.
                if (msg.text().startsWith("Blocked script execution in 'about:blank'")) return;
                errors.push(`console.error: ${msg.text()}`);
            });
            await use();
            errors.push(...(await page.evaluate(() => window.__CESIUM_E2E__?.errors ?? [])));
            expect(errors, 'runtime errors detected during test').toEqual([]);
        },
        { auto: true },
    ],
});

// Serve the fixture tile and collect the requested URLs for expectValidTileRequests.
async function stabilizeTileRequests(page: Page): Promise<string[]> {
    const tileUrls: string[] = [];
    // The browser requests /favicon.ico on its own; vite preview would 404 it,
    // which the runtime-error fixture would flag as a console error.
    await page.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
    await page.route('https://tile.mierune.co.jp/**', async (route) => {
        const url = route.request().url();
        tileUrls.push(url);
        expect(
            tileLevel(url),
            `tile URL should contain numeric {z}/{x}/{y} within range: ${url}`
        ).toBeGreaterThanOrEqual(0);
        try {
            await route.fulfill({
                status: 200,
                headers: {
                    'cache-control': 'public, max-age=31536000',
                },
                contentType: 'image/png',
                body: TILE_PNG,
            });
        } catch (error) {
            // A fulfillment can lose the race against the page closing during
            // teardown; anything else is a real mock failure and must surface.
            if (!page.isClosed()) throw error;
        }
    });
    return tileUrls;
}

// Level of a well-formed tile URL, or -1. Web Mercator has 2^z tiles per axis
// at level z, so larger x or y never exist on the tile server.
function tileLevel(url: string): number {
    const match = TILE_URL_PATTERN.exec(url);
    if (!match) return -1;
    const [z, x, y] = match.slice(1).map(Number);
    const tilesPerAxis = 2 ** z;
    return [z, x, y].every(Number.isSafeInteger) &&
        Number.isFinite(tilesPerAxis) &&
        x < tilesPerAxis &&
        y < tilesPerAxis
        ? z
        : -1;
}

async function waitForMapReady(page: Page) {
    await page.waitForFunction(
        () => {
            const state = window.__CESIUM_E2E__;
            if (!state?.observerInstalled) {
                throw new Error(
                    'Cesium test observer was not installed; serve the built app with vite preview'
                );
            }
            if (state.errors.length) throw new Error(state.errors.join('\n'));
            return state.flightComplete && state.readyFrames >= 2;
        },
        undefined,
        { timeout: MAP_READY_TIMEOUT_MS }
    );
}

async function expectValidTileRequests(tileUrls: string[]) {
    await expect
        .poll(() => tileUrls.length, {
            message: 'expected the globe to request tiles',
            timeout: MAP_READY_TIMEOUT_MS,
        })
        .toBeGreaterThanOrEqual(MIN_EXPECTED_TILES);
    await expect
        .poll(() => Math.max(0, ...tileUrls.map(tileLevel)), {
            message: `expected the flight to end where level ${MIN_EXPECTED_LEVEL} tiles are needed`,
            timeout: MAP_READY_TIMEOUT_MS,
        })
        .toBeGreaterThanOrEqual(MIN_EXPECTED_LEVEL);
    const invalid = tileUrls.filter((url) => tileLevel(url) < 0);
    expect(invalid, 'tile URLs should contain numeric {z}/{x}/{y} within range').toEqual([]);
}

export { expect, test, stabilizeTileRequests, waitForMapReady, expectValidTileRequests };
