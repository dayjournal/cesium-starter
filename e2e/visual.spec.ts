import {
    test,
    expect,
    stabilizeTileRequests,
    waitForMapReady,
    expectValidTileRequests,
} from './_helpers';

test('visual: map container screenshot', async ({ page }) => {
    // Cesium places the sun, moon and stars for the clock's start time, which
    // is the wall-clock time at load. Pin it so the sky matches between runs.
    await page.clock.setFixedTime(new Date('2026-01-01T03:00:00Z'));
    const tileUrls = await stabilizeTileRequests(page);

    await page.goto('./');
    const map = page.locator('#map');
    await expect(map).toBeVisible();

    await waitForMapReady(page);
    await expectValidTileRequests(tileUrls);

    // No baseline is committed (snapshotDir is gitignored; see playwright.config.ts):
    // check the map by eye, then create one with `pnpm run test:visual:update`.
    await expect(map).toHaveScreenshot('map.png', {
        animations: 'disabled',
        scale: 'css',
    });
});
