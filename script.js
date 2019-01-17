var server = new SillyClient();
server.connect("ecv-esup.s.upf.edu:9000", "AFRO_GLOBAL");

server.on_connect = function () {
    console.log("Server connected");
};

var userID;
server.on_ready = function (id) {
    userID = id;
    console.log(id);
};

server.on_room_info = function (info) {
    console.log(info);
};

server.on_message = function (author_id, msg) {
        recieveMessage(author_id,msg);
}

/*
server.on_user_connected = function (user_id) {
    var element = document.createElement("p");
    element.innerHTML = "WELCOME "+user_id;
    //element.className = "chat-message";
    messages_container_self.appendChild(element);

    server.sendMessage({ type: "msg", msg: input.value });
    input.value = "";
}


server.on_user_disconnected = function (user_id) {
    var element = document.createElement("p");
    element.innerHTML = "BYE " + user_id;
    //element.className = "chat-message";
    messages_container_self.appendChild(element);

    server.sendMessage({ type: "msg", msg: input.value });
    input.value = "";
}
*/
var input = document.querySelector("textarea");
var button = document.querySelector("button");
var messages_container_self = document.getElementById("msgme");
var messages_container_friend = document.getElementById("msgfriend");

function sendMessage()
{
    var element = document.createElement("p");
    element.innerHTML = input.value;
    element.className = "chat-message";
    messages_container_self.appendChild(element);

    server.sendMessage({ type: "msg", msg: input.value });
    input.value = "";
}

function recieveMessage(author_id, text) {
    var element = document.createElement("p");
    element.innerHTML = JSON.parse(text).msg;
    element.className = "chat-message";
    messages_container_friend.appendChild(element);

    input.value = "";
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", onKey);
function onKey(e)
{
    if(e.which == 13)
    {
        sendMessage();
    }
}