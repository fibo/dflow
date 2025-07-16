import { Dflow, type DflowNode } from "../../../dflow.ts";

const { input, output } = Dflow;

const dateOutputs = [
  output("string"),
  output("number", { name: "milliseconds" })
];

const NewDate: DflowNode = {
  kind: "newDate",
  inputs: [input(["string", "number"], { optional: true })],
  outputs: dateOutputs,
  run(input?: string | number) {
    if (input) {
      const date = new Date(input);
      const serializedDate = date.toJSON();
      if (serializedDate !== null) {
        return [serializedDate, date.getTime()];
      }
    }
    // Return current date if no input
    const d = new Date();
    return [d.toJSON(), d.getTime()];
  }
};

const Now: DflowNode = {
  kind: "now",
  outputs: dateOutputs,
  run() {
    const now = Date.now();
    return [new Date(now).toJSON(), now];
  }
};

export default [NewDate, Now];
