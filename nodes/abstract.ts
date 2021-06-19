import {
  DflowArray,
  DflowInput,
  DflowNode,
  DflowObject,
  DflowOutput,
  DflowSerializedInput,
  DflowSerializedNode,
  DflowSerializedOutput,
  DflowValue,
} from "../engine.ts";

const _missingMethod = (
  methodName: string,
  nodeKind: string,
) => (`unimplemented method ${methodName} nodeKind=${nodeKind}`);

export const oneAnyIn = (): DflowSerializedInput => ({
  id: "in",
});

export const oneAnyOut = (): DflowSerializedInput => ({
  id: "out",
});

export const oneArrIn = (): DflowSerializedInput => ({
  id: "in",
  types: ["array"],
});

export const oneArrOut = (data?: DflowArray): DflowSerializedOutput => ({
  id: "out",
  types: ["array"],
  data,
});

export const oneBoolIn = (): DflowSerializedInput => ({
  id: "in",
  types: ["boolean"],
});

export const oneBoolOut = (data?: boolean): DflowSerializedOutput => ({
  id: "out",
  types: ["boolean"],
  data,
});

export const oneObjIn = (): DflowSerializedInput => ({
  id: "in",
  types: ["object"],
});

export const oneObjOut = (data?: DflowObject): DflowSerializedOutput => ({
  id: "out",
  types: ["object"],
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

export const oneStrIn = (): DflowSerializedInput => ({
  id: "in",
  types: ["string"],
});

export const oneStrOut = (data?: string): DflowSerializedOutput => ({
  id: "out",
  types: ["string"],
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

export class DflowAbstractOneAnyInOneBoolOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneAnyIn()], outputs: [oneBoolOut()] });
  }

  task(_: DflowValue): boolean {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const data = this.input.data;

    if (typeof data !== "undefined") {
      this.output.data = this.task(data);
    } else {
      this.output.clear();
    }
  }
}

export class DflowAbstractOneArrInOneNumOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneArrIn()], outputs: [oneNumOut()] });
  }

  task(_: DflowArray): number {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const data = this.input.data;

    if (Array.isArray(data)) {
      this.output.data = this.task(data);
    } else {
      this.output.clear();
    }
  }
}

export class DflowAbstractOneObjInOneArrOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneObjIn()], outputs: [oneArrOut()] });
  }

  task(_: DflowObject): DflowArray {
    throw new Error(_missingMethod("task", this.kind));
  }

  run() {
    const data = this.input.data;

    if (
      typeof data !== "undefined" && !Array.isArray(data) && data !== null &&
      typeof data === "object"
    ) {
      this.output.data = this.task(data);
    } else {
      this.output.clear();
    }
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
    const data = this.input.data;

    if (typeof data === "number") {
      this.output.data = this.task(data);
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
    const data = this.input.data;

    if (typeof data === "number") {
      this.output.data = this.task(data);
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
    const data = this.input.data;

    if (typeof data === "string") {
      this.output.data = this.task(data);
    } else {
      this.output.clear();
    }
  }
}
