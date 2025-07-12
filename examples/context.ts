// Create a host with an API context.
import { Dflow, DflowNode } from "../dflow.ts";

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

class CustomNode extends DflowNode {
  static kind = "Custom";
  static outputs = [DflowNode.output("object")];
  async run() {
    const apiClient = this.host.context.apiClient as ApiClient;
    const result = await apiClient.fetchSomeData("foo");
    return result;
  }
}

async function contextExample() {
  const dflow = new Dflow([CustomNode]);

  dflow.context.apiClient = new ApiClient("s3cret");

  dflow.newNode({ kind: CustomNode.kind });

  await dflow.run();

  console.info(JSON.stringify(dflow.graph, null, 2));
}

contextExample();
