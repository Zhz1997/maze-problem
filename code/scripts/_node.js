class Node {
    constructor(coord, preNode, isVisited) {
        this.coord = coord;
        this.preNode = preNode;
        this.isVisited = isVisited;
    }
};

class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift();
    }

    peek() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    isEmpty() {
        return this.items.length == 0;
    }
};

