var server = new WebSocket("ws://ecv-etic.upf.edu:9041");

var characters = [];
var skinList = ["img/boy.png","img/boy2.png","img/boy3.png","img/boy4.png"];

//Width and height for our canvas
var canvasWidth = 1300;
var canvasHeight  = 700;

var myName = localStorage.getItem("userName");
var myRoom = localStorage.getItem("Room");
var mySkin = parseInt(localStorage.getItem("Skin"));
var myPositionX = Math.floor(Math.random() * 1100 + 0);
var myPositionY = Math.floor(Math.random() * 500 + 0);

var my = {
    id: 0,
    name: myName,
    room: myRoom,
    skin: skinList[mySkin],
    x: myPositionX,
    y: myPositionY,
    destX: this.x,
    destY: this.y,
    doAnimation: false,
    curFrame: 0,
    frameCount: 4,
    srcX: 0,
    srcY: 0,
    xFinished: false,
    yFinished: false,
    character: null,
    timer: 0
};

my.character = createCharacter(my);

characters.push(my);

/*SPRITE DETAILS*/
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

//The total frame is 8
var frameCount = 4;

//Speed of the movement
var speed = 12;

/*Canvas Details*/
//Getting the canvas
var canvas = document.getElementById('canvas');

//setting width and height of the canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

//Establishing a context to the canvas
var ctx = canvas.getContext("2d");

//Function to create initial image of the users
function createCharacter(o)
{
    //Creating an Image object for our character
    var character = new Image();

    //Setting the source to the image file
    character.src = o.skin;

    return character;
}

server.onopen = function()
{
    server.send(JSON.stringify({type: "info", userName: myName, roomName: myRoom, X: myPositionX, Y: myPositionY, skin: mySkin}));
};

canvas.addEventListener('click', on_Key);
function on_Key(e)
{
    my.destX = e.offsetX - width/2;
    my.destY = e.offsetY - height/2;
    my.doAnimation = true;
    server.send(JSON.stringify({type: "position", userName: my.name, roomName: my.room, X: my.destX, Y: my.destY, skin: my.skin}));
}

function updateFrame(o){
    //Updating the frame index
    o.curFrame = o.curFrame % frameCount;

    //Calculating the x coordinate for spritesheet
    o.srcX = o.curFrame * width;
    //srcY = curFrame * height;

    //Clearing the drawn frame
    //ctx.clearRect(o.x,o.y,width,height);



    //if left is true and the character has not reached the left edge
    if(o.x>o.destX){
        //calculate srcY
        o.srcY = trackLeft * height;
        //decreasing the x coordinate
        o.x-=speed;
    }

    //if the right is true and character has not reached right edge
    else if(o.x<o.destX){
        //calculating y coordinate for spritesheet
        o.srcY = trackRight * height;
        //increasing the x coordinate
        o.x+=speed;
    }

    if(o.destX > o.x -15 && o.destX < o.x + 15)
        o.xFinished = true;

    if(o.xFinished)
    {
        //if left is true and the character has not reached the left edge
        if(o.y>o.destY){
            //calculate srcY
            o.srcY = trackUp * height;
            //decreasing the x coordinate
            o.y-=speed;
        }

        //if the right is true and character has not reached right edge
        else if(o.y<o.destY){
            //calculating y coordinate for spritesheet
            o.srcY = trackDown * height;
            //increasing the x coordinate
            o.y+=speed;
        }

        if(o.destY < o.y + 20 && o.destY > o.y - 20)
            o.yFinished = true;
    }

    if(o.xFinished && o.yFinished)
    {
        o.doAnimation=false;
        o.xFinished = false;
        o.yFinished = false;
    }

    ++o.curFrame;
}

var ex = new Image();
ex.src = ("img/bocadillo.png");

var time = 0;

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i < characters.length; i++)
    {

        if(characters[i] == null)
            continue;
        if(characters[i].doAnimation)
            updateFrame(characters[i]);
        else
        {
            characters[i].srcX = 0;
            characters[i].srcY = 0;

        }
        //Drawing the image
        ctx.drawImage(characters[i].character,characters[i].srcX,characters[i].srcY,width,height,characters[i].x,characters[i].y,width,height);
        ctx.font = ("30px Georgia");
        ctx.fillStyle = "#fff";
        ctx.fillText(characters[i].name, characters[i].x, characters[i].y + 210);
        ctx.fillText(myRoom, 1000, 675);

        if(characters[i].timer > 0)
        {
            ctx.drawImage(ex,characters[i].x - 55,characters[i].y - 80, 250, 150);
            --characters[i].timer;
            time = characters[i].timer;
        }
    }
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
        receivePosition(msgParsed);
    }
    else if(msgParsed.type === "initial_position")
    {
        receiveInitialPosition(msgParsed);
    }
    else
    {
        receiveMessage(msg);
    }
};

