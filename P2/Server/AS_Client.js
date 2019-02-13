

function AS_Client()
{
    this.url = "";
    this.socket = null;
    this.is_connected = false;
    this.room = { name: "", clients: [], updated: false };
    this.clients = {};
    this.num_clients = 0;
    this.info_transmitted = 0;
    this.info_received = 0;

    this.feedback = false; //if you want message to bounce back to you

    this.user_id = 0;
    this.user_name = "anonymous";

    this.on_connect = null; //when connected
    this.on_ready = null; //when we have an ID from the server
    this.on_message = null; //when somebody sends a message
    this.on_close = null; //when the server closes
    this.on_user_connected = null; //new user connected
    this.on_user_disconnected = null; //user leaves
    this.on_error = null; //when cannot connect
}

AS_Client.prototype.connect = function (url, room_name, on_connect, on_message, on_close)
{
    room_name = room_name || "";
    var that = this;
    this.url = url;

    if (!url)
        throw ("You must specify the server URL of the AS_Server");

    if (this.socket)
    {
        this.socket.onmessage = null;
        this.socket.onclose = null;
        this.socket.close();
    }
    this.clients = {};

    if (typeof (WebSocket) == "undefined")
        WebSocket = window.MozWebSocket;
    if (typeof (WebSocket) == "undefined")
    {
        alert("Websockets not supported by your browser, consider switching to the latest version of Firefox, Chrome or Safari.");
        return;
    }

    var params = "";
    if (this.feedback)
        params = "?feedback=1";

    var protocol = "";
    if (url.substr(0, 3) != "ws:" && url.substr(0, 4) != "wss:")
        protocol = "ws://"; //default protocol

    var final_url = this._final_url = protocol + url + "/" + room_name + params;

    //connect
    this.socket = new WebSocket(final_url);
    this.socket.binaryType = "arraybuffer";

    this.socket.onopen = function ()
    {
        //that.room.name = room_name;

        that.is_connected = true;
        if (AS_Client.verbose)
            console.log("AS_Client socket opened");
        if (on_connect && typeof (on_connect) == "function")
            on_connect();
        if (that.on_connect)
            that.on_connect();
    }

    this.socket.onmessage = function (msg)
    {
        if (that.socket != this)
            return;

        that.info_received += 1;

        if (msg.data.constructor === ArrayBuffer) {
            var buffer = msg.data;
            processArrayBuffer(buffer);
        }
        else if (msg.data.constructor === String) {
            var tokens = msg.data.split("|"); //author id | cmd | data
            if (tokens.length < 3) {
                if (AS_Client.verbose)
                    console.log("Received: " + msg.data); //Awesome!
            }
            else
                that.onServerEvent(tokens[0], tokens[1], msg.data.substr(tokens[0].length + tokens[1].length + 2, msg.data.length), on_message);
        }
        else
            console.warn("Unknown message type");
    }

    return true;
}

AS_Client.prototype.onServerEvent = function (author_id, cmd, data, on_message) {
    if (cmd == "MSG" || cmd == "DATA") //user message received
    {
        if (on_message)
            on_message(author_id, data);
        if (this.on_message)
            this.on_message(author_id, data);
    }
    else if (cmd == "LOGIN") //new user entering
    {
        if (AS_Client.verbose)
            console.log("User connected: " + data);
        var name = "user_" + author_id.toString();
        if (!this.clients[author_id]) {
            this.clients[author_id] = { id: author_id, name: name };
            this.num_clients += 1;
        }
        if (author_id != this.user_id) {
            if (this.on_user_connected) //somebody else is connected
                this.on_user_connected(author_id, data);
        }
    }
    else if (cmd == "LOGOUT") //user leaving
    {
        if (this.clients[author_id]) {
            if (AS_Client.verbose)
                console.log("User disconnected: " + this.clients[author_id].name);
            delete this.clients[author_id];
            this.num_clients -= 1;
        }

        if (this.on_user_disconnected) //somebody else is connected
            this.on_user_disconnected(author_id);
        var pos = this.room.clients.indexOf(author_id);
        if (pos != -1)
            this.room.clients.splice(pos, 1);
    }
    else if (cmd == "ID") //retrieve your user id
    {
        this.user_id = author_id;
        this.user_name = "user_" + author_id.toString();
        this.clients[author_id] = { id: author_id, name: this.user_name };
        if (this.on_ready)
            this.on_ready(author_id);
    }
    else if (cmd == "INFO") //retrieve room info
    {
        var room_info = JSON.parse(data);
        this.room = room_info;
        this.num_clients = room_info.clients.length;
        for (var i = 0; i < room_info.clients.length; ++i) {
            var client_id = room_info.clients[i];
            this.clients[client_id] = { id: client_id, name: "user_" + client_id };
        }

        if (this.on_room_info)
            this.on_room_info(room_info);
    }
}

AS_Client.prototype.sendMessage = function (msg, target_ids) {
    if (msg === null)
        return;

    if (msg.constructor === Object)
        msg = JSON.stringify(msg);

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error("Not connected, cannot send info");
        return;
    }

    //pack target info
    if (target_ids) {
        var target_str = "@" + (target_ids.constructor === Array ? target_ids.join(",") : target_ids) + "|";
        if (msg.constructor === String)
            msg = target_str + msg;
        else
            throw ("targeted not supported in binary messages");
    }

    this.socket.send(msg);
    this.info_transmitted += 1;
}
