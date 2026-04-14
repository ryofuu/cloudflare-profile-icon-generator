import { Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
import type { SizePreset } from "@/domain/preset";
import { cn } from "@/lib/utils";

type PresetSelectorProps = {
  presets: SizePreset[];
  selectedPresetId: string;
  onSelect(id: string): void;
};

const ICONS: Record<string, typeof Square> = {
  square: Square,
  landscape: RectangleHorizontal,
  portrait: RectangleVertical,
};

export function PresetSelector(props: PresetSelectorProps) {
  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        {props.presets.map((preset) => {
          const isActive = preset.id === props.selectedPresetId;
          const Icon = ICONS[preset.id] ?? Square;
          return (
            <button
              key={preset.id}
              type="button"
              className={cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-all",
                isActive
                  ? "border-primary/60 bg-primary/5 shadow-sm"
                  : "border-border/80 bg-white/70 hover:border-primary/40 hover:bg-primary/5",
              )}
              onClick={() => props.onSelect(preset.id)}
            >
              <Icon className={cn("size-5", isActive ? "text-amber-700" : "text-muted-foreground")} />
              <span className="text-xs font-semibold">{preset.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {props.presets.find((p) => p.id === props.selectedPresetId)?.description}
      </p>
    </div>
  );
}
