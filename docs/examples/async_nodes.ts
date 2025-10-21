import { Dflow, type DflowNode } from "dflow";

const { input, output } = Dflow;

const SumNode: DflowNode = {
  kind: "Sum",
  inputs: [input(["number"]), input(["number"])],
  outputs: [output(["number"])],
  run(a: number, b: number) {
    return a + b;
  }
};

function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

const SleepNode: DflowNode = {
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
  const sumNodeId = dflow.node(SumNode.kind);

  // Connect nodes.
  dflow.link(numNodeId, [sumNodeId, 0]);
  dflow.link(numNodeId, [sumNodeId, 1]);

  // Add also an async node.
  dflow.node(SleepNode.kind);

  // Run graph asynchronously.
  await dflow.run();

  // Get the result of the sum node.
  const result = dflow.out[sumNodeId][0];
  if (result !== 42) throw new Error("Unexpected result");
}

await runGraph();
// sleep node start (will sleep 500 ms) zZz
// sleep node end
