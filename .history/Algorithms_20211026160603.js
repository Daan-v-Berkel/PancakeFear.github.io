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
  let start = grid.start;
  let end = grid.end;
  let path = [];
  let drawSpeed = grid.speed;
  var gridDiv = document.getElementById('grid');
  start.visited = true;
  start.distance = 0;
  start.totalDistance = 0;
  path.push(start);
  var nodesToVisit = grid.waypoints;
  nodesToVisit.push(end);
  var startPoints = [start].concat(grid.waypoints);
  
  for (var i = 0; i < nodesToVisit.length; i++){
    var nodestoClear = gridDiv.getElementsByClassName('visited');
    for (n of nodestoClear){
      n.removeStatus('visited');
    }
    var priorityQueue = new PriorityQueue;
    var currentTarget = nodesToVisit[i];
    var currentStart = startPoints[i];
    priorityQueue.enqueue(currentStart, currentStart.totalDistance);

    while (!priorityQueue.isEmpty()){

      var currentNode = priorityQueue.dequeue().element;
      if ((currentNode == currentTarget) && (currentTarget == end)){
        //console.log(currentNode.totalDistance);
        console.log(`found ${currentTarget.status}`);
        drawShortestPath(currentNode);
        return;
      }else if (currentNode == currentTarget){
        //console.log(currentNode.totalDistance);
        console.log(`found ${currentTarget.status}`);
        drawShortestPath(currentNode);
        break;
      }
      var currenNeighbours = getAllNeighbours(currentNode);
    
      for (var i in currenNeighbours){
        var n = currenNeighbours[i];
        n.visited = true;
        DrawVisited(n);
        priorityQueue.enqueue(n, n.totalDistance);
      }
      //console.log(priorityQueue);
      await sleep(drawSpeed/10);
      drawSpeed = drawSpeed*0.99;
    }
    if (priorityQueue.isEmpty()){
      console.log('failure');
      alert('either the start or end is unreachable.\nNo path can be found.');
    }
  }
}