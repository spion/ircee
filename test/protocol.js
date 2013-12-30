var protocol = require('../lib/protocol.js');
var t = require('tape');

t.test('parse privmsg', function(t) {
    var res = protocol.parse(':nick!user@host PRIVMSG #channel :text goes here')
    t.deepEqual({ 
        raw: ':nick!user@host PRIVMSG #channel :text goes here',
        source: 'nick!user@host',
        cmd: 'PRIVMSG',
        user: { address: 'nick!user@host',
            nick: 'nick',
            user: 'user',
            host: 'host' 
        },
        params: [ '#channel' ],
        target: '#channel',
        text: 'text goes here' 
    }, res, 'protocol parse success'); 
    t.end();
});


t.test('just-command', function(t) {
    var res = protocol.parse('CMD')
    t.equal(res.cmd, 'CMD');
    t.end();
});

t.test('prefixed command', function(t) {
    var res = protocol.parse(':prefix CMD')
    t.equal(res.cmd, 'CMD');
    t.equal(res.source, 'prefix');
    t.end();
});

t.test('last argument', function(t) {
    var res = protocol.construct(['TOPIC','#channel','topic text']);
    var hasLast = res.split(':').length > 1;
    t.ok(hasLast);
    t.end();
});

t.test('no last argument', function(t) {
    var res = protocol.construct(['TOPIC','#channel','topic text', null]);
    var hasLast = res.split(':').length > 1;
    t.ok(!hasLast);
    t.end();
});

