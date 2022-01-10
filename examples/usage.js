// Keep in sync with README
import { catalog as coreNodes, DflowHost } from "../dflow.js";

function runGraph() {
  // Use builtin nodes.
  const dflow = new DflowHost(coreNodes);

  // Create two nodes.
  const numNode = dflow.newNode({
    kind: "number",
  });
  const sinNode = dflow.newNode({
    // To raise errors at compile time when using TypeScript,
    // you can get the node kind from the catalog like this.
    kind: coreNodes.mathSin.kind,
  });

  // Set numNode output to π / 2.
  const num = numNode.output(0);
  num.data = Math.PI / 2;

  // Connect numNode to sinNode.
  dflow.connect(numNode).to(sinNode);

  // Run graph.
  dflow.run();

  // Get sinNode output.
  const sin = sinNode.output(0);
  console.log(sin.data); // 1 = sin(π / 2)
}

runGraph();
