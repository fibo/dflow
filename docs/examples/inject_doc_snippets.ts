// ///
// This script is launched by
//
//    npm run inject_doc_snippets
//
// It is using Dflow just for fun.
// It is used to build documentation files by injecting code snippets.
// It looks for markers in the documentation files like:
//
//    START file:relative/path/to/code/snippet
//    END snippet
//

// Optionally the snippet files can have markers to indicate which part of the
// snippet to include, like:
//
//    START snippet
//    ... code to include ...
//    END snippet
// ///

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Dflow, type DflowNode } from "../../dflow.ts";

type DocumentationFile = {
  relativePath: string;
  surroundStart: string;
  surroundEnd: string;
};

const snippetSurroundHtml = {
  surroundStart: "<pre><code>",
  surroundEnd: "</code></pre>"
};

const documentationFiles: DocumentationFile[] = [
  {
    relativePath: "README.md",
    surroundStart: "\n```html",
    surroundEnd: "```\n"
  },
  {
    relativePath: join("docs", "index.html"),
    ...snippetSurroundHtml
  },
  {
    relativePath: join("tests", "test_dflow_on_unpkg_cdn.html"),
    ...snippetSurroundHtml
  }
];

const { input, output } = Dflow;

// Define few common input/output items.
const rootDirInput = input("string", { name: "rootDir" });
const linesInput = input("array", { name: "lines" });
const filepathInput = input("string", { name: "filepath" });
const linesOutput = output("array", { name: "lines" });

const rootDirNode: DflowNode = {
  kind: "rootDir",
  outputs: [output("string")],
  run: () => {
    return dirname(dirname(dirname(fileURLToPath(new URL(import.meta.url)))));
  }
};

const filepathNode: DflowNode = {
  kind: "filepath",
  inputs: [rootDirInput, input("string", { name: "relativePath" })],
  outputs: [output("string")],
  run: (rootDir: string, relativePath: string) => {
    return join(rootDir, relativePath);
  }
};

const inputContentNode: DflowNode = {
  kind: "inputContent",
  inputs: [filepathInput],
  outputs: [linesOutput],
  run: async (filepath: string) => {
    const fileContent = await readFile(filepath, { encoding: "utf8" });
    return fileContent.split("\n");
  }
};

const outputContentNode: DflowNode = {
  kind: "outputContent",
  inputs: [filepathInput, linesInput],
  run: async (filepath: string, lines: string[]) => {
    await writeFile(filepath, lines.join("\n"), { encoding: "utf8" });
  }
};

const injectSnippetsNode: DflowNode = {
  kind: "injectSnippets",
  inputs: [
    rootDirInput,
    linesInput,
    input("string", { name: "surroundStart", optional: true }),
    input("string", { name: "surroundEnd", optional: true })
  ],
  outputs: [linesOutput],
  run: async (
    rootDir: string,
    inputLines: string[],
    surroundStart: string = "",
    surroundEnd: string = ""
  ) => {
    const outputLines: string[] = [];

    let snippetRelativePath = "";

    for await (const line of inputLines) {
      const markerFileStartMatch = line.match(/START file:([\w_\.\/]+)/);
      const markerEndMatch = line.match(/END snippet/);
      const isInSnippet = snippetRelativePath !== "";

      if (markerFileStartMatch) {
        outputLines.push(line);
        if (surroundStart) outputLines.push(surroundStart);
        snippetRelativePath = markerFileStartMatch[1];
        continue;
      }

      if (markerEndMatch) {
        // Read snippet content from file.
        const snippetContent = await readFile(
          join(rootDir, snippetRelativePath),
          { encoding: "utf8" }
        );
        let snippetLines = [];
        // Extract snippet between START and END markers, if any.
        for (const line of snippetContent.split("\n")) {
          const startMatch = line.match(/START snippet/);
          const endMatch = line.match(/END snippet/);
          if (startMatch) {
            snippetLines = [];
            continue;
          }
          if (endMatch) break;
          snippetLines.push(line);
        }
        // Remove trailing empty line if present.
        const lastSnippetLine = snippetLines[snippetLines.length - 1];
        if (lastSnippetLine.trim() === "") snippetLines.pop();
        // Add snippet content to documentation file.
        for (const snippetLine of snippetLines) outputLines.push(snippetLine);
        if (surroundEnd) outputLines.push(surroundEnd);
        outputLines.push(line);
        snippetRelativePath = "";
        continue;
      }

      if (isInSnippet) continue;

      // Other lines.
      outputLines.push(line);
    }
    return outputLines;
  }
};

// Create a dflow instance with node definied above.
const dflow = new Dflow([
  filepathNode,
  inputContentNode,
  injectSnippetsNode,
  outputContentNode,
  rootDirNode
]);

const rootDirNodeId = dflow.node("rootDir");

// Add to the graph a set of nodes to handle every target documentation file.
for (const { relativePath, surroundStart, surroundEnd } of documentationFiles) {
  const relativePathNodeId = dflow.data(relativePath);
  const filepathNodeId = dflow.node("filepath");
  dflow.link(rootDirNodeId, [filepathNodeId, 0]);
  dflow.link(relativePathNodeId, [filepathNodeId, 1]);

  const inputContentNodeId = dflow.node("inputContent");
  dflow.link(filepathNodeId, inputContentNodeId);

  const sourroundStartNodeId = dflow.data(surroundStart);
  const sourroundEndNodeId = dflow.data(surroundEnd);
  const injectSnippetsNodeId = dflow.node("injectSnippets");
  dflow.link(rootDirNodeId, [injectSnippetsNodeId, 0]);
  dflow.link(inputContentNodeId, [injectSnippetsNodeId, 1]);
  dflow.link(sourroundStartNodeId, [injectSnippetsNodeId, 2]);
  dflow.link(sourroundEndNodeId, [injectSnippetsNodeId, 3]);

  const outputContentNodeId = dflow.node("outputContent");
  dflow.link(filepathNodeId, [outputContentNodeId, 0]);
  dflow.link(injectSnippetsNodeId, [outputContentNodeId, 1]);
}

await dflow.run();
