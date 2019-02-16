var AS_Server = require('./AS_Server.js').AS_Server;

//var pos = process.argv.indexOf("-port");
//var port   = (pos != -1 && (process.argv.length > pos + 1) ? process.argv[pos+1] : 9041);

var asServer = new AS_Server(null);
asServer.listen(9041);