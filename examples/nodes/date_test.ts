import { strict as assert } from "node:assert"
import { test } from "node:test"
import { newDflow } from "./_test-utils.js";
import { nodesCatalog as catalog } from "./index.js";

test(catalog.newDate.kind, () => {
  const nodeKind = catalog.newDate.kind;

  const dflow = newDflow();
  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.run();

  const output0 = testNode.output(0).data as string;
  const output1 = testNode.output(1).data as number;

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});

test(catalog.now.kind, () => {
  const nodeKind = catalog.now.kind;

  const dflow = newDflow();
  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.run();

  const output0 = testNode.output(0).data as string;
  const output1 = testNode.output(1).data as number;

  assert.equal(typeof output0, "string");
  assert.equal(typeof output1, "number");
});
