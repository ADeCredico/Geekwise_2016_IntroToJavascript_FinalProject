const gameOfLife = new Object();
gameOfLife.createGrid = function createGrid() {
  const tableHeight = document.getElementById('tableHeight');
  const tableWidth = document.getElementById('tableWidth');
  createTable(tableHeight, tableWidth);


gameOfLife.checkCells = function checkCells() {};
gameOfLife.changeCells = function changeCells() {};
gameOfLife.gridArray = createGridArray(tableCells, tableCellsPerRow, tableRows.length);
