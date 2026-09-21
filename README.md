# Chirping Astro Starter

A minimal starter template for [Chirping Astro](https://github.com/kannansuresh/chirping-astro) — a Chirpy-inspired, Japanese-language **Astro v7** blog theme with **Tailwind CSS v4**, **daisyUI v5**, **Giscus** comments, **Mermaid** diagrams, and **KaTeX** math.

> **Live demo:** [https://kannansuresh.github.io/chirping-astro](https://kannansuresh.github.io/chirping-astro)

## Quick Start

### Option 1: Astro CLI (recommended)

```bash
bunx create-astro@latest --template kannansuresh/chirping-astro-starter
```

The wizard will prompt you for a project name, install dependencies, and initialize git.

### Option 2: Clone directly

```bash
git clone https://github.com/kannansuresh/chirping-astro-starter.git my-blog
cd my-blog
bun install
```

### Start dev server

```bash
bun dev
```

Open [http://localhost:4321](http://localhost:4321) to see your site.

## Configuration

1. Edit `src/config.ts` to set your site title, author name, and social links.
2. Copy `.env.example` to `.env` and fill in your values.
3. Replace `src/assets/images/site/avatar.svg` with your own avatar.
4. Replace `src/assets/images/site/favicon.svg` with your own favicon.
5. Start writing posts in `src/content/posts/`.

## Writing Posts

記事ファイルは `yyyy-mm-dd-記事ナンバー.md` の形式で命名します（例：`2023-04-15-02.md`）。
記事一覧はピン止めを優先し、ピン止めあり・なしの各グループ内でファイル名の文字列降順に表示します。
記事ナンバーは `01`、`02` のように桁数を揃えてください。
「前の記事・次の記事」はピン止めを考慮せず、ファイル名順で決まります。
`pubDate` は公開日の表示に使用します。「最近更新した記事」は更新日（未設定なら公開日）の新しい順です。

記事内のローカル画像は、記事からの相対パスで指定します。
例：`![説明](../../assets/images/posts/example.webp)`。
`/src/assets/...` は公開用URLではないため使用しません。

Create a new `.md` or `.mdx` file in `src/content/posts/`:

```markdown
---
title: 'My First Post'
description: 'A short summary of this post.'
pubDate: 2026-01-01
tags: [hello, world]
categories: [General]
---

Your content here...
```

See the included sample post for all available frontmatter fields.

## Cloudflare Workersへの公開

本番URLは **https://blog.ctsetera.dev** です。
Astroで生成した `dist/` をWorkers Static Assetsで配信します。
RSS・OG画像もビルド時に生成するため、SSRアダプターは不要です。

### 実行環境

- Node.js 24系（`.node-version`）
- Bun 1.4.2（`.bun-version`、`package.json`）
- Wranglerは開発用依存関係として管理し、`bun.lock` をコミットします。

Bunは依存関係の管理とテストに使用します。Astro・WranglerはNode.jsで実行するため、
ローカルにもNode.js 24系をインストールしてください。`bunfig.toml` の `run.bun` は `false` にしています。

```bash
bun install --frozen-lockfile
cp .env.example .env
bun run dev
```

`.env` の `SITE_URL` は `https://blog.ctsetera.dev`、`BASE_PATH` は `/` にします。
公開URLを変更する場合は、`src/config.ts` の既定値、`wrangler.jsonc` のドメイン、
`public/robots.txt` のサイトマップURLも合わせて変更してください。

### ローカルで公開前に確認

```bash
bun run typecheck
bun run lint
bun test
bun run deploy:check
bun run preview:workers
```

`deploy:check` はビルドとWranglerのdry-runを行い、公開はしません。
`preview:workers` はビルド後にWorkersのローカル配信を起動します。
表示されたローカルURLで、記事・タグ・カテゴリ・RSSを確認できます。
`/about`、`/archives`、`/privacy`、その他の存在しないURLは既存の404ページを返します。

### Cloudflare側の初回設定

1. Cloudflareで `ctsetera.dev` のゾーンを有効にします。
2. Workers & PagesでGitHubリポジトリを接続し、Worker名を `tech-blog` にします。
   Worker名は `wrangler.jsonc` の `name` と揃えます。
3. Workers Buildsを次のとおり設定します。

| 項目                           | 設定値                                           |
| ------------------------------ | ------------------------------------------------ |
| 本番ブランチ                   | `main`                                           |
| ルートディレクトリ             | リポジトリのルート                               |
| ビルドコマンド                 | `bun install --frozen-lockfile && bun run build` |
| デプロイコマンド               | `bunx --no-install wrangler deploy`              |
| 本番以外のブランチの自動ビルド | 無効（必要になった時点でプレビュー構成を追加）   |

ビルド用の環境変数は次のとおりです。

| 変数                      | 値                                              |
| ------------------------- | ----------------------------------------------- |
| `NODE_VERSION`            | `24`                                            |
| `BUN_VERSION`             | `1.4.2`                                         |
| `SKIP_DEPENDENCY_INSTALL` | `1`（上記ビルドコマンドで明示的にインストール） |
| `SITE_URL`                | `https://blog.ctsetera.dev`                     |
| `BASE_PATH`               | `/`                                             |

著者のSNSやGiscusを設定する場合は `.env.example` の `PUBLIC_*` もビルド用環境変数に追加します。
これらは生成ファイルに反映されるため、変更後は再ビルドが必要です。
Cloudflareの実行時変数だけを変更しても静的ページには反映されません。

4. 変更を `main` にpushすると、Workers Buildsがビルドして公開します。
   初回公開で `wrangler.jsonc` のCustom Domain設定により `blog.ctsetera.dev` をWorkerに割り当てます。
   同じホスト名に既存のCNAMEがある場合は、Cloudflare側で用途を確認してから整理してください。
5. 本番URLで表示・RSS・404を確認します。

`workers.dev` とバージョンプレビューURLは無効にしており、本番の公開先は独自ドメインです。
GitHub Actionsの `.github/workflows/ci.yml` は型チェック・Lint・テスト・ビルド・dry-run専用です。
以前のGitHub Pagesへの自動デプロイは削除しています。

### 手元から公開する場合

CloudflareのGit連携を使わず、ローカルから公開することもできます。

```bash
bunx --no-install wrangler login
bun run deploy
```

このコマンドは実際に本番へ公開します。ログインするアカウントは `ctsetera.dev` を管理するものを使用してください。
`bun run deploy` は公開直前にサイトを再生成します。

参考：[Astroの静的サイト公開](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)、
[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)、
[カスタムドメイン](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)。

## Giscus Comments

To enable GitHub Discussions-powered comments on posts:

1. Install the [Giscus app](https://github.com/apps/giscus) on your repo.
2. Go to [giscus.app](https://giscus.app), fill in your repo details, and copy the generated values.
3. Add these variables to the **Cloudflare Workers Builds build environment**:
   - `PUBLIC_GISCUS_ENABLED` = `true`
   - `PUBLIC_GISCUS_REPO` = `your-username/your-repo`
   - `PUBLIC_GISCUS_REPO_ID` = _(from giscus.app)_
   - `PUBLIC_GISCUS_CATEGORY` = `Announcements` _(or your chosen category)_
   - `PUBLIC_GISCUS_CATEGORY_ID` = _(from giscus.app)_

## 日本語専用の構成

記事は `src/content/posts/`、固定ページは `src/content/pages/` に配置します。
言語別フォルダや言語指定のフロントマターは不要です。
URLには言語プレフィックスを付けず、RSSは `/rss.xml` の1本です。
画面の日本語文言は `src/utils/ui.ts`、日付書式は `src/utils/site.ts` で編集できます。

## サイト内検索

サイト内検索は提供していません。記事はホーム、カテゴリ、タグから探せます。
`/search` にアクセスした場合は404ページを表示します。

## Customization

| What                            | Where                                   |
| ------------------------------- | --------------------------------------- |
| Site title, description, author | `src/config.ts` → `SITE`                |
| Navigation links                | `src/config.ts` → `NAV`                 |
| Social links                    | `src/config.ts` → `SOCIAL`              |
| Avatar image                    | `src/assets/images/site/avatar.svg`     |
| Favicon                         | `src/assets/images/site/favicon.svg`    |
| Default OG image                | `src/assets/images/site/og-default.svg` |
| Global styles                   | `src/styles/global.css`                 |
| Theme colors                    | daisyUI theme tokens in `global.css`    |

## Commands

| Command                   | Action                                  |
| ------------------------- | --------------------------------------- |
| `bun dev`                 | Start dev server at `localhost:4321`    |
| `bun run build`           | Build production site to `./dist/`      |
| `bun preview`             | Preview production build locally        |
| `bun run preview:workers` | Build and preview in local Workers      |
| `bun run deploy:check`    | Build and validate without publishing   |
| `bun run deploy`          | Build and publish to Cloudflare Workers |
| `bun run lint`            | Run ESLint                              |
| `bun run format`          | Format with Prettier                    |

## Documentation

For full documentation on all features (dark mode, math, comments, OG images, etc.), see the [main repository README](https://github.com/kannansuresh/chirping-astro#readme).

## Contributing & Issues

> **This starter repository is automatically synced from the [main Chirping Astro repository](https://github.com/kannansuresh/chirping-astro).** Please do not open pull requests here — changes will be overwritten on the next sync.

- **Found a bug?** [Open an issue](https://github.com/kannansuresh/chirping-astro/issues) on the main repository.
- **Want to contribute?** See the [contributing guide](https://github.com/kannansuresh/chirping-astro/blob/main/CONTRIBUTING.md) on the main repository.
- **Have a question?** Use [Discussions](https://github.com/kannansuresh/chirping-astro/discussions) on the main repository.

## License

MIT — see [LICENSE](./LICENSE).
