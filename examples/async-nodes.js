import { Dflow } from "dflow";

const { input, output } = Dflow;

const SumNode = {
  kind: "Sum",
  inputs: [input(["number"]), input(["number"])],
  outputs: [output(["number"])],
  /**
   * @param {number} a
   * @param {number} b
   */
  run(a, b) {
    return a + b;
  }
};

/**
 * @param {number} timeout
 * @returns {Promise<void>}
 */
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
  const sumNodeId = dflow.node(SumNode.kind, "sum");

  // Connect nodes.
  dflow.link(numNodeId, [sumNodeId, 0]);
  dflow.link(numNodeId, [sumNodeId, 1]);

  // Add also an async node.
  dflow.node(SleepNode.kind);

  // Run graph asynchronously.
  await dflow.run();

  // The id "sum" was passed as `wantedId` on SumNode .
  const result = dflow.out.sum[0];
  if (result !== 42) console.error("Unexpected result", result);
}

runGraph();
