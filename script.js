var server = new SillyClient();
server.connect("ecv-etic.upf.edu:9000", "AFRO_GLOBAL");

server.on_connect = function () {
    console.log("Server connected");
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
var user = document.getElementById("userName");

function sendMessage()
{
    var division = document.createElement("div");
    division.className = "chat-message self";
    var author = document.createElement("h4");
    author.innerHTML = user.innerHTML;
    var message = document.createElement("p");
    message.innerHTML = input.value;
    
    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    server.sendMessage({ type: "msg", msg: input.value });
    input.value = "";
}

function recieveMessage(author_id, text) {
    var division = document.createElement("div");
    division.className = "chat-message friend";
    var author = document.createElement("h4");
    author.innerHTML = author_id;
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
    server.connect("ecv-etic.upf.edu:9000", "AFRO_GENERAL");
}

function connectGaming()
{
    server.connect("ecv-etic.upf.edu:9000", "AFRO_GAMING");
}

function connectOfftopic()
{
    server.connect("ecv-etic.upf.edu:9000", "AFRO_OFFTOPIC");
}

generalButton.addEventListener("click", connectGeneral);
gamingButton.addEventListener("click", connectGaming);
offButton.addEventListener("click", connectOfftopic);