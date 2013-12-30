var Stream = require('stream'),
    IRC = require('../index.js'),
    duplex = require('duplexer'),
    split = require('split');

var t = require('tape');


function fakeSocket() {
    return {i:split(), o: split() };
}

function client() {
    var irc = IRC();
    irc.on('connect', function() {
        irc.use(require('../core')).login({
            nick: 'test', user: 'test', name: 'test'
        });
    });
    return irc;
}

t.test('ping pong', function(t) {
   var irc = client(), s = fakeSocket();
   s.o.once('data', function(d) {
        t.ok(true, "nick and user data received");
        process.nextTick(function() {
            s.o.once('data', function(d) {
                t.equals(d, 'pong :test', 'receive pong');
                t.end();
            });
            s.i.emit('data', 'ping :test\n');
        });
    });
    s.i.pipe(irc).pipe(s.o);
    s.i.emit('connect');
});

t.test('reconnect', function(t) {
   var irc = client(), s = fakeSocket();
   s.o.once('data', function() {
       t.ok(true, "connect");
       s.i.end('432 :Error\n');
       s.i.destroy();
       var sx = fakeSocket();
       sx.o.once('data', function(d) {
           t.ok(true, "reconnect success");
           t.end();
       });
       sx.i.pipe(irc).pipe(sx.o);
   });    
   s.i.pipe(irc).pipe(s.o);
   s.i.emit('connect');
});

t.test('safe events', function(t) {

    var irc = client(), s = fakeSocket();
    irc.once('irc-close', function() {
        t.ok(true, 'received safe close event');
        t.end();
    });
    s.i.pipe(irc).pipe(s.o);
    s.i.emit('data', ':nick!user@host close #channel :some text\n');
    
});

