---
title: CLI
---

# CLI

## Editor

### Usage

Launch *dflow* from command line, and start editing your first graph using your favourite browser.

```
Usage: dflow [options] [path/to/graph.json]

  -h, --help          print this message and exit
  --indentJSON        indent saved JSON graph
  -p, --port          server port number, defaults to 3000 or PORT env var
  --run-on-edit       execute graph while being edited
  --version           print current version and exit

For more info point your browser to http://g14n.info/dflow
```

If no graph is given, an empty graph named *graph.json* will be created.

Open your browser and go to `http://hostname-where-you-launched-dflow.example.org:3000`.

Double click on the SVG canvas to open a text input where you can write the task name you want to create.

Click on a task to select it: addInput, addOutput and deleteTask buttons will appear.

Drag an output into an input to create a pipe.

Click on a pipe to delete it.

### Environment

Set `DEBUG=dflow` environment variable to enable [debug](https://www.npmjs.com/package/debug) messages.

Set `PORT` env var to the port number you want the editor server binds to.

Set `RUN_ON_EDIT=1` to enable *run on edit* editor option.
