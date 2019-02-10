var server = new AS_Client();
server.connect("ecv-etic.upf.edu:9000", "GLOBAL");

server.on_message = function (author, msg) {
    recieveMessage(0, msg);
}

var input = document.querySelector("textarea");
var sendButton = document.getElementById("sendButton");
var messages_container = document.getElementById("msgbox");

function sendMessage()
{
    var division = document.createElement("div");
    division.className = "chat-message self";
    var message = document.createElement("p");
    message.innerHTML = input.value;
    
    division.appendChild(message);
    messages_container.appendChild(division);


    server.sendMessage({type: "msg", msg: input.value});

    input.value = "";

    messages_container.scrollTop = messages_container.scrollHeight;
}

function recieveMessage(author_id, text) 
{
    var division = document.createElement("div");

    division.className = "chat-message friend";

    var message = document.createElement("p");
    message.innerHTML = JSON.parse(text).msg;

    division.appendChild(message);
    messages_container.appendChild(division);
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