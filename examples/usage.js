// Keep in sync with README.md file.

import { Dflow } from "../dist/dflow.js";
import { nodesCatalog } from "../dist/nodes.js";

function rungraph() {
  // use builtin nodes
  const dflow = new Dflow({ nodesCatalog });
  const catalog = dflow.nodesCatalog;

  // create nodes
  const numNode = dflow.newNode({
    kind: catalog.data.kind,
    // set numNode output to π / 2
    outputs: [{ data: Math.PI / 2 }],
  });
  const sinNode = dflow.newNode({
    kind: catalog.mathSin.kind,
  });
  const consoleLogNode = dflow.newNode({
    kind: catalog.consoleLog.kind,
  });

  // connect numNode to sinNode and sinNode to consoleLog
  dflow.connect(numNode).to(sinNode);
  dflow.connect(sinNode).to(consoleLogNode);

  // run graph
  dflow.run();
}

rungraph();
