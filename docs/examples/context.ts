// Create a host with an API context.
import { Dflow, type DflowNode } from "dflow";

// Add an API client to the context.
// A Dflow context is a Record<string, unknown> that will be bound to nodes at runtime.

type Context = {
  apiClient: ApiClient;
};

// Of course this is a dummy API client.
class ApiClient {
  apiKey: string;

  constructor(apiKey: ApiClient["apiKey"]) {
    this.apiKey = apiKey;
  }

  async fetchSomeData(
    payload: string
  ): Promise<{ status: string; payload: string }> {
    return await Promise.resolve({ status: "SUCCESS", payload });
  }
}

// This nodes uses the apiClient from the context...
const CustomNode: DflowNode = {
  kind: "Custom",
  inputs: [Dflow.input("string")],
  outputs: [Dflow.output("object")],
  // ... notice that we specify the type of `this` via the
  //
  //     this: Context
  //
  // argument on the run method.
  async run(this: Context, data: string) {
    const result = await this.apiClient.fetchSomeData(data);
    return result;
  }
};

// Create a Dflow instance and add the context.
const dflow = new Dflow([CustomNode]);
dflow.context.apiClient = new ApiClient("s3cret");

const nodeId = dflow.node(CustomNode.kind);
const dataId = dflow.data("foo");
dflow.link(dataId, nodeId);

await dflow.run();

const result = dflow.out[nodeId][0] as { status: string; payload: string };

if (!result || result.status !== "SUCCESS" || result.payload !== "foo")
  console.error("Unexpected result:", result);
else console.info(result.status);
