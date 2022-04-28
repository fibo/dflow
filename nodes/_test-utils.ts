import { assertEquals } from "std/testing/asserts.ts";
import { DflowArray, DflowHost, DflowObject, DflowValue } from "../dflow.ts";

export function testOneAnyInOneArrOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: DflowValue,
  output?: DflowArray,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ id: "out", types: [], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneAnyInOneBoolOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: DflowValue,
  output?: boolean,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneAnyInOneNumOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: DflowValue,
  output?: number,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneAnyInOneStrOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: DflowValue,
  output?: string,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrInOneNumOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: DflowArray,
  output?: number,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrAndOneAnyInOneArrOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: DflowArray,
  input2?: DflowValue,
  output?: DflowArray,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrAndOneNumInOneAnyOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: DflowArray,
  input2?: number,
  output?: DflowValue,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrAndOneStrInOneBoolOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: DflowArray,
  input2?: string,
  output?: boolean,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["string"], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrAndOneStrInOneStrOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: DflowArray,
  input2?: string,
  output?: string,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["string"], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneArrInOneAnyAndOneArrOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: DflowArray,
  output1?: DflowValue,
  output2?: DflowArray,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode, 0);
  dflow.run();
  assertEquals(testNode.output(0).data, output1);
  assertEquals(testNode.output(1).data, output2);
}

export function testOneArrAndTwoNumInOneArrOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: DflowArray,
  input2?: number,
  input3?: number,
  output1?: DflowArray,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input2 }],
  });
  const dataNode3 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input3 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.connect(dataNode3).to(testNode, 2);
  dflow.run();
  assertEquals(testNode.output(0).data, output1);
}

export function testOneArrInOneArrOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: DflowArray,
  output?: DflowArray,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["array"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode, 0);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneBoolInOneBoolOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: boolean,
  output?: boolean,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["boolean"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneNumAndOneMultiNumInOneNumOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: number,
  input2?: number[],
  output?: number,
) {
  const catalog = dflow.nodesCatalog;

  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input1 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);

  if (Array.isArray(input2)) {
    const dataNodes = input2.map((input) => (
      dflow.newNode({
        kind: catalog.data.kind,
        outputs: [{ types: ["number"], data: input }],
      })
    ));
    dataNodes.forEach((dataNode, i) => (
      dflow.connect(dataNode).to(testNode, i + 1)
    ));
  }

  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneNumInOneBoolOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: number,
  output?: boolean,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneNumInOneNumOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: number,
  output?: number,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneNumOut(
  dflow: DflowHost,
  nodeKind: string,
  output: number,
) {
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneStrInOneNumOut(
  dflow: DflowHost,
  nodeKind: string,
  input?: string,
  output?: number,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["string"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneObjInOneArrOut(
  dflow: DflowHost,
  nodeKind: string,
  input: DflowObject,
  output: DflowArray,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["object"], data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneStrAndTwoNumInOneStrOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: string,
  input2?: number,
  input3?: number,
  output?: string,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["string"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input2 }],
  });
  const dataNode3 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ id: "out", types: ["number"], data: input3 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.connect(dataNode3).to(testNode, 2);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoAnyInOneAnyOut(
  dflow: DflowHost,
  nodeKind: string,
  input1: DflowValue,
  input2: DflowValue,
  output: DflowValue,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoAnyInOneBoolOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: DflowValue,
  input2?: DflowValue,
  output?: boolean,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: [], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoBoolInOneBoolOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: boolean,
  input2?: boolean,
  output?: boolean,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["boolean"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["boolean"], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoNumInOneBoolOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: number,
  input2?: number,
  output?: boolean,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testTwoNumInOneNumOut(
  dflow: DflowHost,
  nodeKind: string,
  input1?: number,
  input2?: number,
  output?: number,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input1 }],
  });
  const dataNode2 = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ types: ["number"], data: input2 }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}
