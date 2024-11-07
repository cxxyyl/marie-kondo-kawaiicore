// Global Variables

// Typography
let fontSans; // Helvetica
let fontScript; // Aston Script
const txtKondo = "Marie Kondō";
const txtKawaii = "Kawaii Core";
let fontSize = 240;

// Load Images
let trinketImg = [];
let filenamesImg = [
  "img1.png",
  "img2.png",
  "img3.png",
  "img4.png",
  "img5.png",
  "img6.png",
  "img7.png",
  "img8.png",
  "img9.png",
  "img10.png",
  "img11.png",
  "img12.png",
  "img13.png",
  "img14.png",
  "img15.png",
  "img16.png",
  "img17.png",
];

let trinketShape = [];
let filenamesShape = [
  "img1.png",
  "img2.png",
  "img3.png",
  "img4.png",
  "img5.png",
  "img6.png",
  "img7.png",
  "img8.png",
  "img9.png",
  "img10.png",
  "img11.png",
  "img12.png",
  "img13.png",
  "img14.png",
  "img15.png",
  "img16.png",
  "img17.png",
];

// Controls
let toggleGraphics = false;
let toggleGrid;
let gridColumns = 100;
let thresholdFontDetection = 50;
let jitter = 0;

// Arrays that save Coordinate and Image Data
let points = [];
let gridRows, cellWidth;
let pg1, pg2;

// Preload assets
function preload() {
  fontSans = loadFont("assets/helvetica.ttf");
  fontScript = loadFont("assets/aston.ttf");

  for (let i = 0; i < filenamesImg.length; i++) {
    trinketImg.push(loadImage(`assets/img/${filenamesImg[i]}`));
  }

  for (let i = 0; i < filenamesShape.length; i++) {
    let shape = loadImage(`assets/shape/${filenamesShape[i]}`);
    console.log(`Loading shape image: assets/shape/${filenamesShape[i]}`);
    trinketShape.push(shape);
  }
}

// Setup canvas and initialize controls
function setup() {
  let inputToggle = select("#toggle");
  let inputGridToggle = select("#openNav");
  let inputColumns = select("#columns");
  let inputJitter = select("#jitter");

  toggleGraphics = inputToggle.checked();
  toggleGrid = inputGridToggle.checked();
  gridColumns = inputColumns.value();
  jitter = inputJitter.value();

  inputToggle.input(() => (toggleGraphics = inputToggle.checked()));
  inputGridToggle.input(() => (toggleGrid = inputGridToggle.checked()));
  inputColumns.input(() => (gridColumns = inputColumns.value()));
  inputJitter.input(() => (jitter = inputJitter.value()));

  createCanvas(windowWidth, windowHeight);

  //Typography  Change when final graphics 
    textFont(fontSans, fontSize);
    textLeading(fontSize * 0.8);
    
	// Define Grid
	cellWidth = width / gridColumns;
	gridRows = ceil(height / cellWidth);


  // Draw 'Heatmaps' pg1 & pg2
  noStroke();
  pg1 = createGraphics(width, height);
  pg2 = createGraphics(width, height);


	pg1.background(255);

  // Draw static typography for pg1 -> clean type
  pg1.textFont(fontSans, fontSize);
  pg1.textLeading(fontSize * 0.8);
  pg1.text(txtKondo + '\n' + txtKawaii, 30, 800, width, height);

  // generate Trinket Map (pg2) of Lettering (pixelated)
  pg2.background(255);
  pg2.noStroke();
	

	drawTrinkets(); // Draw the first Trinkets over the font
}

