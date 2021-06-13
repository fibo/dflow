import {
  DflowInput,
  DflowNode,
  DflowOutput,
  DflowSerializedInput,
  DflowSerializedNode,
  DflowSerializedOutput,
} from "../engine.ts";

const _missingMethod = (
  methodName: string,
  nodeKind: string,
) => (`unimplemented method ${methodName} nodeKind=${nodeKind}`);

export const oneBoolIn = (): DflowSerializedInput => ({
id:"in",
types:["boolean"],
});

export const oneBoolOut = (data?: boolean): DflowSerializedOutput => ({
id:"out",
types:["boolean"],
  data,
});

export const oneNumIn = (): DflowSerializedInput => ({
id:"in",
types:["number"],
});

export const oneNumOut = (data?: number): DflowSerializedOutput => ({
id:"out",
types:["number"],
  data,
});

export const oneStrIn = (): DflowSerializedInput => ({
id:"in",
types:["string"],
});

export const oneStrOut = (data?: string): DflowSerializedOutput => ({
id:"out",
types:["string"],
  data,
});

export class DflowAbstractOneInOneOut extends DflowNode {
  get input(): DflowInput {
    return this.getInputByPosition(0);
  }

  get output(): DflowOutput {
    return this.getOutputByPosition(0);
  }
}

export class DflowAbstractOneNumInOneBoolOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneNumIn()], outputs: [oneBoolOut()] });
  }

  task(_: number): boolean {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const num = this.input.data;

    if (typeof num === "number") {
      const result = this.task(num);

      this.output.data = result;
    } else {
      this.output.clear();
    }
  }
}

export class DflowAbstractOneNumInOneNumOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneNumIn()], outputs: [oneNumOut()] });
  }

  task(_: number): number {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const num = this.input.data;

    if (typeof num === "number") {
      const result = this.task(num);

      this.output.data = result;
    } else {
      this.output.clear();
    }
  }
}

export class DflowAbstractOneStrInOneNumOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneStrIn()], outputs: [oneNumOut()] });
  }

  task(_: string): number {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const str = this.input.data;

    if (typeof str === "string") {
      const result = this.task(str);

      this.output.data = result;
    } else {
      this.output.clear();
    }
  }
}
