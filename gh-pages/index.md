---
title: dflow
---
# dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

[![Join the chat at https://gitter.im/fibo/dflow](https://badges.gitter.im/fibo/dflow.svg)](https://gitter.im/fibo/dflow?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Table Of Contents:**

* [Installation](#installation)
* [Examples](http://g14n.info/dflow/examples)
* [Editor][dflow-editor]
* [Api](http://g14n.info/dflow/api)
* [Specification](http://g14n.info/dflow/specification)
* [Contributing](http://g14n.info/dflow/contributing)
* [Support and license](#support-and-license)

[![Node engine](https://img.shields.io/node/v/dflow.svg)](https://nodejs.org/en/) [![NPM version](https://badge.fury.io/js/dflow.svg)](http://badge.fury.io/js/dflow) [![Build Status](https://travis-ci.org/fibo/dflow.svg?branch=master)](https://travis-ci.org/fibo/dflow?branch=master) [![Dependency Status](https://gemnasium.com/fibo/dflow.svg)](https://gemnasium.com/fibo/dflow) [![Coverage Status](https://coveralls.io/repos/fibo/dflow/badge.svg?branch=master)](https://coveralls.io/r/fibo/dflow?branch=master) [![Test page](https://img.shields.io/badge/test-page-blue.svg)](http://g14n.info/dflow/test) [![Change log](https://img.shields.io/badge/change-log-blue.svg)](http://g14n.info/dflow/changelog)

[![Whatchers](http://g14n.info/svg/github/watchers/dflow.svg)](https://github.com/fibo/dflow/watchers) [![Stargazers](http://g14n.info/svg/github/stars/dflow.svg)](https://github.com/fibo/dflow/stargazers) [![Forks](http://g14n.info/svg/github/forks/dflow.svg)](https://github.com/fibo/dflow/network/members)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm-dl/dflow.png)](https://nodei.co/npm-dl/dflow/)

## Hello world

The following simple graph is executed client side by *dflow* engine.

[![Hello World](http://g14n.info/dflow/svg/hello-world.svg)][hello-world]

## Status

*dflow* is **beta** software.
The engine is almost stable.
The [editor][dflow-editor] is usable but with no css (help me!): I have just started using React to implement the editor view.
Collaborative editing feature is working but buggy (I am proud of my bugs and they will be fixed in version **1.0** :)).

Next steps:

* start using *dflow*,
* improve editor's look&feel,
* add more examples using the editor
* and go for a stable version!

## Installation

### Client side

If you have some [graphs](#specification) ready to run on client side, you can install dflow engine with [bower](http://bower.io/)

```bash
bower install dflow
```

or use a CDN adding this to your HTML page

```
<script src="https://cdn.rawgit.com/fibo/dflow/master/dist/dflow.min.js"></script>
```

Client distribution contains just the engine and minified version is around **10k**.

### Server side

If you are new to *dflow*, you probably want to try the [editor][dflow-editor], so you need to install globally to get *dflow* cli in your path.
With [npm](https://npmjs.org/) do

```bash
npm install dflow -g
```

However, if you need to require the *dflow* engine in your package, or you need to browserify it, or even you want to use the *dflow* cli in your npm scripts, or whatever, you can install *dflow* locally with

```bash
npm install dflow
```

If you want start hacking on *dflow* run

```bash
git clone https://github.com/fibo/dflow.git
cd dflow
npm install
npm start
```

which will clone repo, install deps, and start the *dflow* cli.
Then point your browser to *http://localhost:3000* and edit your graph.
Note that by opening another browser window you can try the **collaborative editing** feature, powered by [Socket.IO](http://socket.io/)!

Note that `npm start` will edit a graph **in memory**, if you want to edit your graph and save it to a file, for instance *graph.json*, launch

```
npm start -- graph.json
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

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
[dflow-editor]: http://g14n.info/dflow/editor "dflow editor"
[hello-world]: http://g14n.info/dflow/examples/hello-world.html "Hello World"

