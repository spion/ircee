var Stream = require('stream'),
    IRC = require('../index.js');


function fakeSocket() {
    var r = new Stream();
    r.readable = true;
    return r;
}

exports.ping_pong = function(t) {
    var irc = IRC(),
        s = fakeSocket();

    irc.load('core', require('../lib/core'));

    t.expect(2);
    irc.once('data', function(d) {
        t.ok(true, "nick and user data received");
        process.nextTick(function() {
            irc.once('data', function(d) {
                t.equals(d, 'pong :test\n', 'receive pong');
                t.done();
            });
            s.emit('data', 'ping :test\n');
        });
    });
    s.pipe(irc).pipe(s);
    s.emit('connect');
}
