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

Print current version with `dflow -v` or `dflow --version`.
Display usage with `dflow [action] -h` or `dflow [action] --help` or action related usage

Set `DEBUG=dflow` environment variable to enable [debug](https://www.npmjs.com/package/debug) messages.

## Edit

> launches the dflow editor

### Usage

Launch *dflow* from command line, and start editing your first graph using your favourite browser.

```
Usage: dflow [edit] [options] [path/to/graph.json]

Available options:
  -h, --help          print usage and exit
  -o, --open          launch the browser once the server connects
```

If no graph is given, an empty graph named *graph.json* will be created.

Open your browser and go to `http://hostname-where-you-launched-dflow.example.org:3000`.

### Example

Start editing a *graph.json* in your localhost

```bash
dflow -o
```

## Run

### Usage

> run a dflow graph

```
Usage: dflow run [options] [path/to/graph.json]

Available options:
  -h, --help          print usage and exit
```

## Validate

> checks if a graph looks valid

### Usage

```
Usage: dflow validate [options] [path/to/graph.json]

Available options:
  -h, --help          print usage and exit
  -f, --funcs         specify path/to/additionalFunctions.js
```

