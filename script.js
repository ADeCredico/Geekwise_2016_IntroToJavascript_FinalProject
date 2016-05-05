// 'use strict';
// Conway's Game of Life

//  append a table of numCols by numRows to document.body.innerHTML with the id tableId
function createTable(numRows, numCols, tableId) {
  const begin = `<table border=1 id="${tableId}">`;
  let middle = '';
  const end = '</table>';

  for (let i = 0; i < numRows; i++) {
    middle += '<tr\'>';

    for (let e = 0; e < numCols; e++) {
      middle += '<td></td>';
    }

    middle += '</tr>';
  }
  document.body.innerHTML += `<div> ${begin} ${middle} ${end} </div>`;
}

// return an array of arrays rows by columns large
function create2DArray(rows, columns) {
  let f = new Array();

  for (let i = 0; i < rows; i++) {
    f[i] = new Array();

    for (let j = 0; j < columns; j++) {
      f[i][j] = 0;
    }
  }
  return f;
}

/** pass a nodelist of cells, number of cells per row, number of rows:
return array of arrays of the cells */
function createGridArray(gridCells, cellsPerRow, numberOfRows) {
  const cellArray = create2DArray(numberOfRows);
  let xCoord = 0;
  let yCoord = 0;

  for (let i = 0; i < gridCells.length; i++) {
    cellArray[xCoord][yCoord] = gridCells[i];

    if (cellsPerRow === (yCoord + 1)) {
      xCoord++;
      yCoord = 0;
    }	else {
      yCoord++;
    }
  }

  return cellArray;
}

function makeTableFromInput() {
  const theHeight = document.getElementById('tableHeight');
  const theWidth = document.getElementById('tableWidth');

  createTable(theHeight, theWidth, 'gameTable');
}

const gameOfLife = { isPaused: true,

                    ititalize: function initalize(speed, size, density, pauseState) {
                      self.gameSpeed = speed;
                      self.gameSize = size;
                      self.seedDensity = density;
                      self.isPaused = pauseState;
                    },
                    runSimulation: function runSimulation() {
                      self.gameInterval = setInterval(self.nextGeneration, self.gameSpeed);
                    },
                    nextGeneration: function nextGeneration() {
                      self.gameGrid = self.evaluateLife(self.gameGrid);
                    },
                    storeGrid: function storeGrid(grid) {
                      self.gameGrid = grid;
                    },
                    togglePause: function togglePause() {
                      if (self.isPaused === true) {
                        self.runSimulation();
                        self.isPaused = false;
                      } else {
                        clearInterval(self.gameInterval);
                        self.isPaused = true;
                      }
                    },
                    evaluateLife: function evaluateLife(grid) {
                      /** takes a 2d array and returns the array having
                       the game of life rules applied*/
                    },
                    randomizeSeed: function randomizeSeed() {
                      // randomly set cells to 'on' using seedDensity
                    },
};

function pauseButtonClick() {
  gameOfLife.togglePause();
}

function resetButtonClick() {
  const currentHeight = document.getElementById('tableHeight');
  const currentWidth = document.getElementById('tableWidth');

  const currentGrid = document.getElementByTagName('table');
  currentGrid.parentNode.removeChild(currentGrid);

  makeTableFromInput();

  let pageTableRows = document.getElementsByTagName('tr');
  let pageTableCells = document.getElementsByTagName('td');
  let pageTableCellsPerRow = pageTableCells.length / pageTableRows.length;
  let simulationSpeed = document.getElementById('simSpeed').value;

  gameOfLife.storeGrid = createGridArray(pageTableCells,
                                        pageTableCellsPerRow,
                                        pageTableRows.length);
  gameOfLife.initalize();
  gameOfLife.randomizeSeed();
  gameOfLife.startSimulation();
}

function startTheGameOfLife() {
  makeTableFromInput();

  let pageTableRows = document.getElementsByTagName('tr');
  let pageTableCells = document.getElementsByTagName('td');
  let pageTableCellsPerRow = pageTableCells.length / pageTableRows.length;
  let simulationSpeed = document.getElementById('simSpeed').value;

  gameOfLife.storeGrid = createGridArray(pageTableCells,
                                        pageTableCellsPerRow,
                                        pageTableRows.length);
  gameOfLife.initalize();
  gameOfLife.randomizeSeed();
  gameOfLife.startSimulation();
}
