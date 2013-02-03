var ircee = require('ircee'),
    net = require('net');

// Create a client that uses
var irc = ircee();

irc.on('connect', function() {
    // Load the core module. It keeps the connection alive 
    // when loaded and provides the login method.    
    var core = irc.use(require('ircee/core'));
    // use the login method to send the nickname
    core.login({
        nick: 'ircee_example',
        user: 'ircee_example',
        name: 'Look! I am online!'
    });
});

// Log all protocol lines to stdout
irc.on('event', function(e) { console.log(e.raw); });

// Connect the actual socket and pipe it to the client
var s = net.connect(6667, 'irc.freenode.net');
s.pipe(irc).pipe(s);

