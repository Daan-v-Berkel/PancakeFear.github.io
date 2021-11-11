// base variables
const startNode = [3, 6];
const endNode = [22, 50];
let grid = null;

function createGrid() {
  // creates the grid (on loading of the page) both visual(html) and 'backend'
  grid = new Grid(60, 30); // backend of the grid
  let gridDiv = document.getElementById("grid");
  let columns = gridDiv.offsetWidth / 20;
  let rows = gridDiv.offsetHeight / 20;

  for (var i = 0; i < rows; i++) {
    // looping trough all rows and columns to create an html div per node.
    var currentRow = [];
    for (var o = 0; o < columns; o++) {
      var gridNode = document.createElement("div");
      let newId = i.toString() + "," + o.toString();
      gridNode.id = newId;
      if (i === startNode[0] && o === startNode[1]) {
        gridNode.className = "startnode";
        var gn = new GridNode(newId, "startnode");
        grid.start = gn;
      } else if (i === endNode[0] && o === endNode[1]) {
        gridNode.className = "endnode";
        var gn = new GridNode(newId, "endnode");
        grid.end = gn;
      } else {
        gridNode.className = "node";
        var gn = new GridNode(newId, "node");
      }
      //add mousehandlers to each node.

      gridNode.onmouseover = mouseEnterHandler;
      gridNode.onmousedown = mouseDownHandler;
      gridNode.oncontextmenu = rightMouseHandler;
      currentRow.push(gn); // push the node into the corresponding row
      gridDiv.appendChild(gridNode);
    }
    //push each 'row' of nodes into the matrix, used to find nodes in the grid with id.
    grid.nodes.push(currentRow);
  }
  return grid;
}

function mouseDownHandler(e) {
  if (grid.active) {
    // if an algorithm is currently busy, do nothing
    return;
  }
  e.preventDefault();
  grid.mousePressed = true;
  var id = e.target.id;
  grid.currentNode = grid.getNode(id);
  grid.pressedNodeStatus = setMouseStatus(e);
  if (e.which === 2) {
    // if middle mouse button
    if (!grid.pressedNodeStatus.includes("waypoint")) {
      var idToRemove = grid.addWaypoint(grid.currentNode);
      // addwaypoint makes sure no more then 3 waypoints can be made, and removes the correct
      // waypoint if you keep clicking middle mouse button.
      if (idToRemove) {
        document.getElementById(idToRemove).className = "node";
      }

      for (var i in grid.waypoints) {
        // make sure to draw the nodes on the page
        var node = grid.waypoints[i];
        var div = document.getElementById(node.id);
        div.className = node.status;
      }
      e.target.className = grid.currentNode.status;
      return;
    } else {
      // if a waypoint itself is clicked, remove it.
      grid.removeWaypoint(grid.currentNode);
      for (var i in grid.waypoints) {
        var node = grid.waypoints[i];
        var div = document.getElementById(node.id);
        div.className = node.status;
      }
      grid.currentNode.status = "node";
      e.target.className = "node";
      return;
    }
  }
  if (
    e.which === 3 &&
    !(
      grid.currentNode.status.includes("start") ||
      grid.currentNode.status.includes("end") ||
      grid.currentNode.status.includes("waypoint")
    )
  ) {
    //right mousebutton
    if (grid.currentNode.status.includes("weighted")) {
      grid.pressedNodeStatus = "node";
      grid.currentNode.status = "node";
      e.target.className = grid.currentNode.status;
      return;
    } else {
      grid.pressedNodeStatus = "node weighted";
      grid.currentNode.overwriteStatus("weighted");
      e.target.className = grid.currentNode.status;
      console.log(grid.weightNumber);
      return;
    }
  }
  if (
    grid.pressedNodeStatus === "endnode" ||
    grid.pressedNodeStatus === "startnode" ||
    grid.pressedNodeStatus.includes("waypoint")
  ) {
    // left mouse button
    return;
  } else if (!grid.pressedNodeStatus.includes("wall")) {
    grid.currentNode.status = "node wall";
    e.target.className = grid.currentNode.status;
  } else if (grid.pressedNodeStatus.includes("wall")) {
    grid.currentNode.status = "node";
    e.target.className = grid.currentNode.status;
  }
}

