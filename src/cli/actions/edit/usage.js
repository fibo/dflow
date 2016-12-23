module.exports = `
> launches the dflow editor

Usage:

    dflow [edit] [options] [path/to/graph.json]

Available options:

    -h, --help          print usage and exit
    -o, --open          launch the browser once the server connects
    -p, --port          port number, defaults to random

If no graph is given, a *graph.json* will be created.

Examples:

In your local host, start editing *graph.json*: it will open your browser.

    dflow -o

`
