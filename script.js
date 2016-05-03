// 'use strict';
// Conway's Game of Life

//  append a table of numCols by numRows to document.body.innerHTML
function createTable(numCols, numRows) {
  const begin = '<table border=1 id="gameTable">';
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
function createGridArray(gridCells, cellsPerRowArgument, numberOfRows) {
  const cellArray = create2DArray(numberOfRows);
  let xCoord = 0;
  let yCoord = 0;

  for (let i = 0; i < gridCells.length; i++) {
    cellArray[xCoord][yCoord] = gridCells[i];

    if (cellsPerRowArgument === (yCoord + 1)) {
      xCoord++;
      yCoord = 0;
    }	else {
      yCoord++;
    }
  }

  return cellArray;
}

let tableRows = document.getElementsByTagName('tr');
let tableCells = document.getElementsByTagName('td');
let tableCellsPerRow = tableCells.length / tableRows.length;
let simulationSpeed = document.getElementById('simSpeed').value;
