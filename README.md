# ircee 

_ircee_ is a tiny modular IRC library with a stream/event-emitter based API.


### Why another library?

Most of the advantages come from the stream / eventemitter based API. It 
allows you to do things such as 

* Live code reloading - connect the network connection in the parent process, 
pipe it to the child process which loads the actual code. Signal the master
to kill and respawn the child process - the code will be reloaded without
losing the connection to the IRC server.

* Browserify / use on different transports - for example, use it through 
websockets in the browser by piping the connection streams using 
[shoe](https://npmjs.org/package/shoe)


# Example

```js
var ircee = require('ircee'),
    net = require('net');

// Create a client
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
```

# Modules

Modules are easy to write. Here is howthe core module looks like:

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

Using modules is easy. From your main program or from
any other module, simply call `irc.use` in the following ways:

```js
irc.use(module_function); 
irc.use(require('./path/to/module'));
```

You can also get the exported object:

```js
var module = irc.use(require('path/to/module'));
```

If the module has already been loaded it will simply be returned.

# Other methods

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

* `irc.on` etc - All standard eventemitter and duplex stream methods are 
  available.

# Events

Events are lower-case strings. Here are some common events:

* privmsg - all message events, including CTCP
* notice  - all notice events, including CTCP replies.
* __number__ - all numeric events
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

MIT

