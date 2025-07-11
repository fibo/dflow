import { DflowNode } from "../../dflow.ts";

const { input, output } = DflowNode;

const dateOutputs = [
  output("string"),
  output("number", { name: "milliseconds" })
];

class NewDate extends DflowNode {
  static kind = "newDate";
  static inputs = [input(["string", "number"], { optional: true })];
  static outputs = dateOutputs;
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
}

class Now extends DflowNode {
  static kind = "now";
  static outputs = dateOutputs;
  run() {
    const now = Date.now();
    return [new Date(now).toJSON(), now];
  }
}

export default [NewDate, Now];
