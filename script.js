/* Conway's Game of Life */

// writes some default values to the <input>
function setDefaults() {
  document.getElementById('tableHeight').value = '30';
  document.getElementById('tableWidth').value = '30';
  document.getElementById('simSpeed').value = '500';
  document.getElementById('seedDensity').value = '50';
}

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
  const newTable = document.createElement('div');
  newTable.id = 'tableDiv';
  newTable.innerHTML = `${begin} ${middle} ${end}`;
  document.body.appendChild(newTable);
}

// return an array of arrays rows by columns large
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

// pass a nodelist of cells, number of cells per row, number of rows:
// return array of arrays of the cells
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

// creates the <table> using the <input>
function makeTableFromInput() {
  const theHeight = document.getElementById('tableHeight').value;
  const theWidth = document.getElementById('tableWidth').value;

  if (theHeight > 0 && theWidth > 0) {
    createTable(theHeight, theWidth, 'gameTable');
  } else {
    alert('bad table creation parameters')
  }
}

// makes the <table> clicky
function setClickEvents(cellList) {
  for (let i = 0; i < cellList.length; i++) {
    cellList[i].addEventListener('click', function cellClassToggle() {
      if (this.className === 'off') {
        this.className = 'on';
      } else {
        this.className = 'off';
      }
    });
  }
}


const gameOfLife = { isPaused: false,

                    // stores the state of the game board and the <input> options
                    initalize: function initalize(speed, height, width, density, grid, cells) {
                      gameOfLife.gameSpeed = speed;
                      gameOfLife.gameHeight = height;
                      gameOfLife.gameWidth = width;
                      gameOfLife.seedDensity = density;
                      gameOfLife.gameGrid = grid;
                      gameOfLife.gameCells = cells;
                    },

                    // creates the interval loop
                    runSimulation: function runSimulation() {
                      if (gameOfLife.isPaused === false) {
                        gameOfLife.gameInterval = setInterval(gameOfLife.nextGeneration,
                                                            gameOfLife.gameSpeed);
                      }
                    },

                    // wraps the assignment operation for the interval
                    nextGeneration: function nextGeneration() {
                      gameOfLife.evaluateLife();
                    },

                    // checks the cells, stores the chages, executes the changes to the <table>
                    evaluateLife: function evaluateLife() {
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

                    // checks from x-1/y-1 to x+1/y+1, returns total adjacent 'on'
                    countAdjacent: function countAdjacent(xCoord, yCoord) {
                      let adjacentTotal = 0;
                      for (let i = (-1); i <= 1; i++) {
                        for (let e = (-1); e <= 1; e++) {
                          const currentX = xCoord + i;
                          const currentY = yCoord + e;
                          const tooLow = gameOfLife.checkLowerBound(currentX, currentY);
                          const tooHigh = gameOfLife.checkUpperBound(currentX, currentY);

                          if (!tooHigh && !tooLow) {
                            if (gameOfLife.gameGrid[currentX][currentY].className === 'on') {
                              adjacentTotal++;
                            }
                          }
                        }
                      }
                      // trim one off of adjacentTotal if the targeted cell itself is on
                      if (gameOfLife.gameGrid[xCoord][yCoord].className === 'on') {
                        adjacentTotal--;
                      }
                      return adjacentTotal;
                    },

                    // returns true if x or y are < 0
                    checkLowerBound: function checkLowerBound(xCoord, yCoord) {
                      let result = false;
                      if (xCoord === (-1) || yCoord === (-1)) {
                        result = true;
                      }

                      return result;
                    },

                    // returns true if x or y are > the height or length of the board
                    checkUpperBound: function checkUpperBound(xCoord, yCoord) {
                      let result = false;
                      if (xCoord >= gameOfLife.gameHeight || yCoord >= gameOfLife.gameWidth) {
                        result = true;
                      }
                      return result;
                    },

                    // changes the executes the passed cells on/off
                    executeChanges: function executeChanges(cellsToChange) {
                      cellsToChange.liveCells.forEach(cellToChange => {
                        cellToChange.className = 'on';
                      });
                      cellsToChange.deadCells.forEach(cellToChange => {
                        cellToChange.className = 'off';
                      });
                    },

                    // randomizes the cells and writes the changes to the <table>
                    randomizeSeed: function randomizeSeed() {
                      for (let i = 0; i < gameOfLife.gameCells.length; i++) {
                        const diceRoll = Math.floor(Math.random() * 100 - 0) + 0;

                        if (diceRoll < gameOfLife.seedDensity) {
                          gameOfLife.gameCells[i].className = 'on';
                        }
                      }
                    },

                    // kills the interval if already running, runSimulation if not
                    togglePause: function togglePause() {
                      if (gameOfLife.isPaused === true) {
                        gameOfLife.isPaused = false;
                        gameOfLife.runSimulation();
                      } else {
                        clearInterval(gameOfLife.gameInterval);
                        gameOfLife.isPaused = true;
                      }
                    },
};

function initGameBoard() {
  // checkInputLimits(); TODO Make this check input sanity
  makeTableFromInput();

  const simulationSpeed = document.getElementById('simSpeed').value;
  const pageTableRows = document.getElementsByTagName('tr');
  const pageTableCells = document.getElementsByTagName('td');
  const pageTableCellsPerRow = (pageTableCells.length / pageTableRows.length);
  const seedDensity = document.getElementById('seedDensity').value;

  setClickEvents(pageTableCells);

  if (seedDensity < 0) alert('positive densities only');
  if (simulationSpeed < 0) alert('positive speeds only');

  gameOfLife.initalize(simulationSpeed,
                      pageTableRows.length,
                      pageTableCellsPerRow,
                      seedDensity,
                      createGridArray(pageTableCells, pageTableCellsPerRow, pageTableRows.length),
                      pageTableCells);
}

function pauseButtonClick() {
  gameOfLife.togglePause();
}

function resetButtonClick() {
  clearInterval(gameOfLife.gameInterval);
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

// Toggle pause on space key
const spaceKey = 32;
document.addEventListener('keydown', function() {
  if (event.keyCode === spaceKey) {
    gameOfLife.togglePause();
  }
});

// executes when the page loads
function pageLoadedStartGame() {
  setDefaults();
  initGameBoard();
  gameOfLife.randomizeSeed();
  gameOfLife.runSimulation();
}

// TODO Fix bug that spawns an extra interval when density is set to 0
