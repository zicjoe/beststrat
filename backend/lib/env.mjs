import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function stripQuotes(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const loaded = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = stripQuotes(line.slice(separatorIndex + 1));

    if (!key || key.startsWith("#")) continue;
    if (process.env[key] === undefined) {
      process.env[key] = value;
      loaded.push(key);
    }
  }

  return loaded;
}

export function loadEnvFiles(projectRoot) {
  const files = [join(projectRoot, ".env"), join(projectRoot, "backend", ".env")];
  const result = [];

  for (const filePath of files) {
    if (!existsSync(filePath)) continue;
    result.push({ filePath, keys: parseEnvFile(filePath) });
  }

  return result;
}
