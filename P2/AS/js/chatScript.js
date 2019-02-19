var server = new WebSocket("ws://localhost:9041");
//server.connect("localhost:9041", "GLOBAL"/*localStorage.getItem("Room")*/);

var user = localStorage.getItem("userName");
var room = localStorage.getItem("Room");

server.onopen = function()
{
    server.send(JSON.stringify({type: "info", userName: user, roomName: room}));
};

/*
    Messages
*/
server.onmessage = function (msg)
{
    receiveMessage(msg);
};

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