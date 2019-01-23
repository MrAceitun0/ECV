var server = new SillyClient();
server.connect("ecv-etic.upf.edu:9000", localStorage.getItem("selectedRoom"));

var imageList = ["img/logo.png", "img/logo2.png", "img/logo3.png", "img/nyanCat.jpeg", "img/AlphaPiThetaBratva.png", "img/default.png"];

server.on_connect = function () {
    console.log("Server connected");
    namePos = document.getElementById("sideUser");

    photo = document.createElement("img");
    photo.className = "user-photo";
    photo.src = imageList[localStorage.getItem("userImage")];
    namePos.appendChild(photo);
    
    pName = document.createElement("p");
    pName.innerHTML = localStorage.getItem("userNick");
    namePos.appendChild(pName);

    //<img id="photo" src="img/userOne.jpg" class="user-photo">
    console.log(localStorage.getItem("userImage"));
    //photo.innerHTML = imageList[localStorage.getItem("userImage")];

    roomSpace = document.getElementById("roomName");
    roomID = document.createElement("h2");
    roomID.innerHTML = localStorage.getItem("selectedRoom");
    roomSpace.appendChild(roomID);
};

var userID;
server.on_ready = function (id) {
    console.log(id);
};

var divUsers;
var nUsers;

server.on_room_info = function (info) {
    divUsers = document.createElement("h3");
    nUsers = info.clients.length;
    divUsers.className = "userList";
    divUsers.innerHTML = nUsers + " users connected";

    var roomName = document.getElementById("roomName");
    roomName.appendChild(divUsers);
};


server.on_message = function (author_id, msg) {
     recieveMessage(author_id,msg);
}


server.on_user_connected = function (user_id) {
    var division = document.createElement("div");
    division.className = "chat-message friend";
    var message = document.createElement("p");
    message.innerHTML = "WELCOME " + user_id;

    division.appendChild(message);
    messages_container.appendChild(division);

    input.value = "";
    nUsers++;
    divUsers.innerHTML = nUsers + " users connected";
}

server.on_user_disconnected = function (user_id) {
    nUsers--;
    divUsers.innerHTML = nUsers + " users connected";
}

var input = document.querySelector("textarea");
var sendButton = document.getElementById("sendButton");
var messages_container = document.getElementById("msgbox");

function sendMessage()
{
    var division = document.createElement("div");
    division.className = "chat-message self";
    var author = document.createElement("h4");
    author.innerHTML = localStorage.getItem("userNick");
    var message = document.createElement("p");
    message.innerHTML = input.value;
    
    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    server.sendMessage({ type: "msg", msg: input.value, userName: localStorage.getItem("userNick") });
    input.value = "";
}

function recieveMessage(author_id, text) {
    var division = document.createElement("div");
    division.className = "chat-message friend";
    var author = document.createElement("h4");
    author.innerHTML = JSON.parse(text).userName;
    var message = document.createElement("p");
    message.innerHTML = JSON.parse(text).msg;

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    input.value = "";
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", onKey);
function onKey(e)
{
    if(e.which == 13)
    {
        sendMessage();
    }
}

var generalButton = document.getElementById("generalButton");
var gamingButton = document.getElementById("gamingButton");
var offButton = document.getElementById("offButton");

function connectGeneral()
{
    //divUsers.remove();
    server.connect("ecv-etic.upf.edu:9000", "AO_GENERAL");
}

function connectGaming()
{
    server.connect("ecv-etic.upf.edu:9000", "AO_GAMING");
}

function connectOfftopic()
{
    server.connect("ecv-etic.upf.edu:9000", "AO_OFFTOPIC");
}

generalButton.addEventListener("click", connectGeneral);
gamingButton.addEventListener("click", connectGaming);
offButton.addEventListener("click", connectOfftopic);