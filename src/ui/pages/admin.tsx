import { startTransition, useEffect, useState } from "react";
import type { GenerationDto } from "@/api/serializers";
import { HistoryList } from "@/ui/components/history-list";
import { ImagePreview } from "@/ui/components/image-preview";
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

export function AdminPage() {
  const [history, setHistory] = useState<GenerationDto[]>([]);
  const [selected, setSelected] = useState<GenerationDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ items: GenerationDto[] }>("/api/generations?limit=50")
      .then((res) => {
        startTransition(() => setHistory(res.items));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load.");
      });
  }, []);

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
            <HistoryList items={history} onSelect={setSelected} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ImagePreview generation={selected} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
