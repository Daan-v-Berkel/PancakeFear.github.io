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

// PSEUDO
//1 get startnode.
//2 save startnode in array. set it as visited.
//3 get all (unvisited and non-wall) neighbours (up, down, left, right). --> sep.function
//4 set distance to neighbours to 1.
//5 check all neighbours. if endnode --> finish.
//6 set previousnode on currentnode.
//7 set distance to currentnode.
//8 repeat 3-7.

function Dijkstra(grid){
    let start = grid.start;
    let end = grid.end;
    let path = [];
    start.visited = true;
    start.distance = 0;
    start.totalDistance = 0;
    path.push(start);
    var priorityQueue = new PriorityQueue;

    priorityQueue.enqueue(start);

    while (!priorityQueue.isEmpty){

        var currentNode = priorityQueue.shift();
        if (currentNode == grid.start){
            return 'succes';
        }
        var currenNeighbours = getAllNeighbours(currentNode);
    
        for (n in currenNeighbours){
            priorityQueue.enqueue(n, n.totalDistance);
        }
    }
    return 'failure';
}

function getAllNeighbours(node){
    let coordinates = node.id.split(',');
    let row = parseInt(coordinates[0]);
    let col = parseInt(coordinates[1]);

    let neighbours = [];
    let upperNeighbour = function(){
        if (row === 0){
            return null;
        }else {
            var upperNeighbourRow = row - 1;
            var upperNeighbourId = String(upperNeighbourRow) + ',' + String(col);
            var neighbour = grid.getNode(upperNeighbourId);
            if (neighbour.visited || (neighbour.status === 'wall')){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                return neighbour;
            }
        }
    }
    if (upperNeighbour){
        neighbours.push(upperNeighbour);
    }

    let rightNeighbour = function(){
        if (col === (grid.columns - 1)){
            return null;
        }else {
            var rightNeighbourCol = col + 1;
            var rightNeighbourId = String(row) + ',' + String(rightNeighbourCol);
            var neighbour = grid.getNode(rightNeighbourId);
            if (neighbour.visited || (neighbour.status === 'wall')){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                return neighbour;
            }
        }
    }
    if (rightNeighbour){
        neighbours.push(rightNeighbour);
    }

    let bottomNeighbour = function(){
        if (row === (grid.rows - 1)){
            return null;
        }else {
            var bottomNeighbourRow = row + 1;
            var bottomNeighbourId = String(bottomNeighbourRow) + ',' + String(col);
            var neighbour = grid.getNode(bottomNeighbourId);
            if (neighbour.visited || (neighbour.status === 'wall')){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                return neighbour;
            }
        }
    }
    if (bottomNeighbour){
        neighbours.push(bottomNeighbour);
    }

    let leftNeighbour = function(){
        if (col === 0){
            return null;
        }else {
            var leftNeighbourCol = col - 1;
            var leftNeighbourId = String(row) + ',' + String(leftNeighbourCol);
            var neighbour = grid.getNode(leftNeighbourId);
            if (neighbour.visited || (neighbour.status === 'wall')){
                return null;
            } else{
                neighbour.distance = 1 + neighbour.weight;
                neighbour.totalDistance = node.totalDistance + neighbour.distance;
                return neighbour;
            }
        }
    }
    if (leftNeighbour){
        neighbours.push(leftNeighbour);
    }

    return neighbours;
}