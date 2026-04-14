import { renderToString } from "react-dom/server";
import { App } from "@/ui/app";

export function render(): string {
  return renderToString(<App />);
}
