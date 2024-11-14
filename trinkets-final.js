// This is the 'final' p5 code


// ________________
// ✦ Global Variables ✦
// ⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺


// Typography
let fontSans; // Helvetica
let fontScript; // Aston Script
const txtKondo = "Marie Kondō";
const txtKawaii = "Kawaii Core";
const txtDefinition = "the strong desire to be with cute things conflicting with an eqally strong desire for an entirely unclutterd space";
const fontSize = 240;

// Load Images
let trinketImg = [];
let filenamesImg = 16; // update when total amout of img changes -> number of images - 1
let trinketShape = [];

// Controls
const thresholdFontDetection = 40;
const detectionThreshold = 5;

// these get overridden by the value of the html elements
let toggleGraphics = false;
let toggleGrid;
let gridColumns = 100;
let jitterFactor = 0;


// Arrays that save Coordinate and Image Data
let points = [];
let gridRows, cellWidth;
let pg1, pg2;




// __________________________
// ✧ Preload all relevant assets ✧ 
// ⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺

function preload() {
	fontSans = loadFont("assets/helvetica.ttf");
  	fontScript = loadFont("assets/aston.ttf");

  for (let i = 0; i < filenamesImg; i++) {
    	trinketImg.push(loadImage(`assets/img/img` + str(i + 1) + `.png`));
  }

  for (let i = 0; i < filenamesImg; i++) {
    	let shape = loadImage(`assets/shape/img` + str(i + 1) + `.png`);
    	// console.log(`Loading shape image: assets/shape/img` + str(i + 1) + `.png`);
    	trinketShape.push(shape);
  }
}




// __________________________________________
// ✱ ✱ Setup canvas and initialize controls ✱ ✱
// ⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺

function setup() {
  	let inputToggle = select("#toggle");
  	let inputGridToggle = select("#openNav");
  	let inputColumns = select("#columns");
  	let inputJitter = select("#jitter");

  	toggleGraphics = inputToggle.checked();
  	toggleGrid = inputGridToggle.checked();
  	gridColumns = inputColumns.value();
  	jitterFactor = inputJitter.value();

  	inputToggle.input(() => (toggleGraphics = inputToggle.checked()));
  	inputGridToggle.input(() => (toggleGrid = inputGridToggle.checked()));
  	inputColumns.input(() => (gridColumns = inputColumns.value()));
  	inputJitter.input(() => (jitterFactor = inputJitter.value()));

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
  	pg1.text(txtKondo + "\n" + txtKawaii, 30, 800, width, height);

  	// generate Trinket Map (pg2) of Lettering (pixelated)
  	pg2.background(255);
  	pg2.noStroke();

  	drawTrinkets(); // Draw the first Trinkets over the font
}



// __________________________
// ✧ Draw at max fps (60~ish)  ✧ 
// ⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺

function draw() {
  	background(255);

  	// check if trinket is image or shape
  	let currentImages = toggleGraphics ? trinketShape : trinketImg;

  	cellWidth = width / gridColumns;
  	gridRows = ceil(height / cellWidth);

	// Typography
	textFont(fontSans, fontSize);
	textLeading(fontSize * 0.8);
	fill(0);
	strokeWeight(0);
	text(txtKondo + "\n" + txtKawaii, 30, 800, width, height);

	// This also exists as html. We wanted it to be visible on the saved poster, so it's drawn with p5.
	fill(0);
	strokeWeight(0);
	textFont(fontSans, 31);
	textLeading(31 * 0.8);
	text("definition", 30, 44);

	fill(0);
	strokeWeight(0);
	textFont(fontSans, 19);
	textLeading(19 * 1.1);
	text(txtDefinition, windowWidth - 198, 42, 180);

	stroke(0);
	strokeWeight(2);
	line(170, 37, windowWidth - 215, 37);

	// Pouplate with trinkets
	for (let i = 0; i < points.length; i++) {
		let img = currentImages[i % currentImages.length];
		image(img, points[i][0] + points[i][5], points[i][1] + points[i][6], points[i][2], points[i][3]);
		// choose image, xPos + xJitter, yPos - yJitter, width, height
  	}

	findNewTrinketArea();

	// Display the Grid, when menu is active
	if (toggleGrid) {
		drawGrid();
		image(pg1, 0, 200, 100, 100);
		image(pg2, 100, 200, 100, 100);
	}

}


// ___________________											~ btw I am obsessed with this lil mascot. 
// 〠 Functions / Helpers 〠 										~ it used to be the mascot of the japanese post.
// ⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺									https://en.wikipedia.org/wiki/Japanese_postal_mark			
//																									- cxxyyl
													
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
			let col = getAverageBrightness(x * cellWidth, y * cellWidth, cellWidth, cellWidth );
			if (col < thresholdFontDetection) {
				drawNewTrinket(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
			}
		}
	}
}


function drawNewTrinket(x, y, w, h) {
	let img = toggleGraphics ? random(trinketShape) : random(trinketImg);
	if(y < windowHeight - cellWidth){

		let spread = Math.round(cellWidth * 0.75);
		let xJitter = Math.round(random(spread * jitterFactor) * (Math.round() < 0.5 ? -1 : 1));
		let yJitter = Math.round(random(spread * jitterFactor) * (Math.round() < 0.5 ? -1 : 1));

		points.push([x, y, w, h, img, xJitter , yJitter]); // Push points to array
		pg2.fill(0);
		pg2.rect(x, y, w, h); // Add to pg2 mask
		pg2.updatePixels();   // pg2 updates after drawing
	}
}


function findNewTrinketArea() {
	let x = floor(random(1, gridColumns - 1)) * cellWidth;
	let y = floor(random(1, gridRows - 2)) * cellWidth;
	let col = pg2.get(x + cellWidth / 2, y + cellWidth / 2);
	
	if (y < (windowHeight - cellWidth) && x < (windowWidth - cellWidth)) {
		if (brightness(col) > detectionThreshold && checkNeighbors(x, y)) {
			drawNewTrinket(x, y, cellWidth, cellWidth);
		}
	}
}

// Updated checkNeighbors with additional logging
function checkNeighbors(x, y) {
	let neighborPositions = [[0, -1],[1, -1],[1, 0],[1, 1],[0, 1],[-1, 1],[-1, 0],[-1, -1],];

	let isClose = neighborPositions.some(([dx, dy]) => {
		let nx = x + dx * cellWidth;
		let ny = y + dy * cellWidth;
		let col = pg2.get(nx + int(cellWidth / 2), ny + int(cellWidth / 2));
		// console.log(`Checking neighbor at nx: ${nx}, ny: ${ny}, brightness: ${brightness(col)}`);
		return brightness(col) < detectionThreshold;
	});

	// console.log("Is close to other trinket:", isClose);
	return isClose;
}

function getAverageBrightness(x, y, w, h) {
	let totalBrightness = 0;
	let totalPixels = 0;

	for (let i = x; i < x + w; i++) {
		for (let j = y; j < y + h; j++) {
			const col = brightness(pg1.get(i, j)); totalBrightness += col; totalPixels++;
		}
	}
  return int(totalBrightness / totalPixels);
}



// Saving
// function keyPressed() {
//   if (key == "s" || key == "S") {
//     save("myPoster-" + hour() + "." + minute() + "." + second() + ".png");
//   }
// }
