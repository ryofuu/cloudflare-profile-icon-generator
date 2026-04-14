import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const repoRoot = process.cwd();
const wranglerPath = path.join(repoRoot, "wrangler.toml");

function parseOutputValue(output, key) {
  const entry = output[key];
  if (!entry || typeof entry.value !== "string" || !entry.value) {
    throw new Error(`Terraform output "${key}" is missing or invalid.`);
  }

  return entry.value;
}

async function loadTerraformOutputs() {
  const inputIndex = process.argv.indexOf("--input");
  if (inputIndex >= 0) {
    const inputPath = process.argv[inputIndex + 1];
    if (!inputPath) {
      throw new Error("--input requires a path.");
    }

    return JSON.parse(await readFile(path.resolve(repoRoot, inputPath), "utf8"));
  }

  const { stdout } = await execFileAsync("terraform", ["output", "-json"], {
    cwd: path.join(repoRoot, "terraform"),
  });
  return JSON.parse(stdout);
}

function replaceTomlValue(source, key, value) {
  const pattern = new RegExp(`^${key} = ".*"$`, "m");
  if (!pattern.test(source)) {
    throw new Error(`Could not find "${key}" in wrangler.toml.`);
  }

  return source.replace(pattern, `${key} = "${value}"`);
}

async function main() {
  const outputs = await loadTerraformOutputs();
  const databaseName = parseOutputValue(outputs, "d1_database_name");
  const databaseId = parseOutputValue(outputs, "d1_database_id");
  const bucketName = parseOutputValue(outputs, "r2_bucket_name");

  let wrangler = await readFile(wranglerPath, "utf8");
  wrangler = replaceTomlValue(wrangler, "database_name", databaseName);
  wrangler = replaceTomlValue(wrangler, "database_id", databaseId);
  wrangler = replaceTomlValue(wrangler, "bucket_name", bucketName);

  await writeFile(wranglerPath, wrangler);
  console.log(
    `Synchronized wrangler.toml with Terraform outputs: ${databaseName}, ${databaseId}, ${bucketName}`,
  );
}

await main();
