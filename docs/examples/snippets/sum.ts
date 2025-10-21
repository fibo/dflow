import { Dflow, type DflowNode } from "dflow";

// START snippet
const Sum: DflowNode = {
  kind: "sum",
  inputs: [Dflow.input("number"), Dflow.input("number")],
  outputs: [Dflow.output("number")],
  run(a: number, b: number) {
    return a + b;
  }
};
// END snippet

export default Sum;
