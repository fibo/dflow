# dflow

> Is a minimal [Dataflow programming][4] engine.

[Try dflow now!](https://dflow.herokuapp.com/) (on Heroku).

**Table Of Contents:**

* [Installation](#installation)
* [Examples](http://g14n.info/dflow/examples)
* [Editor](http://g14n.info/dflow/editor)
* [Api](http://g14n.info/dflow/api)
* [Specification](http://g14n.info/dflow/specification)
* [Support and license](#support-and-license)

[![NPM version](https://badge.fury.io/js/dflow.png)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.png?branch=master)](https://travis-ci.org/fibo/dflow?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.png)](https://gemnasium.com/fibo/dflow) [![Coverage Status](https://coveralls.io/repos/fibo/dflow/badge.svg?branch=master)](https://coveralls.io/r/fibo/dflow?branch=master) [![Test page](https://img.shields.io/badge/test-page-blue.svg)](http://g14n.info/dflow/test)

[![Whatchers](http://g14n.info/dflow/svg/img.shields.io/watchers.svg)](https://github.com/fibo/dflow/watchers) [![Stargazers](http://g14n.info/dflow/svg/img.shields.io/stars.svg)](https://github.com/fibo/dflow/stargazers) [![Forks](http://g14n.info/dflow/svg/img.shields.io/forks.svg)](https://github.com/fibo/dflow/network/members)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm-dl/dflow.png)](https://nodei.co/npm-dl/dflow/)

[![Throughput Graph](https://graphs.waffle.io/fibo/dflow/throughput.svg)](https://waffle.io/fibo/dflow)

## Status

*dflow* is beta software.
The editor is usable but with no css (help me!) and collaborative editing feature is working but buggy (I am proud of my bugs and they will be fixed in version **1.0** :).
The engine is almost stable.

Next steps:

* start using *dflow*,
* improve editor look&feel,
* add more examples using the editor
* and go for a stable version!

## Installation

### Client side

If you have some [graphs](#specification) ready to run on client side, you can install dflow engine with [bower](http://bower.io/)

```bash
$ bower install dflow
```

### Server side

If you are new to *dflow*, you probably want to try the [editor](#editor), so you need to install globally to get *dflow* cli in your path.
With [npm](https://npmjs.org/) do

```bash
$ npm install dflow -g
```

However, if you need to require the *dflow* engine in your package, or you need to browserify it, or even you want to use the *dflow* cli in your npm scripts, or whatever, you can install *dflow* locally with

```bash
$ npm install dflow
```

If you want start hacking on *dflow* run

```bash
$ git clone https://github.com/fibo/dflow.git
$ cd dflow
$ npm install
$ npm start
```

which will clone repo, install deps, and start the *dflow* cli.
Then point your browser to *http://localhost:3000* and edit your graph.
Note that by opening another browser window you can try the **collaborative editing** feature, powered by [Socket.IO](http://socket.io/)!

Note that `npm start` will edit a graph **in memory**, if you want to edit your graph and save it to a file, for instance *graph.json*, launch

```
$ npm start -- graph.json
```

## Support and License

*dflow* is [MIT](http://g14n.info/mit-license) licensed.

It is developed in my spare time and, as far as I know, by now *I am my only user*.
By the way, I got a stimulating feedback by [Stamplay](https://stamplay.com/)'s founder, who is pretty much interested in using *dflow* maybe in the future. **Grazie** Giuliano, I hope you all the best.

I wrote few times a [Dataflow engine][4], the first one was PNI (Perl Node Interface) and the design evolved until I could say confidently that **dflow is here to stay**.

Use cases I can think about *dflow* right now are many, but, the possibilities are I.M.H.O. outstanding: from client to server, from JavaScript to cross language, from mono-thread to graphs distributed on a network and, above all, from skilled programmer who implement functions … to artists, genetic engineers, data scientists, etc. that use those functions to create *dflow* graphs and get results nobody could even imagine.

If this is also your vision or you just want to use *dflow*, [contact me](http://g14n.info).

My goal is to say to a *dflow* user:

> Mamma mia! Did you achieve that with dflow?

 [1]: http://g14n.info/flow-view "flow-view"
 [2]: http://g14n.info/dflow/examples/hello-world.html "Hello World"
 [3]: https://github.com/fibo/dflow/blob/master/src/engine/functions/builtin.js "builtin functions"
 [4]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"

