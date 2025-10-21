import { Dflow, type DflowNode } from "dflow";

// START snippet
const Print: DflowNode = {
  kind: "print",
  inputs: [Dflow.input("string", { name: "message" })],
  run: (message: string) => {
    console.log(message);
  }
};
// END snippet

export default Print;
