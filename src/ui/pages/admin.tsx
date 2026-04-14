import { startTransition, useEffect, useLayoutEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { GenerationDto } from "@/api/serializers";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as T;
}

async function toggleHidden(id: string, hidden: boolean): Promise<void> {
  const response = await fetch(`/api/generations/${id}/hidden`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hidden }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export function AdminPage() {
  const [history, setHistory] = useState<GenerationDto[]>([]);
  const [selected, setSelected] = useState<GenerationDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  function refresh() {
    fetchJson<{ items: GenerationDto[] }>("/api/generations?limit=50&includeHidden=true")
      .then((res) => {
        startTransition(() => setHistory(res.items));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load.");
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleToggleHidden(item: GenerationDto) {
    try {
      await toggleHidden(item.id, !item.hidden);
      refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <h1 className="mb-8 text-2xl font-bold">Generation History (Admin)</h1>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">履歴はまだありません。</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-xl border border-border/80 bg-white/70 p-3",
                      item.hidden && "opacity-50",
                      selected?.id === item.id && "border-primary/40 bg-primary/5",
                    )}
                  >
                    <button
                      type="button"
                      className="text-left"
                      onClick={() => setSelected(item)}
                    >
                      {item.imageUrl ? (
                        <img
                          className="size-[72px] rounded-lg border border-border/70 bg-secondary object-cover"
                          src={item.imageUrl}
                          alt={item.prompt}
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid size-[72px] place-items-center rounded-lg border border-dashed border-border/70 bg-secondary/70 text-[10px] uppercase text-muted-foreground">
                          {item.status}
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      className="text-left"
                      onClick={() => setSelected(item)}
                    >
                      <p className="line-clamp-2 text-sm text-foreground/80">
                        {item.prompt}
                      </p>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-lg p-2 transition-colors",
                        item.hidden
                          ? "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          : "text-amber-700 hover:bg-amber-50",
                      )}
                      title={item.hidden ? "ギャラリーに表示する" : "ギャラリーから非表示にする"}
                      onClick={() => handleToggleHidden(item)}
                    >
                      {item.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="h-fit lg:sticky lg:top-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selected?.imageUrl ? (
              <div className="grid gap-4">
                <img
                  className="w-full rounded-2xl border border-border/70 bg-secondary"
                  src={selected.imageUrl}
                  alt={selected.prompt}
                />
                <p className="text-sm text-muted-foreground">{selected.prompt}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.hidden ? "非表示" : "表示中"} / {selected.presetId} / {new Date(selected.createdAt).toLocaleString("ja-JP")}
                </p>
              </div>
            ) : (
              <div className="grid min-h-40 place-items-center text-sm text-muted-foreground">
                左のリストから選択してください
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
