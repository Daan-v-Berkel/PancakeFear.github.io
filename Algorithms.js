// PSEUDO
//1 get startnode.
//2 save startnode in array. set it as visited.
//3 get all (unvisited and non-wall) neighbours (up, down, left, right). --> sep.function
//4 set distance to neighbours to 1.
//5 check all neighbours. if endnode --> finish.
//6 set previousnode on currentnode.
//7 set distance to currentnode.
//8 repeat 3-7.


// set nodes to visit to waypoints + endpoint
// set currentTarget to nodesToVisit.shift()
// while loop for all nodes to visit.
// set 

// async function Dijkstra(grid){
//     let start = grid.start;
//     let end = grid.end;
//     let path = [];
//     let drawSpeed = grid.speed;
//     start.visited = true;
//     start.distance = 0;
//     start.totalDistance = 0;
//     path.push(start);
//     var priorityQueue = new PriorityQueue;

//     priorityQueue.enqueue(start, start.totalDistance);

//     while (!priorityQueue.isEmpty()){

//       var currentNode = priorityQueue.dequeue().element;
//       if (currentNode == end){
//         //console.log(currentNode.totalDistance);
//         console.log(`found ${currentTarget}`);
//         drawShortestPath(currentNode);
//         return;
//       }
//       var currenNeighbours = getAllNeighbours(currentNode);
    
//       for (var i in currenNeighbours){
//         var n = currenNeighbours[i];
//         n.visited = true;
//         DrawVisited(n);
//         priorityQueue.enqueue(n, n.totalDistance);
//       }
//       //console.log(priorityQueue);
//       await sleep(drawSpeed/10);
//       drawSpeed = drawSpeed*0.95;
//     }
//     console.log('failure');
//     alert('either the start or end is unreachable.\nNo path can be found.');
// }

async function Dijkstra(grid){
  grid.active = true;
  let start = grid.start;
  let end = grid.end;
  let path = [];
  let drawSpeed = grid.speed;
  var gridDiv = document.getElementById('grid');
  //start.visited = true;
  //start.distance = 0;
  //start.totalDistance = 0;
  path.push(start);
  var nodesToVisit = grid.waypoints;
  nodesToVisit.push(end);
  var startPoints = [start].concat(grid.waypoints);
  console.log(startPoints);
  
  for (var i = 0; i < nodesToVisit.length; i++){
    var nodesToClearO = gridDiv.getElementsByClassName('visited');
    var nodesToClear = Array.from(nodesToClearO);
    for (var index=0; index < nodesToClear.length; index++){
      var div = nodesToClear[index];
      var id = div.id;
      var node = grid.getNode(id);
      node.removeStatus('visited');
      node.softReset();
      div.className = node.status;
    }
    // for (var div of nodesToClear){
    //   var id = div.id;
    //   var node = grid.getNode(id);
    //   node.removeStatus('visited');
    //   div.className = node.status;
    // }
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
        //console.log(`found ${currentTarget.status}`);
        drawShortestPath(currentNode);
        grid.active = false;
        return;
      }else if (currentNode == currentTarget){
        //console.log(`found ${currentTarget.status}`);
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
      await sleep(drawSpeed/10);
      drawSpeed = drawSpeed*0.99;
    }
    if (priorityQueue.isEmpty()){
      console.log('failure');
      grid.active = false;
      alert('either the start or end is unreachable.\nNo path can be found.');
      return;
    }
  }
}