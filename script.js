let font


function preload(){
    font = loadFont("assets/helvetica.otf")
    // Load all the different image files as an array
}

function setup(){
    createCanvas (windowWidth, windowHeight)
    textFont(font, 100);
}

function draw() {
    background(0)
    fill(255)
    noStroke()
    text("Marie Kondo Kawaiicore", windowWidth/10, windowHeight/2)
}

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




