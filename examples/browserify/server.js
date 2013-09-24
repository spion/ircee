var shoe = require('shoe');
var http = require('http');
var net = require('net');
var fs = require('fs');
var url = require('url');
var connector = require('./connector');

var server = http.createServer(function(req, res) {
    var f = req.url == '/bundle.js' ? 'bundle.js' : 'index.html';
    fs.createReadStream(__dirname + '/' + f).pipe(res);
});

var endpoint = shoe(function(stream) { 
    var params = url.parse(stream.url);
    stream.pipe(connector()).pipe(stream); 
}); 

endpoint.install(server, '/irc');

server.listen(8080);