function receiveInitialPosition(msg)
{
    var newUser = {
        id: msg.ID,
        name: msg.userName,
        room: msg.roomName,
        skin: skinList[msg.skin],
        x: msg.posX,
        y: msg.posY,
        destX: msg.posX,
        destY: msg.posY,
        doAnimation: false,
        curFrame: 0,
        frameCount: 4,
        srcX: 0,
        srcY: 0,
        xFinished: false,
        yFinished: false,
        character: null,
        timer: 0
    };

    newUser.character = createCharacter(newUser);

    characters.push(newUser);
}


function receivePosition(msg)
{
    var updateUser = {
        id: msg.ID,
        name: msg.userName,
        room: msg.roomName,
        skin: msg.skin,
        x: msg.oldPosX,
        y: msg.oldPosY,
        destX: msg.newPosX,
        destY: msg.newPosY,
        doAnimation: true,
        curFrame: 0,
        frameCount: 4,
        srcX: 0,
        srcY: 0,
        xFinished: false,
        yFinished: false,
        character: null,
        timer: time
    };

    for(var i = 0; i < characters.length; i++)
    {
        if(characters[i].id === updateUser.id)
        {
            if(characters[i].x !== updateUser.x)
            {
                updateUser.x = characters[i].x;
            }
            if(characters[i].y !== updateUser.y)
            {
                updateUser.y = characters[i].y;
            }
        }
    }

    updateUser.character = createCharacter(updateUser);

    for(var i = 0; i < characters.length; i++)
    {
        if(characters[i].id === updateUser.id)
        {
            characters[i] = updateUser;
        }
    }
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
    author.innerHTML = myName;

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

        msg = {type: "private", msg: missatge, userName: author.innerHTML, roomName: myRoom, destID: dest};
        msg = JSON.stringify(msg);
        server.send(msg);
    }
    else if(privado[1] === "#")
    {
        for(var i = 2; i < sep.length; i++)
        {
            dest = dest.concat(sep[i]);
        }

        msg = {type: "private", msg: missatge, userName: author.innerHTML, roomName: myRoom, destID: dest};
        msg = JSON.stringify(msg);
        server.send(msg);
    }
    else    //Normal message
    {
        msg = {type: "msg", msg: input.value, userName: author.innerHTML, roomName: myRoom};
        msg = JSON.stringify(msg);
        server.send(msg);
        my.timer = 30;
        time = 30;
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
    author.innerHTML = myName;
    var message = document.createElement("p");
    message.innerHTML = emojiList[emoji];

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    var msg = {type: "msg", msg: emojiList[emoji], userName: author.innerHTML, roomName: myRoom};
    msg = JSON.stringify(msg);
    server.send(msg);

    messages_container.scrollTop = messages_container.scrollHeight;
    my.timer = 30;
    time = 30;
}

function receiveMessage(text)
{
    var data = text.data;
    data = JSON.parse(data);

    var division = document.createElement("div");

    var message = document.createElement("p");
    var author = document.createElement("h4");

    console.log(data.ID);
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

        for(var i = 0; i < characters.length; i++)
        {
            if(characters[i].id === data.ID)
            {
                characters.splice(i, 1);
            }
        }
    }
    else if(data.type === "private")
    {
        division.className = "chat-message friend";
        author.innerHTML = data.userName + " (whisper)";
        message.innerHTML = data.msg;

        division.appendChild(author);
        division.appendChild(message);
        messages_container.appendChild(division);

        for(var i = 0; i < characters.length; i++)
        {
            if(characters[i].id === data.ID)
            {
                characters[i].timer = 30;
                console.log(characters[i].timer);
            }
        }
    }
    else
    {
        division.className = "chat-message friend";
        author.innerHTML = data.userName;
        message.innerHTML = data.msg;

        division.appendChild(author);
        division.appendChild(message);
        messages_container.appendChild(division);

        for(var i = 0; i < characters.length; i++)
        {
            if(characters[i].id === data.ID)
            {
                console.log("HEYA");
                characters[i].timer = 30;
                console.log(characters[i].timer);
            }
        }
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