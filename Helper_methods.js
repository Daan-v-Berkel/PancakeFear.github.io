// User defined class
// to store element and its priority
class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}
 
// PriorityQueue class
class PriorityQueue {
 
    // An array is used to implement priority
    constructor()
    {
        this.items = [];
    }
 
    enqueue(element, priority){
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

    dequeue(){
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    isEmpty(){
        // return true if the queue is empty.
        return this.items.length == 0;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getAllNeighbours(node){
    let coordinates = node.id;
    //console.log(coordinates);
    let row = parseInt(coordinates.split(',')[0]);
    let col = parseInt(coordinates.split(',')[1]);

    let neighbours = [];
    function getUpperNeighbour(){
        if (row === 0){
            return null;
        }else {
            var upperNeighbourRow = row - 1;
            var upperNeighbourId = String(upperNeighbourRow) + ',' + String(col);
            var neighbour = grid.getNode(upperNeighbourId);
            if (neighbour.visited || (neighbour.status.includes('wall'))){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                neighbour.previousNode = node;
                return neighbour;
            }
        }
    }
    var upperNeighbour = getUpperNeighbour();
    if (upperNeighbour){
        neighbours.push(upperNeighbour);
    }

    function getRightNeighbour(){
        if (col === (grid.columns - 1)){
            return null;
        }else {
            var rightNeighbourCol = col + 1;
            var rightNeighbourId = String(row) + ',' + String(rightNeighbourCol);
            var neighbour = grid.getNode(rightNeighbourId);
            if (neighbour.visited || (neighbour.status.includes('wall'))){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                neighbour.previousNode = node;
                return neighbour;
            }
        }
    }
    var rightNeighbour = getRightNeighbour();
    if (rightNeighbour){
        neighbours.push(rightNeighbour);
    }

    function getBottomNeighbour(){
        if (row === (grid.rows - 1)){
            return null;
        }else {
            var bottomNeighbourRow = row + 1;
            var bottomNeighbourId = String(bottomNeighbourRow) + ',' + String(col);
            var neighbour = grid.getNode(bottomNeighbourId);
            if (neighbour.visited || (neighbour.status.includes('wall'))){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                neighbour.previousNode = node;
                return neighbour;
            }
        }
    }
    var bottomNeighbour = getBottomNeighbour();
    if (bottomNeighbour){
        neighbours.push(bottomNeighbour);
    }

    function getLeftNeighbour(){
        if (col === 0){
            return null;
        }else {
            var leftNeighbourCol = col - 1;
            var leftNeighbourId = String(row) + ',' + String(leftNeighbourCol);
            var neighbour = grid.getNode(leftNeighbourId);
            if (neighbour.visited || (neighbour.status.includes('wall'))){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                neighbour.previousNode = node;
                return neighbour;
            }
        }
    }
    var leftNeighbour = getLeftNeighbour();
    if (leftNeighbour){
        neighbours.push(leftNeighbour);
    }
    console.log(neighbours);
    return neighbours;
}

function DrawVisited(node){
    var id = node.id;
    var elem = document.getElementById(id);
    if (node.visited && !(node.status === 'endnode')){
        node.addStatus('visited');
        //console.log(node.status);
        elem.className = node.status;
    //if (node.visited && !elem.className.includes('endnode')){
    //  if(!elem.className.includes('weighted')){
    //      elem.classList.add('visited');
    //    } else {
    //        elem.className = 'weighted visited';
    //    }
    //}
  }
}

async function drawShortestPath(endNode){
  var current = endNode.previousNode;
  var ls = [];
  while(current.previousNode){
    ls.push(current);
    current = current.previousNode;
  }
  while(ls.length){
    var node = ls.pop();
    var id = node.id;
    var elem = document.getElementById(id);
    node.addStatus('shortest');
    elem.className = node.status;
    // if(!elem.className.includes('weighted')){
    //     elem.classList.add('shortest');
    //   } else {
    //     elem.className = 'weighted shortest';
    //   }
    await sleep(grid.speed);
  }
}

function addWeights(){
    var weightedNodes = document.getElementsByClassName('weighted');
    if (weightedNodes.item(0)){
        for (var i in weightedNodes){
            currentElement = weightedNodes.item(i);
            currentId = currentElement.id;
            currentNode = grid.getNode(currentId);
            currentNode.weight = grid.weightNumber;
        }
    }
}

function PrepareRerun(grid){
    var nodesToClear = [];
    for (var i in nodesToClear){
        var currentNode = nodesToClear[i];
    }
}
