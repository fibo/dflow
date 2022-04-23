import { assertArrayIncludes, assertEquals } from "std/testing/asserts.ts";
import { DflowArray, DflowHost, DflowId, DflowNode } from "../dflow.ts";
import { nodesCatalog } from "../nodes.ts";
import {
  testOneAnyInOneArrOut,
  testOneAnyInOneBoolOut,
} from "./_test-utils.ts";

Deno.test("DflowNodeArray", () => {
  const dflow = new DflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.array.kind;

  [
    { input: undefined, output: undefined },
    { input: [], output: [] },
    { input: [1, 2, 3], output: [1, 2, 3] },
    { input: true, output: undefined },
    { input: { foo: "bar" }, output: undefined },
  ].forEach(({ input, output }) => {
    testOneAnyInOneArrOut(dflow, nodeKind, input, output);
  });
});

Deno.test("DflowNodeBoolean", () => {
  const dflow = new DflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.boolean.kind;

  [
    { input: undefined, output: undefined },
    { input: true, output: true },
    { input: false, output: false },
    { input: [], output: undefined },
    { input: [1, 2, 3], output: undefined },
    { input: { foo: "bar" }, output: undefined },
  ].forEach(({ input, output }) => {
    testOneAnyInOneBoolOut(dflow, nodeKind, input, output);
  });
});

Deno.test("DflowNodeHost", () => {
  // Load a catalog with a single Dflow node.
  class CustomNode extends DflowNode {
    static kind = "customNode";
    static isConstant = true;
  }
  const nodeKind = CustomNode.kind;
  const singleNodeCatalog = { [nodeKind]: CustomNode };
  const dflow = new DflowHost(singleNodeCatalog);
  const catalog = dflow.nodesCatalog;

  const testNode = dflow.newNode({ kind: catalog.dflow.kind });
  dflow.run();
  assertArrayIncludes(testNode.output(0).data as DflowArray, [
    nodeKind,
  ]);
});

Deno.test("DflowNodeFunction", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.function.kind;

  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const additionNode = dflow.newNode({ kind: catalog.addition.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.connect(testNode).to(returnNode);
  dflow.connect(additionNode).to(returnNode, 1);
  dflow.connect(numNode).to(additionNode, 0);
  dflow.connect(numNode).to(additionNode, 1);

  dflow.run();

  assertEquals(testNode.output(0).data as DflowId, testNode.id);
});

Deno.test("DflowNodeNumber", () => {
  const dflow = new DflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.number.kind;

  // TODO update test
  const num = Math.random();
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.output(0).data = num;
  assertEquals(testNode.output(0).data, num);
});

Deno.test("DflowNodeString", () => {
  const dflow = new DflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.string.kind;

  // TODO update test
  const str = "foo";
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.output(0).data = str;
  assertEquals(testNode.output(0).data, str);
});
