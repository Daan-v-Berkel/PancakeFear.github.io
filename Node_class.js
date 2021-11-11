class GridNode {
  // Base class for nodes, each representing 'backend' of the visual block(html div)
  constructor(id, status) {
    this.id = id;
    this.status = status; // node, startnode, endnode, visited, weighted, shortest, wall, waypoint(one, two, three).
    this.previousNode = null;
    this.visited = false;
    this.path = null;
    this.direction = null;
    this.storedDirection = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
    this.weight = 0;
    this.relatesToObject = false;
    this.overwriteObjectRelation = false;
    this.previousState = "node";
  }

  softReset() {
    //soft reset, for multiple waypoints
    //this.status = 'node';
    this.previousNode = null;
    this.path = null;
    this.visited = false;
    this.direction = null;
    this.storedDirection = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
    //this.weight = 0;
    this.relatesToObject = false;
    this.overwriteObjectRelation = false;
  }

  addStatus(s) {
    this.status = `${this.status} ${s}`;
  }

  overwriteStatus(s) {
    this.status = `node ${s}`;
  }

  removeStatus(s) {
    var toRemove = " " + s;
    var currentStatus = this.status;
    var newStatus = currentStatus.replace(toRemove, "");
    this.status = newStatus;
  }

  replaceStatus(oldS, newS) {
    this.removeStatus(oldS);
    this.addStatus(newS);
  }
}
