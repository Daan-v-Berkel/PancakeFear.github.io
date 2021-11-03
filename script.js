// base variables
const startNode = [0, 2]
const endNode = [0, 10]
let grid = null;

function createGrid(){// creates the grid (on loading of the page) both visual(html) and backend
  grid = new Grid(60, 30);
  let gridDiv = document.getElementById('grid');
  let columns = gridDiv.offsetWidth / 20;
  let rows = gridDiv.offsetHeight / 20;
  
  for (var i = 0; i < rows; i++){
    var currentRow = [];
    for (var o = 0; o < columns; o++){
      var gridNode = document.createElement("div");
      let newId = i.toString() + ',' + o.toString();
      gridNode.id = newId;
      if (i === startNode[0] && o === startNode[1]){
        gridNode.className = 'startnode';
        var gn = new GridNode(newId, 'startnode')
        grid.start = gn;
      }
      else if (i === endNode[0] && o === endNode[1]){
        gridNode.className = 'endnode';
        var gn = new GridNode(newId, 'endnode')
        grid.end = gn;
      }else{
        gridNode.className = 'node';
        var gn = new GridNode(newId, 'node')
      }
      //add mousehandlers to each node.
      
      gridNode.onmouseover = mouseEnterHandler;
      gridNode.onmousedown = mouseDownHandler;
      gridNode.oncontextmenu = rightMouseHandler;
      currentRow.push(gn);
      gridDiv.appendChild(gridNode);
    }
    //pushes each 'row' of nodes into the array, used to find nodes in the grid with id.
    grid.nodes.push(currentRow);
  }
  return grid;
}

function mouseDownHandler(e){
  if (grid.active){
    return;
  }
  e.preventDefault();
  grid.mousePressed = true;
  var id = e.target.id;
  grid.currentNode = grid.getNode(id);
  grid.pressedNodeStatus = setMouseStatus(e);
  if (e.which === 2){
    var waypoints = grid.waypoints;
    if (!grid.pressedNodeStatus.includes('waypoint')){
      var idToRemove = grid.addWaypoint(grid.currentNode);
      if (idToRemove){
        document.getElementById(idToRemove).className = 'node';
      }
      //set all divs to right class
      for (var i in grid.waypoints){
        var node = grid.waypoints[i];
        var div = document.getElementById(node.id);
        div.className = node.status;
      }
      e.target.className = grid.currentNode.status;
      return;
    }else{
      grid.removeWaypoint(grid.currentNode);
      for (var i in grid.waypoints){
        var node = grid.waypoints[i];
        var div = document.getElementById(node.id);
        div.className = node.status;
      }
      grid.currentNode.status = 'node';
      e.target.className = 'node';
      return;
    }
  }
  if (e.which === 3 && !(grid.currentNode.status.includes('start') || grid.currentNode.status.includes('end') || grid.currentNode.status.includes('waypoint'))){
    if (grid.currentNode.status.includes('weighted')){
      grid.pressedNodeStatus = 'node';
      grid.currentNode.status = 'node';
      e.target.className = grid.currentNode.status;
      return;
    }else{
      grid.pressedNodeStatus = 'node weighted';
      grid.currentNode.overwriteStatus('weighted');
      e.target.className = grid.currentNode.status;
      return;
    }
  }
  if (grid.pressedNodeStatus === 'endnode' || grid.pressedNodeStatus === 'startnode' || grid.pressedNodeStatus.includes('waypoint')){
    return;
  }else if (!grid.pressedNodeStatus.includes('wall')){
    grid.currentNode.status = 'node wall';
    e.target.className = grid.currentNode.status;
  }else if (grid.pressedNodeStatus.includes('wall')){
    grid.currentNode.status = 'node';
    e.target.className = grid.currentNode.status;
  }
}

function rightMouseHandler(e){
  if (grid.active){
    return;
  }
  e.preventDefault();
}

function mouseUpHandler(e){
  if (grid.active){
    return;
  }
  addWeights();
  handleWaypoints();
  grid.mousePressed = false;
  grid.mouseState = null;
  grid.pressedNodeStatus = null;
  grid.currentNode = null;
  grid.previousNode = null;

  var gridDiv = document.getElementById('grid');
  startPosId = gridDiv.getElementsByClassName('startnode')[0].id;
  endPosId = gridDiv.getElementsByClassName('endnode')[0].id;
  grid.start = grid.getNode(startPosId);
  grid.end = grid.getNode(endPosId);
}

function mouseEnterHandler(e){
  if (grid.active){
    return;
  }
  if (grid.mousePressed){
    if (e.which === 2){
      return;
    }
    let thisElement = e.target;
    var id = e.target.id;
    var prevElement = document.getElementById(grid.currentNode.id);
    if (!(thisElement.className.includes('start') || thisElement.className.includes('end') || thisElement.className.includes('waypoint'))){
      grid.previousNode = grid.currentNode;
      grid.currentNode = grid.getNode(id);
      switch (grid.pressedNodeStatus){
        case "node wall":
          grid.currentNode.status = 'node';
          thisElement.className = grid.currentNode.status;
          break;
        case 'node weighted':
          grid.currentNode.overwriteStatus('weighted');
          thisElement.className = grid.currentNode.status;
          break;
        case 'node':
          grid.currentNode.overwriteStatus('wall');
          thisElement.className = grid.currentNode.status;
          break;
        default:
          grid.currentNode.status = grid.pressedNodeStatus;
          thisElement.className = grid.pressedNodeStatus;
          grid.previousNode.status = 'node';
          prevElement.className = grid.previousNode.status;
          break;
      }
    }
  }
}

function setMouseStatus(targetElement){
  if (targetElement){
    return targetElement.target.className;
  }
  return null;
}

function SelectFromDropdown(elem){
  var btn = document.getElementById("dropdown-btn");
  var speedString = elem.innerHTML;
  var speed = null;

  switch (speedString){
    case "slow":
      speed = 500;
      break;
    case "medium":
      speed = 200;
      break;
    case "fast":
      speed = 100;
      break;
    default:
      speed = 100;
      break;
  }
  grid.speed = speed;
  btn.innerHTML = `Speed: ${speedString}`;

}