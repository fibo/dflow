// Keep in sync with README
import { catalog as coreNodes, DflowHost } from "../dflow.js";

async function runGraph() {
  const dflow = new DflowHost(coreNodes);

  // Create two nodes.
  const numNode = dflow.newNode({
    id: "num",
    kind: coreNodes.num.kind,
  });
  const sinNode = dflow.newNode({
    id: "sin",
    kind: coreNodes.mathSin.kind,
  });

  // Set numNode output to π / 2.
  const num = numNode.getOutputByPosition(0);
  num.setData(Math.PI / 2);

  // Connect numNode to sinNode.
  dflow.connect(numNode).to(sinNode);

  // Run graph.
  await dflow.graph.run();

  // Get sinNode output.
  const sin = sinNode.getOutputByPosition(0);
  console.log(sin.getData()); // 1 = sin(π / 2)
}

runGraph();
