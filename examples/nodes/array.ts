import { DflowNode } from "../../dflow.ts";
import type { DflowArray, DflowData } from "../../dflow.ts";

const { input, output } = DflowNode;

class ArrayAt extends DflowNode {
  static kind = "arrayAt";
  static inputs = [input("array"), input("number", { name: "index" })];
  static outputs = [output()];
  run(array: DflowArray, index: number) {
    return array.at(index);
  }
}

class ArrayIncludes extends DflowNode {
  static kind = "arrayIncludes";
  static inputs = [
    input("array", { name: "array" }),
    input("string", { name: "element" })
  ];
  static outputs = [output("boolean")];
  run(array: DflowArray, element: string) {
    return array.includes(element);
  }
}

class ArrayJoin extends DflowNode {
  static kind = "arrayJoin";
  static inputs = [
    input("array", { name: "array" }),
    input("string", { name: "separator", optional: true })
  ];
  static outputs = [output("string")];
  run(array: DflowArray, separator: string | undefined) {
    return array.join(separator);
  }
}

class ArrayLength extends DflowNode {
  static kind = "arrayLength";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run(array: DflowArray) {
    return array.length;
  }
}

class ArrayPop extends DflowNode {
  static kind = "arrayPop";
  static inputs = [input("array")];
  static outputs = [
    output([], { name: "element" }),
    output("array", { name: "rest" })
  ];
  run(array: DflowArray) {
    const element = array.pop();
    return [element, array];
  }
}

class ArrayPush extends DflowNode {
  static kind = "arrayPush";
  static inputs = [input("array"), input([], { name: "element" })];
  static outputs = [output("array")];
  run(array: DflowArray, element: DflowData) {
    if (element) array.push(element);
    return array;
  }
}

class ArrayReverse extends DflowNode {
  static kind = "arrayReverse";
  static inputs = [input("array")];
  static outputs = [input("array")];
  run(array: DflowArray) {
    return array.reverse();
  }
}

class ArrayShift extends DflowNode {
  static kind = "arrayShift";
  static inputs = [input("array")];
  static outputs = [
    output([], { name: "element" }),
    output("array", { name: "rest" })
  ];
  run(array: DflowArray) {
    const element = array.shift();
    return [element, array];
  }
}

class ArraySlice extends DflowNode {
  static kind = "arraySlice";
  static inputs = [
    input("array"),
    input("number", { name: "start" }),
    input("number", { name: "end", optional: true })
  ];
  static outputs = [output("array")];
  run(array: DflowArray, start: number, end?: number) {
    if (typeof end === "number") {
      return array.slice(start, end);
    } else {
      return array.slice(start);
    }
  }
}

export default [
  ArrayAt,
  ArrayIncludes,
  ArrayJoin,
  ArrayLength,
  ArrayPop,
  ArrayPush,
  ArrayReverse,
  ArrayShift,
  ArraySlice
];
