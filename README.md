# cesium-starter

![README02](img/README02.png)

Start Cesium easily.  
- [Cesium v1.137.0](https://github.com/CesiumGS/cesium)  
- [TypeScript v7.0.2](https://www.typescriptlang.org)  
- [Vite v8.3.2](https://vitejs.dev)  
- node v24.21.0
- pnpm v11.9.0

<br>

## Usage

![README03](img/README03.png)

<br>

Install package

Use Node.js v24.21.0 (`.node-version`) and pnpm v11.9.0 (`packageManager`). Install pnpm with `npm install --global pnpm@11.9.0` if needed. `pnpm install --frozen-lockfile` installs the versions recorded in `pnpm-lock.yaml`.

```bash
pnpm install --frozen-lockfile
```

<br>

dev
```bash
pnpm run dev
```

<br>

build

Writes `dist/` for local checks and the GitHub Pages deployment workflow.

```bash
pnpm run build
```

<br>

preview

Serves `dist/` at the site root.

```bash
pnpm run preview
```

<br>

test

Builds `dist/`, then checks in Chromium that the map renders both at the site root and under `/cesium-starter/`. Tile requests are answered from `e2e/fixtures/`, so the tests never reach the tile server. Install Chromium before the first test run.

```bash
pnpm exec playwright install chromium
```

```bash
pnpm test
```

`pnpm run test:visual` compares a screenshot with a local baseline; create the baseline with `pnpm run test:visual:update` after checking the map by eye.

<br>

GitHub Pages

After CI succeeds for a push to `main`, `.github/workflows/pages.yml` builds that tested commit and deploys `dist/`. Pull requests and failed CI runs do not trigger an automatic deployment. Set the repository's Pages source to **GitHub Actions** and restrict the `github-pages` environment to `main`; see [the setup steps](.github/AUTOMATION.md#github-pages).

The build keeps `base: './'` so Cesium's runtime assets load under the project path. To preview the same build locally:

```bash
pnpm run build
pnpm run preview --base /cesium-starter/
```

`build:ghpages` and `preview:ghpages` remain available for local checks using `docs/`. The automatic deployment uses `dist/`. Generated `dist/` and `docs/` files are ignored and are not committed.

<br>

Maintenance

For tools outside the daily dependency updates (Playwright, Node.js types, Prettier, Node.js and pnpm), follow [the manual update procedure](.github/AUTOMATION.md#manual-tooling-updates).

<br>

format

`pnpm run format:check` reports files that are not formatted without rewriting them.

```bash
pnpm run format
```

<br>

## Map tiles

The map shows [MIERUNE](https://mierune.co.jp) tiles and does not set a Cesium ion token. Terrain, ion assets and other ion services need an access token (`Cesium.Ion.defaultAccessToken`) in `src/main.ts`.

---

<br>
<br>

![README01](img/README01.gif)

<br>

## License
MIT

Copyright (c) 2022-2026 Yasunori Kirimoto

<br>

---

<br>

### Japanese

<br>

# Cesium スターター

![README02](img/README02.png)

Cesiumを手軽に始める
- [Cesium v1.137.0](https://github.com/CesiumGS/cesium)  
- [TypeScript v7.0.2](https://www.typescriptlang.org)  
- [Vite v8.3.2](https://vitejs.dev)  
- node v24.21.0
- pnpm v11.9.0

<br>

##  使用方法

![README03](img/README03.png)

<br>

パッケージインストール

Node.js v24.21.0（`.node-version`）とpnpm v11.9.0（`packageManager`）を使用します。pnpm未導入の場合は`npm install --global pnpm@11.9.0`で導入します。`pnpm install --frozen-lockfile`は`pnpm-lock.yaml`に記録されたバージョンをインストールします。

```bash
pnpm install --frozen-lockfile
```

<br>

開発

```bash
pnpm run dev
```

<br>

ビルド

ローカル確認とGitHub Pagesの自動公開に使用する`dist/`を生成します。

```bash
pnpm run build
```

<br>

プレビュー

`dist/`をサイトのルートで配信します。

```bash
pnpm run preview
```

<br>

テスト

`dist/`をビルドしたあと、Chromiumでサイトのルートと`/cesium-starter/`配下の両方で地図が表示されることを確認します。タイルの要求には`e2e/fixtures/`のファイルで応答するため、テストはタイルサーバーにアクセスしません。初回のテスト前にChromiumをインストールします。

```bash
pnpm exec playwright install chromium
```

```bash
pnpm test
```

`pnpm run test:visual`はスクリーンショットをローカルのベースラインと比較します。ベースラインは、地図を目で確認したあとに`pnpm run test:visual:update`で作成します。

<br>

GitHub Pages

`main`へのpushに対するCIが成功すると、`.github/workflows/pages.yml`がCIで検証したコミットをビルドし、`dist/`を自動公開します。PRやCI失敗時には自動公開しません。リポジトリのPages公開元を**GitHub Actions**に変更し、`github-pages`環境の公開対象を`main`に限定してください。[設定手順](.github/AUTOMATION.md#github-pages)を参照してください。

Cesiumのアセットをプロジェクトのパス配下でも読み込めるよう、`base: './'`を維持しています。同じビルドをローカルで確認する場合:

```bash
pnpm run build
pnpm run preview --base /cesium-starter/
```

`build:ghpages`と`preview:ghpages`は、`docs/`を使ったローカル確認用に残しています。自動公開は`dist/`を使用します。生成された`dist/`と`docs/`はGitの管理対象外で、コミットしません。

<br>

保守

日次の依存関係更新に含まれないPlaywright、Node.jsの型定義、Prettier、Node.js、pnpmは、[手動更新手順](.github/AUTOMATION.md#manual-tooling-updates)に沿って確認・更新します。

<br>

整形

`pnpm run format:check`は、ファイルを書き換えずに整形されていないファイルを報告します。

```bash
pnpm run format
```

<br>

## 背景地図

背景地図は[MIERUNE](https://mierune.co.jp)のタイルを使用し、Cesium ionのトークンは設定していません。地形やionアセットなどionのサービスを使う場合は、`src/main.ts`でアクセストークン（`Cesium.Ion.defaultAccessToken`）の設定が必要です。

<br>
<br>

![README01](img/README01.gif)

<br>

## ライセンス
MIT

Copyright (c) 2022-2026 Yasunori Kirimoto

<br>
