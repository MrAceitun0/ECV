var http = require('http');
var fs = require('fs');
var path = require('path');
var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;

function send404Response(response)
{
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Error 404: Page not found!");
    response.end();
}

function onRequest(request, response)
{
    if(request.method === 'GET' && request.url === '/')
    {
        response.writeHead(200, {"Context-Type": "text/html"});
        fs.createReadStream("./html/login.html").pipe(response);
    }
    else if(request.url.match('/room.html'))
    {
        response.writeHead(200, {"Context-Type": "text/html"});
        fs.createReadStream("./html/room.html").pipe(response);
    }
    else if(request.url.match("\.css$"))
    {
        response.writeHead(200, {"Context-Type": "text/css"});
        fs.createReadStream(path.join(__dirname, request.url)).pipe(response);
    }
    else if(request.url.match("\.png$"))
    {
        response.writeHead(200, {"Context-Type": "image/png"});
        fs.createReadStream(path.join(__dirname, request.url)).pipe(response);
    }
    else if(request.url.match("\.jpg$"))
    {
        response.writeHead(200, {"Context-Type": "image/jpg"});
        fs.createReadStream(path.join(__dirname, request.url)).pipe(response);
    }
    else if(request.url.match("\.js$"))
    {
        response.writeHead(200, {"Context-Type": "text/js"});
        fs.createReadStream(path.join(__dirname, request.url)).pipe(response);
    }
    else
    {
        send404Response(response);
    }
}
var clients;

var rooms;
var users;
var msg;
var msgInfo;
var last_id;

var server;
var wsServer;
var port;

function AS_Server()
{
    clients = [];

    rooms = []; //existing rooms
    users = []; //connected clients
    msg = []; //messages
    msgInfo = []; //info messages
    last_id = 1; //0 is reserved for server messages

    server = http.createServer(onRequest);

    wsServer = new WebSocketServer({ server: server });
    wsServer.on('connection', onConnect);
}

AS_Server.default_port = 9041;

AS_Server.prototype.listen = function(puerto)
{
    port = puerto || AS_Server.default_port;
    console.log('AS_Server listening in port ' + port + "...");
    server.listen(port);
};

function onConnect(request)
{
    /*request.user_id = last_id;
    request.user_name = "user_" + request.user_id;
    clients.push(request);*/

    console.log("[Server]: New user!");

    //Send Messages
    onMessage(request);

    //Disconnect
    disconnect(request);
}

function onMessage(request)
{
    request.onmessage = (function(event)
    {
        var data = event.data;
        data.userName = request.user_name;
        console.log(data);

        var dataParsed = JSON.parse(data);
        var dataType = dataParsed.type;

        if(dataType === "info")
        {
            //Get info for the new user
            typeInfo(request, dataParsed);

            //Send message of user connected to all users.
            userConnectedMessage(request, dataParsed);

            //Send all messages to new user
            sendMessagesToNewUser(request);

            //Send all users positions to a new user
            sendPositionToNewUser(request);

            //Send new user position to all users
            sendNewUserPosition(request);
        }
        else if(dataType === "position")
        {
            console.log("pos");
            sendPositionMessage(request, dataParsed);
        }
        else if(dataType === "private")
        {
            typePrivate(request, data, dataParsed);     //Send private message
        }
        else if(dataType === "msg")
        {
            typeMessage(request, data);
        }
    });
}

function disconnect(request)
{
    request.on('close', function(){
        console.log("[Server]: User with id: " + request.user_id + " has disconnected.");

        for(var i = 0; i < users.length; i++)
        {
            if(users[i].ID === request.user_id)
            {
                userDisconnectedMessage(request, users[i].Name);

                users.splice(i, 1);                     //Delete user from users
            }
        }
        clients.splice(clients.indexOf(request), 1);    //Delete user from clients
        console.log(users);
        /*if(users.length === 0)                          //If any user is connected, delete all messages
        {
            msg.splice(0, msg.length);
        }*/
    });
}

function sendMessagesToNewUser(request)
{
    if(msg.length > 0)
    {
        for(var j = 0; j < clients.length; j++)
        {
            if(clients[j].user_id === request.user_id)
            {
                for (var i = 0; i < msg.length; i++)
                {
                    var message = JSON.parse(msg[i]);
                    if(request.user_room === message.roomName)
                    {
                        clients[j].send(msg[i]);
                    }
                }
            }
        }
    }
}