// Main draw function
function draw() {
  background(255);


  let currentImages = toggleGraphics ? trinketShape : trinketImg;

  cellWidth = width / gridColumns;
  gridRows = ceil(height / cellWidth);

  // Redraw the typography with the final Design
	textFont(fontSans, fontSize);
	textLeading(fontSize * 0.8);
	fill(0);
	strokeWeight(0);
	text(txtKondo + '\n' + txtKawaii, 30, 800, width, height);

	fill(0);
	strokeWeight(0);
	textFont(fontSans, 31);
    textLeading(31 * 0.8);
	text('definition', 30, 44);

	fill(0);
	strokeWeight(0);
	textFont(fontSans, 19);
	textLeading(19 * 1.1);
	text('the strong desire to be with cute things conflicting with an eqally strong desire for an entierly unclutterd space', windowWidth - 198, 42, 180)

	stroke(0);
	strokeWeight(2);
	line(170,37,windowWidth - 215,37);



  for (let i = 0; i < points.length; i++) {
    let img = currentImages[i % currentImages.length];
    image(
      img,
      points[i][0] + points[i][5],
      points[i][1] - points[i][6],
      points[i][2],
      points[i][3]
    );
  }

  findNewTrinketArea();

  if (toggleGrid) {
    drawGrid();
    image(pg1, 0, 200, 100, 100);
    image(pg2, 100, 200, 100, 100);
  }
}

// Functions / Helpers
function drawGrid() {
  stroke(125);
  for (let x = 0; x < gridColumns; x++) {
    line(x * cellWidth, 0, x * cellWidth, height);
  }
  for (let y = 0; y < gridRows; y++) {
    line(0, y * cellWidth, width, y * cellWidth);
  }
  noStroke();
}

function drawTrinkets() {
  for (let x = 0; x < gridColumns; x++) {
    for (let y = 0; y < gridRows; y++) {
      let col = getAverageBrightness(
        x * cellWidth,
        y * cellWidth,
        cellWidth,
        cellWidth
      );
      if (col < thresholdFontDetection) {
        drawNewTrinket(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
      }
    }
  }
}

// Modified drawNewTrinket to ensure it updates points array and pg2 canvas correctly
function drawNewTrinket(x, y, w, h) {
  let img = toggleGraphics ? random(trinketShape) : random(trinketImg);
  points.push([x, y, w, h, img, random(jitter), random(jitter)]);
  pg2.fill(0);
  pg2.rect(x, y, w, h);
  pg2.updatePixels(); // Ensure pg2 updates after drawing
}

// Updated findNewTrinketArea with additional logging for debugging
function findNewTrinketArea() {
  let x = floor(random(1, gridColumns - 1)) * cellWidth;
  let y = floor(random(1, gridRows - 1)) * cellWidth;
  let col = pg2.get(x + cellWidth / 2, y + cellWidth / 2);
  console.log(
    `Checking position x: ${x}, y: ${y}, brightness: ${brightness(col)}`
  );

  if (brightness(col) > 5 && checkNeighbors(x, y)) {
    console.log("Drawing new trinket at:", x, y);
    drawNewTrinket(x, y, cellWidth, cellWidth);
  }
}

// Updated checkNeighbors with additional logging
function checkNeighbors(x, y) {
  let neighborThreshold = 5;
  let neighborPositions = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  let isClose = neighborPositions.some(([dx, dy]) => {
    let nx = x + dx * cellWidth;
    let ny = y + dy * cellWidth;
    let col = pg2.get(nx + cellWidth / 2, ny + cellWidth / 2);
    console.log(
      `Checking neighbor at nx: ${nx}, ny: ${ny}, brightness: ${brightness(
        col
      )}`
    );
    return brightness(col) < neighborThreshold;
  });

  console.log("Is close to other trinket:", isClose);
  return isClose;
}

function getAverageBrightness(x, y, w, h) {
  let totalBrightness = 0;
  let totalPixels = 0;
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      const col = brightness(pg1.get(i, j));
      totalBrightness += col;
      totalPixels++;
    }
  }
  return int(totalBrightness / totalPixels);
}



function keyPressed() {
    if(key == 's' || key == 'S'){
        save('myPoster-' + hour() + "." + minute() + "." + second() + '.png' );
    }
}

