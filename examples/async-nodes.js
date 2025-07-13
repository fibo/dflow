import { Dflow } from "../dflow.js";

const { input, output } = Dflow;

const sumNodeId = "sum";

const SumNode = {
  kind: "Sum",
  inputs: [input(["number"]), input(["number"])],
  outputs: [output(["number"])],
  run(a, b) {
    return a + b;
  }
};

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

const SleepNode = {
  kind: "Sleep",
  async run() {
    const timeout = 500;
    console.info("sleep node start", `(will sleep ${timeout} ms) zZz`);
    await sleep(timeout);
    console.info("sleep node end");
  }
};

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

  const result = dflow.out[sumNodeId][0];
  if (result !== 42) console.error("Unexpected result", result);
}

runGraph();
