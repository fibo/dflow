// Keep in sync with README
import { catalog as coreNodes, DflowHost } from "../dflow.js";

async function runGraph() {
  // Use builtin nodes.
  const dflow = new DflowHost(coreNodes);

  // Create two nodes.
  const numNode = dflow.newNode({
    kind: coreNodes.number.kind,
  });
  const sinNode = dflow.newNode({
    kind: coreNodes.mathSin.kind,
  });

  // Set numNode output to π / 2.
  const num = numNode.output(0);
  num.data = Math.PI / 2;

  // Connect numNode to sinNode.
  dflow.connect(numNode).to(sinNode);

  // Run graph.
  await dflow.run();

  // Get sinNode output.
  const sin = sinNode.output(0);
  console.log(sin.data); // 1 = sin(π / 2)
}

runGraph();
