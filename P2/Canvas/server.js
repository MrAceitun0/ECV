var WebSocketServer = require('websocket').server;
var http = require('http');

var port = 9041;

var history = [ ];
var clients = [];

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});

server.listen(port, function() {
    console.log((new Date()) + " Server is running on port " + port);
});

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    var userName = false;

    console.log((new Date()) + ' Connection accepted.');

    // send back chat history
    if (history.length > 0) {
      connection.sendUTF(
          JSON.stringify({ type: 'history', data: history} ));
    }

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'JSON') { // accept only text
        // first message sent by user is their name
         if (userName === false) {
            // remember user name
            userName = htmlEntities(message.utf8Data);
            // get random color and send it back to the user
            userColor = colors.shift();
            connection.sendUTF(
                JSON.stringify({ type:'color', data: userColor }));
            console.log((new Date()) + ' User is known as: ' + userName
                        + ' with ' + userColor + ' color.');
          } else { // log and broadcast the message
            console.log((new Date()) + ' Received Message from '
                        + userName + ': ' + message.utf8Data);

            // we want to keep history of all sent messages
            var obj = {
              time: (new Date()).getTime(),
              text: htmlEntities(message.utf8Data),
              author: userName,
              color: userColor
            };
            history.push(obj);
            history = history.slice(-100);
            // broadcast message to all connected clients
            var json = JSON.stringify({ type:'message', data: obj });
            for (var i=0; i < clients.length; i++) {
              clients[i].sendUTF(json);
            }
          }
        }
  });

  connection.on('close', function(connection) {
    // close user connection
  });
});