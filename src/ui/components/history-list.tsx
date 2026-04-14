import type { GenerationDto } from "@/api/serializers";
import { cn } from "@/lib/utils";

type HistoryListProps = {
  items: GenerationDto[];
  onSelect(item: GenerationDto): void;
};

export function HistoryList(props: HistoryListProps) {
  return (
    <div className="grid gap-3">
      {props.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">履歴はまだありません。</p>
      ) : (
        props.items.map((item, index) => (
          <button
            key={item.id}
            className={cn(
              "grid w-full grid-cols-[72px_1fr] gap-4 rounded-[1.5rem] border border-border/80 bg-white/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-amber-950/10",
              index === 0 && "border-primary/40 bg-primary/5",
            )}
            type="button"
            onClick={() => props.onSelect(item)}
          >
            {item.imageUrl ? (
              <img
                className="size-[72px] rounded-[1.2rem] border border-border/70 bg-secondary object-cover"
                src={item.imageUrl}
                alt={item.prompt}
              />
            ) : (
              <div className="grid size-[72px] place-items-center rounded-[1.2rem] border border-dashed border-border/70 bg-secondary/70 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {item.status}
              </div>
            )}
            <span className="grid gap-1">
              <strong className="text-sm uppercase tracking-[0.18em] text-amber-700">
                {item.presetId}
              </strong>
              <small className="line-clamp-3 text-sm leading-6 text-foreground/80">
                {item.prompt}
                {item.errorMessage ? ` / ${item.errorMessage}` : ""}
              </small>
            </span>
          </button>
        ))
      )}
    </div>
  );
}
