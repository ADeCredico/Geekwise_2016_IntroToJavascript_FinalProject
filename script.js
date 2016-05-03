// 'use strict';
// Conway's Game of Life

//  creates the table in html
function createTable(numCols, numRows) {
  const begin = '<table border=1>';
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

//	takes a row and column count and returns an array of arrays
function create2DArray(rows, columns) {
  var f = new Array();

  for (let i = 0; i < rows; i++) {
    f[i] = new Array();

    for (let j = 0; j < columns; j++) {
      f[i][j] = 0;
    }
  }
  return f;
}

/** takes a nodelist of cells, the number of cells per row, and the number of rows
 and returns an array of arrays containing the cells */
function createGridArray(cellsArgument, cellsPerRowArgument, numberOfRows) {
  var cellArray = create2DArray(numberOfRows);
  let xCoord = 0;
  let yCoord = 0;

  for (let i = 0; i < cellsArgument.length; i++) {
    cellArray[xCoord][yCoord] = cellsArgument[i];

    if (cellsPerRowArgument === (yCoord + 1)) {
      xCoord++;
      yCoord = 0;
    }	else {
      yCoord++;
    }
  }

  return cellArray;
}

// clears the interval passed
function killGame(deadInterval) {
    window.clearInterval(deadInterval)
};

// FILL ME WITH ACTUAL CODE
function runGameTick(game) {
  if (gamePaused != true) {
    game.checkCells();
    game.changeCells();
  }
}

// REPLACE WITH USER ENTERED VALUES
createTable(15, 23);

//	store the table elements
const tableRows = document.getElementsByTagName('tr');
const tableCells = document.getElementsByTagName('td');
const tableCellsPerRow = tableCells.length / tableRows.length;

let gameOfLife = new Object();
gameOfLife.gridArray = createGridArray(tableCells, tableCellsPerRow, tableRows.length);

// USE A DENSITY VALUE FROM A WEB FORM TO GENERATE INITIAL SEED
gameOfLife.initGrid();

const programInterval = setInterval(gameOfLife, lifeSpeed);

window.alert('All Done.');
