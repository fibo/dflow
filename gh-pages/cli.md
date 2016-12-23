---
title: CLI
---

# CLI

The *dflow* cli is invoked with syntax

```bash
dflow [action] [options]
```

Available actions are:

* [edit](#edit)
* [run](#run)
* [validate](#validate)

Available options:

    -h, --help          print usage and exit
    -v, --version       print current version and exit

Display action related usage:

    dflow [action] --help

Print current version with `dflow -v` or `dflow --version`.
Display generic usage with `dflow -h`.
Set `DEBUG=dflow` environment variable to enable [debug](https://www.npmjs.com/package/debug) messages.

## Edit

> launches the dflow editor

Usage:

    dflow [edit] [options] [path/to/graph.json]

Available options:

    -h, --help          print usage and exit
    -p, --port          port number, defaults to random
    -o, --open          launch the browser once the server connects

If no graph is given, a *graph.json* will be created.

Examples:

In your local host, start editing *graph.json*: it will open your browser.

    dflow -o

## Run

> run a dflow graph

Usage:

    dflow run [options] [path/to/graph.json]

Available options:

    -h, --help          print usage and exit

## Validate

> checks if a graph looks valid

Usage:

    dflow validate [options] [path/to/graph.json]

Available options:

    -h, --help          print usage and exit
    -f, --funcs         specify path/to/additionalFunctions.js

