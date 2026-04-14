# Profile Icon Generator - 設計書

## 概要

自然言語プロンプトから SNS プロフィールアイコンを生成する Web アプリケーション。
Cloudflare エコシステム（Workers, D1, R2, Workers AI）上で動作する。

## 技術スタック

| 項目 | 選択 |
|------|------|
| ランタイム | Cloudflare Workers |
| フレームワーク | Hono |
| フロントエンド | React SPA (Vite ビルド) |
| DB | Cloudflare D1 (SQLite) + Drizzle ORM |
| 画像ストレージ | Cloudflare R2 |
| 画像生成 | Workers AI (FLUX.2 dev)。DI で差し替え可能 |
| 認証 | なし |
| IaC | Terraform (インフラ) + Wrangler (コード・マイグレーション) |

---

## フォルダ構成

```
cloudflare-profile-icon/
├── src/
│   ├── index.ts                          # Worker エントリポイント (Hono app)
│   ├── api/
│   │   ├── routes.ts                     # API ルート集約
│   │   ├── generations.ts                # /api/generations ルート定義
│   │   └── presets.ts                    # /api/presets ルート定義
│   ├── usecase/
│   │   ├── create-generation.ts          # 画像生成 → R2保存 → D1記録
│   │   ├── get-generation.ts             # ID指定で生成結果取得
│   │   ├── list-generations.ts           # 生成履歴一覧
│   │   └── get-generation-image.ts       # 生成画像バイナリ取得
│   ├── domain/
│   │   ├── generation.ts                 # Generation エンティティ
│   │   ├── preset.ts                     # SizePreset 定義 (ValueObject・コード内定数)
│   │   ├── generation-repository.ts      # Repository interface
│   │   ├── image-storage.ts              # Storage interface
│   │   └── image-generator/
│   │       ├── interface.ts              # ImageGenerator interface
│   │       ├── workers-ai.ts            # Workers AI (FLUX.2 dev) 実装
│   │       ├── openai.ts                # GPT Image 実装 (将来)
│   │       └── factory.ts               # 生成器の選択 (factory パターン)
│   ├── infrastructure/
│   │   ├── schema.ts                    # Drizzle スキーマ定義
│   │   ├── database.ts                  # Drizzle D1 クライアント初期化
│   │   ├── d1-generation-repository.ts   # Drizzle 経由の Generation 永続化
│   │   ├── r2-image-storage.ts           # R2 による画像保存・取得
│   │   └── bindings.ts                  # Cloudflare Bindings 型定義
│   └── ui/
│       ├── index.html                    # SPA エントリ
│       ├── app.tsx                       # React ルートコンポーネント
│       ├── components/
│       │   ├── prompt-form.tsx           # プロンプト入力フォーム
│       │   ├── preset-selector.tsx       # サイズプリセット選択UI
│       │   ├── image-preview.tsx         # 生成結果プレビュー
│       │   └── history-list.tsx          # 生成履歴一覧
│       └── hooks/
│           └── use-generate.ts           # 画像生成API呼び出しhook
├── migrations/
│   └── 0001_create_generations.sql
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── wrangler.toml
├── drizzle.config.ts                    # Drizzle Kit 設定
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## API エンドポイント (リソースベース)

### Presets

| メソッド | パス | 説明 |
|---------|------|------|
| `GET` | `/api/presets` | プリセット一覧 |
| `GET` | `/api/presets/:id` | プリセット詳細 |

### Generations

| メソッド | パス | 説明 |
|---------|------|------|
| `POST` | `/api/generations` | 画像生成（= Generation リソースの作成） |
| `GET` | `/api/generations` | 生成履歴一覧（ページネーション） |
| `GET` | `/api/generations/:id` | 生成結果詳細 |
| `GET` | `/api/generations/:id/image` | 生成画像バイナリ |

### リクエスト・レスポンス

```typescript
// POST /api/generations
// Request
{
  prompt: string;       // "猫耳の女の子、アニメ風"
  presetId: string;     // "x-twitter"
}

// Response (201 Created)
{
  id: string;
  prompt: string;
  fullPrompt: string;
  presetId: string;
  width: number;
  height: number;
  model: string;
  imageUrl: string;     // "/api/generations/{id}/image"
  createdAt: string;
}

