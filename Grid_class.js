class Grid {
  // Base class for the grid, as 'backend' to the visual grid.
  constructor(col, rows) {
    this.columns = col;
    this.rows = rows;
    this.start = null;
    this.end = null;
    this.active = false;
    this.nodes = [];
    this.waypoints = [];
    this.nodesToReset = [];
    this.mousePressed = false;
    this.pressedNodeStatus = null;
    this.currentNode = null;
    this.previousNode = null;
    this.enteredSpecialNode = false;
    this.speed = 100;
    this.weightNumber = 3;
    this.algorithmFinished = false;
  }
  // gets a node from the created nodes in the grid
  getNode(id) {
    var coordinates = id.toString().split(",");
    var row = parseInt(coordinates[0]);
    var col = parseInt(coordinates[1]);
    return this.nodes[row][col];
  }
  // resets a node to its original state, visually this means it will become empty or white.
  resetNode(n) {
    //hard reset
    n.status = "node";
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

  findNodesByStatus(status) {
    var nodesFound = [];

    for (var r in this.nodes) {
      for (var n in this.nodes[r]) {
        var node = this.nodes[r][n];
        if (node.status.includes(status)) {
          nodesFound.push(node);
        }
      }
    }
    return nodesFound;
  }

  findAndResetAll(status) {
    // all with this status that is.
    for (var r in this.nodes) {
      for (var n in this.nodes[r]) {
        var node = this.nodes[r][n];
        if (node.status.includes(status)) {
          this.resetNode(node);
        }
      }
    }
  }

  addWaypoint(wpNode, replaceIndex = null) {
    var lostWP = null;
    var indexToString = null;
    if (wpNode && !replaceIndex) {
      this.waypoints.push(wpNode);
    } else {
      var i = this.waypoints.indexOf(wpNode);
      this.waypoints.splice(i, 1, wpNode);
    }
    if (this.waypoints.length > 3) {
      lostWP = this.waypoints.shift();
      lostWP.status = "node";
    }
    for (var i in this.waypoints) {
      switch (i) {
        case "0":
          indexToString = "one";
          this.waypoints[i].status = `node waypoint one`;
          break;
        case "1":
          indexToString = "two";
          this.waypoints[i].status = `node waypoint two`;
          break;
        case "2":
          indexToString = "three";
          this.waypoints[i].status = `node waypoint three`;
          break;
        default:
          break;
      }
    }
    if (lostWP) {
      return lostWP.id;
    }
  }

  removeWaypoint(wpNode) {
    var index = this.waypoints.indexOf(wpNode);
    var nodeToRemove = this.waypoints[index];
    var indexToString = null;
    this.waypoints.splice(index, 1);
    nodeToRemove.status = "node";
    for (var i in this.waypoints) {
      switch (i) {
        case "0":
          indexToString = "one";
          this.waypoints[i].status = `node waypoint one`;
          break;
        case "1":
          indexToString = "two";
          this.waypoints[i].status = `node waypoint two`;
          break;
        case "2":
          indexToString = "three";
          this.waypoints[i].status = `node waypoint three`;
          break;
        default:
          break;
      }
    }
  }

  softReset() {
    //this.start = null;
    //this.end = null;
    this.active = false;
    //this.waypoints = [];
    //this.nodesToReset = [];
    this.mousePressed = false;
    this.pressedNodeStatus = null;
    this.currentNode = null;
    this.previousNode = null;
    this.enteredSpecialNode = false;
    var classesToRemove = [
      // classes that always need to be takes away for reruns.
      "quadrice",
      "thrice",
      "twice",
      "once",
      "shortest",
      "visited",
    ];

    for (var cl of classesToRemove) {
      for (var r in this.nodes) {
        for (var c in this.nodes[r]) {
          var node = this.nodes[r][c];
          if (node.status.includes(cl)) {
            node.removeStatus(cl);
            node.softReset();
            var elem = document.getElementById(node.id);
            elem.className = node.status;
          } else if (node.status === "node") {
            node.softReset();
          }
        }
      }
    }
  }
}
