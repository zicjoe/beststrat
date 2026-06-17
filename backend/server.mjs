import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateStrategy, validateRequest } from "./lib/generator.mjs";
import { findRun, listRecentRuns, saveRun } from "./lib/storage.mjs";
import { loadEnvFiles } from "./lib/env.mjs";
import { getAvailableCategories, scanCategory, validateScannerRequest } from "./lib/scanner.mjs";

const PORT = Number(process.env.PORT || 8787);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = resolve(projectRoot, "dist");
const isProduction = process.env.NODE_ENV === "production";
const loadedEnvFiles = loadEnvFiles(projectRoot);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

async function serveStatic(req, res) {
  if (!isProduction) {
    sendJson(res, 404, { error: "Frontend static serving is only enabled after npm run build." });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const requestedPath = resolve(join(distDir, pathname));
  const safePath = requestedPath.startsWith(distDir) ? requestedPath : join(distDir, "index.html");

  try {
    const file = await readFile(safePath);
    const ext = extname(safePath);
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(file);
  } catch {
    try {
      const index = await readFile(join(distDir, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(index);
    } catch {
      sendJson(res, 404, { error: "Not found." });
    }
  }
}

async function route(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      service: "BestStrat API",
      mode: process.env.CMC_API_KEY ? "cmc-enabled" : "sample-data",
      cmcApiConfigured: Boolean(process.env.CMC_API_KEY),
      dataPolicy: process.env.CMC_API_KEY
        ? "Uses CoinMarketCap latest quote data when available, then builds deterministic candles for backtesting."
        : "Uses deterministic sample market data until CMC_API_KEY is configured.",
      loadedEnvFiles: loadedEnvFiles.map((item) => item.filePath),
      timestamp: new Date().toISOString(),
    });
    return;
  }


  if (url.pathname === "/api/scanner/categories" && req.method === "GET") {
    const response = await getAvailableCategories();
    sendJson(res, 200, response);
    return;
  }

  if (url.pathname === "/api/scanner/scan" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const request = validateScannerRequest(body);
      const response = await scanCategory(request);
      sendJson(res, 200, response);
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Strategy scan failed." });
    }
    return;
  }

  if (url.pathname === "/api/strategy/generate" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const request = validateRequest(body);
      const response = await generateStrategy(request);
      await saveRun(response);
      sendJson(res, 200, response);
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Strategy generation failed." });
    }
    return;
  }

  if (url.pathname === "/api/strategy/runs" && req.method === "GET") {
    const runs = await listRecentRuns();
    sendJson(res, 200, { runs });
    return;
  }

  const runMatch = url.pathname.match(/^\/api\/strategy\/runs\/([a-zA-Z0-9-]+)$/);
  if (runMatch && req.method === "GET") {
    const run = await findRun(runMatch[1]);
    if (!run) {
      sendJson(res, 404, { error: "Strategy run not found." });
      return;
    }
    sendJson(res, 200, run.response);
    return;
  }

  await serveStatic(req, res);
}

createServer((req, res) => {
  route(req, res).catch((error) => {
    sendJson(res, 500, { error: error instanceof Error ? error.message : "Internal server error." });
  });
}).listen(PORT, () => {
  console.log(`BestStrat API running on http://localhost:${PORT}`);
  if (loadedEnvFiles.length) {
    console.log(`Loaded environment config from ${loadedEnvFiles.length} file(s).`);
  }
  if (!process.env.CMC_API_KEY) {
    console.log("CMC_API_KEY not set. Using deterministic sample market data for strategy generation.");
  } else {
    console.log("CMC_API_KEY detected. BestStrat will use CoinMarketCap latest quote data when available.");
  }
});
