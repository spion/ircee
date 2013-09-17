var ircee = require('ircee');
var shoe = require('shoe');

var irc = ircee(), 
    stream = shoe('/irc'); 
    
stream.pipe(irc).pipe(stream); 

irc.on('event', function(e) { 
    console.log("Received IRC event", e); 
});

irc.on('connect', function() { 
    var core = irc.use(require('ircee/core')); 
    core.login({nick: 'somenick', user: 'someuser', name: 'Some name'}); 
    irc.send('join', '#node.js', null);
});
