import { assertEquals } from "std/testing/asserts.ts";
import { DflowHost, DflowId } from "../dflow.ts";
import {
  testOneAnyInOneArrOut,
  testOneAnyInOneBoolOut,
  testOneAnyInOneNumOut,
  testOneAnyInOneStrOut,
} from "./_test-utils.ts";
import { catalog as mathCatalog } from "./math.ts";
import { catalog as operatorCatalog } from "./operator.ts";

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

Deno.test("DflowNodeFunction", () => {
  const nodesCatalog = { ...mathCatalog, ...operatorCatalog };
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

Deno.test("DflowNodeIsUndefined", () => {
  const dflow = new DflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isUndefined.kind;

  [
    { input: undefined, output: true },
    { input: false, output: false },
    { input: [], output: false },
    { input: [1, 2, 3], output: false },
    { input: { foo: "bar" }, output: false },
  ].forEach(({ input, output }) => {
    testOneAnyInOneBoolOut(dflow, nodeKind, input, output);
  });
});

Deno.test("DflowNodeNumber", () => {
  const dflow = new DflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.number.kind;

  [
    { input: undefined, output: undefined },
    { input: false, output: undefined },
    { input: [], output: undefined },
    { input: [1, 2, 3], output: undefined },
    { input: { foo: "bar" }, output: undefined },
    { input: "foo", output: undefined },
    { input: 1, output: 1 },
  ].forEach(({ input, output }) => {
    testOneAnyInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("DflowNodeString", () => {
  const dflow = new DflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.string.kind;

  [
    { input: undefined, output: undefined },
    { input: false, output: undefined },
    { input: [], output: undefined },
    { input: [1, 2, 3], output: undefined },
    { input: { foo: "bar" }, output: undefined },
    { input: 1, output: undefined },
    { input: "foo", output: "foo" },
  ].forEach(({ input, output }) => {
    testOneAnyInOneStrOut(dflow, nodeKind, input, output);
  });
});
