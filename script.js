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
  //e.preventDefault();
  grid.mousePressed = true;
  var id = e.target.id;
  grid.currentNode = grid.getNode(id);
  if (e.which === 3 && !(grid.currentNode.status.includes('start') || grid.currentNode.status.includes('end'))){
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
  grid.pressedNodeStatus = setMouseStatus(e);
  if (grid.pressedNodeStatus === 'endnode' || grid.pressedNodeStatus === 'startnode'){
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
  e.preventDefault();
  //grid.mousePressed = true;
  //var id = e.target.id;
  //grid.currentNode = grid.getNode(id);
  //grid.pressedNodeStatus = 'weighted';
  //e.target.className = 'weighted';
  //return false;
}

function mouseUpHandler(e){
  addWeights();
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
  if (grid.mousePressed){
    let thisElement = e.target;
    var id = e.target.id;
    var prevElement = document.getElementById(grid.currentNode.id);
    if (!(thisElement.className.includes('start') || thisElement.className.includes('end'))){
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