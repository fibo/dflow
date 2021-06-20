import {
  DflowArray,
  DflowData,
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

export const oneAnyIn = (): DflowSerializedInput => ({ id: "i1" });

export const oneAnyOut = (): DflowSerializedInput => ({ id: "o1" });

export const oneArrIn = (): DflowSerializedInput => ({
  id: "i1",
  types: ["array"],
});

export const oneArrOut = (data?: DflowArray): DflowSerializedOutput => ({
  id: "o1",
  types: ["array"],
  data,
});

export const oneBoolIn = (): DflowSerializedInput => ({
  id: "i1",
  types: ["boolean"],
});

export const oneBoolOut = (data?: boolean): DflowSerializedOutput => ({
  id: "o1",
  types: ["boolean"],
  data,
});

export const oneObjIn = (): DflowSerializedInput => ({
  id: "i1",
  types: ["object"],
});

export const oneObjOut = (data?: DflowObject): DflowSerializedOutput => ({
  id: "o1",
  types: ["object"],
  data,
});

export const oneNumIn = (): DflowSerializedInput => ({
  id: "i1",
  types: ["number"],
});

export const oneNumOut = (data?: number): DflowSerializedOutput => ({
  id: "o1",
  types: ["number"],
  data,
});

export const oneStrIn = (): DflowSerializedInput => ({
  id: "i1",
  types: ["string"],
});

export const oneStrOut = (data?: string): DflowSerializedOutput => ({
  id: "o1",
  types: ["string"],
  data,
});

export const twoBoolIn = (): DflowSerializedInput[] => ([
  { id: "1i", types: ["boolean"] },
  { id: "i2", types: ["boolean"] },
]);

export const twoNumIn = (): DflowSerializedInput[] => ([
  { id: "1i", types: ["number"] },
  { id: "i2", types: ["number"] },
]);

export class DflowAbstractOneInOneOut extends DflowNode {
  get input(): DflowInput {
    return this.getInputByPosition(0);
  }

  get output(): DflowOutput {
    return this.getOutputByPosition(0);
  }

  run() {
    const { input: { data, types }, output, task } = this;

    if (DflowData.isUndefined(data)) {
      output.clear();
    } else {
      if (DflowData.validate(data, types)) {
        output.data = task(data);
      }
    }
  }

  task(_: DflowValue): DflowValue {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractOneAnyInOneBoolOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneAnyIn()], outputs: [oneBoolOut()] });
  }

  task(_: DflowValue): boolean {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractOneArrInOneNumOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneArrIn()], outputs: [oneNumOut()] });
  }

  task(_: DflowArray): number {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractOneObjInOneArrOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneObjIn()], outputs: [oneArrOut()] });
  }

  task(_: DflowObject): DflowArray {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractOneNumInOneBoolOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneNumIn()], outputs: [oneBoolOut()] });
  }

  task(_: number): boolean {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractOneNumInOneNumOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneNumIn()], outputs: [oneNumOut()] });
  }

  task(_: number): number {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractOneStrInOneNumOut extends DflowAbstractOneInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [oneStrIn()], outputs: [oneNumOut()] });
  }

  task(_: string): number {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractTwoInOneOut extends DflowNode {
  get input1(): DflowInput {
    return this.getInputByPosition(0);
  }

  get input2(): DflowInput {
    return this.getInputByPosition(1);
  }

  get output(): DflowOutput {
    return this.getOutputByPosition(0);
  }

  run() {
    const {
      input1: { data: data1, types: types1 },
      input2: { data: data2, types: types2 },
      output,
      task,
    } = this;

    if (DflowData.isUndefined(data1) || DflowData.isUndefined(data2)) {
      output.clear();
    } else {
      if (
        DflowData.validate(data1, types1) && DflowData.validate(data2, types2)
      ) {
        output.data = task(data1, data2);
      }
    }
  }

  task(_input1: DflowValue, _input2: DflowValue): DflowValue {
    throw new Error(_missingMethod("task", this.kind));
  }
}

export class DflowAbstractTwoNumInOneNumOut extends DflowAbstractTwoInOneOut {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: twoNumIn(), outputs: [oneNumOut()] });
  }

  task(_input: number, _input2: number): number {
    throw new Error(_missingMethod("task", this.kind));
  }
}
