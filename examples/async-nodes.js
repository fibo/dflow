import { Dflow, DflowNode } from "../dflow.js";

const { input, output } = DflowNode;

class NumNode extends DflowNode {
  static kind = "Num";
  static outputs = [output(["number"])];
  run() {}
}

class SumNode extends DflowNode {
  static kind = "Sum";
  static inputs = [input(["number"]), input(["number"])];
  static outputs = [output(["number"])];
  run() {
    const a = this.input(0).data;
    const b = this.input(1).data;
    this.output(0).data = a + b;
  }
}

function sleep(seconds = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

class SleepNode extends DflowNode {
  kind = "Sleep";
  async run() {
    const numSeconds = 2;
    console.info("sleep node start", `(will sleep ${numSeconds} seconds) zZz`);
    await sleep(numSeconds);
    console.info("sleep node end");
  }
}

async function runGraph() {
  const dflow = new Dflow([NumNode, SumNode, SleepNode]);

  // Create two nodes, num and sum.

  const numNodeId = dflow.node(NumNode.kind, {
    outputs: [{ id: "out", data: 21 }]
  });
  const sumNodeId = dflow.node(SumNode.kind, {
    // Optional `id`. If Dflow is edited in a view, it can handy to reuse ids.
    id: "sum",
    inputs: [{ id: "in1" }, { id: "in2" }],
    outputs: [{ id: "out" }]
  });

  // Connect nodes.
  dflow.link(numNodeId, [sumNodeId, 0]);
  dflow.link(numNodeId, [sumNodeId, 1]);

  // Add also an async node.
  dflow.node(SleepNode.kind);

  // Run graph asynchronously.
  await dflow.run();

  console.info(JSON.stringify(dflow.graph, null, 2));
}

runGraph();
