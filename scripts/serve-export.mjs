import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = Number(process.argv[2] ?? 3108);
const root = join(process.cwd(), "out");
const basePath = "/up-fitness-site";
const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", `http://${request.headers.host}`).pathname;
    const relative = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
    let file = normalize(join(root, relative === "/" ? "index.html" : relative));
    if (!file.startsWith(root)) throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    response.setHeader("Content-Type", types[extname(file)] ?? "application/octet-stream");
    response.end(await readFile(file));
  } catch {
    response.statusCode = 404;
    response.end("Not found");
  }
}).listen(port, "127.0.0.1");
