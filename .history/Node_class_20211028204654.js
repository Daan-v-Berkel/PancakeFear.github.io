class GridNode {
  // Base class for nodes, each representing 'backend' of the visual block
  constructor(id, status){
    this.id = id;
    this.status = status;// node, startnode, endnode, visited, weighted, shortest, wall.
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
  }

  softRestNode(n){//soft reset, for multiple waypoints
    //n.status = 'node';
    n.previousNode = null;
    n.path = null;
    n.visited = false;
    n.direction = null;
    n.storedDirection = null;
    n.distance = Infinity;
    n.totalDistance = Infinity;
    n.heuristicDistance = null;
    //n.weight = 0;
    n.relatesToObject = false;
    n.overwriteObjectRelation = false;
  }

  addStatus(s){
    this.status = `${this.status} ${s}`;
  }

  overwriteStatus(s){
    this.status = `node ${s}`;
  }

  removeStatus(s){
    var toRemove = ' ' + s;
    var currentStatus = this.status;
    var newStatus = currentStatus.replace(toRemove, '');
    this.status = newStatus
    console.log(this.status);
  }
}