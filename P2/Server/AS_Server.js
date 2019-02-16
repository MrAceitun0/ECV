var http = require('http');
var fs = require('fs');
var path = require('path');
var WebSocketServer = require('websocket').server;

var url = require('url');
var qs = require('querystring');

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

var rooms;
var users;
var last_id;

var server;
var wsServer;
var port;

function AS_Server()
{
    rooms = {}; //existing rooms
    users = {}; //connected clients
    last_id = 1; //0 is reserved for server messages

    server = http.createServer(onRequest);

    wsServer = new WebSocketServer({ httpServer: server });
    wsServer.on('request', onConnect);
}

AS_Server.default_port = 9042;

AS_Server.prototype.listen = function(por)
{
    port = por || AS_Server.default_port;
    console.log('AS_Server listening in port ' + port + "....");
    server.listen(port);
}

function onConnect(request)
{
    var connection = request.accept(null, request.origin);
    var id = last_id++;

    connection.on('message', onMessage);
}

function onMessage(message)
{
    var msge = message.utf8Data;
    console.log(msge);
    console.log( "NEW MSG: " + message.utf8Data );
}

module.exports.AS_Server = AS_Server;
/*var asServer = new AS_Server(null);
asServer.listen(9041);*/