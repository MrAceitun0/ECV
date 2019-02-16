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
    if(request.method == 'GET' && request.url == '/')
    {
        response.writeHead(200, {"Context-Type": "text/html"});
        fs.createReadStream("./html/login.html").pipe(response);
    }
    else if(request.url.match('/chat.html'))
    {
        response.writeHead(200, {"Context-Type": "text/html"});
        fs.createReadStream("./html/chat.html").pipe(response);
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
}

function onConnect(request)
{
    request.user_id = last_id;
    request.user_name = "user_" + request.user_id;
    clients.push(request);

    var id = last_id;
    var name = "";
    users.push({Name: name, ID: id});
    last_id++;

    console.log("[Server]: New user! -> Name: " + request.user_name + ", ID: " + request.user_id + ".");

    //Send all messages to new user
    sendMessagesToNewUser(request);

    //Disconnect
    request.on('close', function(){
        console.log("[Server]: User with id: " + request.user_id + " has disconnected.");
        for(var i = 0; i < users.length; i++)
        {
            //console.log(users[i]);
            if(users[i].ID === request.user_id)
            {
                users.splice(i, 1);                     //Delete user from users
            }
        }
        clients.splice(clients.indexOf(request), 1);    //Delete user from clients

        /*if(users.length === 0)
        {
            msg.splice(0, msg.length);                  //Delete all messages
        }*/
    });

    //Send Messages
    onMessage(request);

    //New User
    /*request.on('users', function(data){
        console.log("[Server]: New user");
        request.username = data;
        users.push({Name: request.username, ID: last_id});
        last_id++;
    });*/
}

function onMessage(request)
{
    request.onmessage = (function(event){
        var data = event.data;
        msg.push(data);
        for(var i = 0; i < clients.length; i++)
        {
            if(request.user_id !== clients[i].user_id)
            {
                clients[i].send(data);
            }
        }
    });
}

function sendMessagesToNewUser(request)
{
    if(msg.length > 0) {
        for (var i = 0; i < msg.length; i++)
        {
            clients[request.user_id - 1].send(msg[i]);
        }
    }
}

module.exports.AS_Server = AS_Server;