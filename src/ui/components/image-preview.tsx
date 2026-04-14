import type { GenerationDto } from "@/api/serializers";
import { buttonVariants } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";

type ImagePreviewProps = {
  generation: GenerationDto | null;
};

export function ImagePreview(props: ImagePreviewProps) {
  if (!props.generation) {
    return (
      <div className="grid min-h-80 place-items-center rounded-[1.8rem] border border-dashed border-border/80 bg-background/50 text-center text-muted-foreground">
        <p>生成するとここに最新アイコンが表示されます。</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {props.generation.imageUrl ? (
        <img
          className="aspect-square w-full max-w-[420px] rounded-[2rem] border border-border/70 bg-secondary object-cover"
          src={props.generation.imageUrl}
          alt={props.generation.prompt}
        />
      ) : (
        <div className="grid aspect-square w-full max-w-[420px] place-items-center rounded-[2rem] border border-dashed border-border/80 bg-secondary/50 text-sm text-muted-foreground">
          画像はまだ利用できません
        </div>
      )}
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.25rem] bg-secondary/80 p-4">
          <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preset</dt>
          <dd className="mt-2 text-sm font-semibold">{props.generation.presetId}</dd>
        </div>
        <div className="rounded-[1.25rem] bg-secondary/80 p-4">
          <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Model</dt>
          <dd className="mt-2 text-sm font-semibold">{props.generation.model}</dd>
        </div>
        <div className="rounded-[1.25rem] bg-secondary/80 p-4">
          <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Created</dt>
          <dd className="mt-2 text-sm font-semibold">
            {new Date(props.generation.createdAt).toLocaleString("ja-JP")}
          </dd>
        </div>
      </dl>
      <p className="rounded-[1.4rem] border border-border/70 bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground">
        {props.generation.fullPrompt}
      </p>
      {props.generation.imageUrl ? (
        <a
          className={cn(buttonVariants(), "w-full sm:w-fit")}
          href={props.generation.imageUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open Image
        </a>
      ) : null}
    </div>
  );
}
