import {
  DflowArray,
  DflowHost,
  DflowId,
  DflowNode,
  DflowNodeConstructorArg,
} from "../dflow.ts";

const { input, output } = DflowNode;

class DflowArrayAt extends DflowNode {
  static kind = "arrayAt";
  static inputs = [
    input("array"),
    input("number", { name: "index" }),
  ];
  static outputs = [output()];
  run() {
    const array = this.input(0).data as DflowArray;
    const index = this.input(1).data as number;
    this.output(0).data = array.at(index);
  }
}

class DflowArrayFilter extends DflowNode {
  readonly #host: DflowHost;
  static kind = "arrayFilter";
  static inputs = [
    input("array"),
    input("DflowId", { name: "functionId" }),
  ];
  static outputs = [output("array")];
  constructor(arg: DflowNodeConstructorArg) {
    super(arg);
    this.#host = arg.host;
  }
  run() {
    this.output(0).data = (this.input(0).data as DflowArray).filter(
      (...args) =>
        this.#host.executeFunction(this.input(1).data as DflowId, args),
    );
  }
}

class DflowArrayFindLastIndex extends DflowNode {
  readonly #host: DflowHost;
  static kind = "arrayFindLastIndex";
  static inputs = [
    input("array"),
    input("DflowId", { name: "functionId" }),
  ];
  static outputs = [output("number")];
  constructor(arg: DflowNodeConstructorArg) {
    super(arg);
    this.#host = arg.host;
  }
  run() {
    this.output(0).data = (this.input(0).data as DflowArray).findLastIndex(
      (...args) =>
        this.#host.executeFunction(this.input(1).data as DflowId, args),
    );
  }
}

class DflowArrayFindIndex extends DflowNode {
  readonly #host: DflowHost;
  static kind = "arrayFindIndex";
  static inputs = [
    input("array"),
    input("DflowId", { name: "functionId" }),
  ];
  static outputs = [output("number")];
  constructor(arg: DflowNodeConstructorArg) {
    super(arg);
    this.#host = arg.host;
  }
  run() {
    this.output(0).data = (this.input(0).data as DflowArray).findIndex(
      (...args) =>
        this.#host.executeFunction(this.input(1).data as DflowId, args),
    );
  }
}

class DflowArrayIncludes extends DflowNode {
  static kind = "arrayIncludes";
  static inputs = [
    input("array", { name: "array" }),
    input("string", { name: "element" }),
  ];
  static outputs = [output("boolean")];
  run() {
    const data = this.input(0).data;
    const element = this.input(1).data;

    if (Array.isArray(data)) {
      this.output(0).data = data.includes(element);
    }
  }
}

class DflowArrayJoin extends DflowNode {
  static kind = "arrayJoin";
  static inputs = [
    input("array", { name: "array" }),
    input("string", { name: "separator", optional: true }),
  ];
  static outputs = [output("string")];
  run() {
    this.output(0).data = (this.input(0).data as Array<unknown>).join(
      this.input(1).data as string | undefined,
    );
  }
}

class DflowArrayLength extends DflowNode {
  static kind = "arrayLength";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run() {
    const data = this.input(0).data;
    if (Array.isArray(data)) {
      this.output(0).data = data.length;
    } else {
      this.output(0).clear;
    }
  }
}

class DflowArrayMap extends DflowNode {
  readonly #host: DflowHost;
  static kind = "arrayMap";
  static inputs = [
    input("array"),
    input("DflowId", { name: "functionId" }),
  ];
  static outputs = [output("array")];
  constructor(arg: DflowNodeConstructorArg) {
    super(arg);
    this.#host = arg.host;
  }
  run() {
    this.output(0).data = (this.input(0).data as DflowArray).map(
      (...args) =>
        this.#host.executeFunction(this.input(1).data as DflowId, args),
    );
  }
}

class DflowArrayPop extends DflowNode {
  static kind = "arrayPop";
  static inputs = [input("array")];
  static outputs = [
    output([], { name: "element" }),
    output("array", { name: "rest" }),
  ];
  run() {
    const array = (this.input(0).data as DflowArray).slice();
    const element = array.pop();
    this.output(0).data = element;
    this.output(1).data = array;
  }
}

class DflowArrayPush extends DflowNode {
  static kind = "arrayPush";
  static inputs = [
    input("array"),
    input([], { name: "element" }),
  ];
  static outputs = [output("array")];
  run() {
    const array = (this.input(0).data as DflowArray).slice();
    const element = this.input(1).data;
    if (element) {
      array.push(element);
    }
    this.output(0).data = array;
  }
}

class DflowArrayReverse extends DflowNode {
  static kind = "arrayReverse";
  static inputs = [input("array")];
  static outputs = [input("array")];
  run() {
    const array = (this.input(0).data as DflowArray).slice();
    this.output(0).data = array.reverse();
  }
}

class DflowArrayShift extends DflowNode {
  static kind = "arrayShift";
  static inputs = [input("array")];
  static outputs = [
    output([], { name: "element" }),
    output("array", { name: "rest" }),
  ];
  run() {
    const array = (this.input(0).data as DflowArray).slice();
    const element = array.shift();
    this.output(0).data = element;
    this.output(1).data = array;
  }
}

class DflowArraySlice extends DflowNode {
  static kind = "arraySlice";
  static inputs = [
    input("array"),
    input("number", { name: "start" }),
    input("number", { name: "end", optional: true }),
  ];
  static outputs = [output("array")];
  run() {
    const array = super.input(0).data as DflowArray;
    const start = super.input(1).data as number;
    const end = super.input(2).data;

    if (typeof end === "number") {
      super.output(0).data = array.slice(start, end);
    } else {
      super.output(0).data = array.slice(start);
    }
  }
}

export const catalog = {
  [DflowArrayAt.kind]: DflowArrayAt,
  [DflowArrayFilter.kind]: DflowArrayFilter,
  [DflowArrayFindLastIndex.kind]: DflowArrayFindLastIndex,
  [DflowArrayFindIndex.kind]: DflowArrayFindIndex,
  [DflowArrayIncludes.kind]: DflowArrayIncludes,
  [DflowArrayJoin.kind]: DflowArrayJoin,
  [DflowArrayLength.kind]: DflowArrayLength,
  [DflowArrayMap.kind]: DflowArrayMap,
  [DflowArrayPop.kind]: DflowArrayPop,
  [DflowArrayPush.kind]: DflowArrayPush,
  [DflowArrayReverse.kind]: DflowArrayReverse,
  [DflowArrayShift.kind]: DflowArrayShift,
  [DflowArraySlice.kind]: DflowArraySlice,
};
