dflow
=====

dataflow programming for node.js

## Description


`dflow` is a minimal implementation of dataflow programming.

## Synopsis

    require('dflow');

    process.dflow.root.addNode({
      task: function () {
        console.log('hello world');
      }
    });

## Note

 * Avvio il server e creo la root che e' un elemento
 * Clicco e creo un elemento sul server e un div sul client,
   dentro il div ci sono quattro tasti, con le scelte
     * graph
     * node
     * in
     * out

Posso creare quindi gli elementi, poi cliccarci dentro ed editarli.

Sotto ci deve essere un canvas che aggiunge un po di grafica,
ad esempio curve di bezier per i link

Segna nel disclaimer che  dflow e' alpha e che per ora supporto solo chrome.

