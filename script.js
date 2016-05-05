'use strict';
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
  document.body.innerHTML += `<div id = "tableDiv"> ${begin} ${middle} ${end} </div>`;
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
  const theHeight = document.getElementById('tableHeight').value;
  const theWidth = document.getElementById('tableWidth').value;

  createTable(theHeight, theWidth, 'gameTable');
}

const gameOfLife = { isPaused: true,

                    initalize: function initalize(speed, height, width, density) {
                      gameOfLife.gameSpeed = speed;
                      gameOfLife.gameHeight = height;
                      gameOfLife.gameWidth = width;
                      gameOfLife.seedDensity = density;
                    },
                    storeGrid: function storeGrid(grid, cells) {
                      gameOfLife.gameGrid = grid;
                      gameOfLife.gameCells = cells;
                    },
                    runSimulation: function runSimulation() {
                      gameOfLife.gameInterval = setInterval(gameOfLife.nextGeneration,
                                                            gameOfLife.gameSpeed);
                    },
                    nextGeneration: function nextGeneration() {
                      gameOfLife.gameGrid = gameOfLife.evaluateLife(gameOfLife.gameGrid);
                    },
                    togglePause: function togglePause() {
                      if (gameOfLife.isPaused === true) {
                        gameOfLife.runSimulation();
                        gameOfLife.isPaused = false;
                      } else {
                        clearInterval(gameOfLife.gameInterval);
                        gameOfLife.isPaused = true;
                      }
                    },
                    evaluateLife: function evaluateLife(grid) { // TODO: Make this work
                      /** takes a 2d array and returns the array having
                       the game of life rules applied*/
                    },
                    randomizeSeed: function randomizeSeed() { // TODO: Make this work
                      for (let i = 0; i < gameOfLife.gameCells.length; i++) {
                        const diceRoll =
                          Math.floor(Math.random() * (gameOfLife.seedDensity ) - 0) + 0;

                        if (diceRoll > gameOfLife.seedDensity / 100) {
                          gameOfLife.setCellAlive(i);
                        }
                      }
                    },
                    setCellAlive: function setCellAlive(cellNumber) {
                      gameOfLife.gameCells[cellNumber].className = 'on';
                    },
};

function initGameBoard() {
  makeTableFromInput();

  const pageTableRows = document.getElementsByTagName('tr');
  const pageTableCells = document.getElementsByTagName('td');
  const pageTableCellsPerRow = pageTableCells.length / pageTableRows.length;
  const simulationSpeed = document.getElementById('simSpeed').value;
  const seedDensity = document.getElementById('seedDensity').value;

  gameOfLife.storeGrid(createGridArray(pageTableCells,
                                        pageTableCellsPerRow,
                                        pageTableRows.length),
                      pageTableCells);

  gameOfLife.initalize(simulationSpeed,
                      pageTableRows,
                      pageTableCellsPerRow,
                      seedDensity);
}

function pauseButtonClick() {
  gameOfLife.togglePause();
}

function resetButtonClick() {
  // Delete the current table from HTML
  const currentGrid = document.getElementById('tableDiv');
  document.body.removeChild(currentGrid);

  // load the board into the object
  initGameBoard();
  // seed the board
  gameOfLife.randomizeSeed();
  // run the simulation
  gameOfLife.runSimulation();
}

// executes when the page loads
function pageLoadedStartGame() {
  document.getElementById('tableHeight').value = '20'; // TODO: I screwed these four lines up
  document.getElementById('tableWidth').value = '20';
  document.getElementById('simSpeed').value = '500';
  document.getElementById('seedDensity').value = '4';

  initGameBoard();
  gameOfLife.randomizeSeed();
  gameOfLife.runSimulation();
}
