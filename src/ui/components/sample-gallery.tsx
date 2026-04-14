import { ImageIcon } from "lucide-react";
import type { Sample } from "@/ui/samples";

type SampleGalleryProps = {
  samples: Sample[];
  onSelect(sample: Sample): void;
};

export function SampleGallery(props: SampleGalleryProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {props.samples.map((sample) => (
        <button
          key={sample.id}
          type="button"
          className="group relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-secondary transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
          onClick={() => props.onSelect(sample)}
        >
          {sample.imageUrl ? (
            <img
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={sample.imageUrl}
              alt={sample.label}
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <ImageIcon className="size-8 opacity-40" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 pb-3 pt-8 transition-transform duration-200 group-hover:translate-y-0">
            <p className="text-sm font-semibold text-white">{sample.label}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">
              {sample.prompt}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
