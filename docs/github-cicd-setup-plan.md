# GitHub CI/CD Setup Plan

## 目的

GitHub Actions から `cloudflare-profile-icon` を安全に deploy できる状態にする。  
対象は GitHub 側の設定で、アプリコードの追加実装は含まない。

## 前提

- リポジトリ内には GitHub Actions workflow が追加済み
  - `.github/workflows/ci.yml`
  - `.github/workflows/deploy.yml`
- Cloudflare 側では以下が作成済み
  - Worker: `cloudflare-profile-icon`
  - D1: `cloudflare-profile-icon`
  - R2: `cloudflare-profile-icon-images`
- Cloudflare API Token と Account ID は取得済み

## やること

### 1. GitHub リポジトリを作成する

- GitHub 上で新しい repository を作る
- ローカル repo に remote を追加する
- `main` を push する

参考コマンド:

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### 2. GitHub Actions Secrets を追加する

GitHub の `Settings > Secrets and variables > Actions` で以下を登録する。

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 3. GitHub Environment を設定する

対象: GitHub の `Settings > Environments`

- `production` environment を作る
- 必要なら `Required reviewers` を設定する

補足:

- 今の workflow は `environment: production` を前提にしている
- Environment を空で作るだけでもよい
- 承認フローを入れたい場合だけ reviewer を付ける

### 4. workflow の実行確認をする

#### CI 確認

- feature branch か PR を作る
- `CI` workflow が成功することを確認する

#### Deploy 確認

- `main` へ push する
- `Deploy` workflow が成功することを確認する

実行内容:

- `pnpm validate`
- `pnpm d1:migrate:remote`
- `pnpm deploy:prod`

## 完了条件

- GitHub repository が remote として接続されている
- GitHub Actions Secrets が 2 つ登録されている
- `production` environment が存在する
- `CI` workflow が green
- `Deploy` workflow が green
- Cloudflare 上の Worker 最新版が GitHub Actions から deploy される

## 注意点

- 今の deploy workflow は `main` push で本番 deploy する
- D1 migration も自動適用する
- 破壊的 migration が将来入るなら、deploy と migration を分ける再設計が必要

## 作業後に確認したいこと

- GitHub 上で workflow run URL を控える
- Cloudflare Dashboard で Worker の `Current Version ID` が更新されていることを確認する
