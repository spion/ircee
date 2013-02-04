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
    
    var modules = { exports: [], used: [] }
    self.use = function(f) {
        var moduleId = modules.used.indexOf(f);
        if (moduleId != -1) 
            return modules.exports[moduleId];
        var instance = f(self);
        modules.exports.push(instance);
        modules.used.push(f);
        return instance;
    }
    return self;
};