function sendNewUserPosition(request)
{
    var new_data = {};
    var x;
    var y;
    var name;
    var room;
    var id;
    var color;

    for(var i = 0; i < clients.length; i++)
    {
        if(clients[i].user_id !== request.user_id)
        {
            x = request.posX;
            y = request.posY;
            name = request.user_name;
            room = request.user_room;
            id = request.user_id;
            color = request.skin;

            new_data = {type: "initial_position", userName: name, ID: id, roomName: room, posX: x, posY: y, skin: color};
            new_data = JSON.stringify(new_data);

            clients[i].send(new_data);
        }
    }
}

function sendPositionMessage(request, dataParsed)
{
    var new_data = {};
    var oldX;
    var oldY;
    var newX = dataParsed.X;
    var newY = dataParsed.Y;
    var name = dataParsed.userName;
    var room = dataParsed.roomName;
    var id;
    var color = dataParsed.skin;

    for(var i = 0; i < clients.length; i++)
    {
        if(request.user_id === clients[i].user_id)
        {
            oldX = clients[i].posX;
            oldY = clients[i].posY;
            id = request.user_id;

            new_data = {type: "position", userName: name, ID: id, roomName: room, oldPosX: oldX, oldPosY: oldY, newPosX: newX, newPosY: newY, skin: color};

            clients[i].posX = newX;
            clients[i].posY = newY;
        }
    }

    new_data = JSON.stringify(new_data);

    for(var j = 0; j < clients.length; j++)
    {
        if(request.user_id !== clients[j].user_id)
        {
            if(request.user_room === clients[j].user_room)
            {
                clients[j].send(new_data);
            }
        }
    }
}

function sendPositionToNewUser(request)
{
    var new_data = {};
    var x;
    var y;
    var name;
    var room;
    var id;
    var color;

    for(var i = 0; i < clients.length; i++)
    {
        if(clients[i].user_id === request.user_id)
        {
            for(var j = 0; j < clients.length; j++)
            {
                if(clients[j].user_id !== request.user_id)
                {
                    x = clients[j].posX;
                    y = clients[j].posY;
                    name = clients[j].user_name;
                    room = clients[j].user_room;
                    id = clients[j].user_id;
                    color = clients[j].skin;

                    new_data = {type: "initial_position", userName: name, ID: id, roomName: room, posX: x, posY: y, skin: color};
                    new_data = JSON.stringify(new_data);

                    clients[i].send(new_data);
                }
            }
        }
    }
}

function typeInfo(request, dataParsed)
{
    var id = last_id;
    var name = dataParsed.userName;
    var room = dataParsed.roomName;
    var x = dataParsed.X;
    var y = dataParsed.Y;
    var color = dataParsed.skin;

    request.user_id = id;
    request.user_name = name;
    request.user_room = room;

    request.posX = x;
    request.posY = y;
    request.skin = color;

    clients.push(request);
    users.push({Name: name, ID: id, Room: room, posX: x, posY: y, skin: color});

    last_id++;
}

function typeMessage(request, data)
{
    msg.push(data);
    for (var i = 0; i < clients.length; i++)
    {
        if (request.user_id !== clients[i].user_id)
        {
            if(request.user_room === clients[i].user_room)
            {
                clients[i].send(data);
            }
        }
    }
}

function typePrivate(request, data, dataParsed)
{
    var dest_id = parseInt(dataParsed.destID);

    for (var i = 0; i < clients.length; i++)
    {
        if(dest_id === clients[i].user_id)
        {
            if(request.user_room === clients[i].user_room)
            {
                console.log(data);
                clients[i].send(data);
            }
        }
    }
}

function userConnectedMessage(request, dataParsed)
{
    var message = {type: "new_user", userName: dataParsed.userName};

    for(var i = 0; i < clients.length; i++)
    {
        if(clients[i].user_id === request.user_id)
        {
            continue;
        }
        if(clients[i].user_room === request.user_room)
        {
            clients[i].send(JSON.stringify(message));
        }
    }
}

function userDisconnectedMessage(request, name)
{
    var message = {type: "user_disconnected", userName: name, ID: request.user_id};

    for(var i = 0; i < clients.length; i++)
    {
        if(clients[i].user_id === request.user_id)
        {
            continue;
        }
        if(clients[i].user_room === request.user_room)
        {
            clients[i].send(JSON.stringify(message));
            console.log(JSON.stringify(message));

        }
    }
}




module.exports.AS_Server = AS_Server;