import { strict as assert } from "node:assert";
import { test } from "node:test";
import { newDflow } from "./_test-utils.ts";

test("newDate", () => {
  const dflow = newDflow();
  const nodeKind = "newDate";

  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.run();

  const output0 = testNode.output(0).data;
  const output1 = testNode.output(1).data;

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});

test("now", () => {
  const dflow = newDflow();
  const nodeKind = "now";

  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.run();

  const output0 = testNode.output(0).data;
  const output1 = testNode.output(1).data;

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});
