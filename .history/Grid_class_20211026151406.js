class Grid {
    // Base class for the grid, as 'backend' to the visual grid.
    constructor(col, rows){
      this.columns = col;
      this.rows = rows;
      this.start = null;
      this.end = null;
      this.nodes = [];
      this.waypoints = [];
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

    addWaypoint(wpNode, replaceIndex=null){
      var lostWP = null;
      var indexToString = null;
      if (wpNode && !replaceIndex){
        this.waypoints.push(wpNode)
      }else{
        var i = this.waypoints.indexOf(wpNode);
        this.waypoints.splice(i, 1, wpNode)
      }
      if (this.waypoints.length > 3){
        lostWP = this.waypoints.shift();
        lostWP.status = 'node';
      }
      for (var i in this.waypoints){
        switch(i){
          case '0':
            indexToString = 'one';
            this.waypoints[i].status = `node waypoint one`;
            break;
          case '1':
            indexToString = 'two';
            this.waypoints[i].status = `node waypoint two`;
            break;
          case '2':
            indexToString = 'three';
            this.waypoints[i].status = `node waypoint three`;
            break;
          default:
            console.log(i);
        }
        //this.waypoints[i].status = `node waypoint ${indexToString}`;
      }
      //console.log(this.waypoints);
      if(lostWP){return lostWP.id;}
    }

    removeWaypoint(wpNode){
      var index = this.waypoints.indexOf(wpNode);
      var nodeToRemove = this.waypoints[index];
      var indexToString = null;
      this.waypoints.splice(index, 1);
      nodeToRemove.status = 'node';
      for (var i in this.waypoints){
        switch(i){
          case '0':
            indexToString = 'one';
            this.waypoints[i].status = `node waypoint one`;
            break;
          case '1':
            indexToString = 'two';
            this.waypoints[i].status = `node waypoint two`;
            break;
          case '2':
            indexToString = 'three';
            this.waypoints[i].status = `node waypoint three`;
            break;
          default:
            console.log(i);
        }
        //this.waypoints[i].status = `node waypoint ${indexToString}`;
      }
      //return nodeToRemove.id;
    }
  }