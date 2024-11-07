//  Global Variables

// Typography
let fontSans; // Helvetica
let lontScript // Aston Script
const txtKondo = 'Marie Kondō';
const txtKawaii = 'Kawaii Core';
let fontSize = 240;

// Load Images (trinkets)
// let trinketImg

let trinketImg = [];
let filenames = ["img1.png", "img2.png", "img3.png", "img4.png", "img5.png", "img6.png", "img7.png", "img8.png", "img9.png", "img10.png", "img11.png", "img12.png", "img13.png", "img14.png", "img15.png", "img16.png", "img17.png"]; 

// Colors as an alternative
let colors = ["pink", "orange", "red", "yellow", "green"];


// Controls
let toggleGraphics = false;
let toggleGrid;
let gridColumns = 100;
let thresholdFontDetection = 50;
let jitter = 0; // add random jitter between 0 – 50px


// Arrays that save Coordinate and Image Data
let pointsImg = [];
// [0]xPosition [1]yPosition [2]xHeight [3]yHeight [4]Image [5]xJitter [6]yJitter

let points = [];
// For Colored Squares

let gridRows, cellWidth;
let pg1, pg2; // Additional Canvases as 'Heatmaps'




// Preload all relevant files
function preload() {

	// Load Fonts
	fontSans = loadFont('assets/helvetica.ttf');
	fontScript = loadFont('assets/aston.ttf');

	//Load all Images into an array
	for (let i = 0; i < filenames.length; i++) {
	    let img = loadImage(`/assets/img/${filenames[i]}`);
	    trinketImg.push(img);
	  }
}

// setup canvas
function setup() {

	// Load all Sliders
	
	// Select all input elements
    let inputToggle = select("#toggle");
	let inputGridToggle = select('#openNav');
    let inputColums = select("#columns");
	let inputJitter = select("#jitter");

    // Initialize Controls –– THIS OVERWRITES THE CONTROLS SECTION!
    toggleGraphics = inputToggle.checked();
	toggleGrid = inputGridToggle.checked();
    gridColumns = inputColums.value();
	jitter = inputJitter.value();

	// Eventlistener for updating controls
	inputToggle.input(() => toggleGraphics = inputToggle.checked());
	inputGridToggle.input(() => toggleGrid = inputGridToggle.checked());
	inputColums.input(() => gridColumns = inputColums.value());
	inputJitter.input(() => jitter = inputJitter.value());


    // create Canvas
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

    // Draw static typography for pg1 -> clean type
    pg1.background(255);

    // Redraw the typography with the final Design
    pg1.textFont(fontSans, fontSize);
    pg1.textLeading(fontSize * 0.8);
    pg1.text(txtKondo + '\n' + txtKawaii, 30, windowHeight - fontSize, width, height);

    // generate Trinket Map (pg2) of Lettering (pixelated)
    pg2.background(255);
    pg2.noStroke();
	
	drawTrinkets(); // Draw the first n Trinkets over the font
}



function draw() {
	background(255);


	// Update Grid on Draw
	cellWidth = width / gridColumns;
	gridRows = ceil(height / cellWidth);

 	// Redraw the typography with the final Design
	textFont(fontSans, fontSize);
	textLeading(fontSize * 0.8);
	fill(0);
	strokeWeight(0);
	text(txtKondo + '\n' + txtKawaii, 30, windowHeight - fontSize, width, height);

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
	line(170,37,1490,37);

	// Draw Colored Squares 
	// for (let i = 0; i < points.length; i++) {
	// 	// Draw Square with color and position
	// 	fill(points[i][4]); 
	// 	rect(points[i][0], points[i][1], points[i][2], points[i][3]);
	// }

	// Draw images
	for (let i = 0; i < pointsImg.length; i++) {
		// if toggleGraphics == false  
		image(pointsImg[i][4], pointsImg[i][0] + pointsImg[i][5] , pointsImg[i][1] - pointsImg[i][6], pointsImg[i][2], pointsImg[i][3])

		// if toggleGraphics == true  
		// write new line for svg 
	}

	findNewTrinketArea();

	// Development View
	if(toggleGrid == true){
		drawGrid(); // Draw grid for Debug (optional)// 
		// Generate Preview of pg1 & pg2
		image(pg1, 0, 200, 100, 100);
		image(pg2, 100, 200, 100, 100);
	}

	
}


// Functions / Helpers

// Draws Optional Helper Grid
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
  
// Detect the average grightness inside a cell. Used for checking pg1 to detect where the letters are.
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



