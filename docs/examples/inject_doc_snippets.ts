import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(
  dirname(dirname(fileURLToPath(new URL(import.meta.url))))
);

const filepath = join(rootDir, "docs", "index.html");

const outputLines: string[] = [];
let snippetRelativePath = "";

const inputContent = await readFile(filepath, { encoding: "utf8" });

for await (const line of inputContent.split("\n")) {
  const snippetStartMatch = line.match(/START file:([\w_\.\/]+)/);
  const snippetEndMatch = line.match(/END file:/);
  const isInSnippet = snippetRelativePath !== "";

  if (snippetStartMatch) {
    outputLines.push(line);
    snippetRelativePath = snippetStartMatch[1];
    continue;
  }

  if (snippetEndMatch) {
    const snippetContent = await readFile(join(rootDir, snippetRelativePath), {
      encoding: "utf8"
    });
    for (const snippetLine of snippetContent.split("\n")) {
      outputLines.push(snippetLine);
    }
    outputLines.push(line);
    snippetRelativePath = "";
    continue;
  }

  if (isInSnippet) continue;

  // Other lines.
  outputLines.push(line);
}

await writeFile(filepath, outputLines.join("\n"), { encoding: "utf8" });