// GET /api/generations
// Query: ?limit=20&cursor=xxx
// Response
{
  items: Generation[];
  nextCursor: string | null;
}

// GET /api/presets
// Response
{
  items: SizePreset[];
}
```

---

## ドメインモデル

### SizePreset (ValueObject / コード内定数)

```typescript
type SizePreset = {
  id: string;            // "x-twitter" | "instagram" | "discord" | "universal"
  label: string;         // "X (Twitter)"
  description: string;   // "400x400px, 円形切り抜き"
  width: number;
  height: number;
  format: "png" | "jpeg";
  promptSuffix: string;  // ", centered composition, safe for circular crop"
};
```

| id | label | サイズ | promptSuffix |
|----|-------|--------|-------------|
| `x-twitter` | X (Twitter) | 400x400 | centered composition, important elements in center, safe for circular crop |
| `instagram` | Instagram | 1080x1080 | centered composition, important elements in center, safe for circular crop |
| `discord` | Discord | 512x512 | centered composition, important elements in center, safe for circular crop |
| `universal` | 汎用 | 512x512 | centered composition, important elements in center, safe for circular crop |

promptSuffix はユーザーのプロンプトに裏で付与し、円形切り抜き時に重要な要素が切れることを防ぐ。

### Generation (Entity)

```typescript
type Generation = {
  id: string;           // ULID
  prompt: string;       // ユーザー入力の原文
  fullPrompt: string;   // promptSuffix 付与後の実プロンプト
  presetId: string;
  width: number;
  height: number;
  model: string;        // "workers-ai/flux-2-dev"
  imageKey: string;     // R2 オブジェクトキー
  createdAt: string;    // ISO 8601
};
```

### ImageGenerator (Interface)

```typescript
interface ImageGenerator {
  generate(params: {
    prompt: string;
    width: number;
    height: number;
  }): Promise<{
    image: ArrayBuffer;
    model: string;
  }>;
}
```

### GenerationRepository (Interface)

```typescript
interface GenerationRepository {
  save(generation: Generation): Promise<void>;
  findById(id: string): Promise<Generation | null>;
  findAll(params: { limit: number; cursor?: string }): Promise<{
    items: Generation[];
    nextCursor: string | null;
  }>;
}
```

### ImageStorage (Interface)

```typescript
interface ImageStorage {
  save(key: string, image: ArrayBuffer, contentType: string): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
}
```

---

## ユースケース

### CreateGeneration

画像生成の中核ユースケース。プロンプトとプリセットを受け取り、画像生成 → R2 保存 → D1 記録を行う。

```typescript
class CreateGeneration {
  constructor(
    private generator: ImageGenerator,
    private repository: GenerationRepository,
    private storage: ImageStorage,
  ) {}

  async execute(input: {
    prompt: string;
    presetId: string;
  }): Promise<Generation> {
    // 1. プリセット解決
    const preset = getPreset(input.presetId);

    // 2. フルプロンプト構築
    const fullPrompt = `${input.prompt}, ${preset.promptSuffix}`;

    // 3. 画像生成
    const result = await this.generator.generate({
      prompt: fullPrompt,
      width: preset.width,
      height: preset.height,
    });

    // 4. R2 に画像保存
    const imageKey = `generations/${id}.${preset.format}`;
    await this.storage.save(imageKey, result.image, `image/${preset.format}`);

    // 5. D1 に記録
    const generation = Generation.create({
      prompt: input.prompt,
      fullPrompt,
      presetId: preset.id,
      width: preset.width,
      height: preset.height,
      model: result.model,
      imageKey,
    });
    await this.repository.save(generation);

    return generation;
  }
}
```

### GetGeneration

```typescript
class GetGeneration {
  constructor(private repository: GenerationRepository) {}

  async execute(id: string): Promise<Generation> {
    const generation = await this.repository.findById(id);
    if (!generation) throw new NotFoundError("Generation", id);
    return generation;
  }
}
```

### ListGenerations

```typescript
class ListGenerations {
  constructor(private repository: GenerationRepository) {}

