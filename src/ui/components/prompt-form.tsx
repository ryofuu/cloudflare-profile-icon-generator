import { WandSparkles } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Textarea } from "@/ui/components/ui/textarea";

type PromptFormProps = {
  prompt: string;
  isSubmitting: boolean;
  onPromptChange(value: string): void;
  onSubmit(): void | Promise<void>;
};

export function PromptForm(props: PromptFormProps) {
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void props.onSubmit();
      }}
    >
      <label className="text-sm font-semibold text-foreground" htmlFor="prompt">
        Image Prompt
      </label>
      <Textarea
        id="prompt"
        rows={7}
        value={props.prompt}
        onChange={(event) => props.onPromptChange(event.target.value)}
        placeholder="例: 青い背景、やわらかな光、ゲームアイコン風の白猫"
      />
      <Button type="submit" disabled={props.isSubmitting} className="w-full sm:w-fit">
        <WandSparkles className="size-4" />
        {props.isSubmitting ? "Generating..." : "Generate Icon"}
      </Button>
    </form>
  );
}
