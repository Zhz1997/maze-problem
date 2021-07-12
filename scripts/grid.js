const container = document.getElementById("container");

result = [];
isNoPath = false;

function makeRows(rows, cols, data) {
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    for (c = 0; c < (rows * cols); c++) {
        let cell = document.createElement("div");
        // cell.innerText = (c + 1);
        var quotient = Math.floor(c / cols);
        var remainder = c % cols;
        container.appendChild(cell).id = quotient + "," + remainder;
        if (data[c] == 0) {
            container.appendChild(cell).className = "grid-item";
        }
        else if (data[c] == -1) {
            container.appendChild(cell).className = "grid-void";
        }
        else if (data[c] == 1) {
            container.appendChild(cell).className = "grid-path";
        }
    };
};

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function convertArray(table) {
    newArr = [];
    for (var i = 0; i < table.length; i++) {
        newArr = newArr.concat(table[i]);
    }

    return newArr;
}

function cleanUp() {
    removeElementsByClass("grid-item");
    removeElementsByClass("grid-void");
    removeElementsByClass("grid-path");
}

function animatePath(i, point) {
    setTimeout(function () {
        // console.log(point);
        curElement = document.getElementById(String(point[0]) + "," + String(point[1]));
        curElement.classList.add("grid-path");
    }, i * 500)
}

function getResult(table) {
    console.log(table);
    if (table[0][0] == -1 || table[table.length-1][table[0].length-1] == -1) {
        return -1;
    }
    // create 2d object array
    var nodeArray = [];
    for (i = 0; i < table.length; i++) {
        curNodeArray = [];
        for (j = 0; j < table[i].length; j++) {
            curNodeArray.push(new Node(String(i) + "," + String(j), NaN, false));
        }
        nodeArray.push(curNodeArray);
    }

    console.log(nodeArray);

    // bfs - this will generate shortest distance due to https://www.geeksforgeeks.org/shortest-path-in-a-binary-maze/
    // each node has 8 neighbors
    var q = new Queue();
    nodeArray[0][0].isVisited = true;
    q.enqueue(nodeArray[0][0]);
    while (1) {
        if (q.isEmpty()) {
            console.log("q is empty");
            // no solution found
            return -1;
        }

        var newQueue = new Queue();

        while (!q.isEmpty()) {
            var curNode = new Node();
            curNode = q.pop();
            var curCoord = curNode.coord.split(",");
            if (curNode.coord == String(table.length - 1) + "," + String(table[0].length - 1)) {
                // path to dest found
                console.log(nodeArray);
                result = [];
                console.log("result found");
                console.log(curNode);
                while (curNode.coord != "0,0") {
                    var resultCurCoord = curNode.coord.split(",");
                    console.log(curNode.preNode);
                    var resultPreCoord = curNode.preNode.split(",");
                    curResultCord = [Number(resultCurCoord[0]), Number(resultCurCoord[1])];
                    result.push(curResultCord);
                    curNode = nodeArray[Number(resultPreCoord[0])][Number(resultPreCoord[1])];
                }
                result.push([0,0]);
                return result.reverse();
            }

            // check neighbors
            // right [a][b+1]
            newCordx = Number(curCoord[0]);
            newCordy = Number(curCoord[1]) + 1;
            if (newCordy < table[0].length && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
            // left [a][b-1]
            newCordx = Number(curCoord[0]);
            newCordy = Number(curCoord[1]) - 1;
            if (newCordy >= 0 && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
            // down [a+1][b]
            newCordx = Number(curCoord[0]) + 1;
            newCordy = Number(curCoord[1]);
            if (newCordx < table.length && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
            // up [a-1][b]
            newCordx = Number(curCoord[0]) - 1;
            newCordy = Number(curCoord[1]);
            if (newCordx >= 0 && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
            // right down [a+1][b+1]
            newCordx = Number(curCoord[0]) + 1;
            newCordy = Number(curCoord[1]) + 1;
            if (newCordy < table[0].length && newCordx < table.length && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
            // right up [a-1][b+1]
            newCordx = Number(curCoord[0]) - 1;
            newCordy = Number(curCoord[1]) + 1;
            if (newCordy < table[0].length && newCordx >= 0 && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
            // left up [a-1][b-1]
            newCordx = Number(curCoord[0]) - 1;
            newCordy = Number(curCoord[1]) - 1;
            if (newCordy >=0 && newCordx >= 0 && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
            // left down [a+1][b-1]
            newCordx = Number(curCoord[0]) + 1;
            newCordy = Number(curCoord[1]) - 1;
            if (newCordy >=0 && newCordx < table.length && !nodeArray[newCordx][newCordy].isVisited && table[newCordx][newCordy] != -1) {
                nodeArray[newCordx][newCordy].isVisited = true;
                nodeArray[newCordx][newCordy].preNode = curNode.coord;
                newQueue.enqueue(nodeArray[newCordx][newCordy]);
            }
        }
        q = newQueue;
    }

}

function callMakeRows() {
    cleanUp();
    m = document.getElementById('m').value;
    n = document.getElementById('n').value;
    table = zeros([n, m]);
    xarray = document.getElementById('xarray').value.split(",");
    yarray = document.getElementById('yarray').value.split(",");
    for (i = 0; i < xarray.length; i++) {
        if (xarray[i] !== "") {
            table[Number(yarray[i])][Number(xarray[i])] = -1;
        }
    }

    data = convertArray(table);
    makeRows(n, m, data);
    result = getResult(table);
    console.log(result);
    if (result != -1) {
        runAnimation();
        document.getElementById('noPath').style.display = 'none'; //show
        document.getElementById('animationButton').style.display = 'block'; //show
    }
    else {
        document.getElementById('noPath').style.display = 'block'; //show
        document.getElementById('animationButton').style.display = 'none'; //show
        console.log("No Path");
    }
}

function removePath() {
    var elems = document.querySelectorAll(".grid-path");

    [].forEach.call(elems, function (el) {
        el.classList.remove("grid-path");
    });
}

function runAnimation() {
    removePath();
    setTimeout(function () {
        for (i = 0; i < result.length; i++) {
            animatePath(i, result[i])
        }
    }, 500)

}