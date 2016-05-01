"use strict";





function createTable(numCols, numRows){
  var begin = "<table border=1>";
  var middle = "";
  var end = "</table>"

  for (var i = 0; i < numRows; i++){
    middle += "<tr'>";

    for (var e = 0; e < numCols; e++){
      middle += "<td></td>";
    }

    middle += "</tr>";
  }
  document.body.innerHTML += "<div>" + begin + middle + end + "</div>"
}
