//Width and height for our canvas
var canvasWidth = 1300;
var canvasHeight  = 700;

//the with and height of our spritesheet
var spriteWidth = 534; 
var spriteHeight = 799; 

//we are having two rows and 8 cols in the current sprite sheet
var rows = 4; 
var cols = 4; 

//The 0th (first) row is for the right movement
var trackRight = 3; 

//1st (second) row for the left movement (counting the index from 0)
var trackLeft = 2; 
var trackUp = 1;
var trackDown = 0;

//To get the width of a single sprite we divided the width of sprite with the number of cols
//because all the sprites are of equal width and height 
var width = spriteWidth/cols; 

//Same for the height we divided the height with number of rows 
var height = spriteHeight/rows; 

//Each row contains 8 frame and at start we will display the first frame (assuming the index from 0)
var curFrame = 0; 

//The total frame is 8 
var frameCount = 4; 

//x and y coordinates to render the sprite 
var x=550;
var y=250; 

//x and y coordinates of the canvas to get the single frame 
var srcX=0; 
var srcY=0; 

//Speed of the movement 
var speed = 12; 

//Getting the canvas 
var canvas = document.getElementById('canvas');

//setting width and height of the canvas 
canvas.width = canvasWidth;
canvas.height = canvasHeight; 

//Establishing a context to the canvas 
var ctx = canvas.getContext("2d");

//Creating an Image object for our character 
var character = new Image(); 
var eMark = new Image();

//Setting the source to the image file 
character.src = "boy2.png";
eMark.src = "exclamation.png";

ctx.font = "20px Arial";
canvas.fillStyle = "#000";

var destX = 0;
var destY = 0;

var doAnimation = false;

canvas.addEventListener('click', (e) => {
    destX = e.offsetX - width/2;
	destY = e.offsetY - height/2;
	doAnimation = true;
});

var xFinished = false;
var yFinished = false;

function updateFrame(){
	//Updating the frame index 
	curFrame = curFrame % frameCount; 

	//Calculating the x coordinate for spritesheet 
	srcX = curFrame * width; 
	//srcY = curFrame * height; 

	
	//if left is true and the character has not reached the left edge 
	if(x>destX){
		//calculate srcY 
		srcY = trackLeft * height; 
		//decreasing the x coordinate
		x-=speed; 
	}

	//if the right is true and character has not reached right edge 
	else if(x<destX){
		//calculating y coordinate for spritesheet
		srcY = trackRight * height; 
		//increasing the x coordinate 
		x+=speed; 
	}
	
	if(destX > x -15 && destX < x + 15)
		xFinished = true;

	if(xFinished)
	{
		//if left is true and the character has not reached the left edge 
		if(y>destY){
			//calculate srcY 
			srcY = trackUp * height; 
			//decreasing the x coordinate
			y-=speed; 
		}

		//if the right is true and character has not reached right edge 
		else if(y<destY){
			//calculating y coordinate for spritesheet
			srcY = trackDown * height; 
			//increasing the x coordinate 
			y+=speed; 
		}

		if(destY < y + 20 && destY > y - 20)
			yFinished = true;
	}
	
	
	if(xFinished && yFinished)
	{
		doAnimation=false;
		xFinished = false;
		yFinished = false;
	}

	++curFrame;
}

function draw(){
	//Clearing the drawn frame 
	ctx.clearRect(0, 0 ,canvasWidth,canvasHeight);
	ctx.fillText("MrAceituno", x + 15, y + height);
	ctx.drawImage(eMark,srcX,srcY,width,height,x /*+ width/4*/,y/* - height/8*/,width,height);
	if(doAnimation)
		updateFrame();
	else
	{
		srcX = 0;
		srcY = 0;
	}
	//Drawing the image 
	ctx.drawImage(character,srcX,srcY,width,height,x,y,width,height);

}

setInterval(draw,100);