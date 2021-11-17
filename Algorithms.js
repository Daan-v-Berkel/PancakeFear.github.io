//currently arbitrary, later used to start the algorithm chosen by the user.
function startAlgorithm(grid) {
  if (grid.active) {
    // dont want to start a second while the first is still going
    return;
  }
  if (grid.algorithmFinished) {
    //if the next 'run' is started after one has already finished
    grid.softReset(); //reset things like visited nodes and shortest path.
  }

  var shortestpathInfo = document.getElementById("info-2");
  shortestpathInfo.innerHTML = "Nodes in path: 0";

  switch (grid.pickedAlgorithm) {
    case "DIJKSTRA":
      Dijkstra(grid); //TODO: make this be able to run the algorithm chosen
      break;
    case "GreedyBestFirst":
      GreedyBestFirst(grid);
      break;
    case "RandomWalk":
      RandomWalk(grid);
      break;
    default:
      Dijkstra(grid);
      break;
  }
}
//TODO: add more algorithms to choose from.

async function Dijkstra(grid) {
  var nodesVisitedInfo = document.getElementById("info-1");
  var nodesVisited = 0;
  var timeTakenInfo = document.getElementById("info-3");
  var timeTaken = 0.0;

  nodesVisitedInfo.innerHTML = "Nodes visited: 0";
  timeTakenInfo.innerHTML = "Running time: 0.0s";
  // pretty obvious.. made into async for the purpose of delaying by the drawingspeed.
  grid.active = true; // makes sure no action can be taken while it is running
  let start = grid.start;
  let end = grid.end;
  let path = [];
  let drawSpeed = grid.speed;
  var gridDiv = document.getElementById("grid");
  path.push(start);
  var nodesToVisit = Array.from(grid.waypoints); // this copies the array, because the array will be adapted in the algorithm.
  nodesToVisit.push(end);
  var startPoints = [start].concat(grid.waypoints);

  for (var i = 0; i < nodesToVisit.length; i++) {
    // basically runs the algorithm for every startpoint (needed in case the user adds waypoints)
    var nodesToClearO = gridDiv.getElementsByClassName("visited");
    var nodesToClear = Array.from(nodesToClearO); // because the algorithm runs multiple times in case of waypoints
    for (var index = 0; index < nodesToClear.length; index++) {
      // this clears the 'visited = true' attribute from nodes.
      var div = nodesToClear[index]; //else the algorithm skips earlier visited nodes.
      var id = div.id;
      var node = grid.getNode(id);
      node.softReset();
      div.className = node.status;
    }
    var priorityQueue = new PriorityQueue(); // priorityqueue makes sure we handle nodes closest to the current location first
    var currentTarget = nodesToVisit[i];
    currentTarget.softReset();
    var currentStart = startPoints[i];
    currentStart.visited = true;
    currentStart.distance = 0;
    currentStart.totalDistance = 0;
    priorityQueue.enqueue(currentStart, currentStart.totalDistance);

    while (!priorityQueue.isEmpty()) {
      // if there is elements in the queue, there is still nodes to search.
      var st = performance.now();
      var currentNode = priorityQueue.dequeue().element;
      if (currentNode == currentTarget && currentTarget == end) {
        //if we find the endnode, stop.
        drawShortestPath(currentNode);
        grid.algorithmFinished = true;
        grid.active = false;
        grid.succes = true;
        return;
      } else if (currentNode == currentTarget) {
        // if we find the current target, break out and set the next target
        await drawShortestPath(currentNode);
        break;
      }
      var currentNeighbours = getAllNeighbours(currentNode);

      for (var ind in currentNeighbours) {
        // every node the algorithm has searched will be 'colored'
        var n = currentNeighbours[ind];
        n.visited = true;
        DrawVisited(n);
        nodesVisited++;
        nodesVisitedInfo.innerHTML = `Nodes visited: ${nodesVisited}`;
        priorityQueue.enqueue(n, n.totalDistance);
      }
      if (drawSpeed) {
        // only if the speed was not set to 'no delay', add a delay.
        await sleep(drawSpeed / 10);
        drawSpeed = drawSpeed * 0.999;
      }
      var e = performance.now();
      timeTaken += parseFloat(e - st);
      timeTakenInfo.innerHTML = `Time taken: ${timeTaken.toFixed(1)}ms`;
    }
    if (priorityQueue.isEmpty()) {
      // no more nodes to search and target was not found.
      console.log("failure");
      grid.algorithmFinished = true;
      grid.active = false;
      grid.succes = false;

      var popup = document.getElementById("popup-algo-failed");
      var closeBtn = document.getElementsByClassName("close")[1];
      popup.style.display = "block";

      window.onclick = function (event) {
        if (event.target == popup || event.target == closeBtn) {
          popup.style.display = "none";
        }
      };
      return;
    }
  }
}

