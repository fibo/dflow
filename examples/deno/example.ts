import { DflowHost } from "dflow/dflow.ts";
import { nodesCatalog } from "dflow/nodes/index.ts";

const dflow = new DflowHost({ nodesCatalog });

// ... load a graph

await dflow.run();
