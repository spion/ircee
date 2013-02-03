# ircee 

_ircee_ is a tiny modular IRC library with a stream/event-emitter based API.

# Example

```js
var ircee = require('ircee'),
    net = require('net');

// Create a client that uses the core module. This module
// will keep the connection alive when loaded and provide 
// the login method.
var irc = ircee()
    .uses('core', require('ircee/core'));

irc.on('connect', function() {
    // load the core module
    var core = irc.require('core');
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
```

# Modules

Modules are easy to write. Here is how
the core module looks like:

```js
module.exports = function(irc) {
    irc.on('ping', function(e) {
        irc.send('pong', e.text);
    });
    var self = {};
    self.login = function login(params) {
        irc.send('nick', params.nick);
        irc.send('user', params.user, 0, '*', params.name);
    }
    return self;
}
```

The module should be a function that receives the irc client
as its argument. It should return the object to be exported.

### Using modules

Using modules is slightly trickier. Your main program specifies
which modules are going to be used with `irc.uses(name, require(path))` 
But to actually load and run the module functions you need to call 
`irc.require('name')` - otherwise the module function will not be executed.

# Methods

The methods shown in the examples are all the available methods:

* `irc.send` - sends a command to the server. The first parameter is a
  command string, while the rest are the command parameters. As per usual
  in the IRC protocol, the final parameter is allowed to have multiple words. 
  For example:

      ```js
      irc.send('privmsg', '#channel', 'Text to send');
      irc.send('privmsg', 'nickname', 'Some text');
      irc.send('mode', '#channel', '+ov', 'nick1', 'nick2', null);
      irc.send('topic', '#channel', 'New topic text');
      ```

  Notice that the mode command does not use a multi-word parameter and therefore
  we must add a null argument when calling irc.send

* `irc.uses` - Register a module. Note that this doesn't actually load the 
  module, only tells ircee what the module function is.

* `irc.require` - Returns a named module. If the module is not loaded,
  it will be loaded and attached when required the first time.

* `irc.on` etc - All eventemitter and duplex stream methods are available.

# Events

Events are lower-case strings. Here are some common events:

* privmsg - all message events, including CTCP
* notice  - all notice events, including CTCP replies.
* <number> - all numeric events
* event - catchall for all IRC events.

Standard socket and stream events are also available
* connect - socket connection event
* close - socket closing event.
* data - raw data, line by line


### Event objects

IRC events receive a single argument - the event object. It has the following
properties:

* raw - the full raw event text
* source - the event source (e.g. nick!user@host)
* cmd - the command, e.g. PRIVMSG
* user - the source user (null if N/A)
  * address - nick!user@hostmask
  * nick - users nickname 
  * user - users username (ident)
  * host - user's host, hostmask or IP
* params: list of command parameters
* target: event target (nickname or channel)
* text: event text (e.g. message contents)

# License: 

BSD
