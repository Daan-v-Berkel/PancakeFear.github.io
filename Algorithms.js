//currently arbitrary, later used to start the algorithm chosen by the user.
function startAlgorithm(grid){
    if (grid.active){// dont want to start a second while the first is still going
      return;
    }
    if (grid.algorithmFinished){//if the next 'run' is started after one has already finished
      grid.softReset();         //reset things like visited nodes and shortest path.
    }
    
    Dijkstra(grid)//TODO: make this be able to run the algorithm chosen
    
}
//TODO: add more algorithms to choose from.

async function Dijkstra(grid){// pretty obvious.. made into async for the purpose of delaying by the drawingspeed.
  grid.active = true;// makes sure no action can be taken while it is running
  let start = grid.start;
  let end = grid.end;
  let path = [];
  let drawSpeed = grid.speed;
  var gridDiv = document.getElementById('grid');
  path.push(start);
  var nodesToVisit = Array.from(grid.waypoints);// this copies the array, because the array will be adapted in the algorithm.
  nodesToVisit.push(end);
  var startPoints = [start].concat(grid.waypoints);
  
  for (var i = 0; i < nodesToVisit.length; i++){// basically runs the algorithm for every startpoint (needed in case the user adds waypoints)
    var nodesToClearO = gridDiv.getElementsByClassName('visited');
    var nodesToClear = Array.from(nodesToClearO);// because the algorithm runs multiple times in case of waypoints
    for (var index=0; index < nodesToClear.length; index++){// this clears the 'visited = true' attribute from nodes.
      var div = nodesToClear[index];                        //else the algorithm skips earlier visited nodes.
      var id = div.id;
      var node = grid.getNode(id);
      node.softReset();
      div.className = node.status;
    }
    var priorityQueue = new PriorityQueue;// priorityqueue makes sure we handle nodes closest to the current location first
    var currentTarget = nodesToVisit[i];
    currentTarget.softReset();
    var currentStart = startPoints[i];
    currentStart.visited = true;
    currentStart.distance = 0;
    currentStart.totalDistance = 0;
    priorityQueue.enqueue(currentStart, currentStart.totalDistance);

    while (!priorityQueue.isEmpty()){// if there is elements in the queue, there is still nodes to search.

      var currentNode = priorityQueue.dequeue().element;
      if ((currentNode == currentTarget) && (currentTarget == end)){//if we find the endnode, stop.
        drawShortestPath(currentNode);
        grid.algorithmFinished = true;
        grid.active = false;
        return;
      }else if (currentNode == currentTarget){// if we find the current target, break out and set the next target
        drawShortestPath(currentNode);
        break;
      }
      var currentNeighbours = getAllNeighbours(currentNode);
    
      for (var ind in currentNeighbours){// every node the algorithm has searched will be 'colored'
        var n = currentNeighbours[ind];
        n.visited = true;
        DrawVisited(n);
        priorityQueue.enqueue(n, n.totalDistance);
      }
      if (drawSpeed){// only if the speed was not set to 'no delay', add a delay.
        await sleep(drawSpeed/10);
        drawSpeed = drawSpeed*0.999;
      }
    }
    if (priorityQueue.isEmpty()){// no more nodes to search and target was not found.
      console.log('failure');
      grid.algorithmFinished = true;
      grid.active = false;
      alert('either the start or end is unreachable.\nNo path can be found.');//TODO: make this nicer
      return;
    }
  }
}