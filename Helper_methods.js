// Obviously the priorityQueue is straight up copied from the web.
// User defined class
// to store element and its priority
class QElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

// PriorityQueue class
class PriorityQueue {
  // An array is used to implement priority
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    // creating object from queue element
    var qElement = new QElement(element, priority);
    var contain = false;

    // iterating through the entire
    // item array to add element at the
    // correct location of the Queue
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        // Once the correct location is found it is
        // enqueued
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }

    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
      this.items.push(qElement);
    }
  }

  dequeue() {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow
    if (this.isEmpty()) return "Underflow";
    return this.items.shift();
  }

  isEmpty() {
    // return true if the queue is empty.
    return this.items.length == 0;
  }
}

function sleep(ms) {
  // function to add a drawing delay to the algorithms.
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAllNeighbours(node) {
  // gets all the neighbours of the target node
  // this is the long way around, because of the grid I decided to do it like so
  // a better way is probably to have each node store all connecting nodes and the distance to them
  // in an attribute.
  let coordinates = node.id;
  let row = parseInt(coordinates.split(",")[0]);
  let col = parseInt(coordinates.split(",")[1]);

  //pretty self explanatory, checks if the current node is on the edge of the grid somewhere
  // to make sure it doesnt try and find a node outside of the grid.
  // then adds the neighbour to an array if it exists.
  // does so for al 4 sides of a node.
  let neighbours = [];
  function getUpperNeighbour() {
    if (row === 0) {
      return null;
    } else {
      var upperNeighbourRow = row - 1;
      var upperNeighbourId = String(upperNeighbourRow) + "," + String(col);
      var neighbour = grid.getNode(upperNeighbourId);
      if (neighbour.visited || neighbour.status.includes("wall")) {
        return null;
      } else {
        neighbour.distance = 1 + neighbour.weight;
        neighbour.totalDistance = node.totalDistance + neighbour.distance;
        neighbour.previousNode = node;
        return neighbour;
      }
    }
  }
  var upperNeighbour = getUpperNeighbour();
  if (upperNeighbour) {
    neighbours.push(upperNeighbour);
  }

  function getRightNeighbour() {
    if (col === grid.columns - 1) {
      return null;
    } else {
      var rightNeighbourCol = col + 1;
      var rightNeighbourId = String(row) + "," + String(rightNeighbourCol);
      var neighbour = grid.getNode(rightNeighbourId);
      if (neighbour.visited || neighbour.status.includes("wall")) {
        return null;
      } else {
        neighbour.distance = 1 + neighbour.weight;
        neighbour.totalDistance = node.totalDistance + neighbour.distance;
        neighbour.previousNode = node;
        return neighbour;
      }
    }
  }
  var rightNeighbour = getRightNeighbour();
  if (rightNeighbour) {
    neighbours.push(rightNeighbour);
  }

  function getBottomNeighbour() {
    if (row === grid.rows - 1) {
      return null;
    } else {
      var bottomNeighbourRow = row + 1;
      var bottomNeighbourId = String(bottomNeighbourRow) + "," + String(col);
      var neighbour = grid.getNode(bottomNeighbourId);
      if (neighbour.visited || neighbour.status.includes("wall")) {
        return null;
      } else {
        neighbour.distance = 1 + neighbour.weight;
        neighbour.totalDistance = node.totalDistance + neighbour.distance;
        neighbour.previousNode = node;
        return neighbour;
      }
    }
  }
  var bottomNeighbour = getBottomNeighbour();
  if (bottomNeighbour) {
    neighbours.push(bottomNeighbour);
  }

  function getLeftNeighbour() {
    if (col === 0) {
      return null;
    } else {
      var leftNeighbourCol = col - 1;
      var leftNeighbourId = String(row) + "," + String(leftNeighbourCol);
      var neighbour = grid.getNode(leftNeighbourId);
      if (neighbour.visited || neighbour.status.includes("wall")) {
        return null;
      } else {
        neighbour.distance = 1 + neighbour.weight;
        neighbour.totalDistance = node.totalDistance + neighbour.distance;
        neighbour.previousNode = node;
        return neighbour;
      }
    }
  }
  var leftNeighbour = getLeftNeighbour();
  if (leftNeighbour) {
    neighbours.push(leftNeighbour);
  }
  return neighbours;
  // return the array of existing neighbours.
}

function DrawVisited(node) {
  // this checks what kind of node it is, and how many times it was visited
  // then adds the proper status, and use that status as a
  // classname for the div.
  var id = node.id;
  var elem = document.getElementById(id);
  if (
    node.visited &&
    !(node.status === "endnode") &&
    !node.status.includes("shortest")
  ) {
    if (node.status.includes("once")) {
      node.replaceStatus("once", "twice");
    } else if (node.status.includes("twice")) {
      node.replaceStatus("twice", "thrice");
    } else if (node.status.includes("thrice")) {
      node.replaceStatus("thrice", "quadrice");
    } else {
      node.addStatus("visited once");
    }

    elem.className = node.status;
  }
}

async function drawShortestPath(endNode) {
  // every node remembers the previous node, this will form a path of
  // how the algorithm found the target.
  var current = endNode.previousNode;
  var ls = [];
  while (current.previousNode) {
    ls.push(current);
    current = current.previousNode;
  }
  while (ls.length) {
    var node = ls.pop();
    var id = node.id;
    var elem = document.getElementById(id);

    // this needs to handle different kind of nodes and also
    // sets how many times it has been drawn as a shortest path
    // (in the case of multiple waypoints, paths may cross)
    // there is probably a better way to do this.
    if (!node.status.includes("endnode") && !node.status.includes("waypoint")) {
      if (
        node.status.includes("shortest") &&
        !node.status.includes("weighted")
      ) {
        if (node.status.includes("once")) {
          node.overwriteStatus("shortest twice");
        } else if (node.status.includes("twice")) {
          node.overwriteStatus("shortest thrice");
        } else if (node.status.includes("thrice")) {
          node.overwriteStatus("shortest quadrice");
        }
      } else if (!node.status.includes("weighted")) {
        node.overwriteStatus("shortest once");
      } else if (
        node.status.includes("weighted") &&
        node.status.includes("shortest")
      ) {
        if (node.status.includes("once")) {
          node.overwriteStatus("weighted shortest twice");
        } else if (node.status.includes("twice")) {
          node.overwriteStatus("weighted shortest thrice");
        } else if (node.status.includes("thrice")) {
          node.overwriteStatus("weighted shortest quadrice");
        }
      } else if (node.status.includes("weighted")) {
        node.overwriteStatus("weighted shortest once");
      }
    }

    elem.className = node.status;
    if (grid.speed) {
      // add the delay to make visualizing a bit more appealing
      await sleep(grid.speed / 3);
    }
  }
}

function SetWeightValue(slider) {
  // gets the value from the weights slider
  // and sets it to the value of weights to be added.
  var val = slider.value;
  var output = document.getElementById("weightLabel");
  output.innerHTML = `weight value: ${val}`;
  grid.weightNumber = val;
}

function addWeights() {
  // checks for all weights drawn on the grid and
  // assigns the status to the underlying node.
  // as well as actualy giving it the weight
  var gridDiv = document.getElementById("grid");
  var weightedNodes = gridDiv.getElementsByClassName("weighted");
  if (weightedNodes.length > 0) {
    for (var i in weightedNodes) {
      currentElement = weightedNodes.item(i);
      currentId = currentElement.id;
      currentNode = grid.getNode(currentId);
      currentNode.weight = grid.weightNumber;
    }
  }
}

function handleWaypoints() {
  // make sure that visually the correct number apears on the corresponding waypoint.
  var gridDiv = document.getElementById("grid");
  var One = gridDiv.getElementsByClassName("one");
  if (One.length > 0) {
    var idOne = One[0].id;
    grid.waypoints.splice(0, 1, grid.getNode(idOne));
  }
  var Two = gridDiv.getElementsByClassName("two");
  if (Two.length > 0) {
    var idTwo = Two[0].id;
    grid.waypoints.splice(1, 1, grid.getNode(idTwo));
  }
  var Three = gridDiv.getElementsByClassName("three");
  if (Three.length > 0) {
    var idThree = Three[0].id;
    grid.waypoints.splice(2, 1, grid.getNode(idThree));
  }
}

function HandleResets(elem) {
  // creates a checked mark for selected elements
  // and handles this element as needed to be reset or not
  var itemClicked = elem.id;
  var innerSpan = document.getElementById(`${itemClicked}-inner`);
  var statusName = itemClicked.replace("-reset", "");

  if (innerSpan.innerHTML) {
    innerSpan.innerHTML = "";
    var index = grid.nodesToReset.indexOf(statusName);
    grid.nodesToReset.splice(index, 1);
  } else {
    innerSpan.innerHTML = "&check;";
    grid.nodesToReset.push(statusName);
  }
}

function RedrawGrid(grid) {
  // goes over every node in the grid, and resets its status to the corresponding div.
  for (row in grid.nodes) {
    for (col in grid.nodes[row]) {
      var node = grid.nodes[row][col];
      var status = node.status;
      var id = node.id;
      document.getElementById(id).className = status;
    }
  }
}

function ResetGrid(grid) {
  // this goes over the selected reset options, and resets those nodes
  if (grid.active) {
    // dont reset when an algorithm is running.
    return;
  }

  var start = grid.start; // needed to be saved for later
  var end = grid.end;
  grid.softReset(); // soft reset handles things that allways need to be reset.

  for (var idx in grid.nodesToReset) {
    var currentStatusToReset = grid.nodesToReset[idx];
    if (
      currentStatusToReset !== "startnode" &&
      currentStatusToReset !== "endnode"
    ) {
      grid.findAndResetAll(currentStatusToReset); // resets selected types
      if (currentStatusToReset === "waypoint") {
        // if waypoints are reset, this will also clear them from memory
        grid.waypoints = [];
      }
    } else if (currentStatusToReset == "startnode") {
      grid.resetNode(start);
      grid.start = grid.getNode("3,6");
      grid.getNode("3,6").status = "startnode";
    } else if (currentStatusToReset == "endnode") {
      grid.resetNode(end);
      grid.end = grid.getNode("22,50");
      grid.getNode("22,50").status = "endnode";
    }
  }
  RedrawGrid(grid);
}

function ShowInstructions() {
  // 'opens' the popup window with instructions
  var popup = document.getElementById("popup");
  popup.style.display = "block";
}

function CloseWindow() {
  var popup = document.getElementById("popup");
  var closeBtn = document.getElementsByClassName("close")[0];
  //popup.style.display = "block";
  window.onclick = function (event) {
    if (event.target == popup || event.target == closeBtn) {
      popup.style.display = "none";
    }
  };
}

function Maze() {
  // very dumb way of making a maze
  // able to create mazes with no possible path.
  var start = document.getElementsByClassName("startnode")[0];
  var end = document.getElementsByClassName("endnode")[0];

  // first get the grid ready by resetting it (walls and softreset)
  grid.softReset();
  grid.findAndResetAll("node wall");
  RedrawGrid(grid);

  // for every node in every uneven row
  // this will turn it into a wall based on a random number
  // comes down to about 60% of them at random
  for (var row in grid.nodes) {
    if (row % 2 == 1) {
      var r = grid.nodes[row];
      for (var idx in r) {
        var randNum = Math.floor(Math.random() * 10);
        var node = r[idx];
        if (
          node.status === "startnode" ||
          node.status === "endnode" ||
          node.status.includes("waypoint")
        ) {
          continue;
        } else if (randNum < 7) {
          node.status = "node wall";
          document.getElementById(node.id).className = node.status;
        }
      }
    }
  }
  // then this will do the same for every even row
  // only turning about 20% of them into walls
  for (var row in grid.nodes) {
    if (row % 2 == 0) {
      var r = grid.nodes[row];
      for (var idx in r) {
        var randNum = Math.floor(Math.random() * 10);
        var node = r[idx];
        if (
          node.status === "startnode" ||
          node.status === "endnode" ||
          node.status.includes("waypoint")
        ) {
          continue;
        } else if (randNum > 8) {
          node.status = "node wall";
          document.getElementById(node.id).className = node.status;
        }
      }
    }
  }
  // terrible attempt to create less mazes with no path
  // by making sure the start and endnode have at most 2 walls next to them
  if (getAllNeighbours(start).length < 1 || getAllNeighbours(end).length < 1) {
    Maze();
  }
  // to create mazes that are allways possible it is ofc possible
  // to call a pathfinder after it is created and run this algorithm again
  // if no path can be found.
  // this 
}
