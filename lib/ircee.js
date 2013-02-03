var split = require('split'),
    Stream = require('stream'),
    duplex = require('duplexer'),
    protocol = require('./protocol');


module.exports = function(opt) {
    var out = new Stream(), inp = split();
    var self = duplex(inp, out);
    
    out.readable = true;

    self.send = function irc_send() {
        out.emit('data', protocol.construct(arguments));
        return self;
    }
    self.send.raw = out.emit.bind(out, 'data');

    self.on('pipe', function(src) {
        src.on('connect', function() {
            self.emit('connect', src)
        });
    });

    inp.on('data', function(line) {
        var data = protocol.parse(line);
        var evt = data.cmd.toLowerCase();
        if (~['data', 'drain', 'end', 'error', 'close', 'pipe'].indexOf(evt))
            evt = 'irc-' + data.cmd;
        self.emit('event', data);
        self.emit(evt, data);
    });
    
    var modules = {};
    self.use = function(f) {
        if (!f.ircee_loaded) 
            f.ircee_loaded = [];
        var loaded = f.ircee_loaded.filter(function(instance) {
            return instance.irc == self;
        });
        if (loaded.length) 
            return loaded[0].module;
        var instance = { 
            irc: self, 
            module: f(self) 
        };
        f.ircee_loaded.push(instance);
        return instance.module;
    }
    return self;
};

