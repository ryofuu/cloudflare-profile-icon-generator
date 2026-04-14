# cloudflare-profile-icon

自然言語プロンプトから SNS プロフィールアイコンを生成する Cloudflare Workers アプリです。  
ローカル UI は Vite、API は Hono on Workers、永続化は D1/R2、画像生成は Workers AI を使います。

## 技術構成

- Runtime: Cloudflare Workers
- API: Hono
- UI: React + Vite + Tailwind CSS v4 + shadcn-style components
- Database: Cloudflare D1 + Drizzle ORM
- Object storage: Cloudflare R2
- Image generation: Workers AI

## 前提

- Node.js 24 系
- pnpm
- Cloudflare アカウント
- Wrangler 認証用の API Token

`wrangler login` は必須ではありません。  
この repo では `.env` に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` を置く前提で動かせます。

## 初回セットアップ

### 1. 依存を入れる

```bash
pnpm install
```

### 2. 環境変数を作る

`.env.example` をコピーして `.env` を作ります。

```bash
cp .env.example .env
```

設定する値:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Cloudflare 側の初期準備

### 必須

1. `workers.dev` サブドメインを有効化する
2. D1 データベース `cloudflare-profile-icon` を作る
3. R2 バケット `cloudflare-profile-icon-images` を作る
4. Worker `cloudflare-profile-icon` を一度デプロイする

### 参考コマンド

#### D1 作成

```bash
wrangler d1 create cloudflare-profile-icon
```

作成後、返ってきた `database_id` を [wrangler.toml](./wrangler.toml) の `[[d1_databases]]` に反映します。

#### リモート migration 適用

```bash
pnpm d1:migrate:remote
```

#### デプロイ

```bash
pnpm deploy
```

## ローカル開発

### 本物の Workers AI を使って確認する

```bash
pkill -f workerd || true
pnpm dev:local
```

起動後:

- UI: `http://127.0.0.1:5173`
- Worker API: `http://127.0.0.1:8787`

`dev:local` は次をまとめてやります。

1. ローカル D1 migration
2. Vite dev server 起動
3. `wrangler dev --port 8787` 起動

### 補足

- 今の既定値は `IMAGE_GENERATOR = "workers-ai"` です
- ローカルでも画像生成時は Cloudflare Workers AI を呼びます
- 完全ローカルではなく、Cloudflare 側の preview/session を使う構成です

## よく使うコマンド

```bash
pnpm dev:local
pnpm build
pnpm test
pnpm typecheck
pnpm d1:migrate:local
pnpm d1:migrate:remote
pnpm deploy
pnpm deploy:sync
pnpm infra:sync
```

## デプロイ運用

### 通常

Cloudflare ダッシュボードや `wrangler` で手動作成済みのリソースを使う場合:

```bash
pnpm deploy
```

### Terraform 出力から `wrangler.toml` を同期したい場合

```bash
pnpm infra:sync
pnpm deploy
```

または一括で:

```bash
pnpm deploy:sync
```

`infra:sync` は `terraform output -json` を読み、`wrangler.toml` の以下を上書きします。

- `database_name`
- `database_id`
- `bucket_name`

## トラブルシュート

### `command not found: wrangler`

この repo ではローカル依存として入っているので、次で動きます。

```bash
pnpm exec wrangler --version
```

グローバルに入れる場合:

```bash
npm install -g wrangler
```

### `Failed to start the remote proxy session`

主に次を確認します。

- `workers.dev` サブドメインが有効か
- Worker が一度でも deploy 済みか
- `preview_urls` が有効か
- `.env` の token/account ID が正しいか

この repo では [wrangler.toml](./wrangler.toml) で `workers_dev = true` と `preview_urls = true` を明示しています。

### `database is locked`

古い `workerd` が残っていることがあります。

```bash
pkill -f workerd || true
pnpm dev:local
```

### `Authentication error [code: 10000]`

Cloudflare API Token の権限不足です。  
最低でも Workers deploy に必要な権限を持つ token を使ってください。

### `D1 binding 'DB' references database ... was not found`

`wrangler.toml` の `database_id` が実在 D1 と一致していません。  
`wrangler d1 create` の戻り値か Terraform 出力で更新してください。
