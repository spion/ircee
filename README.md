# ircee 

_ircee_ is a tiny modular IRC library with a stream/event-emitter based API.

# Example

    var ircee = require('ircee'),
        net = require('net');

    var irc = ircee();

    // Load the core module. It keeps the connection alive
    // and provides the login method
    irc.load('core', require('ircee/core'));


    irc.on('connect', function() {
        // get the core module
        var core = irc.require('core');
        // use the login method to send the nickname
        core.login({
            nick: 'ircee_example',
            user: 'ircee_example',
            name: 'Look! I am online!'
        });
    });



