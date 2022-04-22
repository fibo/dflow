// keep in sync with readme

import { DflowHost } from "../dflow.js";
import { nodesCatalog } from "../nodes.js";

function rungraph() {
  // use builtin nodes
  const dflow = new DflowHost(nodesCatalog);

  // create nodes
  const numNode = dflow.newNode({
    kind: "number",
  });
  const sinNode = dflow.newNode({
    kind: coreNodes.mathSin.kind,
  });
  const consoleLogNode = dflow.newNode({
    kind: coreNodes.consoleLog.kind,
  });

  // set numNode output to π / 2
  numNode.output(0).data = Math.PI / 2;

  // connect numNode to sinNode and sinNode to consoleLog
  dflow.connect(numNode).to(sinNode);
  dflow.connect(sinNode).to(consoleLogNode);

  // run graph
  dflow.run();
}

rungraph();
