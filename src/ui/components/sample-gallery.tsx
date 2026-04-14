import { ImageIcon } from "lucide-react";
import type { Sample } from "@/ui/samples";

type SampleGalleryProps = {
  samples: Sample[];
  onSelect(sample: Sample): void;
};

export function SampleGallery(props: SampleGalleryProps) {
  return (
    <div
      className="gap-4 [column-fill:_balance]"
      style={{
        columnCount: "var(--gallery-cols, 2)",
      }}
    >
      <style>{`
        [data-gallery] { --gallery-cols: 1; }
        @media (min-width: 640px) { [data-gallery] { --gallery-cols: 2; } }
        @media (min-width: 1024px) { [data-gallery] { --gallery-cols: 3; } }
        @media (min-width: 1440px) { [data-gallery] { --gallery-cols: 4; } }
      `}</style>
      <div data-gallery style={{ columnCount: "var(--gallery-cols, 2)", columnGap: "1rem" }}>
        {props.samples.map((sample) => (
          <button
              key={sample.id}
              type="button"
              className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-border/60 bg-secondary transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 [break-inside:avoid]"
              onClick={() => props.onSelect(sample)}
            >
              {sample.imageUrl ? (
                <img
                  className="block w-full transition-transform duration-300 group-hover:scale-105"
                  src={sample.imageUrl.replace("/samples/", "/samples/thumbs/")}
                  alt={sample.label}
                  loading="lazy"
                />
              ) : (
                <div className="grid aspect-square w-full place-items-center text-muted-foreground">
                  <ImageIcon className="size-8 opacity-40" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 pb-3 pt-8 transition-transform duration-200 group-hover:translate-y-0">
                <p className="text-sm font-semibold text-white">{sample.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/80">
                  {sample.prompt}
                </p>
              </div>
          </button>
        ))}
      </div>
    </div>
  );
}
