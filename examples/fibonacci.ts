import { catalog, DflowHost } from "../dflow.ts";

const dflow = new DflowHost(catalog);

const commentNode = dflow.newNode({ kind: "comment" });
commentNode.output(0).data = "Implement fibonacci function";
const functionNode = dflow.newNode({ kind: "function", name: "fibonacci" });
const argumentNode = dflow.newNode({ kind: "argument" });
const typeNumberNode = dflow.newNode({ kind: "typeNumber" });
const numberNode = dflow.newNode({ kind: "number" });
numberNode.output(0).data = 1;
const greaterThanNode = dflow.newNode({ kind: "greaterThan" });
const subtractionNode = dflow.newNode({ kind: "subtraction" });
const ifNode = dflow.newNode({ kind: "if" });
const returnNode = dflow.newNode({ kind: "return" });
const functionCallNode = dflow.newNode({
  kind: "functionCall",
  name: "recursion",
});

// Implement fibonacci function
//
//                       ----------
//                       typeNumber
//                       ----------
//                        |
//          --------      |       ----------
//          function      |       number = 1
//          --------      |       ----------
//          |\            |                 |--------------------
//          | \           |                 |              |     |
//          |  \          |                 |              |     |
//          |   \         --------          |              |     |
//          |    \        argument          |              |     |
//          |     \       --------          |              |     |
//          |      \             |--------- | ---          |     |
//          |       \            |          |   |          |     |
//          |        \           |          |   |          |     |
//          |         \          -----------    |          |     |
//          |          \         greaterThan    |          |     |
//          |           \        -----------    |          |     |
//          |            \       |              |          |     |
//          |             \      |              |          |     |
//          |              \     |              |          |     |
//          |               \    |              ------------     |
//          |                \   |              subtraction      |
//          |                 \  |              ------------     |
//          |                  \_|_             |                |
//          |                    | \            |                |
//          |                    |   ------------                |
//          |                    |   functionCall                |
//          |                    |   ------------                |
//          |                    |              |                |
//          |                    |              |                |
//          |           -----------------------------------------
//          |           if       condition    then           else
//          |           -----------------------------------------
//          |         /
//          |        /
//          |       /
//          |      /
//          ------
//          return
//          ------
//

// implement fibonacci function
dflow.connect(functionNode).to(returnNode, 0);
dflow.connect(functionNode).to(functionCallNode, 1);
dflow.connect(typeNumberNode).to(argumentNode);
dflow.connect(argumentNode).to(greaterThanNode);
dflow.connect(argumentNode).to(subtractionNode, 0);
dflow.connect(numberNode).to(greaterThanNode);
dflow.connect(numberNode).to(subtractionNode, 1);
dflow.connect(numberNode).to(ifNode, 2);
dflow.connect(greaterThanNode).to(ifNode, 0);
dflow.connect(subtractionNode).to(functionCallNode, 1);
dflow.connect(functionCallNode).to(ifNode, 1);
dflow.connect(ifNode, 0).to(returnNode, 1);

// setup nodes to test it
const numberNode2 = dflow.newNode({ kind: "number" });
const functionCallNode2 = dflow.newNode({ kind: "functionCall" });
const consoleLogNode = dflow.newNode({ kind: "consoleLog" });
dflow.connect(functionNode).to(functionCallNode2, 0);
dflow.connect(numberNode2).to(functionCallNode2, 1);
dflow.connect(functionCallNode2).to(consoleLogNode);

dflow.run();
