
      var request = new XMLHttpRequest()
      request.open('GET', '/graph.json', true)

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var graph = JSON.parse(request.responseText)
          require('flow-view').render('flow')(graph)
          // TODO run graph depending on dflow-cli arguments
          //require('dflow').fun(graph)()
        } else {
          // We reached our target server, but it returned an error

        }
      }

      request.onerror = function() {
        // There was a connection error of some sort
      }

      request.send()
