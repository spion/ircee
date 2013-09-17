var shoe = require('shoe');
var http = require('http');
var net = require('net');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    var f = req.url == '/bundle.js' ? 'bundle.js' : 'index.html';
    fs.createReadStream(__dirname + '/' + f).pipe(res);
});

var endpoint = shoe(function(stream) { 
    stream.pipe(net.connect(6667, 'irc.freenode.net')).pipe(stream); 
}); 

endpoint.install(server, '/irc');

server.listen(8080);