// mousehandleers are only active on the grid itself
function rightMouseHandler(e) {
  e.preventDefault(); //prevent the usual context menu to pop up, right mouseclick is used later.
}

// on mouseup (over the grid) it pulls up all new positions and
//additions to the grid, and asigns the correct values to the 'backend' nodes.
function mouseUpHandler(e) {
  if (grid.active) {
    // if an algorithm is currently busy, do nothing
    return;
  }
  addWeights();
  handleWaypoints();
  grid.mousePressed = false;
  grid.mouseState = null;
  grid.pressedNodeStatus = null;
  grid.currentNode = null;
  grid.previousNode = null;

  var gridDiv = document.getElementById("grid");
  startPosId = gridDiv.getElementsByClassName("startnode")[0].id;
  endPosId = gridDiv.getElementsByClassName("endnode")[0].id;
  grid.start = grid.getNode(startPosId);
  grid.end = grid.getNode(endPosId);
}

// if mouse is pressed, and its dragged into another div in the grid, this provides the right responses.
function mouseEnterHandler(e) {
  if (grid.active) {
    // if an algorithm is currently busy, do nothing
    return;
  }
  if (grid.mousePressed) {
    if (e.which === 2) {
      // middle mousebutton is not used to drag nodes.
      return;
    }
    let thisElement = e.target; //get target (the div your mouse entered)
    var id = e.target.id;
    var prevElement = document.getElementById(grid.currentNode.id);

    //skip certain special nodes that you dont want to overwrite with any other node.
    if (
      !(
        thisElement.className.includes("start") ||
        thisElement.className.includes("end") ||
        thisElement.className.includes("waypoint")
      )
    ) {
      grid.previousNode = grid.currentNode;
      grid.currentNode = grid.getNode(id);
      grid.currentNode.previousState = grid.currentNode.status;
      switch (
        grid.pressedNodeStatus //depending on what type of node you clicked first, decides what to turn the entered node to.
      ) {
        case "node wall":
          grid.currentNode.status = "node";
          thisElement.className = grid.currentNode.status; // set the status on the backend node and the identical classname on the corresponding div
          break;
        case "node weighted":
          grid.currentNode.overwriteStatus("weighted");
          thisElement.className = grid.currentNode.status;
          break;
        case "node":
          grid.currentNode.overwriteStatus("wall");
          thisElement.className = grid.currentNode.status;
          break;
        default:
          grid.currentNode.status = grid.pressedNodeStatus;
          thisElement.className = grid.pressedNodeStatus;
          grid.previousNode.status = grid.previousNode.previousState;
          prevElement.className = grid.previousNode.status;
          break;
      }
    }
  }
}

function setMouseStatus(targetElement) {
  //mouseStatus is used to give this status to other nodes
  if (targetElement) {
    return targetElement.target.className;
  }
  return null;
}

function SelectSpeed(elem) {
  // handles the dropdown menu to select the speed at which it visualizes.
  if (grid.active) {
    // ignore changes if an algorithm is currently busy, created unexpected outputs.
    return;
  }
  var gridElement = document.getElementById("grid");
  var nodeElements = gridElement.getElementsByClassName("node");
  var btn = document.getElementById("dropdown-btn");
  var speedString = elem.innerHTML;
  var speed = null;

  switch (speedString) {
    case "slow":
      speed = 500;
      break;
    case "medium":
      speed = 200;
      break;
    case "fast":
      speed = 100;
      break;
    case "no delay":
      speed = null;
      break;
    default:
      speed = 100;
      break;
  }
  grid.speed = speed; // sets the chosen speed
  btn.innerHTML = `Speed: ${speedString}`;

  if (!grid.speed) {
    //if speed is 'no delay' this takes away transitions from the CSS of all nodes.
    for (var node of nodeElements) {
      node.style.transition = "none";
    }
  } else {
    for (var node of nodeElements) {
      node.style.transition = "0.6s ease-out";
    }
  }
}

//TODO: probably should put this in a function.
//adds handlers to the popup window for the instructions.
var popup = document.getElementById("popup");
var btn = document.getElementById("popup-btn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  popup.style.display = "block";
};

span.onclick = function () {
  popup.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};
