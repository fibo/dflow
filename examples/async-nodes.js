import { Dflow, DflowNode } from "../dflow.js";

const { input, output } = DflowNode;

const sumNodeId = "sum";

class SumNode extends DflowNode {
  static kind = "Sum";
  static inputs = [input(["number"]), input(["number"])];
  static outputs = [output(["number"])];
  run(a, b) {
    return a + b;
  }
}

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

class SleepNode extends DflowNode {
  static kind = "Sleep";
  async run() {
    const timeout = 500;
    console.info("sleep node start", `(will sleep ${timeout} ms) zZz`);
    await sleep(timeout);
    console.info("sleep node end");
  }
}

async function runGraph() {
  const dflow = new Dflow([SumNode, SleepNode]);

  // Create two nodes, num and sum.

  const numNodeId = dflow.data(21);
  const sumNodeId = dflow.node(SumNode.kind, {
    // Optional `id`. If Dflow is edited in a view, it can handy to reuse ids.
    id: "sum"
  });

  // Connect nodes.
  dflow.link(numNodeId, [sumNodeId, 0]);
  dflow.link(numNodeId, [sumNodeId, 1]);

  // Add also an async node.
  dflow.node(SleepNode.kind);

  // Run graph asynchronously.
  await dflow.run();

  const graph = dflow.graph;
  if (graph.n[sumNodeId].o[0].d !== 42)
    console.error("Unexpected result", "\n", JSON.stringify(graph));
}

runGraph();
