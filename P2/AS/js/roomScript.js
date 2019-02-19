var server = new WebSocket("ws://localhost:9041");

var user = localStorage.getItem("userName");
var room = localStorage.getItem("Room");

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
var x = Math.floor((Math.random() * canvasWidth - 150) + 175);
var y = Math.floor((Math.random() * canvasHeight - 200) + 175);

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

//Setting the source to the image file
character.src = "img/boy2.png";

var destX = 0;
var destY = 0;

var doAnimation = false;

server.onopen = function()
{
    ////////////////To Do Skin!!!!!
    server.send(JSON.stringify({type: "info", userName: user, roomName: room, X: x, Y: y, skin: 0}));
};

canvas.addEventListener('click', on_Key);
function on_Key(e)
{
    destX = e.offsetX - width/2;
    destY = e.offsetY - height/2;
    doAnimation = true;
    ////////////////To Do Skin!!!!!
    server.send(JSON.stringify({type: "position", userName: user, roomName: room, X: destX, Y: destY, skin: 0}));
}

var xFinished = false;
var yFinished = false;

function updateFrame(){
    //Updating the frame index
    curFrame = curFrame % frameCount;

    //Calculating the x coordinate for spritesheet
    srcX = curFrame * width;
    //srcY = curFrame * height;

    //Clearing the drawn frame
    ctx.clearRect(x,y,width,height);


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
    if(doAnimation)
        updateFrame();
    else
    {
        srcX = 0;
        srcY = 0;
        ctx.clearRect(x,y,width,height);
    }
    //Drawing the image
    ctx.drawImage(character,srcX,srcY,width,height,x,y,width,height);
}

setInterval(draw,100);

/*
    Messages
*/
server.onmessage = function (msg)
{
    var msgParsed = JSON.parse(msg.data);

    if(msgParsed.type === "position")
    {
        console.log("position");
        console.log(msgParsed);
        receivePosition(msgParsed);
    }
    else if(msgParsed.type === "initial_position")
    {
        console.log("initial_position");
        console.log(msgParsed);
        receiveInitialPosition(msgParsed);
    }
    else
    {
        receiveMessage(msg);
    }
};

function receiveInitialPosition(msg)
{
    //x = msg.posX;
    //y = msg.posY;
    //NOMSKIN = msg.skin;

    //draw();
}

function receivePosition(msg)
{
    //x = msg.oldPosX;
    //y = msg.oldPosY;
    //NOMSKIN = msg.skin;

    //draw();

    //destX = msg.newPosX;
    //destY = msg.newPosY;

    //updateFrame();
}

var input = document.querySelector("textarea");
var sendButton = document.getElementById("sendButton");
var messages_container = document.getElementById("msgbox");

function sendMessage()
{
    var msg = {};

    var division = document.createElement("div");
    division.className = "chat-message self";

    var author = document.createElement("h4");
    author.innerHTML = user;

    var message = document.createElement("p");
    message.innerHTML = input.value;

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    var str = input.value;
    var privado = str.split("");
    var priv = str.split(" ");
    var sep = priv[0].split("");
    var dest = "";
    var missatge = "";

    //For private message
    for(var i = 1; i < priv.length; i++)
    {
        missatge = missatge.concat(' ', priv[i]);
    }

    if(privado[0] === "#")
    {
        for(var i = 1; i < sep.length; i++)
        {
            dest = dest.concat(sep[i]);
        }

        msg = {type: "private", msg: missatge, userName: author.innerHTML, roomName: room, destID: dest};
        msg = JSON.stringify(msg);
        server.send(msg);
    }
    else if(privado[1] === "#")
    {
        for(var i = 2; i < sep.length; i++)
        {
            dest = dest.concat(sep[i]);
        }

        msg = {type: "private", msg: missatge, userName: author.innerHTML, roomName: room, destID: dest};
        msg = JSON.stringify(msg);
        server.send(msg);
    }
    else    //Normal message
    {
        msg = {type: "msg", msg: input.value, userName: author.innerHTML, roomName: room};
        msg = JSON.stringify(msg);
        server.send(msg);
    }

    input.value = "";

    messages_container.scrollTop = messages_container.scrollHeight;
}

function sendEmoji(emoji)
{
    var emojiList = ["&#x1F602;", "&#x1F60D;", "&#x1F621;", "&#x1F622;", "&#x1F44C;"];

    var division = document.createElement("div");
    division.className = "chat-message self";
    var author = document.createElement("h4");
    author.innerHTML = user;
    var message = document.createElement("p");
    message.innerHTML = emojiList[emoji];

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    var msg = {type: "msg", msg: emojiList[emoji], userName: author.innerHTML, roomName: room};
    msg = JSON.stringify(msg);
    server.send(msg);

    messages_container.scrollTop = messages_container.scrollHeight;
}

function receiveMessage(text)
{
    var data = text.data;
    data = JSON.parse(data);

    var division = document.createElement("div");

    var message = document.createElement("p");
    var author = document.createElement("h4");

    if(data.type === "new_user")
    {
        division.className = "chat-message new";
        message.innerHTML = data.userName + " has connected";

        division.appendChild(message);
        messages_container.appendChild(division);
    }
    else if(data.type === "user_disconnected")
    {
        division.className = "chat-message new";
        message.innerHTML = data.userName + " has disconnected";

        division.appendChild(message);
        messages_container.appendChild(division);
    }
    else if(data.type === "private")
    {
        division.className = "chat-message friend";
        console.log("Holiu");
        author.innerHTML = data.userName + " (whisper)";
        message.innerHTML = data.msg;

        division.appendChild(author);
        division.appendChild(message);
        messages_container.appendChild(division);
    }
    else
    {
        division.className = "chat-message friend";
        author.innerHTML = data.userName;
        message.innerHTML = data.msg;

        division.appendChild(author);
        division.appendChild(message);
        messages_container.appendChild(division);
    }

    messages_container.scrollTop = messages_container.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", onKey);
function onKey(e)
{
    if(e.which === 13)
    {
        sendMessage();
    }
}