// Draw the first round of Trinkets
function drawTrinkets() {
	for (let x = 0; x < gridColumns; x++) {
		for (let y = 0; y < gridRows; y++) {
			let col = getAverageBrightness(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
			if (col < thresholdFontDetection) {
				drawNewShape(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
				drawNewImg(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
				console.log(col, thresholdFontDetection);
			}
		}
	}
}


// Make Point Data for Sqares and push to points array
function drawNewShape(x, y, w, h) {
  let col = random(colors);
  points.push([x, y, w, h,col]);
  pg2.fill(0);
  pg2.rect(x, y, w, h);
}

// Make Point Data for Images and push to points array
function drawNewImg(x, y, w, h) {
	let img = random(trinketImg);
	pointsImg.push([x, y, w, h, img, random(jitter), random(jitter)]);
	// console.log(pointsImg);
  }

// Find a location for a trinket
function findNewTrinketArea() {

  	// Random position
	let x = round(int(random(1, gridColumns - 1)) * cellWidth);
	let y = round(int(random(1, gridRows - 1)) * cellWidth);

	// Check if it is not drawn yet
	let col = pg2.get(x + int(cellWidth / 2), y + int(cellWidth / 2));
	if (brightness(col) > 5) {
		// If it is close to a trinket, put a new trinket
		let isClose = checkNeighbors(x, y);
		if (isClose == true) {
			drawNewShape(x, y, cellWidth, cellWidth);
			drawNewImg(x, y, cellWidth, cellWidth);
    	}
  	} else {console.log('no neighboring trinkes');}
}


// check neighbors
function checkNeighbors(x, y) {
  let isCloseToTrinket = false;
  let neighborThreshold = 5;

	// top 
	if (brightness(pg2.get(x, y - int(cellWidth / 2))) < neighborThreshold) {
		isCloseToTrinket = true;
		console.log('top');
	}

	// top right
	if (brightness(pg2.get(x + int(cellWidth / 2), y - int(cellWidth / 2))) < neighborThreshold) {
		isCloseToTrinket = true;
		console.log('top right');
	}

	// right 
	if (brightness(pg2.get(x + int(cellWidth / 2), y)) < neighborThreshold) {
	isCloseToTrinket = true;
	console.log('right');
	}

	// right bottom
	if (brightness(pg2.get(x + int(cellWidth / 2), y + int(cellWidth / 2))) < neighborThreshold) {
		isCloseToTrinket = true;
		console.log('right bottom');
		}

	// bottom
	if (brightness(pg2.get(x, y + int(cellWidth / 2))) < neighborThreshold) {
	isCloseToTrinket = true;
	console.log('bottom');
	}

	//bottom left
	if (brightness(pg2.get(x - int(cellWidth / 2), y + int(cellWidth / 2))) < neighborThreshold) {
		isCloseToTrinket = true;
		console.log('bottom left');
		}

	// left
	if (brightness(pg2.get(x - int(cellWidth / 2), y)) < neighborThreshold) {
		isCloseToTrinket = true;
		console.log('left');
	}

	return isCloseToTrinket;
}




// function keyPressed() {
//     if(key == 's' || key == 'S'){
//         save('myPoster-' + hour() + "." + minute() + "." + second() + '.png' );
//     }
// }




// function troubleshootCheckbox(){
// 	let inputGridToggle = select('#openNav');
// 	console.log(inputGridToggle.checked(), inputGridToggle.value());
// }



// function getAverageColor(x, y, w, h) {
//   let r = 0,
//     g = 0,
//     b = 0,
//     total = 0;
//   loadPixels();
//   for (let i = x; x < x + w; i++) {
//     for (let j = y; j < y + h; j++) {
//       let index = i + j * width * 4;
//       r += pixels[index];
//       g += pixels[index + 1];
//       b += pixels[index + 2];
//       total++;
//     }
//   }
//   return color(r / total, g / total, b / total);
// }











// First generate Text and postion it
// -> ask if HTML or p5 or svg

// Split up the text in single glyphs for control over spawn points?

// varaible grid resolution

//heatmap -> where is already text or generated images (draw or global)
// grid over the heatmap

// for loop
// check the heatmap if there is anything
// if not generate in this spot
// else ckeck for another spot in the surrounding 3x3 grid and generrate then
// optional translate
// update heatmap

// How to decide on the order of graphics
// random from array
// just go through the array (counting)
// by time
// save on which cycle every element was generated (array?)
// replace with other graphic after n cycles

// Graphic should be as big as the gridsize (does it work in any other way??)

// What happens if Graphics collide at a boundary?
// use different set of graphics(array) for boundarys
// change the color  or other effects
// animate elements?
// erase elements at boundaries

// Generate
