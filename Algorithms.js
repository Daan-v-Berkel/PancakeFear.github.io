
function startAlgorithm(grid){
    if (grid.active){
      return;
    }
    if (grid.algorithmFinished){
      grid.softReset();
    }
    
    Dijkstra(grid)
    
}


async function Dijkstra(grid){
  grid.active = true;
  let start = grid.start;
  let end = grid.end;
  let path = [];
  let drawSpeed = grid.speed;
  var gridDiv = document.getElementById('grid');
  path.push(start);
  var nodesToVisit = Array.from(grid.waypoints);
  nodesToVisit.push(end);
  var startPoints = [start].concat(grid.waypoints);
  
  for (var i = 0; i < nodesToVisit.length; i++){
    var nodesToClearO = gridDiv.getElementsByClassName('visited');
    var nodesToClear = Array.from(nodesToClearO);
    for (var index=0; index < nodesToClear.length; index++){
      var div = nodesToClear[index];
      var id = div.id;
      var node = grid.getNode(id);
      node.softReset();
      div.className = node.status;
    }
    var priorityQueue = new PriorityQueue;
    var currentTarget = nodesToVisit[i];
    currentTarget.softReset();
    var currentStart = startPoints[i];
    currentStart.visited = true;
    currentStart.distance = 0;
    currentStart.totalDistance = 0;
    priorityQueue.enqueue(currentStart, currentStart.totalDistance);

    while (!priorityQueue.isEmpty()){

      var currentNode = priorityQueue.dequeue().element;
      if ((currentNode == currentTarget) && (currentTarget == end)){
        drawShortestPath(currentNode);
        grid.algorithmFinished = true;
        grid.active = false;
        return;
      }else if (currentNode == currentTarget){
        drawShortestPath(currentNode);
        break;
      }
      var currentNeighbours = getAllNeighbours(currentNode);
    
      for (var ind in currentNeighbours){
        var n = currentNeighbours[ind];
        n.visited = true;
        DrawVisited(n);
        priorityQueue.enqueue(n, n.totalDistance);
      }
      if (drawSpeed){
        await sleep(drawSpeed/10);
        drawSpeed = drawSpeed*0.999;
      }
    }
    if (priorityQueue.isEmpty()){
      console.log('failure');
      grid.algorithmFinished = true;
      grid.active = false;
      alert('either the start or end is unreachable.\nNo path can be found.');
      return;
    }
  }
}