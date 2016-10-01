---
title: dflow
---
# dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

[![Join the chat at https://gitter.im/fibo/dflow](https://badges.gitter.im/fibo/dflow.svg)](https://gitter.im/fibo/dflow?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[Installation](#installation) |
[Examples](http://g14n.info/dflow/examples) |
[Editor][dflow-editor] |
[Api](http://g14n.info/dflow/api) |
[Specification](http://g14n.info/dflow/specification) |
[Contributing](http://g14n.info/dflow/contributing) |
[Support and license](#support-and-license)

[![NPM version](https://badge.fury.io/js/dflow.svg)](http://badge.fury.io/js/dflow) [![Badge size](https://badge-size.herokuapp.com/fibo/dflow/master/dist/dflow.min.js)](https://github.com/fibo/dflow/blob/master/dist/dflow.min.js) [![Build Status](https://travis-ci.org/fibo/dflow.svg?branch=master)](https://travis-ci.org/fibo/dflow?branch=master) [![Dependency Status](https://david-dm.org/fibo/dflow.svg)](https://david-dm.org/fibo/dflow) [![Coverage Status](https://coveralls.io/repos/fibo/dflow/badge.svg?branch=master)](https://coveralls.io/r/fibo/dflow?branch=master) [![Test page](https://img.shields.io/badge/test-page-blue.svg)](http://g14n.info/dflow/test) [![Change log](https://img.shields.io/badge/change-log-blue.svg)](http://g14n.info/dflow/changelog)

[![Whatchers](http://g14n.info/svg/github/watchers/dflow.svg)](https://github.com/fibo/dflow/watchers) [![Stargazers](http://g14n.info/svg/github/stars/dflow.svg)](https://github.com/fibo/dflow/stargazers) [![Forks](http://g14n.info/svg/github/forks/dflow.svg)](https://github.com/fibo/dflow/network/members)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm-dl/dflow.png)](https://nodei.co/npm-dl/dflow/)

## Hello world

The following simple graph is executed client side by *dflow* engine.

[![Hello World](http://g14n.info/dflow/svg/hello-world.svg)][hello-world]

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

Client distribution contains just the engine and minified version is around **12KB**.

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

which will clone repo, install deps, start the *dflow* cli and open your browser.

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
[dflow-editor]: http://g14n.info/dflow/cli#editor "dflow editor"
[hello-world]: http://g14n.info/dflow/examples/hello-world.html "Hello World"

