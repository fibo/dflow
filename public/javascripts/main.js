/*
    var dflowCursor = document.getElementById('dflow-cursor');
    var dflowGraph = document.getElementById('dflow-graph');

    var dflowAddNode = document.getElementById('dflow-add-node');

    var toggleDiv = function (div) {
      // TODO ritorna true o false se e' visibile oppure no
      // cosi si puo fare if(div.toggle())
      if (div.style.display == 'inline') {
        div.style.display = 'none';
      }
      else if (div.style.display == 'none') {
        div.style.display = 'inline';
      }
      else if (div.style.display == '') {
        div.style.display = 'inline';
      }
    }

    var addNode = function () {
      var nodeDiv = document.createElement('div');
      nodeDiv.className = 'dflow-node';
      nodeDiv.style.left = dflowCursor.style.left;
      nodeDiv.style.top = dflowCursor.style.top;
      nodeDiv.style.height = 50 + 'px';
      nodeDiv.style.width = 100 + 'px';
      dflowGraph.appendChild(nodeDiv);
    }
*/

var $addNode = $('dflow-add-node');
var $cursor = $('dflow-cursor');
var $graph = $('dflow-graph');

// Put $cursor in the middle of $graph.
$cursor.position({relativeTo:'dflow-graph'});
//$cursor.makeDraggable({container:$graph});

$addNode.addEvent('click',function(ev){
  ev.stop();
  $cursor.hide();
  var newNode = new Element('div.dflow-node', {
    styles: {
      border: '1px solid #aaaaaa',
      height: '100px',
      width: '100px'
    }
  });
  //newNode.setPosition($cursor.getPosition());
  newNode.position({relativeTo:'dflow-graph'});
  newNode.makeDraggable({container:$graph});
  $graph.inject(newNode);
  newNode.show();
  /*
  */
});

$graph.addEvent('dblclick',function(ev){
  ev.stop();
  $cursor.toggle();
});

