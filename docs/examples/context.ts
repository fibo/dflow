// Create a host with an API context.
import { Dflow, type DflowNode } from "dflow";

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

type Context = {
  apiClient: ApiClient;
};

const CustomNode: DflowNode = {
  kind: "Custom",
  outputs: [Dflow.output("object")],
  async run() {
    const apiClient = (this as unknown as Context).apiClient;
    const result = await apiClient.fetchSomeData("foo");
    return result;
  }
};

async function contextExample() {
  const dflow = new Dflow([CustomNode]);

  dflow.context.apiClient = new ApiClient("s3cret");

  const nodeId = dflow.node(CustomNode.kind);

  await dflow.run();

  const result = dflow.out[nodeId][0] as { status: string; payload: string };
  if (!result || result.status !== "SUCCESS" || result.payload !== "foo")
    console.error("Unexpected result:", result);
  else console.info(result.status);
}

contextExample();
