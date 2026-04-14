import type { SizePreset } from "@/domain/preset";
import { cn } from "@/lib/utils";

type PresetSelectorProps = {
  presets: SizePreset[];
  selectedPresetId: string;
  onSelect(id: string): void;
};

export function PresetSelector(props: PresetSelectorProps) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3">
        {props.presets.map((preset) => {
          const isActive = preset.id === props.selectedPresetId;
          return (
            <button
              key={preset.id}
              className={cn(
                "grid gap-2 rounded-[1.5rem] border border-border/80 bg-white/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-amber-950/10",
                isActive &&
                  "border-primary/60 bg-primary/5 shadow-lg shadow-amber-950/10",
              )}
              type="button"
              onClick={() => props.onSelect(preset.id)}
            >
              <strong className="text-base">{preset.label}</strong>
              <span className="text-sm text-muted-foreground">
                {preset.width}x{preset.height} / {preset.format}
              </span>
              <small className="text-sm leading-6 text-muted-foreground">
                {preset.description}
              </small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
