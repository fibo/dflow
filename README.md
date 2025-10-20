# Dflow

> A minimal [Dataflow programming][dataflow-wikipedia] engine

## Installation

### Using npm

With [npm](https://npmjs.org/) do

```bash
npm install dflow
```

### Using a CDN

Try this in your HTML page

```html
<script type="importmap">
  { "imports": { "dflow": "https://unpkg.com/dflow" } }
</script>

<script type="module">
  import { Dflow } from "dflow";

  const helloWorld = {
    kind: "helloWorld",
    run() {
      console.log("Hello, World!");
    }
  };

  // Create a Dflow instance passing the node defined above.
  const dflow = new Dflow([helloWorld]);

  // Create a helloWorld node.
  dflow.node("helloWorld");

  // run graph
  dflow.run();
</script>
```

## Usage

See:

- [Documentation](https://fibo.github.io/dflow)
- [Examples](https://github.com/fibo/dflow/tree/main/docs/examples)

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
