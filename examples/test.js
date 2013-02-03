var IRC = require('../index.js'),
    net = require('net');


var irc = IRC();
irc.load('core', require('../lib/core'));
irc.on('event', function(e) { console.log(e.raw); });

var s = net.connect(6667, 'irc.freenode.net');
s.pipe(irc).pipe(s);
