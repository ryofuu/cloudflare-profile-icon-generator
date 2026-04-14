import { startTransition, useEffect, useState } from "react";
import { Aperture, History, Sparkles } from "lucide-react";
import type { GenerationDto } from "@/api/serializers";
import type { SizePreset } from "@/domain/preset";
import { HistoryList } from "@/ui/components/history-list";
import { ImagePreview } from "@/ui/components/image-preview";
import { PresetSelector } from "@/ui/components/preset-selector";
import { PromptForm } from "@/ui/components/prompt-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { useGenerate } from "@/ui/hooks/use-generate";

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    const fallback = await response.text();
    throw new Error(fallback || "Request failed.");
  }

  return (await response.json()) as T;
}

export function App() {
  const [presets, setPresets] = useState<SizePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("x-twitter");
  const [history, setHistory] = useState<GenerationDto[]>([]);
  const [latestGeneration, setLatestGeneration] = useState<GenerationDto | null>(
    null,
  );
  const [prompt, setPrompt] = useState(
    "優しい表情のキツネ、フラットな背景、上品な色使い、アニメ調",
  );
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  const { generate, isSubmitting, error: submitError } = useGenerate();

  useEffect(() => {
    async function bootstrap() {
      try {
        const [presetResponse, historyResponse] = await Promise.all([
          fetchJson<{ items: SizePreset[] }>("/api/presets"),
          fetchJson<{ items: GenerationDto[] }>("/api/generations?limit=8"),
        ]);

        setPresets(presetResponse.items);
        startTransition(() => {
          setHistory(historyResponse.items);
        });
      } catch (error) {
        setBootstrapError(
          error instanceof Error
            ? error.message
            : "初期データの読み込みに失敗しました。",
        );
      }
    }

    void bootstrap();
  }, []);

  async function handleGenerate() {
    try {
      const generation = await generate({
        prompt,
        presetId: selectedPresetId,
      });

      setLatestGeneration(generation);
      const historyResponse = await fetchJson<{ items: GenerationDto[] }>(
        "/api/generations?limit=8",
      );
      startTransition(() => {
        setHistory(historyResponse.items);
      });
    } catch {
      // The hook already stores the user-facing error state.
    }
  }

  const activeError = submitError ?? bootstrapError;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.26),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_32%),linear-gradient(180deg,#fffdf7_0%,#f6f7fb_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-56 w-5/6 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_65%)] blur-3xl" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:px-8 lg:py-14">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-amber-700">
                <Sparkles className="size-3.5" />
                Cloudflare Workers + React SPA
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
                  Profile Icon Generator
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  自然言語からプロフィールアイコンを生成し、履歴と画像 URL を同じ画面で扱えます。
                </p>
              </div>
              {activeError ? (
                <div className="rounded-[1.4rem] border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800">
                  {activeError}
                </div>
              ) : null}
            </div>
            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.6rem] border border-border/80 bg-white/60 p-5">
                <Aperture className="mb-4 size-5 text-amber-700" />
                <p className="text-xs uppercase tracking-[0.24em] text-amber-700">
                  Presets
                </p>
                <p className="mt-3 text-foreground">SNS ごとのサイズ差分を preset で吸収します。</p>
              </div>
              <div className="rounded-[1.6rem] border border-border/80 bg-white/60 p-5">
                <Sparkles className="mb-4 size-5 text-sky-700" />
                <p className="text-xs uppercase tracking-[0.24em] text-sky-700">
                  Provider
                </p>
                <p className="mt-3 text-foreground">ローカルでは mock、配備後は Workers AI へ切替可能です。</p>
              </div>
              <div className="rounded-[1.6rem] border border-border/80 bg-white/60 p-5">
                <History className="mb-4 size-5 text-emerald-700" />
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
                  History
                </p>
                <p className="mt-3 text-foreground">生成履歴から過去アイコンを再確認できます。</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card>
            <CardHeader>
              <CardTitle>Output Size</CardTitle>
              <CardDescription>shadcn ベースの preset selector で出力サイズを選びます。</CardDescription>
            </CardHeader>
            <CardContent>
              <PresetSelector
                presets={presets}
                selectedPresetId={selectedPresetId}
                onSelect={setSelectedPresetId}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Image Prompt</CardTitle>
              <CardDescription>要素が円形トリミングで欠けにくいよう、preset suffix を API 側で追加します。</CardDescription>
            </CardHeader>
            <CardContent>
              <PromptForm
                prompt={prompt}
                isSubmitting={isSubmitting}
                onPromptChange={setPrompt}
                onSubmit={handleGenerate}
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <Card>
            <CardHeader>
              <CardTitle>Latest Result</CardTitle>
              <CardDescription>直近に生成された画像をメタデータ付きで表示します。</CardDescription>
            </CardHeader>
            <CardContent>
              <ImagePreview generation={latestGeneration} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Generations</CardTitle>
              <CardDescription>履歴を選ぶと右側プレビューへ即反映します。</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoryList items={history} onSelect={setLatestGeneration} />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
