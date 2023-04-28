//Adam Kennedy 2023
//"Put it in a circle" After Effects script
//Free & open source script
//Licensed under GPL-3.0-or-later


// prompt user for Circle size input
var circleSize = prompt("Circle:", "420");

// check if input is valid and convert to number
if (isNaN(circleSize)) {
  alert("Invalid input, please enter a number");
} else {
  circleSize = Number(circleSize);
}

// get selected items in the project panel
var selectedItems = app.project.selection;
var currentFolder = app.project.rootFolder;

// check if any item is selected
if (selectedItems.length > 0) {
  // get the folder containing the first selected item
  for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i) === selectedItems[0].parentFolder) {
      currentFolder = app.project.item(i);
      break;
    }
  }
}

// create ART folder if necessary
var artFolder = null;
for (var i = 1; i <= currentFolder.numItems; i++) {
  if (currentFolder.item(i) instanceof FolderItem && currentFolder.item(i).name === "ART") {
    artFolder = currentFolder.item(i);
    break;
  }
}
if (!artFolder) {
  artFolder = currentFolder.items.addFolder("ART");
}

// loop through selected items
for (var i = 0; i < selectedItems.length; i++) {
  // create new composition
  var comp = app.project.items.addComp("ART__" + selectedItems[i].name + "__circle-" + circleSize + "px", circleSize, circleSize, 1, 10, 30);

  // add selected item to composition
  var layer = comp.layers.add(selectedItems[i]);

  // calculate layer scale to fill composition while keeping aspect ratio
  var layerWidth = layer.source.width;
  var layerHeight = layer.source.height;
  var compWidth = comp.width;
  var compHeight = comp.height;
  var scale = Math.max(compWidth / layerWidth, compHeight / layerHeight);
  layer.property("Scale").setValue([scale*100, scale*100]);

  // add shape layer
  var shapeLayer = comp.layers.addShape();
  var ellipse = shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
  ellipse.property("Size").setValue([circleSize, circleSize]);
  var fill = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  fill.property("Color").setValue([1, 1, 1]);

  // apply track matte to image layer
  layer.trackMatteType = TrackMatteType.ALPHA;
  layer.trackMatteSource = shapeLayer;

  // move composition to ART folder
  comp.parentFolder = artFolder;
}

//Adam Kennedy 2023
//"Put it in a circle" After Effects script
//Free & open source script
//Licensed under GPL-3.0-or-later