# Examples

Clone repo to run examples

```bash
$ git clone https://github.com/fibo/dflow
$ cd dflow
```
## Hello world


```bash
$ node examples/helloWorld.js
```

For instance, here it is [Hello world source](https://github.com/fibo/dflow/blob/master/examples/helloWorld.js)

```js
var dflow = require('dflow')

// Create a graph with a single task and say "Hello world"

var graph = {
  tasks: [
    {
      name: 'console.log',
      arg: ['Hello', 'world']
    }
  ],
  pipes: []
}

dflow.evaluate(graph)
// Hello world
```

## Graphs

Graphs can be stored in JSON format. Run [examples/graphs](https://github.com/fibo/dflow/blob/master/examples/graphs)
using [examples/evaluateGraph.js](https://github.com/fibo/dflow/blob/master/examples/evaluateGraph.js) passing the graph filename as a parameter, for example

```bash
$ node examples/evaluateGraph.js graph2
The typeof Math.PI is number
```

