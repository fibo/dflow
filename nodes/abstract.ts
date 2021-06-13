import {
  DflowNode,
  DflowSerializedNode,
  DflowSerializedPin,
} from "../engine.ts";

const _missingMethod = (
  methodName: string,
  nodeKind: string,
) => (`unimplemented method ${methodName} nodeKind=${nodeKind}`);

export const oneBoolIn = (): DflowSerializedPin => ({
  id: "in",
  types: ["boolean"],
});

export const oneBoolOut = (data?: boolean): DflowSerializedPin => ({
  id: "out",
  types: ["boolean"],
  data,
});

export const oneNumIn = (): DflowSerializedPin => ({
  id: "in",
  types: ["number"],
});

export const oneNumOut = (data?: number): DflowSerializedPin => ({
  id: "out",
  types: ["number"],
  data,
});

export class DflowAbstractOneNumInOneBoolOut extends DflowNode {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneNumIn()], outputs: [oneBoolOut()] });
  }

  task(_: number): boolean {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const num = this.getInputByPosition(0).getData();

    if (typeof num === "number") {
      const result = this.task(num);

      this.getOutputByPosition(0).setData(result);
    }
  }
}

export class DflowAbstractOneNumInOneNumOut extends DflowNode {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneNumIn()], outputs: [oneNumOut()] });
  }

  task(_: number): number {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const num = this.getInputByPosition(0).getData();

    if (typeof num === "number") {
      const result = this.task(num);

      this.getOutputByPosition(0).setData(result);
    }
  }
}
