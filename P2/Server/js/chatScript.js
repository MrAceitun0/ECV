var server = new AS_Client();

server.connect("localhost:9041", "GLOBAL"/*localStorage.getItem("Room")*/);

server.on_connect = function ()
{
    /*server.user_name = localStorage.getItem("userName");
    console.log(server);*/
    /*var uSide = document.getElementById("sideBar");
    var userPos = document.createElement("div");
    userPos.className = "sideUser";
    var uName = document.createElement("p");
    uName.innerHTML = "Subi";

    userPos.appendChild(uName);
    uSide.appendChild(userPos);*/
    //console.log(server);
};

server.on_ready = function(userID)
{

};

/*
    Room Info
*/
var divUsers;
var nUsers;

server.on_room_info = function (info)
{
    /*Room Name*/
    var roomSpace = document.getElementById("roomName");
    var roomID = document.createElement("h2");
    roomID.innerHTML = server.room.name;
    roomSpace.appendChild(roomID);

    /*Nº Users Connected*/
    divUsers = document.createElement("h3");
    nUsers = info.clients.length;
    divUsers.className = "userList";
    divUsers.innerHTML = nUsers + " users connected";

    var roomName = document.getElementById("roomName");
    roomName.appendChild(divUsers);

    /*Users (Name) Connected*/
    var uSide = document.getElementById("sideBar");
    var userPos = document.createElement("div");
    userPos.className = "sideUser";
    var uName = document.createElement("p");
    uName.innerHTML = server.user_name;

    userPos.appendChild(uName);
    uSide.appendChild(userPos);
};

server.on_user_connected = function(userID)
{
    /*Nº Users Connected*/
    nUsers++;
    divUsers.innerHTML = nUsers + " users connected";
}

server.on_user_disconnected = function(userID)
{
    /*Nº Users Connected*/
    nUsers--;
    divUsers.innerHTML = nUsers + " users connected";
}

/*
    Messages
*/
server.on_message = function (userID, msg)
{
    recieveMessage(0, msg);
}

var input = document.querySelector("textarea");
var sendButton = document.getElementById("sendButton");
var messages_container = document.getElementById("msgbox");

function sendMessage()
{
    var division = document.createElement("div");
    division.className = "chat-message self";


    var author = document.createElement("h4");
    author.innerHTML = "Subi";

    var message = document.createElement("p");
    message.innerHTML = input.value;

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);


    server.sendMessage({type: "msg", msg: input.value, userName: author.innerHTML});

    input.value = "";

    messages_container.scrollTop = messages_container.scrollHeight;
}

function sendEmoji(emoji)
{
    var emojiList = ["&#x1F602;","&#x1F60D;","&#x1F621;","&#x1F622;","&#x1F639;","&#x1F64B;","&#x1F44C;","&#x1F483;"];
    var division = document.createElement("div");
    division.className = "chat-message self";
    var author = document.createElement("h4");
    author.innerHTML = "Subi";
    var message = document.createElement("p");
    message.innerHTML = emojiList[emoji];

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    server.sendMessage({type: "msg", msg: emojiList[emoji], userName: author.innerHTML});

    messages_container.scrollTop = messages_container.scrollHeight;
}

function recieveMessage(author_id, text)
{
    var division = document.createElement("div");

    division.className = "chat-message friend";

    var author = document.createElement("h4");
    author.innerHTML = JSON.parse(text).userName;

    var message = document.createElement("p");
    message.innerHTML = JSON.parse(text).msg;

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    messages_container.scrollTop = messages_container.scrollHeight;
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