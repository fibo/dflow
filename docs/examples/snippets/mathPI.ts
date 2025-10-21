import { Dflow, type DflowNode } from "dflow";

// START snippet
const MathPI: DflowNode = {
  kind: "mathPI",
  outputs: [Dflow.output("number", { name: "π" })],
  run: () => Math.PI
};
// END snippet

export default MathPI;
