class Grid {
    // Base class for the grid, as 'backend' to the visual grid.
    constructor(col, rows){
      this.columns = col;
      this.rows = rows;
      this.start = null;
      this.end = null;
      this.nodes = [];
      this.mousePressed = false;
      this.pressedNodeStatus = null;
      this.currentNode = null;
      this.previousNode = null;
      this.enteredSpecialNode = false;
      this.speed = 100;
      this.weightNumber = 3;
    }
  // gets a node from the created nodes in the grid
    getNode(id){
      var coordinates = id.toString().split(',');
      var row = parseInt(coordinates[0]);
      var col = parseInt(coordinates[1]);
      return this.nodes[row][col];
    }
  // resets a node to its original state, visually this means it will become empty or white.
    resetNode(n){
      n.status = 'node';
      n.previousNode = null;
      n.path = null;
      n.visited = false;
      n.direction = null;
      n.storedDirection = null;
      n.distance = Infinity;
      n.totalDistance = Infinity;
      n.heuristicDistance = null;
      n.weight = 0;
      n.relatesToObject = false;
      n.overwriteObjectRelation = false;
    }

    findNodesByStatus(status){
      var nodesFound = [];

      for (var r in this.nodes){
        for (var n in r){
          if (n.status.includes(status)){
            nodesFound.push(n);
          }
        }
      }
      return nodesFound;
    }
  }