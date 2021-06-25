import { DflowHost } from "./engine.ts";
import { catalog } from "./nodes/catalog.ts";

const dflow = new DflowHost(catalog);

const fun = dflow.newNode({ kind: catalog.function.kind });

console.log(fun.output(0).data);