function Tester(grid) {
  // to test if a path is possible
  // only checks if all waypoints including endnode are reachable.
  let start = grid.start;
  var needToInclude = [];
  var inc = 0;
  for (node of grid.waypoints) {
    needToInclude.push(node.id);
  }
  needToInclude.push(grid.end.id);

  //dumbed down version of Dijkstra's
  // checks all possible nodes in the grid as if its searching for a target.
  // for every node it visits it checks if it is one of the targets that needs to be reachable.
  // if all targets have been found. there must be a path possible.

  var prio = new PriorityQueue();
  start.visited = true;
  start.distance = 0;
  start.totalDistance = 0;
  prio.enqueue(start, start.totalDistance);

  while (!prio.isEmpty()) {
    var currentNode = prio.dequeue().element;
    if (needToInclude.includes(currentNode.id)) {
      inc++;
      if (needToInclude.length == inc) {
        grid.softReset();
        return true;
      }
    }
    var neighbours = getAllNeighbours(currentNode);
    for (n of neighbours) {
      n.visited = true;
      prio.enqueue(n, n.totalDistance);
    }
  }
  if (prio.isEmpty()) {
    console.log("false");
    grid.softReset();
    return false;
  }
}

async function GreedyBestFirst(grid) {
  var nodesVisitedInfo = document.getElementById("info-1");
  var nodesVisited = 0;
  var timeTakenInfo = document.getElementById("info-3");
  var timeTaken = 0.0;

  nodesVisitedInfo.innerHTML = "Nodes visited: 0";
  timeTakenInfo.innerHTML = "Running time: 0.0s";

  grid.active = true; // makes sure no action can be taken while it is running
  let start = grid.start;
  let end = grid.end;
  let path = [];
  let drawSpeed = grid.speed;
  var gridDiv = document.getElementById("grid");
  path.push(start);
  var nodesToVisit = Array.from(grid.waypoints); // this copies the array, because the array will be adapted in the algorithm.
  nodesToVisit.push(end);
  var startPoints = [start].concat(grid.waypoints);

  for (var i = 0; i < nodesToVisit.length; i++) {
    var nodesToClearO = gridDiv.getElementsByClassName("visited");
    var nodesToClear = Array.from(nodesToClearO); // because the algorithm runs multiple times in case of waypoints
    for (var index = 0; index < nodesToClear.length; index++) {
      // this clears the 'visited = true' attribute from nodes.
      var div = nodesToClear[index]; //else the algorithm skips earlier visited nodes.
      var id = div.id;
      var node = grid.getNode(id);
      node.softReset();
      div.className = node.status;
    }

    var currentStart = startPoints[i];
    var currentTarget = nodesToVisit[i];
    currentStart.SetHeuristicDistance(currentTarget);

    var prioQueue = new PriorityQueue();
    prioQueue.enqueue(currentStart, currentStart.heuristicDistance);

    while (!prioQueue.isEmpty()) {
      var st = performance.now();
      // if there is elements in the queue, there is still nodes to search.

      var currentNode = prioQueue.dequeue().element;
      currentNode.visited = true;
      DrawVisited(currentNode);
      if (currentNode == currentTarget && currentTarget == end) {
        //if we find the endnode, stop.
        drawShortestPath(currentNode);
        grid.algorithmFinished = true;
        grid.active = false;
        grid.succes = true;
        return;
      } else if (currentNode == currentTarget) {
        // if we find the current target, break out and set the next target
        await drawShortestPath(currentNode);
        break;
      }
      var currentNeighbours = getAllNeighbours(currentNode);

      for (var ind in currentNeighbours) {
        // every node the algorithm has searched will be 'colored'
        var n = currentNeighbours[ind];
        n.visited = true;
        n.SetHeuristicDistance(currentTarget);
        //DrawVisited(n);
        nodesVisited++;
        nodesVisitedInfo.innerHTML = `Nodes visited: ${nodesVisited}`;
        prioQueue.enqueue(n, n.heuristicDistance);
      }
      if (drawSpeed) {
        // only if the speed was not set to 'no delay', add a delay.
        await sleep(drawSpeed / 10);
        drawSpeed = drawSpeed * 0.999;
      }
      var e = performance.now();
      timeTaken += parseFloat(e - st);
      timeTakenInfo.innerHTML = `Time taken: ${timeTaken.toFixed(1)}ms`;
    }
    if (prioQueue.isEmpty()) {
      // no more nodes to search and target was not found.
      console.log("failure");
      grid.algorithmFinished = true;
      grid.active = false;
      grid.succes = false;

      var popup = document.getElementById("popup-algo-failed");
      var closeBtn = document.getElementsByClassName("close")[1];
      popup.style.display = "block";

      window.onclick = function (event) {
        if (event.target == popup || event.target == closeBtn) {
          popup.style.display = "none";
        }
      };
      return;
    }
  }
}

