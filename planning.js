createGameGrid(sizeOfGrid);
createInitialState(gameGrid, seedDensity);

while(pauseGame!=true){
  advanceAGeneration(gameGrid);
}

ALLOW GRID TO BE SPECIFIED WITHIN REASONABLE LIMITS
ALLOW PAUSING
ALLOW CHANGING INITIAL DENSITY
ALLOW CLICKING INDIVIDUAL CELLS ON/OFF

2||2 survives
>3 dies
3 comes alive
