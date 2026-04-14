import { ImageIcon } from "lucide-react";
import type { Sample } from "@/ui/samples";
import { cn } from "@/lib/utils";

type SampleGalleryProps = {
  samples: Sample[];
  onSelect(prompt: string): void;
};

export function SampleGallery(props: SampleGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {props.samples.map((sample) => (
        <button
          key={sample.id}
          type="button"
          className={cn(
            "group grid gap-2 rounded-2xl border border-border/80 bg-white/70 p-3 text-left",
            "transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-amber-950/10",
          )}
          onClick={() => props.onSelect(sample.prompt)}
        >
          {sample.imageUrl ? (
            <img
              className="aspect-square w-full rounded-xl border border-border/70 bg-secondary object-cover"
              src={sample.imageUrl}
              alt={sample.label}
            />
          ) : (
            <div className="grid aspect-square w-full place-items-center rounded-xl border border-dashed border-border/70 bg-secondary/50 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
              <ImageIcon className="size-8 opacity-40" />
            </div>
          )}
          <span className="text-xs font-medium leading-tight text-foreground">
            {sample.label}
          </span>
          <span className="line-clamp-2 text-[11px] leading-4 text-muted-foreground">
            {sample.prompt}
          </span>
        </button>
      ))}
    </div>
  );
}
