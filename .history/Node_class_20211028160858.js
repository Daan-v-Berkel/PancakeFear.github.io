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

  addStatus(s){
    this.status = `${this.status} ${s}`;
  }

  overwriteStatus(s){
    this.status = `node ${s}`;
  }

  removeStatus(s){
    var toRemove = ' ' + s;
    this.status.replace(toRemove, '');
  }
}