import { deepEqual } from "std/node/assert.ts";
import { Dflow } from "dflow";
import { nodesCatalog } from "./index.ts";

export const newDflow = () => new Dflow({ nodesCatalog });

export function testOneOut<Output>(
  dflow: Dflow,
  nodeKind: string,
  output: Output,
) {
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.run();
  deepEqual(testNode.output(0).data, output);
}

export function testOneInOneOut<
  Input,
  Output,
>(
  dflow: Dflow,
  nodeKind: string,
  input?: Input,
  output?: Output,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ data: Dflow.isDflowData(input) ? input : undefined }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  deepEqual(testNode.output(0).data, output);
}

export function testOneInTwoOut<
  Input,
  Output1,
  Output2,
>(
  dflow: Dflow,
  nodeKind: string,
  input?: Input,
  output1?: Output1,
  output2?: Output2,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ data: Dflow.isDflowData(input) ? input : undefined }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  deepEqual(testNode.output(0).data, output1);
  deepEqual(testNode.output(1).data, output2);
}

export function testTwoInOneOut<
  Input1,
  Input2,
  Output,
>(
  dflow: Dflow,
  nodeKind: string,
  input1?: Input1,
  input2?: Input2,
  output?: Output,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = Dflow.isDflowData(input1)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input1 }],
    })
    : undefined;
  const dataNode2 = Dflow.isDflowData(input2)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input2 }],
    })
    : undefined;
  const testNode = dflow.newNode({ kind: nodeKind });
  if (dataNode1) {
    dflow.connect(dataNode1).to(testNode, 0);
  }
  if (dataNode2) {
    dflow.connect(dataNode2).to(testNode, 1);
  }
  dflow.run();
  deepEqual(testNode.output(0).data, output);
}

export function testThreeInOneOut<
  Input1,
  Input2,
  Input3,
  Output,
>(
  dflow: Dflow,
  nodeKind: string,
  input1?: Input1,
  input2?: Input2,
  input3?: Input3,
  output?: Output,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = Dflow.isDflowData(input1)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input1 }],
    })
    : undefined;
  const dataNode2 = Dflow.isDflowData(input2)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input2 }],
    })
    : undefined;
  const dataNode3 = Dflow.isDflowData(input3)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input3 }],
    })
    : undefined;
  const testNode = dflow.newNode({ kind: nodeKind });
  if (dataNode1) {
    dflow.connect(dataNode1).to(testNode, 0);
  }
  if (dataNode2) {
    dflow.connect(dataNode2).to(testNode, 1);
  }
  if (dataNode3) {
    dflow.connect(dataNode3).to(testNode, 2);
  }
  dflow.run();
  deepEqual(testNode.output(0).data, output);
}
