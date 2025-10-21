import {
  Dflow,
  type DflowArray,
  type DflowData,
  type DflowNode
} from "../../../dflow.ts";

const { input, output } = Dflow;

const ArrayAt: DflowNode = {
  kind: "arrayAt",
  inputs: [input("array"), input("number", { name: "index" })],
  outputs: [output()],
  run(array: DflowArray, index: number) {
    return array.at(index);
  }
};

const ArrayIncludes: DflowNode = {
  kind: "arrayIncludes",
  inputs: [input("array"), input("string", { name: "element" })],
  outputs: [output("boolean")],
  run(array: DflowArray, element: string) {
    return array.includes(element);
  }
};

// START snippet
const ArrayJoin: DflowNode = {
  kind: "arrayJoin",
  inputs: [
    input("array"),
    input("string", { name: "separator", optional: true })
  ],
  outputs: [output("string")],
  run(array: DflowArray, separator: string | undefined) {
    return array.join(separator);
  }
};
// END snippet

const ArrayLength: DflowNode = {
  kind: "arrayLength",
  inputs: [input("array")],
  outputs: [output("number")],
  run(array: DflowArray) {
    return array.length;
  }
};

const ArrayPop: DflowNode = {
  kind: "arrayPop",
  inputs: [input("array")],
  outputs: [output([], { name: "element" }), output("array", { name: "rest" })],
  run(array: DflowArray) {
    const element = array.pop();
    return [element, array];
  }
};

const ArrayPush: DflowNode = {
  kind: "arrayPush",
  inputs: [input("array"), input([], { name: "element" })],
  outputs: [output("array")],
  run(array: DflowArray, element: DflowData) {
    if (element) array.push(element);
    return array;
  }
};

const ArrayShift: DflowNode = {
  kind: "arrayShift",
  inputs: [input("array")],
  outputs: [output([], { name: "element" }), output("array", { name: "rest" })],
  run(array: DflowArray) {
    const element = array.shift();
    return [element, array];
  }
};

const ArraySlice: DflowNode = {
  kind: "arraySlice",
  inputs: [
    input("array"),
    input("number", { name: "start" }),
    input("number", { name: "end", optional: true })
  ],
  outputs: [output("array")],
  run(array: DflowArray, start: number, end?: number) {
    return array.slice(start, end);
  }
};

export default [
  ArrayAt,
  ArrayIncludes,
  ArrayJoin,
  ArrayLength,
  ArrayPop,
  ArrayPush,
  ArrayShift,
  ArraySlice
];
