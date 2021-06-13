import {
  DflowNode,
  DflowSerializedInput,
  DflowSerializedNode,
  DflowSerializedOutput,
} from "../engine.ts";

const _missingMethod = (
  methodName: string,
  nodeKind: string,
) => (`unimplemented method ${methodName} nodeKind=${nodeKind}`);

export const oneBoolIn = (): DflowSerializedInput => ({
  id: "in",
  types: ["boolean"],
});

export const oneBoolOut = (data?: boolean): DflowSerializedOutput => ({
  id: "out",
  types: ["boolean"],
  data,
});

export const oneNumIn = (): DflowSerializedInput => ({
  id: "in",
  types: ["number"],
});

export const oneNumOut = (data?: number): DflowSerializedOutput => ({
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
    const num = this.getInputByPosition(0).data;

    if (typeof num === "number") {
      const result = this.task(num);

      this.getOutputByPosition(0).data = result;
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
    const num = this.getInputByPosition(0).data;

    if (typeof num === "number") {
      const result = this.task(num);

      this.getOutputByPosition(0).data = result;
    }
  }
}
