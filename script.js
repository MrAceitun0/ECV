var imageList = ["img/logo2.png", "img/pac.jpg", "img/cena.png", "img/nyanCat.jpeg", "img/AlphaPiThetaBratva.png", "img/default.png"];
var roomListConnections = ["AO_General","AO_Gaming","AO_Offtopic"];
var roomList = ["General Room","Gaming Room", "Offtopic Room"];

//Connect to the server in the desired room
var server = new SillyClient();
server.connect("ecv-etic.upf.edu:9000", roomListConnections[localStorage.getItem("selectedRoom")]);

//Whenever the user is connected, the name, the image and the selected room are shown on screen
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

    roomSpace = document.getElementById("roomName");
    roomID = document.createElement("h2");
    roomID.innerHTML = roomList[localStorage.getItem("selectedRoom")];
    roomSpace.appendChild(roomID);

    //All users connected (not myself) will recieve a message telling that a new user has been connected
    server.sendMessage({type: "Welcome", msg: localStorage.getItem("userNick") + " has connected", userName: null});
};


var userID;
server.on_ready = function (id) {
    userID = id;
    console.log(id);
};

var divUsers;
var nUsers;

//Information about how many users are connected in the chat room is shown
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

    division.appendChild(message);
    //Modify the number of users connected
    nUsers++;
    divUsers.innerHTML = nUsers + " users connected";

    //If a new user is connected and yourself are the oldest member of the chat room, you will send all existing messages to the new member
    if(userID == Object.keys(server.clients)[0])
    {
        for(var i = 0; i < messagesList.length; i++)
        {
            server.sendMessage(messagesList[i], user_id);       
        }
    }

    messages_container.scrollTop = messages_container.scrollHeight;  
}

server.on_user_disconnected = function (user_id) {
    //Modify the number of users connected
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

    var str = input.value;
    var privado = str.split("");
    var priv = str.split(" ");
    var sep = priv[0].split("");
    var dest = "";
    var missatge = "";

    //Send a private message
    for(var i = 1; i < priv.length; i++)
    {
        missatge = missatge.concat(' ', priv[i]);
    }

    if(privado[0] == "#")
    {
        console.log(sep.length);

        for(var i = 1; i < sep.length; i++)
        {
            dest = dest.concat(sep[i]);
        }

        server.sendMessage({ type: "whisper", msg: missatge, userName: localStorage.getItem("userNick") + " #" + userID+" (whisper)" }, dest);
    }
    else if(privado[1] == "#")
    {
        console.log(priv.length);

        for(var i = 2; i < sep.length; i++)
        {
            dest = dest.concat(sep[i]);
        }

        server.sendMessage({ type: "whisper", msg: missatge, userName: localStorage.getItem("userNick") + " #" + userID +" (whisper)"}, dest);
    }
    //Send message to the whole room
    else
    {
        server.sendMessage({ type: "msg", msg: input.value, userName: localStorage.getItem("userNick") + " #" + userID });

        getMessages("msg", input.value, localStorage.getItem("userNick"));
    }

    input.value = "";

    messages_container.scrollTop = messages_container.scrollHeight;    
}

function recieveMessage(author_id, text) {
    var division = document.createElement("div");
    if(JSON.parse(text).type == "Welcome")
    {
        division.className = "chat-message server";
    }
    else
    {
        division.className = "chat-message friend";
    }

    var author = document.createElement("h4");
    author.innerHTML = JSON.parse(text).userName;
    var message = document.createElement("p");
    message.innerHTML = JSON.parse(text).msg;

    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);
    
    messages_container.scrollTop = messages_container.scrollHeight;

    if(JSON.parse(text).type == "msg")
    {
        getMessages("msg", message.innerHTML, author.innerHTML);
    }
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

function sendEmoji(emoji)
{
    var emojiList = ["&#x1F602;","&#x1F60D;","&#x1F621;","&#x1F622;","&#x1F639;","&#x1F64B;","&#x1F44C;","&#x1F483;"];
    var division = document.createElement("div");
    division.className = "chat-message self";
    var author = document.createElement("h4");
    author.innerHTML = localStorage.getItem("userNick");
    var message = document.createElement("p");
    message.innerHTML = emojiList[emoji];
    
    division.appendChild(author);
    division.appendChild(message);
    messages_container.appendChild(division);

    server.sendMessage({ type: "msg", msg: emojiList[emoji], userName: localStorage.getItem("userNick") + " #" + userID });

    getMessages("msg", emojiList[emoji], author.innerHTML);

    messages_container.scrollTop = messages_container.scrollHeight;
}

//Save all messages of the room in order to send them whenever a new user is connected
//Do not send private messages and messages about new users connected
var messagesList = [];
function getMessages(tipo, mensaje, nombre)
{
    messagesList.push({type: tipo, msg: mensaje, userName: nombre});
}