  async execute(params: {
    limit: number;
    cursor?: string;
  }): Promise<{ items: Generation[]; nextCursor: string | null }> {
    return this.repository.findAll(params);
  }
}
```

### GetGenerationImage

```typescript
class GetGenerationImage {
  constructor(
    private repository: GenerationRepository,
    private storage: ImageStorage,
  ) {}

  async execute(id: string): Promise<{ image: ArrayBuffer; contentType: string }> {
    const generation = await this.repository.findById(id);
    if (!generation) throw new NotFoundError("Generation", id);

    const image = await this.storage.get(generation.imageKey);
    if (!image) throw new NotFoundError("Image", generation.imageKey);

    const format = generation.imageKey.endsWith(".png") ? "png" : "jpeg";
    return { image, contentType: `image/${format}` };
  }
}
```

---

## DB スキーマ (Drizzle ORM)

Drizzle でスキーマを定義し、`drizzle-kit generate` でマイグレーション SQL を自動生成する。

```typescript
// infrastructure/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const generations = sqliteTable("generations", {
  id:         text("id").primaryKey(),
  prompt:     text("prompt").notNull(),
  fullPrompt: text("full_prompt").notNull(),
  presetId:   text("preset_id").notNull(),
  width:      integer("width").notNull(),
  height:     integer("height").notNull(),
  model:      text("model").notNull(),
  imageKey:   text("image_key").notNull(),
  createdAt:  text("created_at").notNull(),
});
```

```typescript
// infrastructure/database.ts
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;
```

マイグレーションは `drizzle-kit generate` → `wrangler d1 migrations apply` の2ステップ。

```
├── drizzle.config.ts        # Drizzle Kit 設定
├── migrations/              # drizzle-kit が自動生成
│   └── 0001_create_generations.sql
```

---

## DI / Factory

Workers 環境では軽量な factory パターンで DI を実現する。

```typescript
// domain/image-generator/factory.ts
function createImageGenerator(env: Env): ImageGenerator {
  const type = env.IMAGE_GENERATOR ?? "workers-ai";
  switch (type) {
    case "workers-ai":
      return new WorkersAIGenerator(env.AI);
    case "openai":
      return new OpenAIGenerator(env.OPENAI_API_KEY);
    default:
      return new WorkersAIGenerator(env.AI);
  }
}
```

環境変数 `IMAGE_GENERATOR` で切り替え。デフォルトは `workers-ai`。

---

## 開発環境

`wrangler dev` でローカル開発。Miniflare (workerd) が内蔵されている。

| サービス | ローカル動作 | 仕組み |
|---------|------------|--------|
| Workers (Hono) | OK | workerd ランタイム |
| D1 | OK | `.wrangler/state/v3/d1/` にローカル SQLite |
| R2 | OK | `.wrangler/state/` にローカルファイル |
| Workers AI | NG（リモートのみ） | Cloudflare アカウントログイン必須。無料枠 10,000 neurons/日 |

開発時は `MockImageGenerator`（固定のダミー画像を返す）を使い、Workers AI を叩かずに API・フロントエンド開発を進める。画像生成の動作確認のみリモート実行。

```
wrangler login           # 初回のみ
wrangler dev             # ローカル開発サーバー起動
wrangler d1 migrations apply --local  # ローカル D1 にマイグレーション適用
```

---

## 実装計画

| Phase | 内容 | 成果物 |
|-------|------|--------|
| **Phase 1: 基盤** | プロジェクト初期化 (pnpm, Hono, Vite, TypeScript)、wrangler.toml、Terraform で D1/R2 作成 | 動く Worker (hello world) |
| **Phase 2: 画像生成コア** | domain 層 (エンティティ, interface, preset)、infrastructure 層 (D1, R2)、usecase (CreateGeneration)、Workers AI 実装 | `POST /api/generations` が動く |
| **Phase 3: API 完成** | 残りのユースケース・ルート実装 | 全 API が curl で動作確認可能 |
| **Phase 4: フロントエンド** | React SPA、プリセット選択UI、プロンプト入力、プレビュー、履歴表示 | ブラウザで使える状態 |
| **Phase 5: デプロイ整備** | Terraform + Wrangler のデプロイフロー整備 | 一発デプロイ可能 |