async function RandomWalk(grid) {
  var nodesVisitedInfo = document.getElementById("info-1");
  var nodesVisited = 0;
  var timeTakenInfo = document.getElementById("info-3");
  var timeTaken = 0.0;

  nodesVisitedInfo.innerHTML = "Nodes visited: 0";
  timeTakenInfo.innerHTML = "Running time: 0.0s";

  grid.active = true; // makes sure no action can be taken while it is running
  let start = grid.start;
  let end = grid.end;
  let path = [];
  let drawSpeed = grid.speed;
  var gridDiv = document.getElementById("grid");
  path.push(start);
  var nodesToVisit = Array.from(grid.waypoints); // this copies the array, because the array will be adapted in the algorithm.
  nodesToVisit.push(end);
  var startPoints = [start].concat(grid.waypoints);

  for (var i = 0; i < nodesToVisit.length; i++) {
    var currentStart = startPoints[i];
    var currentTarget = nodesToVisit[i];

    currentStart.distance = 0;
    currentStart.totalDistance = 0;

    var prioQueue = new PriorityQueue();
    prioQueue.enqueue(currentStart, currentStart.distance);

    while (!prioQueue.isEmpty()) {
      var st = performance.now();
      var currentNode = prioQueue.dequeue().element;
      currentNode.visited = true;
      if (currentNode.previousNode) {
        DrawVisited(currentNode);
      }
      if (currentNode == currentTarget && currentTarget == end) {
        //if we find the endnode, stop.
        drawShortestPath(currentNode);
        grid.algorithmFinished = true;
        grid.active = false;
        grid.succes = true;
        return;
      } else if (currentNode == currentTarget) {
        // if we find the current target, break out and set the next target
        await drawShortestPath(currentNode);
        break;
      }
      var currentNeighbours = getAllNeighbours(currentNode);
      if (currentNeighbours.length == 0) {
        // if blocked,
        currentNeighbours.push(currentNode.previousNode);
      }

      for (var ind in currentNeighbours) {
        var rand = Math.floor(Math.random() * 10);
        var n = currentNeighbours[ind];
        if (!n) {
          // if the only neighbour is the startnode
          // no path is found
          prioQueue.empty();
          break;
        }
        n.SetHeuristicDistance(currentTarget);
        n.heuristicDistance += rand + n.weight;
        nodesVisited++;
        nodesVisitedInfo.innerHTML = `Nodes visited: ${nodesVisited}`;
        prioQueue.enqueue(n, n.heuristicDistance);
      }
      if (drawSpeed) {
        // only if the speed was not set to 'no delay', add a delay.
        await sleep(drawSpeed / 10);
        drawSpeed = drawSpeed * 0.999;
      }
      var e = performance.now();
      timeTaken += parseFloat(e - st);
      timeTakenInfo.innerHTML = `Time taken: ${timeTaken.toFixed(1)}ms`;
    }
    if (prioQueue.isEmpty()) {
      // no more nodes to search and target was not found.
      console.log("failure");
      grid.algorithmFinished = true;
      grid.active = false;
      grid.succes = false;

      var popup = document.getElementById("popup-algo-failed");
      var closeBtn = document.getElementsByClassName("close")[1];
      popup.style.display = "block";

      window.onclick = function (event) {
        if (event.target == popup || event.target == closeBtn) {
          popup.style.display = "none";
        }
      };
      return;
    }
  }
}
