'use strict';
/* Conway's Game of Life */

/*  append a table of numCols by numRows to document.body.innerHTML with the id tableId */
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
  const newTable = document.createElement('div');
  newTable.id = 'tableDiv';
  newTable.innerHTML = `${begin} ${middle} ${end}`;
  document.body.appendChild(newTable);
}

/* return an array of arrays rows by columns large */
function create2DArray(rows, columns) {
  const f = new Array();

  for (let i = 0; i < rows; i++) {
    f[i] = new Array();

    for (let j = 0; j < columns; j++) {
      f[i][j] = 0;
    }
  }
  return f;
}

/* pass a nodelist of cells, number of cells per row, number of rows:
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

                    initalize: function initalize(speed, height, width, density, grid, cells) {
                      gameOfLife.gameSpeed = speed;
                      gameOfLife.gameHeight = 100;
                      gameOfLife.gameWidth = 100;
                      gameOfLife.seedDensity = density;
                      gameOfLife.gameGrid = grid;
                      gameOfLife.gameCells = cells;
                    },

                    runSimulation: function runSimulation() {
                      gameOfLife.gameInterval = setInterval(gameOfLife.nextGeneration,
                                                            gameOfLife.gameSpeed);
                    },

                    /* wraps the assignment operation for the interval */
                    nextGeneration: function nextGeneration() {
                      gameOfLife.evaluateLife();
                    },

                    evaluateLife: function evaluateLife() { // TODO: Make this work
                      const cellsToChange = { liveCells: [], deadCells: [] };

                      for (let i = 0; i < gameOfLife.gameHeight; i++) {
                        for (let e = 0; e < gameOfLife.gameWidth; e++) {
                          gameOfLife.storeChanges(i, e, cellsToChange);
                        }
                      }

                      gameOfLife.executeChanges(cellsToChange);
                    },

                    storeChanges: function storeChanges(xCoord, yCoord, cellsToChange) {
                      // returns the number of adjacent "on" cells
                      const numberOfAdjacent = gameOfLife.countAdjacent(xCoord, yCoord);

                      if (numberOfAdjacent < 2 || numberOfAdjacent > 3) {
                        cellsToChange.deadCells.push(gameOfLife.gameGrid[xCoord][yCoord]);
                      } else if (numberOfAdjacent === 3) {
                        cellsToChange.liveCells.push(gameOfLife.gameGrid[xCoord][yCoord]);
                      }
                    },

                    countAdjacent: function countAdjacent(xCoord, yCoord) {
                      let adjacentTotal = 0;
                      for (let i = (-1); i <= 1; i++) {
                        for (let e = (-1); e <= 1; e++) {
                          const currentX = xCoord + i;
                          const currentY = yCoord + e;
                          const tooLow = gameOfLife.checkLowerBound(currentX, currentY);
                          const tooHigh = gameOfLife.checkUpperBound(currentX, currentY);

                          if (tooHigh !== true && tooLow !== true) {
                            if (gameOfLife.gameGrid[currentX][currentY].className === 'on') {
                              adjacentTotal++;
                            }
                          }
                        }
                      }
                      // trim one adjacentTotal off if the cell itself is on
                      if (gameOfLife.gameGrid[xCoord][yCoord].className === 'on') {
                        adjacentTotal--;
                      }
                      return adjacentTotal;
                    },

                    checkUpperBound: function checkUpperBound(xCoord, yCoord) {
                      let result = false;
                      if (xCoord >= gameOfLife.gameWidth || yCoord >= gameOfLife.gameHeight) {
                        result = true;
                      }
                      return result;
                    },

                    checkLowerBound: function checkLowerBound(xCoord, yCoord) {
                      let result = false;
                      if (xCoord === (-1) || yCoord === (-1)) {
                        result = true;
                      }

                      return result;
                    },

                    executeChanges: function executeChanges(cellsToChange) {
                      cellsToChange.liveCells.forEach(function (cellToChange) {
                        cellToChange.className = 'on';
                      });
                      cellsToChange.deadCells.forEach(function (cellToChange) {
                        cellToChange.className = 'off';
                      });
                    },

                    /* does some very janky random crap, I should probably fix that, or not */
                    randomizeSeed: function randomizeSeed() {
                      for (let i = 0; i < gameOfLife.gameCells.length; i++) {
                        const diceRoll =
                          Math.floor(Math.random() * (gameOfLife.seedDensity) - 0) + 0;

                        if (diceRoll > gameOfLife.seedDensity / 100) {
                          gameOfLife.gameCells[i].className = 'on';
                        }
                      }
                    },

                    /* kills the interval if running, runSimulation if not */
                    togglePause: function togglePause() {
                      if (gameOfLife.isPaused === true) {
                        gameOfLife.runSimulation();
                        gameOfLife.isPaused = false;
                      } else {
                        clearInterval(gameOfLife.gameInterval);
                        gameOfLife.isPaused = true;
                      }
                    },
};

function initGameBoard() {
  makeTableFromInput();

  const pageTableRows = document.getElementsByTagName('tr');
  const pageTableCells = document.getElementsByTagName('td');
  const pageTableCellsPerRow = (pageTableCells.length / pageTableRows.length);
  const simulationSpeed = document.getElementById('simSpeed').value;
  const seedDensity = document.getElementById('seedDensity').value;

  gameOfLife.initalize(simulationSpeed,
                      pageTableRows,
                      pageTableCellsPerRow,
                      seedDensity,
                      createGridArray(pageTableCells, pageTableCellsPerRow, pageTableRows.length),
                      pageTableCells);
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

/* executes when the page loads */
function pageLoadedStartGame() {
  document.getElementById('tableHeight').value = '20'; // TODO: I screwed these four lines up
  document.getElementById('tableWidth').value = '20';
  document.getElementById('simSpeed').value = '500';
  document.getElementById('seedDensity').value = '4';

  initGameBoard();
  gameOfLife.randomizeSeed();
  gameOfLife.runSimulation();
}
