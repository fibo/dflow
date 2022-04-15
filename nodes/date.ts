import { DflowNode } from "../engine.ts";

const dateOutputs = [
  ...DflowNode.out(["string"]),
  ...DflowNode.out(["number"], { name: "milliseconds" }),
];

class DflowDateNew extends DflowNode {
  static kind = "newDate";
  static inputs = DflowNode.in(["string", "number"], { optional: true });
  static outputs = dateOutputs;
  run() {
    const input = this.input(0).data;
    if (typeof input === "string" || typeof input === "number") {
      const date = new Date(input);
      const serializedDate = date.toJSON();
      if (serializedDate !== null) {
        this.output(0).data = serializedDate;
        this.output(1).data = date.getTime();
      }
    }
    // Return current date if no input
    const d = new Date();
    this.output(0).data = d.toJSON();
    this.output(1).data = d.getTime();
  }
}

class DflowDateNow extends DflowNode {
  static kind = "now";
  static outputs = dateOutputs;
  run() {
    const now = Date.now();
    this.output(0).data = new Date(now).toJSON();
    this.output(1).data = now;
  }
}

export const catalog = {
  [DflowDateNew.kind]: DflowDateNew,
  [DflowDateNow.kind]: DflowDateNow,
};