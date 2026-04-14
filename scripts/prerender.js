import { readFileSync, writeFileSync } from "node:fs";
import { render } from "../dist/server/entry-server.js";

const template = readFileSync("dist/client/index.html", "utf-8");
const appHtml = render();
const html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`,
);
writeFileSync("dist/client/index.html", html);
console.log("✅ Prerendered index.html");
