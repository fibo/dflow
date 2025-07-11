// Create a host with an API context.
import { Dflow, DflowNode } from "../dflow.ts";

class ApiClient {
  apiKey: string;

  constructor(apiKey: ApiClient["apiKey"]) {
    this.apiKey = apiKey;
  }

  async fetchSomeData(): Promise<string> {
    return await Promise.resolve("SUCCESS");
  }
}

type Context = {
  apiClient: ApiClient;
};

class CustomNode extends DflowNode {
  static kind = "Custom";
  static outputs = [DflowNode.output("string")];
  async run({ apiClient }: Context) {
    const result = await apiClient.fetchSomeData();
    return result;
  }
}

async function contextExample() {
  const dflow = new Dflow([CustomNode]);

  dflow.context.apiClient = new ApiClient("s3cret");

  dflow.newNode({ kind: CustomNode.kind });

  await dflow.run();

  console.log(JSON.stringify(dflow.graph, null, 2));
}

contextExample();
