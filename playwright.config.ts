import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'e2e',
    // Software WebGL rendering makes concurrent map tests compete for CPU.
    workers: process.env.CI ? 1 : undefined,
    timeout: process.env.CI ? 150_000 : 60_000,
    expect: {
        timeout: 10_000,
    },
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : [['list']],
    // Snapshots live in one directory that .gitignore excludes — no baseline is
    // committed. .github/workflows/deps-autoupdate.yml regenerates the baseline
    // from pre-update main (--update-snapshots) before comparing.
    snapshotDir: '.playwright-snapshots',
    // Baselines are created only by an explicit --update-snapshots run.
    updateSnapshots: 'none',
    use: {
        // Fixed rendering conditions for the screenshot comparison.
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        reducedMotion: 'reduce',
        // Kept in test-results/ for a failed test; CI uploads that directory.
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    // The same dist/ is served at the site root and under /cesium-starter/,
    // the GitHub Pages project path. Specs navigate with page.goto('./') so
    // the project path is kept.
    projects: [
        { name: 'root', use: { baseURL: 'http://127.0.0.1:4173/' } },
        { name: 'subpath', use: { baseURL: 'http://127.0.0.1:4174/cesium-starter/' } },
    ],
    // `vite preview` serves the existing dist/ build — run `pnpm run build`
    // first (as `pnpm test` does), or the tests hit a stale or missing build.
    // vite.config.mts sets the relative base and dist/ without reading any
    // environment variable, so a local .env cannot change what the tests
    // serve. The servers are never reused and bind their ports strictly, so a
    // run fails instead of testing whatever another process serves on the port.
    webServer: [
        {
            command: 'pnpm run preview --host 127.0.0.1 --port 4173 --strictPort',
            url: 'http://127.0.0.1:4173/',
            reuseExistingServer: false,
            timeout: 120_000,
        },
        {
            command:
                'pnpm run preview --host 127.0.0.1 --port 4174 --base /cesium-starter/ --strictPort',
            url: 'http://127.0.0.1:4174/cesium-starter/',
            reuseExistingServer: false,
            timeout: 120_000,
        },
    ],
});
